import React, { useState } from 'react';
import { motion } from 'motion/react';

interface StudentGuideModalProps {
  onStartDemoStep: (prompt: string) => void;
}

export const StudentGuideModal: React.FC<StudentGuideModalProps> = ({ onStartDemoStep }) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [activeTab, setActiveTab] = useState<'demo' | 'data' | 'setup'>('demo');

  const SAMPLE_RECORD_SNIPPET = `// Add this to /src/data/bisKnowledgeBase.ts
{
  id: 'IS-15558',
  isNumber: 'IS 15558:2022',
  title: 'Miniature Circuit Breakers (MCB) for AC Operation',
  content: 'IS 15558 covers requirements for miniature circuit breakers (MCBs) used in domestic and commercial electrical distribution boards for short-circuit and overload protection...',
  keyHighlights: [
    'Mandatory ISI Mark under Electrical Equipment QCO',
    'Tested for tripping characteristics (B, C, D curves) and breaking capacity',
    'Ensures fire hazard protection in residential electrical networks'
  ],
  sourceUrl: 'https://www.services.bis.gov.in',
  sourceType: 'Indian Standard (IS)',
  topic: 'Electrical & Electronics',
  lastVerified: '2025-01-20',
  citationLabel: 'IS 15558:2022',
  productKeywords: ['mcb', 'circuit breaker', 'switch', 'fuse', 'electrical safety'],
  mandatoryQCO: true,
  scheme: 'Scheme-I (ISI Mark)'
}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(SAMPLE_RECORD_SNIPPET);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const DEMO_STEPS = [
    {
      step: 1,
      title: 'Problem Framing & Persona Identification',
      instruction: 'Highlight that small manufacturers, startups, and citizens face ambiguity identifying mandatory standards, QCO orders, and testing protocols.',
      samplePrompt: null
    },
    {
      step: 2,
      title: 'Official Portal & Standard Discovery',
      instruction: 'Demonstrate how natural language questions resolve to the official Know Your Standard (KYS) system on Manakonline.',
      samplePrompt: 'How can I search for an Indian Standard on Manakonline?'
    },
    {
      step: 3,
      title: 'Mandatory Specification Inquiry (Drinking Water)',
      instruction: 'Demonstrate retrieval of IS 14543 parameters (physical, chemical, microbiological) and Scheme-I licensing.',
      samplePrompt: 'What are the mandatory BIS requirements for Packaged Drinking Water under IS 14543?'
    },
    {
      step: 4,
      title: 'Audit Grounded Citations & Excerpts',
      instruction: 'Click the source citation card to show transparency, verification timestamp, and official portal URL.',
      samplePrompt: null
    },
    {
      step: 5,
      title: 'Anti-Hallucination Guardrails (License Fees)',
      instruction: 'Demonstrate that the model refuses to hallucinate unverified financial fee numbers and directs to official gazettes.',
      samplePrompt: 'Tell me the exact current annual license fee in rupees for my factory certification.'
    },
    {
      step: 6,
      title: 'Domain Boundary (Non-BIS Refusal)',
      instruction: 'Show domain filtering refusing off-topic requests (e.g. general sports, passport, unrelated queries).',
      samplePrompt: 'Who won yesterday\'s cricket match?'
    },
    {
      step: 7,
      title: 'Standards Catalog & QCO Filtering',
      instruction: 'Switch to the "Standards Directory" view to demonstrate search, filtering by Mandatory QCO, and deep clause inspection.',
      samplePrompt: null
    },
    {
      step: 8,
      title: 'Multi-lingual Support Roadmap',
      instruction: 'Switch languages in the header (English, Hindi, Telugu) to demonstrate accessibility for diverse Indian regional stakeholders.',
      samplePrompt: null
    },
    {
      step: 9,
      title: 'Automated Evaluation Benchmarks',
      instruction: 'Open the "Architecture Lab" to show the automated test harness scoring retrieved chunks with token latency metrics.',
      samplePrompt: null
    },
    {
      step: 10,
      title: 'Prototype Disclaimer & Regulatory Scope',
      instruction: 'Conclude with the clear public disclaimer noting the prototype boundaries relative to official BIS statutory processes.',
      samplePrompt: null
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8 font-sans">
      {/* Monolith Header */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-8 sm:p-10 bg-zinc-950 text-zinc-100 rounded-3xl border border-zinc-800 shadow-xl space-y-4 font-mono"
      >
        <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
          [ HACKATHON PRESENTATION BLUEPRINT ]
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif text-white tracking-tight leading-[1.12]">
          10-Step Presentation Script & Mentorship Guide
        </h1>
        <p className="text-xs sm:text-sm text-zinc-300 max-w-2xl font-sans">
          Curated guide for presenting BIS Sahayak AI before evaluation panels, explaining the RAG pipeline, and extending the knowledge base.
        </p>

        {/* Tab switcher */}
        <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-zinc-800 text-xs">
          {[
            { key: 'demo', label: '[ 1. 10-Step Presentation Script ]' },
            { key: 'data', label: '[ 2. Adding Custom Standards ]' },
            { key: 'setup', label: '[ 3. Architecture & Offline Mode ]' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-4 py-2 rounded-xl transition-all cursor-pointer uppercase ${
                activeTab === tab.key
                  ? 'bg-white text-zinc-950 font-bold shadow-xs'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Tab 1: 10-Step Demo */}
      {activeTab === 'demo' && (
        <div className="space-y-4 font-sans">
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-300 dark:border-zinc-800 shadow-xs space-y-1 font-mono">
            <h3 className="text-sm font-bold font-display text-zinc-950 dark:text-white uppercase">
              [ Follow this 10-Step Presentation Flow ]
            </h3>
            <p className="text-xs text-zinc-500 font-sans">
              Evaluators look for problem clarity, grounded citations without hallucination, and deterministic fallback resilience.
            </p>
          </div>

          <div className="space-y-3">
            {DEMO_STEPS.map((stepItem) => (
              <div
                key={stepItem.step}
                className="p-5 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-2xl shadow-2xs space-y-2 hover:border-zinc-500 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 font-mono">
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-0.5 rounded bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950 text-xs font-bold shrink-0">
                      [ Step {stepItem.step} ]
                    </span>
                    <h4 className="text-sm font-bold font-display text-zinc-950 dark:text-white font-sans">
                      {stepItem.title}
                    </h4>
                  </div>

                  {stepItem.samplePrompt && (
                    <button
                      onClick={() => onStartDemoStep(stepItem.samplePrompt!)}
                      className="px-3 py-1.5 bg-zinc-950 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-white text-white dark:text-zinc-950 rounded-xl text-xs font-bold flex items-center gap-1.5 self-start sm:self-auto cursor-pointer uppercase"
                    >
                      [ Test Prompt → ]
                    </button>
                  )}
                </div>

                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans">
                  {stepItem.instruction}
                </p>

                {stepItem.samplePrompt && (
                  <div className="p-3 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-300 dark:border-zinc-700 rounded-xl text-xs font-mono text-zinc-900 dark:text-zinc-100">
                    <span className="text-zinc-500 select-none">[ PROMPT ]: </span>
                    &quot;{stepItem.samplePrompt}&quot;
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Custom Data */}
      {activeTab === 'data' && (
        <div className="space-y-4 font-mono">
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-300 dark:border-zinc-800 shadow-xs space-y-2">
            <h3 className="text-sm font-bold font-display text-zinc-950 dark:text-white font-sans">
              [ Extending the Curated Knowledge Base ]
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans">
              Knowledge records are structured in <code>/src/data/bisKnowledgeBase.ts</code>. You can easily add more Indian Standards without altering database drivers.
            </p>
          </div>

          <div className="bg-zinc-950 text-zinc-100 rounded-2xl p-5 shadow-xs space-y-3 border border-zinc-800 text-xs">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <span className="text-white font-bold uppercase">[ Standard Record Schema Definition ]</span>
              <button
                onClick={copyToClipboard}
                className="text-xs text-zinc-400 hover:text-white uppercase font-bold cursor-pointer"
              >
                {copiedCode ? '[ Copied! ]' : '[ Copy Code ]'}
              </button>
            </div>
            <pre className="text-zinc-300 overflow-x-auto leading-relaxed max-h-72">
              {SAMPLE_RECORD_SNIPPET}
            </pre>
          </div>
        </div>
      )}

      {/* Tab 3: Architecture & Setup */}
      {activeTab === 'setup' && (
        <div className="space-y-4 font-mono">
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-300 dark:border-zinc-800 shadow-xs space-y-4">
            <h3 className="text-sm font-bold font-display text-zinc-950 dark:text-white font-sans">
              [ System Architecture & Offline Resilience ]
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-300 dark:border-zinc-700 space-y-1">
                <span className="font-bold text-zinc-950 dark:text-white block uppercase">[ 1. Extraction ]</span>
                <p className="text-zinc-600 dark:text-zinc-400 font-sans">Regex isolator parses IS codes with 100% precision.</p>
              </div>
              <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-300 dark:border-zinc-700 space-y-1">
                <span className="font-bold text-zinc-950 dark:text-white block uppercase">[ 2. Retrieval ]</span>
                <p className="text-zinc-600 dark:text-zinc-400 font-sans">Weighted similarity assigns point tiers to verified clauses.</p>
              </div>
              <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-300 dark:border-zinc-700 space-y-1">
                <span className="font-bold text-zinc-950 dark:text-white block uppercase">[ 3. Synthesis ]</span>
                <p className="text-zinc-600 dark:text-zinc-400 font-sans">Strict prompt boundary forbids ungrounded assumptions.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default StudentGuideModal;
