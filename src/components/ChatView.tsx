import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChatMessage, ChatCitation, ConfidenceLevel } from '../types';
import { ComplianceRoadmapCard } from './ComplianceRoadmapCard';
import { ComplianceDossierModal } from './ComplianceDossierModal';
import { ComplianceDossierData, generateDossierFromChatMessage } from '../utils/dossierGenerator';
import { useLanguage } from '../context/LanguageContext';
import { useSpeechToText } from '../hooks/useSpeechToText';

interface ChatViewProps {
  messages: ChatMessage[];
  isLoading: boolean;
  onSendMessage: (query: string) => void;
  onClearChat: () => void;
  onSelectStandardPrompt: (prompt: string) => void;
  hasApiKey: boolean;
  onBackToWelcome?: () => void;
}

const SUGGESTED_QUESTIONS = [
  'How do I search for an Indian Standard on Manakonline?',
  'What are the mandatory parameters for Packaged Drinking Water under IS 14543?',
  'How does the 6-digit HUID gold hallmarking verification work under IS 1417?',
  'What is the toy safety Quality Control Order under IS 9873?',
  'What is the difference between Scheme-I (ISI Mark) and CRS (Compulsory Registration)?',
  'Where are the BIS regional and central testing laboratories located?',
];

const POPULAR_STANDARDS_SHORTCUTS = [
  { label: 'IS 14543: Water', prompt: 'What are the mandatory requirements for Packaged Drinking Water under IS 14543?' },
  { label: 'IS 1786: TMT Steel', prompt: 'Explain the tensile strength and seismic ductility grades for TMT Steel Bars under IS 1786.' },
  { label: 'IS 9873: Toy Safety', prompt: 'Is BIS certification mandatory for selling children toys in India under IS 9873?' },
  { label: 'IS 1417: Gold HUID', prompt: 'Explain the 3 mandatory marks for Gold Hallmarking and HUID under IS 1417.' },
  { label: 'IS 4151: Helmets', prompt: 'What are the safety testing criteria and weight restrictions for two-wheeler helmets under IS 4151?' },
  { label: 'IS 1293: Plugs & Sockets', prompt: 'What are the safety requirements and shutter criteria for electrical plugs and sockets under IS 1293?' },
];

