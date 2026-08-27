import { ChatApiResponse } from '../types';
import { BIS_KNOWLEDGE_BASE } from '../data/bisKnowledgeBase';
import {
  searchKnowledgeBase,
  formatCitations,
  generateLocalFallbackResponse,
  requiresLegalDisclaimer
} from '../utils/retrievalEngine';

/**
 * Sends a query to the backend API or falls back to local client-side
 * grounded retrieval if the server is unreachable (e.g. network hiccup or offline).
 */
export async function sendChatMessage(
  message: string,
  language: string = 'English'
): Promise<ChatApiResponse> {
  const trimmed = message.trim();
  if (!trimmed) {
    throw new Error('Message cannot be empty.');
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 18000);

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        message: trimmed,
        language,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data: ChatApiResponse = await response.json();
      return data;
    }

    console.warn(`Backend returned status ${response.status}. Using client-side grounded retrieval engine.`);
  } catch (err: any) {
    console.warn('Network or server unreachable for /api/chat. Falling back to local client retrieval:', err?.message || err);
  }

  // Graceful client-side grounded retrieval fallback
  const needsDisclaimer = requiresLegalDisclaimer(trimmed);
  const { results, detectedIS, tokens, isOffTopic } = searchKnowledgeBase(trimmed, BIS_KNOWLEDGE_BASE, 4);

  if (isOffTopic && results.length === 0) {
    return {
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
  }

  const fallback = generateLocalFallbackResponse(trimmed, results, isOffTopic);

  return {
    answer: fallback.answer,
    citations: fallback.citations,
    confidence: fallback.confidence,
    requiresLegalDisclaimer: needsDisclaimer,
    modelUsed: 'local-retrieval-engine (Client-Side Grounded)',
    isFallback: true,
    retrievedCount: results.length,
    debugInfo: {
      queryTokens: tokens,
      detectedIsNumbers: detectedIS,
      topMatchScores: results.map(r => ({ id: r.record.id, title: r.record.title, score: r.score }))
    }
  };
}

/**
 * Checks server health and Gemini API key configuration
 */
export async function checkServerHealth(): Promise<{ hasApiKey: boolean; isOnline: boolean }> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch('/api/health', { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      return {
        hasApiKey: Boolean(data.hasApiKey),
        isOnline: true,
      };
    }
  } catch (err) {
    console.warn('Server health check skipped:', err);
  }

  return {
    hasApiKey: false,
    isOnline: false,
  };
}
