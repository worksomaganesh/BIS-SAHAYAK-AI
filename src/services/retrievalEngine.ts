import { KnowledgeRecord, RetrievalResult, ChatCitation, ConfidenceLevel } from '../types';
import { BIS_KNOWLEDGE_BASE } from '../data/bisKnowledgeBase';

const STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'as', 'at',
  'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by', 'could', 'did',
  'do', 'does', 'doing', 'down', 'during', 'each', 'few', 'for', 'from', 'further', 'had', 'has', 'have',
  'having', 'he', 'her', 'here', 'hers', 'herself', 'him', 'himself', 'his', 'how', 'i', 'if', 'in', 'into',
  'is', 'it', 'its', 'itself', 'just', 'me', 'more', 'most', 'my', 'myself', 'no', 'nor', 'not', 'now', 'of',
  'off', 'on', 'once', 'only', 'or', 'other', 'our', 'ours', 'ourselves', 'out', 'over', 'own', 'same', 'she',
  'should', 'so', 'some', 'such', 'than', 'that', 'the', 'their', 'theirs', 'them', 'themselves', 'then',
  'there', 'these', 'they', 'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was',
  'we', 'were', 'what', 'when', 'where', 'which', 'while', 'who', 'whom', 'why', 'with', 'would', 'you',
  'your', 'yours', 'yourself', 'yourselves', 'tell', 'want', 'know', 'give', 'can', 'please', 'details',
  'find', 'get', 'check', 'show', 'search', 'provide', 'me'
]);

/**
 * Extracts cleaned search tokens from input text.
 */
export function extractTokens(query: string): string[] {
  return query
    .toLowerCase()
    .replace(/[^\w\s-]/g, ' ')
    .split(/\s+/)
    .map(t => t.trim())
    .filter(t => t.length > 1 && !STOP_WORDS.has(t));
}

/**
 * Robust extractor for Indian Standard numbers from query.
 * Matches: IS 14543, IS:10500, IS-269, IS1786, or standalone 3-5 digit standard numbers.
 */
export function extractISNumbers(query: string): string[] {
  const matches: string[] = [];
  
  // Explicit "IS [number]" patterns
  const isRegex = /\b(?:is|is:|\bis\s*|\bis-)(\d{3,5})\b/gi;
  let match;
  while ((match = isRegex.exec(query)) !== null) {
    if (match[1] && !matches.includes(match[1])) {
      matches.push(match[1]);
    }
  }

  // Standalone recognized standard numbers
  const knownNumbers = [
    '14543', '10500', '13428', '1786', '269', '1489', '13252',
    '9873', '1417', '4151', '1293', '15844', '4984', '302', '15644', '15298'
  ];

  for (const num of knownNumbers) {
    const numRegex = new RegExp(`\\b${num}\\b`, 'i');
    if (numRegex.test(query) && !matches.includes(num)) {
      matches.push(num);
    }
  }

  return matches;
}

/**
 * Detects if a query involves legal, penal, or official fee determinations that require explicit notices.
 */
export function requiresLegalDisclaimer(query: string): boolean {
  const q = query.toLowerCase();
  const advisoryTriggers = [
    'fee', 'fees', 'cost', 'charge', 'price', 'rate', 'rupees', 'rs.',
    'legal', 'court', 'penalty', 'fine', 'jail', 'lawyer', 'prosecution',
    'approved', 'approval', 'guarantee', 'licence status', 'grant license',
    'my application', 'eligible', 'deadline', 'mandatory date'
  ];
  return advisoryTriggers.some(trigger => q.includes(trigger));
}

/**
 * High-precision In-Memory Keyword & Token Matching Retrieval Engine.
 * - Prioritizes exact IS numbers (Score +60)
 * - Exact product phrases & keywords (Score +30-40)
 * - Category / Sector matches (Score +15)
 * - Returns top 1 to 3 most relevant source chunks.
 */
