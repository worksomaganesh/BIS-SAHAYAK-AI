import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RagArchitectureView } from './RagArchitectureView';
import { TestModeView } from './TestModeView';
import { StudentGuideModal } from './StudentGuideModal';

interface PrivateToolsViewProps {
  onRunTestInChat: (prompt: string) => void;
  onOpenDemoTour: () => void;
  initialSubTab?: 'rag' | 'test' | 'guide';
}

export const PrivateToolsView: React.FC<PrivateToolsViewProps> = ({
  onRunTestInChat,
  onOpenDemoTour,
  initialSubTab = 'rag'
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'rag' | 'test' | 'guide'>(initialSubTab);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8 font-sans">
      {/* Private Workspace Notice Banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 sm:p-8 bg-zinc-950 text-zinc-100 rounded-3xl border border-zinc-800 shadow-2xl space-y-4 font-mono"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
          <div className="space-y-1">
            <div className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-zinc-800 text-zinc-300 border border-zinc-700 inline-block">
              [ RESTRICTED DEVELOPER & PRESENTATION SUITE ]
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif text-white tracking-tight">
              RAG Engine Diagnostics & Hackathon Jury Lab
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 font-sans max-w-2xl leading-relaxed">
              Use this area to inspect retrieval, sources, citations, evaluation results, and the 10-step jury presentation script.
            </p>
          </div>

          <button
            onClick={onOpenDemoTour}
            className="px-4 py-2.5 bg-white hover:bg-zinc-200 text-zinc-950 font-mono text-xs font-bold rounded-xl shadow-lg transition-all cursor-pointer shrink-0 self-start sm:self-auto uppercase"
          >
            [ Launch Jury Guided Demo → ]
          </button>
        </div>

        {/* Private Tab Navigation Switcher */}
        <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-xs">
          {[
            { id: 'rag', label: '[ 1. RAG Pipeline & Architecture ]' },
            { id: 'test', label: '[ 2. Automated Benchmarks (10 Suites) ]' },
            { id: 'guide', label: '[ 3. Jury & Student Mentorship Guide ]' },
          ].map((tab) => {
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer uppercase ${
                  isActive
                    ? 'bg-white text-zinc-950 font-bold shadow-md'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Sub-View Content */}
      <div>
        <AnimatePresence mode="wait">
          {activeSubTab === 'rag' && (
            <motion.div
              key="rag"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
            >
              <RagArchitectureView onRunTestInChat={onRunTestInChat} />
            </motion.div>
          )}

          {activeSubTab === 'test' && (
            <motion.div
              key="test"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
            >
              <TestModeView onRunTestInChat={onRunTestInChat} />
            </motion.div>
          )}

          {activeSubTab === 'guide' && (
            <motion.div
              key="guide"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
            >
              <StudentGuideModal onStartDemoStep={onRunTestInChat} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
export default PrivateToolsView;
