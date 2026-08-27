import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { BIS_KNOWLEDGE_BASE } from './src/data/bisKnowledgeBase';
import {
  searchKnowledgeBase,
  formatCitations,
  generateLocalFallbackResponse,
  requiresLegalDisclaimer
} from './src/utils/retrievalEngine';
import { ChatApiResponse } from './src/types';

const PORT = 3000;

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  // Enable CORS headers for preview iframe & API requests
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(204);
    }
    next();
  });

  // Initialize Gemini AI client lazily
  let aiClient: GoogleGenAI | null = null;
  function getGenAI(): GoogleGenAI | null {
    if (!process.env.GEMINI_API_KEY) {
      return null;
    }
    if (!aiClient) {
      aiClient = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
    }
    return aiClient;
  }

  // --- API Endpoints ---

  // Health check
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      status: 'ok',
      hasApiKey: Boolean(process.env.GEMINI_API_KEY),
      knowledgeBaseSize: BIS_KNOWLEDGE_BASE.length,
      timestamp: Date.now()
    });
  });

  // Get full knowledge base records for standard explorer catalog
  app.get('/api/knowledge', (req: Request, res: Response) => {
    const { topic, q } = req.query;
    let records = BIS_KNOWLEDGE_BASE;

    if (typeof topic === 'string' && topic !== 'All') {
      records = records.filter(r => r.topic === topic);
    }

    if (typeof q === 'string' && q.trim().length > 0) {
      const searchRes = searchKnowledgeBase(q, records, 20);
      records = searchRes.results.map(r => r.record);
    }

    res.json({
      total: records.length,
      records
    });
  });

  // Chat endpoint
  app.post('/api/chat', async (req: Request, res: Response) => {
    try {
      const { message, language = 'English' } = req.body;

      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: 'Message text is required.' });
      }

      const trimmedMessage = message.trim();
      if (trimmedMessage.length === 0) {
        return res.status(400).json({ error: 'Question cannot be empty.' });
      }

      if (trimmedMessage.length > 1500) {
        return res.status(400).json({ error: 'Question is too long (maximum 1500 characters).' });
      }

      const needsLegalDisclaimer = requiresLegalDisclaimer(trimmedMessage);

      // Perform local grounded retrieval
      const { results, detectedIS, tokens, isOffTopic } = searchKnowledgeBase(trimmedMessage, BIS_KNOWLEDGE_BASE, 4);

      const citations = formatCitations(results.map(r => r.record));
      const ai = getGenAI();

      // If off-topic query (e.g., cricket, movie, general chit-chat unrelated to standards)
      if (isOffTopic && results.length === 0) {
        const offTopicResponse: ChatApiResponse = {
          answer: `**BIS Sahayak AI** is specialized exclusively for Indian Standards, BIS certification schemes, testing laboratories, and related compliance queries.\n\n` +
            `I cannot answer questions about general topics unrelated to BIS. Please ask me about:\n` +
            `• Searching Indian Standards (e.g., *IS 10500 for drinking water*, *IS 1786 for steel*)\n` +
            `• How to get an ISI mark or CRS registration\n` +
            `• Toy safety, Helmet standards, or Gold hallmarking (HUID)\n` +
            `• Finding a BIS testing laboratory`,
          citations: [],
          confidence: 'none',
          requiresLegalDisclaimer: false,
          modelUsed: 'rule-based-filter',
          isFallback: false,
          retrievedCount: 0,
          debugInfo: {
            queryTokens: tokens,
            detectedIsNumbers: detectedIS,
            topMatchScores: []
          }
        };
        return res.json(offTopicResponse);
      }

      // If no API key or if retrieval results are empty, use fallback response
      if (!ai) {
        const fallback = generateLocalFallbackResponse(trimmedMessage, results, isOffTopic);
        const responseData: ChatApiResponse = {
          answer: fallback.answer,
          citations: fallback.citations,
          confidence: fallback.confidence,
          requiresLegalDisclaimer: needsLegalDisclaimer,
          modelUsed: 'local-retrieval-engine',
          isFallback: true,
          retrievedCount: results.length,
          debugInfo: {
            queryTokens: tokens,
            detectedIsNumbers: detectedIS,
            topMatchScores: results.map(r => ({ id: r.record.id, title: r.record.title, score: r.score }))
          }
        };
        return res.json(responseData);
      }

      // Prepare grounded context for Gemini
      const contextBlocks = results.map((r, index) => {
        const doc = r.record;
        return `[SOURCE ${index + 1}]
Citation Label: [${doc.citationLabel}]
Title: ${doc.title}
${doc.isNumber ? `IS Number: ${doc.isNumber}` : ''}
Sector/Category: ${doc.category || doc.topic}
Certification Scheme: ${doc.certificationScheme || doc.scheme || 'N/A'}
Mandatory QCO: ${doc.mandatoryQCO ? 'Yes' : 'No'}
Scope & Summary: ${doc.scopeAndSummary || doc.content}
Official URL: ${doc.officialPortalUrl || doc.sourceUrl}
Last Verified: ${doc.lastVerified}
Testing & Lab Requirements: ${doc.testingAndLabRequirements || 'Refer to BIS Recognized Laboratories.'}
Key Highlights:
${doc.keyHighlights.map(h => `- ${h}`).join('\n')}`;
      }).join('\n\n---\n\n');

      let languageName = 'English';
      if (language === 'te' || language === 'Telugu' || language === 'తెలుగు') {
        languageName = 'Telugu (తెలుగు)';
      } else if (language === 'hi' || language === 'Hindi' || language === 'हिन्दी') {
        languageName = 'Hindi (हिन्दी)';
      }

      const isChecklistRequest = trimmedMessage.toLowerCase().includes('checklist') || 
        trimmedMessage.toLowerCase().includes('roadmap') || 
        trimmedMessage.toLowerCase().includes('steps to comply') ||
        trimmedMessage.includes('చెక్‌లిస్ట్') ||
        trimmedMessage.includes('चेकलिस्ट');

      const systemPrompt = `You are "BIS Sahayak AI", a precise, helpful, and document-grounded AI assistant for Indian Standards and Bureau of Indian Standards (BIS) services.

STRICT GROUNDING DIRECTIVES:
1. GROUNDED FACTUALITY: You must answer the user's question STRICTLY based on the provided VERIFIED BIS SOURCE RECORDS below. Use ONLY the provided BIS context chunks to answer.
2. OUT-OF-CONTEXT RULE: If the context does not contain the answer or no matching sources exist, explicitly say: "I could not find official information on this in the current BIS database" and provide the official portal link (https://www.bis.gov.in or https://www.manakonline.in).
3. CITATION LABELS: Whenever you cite a standard or rule, mention the specific citation label (e.g. [IS 14543:2024], [BIS-KYS-GUIDE]) so the user can verify it.
4. ZERO HALLUCINATION: Never guess or invent Indian Standard numbers, chemical thresholds, fee structures, processing dates, lab addresses, or legal mandates not contained in the sources.
5. MULTILINGUAL OUTPUT: The user has selected the language: ${languageName}. Provide your grounded response fluently in ${languageName} while preserving all standard numbers (e.g., IS 14543:2024, IS 1786), form numbers (e.g., Form V, Test Request), portal domains (e.g., manakonline.in, crsbis.in), and official URLs verbatim.
${isChecklistRequest ? `
6. COMPLIANCE CHECKLIST FORMAT: The user requested a Compliance Checklist. You MUST structure the response as a clear 4-stage actionable checklist with markdown checkboxes:
   ### 📋 BIS Compliance Checklist & Roadmap
   **Standard Code & Product:** [Cite standard and product]
   **Applicable Scheme:** [Scheme-I ISI Mark / CRS / Hallmarking]

   #### ▢ Stage 1: Application & Documentation
   - [ ] Step 1.1: Register and submit online application via www.manakonline.in (or www.crsbis.in for electronics).
   - [ ] Step 1.2: Prepare manufacturing unit layout, machinery list, and calibration certificates.

   #### ▢ Stage 2: In-House & Laboratory Testing
   - [ ] Step 2.1: Establish required in-house testing equipment according to the Scheme of Testing & Inspection (STI).
   - [ ] Step 2.2: Send samples for independent testing to a BIS-Recognized / LRS accredited laboratory.

   #### ▢ Stage 3: Factory Inspection & Quality Control
   - [ ] Step 3.1: Facilitate factory audit by BIS Technical Officer to verify manufacturing process and testing records.
   - [ ] Step 3.2: Verification of quality assurance personnel and test registers.

   #### ▢ Stage 4: Grant of License (CM/L) & Marking Schedule
   - [ ] Step 4.1: Pay statutory marking fees and obtain Certification of Manufacturing License (CM/L number).
   - [ ] Step 4.2: Affix standard ISI mark with valid CML number on product packaging.

   ### **Verified Official Reference**
   (Citation label, standard title, and official portal URL)