export function searchKnowledgeBase(
  query: string,
  records: KnowledgeRecord[] = BIS_KNOWLEDGE_BASE,
  limit: number = 3
): { results: RetrievalResult[]; detectedIS: string[]; tokens: string[]; isOffTopic: boolean } {
  const tokens = extractTokens(query);
  const detectedIS = extractISNumbers(query);
  const normalizedQuery = query.toLowerCase().trim();

  // If query is completely empty
  if (tokens.length === 0 && detectedIS.length === 0) {
    return { results: [], detectedIS: [], tokens: [], isOffTopic: false };
  }

  const scoredResults: RetrievalResult[] = records.map(record => {
    let score = 0;
    const matchReasons: string[] = [];

    // 1. IS Number Match (Highest Priority)
    if (detectedIS.length > 0 && (record.isNumber || record.id)) {
      for (const isNum of detectedIS) {
        if (
          (record.isNumber && record.isNumber.includes(isNum)) ||
          record.id.includes(isNum) ||
          record.citationLabel.includes(isNum)
        ) {
          score += 70;
          matchReasons.push(`Exact IS Number Match (${isNum})`);
        }
      }
    }

    // 2. Direct Title Match
    const titleLower = record.title.toLowerCase();
    if (normalizedQuery.length > 3 && titleLower.includes(normalizedQuery)) {
      score += 40;
      matchReasons.push('Direct Title Match');
    }

    // 3. Product Keywords Matching
    for (const kw of record.productKeywords) {
      const kwLower = kw.toLowerCase();
      if (normalizedQuery.includes(kwLower)) {
        score += 30;
        matchReasons.push(`Matched Product Keyword: "${kw}"`);
      } else {
        const kwTokens = kwLower.split(/\s+/).filter(t => !STOP_WORDS.has(t));
        const matchingTokens = kwTokens.filter(t => tokens.includes(t));
        if (kwTokens.length > 0 && matchingTokens.length === kwTokens.length) {
          score += 24;
          matchReasons.push(`Full Keyword Concept: "${kw}"`);
        } else if (matchingTokens.length > 0) {
          score += matchingTokens.length * 5;
        }
      }
    }

    // 4. Token Overlap across Title, Highlights, Scope, and Content
    tokens.forEach(token => {
      if (titleLower.includes(token)) {
        score += 8;
      }
      if (record.category && record.category.toLowerCase().includes(token)) {
        score += 6;
      }
      if (record.keyHighlights && record.keyHighlights.some(h => h.toLowerCase().includes(token))) {
        score += 5;
      }
      if (record.scopeAndSummary && record.scopeAndSummary.toLowerCase().includes(token)) {
        score += 4;
      }
      if (record.content.toLowerCase().includes(token)) {
        score += 2;
      }
    });

    // 5. Topic / Sector Relevance
    if (tokens.some(t => record.topic.toLowerCase().includes(t))) {
      score += 6;
      matchReasons.push(`Topic Relevance: ${record.topic}`);
    }

    return {
      record,
      score,
      matchReasons: Array.from(new Set(matchReasons))
    };
  });

  // Filter out weak / unrelated records (threshold > 10)
  const relevantResults = scoredResults
    .filter(r => r.score >= 10)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  // Detect out-of-domain / off-topic queries:
  // If user entered multiple words (>= 2) but zero records matched or highest score < 10
  const isOffTopic = tokens.length >= 2 && relevantResults.length === 0;

  return {
    results: relevantResults,
    detectedIS,
    tokens,
    isOffTopic
  };
}

/**
 * Formats knowledge base records into standardized client citations.
 */
export function formatCitations(records: KnowledgeRecord[]): ChatCitation[] {
  return records.map(r => ({
    id: r.id,
    title: r.title,
    citationLabel: r.citationLabel,
    sourceUrl: r.officialPortalUrl || r.sourceUrl,
    sourceType: r.sourceType,
    lastVerified: r.lastVerified,
    topic: r.category || r.topic,
    isNumber: r.isNumber,
    excerpt: r.scopeAndSummary || r.keyHighlights[0] || r.content.slice(0, 140) + '...'
  }));
}

