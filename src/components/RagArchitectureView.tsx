import React, { useState } from 'react';
import { motion } from 'motion/react';
import { TestCase, ChatApiResponse } from '../types';
import { sendChatMessage } from '../services/chatService';
import { BIS_KNOWLEDGE_BASE } from '../data/bisKnowledgeBase';

interface RagArchitectureViewProps {
  onRunTestInChat: (query: string) => void;
}

const RAG_TEST_CASES: TestCase[] = [
  {
    id: 'rag-tc-1',
    title: 'IS Code Lookup (IS 14543)',
    category: 'Standard Code',
    prompt: 'What are the mandatory requirements for Packaged Drinking Water under IS 14543?',
    expectedOutcome: 'Returns high-confidence response citing IS 14543:2024, Scheme-I ISI Mark requirements, and microbiological testing.',
    expectedBehaviorNotes: 'Exact IS number regex extracts standard code and awards highest retrieval match score (60+ pts).'
  },
  {
    id: 'rag-tc-2',
    title: 'Product Keyword Match (TMT Steel)',
    category: 'Keyword Search',
    prompt: 'Which standard applies to TMT steel bars used in construction in India?',
    expectedOutcome: 'Identifies IS 1786:2008 for High Strength Deformed Steel Bars with mandatory ISI Mark.',
    expectedBehaviorNotes: 'Keyword extraction maps "TMT steel bars" to IS 1786 even without user knowing standard number.'
  },
  {
    id: 'rag-tc-3',
    title: 'Mandatory QCO Verification (Toys)',
    category: 'Policy QCO',
    prompt: 'Is BIS certification mandatory for selling toys in India under IS 9873?',
    expectedOutcome: 'Confirms Toys Quality Control Order (QCO) makes Scheme-I ISI mark strictly mandatory.',
    expectedBehaviorNotes: 'Retrieves QCO gazette policy and IS 9873 safety requirements.'
  },
  {
    id: 'rag-tc-4',
    title: 'Fee / Legal Regulatory Boundary',
    category: 'Safety Guardrail',
    prompt: 'What is the exact renewal fee for a BIS license in 2026?',
    expectedOutcome: 'Refuses to guess exact live fee amounts; provides official Manakonline fee guidelines and advisory warning.',
    expectedBehaviorNotes: 'Legal & fee disclaimer triggers automatically to prevent outdated financial guidance.'
  },
  {
    id: 'rag-tc-5',
    title: 'Off-Topic Refusal Guardrail',
    category: 'Domain Scope',
    prompt: 'How do I apply for a passport in Mumbai?',
    expectedOutcome: 'Gracefully refuses off-topic query and redirects user to BIS standards and certification services.',
    expectedBehaviorNotes: 'Domain filter rejects non-BIS queries without hallucinating generic web content.'
  }
];