` : `
6. REQUIRED RESPONSE STRUCTURE: Unless a checklist is requested, always structure your response clearly using these sections:
   ### **1. Direct Answer**
   (Clear, concise explanation in ${languageName})

   ### **2. Key Compliance & Standard Details**
   (List the exact IS number, certification scheme e.g. Scheme-I ISI Mark or CRS, mandatory QCO status, and key parameters)

   ### **3. Next Actionable Steps (Where to Apply & Test)**
   (Testing laboratory requirements and link to apply on www.manakonline.in or www.crsbis.in)

   ### **4. Verified Official Reference**
   (Citation label, standard title, and official link)
`}
7. LEGAL BOUNDARY: Remind users that this is educational guidance and they must verify current requirements on official BIS portals (www.bis.gov.in).`;

      const userPrompt = `User Question: "${trimmedMessage}"

${results.length > 0 ? `VERIFIED BIS SOURCE RECORDS:\n${contextBlocks}` : 'NO MATCHING SOURCES FOUND IN KNOWLEDGE BASE.'}

Please provide a grounded response following the mandatory 4-section structure. If no matching sources exist in the provided records, say "I could not find official information on this in the current BIS database" and guide them to www.bis.gov.in.`;

      // Resilient Multi-Model Generation with Backoff & Local Fallback
      try {
        let generatedText: string | null = null;
        let modelTag = 'BIS Sahayak AI (Grounded Engine)';
        const modelsToTry = ['gemini-3.7-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest'];

        let lastModelError: any = null;
        for (const modelName of modelsToTry) {
          try {
            const genResponse = await ai.models.generateContent({
              model: modelName,
              contents: userPrompt,
              config: {
                systemInstruction: systemPrompt,
                temperature: 0.2, // Low temperature for high factual precision
              },
            });

            if (genResponse.text && genResponse.text.trim().length > 0) {
              generatedText = genResponse.text;
              modelTag = `BIS Sahayak AI (${modelName})`;
              break;
            }
          } catch (modelErr: any) {
            lastModelError = modelErr;
            const errMsg = String(modelErr?.message || modelErr);
            console.warn(`Model ${modelName} attempt error: ${errMsg.slice(0, 140)}`);
            // Brief pause before attempting fallback model
            await new Promise(r => setTimeout(r, 250));
          }
        }

        if (!generatedText) {
          throw lastModelError || new Error('All AI models unavailable');
        }

        const responseData: ChatApiResponse = {
          answer: generatedText,
          citations,
          confidence: results.length > 0 ? (results[0].score >= 35 ? 'high' : 'medium') : 'none',
          requiresLegalDisclaimer: needsLegalDisclaimer,
          modelUsed: modelTag,
          isFallback: false,
          retrievedCount: results.length,
          debugInfo: {
            queryTokens: tokens,
            detectedIsNumbers: detectedIS,
            topMatchScores: results.map(r => ({ id: r.record.id, title: r.record.title, score: r.score }))
          }
        };

        return res.json(responseData);
      } catch (genError: any) {
        console.warn('AI generation service transient error, activated verified local retrieval fallback:', genError?.message || genError);
        // Seamless fallback to deterministic local retrieval engine
        const fallback = generateLocalFallbackResponse(trimmedMessage, results, isOffTopic);
        const responseData: ChatApiResponse = {
          answer: fallback.answer,
          citations: fallback.citations,
          confidence: fallback.confidence,
          requiresLegalDisclaimer: needsLegalDisclaimer,
          modelUsed: 'BIS Sahayak AI (Verified Local Grounded Engine)',
          isFallback: true,
          retrievedCount: results.length,
          debugInfo: {
            queryTokens: tokens,
            detectedIsNumbers: detectedIS,
            topMatchScores: results.map(r => ({ id: r.record.id, title: r.record.title, score: r.score }))
          }
        };
        return res.json(responseData);
      }
    } catch (err: any) {
      console.error('Server error in /api/chat:', err);
      res.status(500).json({
        error: 'An internal error occurred while processing your request.',
        details: err?.message || 'Unknown error'
      });
    }
  });

  // Vite middleware for development vs static serving in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`BIS Sahayak AI Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