/**
 * Structured Grounded Response Generator for Deterministic Fallback & Local Inference.
 * Produces clean 4-part structured output:
 * 1. Direct Answer (Plain English)
 * 2. Key Compliance / Standard Details
 * 3. Next Actionable Steps (Where to apply / test)
 * 4. Source Citation Cards (Title, IS Number, and Link)
 */
export function generateLocalFallbackResponse(
  query: string,
  retrievedResults: RetrievalResult[],
  isOffTopic: boolean
): { answer: string; confidence: ConfidenceLevel; citations: ChatCitation[] } {
  if (isOffTopic || retrievedResults.length === 0) {
    return {
      answer: `### **Direct Answer**\n` +
        `I could not find official information on this in the current BIS database.\n\n` +
        `### **What You Can Do**\n` +
        `• **Search by Indian Standard Number:** Enter standard numbers like \`IS 14543\` (Packaged Drinking Water), \`IS 10500\` (Tap Water), \`IS 269\` (Cement), \`IS 1786\` (Steel Bars), \`IS 9873\` (Toys), or \`IS 1417\` (Gold Hallmarking).\n` +
        `• **Search by Product Keyword:** Search for items such as *drinking water*, *cement*, *helmets*, *footwear*, *electrical plugs*, *toys*, or *gold purity*.\n` +
        `• **Search the Official BIS Portals:** Check the official BIS digital repository on [www.bis.gov.in](https://www.bis.gov.in) or the Manakonline portal on [www.manakonline.in](https://www.manakonline.in).\n\n` +
        `*Note: As a source-grounded assistant, BIS Sahayak AI does not fabricate clauses, test values, or standard specifications when verified records are not available.*`,
      confidence: 'none',
      citations: []
    };
  }

  const primary = retrievedResults[0].record;
  const citations = formatCitations(retrievedResults.map(r => r.record));

  let output = `### **1. Direct Answer**\n`;
  output += `${primary.scopeAndSummary || primary.content}\n\n`;

  output += `### **2. Key Compliance & Standard Details**\n`;
  if (primary.isNumber) {
    output += `• **Standard Identifier:** \`${primary.isNumber}\` — *${primary.title}*\n`;
  }
  if (primary.category) {
    output += `• **Sector / Division:** ${primary.category}\n`;
  }
  if (primary.certificationScheme || primary.scheme) {
    output += `• **Certification Scheme:** ${primary.certificationScheme || primary.scheme}\n`;
  }
  if (primary.mandatoryQCO !== undefined) {
    output += `• **Mandatory Quality Control Order (QCO):** ${primary.mandatoryQCO ? 'Yes — Mandatory BIS Certification required prior to manufacture, import, or sale in India.' : 'Voluntary / General Reference Specification.'}\n`;
  }

  if (primary.keyHighlights && primary.keyHighlights.length > 0) {
    output += `\n**Key Requirements:**\n`;
    primary.keyHighlights.slice(0, 4).forEach(h => {
      output += `• ${h}\n`;
    });
  }

  output += `\n### **3. Next Actionable Steps (Where to Apply & Test)**\n`;
  if (primary.testingAndLabRequirements) {
    output += `• **Testing & Laboratory Requirements:** ${primary.testingAndLabRequirements}\n`;
  }
  output += `• **Official Portal Submission:** Apply online on the official Manakonline e-BIS portal at [www.manakonline.in](https://www.manakonline.in) (or [crsbis.in](https://www.crsbis.in) for electronics).\n`;
  output += `• **Laboratory Directory:** Locate approved testing laboratories under the Laboratory Recognition Scheme (LRS) on [bis.gov.in/laboratory-overview](https://www.bis.gov.in/laboratory-overview/).\n\n`;

  output += `### **4. Verified Official Reference**\n`;
  output += `• **[${primary.citationLabel}]** ${primary.title} (Official Link: [${primary.officialPortalUrl || primary.sourceUrl}](${primary.officialPortalUrl || primary.sourceUrl})) — Verified: ${primary.lastVerified}`;

  const confidence: ConfidenceLevel = retrievedResults[0].score >= 35 ? 'high' : 'medium';

  return {
    answer: output,
    confidence,
    citations
  };
}