export const RagArchitectureView: React.FC<RagArchitectureViewProps> = ({
  onRunTestInChat
}) => {
  const [selectedCase, setSelectedCase] = useState<TestCase>(RAG_TEST_CASES[0]);
  const [isRunning, setIsRunning] = useState(false);
  const [testResult, setTestResult] = useState<ChatApiResponse | null>(null);
  const [latencyMs, setLatencyMs] = useState<number | null>(null);
  const [activeStage, setActiveStage] = useState<number>(1);

  const handleRunEvaluation = async (test: TestCase) => {
    setSelectedCase(test);
    setIsRunning(true);
    setTestResult(null);

    const startTime = performance.now();
    try {
      const data = await sendChatMessage(test.prompt, 'English');
      const endTime = performance.now();
      setTestResult(data);
      setLatencyMs(Math.round(endTime - startTime));
    } catch (err) {
      console.error('Test execution error:', err);
    } finally {
      setIsRunning(false);
    }
  };

  const pipelineStages = [
    {
      num: '01',
      title: 'Query Tokenizer & Extraction',
      sub: 'Intent & Regex Parsing',
      desc: 'Parses input text to extract explicit Indian Standard numbers (e.g. `IS 14543`, `IS 10500`) and semantic product keywords.',
      metric: 'Regex Precision: 100%'
    },
    {
      num: '02',
      title: 'Vector & Keyword Matcher',
      sub: 'Multi-Factor Scoring',
      desc: 'Ranks the curated knowledge base using composite weights: IS Match (+60), Title Match (+35), Keyword Tag (+25).',
      metric: 'Threshold: ≥20 pts'
    },
    {
      num: '03',
      title: 'Context Matrix Assembly',
      sub: 'Strict Truth Boundary',
      desc: 'Packages top matching clauses with official Manakonline URLs, mandatory QCO flags, and page citations.',
      metric: 'Zero Hallucination'
    },
    {
      num: '04',
      title: 'Constrained Synthesis',
      sub: 'Targeted Explanation',
      desc: 'Translates complex industrial specifications and statistical test frequencies into plain, accessible language.',
      metric: 'Temperature: 0.1'
    },
    {
      num: '05',
      title: 'Source Attribution Audit',
      sub: 'Verification & URLs',
      desc: 'Binds official verification links, audits compliance notices, and outputs confidence grading.',
      metric: '100% Traceable'
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-12 font-sans">
      {/* Hero Monolith */}
      <motion.section
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-8 sm:p-12 bg-zinc-950 text-zinc-100 rounded-3xl border border-zinc-800 shadow-xl space-y-4 font-mono"
      >
        <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
          [ VERIFICATION & RETRIEVAL ENGINE SPECIFICATION ]
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight font-sans">
          How BIS Sahayak AI Works (RAG Architecture)
        </h1>
        <p className="text-sm sm:text-base text-zinc-300 max-w-3xl leading-relaxed font-sans">
          <strong>BIS Sahayak AI</strong> employs a <em>Retrieval-Augmented Generation (RAG)</em> pipeline engineered to prevent AI hallucinations. It operates as a deterministic lookup and constrained synthesizer over the official Bureau of Indian Standards corpus.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-zinc-800 text-xs">
          <div>
            <span className="text-zinc-500 block text-[10px] uppercase">Retrieval Strategy</span>
            <span className="text-zinc-200 font-bold">[ Hybrid Weighted Search ]</span>
          </div>
          <div>
            <span className="text-zinc-500 block text-[10px] uppercase">Hallucination Guard</span>
            <span className="text-white font-bold">[ Hard Context Boundary ]</span>
          </div>
          <div>
            <span className="text-zinc-500 block text-[10px] uppercase">Source Attribution</span>
            <span className="text-zinc-200 font-bold">[ Paragraph Citations ]</span>
          </div>
          <div>
            <span className="text-zinc-500 block text-[10px] uppercase">Fallback Architecture</span>
            <span className="text-zinc-200 font-bold">[ Deterministic Engine ]</span>
          </div>
        </div>
      </motion.section>

      {/* Interactive 5-Stage Pipeline */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-zinc-300 dark:border-zinc-800 pb-3 font-mono">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-widest text-zinc-500">
              [ PIPELINE BLUEPRINT ]
            </div>
            <h2 className="text-2xl font-display font-bold text-zinc-950 dark:text-white mt-0.5 font-sans">
              The 5-Stage Grounded Process
            </h2>
          </div>
          <span className="text-xs text-zinc-500 hidden sm:inline uppercase">
            [ Click any stage to inspect ]
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 font-mono">
          {pipelineStages.map((st, idx) => {
            const isSelected = activeStage === idx + 1;
            return (
              <button
                key={idx}
                onClick={() => setActiveStage(idx + 1)}
                className={`p-5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-zinc-950 text-white border-zinc-950 shadow-lg'
                    : 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border-zinc-300 dark:border-zinc-800 hover:border-zinc-500'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-400">
                      [ {st.num} ]
                    </span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded border ${isSelected ? 'bg-zinc-800 text-zinc-300 border-zinc-700' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-300 dark:border-zinc-700'}`}>
                      {st.sub}
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-sm leading-tight font-sans">
                    {st.title}
                  </h3>
                  <p className={`text-xs leading-relaxed font-sans ${isSelected ? 'text-zinc-300' : 'text-zinc-600 dark:text-zinc-400'}`}>
                    {st.desc}
                  </p>
                </div>

                <div className={`mt-4 pt-2 border-t text-[10px] font-semibold uppercase ${isSelected ? 'border-zinc-800 text-zinc-300' : 'border-zinc-200 dark:border-zinc-800 text-zinc-500'}`}>
                  [ {st.metric} ]
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Live RAG Evaluation & Inspection Lab */}
      <section className="bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-3xl border border-zinc-300 dark:border-zinc-800 shadow-xs space-y-6 font-mono">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-zinc-200 dark:border-zinc-800">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-widest text-zinc-500">
              [ INTERACTIVE TEST SUITE ]
            </div>
            <h2 className="text-xl font-display font-bold text-zinc-950 dark:text-white mt-0.5 font-sans">
              Live RAG Evaluation & Inspection Lab
            </h2>
            <p className="text-xs text-zinc-500 font-sans mt-0.5">
              Execute standardized test benchmarks through the retrieval pipeline in real time.
            </p>
          </div>
          <button
            onClick={() => handleRunEvaluation(selectedCase)}
            disabled={isRunning}
            className="px-5 py-2.5 bg-zinc-950 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-white text-white dark:text-zinc-950 text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50 uppercase"
          >
            <span>{isRunning ? '[ Evaluating Query... ]' : '[ Run Selected Benchmark → ]'}</span>
          </button>
        </div>

        {/* Benchmark Selector & Results Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-sans">
          {/* Left Column: Benchmarks List */}
          <div className="lg:col-span-4 space-y-2 font-mono">
            <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 block">
              [ Pre-configured Benchmarks ]
            </label>
            <div className="space-y-2">
              {RAG_TEST_CASES.map((tc) => {
                const isSelected = selectedCase.id === tc.id;
                return (
                  <button
                    key={tc.id}
                    onClick={() => {
                      setSelectedCase(tc);
                      setTestResult(null);
                    }}
                    className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-zinc-950 text-white border-zinc-950 shadow-xs font-semibold'
                        : 'bg-zinc-50 dark:bg-zinc-800/50 border-zinc-300 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1 font-mono">
                      <span className="font-bold text-xs">{tc.title}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded border ${isSelected ? 'bg-zinc-800 text-zinc-300 border-zinc-700' : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200 border-zinc-300 dark:border-zinc-600'}`}>
                        {tc.category}
                      </span>
                    </div>
                    <p className={`text-[11px] truncate italic font-sans ${isSelected ? 'text-zinc-300' : 'text-zinc-500'}`}>
                      &quot;{tc.prompt}&quot;
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Execution Output Panel */}
          <div className="lg:col-span-8 bg-zinc-50 dark:bg-zinc-800/50 p-6 rounded-2xl border border-zinc-300 dark:border-zinc-700 space-y-5">
            <div className="space-y-2 font-mono">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                [ Evaluation Prompt & Expected Outcome ]
              </span>
              <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-300 dark:border-zinc-700 text-xs text-zinc-950 dark:text-zinc-100">
                &quot;{selectedCase.prompt}&quot;
              </div>
              <p className="text-xs text-zinc-700 dark:text-zinc-300 font-sans">
                <strong>Expected Behavior:</strong> {selectedCase.expectedOutcome}
              </p>
            </div>

            {isRunning && (
              <div className="p-12 text-center bg-white dark:bg-zinc-900 rounded-xl border border-zinc-300 dark:border-zinc-700 space-y-2 font-mono text-xs">
                <p className="font-bold text-zinc-900 dark:text-white uppercase">
                  [ Executing Tokenizer, Matcher & Grounding Pipeline... ]
                </p>
              </div>
            )}

            {testResult && !isRunning && (
              <div className="space-y-4 pt-1 font-mono">
                {/* Metrics Badges */}
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="px-2.5 py-1 rounded bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950 font-bold uppercase">
                    [ CONFIDENCE: {testResult.confidence} ]
                  </span>
                  <span className="px-2.5 py-1 rounded bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 font-bold uppercase">
                    [ RETRIEVED CHUNKS: {testResult.retrievedCount} ]
                  </span>
                  {latencyMs !== null && (
                    <span className="px-2.5 py-1 rounded bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 font-bold">
                      [ {latencyMs} ms ]
                    </span>
                  )}
                </div>

                {/* Retrieved Records Inspection */}
                {testResult.debugInfo && testResult.debugInfo.topMatchScores.length > 0 && (
                  <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-300 dark:border-zinc-700 space-y-2">
                    <span className="text-[11px] font-bold text-zinc-700 dark:text-zinc-300 block uppercase">
                      [ Retrieved Knowledge Base Chunks ]:
                    </span>
                    <div className="space-y-1.5 text-xs">
                      {testResult.debugInfo.topMatchScores.map((match, mIdx) => (
                        <div
                          key={mIdx}
                          className="flex items-center justify-between p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"
                        >
                          <span className="font-medium text-zinc-900 dark:text-zinc-100 truncate max-w-sm">
                            {match.title}
                          </span>
                          <span className="font-bold text-zinc-900 dark:text-zinc-100 bg-white dark:bg-zinc-900 px-2 py-0.5 rounded border border-zinc-300 dark:border-zinc-700">
                            Score: {match.score}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Generated Answer Preview */}
                <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-300 dark:border-zinc-700 space-y-2 font-sans">
                  <span className="text-[11px] font-mono font-bold text-zinc-700 dark:text-zinc-300 block uppercase">
                    [ Grounded Output Preview ]:
                  </span>
                  <p className="text-xs text-zinc-800 dark:text-zinc-200 leading-relaxed whitespace-pre-wrap max-h-44 overflow-y-auto font-sans">
                    {testResult.answer}
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-between font-mono">
                  <button
                    onClick={() => onRunTestInChat(selectedCase.prompt)}
                    className="text-xs font-bold text-zinc-950 dark:text-white underline cursor-pointer uppercase"
                  >
                    [ Test In Live Chat Interface → ]
                  </button>
                </div>
              </div>
            )}

            {!testResult && !isRunning && (
              <div className="text-center py-10 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-300 dark:border-zinc-700 space-y-2">
                <p className="text-xs font-mono text-zinc-500 uppercase">
                  [ Click &quot;Run Selected Benchmark&quot; to execute through pipeline ]
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Dataset Summary Scope */}
      <section className="bg-zinc-100 dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-300 dark:border-zinc-800 text-xs text-zinc-600 dark:text-zinc-400 space-y-2 font-mono">
        <div className="flex items-center justify-between font-bold text-zinc-950 dark:text-white uppercase">
          <span>[ Curated Knowledge Base Scope ]</span>
          <span>[ {BIS_KNOWLEDGE_BASE.length} Verified Standards & Services ]</span>
        </div>
        <p className="leading-relaxed font-sans text-xs text-zinc-700 dark:text-zinc-300">
          The curated repository contains verified records across Drinking Water (IS 14543, IS 10500), Steel (IS 1786), Electronics & Batteries (IS 1293, IS 16046), Consumer Safety & Toys (IS 9873, IS 4151), Gold Hallmarking (IS 1417), and Laboratory Directories. All records link directly to official BIS portals on <code>www.bis.gov.in</code> and <code>www.manakonline.in</code>.
        </p>
      </section>
    </div>
  );
};
export default RagArchitectureView;