export const ChatView: React.FC<ChatViewProps> = ({
  messages,
  isLoading,
  onSendMessage,
  onClearChat,
  onSelectStandardPrompt: _onSelectStandardPrompt,
  hasApiKey: _hasApiKey,
  onBackToWelcome,
}) => {
  const { language, t } = useLanguage();
  const [inputQuery, setInputQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeCitationDrawer, setActiveCitationDrawer] = useState<ChatCitation | null>(null);
  const [activeDossier, setActiveDossier] = useState<ComplianceDossierData | null>(null);
  const [speechNotification, setSpeechNotification] = useState<{ message: string; type: 'info' | 'error' } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Native Web Speech hook
  const {
    isListening,
    interimTranscript,
    error: speechError,
    isSupported: isSpeechSupported,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechToText({
    language,
    onTranscriptChange: () => {},
    onFinalTranscript: (finalText) => {
      setInputQuery((prev) => {
        const trimmed = prev.trim();
        return trimmed ? `${trimmed} ${finalText}` : finalText;
      });
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
    },
  });

  // Handle speech recognition errors
  useEffect(() => {
    if (speechError) {
      if (speechError === 'PERMISSION_DENIED') {
        setSpeechNotification({
          message: t.micDenied,
          type: 'error',
        });
      } else if (speechError === 'SPEECH_NOT_SUPPORTED') {
        setSpeechNotification({
          message: t.micNotSupported,
          type: 'error',
        });
      } else if (speechError === 'NETWORK_ERROR') {
        setSpeechNotification({
          message: 'Network issue during speech recognition. Please check connection.',
          type: 'error',
        });
      }
      const timer = setTimeout(() => setSpeechNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [speechError, t]);

  const handleToggleVoice = () => {
    if (!isSpeechSupported) {
      setSpeechNotification({
        message: t.micNotSupported,
        type: 'error',
      });
      setTimeout(() => setSpeechNotification(null), 5000);
      return;
    }

    if (isListening) {
      stopListening();
    } else {
      resetTranscript();
      startListening();
    }
  };

  const isChecklistContent = (text: string) => {
    return (
      text.includes('Stage 1') ||
      text.includes('Stage 2') ||
      text.includes('దశ 1') ||
      text.includes('దశ 2') ||
      text.includes('चरण 1') ||
      text.includes('चरण 2') ||
      text.includes('Compliance Checklist') ||
      text.includes('చెక్‌లిస్ట్') ||
      text.includes('चेकलिस्ट') ||
      text.includes('- [ ]') ||
      text.includes('4-Stage')
    );
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim() || isLoading) return;
    onSendMessage(inputQuery);
    setInputQuery('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const renderConfidenceBadge = (confidence?: ConfidenceLevel) => {
    if (!confidence) return null;
    switch (confidence) {
      case 'high':
        return (
          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
            [ HIGH CONFIDENCE // GROUNDED ]
          </span>
        );
      case 'medium':
        return (
          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-100 text-blue-900 border border-blue-200">
            [ MEDIUM CONFIDENCE ]
          </span>
        );
      case 'low':
        return (
          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-100 text-amber-900 border border-amber-300">
            [ LIMITED GROUNDING ]
          </span>
        );
      default:
        return (
          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-zinc-200 text-zinc-800 border border-zinc-300">
            [ NO DIRECT MATCH ]
          </span>
        );
    }
  };

  const formatMessageText = (text: string) => {
    const lines = text.split('\n');
    return (
      <div className="space-y-2 text-zinc-900 dark:text-zinc-100 text-[14px] leading-relaxed">
        {lines.map((line, idx) => {
          if (line.startsWith('### ')) {
            return (
              <h3 key={idx} className="text-lg sm:text-xl font-serif text-zinc-950 dark:text-white pt-2 pb-0.5 border-b border-zinc-200 dark:border-zinc-800">
                {line.replace('### ', '')}
              </h3>
            );
          }
          if (line.startsWith('## ')) {
            return (
              <h2 key={idx} className="text-xl sm:text-2xl font-serif text-zinc-950 dark:text-white pt-3 pb-1 border-b border-zinc-200 dark:border-zinc-800">
                {line.replace('## ', '')}
              </h2>
            );
          }
          if (line.startsWith('• ') || line.startsWith('- ')) {
            const content = line.substring(2);
            return (
              <div key={idx} className="flex items-start gap-2 pl-1 py-0.5">
                <span className="text-zinc-900 dark:text-zinc-200 font-bold mt-1 text-xs shrink-0">•</span>
                <span dangerouslySetInnerHTML={{ __html: formatInlineStyles(content) }} />
              </div>
            );
          }
          if (line.trim().length === 0) {
            return <div key={idx} className="h-1.5" />;
          }
          return (
            <p key={idx} dangerouslySetInnerHTML={{ __html: formatInlineStyles(line) }} />
          );
        })}
      </div>
    );
  };

  const formatInlineStyles = (str: string): string => {
    return str
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-zinc-950 dark:text-white">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic text-zinc-700 dark:text-zinc-300">$1</em>')
      .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-200 font-mono text-[12px] rounded font-medium border border-zinc-300 dark:border-zinc-700">$1</code>')
      .replace(/\[([A-Z0-9\s:()-]+)\]/g, '<span class="inline-block px-1.5 py-0.5 mx-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700 rounded text-[10px] font-mono font-bold">[$1]</span>')
      .replace(/\[(.*?)\]\((https?:\/\/[^\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-zinc-900 dark:text-zinc-100 hover:underline font-bold inline-flex items-center gap-0.5">$1 →</a>');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-125px)] max-w-5xl mx-auto px-4 sm:px-6 py-3 relative font-sans">
      {/* Top Header Controls (Text-First) */}
      <div className="flex items-center justify-between pb-2.5 mb-2 border-b border-zinc-300 dark:border-zinc-800 text-xs font-mono">
        <div className="flex items-center gap-2">
          {onBackToWelcome && (
            <button
              onClick={onBackToWelcome}
              className="px-3 py-1 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100 border border-zinc-300 dark:border-zinc-700 font-bold transition-colors cursor-pointer uppercase"
            >
              [ ← Overview ]
            </button>
          )}
          <span className="hidden sm:inline-flex items-center px-2.5 py-1 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-bold text-[11px] uppercase">
            [ ACTIVE GROUNDED SESSION ]
          </span>
        </div>

        {messages.length > 0 && (
          <button
            onClick={onClearChat}
            className="px-2.5 py-1 rounded text-zinc-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors font-bold uppercase cursor-pointer"
          >
            [ Clear History ]
          </button>
        )}
      </div>

      {/* Messages Scroll Container */}
      <div className="flex-1 overflow-y-auto space-y-6 pr-2 pb-4">
        {messages.length === 0 ? (
          /* Empty / Welcome State */
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-3xl mx-auto my-4 space-y-6"
          >
            <div className="p-6 sm:p-8 bg-zinc-950 text-zinc-100 rounded-3xl border border-zinc-800 shadow-xl space-y-4 font-mono">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest block">
                  [ BIS DECISIONAL ASSISTANT ]
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif text-white">
                  Standards Intelligence & Verification Interface
                </h2>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-sans pt-1">
                  Ask any question regarding Indian Standards, mandatory Quality Control Orders (QCOs), Scheme-I ISI licensing, Gold Hallmarking HUID, or laboratory test requirements.
                </p>
              </div>

              {/* Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-zinc-800 text-[11px]">
                <div className="p-2.5 bg-zinc-900 rounded-xl border border-zinc-800">
                  <span className="text-zinc-100 font-bold block mb-0.5">[ 100% CITED ]</span>
                  <span className="text-zinc-400 font-sans text-xs">Bound to verified BIS clauses & gazettes.</span>
                </div>
                <div className="p-2.5 bg-zinc-900 rounded-xl border border-zinc-800">
                  <span className="text-zinc-100 font-bold block mb-0.5">[ ZERO HALLUCINATION ]</span>
                  <span className="text-zinc-400 font-sans text-xs">No fabricated clauses or random numbers.</span>
                </div>
                <div className="p-2.5 bg-zinc-900 rounded-xl border border-zinc-800">
                  <span className="text-zinc-100 font-bold block mb-0.5">[ DETERMINISTIC ]</span>
                  <span className="text-zinc-400 font-sans text-xs">Full offline fallback support.</span>
                </div>
              </div>
            </div>

            {/* Popular Standards Shortcuts */}
            <div className="space-y-2.5">
              <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-500">
                [ Quick Query Standards ]
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {POPULAR_STANDARDS_SHORTCUTS.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => onSendMessage(item.prompt)}
                    className="p-3 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl text-left transition-all font-mono text-xs font-bold text-zinc-950 dark:text-zinc-100 cursor-pointer"
                  >
                    [ {item.label} ]
                  </button>
                ))}
              </div>
            </div>

            {/* Sample Natural Questions */}
            <div className="space-y-2.5">
              <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-500">
                [ Sample Guidance Inquiries ]
              </div>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_QUESTIONS.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => onSendMessage(q)}
                    className="text-xs px-3 py-2 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700 rounded-lg text-left transition-colors font-medium cursor-pointer"
                  >
                    "{q}"
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          /* Message List */
          <AnimatePresence mode="popLayout">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                className={`flex flex-col ${
                  msg.role === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-3xl rounded-2xl p-4 sm:p-5 shadow-xs transition-all ${
                    msg.role === 'user'
                      ? 'bg-zinc-950 text-white rounded-br-xs'
                      : 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border border-zinc-300 dark:border-zinc-800 rounded-bl-xs w-full'
                  }`}
                >
                  {/* Header for assistant message */}
                  {msg.role === 'assistant' && (
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-zinc-200 dark:border-zinc-800 font-mono">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950 text-xs font-bold">
                          BIS SAHAYAK
                        </span>
                        {renderConfidenceBadge(msg.confidenceLevel)}
                      </div>

                      <div className="flex items-center gap-2 text-[11px]">
                        <span className="text-zinc-500">
                          {msg.isFallback ? '[ DETERMINISTIC ]' : '[ SOURCE-GROUNDED ]'}
                        </span>
                        <button
                          onClick={() => handleCopy(msg.id, msg.text)}
                          className="px-2 py-0.5 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer font-bold uppercase"
                          title="Copy Answer"
                        >
                          {copiedId === msg.id ? '[ COPIED ]' : '[ COPY ]'}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Header for user message */}
                  {msg.role === 'user' && (
                    <div className="text-[10px] font-mono font-bold text-zinc-400 mb-1 uppercase tracking-wider">
                      [ USER QUERY ]
                    </div>
                  )}

                  {/* Message Body */}
                  {msg.role === 'user' ? (
                    <p className="text-sm font-medium text-white whitespace-pre-wrap">{msg.text}</p>
                  ) : (
                    <div className="space-y-3">
                      {formatMessageText(msg.text)}

                      {/* Render Interactive Compliance Roadmap if response contains checklist milestones */}
                      {isChecklistContent(msg.text) && (
                        <ComplianceRoadmapCard text={msg.text} />
                      )}
                    </div>
                  )}

                  {/* Regulatory / Fee Advisory Warning Box */}
                  {msg.requiresLegalDisclaimer && (
                    <div className="mt-4 p-3 bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl text-xs text-zinc-800 dark:text-zinc-200 font-mono">
                      <span className="font-bold uppercase">[ REGULATORY NOTICE ]:</span> Queries regarding official certification fee schedules, license grant decisions, or penal actions must be verified directly through official Gazette orders on{' '}
                      <a
                        href="https://www.manakonline.in"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold underline text-zinc-950 dark:text-white"
                      >
                        manakonline.in
                      </a>
                      . This is an informational prototype.
                    </div>
                  )}

                  {/* Offline Fallback Notice */}
                  {msg.isFallback && (
                    <div className="mt-3 p-2 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg flex items-center justify-between gap-2 text-xs text-zinc-700 dark:text-zinc-300 font-mono">
                      <span>[ LOCAL GROUNDED ENGINE RESPONSE ]</span>
                      <span className="text-[10px] bg-zinc-200 dark:bg-zinc-700 px-1.5 py-0.5 rounded font-bold">
                        OFFLINE
                      </span>
                    </div>
                  )}

                  {/* Grounded Citations Section */}
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-zinc-200 dark:border-zinc-800 font-mono">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wider">
                          [ GROUNDED SOURCES: {msg.citations.length} ]
                        </span>
                        <span className="text-[10px] text-zinc-500">
                          Click card to inspect clause
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1.5">
                        {msg.citations.map((cite) => (
                          <div
                            key={cite.id}
                            onClick={() => setActiveCitationDrawer(cite)}
                            className="p-3 bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 border border-zinc-300 dark:border-zinc-700 rounded-xl transition-all flex flex-col justify-between text-xs cursor-pointer group"
                          >
                            <div>
                              <div className="flex items-center justify-between gap-1 mb-1">
                                <span className="text-[10px] font-bold text-zinc-950 dark:text-white bg-white dark:bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-300 dark:border-zinc-700">
                                  {cite.citationLabel}
                                </span>
                                <span className="text-[10px] text-zinc-500">
                                  Page {cite.pageNumber || '1'}
                                </span>
                              </div>
                              <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 line-clamp-1 text-xs font-sans">
                                {cite.title}
                              </h4>
                              {cite.excerpt && (
                                <p className="text-[11px] text-zinc-600 dark:text-zinc-400 line-clamp-2 mt-1 italic font-sans">
                                  "{cite.excerpt}"
                                </p>
                              )}
                            </div>

                            <div className="mt-2 pt-1.5 border-t border-zinc-200 dark:border-zinc-700 flex items-center justify-between text-[11px]">
                              <span className="text-zinc-500">{cite.topic}</span>
                              <span className="text-zinc-900 dark:text-zinc-100 font-bold group-hover:underline">
                                Inspect →
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Assistant Action Bar */}
                  {msg.role === 'assistant' && (
                    <div className="mt-4 pt-3 border-t border-zinc-200 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-2 font-mono">
                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          type="button"
                          onClick={() => handleCopy(msg.id, msg.text)}
                          className="px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs font-bold rounded-lg transition-colors cursor-pointer border border-zinc-300 dark:border-zinc-700 uppercase"
                        >
                          {copiedId === msg.id ? `[ ${t.copiedGuidance} ]` : `[ ${t.copyGuidance} ]`}
                        </button>

                        {/* Export Official Compliance Dossier PDF / Print */}
                        <button
                          type="button"
                          onClick={() => {
                            const dossierData = generateDossierFromChatMessage(msg, language);
                            setActiveDossier(dossierData);
                          }}
                          className="px-3 py-1.5 bg-zinc-950 dark:bg-zinc-100 hover:bg-zinc-800 text-white dark:text-zinc-950 text-xs font-bold rounded-lg transition-colors cursor-pointer uppercase"
                          title="Export Official Compliance Dossier"
                        >
                          [ Print Compliance Dossier ]
                        </button>

                        {msg.citations && msg.citations.length > 0 && msg.citations[0].sourceUrl && (
                          <a
                            href={msg.citations[0].sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-bold rounded-lg transition-colors border border-zinc-300 dark:border-zinc-700 uppercase"
                          >
                            [ View Official Portal → ]
                          </a>
                        )}
                      </div>

                      <a
                        href="https://www.manakonline.in"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 underline"
                      >
                        manakonline.in →
                      </a>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}

        {/* Loading Indicator */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-2 font-mono"
          >
            <div className="p-4 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-2xl shadow-xs text-xs text-zinc-700 dark:text-zinc-300 flex items-center gap-3">
              <span className="animate-pulse font-bold">[ SEARCHING BIS DATABASE ]</span>
              <span>Retrieving grounded clauses and verifying citations...</span>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Action Chips */}
      <div className="py-2 overflow-x-auto flex items-center gap-2 no-scrollbar shrink-0 text-xs font-mono">
        <button
          type="button"
          onClick={() => {
            const prompt =
              language === 'te'
                ? 'IS 14543 కోసం 4-దశల BIS అనుగుణ్యత చెక్‌లిస్ట్ (Compliance Checklist) మరియు రోడ్‌మ్యాప్‌ను రూపొందించండి.'
                : language === 'hi'
                ? 'IS 14543 के लिए 4-चरणीय बीआईएस अनुपालन चेकलिस्ट (Compliance Checklist) और रोडमैप तैयार करें।'
                : 'Generate a 4-step actionable BIS Compliance Checklist and certification roadmap for IS 14543 Packaged Drinking Water.';
            onSendMessage(prompt);
          }}
          className="px-3 py-1 bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 hover:bg-zinc-800 rounded-lg shrink-0 font-bold text-[11px] cursor-pointer transition-all uppercase"
        >
          [ {t.generateChecklistAction} ]
        </button>

        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider shrink-0 mx-1">
          {language === 'te' ? 'ఉదాహరణలు:' : language === 'hi' ? 'उदाहरण:' : 'TRY:'}
        </span>

        {SUGGESTED_QUESTIONS.slice(0, 3).map((q, idx) => (
          <button
            key={idx}
            onClick={() => onSendMessage(q)}
            className="px-2.5 py-1 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700 rounded-lg shrink-0 transition-colors text-[11px] font-medium cursor-pointer"
          >
            "{q}"
          </button>
        ))}
      </div>

      {/* Input Box & Action Controls */}
      <div className="pt-1 shrink-0 space-y-2">
        {/* Speech Notification Toast */}
        <AnimatePresence>
          {speechNotification && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              className={`px-3 py-2 rounded-xl text-xs font-mono flex items-center justify-between gap-2 border shadow-xs ${
                speechNotification.type === 'error'
                  ? 'bg-rose-50 border-rose-200 text-rose-800'
                  : 'bg-zinc-100 border-zinc-200 text-zinc-800'
              }`}
            >
              <div>
                <span className="font-bold uppercase">[ NOTICE ]: </span>
                <span>{speechNotification.message}</span>
              </div>
              <button
                type="button"
                onClick={() => setSpeechNotification(null)}
                className="font-bold text-zinc-500 hover:text-zinc-900 cursor-pointer uppercase text-[10px]"
              >
                [ Dismiss ]
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Active Listening Indicator */}
        <AnimatePresence>
          {isListening && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="p-3 bg-zinc-950 text-white border border-zinc-800 rounded-xl flex items-center justify-between gap-3 text-xs font-mono">
                <div className="truncate">
                  <p className="font-bold">
                    [ LISTENING... SPEAK NOW ] ({language === 'te' ? 'Telugu' : language === 'hi' ? 'Hindi' : 'English'})
                  </p>
                  {interimTranscript && (
                    <p className="text-[11px] text-zinc-300 italic mt-0.5 truncate font-sans">
                      &quot;{interimTranscript}...&quot;
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={stopListening}
                  className="px-2.5 py-1 bg-white text-zinc-950 text-[11px] font-bold rounded-lg transition-colors cursor-pointer shrink-0 uppercase"
                >
                  [ Stop Voice ]
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="relative">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-300 dark:border-zinc-700 focus-within:border-zinc-950 dark:focus-within:border-zinc-200 shadow-xs transition-all p-2">
            <textarea
              ref={textareaRef}
              id="chat-input-textarea"
              rows={2}
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                isListening
                  ? `[ Listening... ${language === 'te' ? 'తెలుగులో మాట్లాడండి' : language === 'hi' ? 'हिन्दी में बोलें' : 'Speak in English'} ]`
                  : t.typeQueryPlaceholder
              }
              className="w-full bg-transparent border-0 outline-none text-sm text-zinc-950 dark:text-white placeholder:text-zinc-400 resize-none px-2 py-1"
              maxLength={1500}
            />

            <div className="flex items-center justify-between pt-1 border-t border-zinc-100 dark:border-zinc-800 px-2 font-mono">
              <div className="flex items-center gap-3 text-[11px] text-zinc-400">
                <span>{inputQuery.length}/1500</span>
                <span className="hidden sm:inline">|</span>
                <span className="hidden sm:inline text-[10px]">
                  [ Enter ↵ to Send ]
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Voice Input Button */}
                <button
                  type="button"
                  id="btn-voice-input"
                  onClick={handleToggleVoice}
                  className={`px-3 py-1 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer ${
                    isListening
                      ? 'bg-zinc-950 text-white border border-zinc-800'
                      : 'bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700'
                  }`}
                  title={isListening ? t.stopListening : t.voiceInput}
                >
                  {isListening ? '[ Voice: Active ]' : '[ Voice Input ]'}
                </button>

                {messages.length > 0 && (
                  <button
                    type="button"
                    id="btn-clear-chat"
                    onClick={onClearChat}
                    className="px-2 py-1 text-zinc-500 hover:text-rose-700 text-xs font-bold rounded-lg transition-colors cursor-pointer uppercase"
                    title={t.clearHistory}
                  >
                    [ Clear ]
                  </button>
                )}

                <button
                  type="submit"
                  id="btn-send-message"
                  disabled={!inputQuery.trim() || isLoading}
                  className="px-4 py-1 bg-zinc-950 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-white disabled:bg-zinc-300 dark:disabled:bg-zinc-800 text-white dark:text-zinc-950 font-bold text-xs rounded-lg transition-all disabled:cursor-not-allowed cursor-pointer uppercase tracking-wider"
                >
                  [ {t.queryBtn} ]
                </button>
              </div>
            </div>
          </div>
        </form>

        <p className="text-[10px] font-mono text-zinc-500 text-center mt-2">
          [ STATUTORY ADVISORY ]: Research prototype. For formal certification, verify at{' '}
          <a href="https://www.bis.gov.in" target="_blank" rel="noopener noreferrer" className="underline text-zinc-900 dark:text-zinc-100 font-bold">
            bis.gov.in
          </a>.
        </p>
      </div>

      {/* Slide-in Citation Drawer (Pure Typography) */}
      <AnimatePresence>
        {activeCitationDrawer && (
          <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/50 backdrop-blur-xs font-mono">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 350 }}
              className="w-full max-w-md h-full bg-white dark:bg-zinc-950 border-l border-zinc-300 dark:border-zinc-800 shadow-2xl p-6 overflow-y-auto flex flex-col justify-between"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-zinc-300 dark:border-zinc-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950 text-xs font-bold">
                      {activeCitationDrawer.citationLabel}
                    </span>
                    <span className="text-xs text-zinc-500">
                      {activeCitationDrawer.sourceType}
                    </span>
                  </div>
                  <button
                    onClick={() => setActiveCitationDrawer(null)}
                    className="px-2 py-0.5 rounded text-zinc-500 hover:text-zinc-950 dark:hover:text-white font-bold cursor-pointer uppercase text-xs"
                  >
                    [ Close ✕ ]
                  </button>
                </div>

                {/* Citation Summary Card */}
                <div className="p-5 bg-zinc-950 text-zinc-100 rounded-2xl border border-zinc-800 space-y-3">
                  <div className="flex items-center justify-between text-[10px] text-zinc-400">
                    <span>[ VERIFICATION STATUS ]</span>
                    <span className="font-bold text-white">[ VERIFIED_OFFICIAL ]</span>
                  </div>
                  <h3 className="font-display font-bold text-base text-white font-sans">
                    {activeCitationDrawer.title}
                  </h3>
                  <div className="text-xs text-zinc-400 pt-2 border-t border-zinc-800 flex justify-between">
                    <span>Domain: {activeCitationDrawer.topic}</span>
                    <span>Page: {activeCitationDrawer.pageNumber || '1'}</span>
                  </div>
                </div>

                {/* Grounded Excerpt */}
                <div className="space-y-2">
                  <div className="text-xs font-bold text-zinc-950 dark:text-white uppercase tracking-wider">
                    [ Grounded Clause Text ]
                  </div>
                  <div className="p-4 bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-xl text-xs text-zinc-800 dark:text-zinc-200 leading-relaxed font-sans">
                    {activeCitationDrawer.excerpt || activeCitationDrawer.title}
                  </div>
                </div>

                <div className="p-3 bg-zinc-100 dark:bg-zinc-900 rounded-xl text-xs text-zinc-600 dark:text-zinc-400 space-y-1">
                  <div><strong>Last Audited:</strong> {activeCitationDrawer.lastVerified}</div>
                  <div><strong>Portal:</strong> {activeCitationDrawer.sourceUrl}</div>
                </div>
              </div>

              <div className="pt-6 border-t border-zinc-300 dark:border-zinc-800 flex gap-3">
                <a
                  href={activeCitationDrawer.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 px-4 bg-zinc-950 hover:bg-black text-white font-bold text-xs rounded-xl text-center cursor-pointer uppercase tracking-wider"
                >
                  [ View Official Portal → ]
                </a>
                <button
                  onClick={() => setActiveCitationDrawer(null)}
                  className="py-2.5 px-4 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100 font-bold text-xs rounded-xl cursor-pointer uppercase"
                >
                  [ Dismiss ]
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Compliance Dossier Printable Modal */}
      <ComplianceDossierModal
        dossier={activeDossier}
        isOpen={!!activeDossier}
        onClose={() => setActiveDossier(null)}
      />
    </div>
  );
};
export default ChatView;
