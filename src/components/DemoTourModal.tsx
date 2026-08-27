import React, { useState } from 'react';
import { motion } from 'motion/react';
import { NavigationTab } from '../types';

interface DemoTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRunPrompt: (prompt: string) => void;
  onSwitchTab: (tab: NavigationTab) => void;
}

const TOUR_STEPS = [
  {
    step: 1,
    tab: 'chat' as const,
    title: '1. Project Objective & Prototype Scope',
    speech: '"Respected Judges, we built BIS Sahayak AI to solve a major pain point for manufacturers and startups: navigating complex Indian Standards without hallucinations."',
    prompt: null,
    actionLabel: 'Go to Assistant'
  },
  {
    step: 2,
    tab: 'chat' as const,
    title: '2. General Procedural Query (Know Your Standard)',
    speech: '"First, let us ask how a user discovers standards on the official Manakonline portal using the Know Your Standard facility."',
    prompt: 'How can I search for an Indian Standard on Manakonline using Know Your Standard?',
    actionLabel: 'Ask: "How to search KYS?"'
  },
  {
    step: 3,
    tab: 'chat' as const,
    title: '3. Product-Specific Standard Query (Drinking Water)',
    speech: '"Now query for a commercial product: Packaged Drinking Water. Notice how it retrieves IS 14543:2024, identifies Scheme-I ISI Mark, and lists in-house testing rules."',
    prompt: 'What are the mandatory BIS requirements for Packaged Drinking Water under IS 14543:2024?',
    actionLabel: 'Ask about IS 14543'
  },
  {
    step: 4,
    tab: 'chat' as const,
    title: '4. Grounded Citations & Official Link Verification',
    speech: '"Every factual point in the answer is backed by an interactive citation badge. Users can inspect the exact clause excerpt and verify directly on the official portal."',
    prompt: null,
    actionLabel: 'Inspect Citations'
  },
  {
    step: 5,
    tab: 'chat' as const,
    title: '5. Anti-Hallucination Guardrail (Refusal to Guess Fees)',
    speech: '"When asked for exact current license fees in rupees, BIS Sahayak AI refuses to fabricate figures and directs the user to official gazette notices."',
    prompt: 'Tell me the exact current annual license fee in rupees for my factory certification.',
    actionLabel: 'Test Fee Guardrail'
  },
  {
    step: 6,
    tab: 'chat' as const,
    title: '6. Domain Filter Guardrail (Rejecting Off-Topic)',
    speech: '"To prevent token waste and preserve domain safety, off-topic requests (e.g. sports, movies) trigger a polite redirection back to Indian Standards."',
    prompt: 'Who won the cricket match yesterday?',
    actionLabel: 'Test Off-Topic Filter'
  },
  {
    step: 7,
    tab: 'catalog' as const,
    title: '7. Standards Catalog & QCO Explorer',
    speech: '"We built a fast directory allowing stakeholders to filter by Mandatory Quality Control Orders (QCOs) and launch direct AI inquiries."',
    prompt: null,
    actionLabel: 'Open Standards Catalog'
  },
  {
    step: 8,
    tab: 'chat' as const,
    title: '8. Consumer Safety & Toy Certification (IS 9873)',
    speech: '"For toy safety under IS 9873, the assistant highlights mandatory testing parameters for heavy metal migration and mechanical safety."',
    prompt: 'Is BIS certification mandatory for selling toys in India under IS 9873?',
    actionLabel: 'Ask Toy Safety'
  },
  {
    step: 9,
    tab: 'test' as const,
    title: '9. Hackathon Evaluation Lab (Automated Benchmarks)',
    speech: '"Our Evaluation Lab contains automated benchmark cases with token latency tracking and similarity scoring breakdown."',
    prompt: null,
    actionLabel: 'Open Architecture Lab'
  },
  {
    step: 10,
    tab: 'guide' as const,
    title: '10. Summary & Deterministic Offline Fallback',
    speech: '"In conclusion, BIS Sahayak AI is 100% document-grounded, server-side secured, and features a deterministic local engine that functions even offline."',
    prompt: null,
    actionLabel: 'View Presentation Guide'
  }
];

export const DemoTourModal: React.FC<DemoTourModalProps> = ({
  isOpen,
  onClose,
  onRunPrompt,
  onSwitchTab,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  if (!isOpen) return null;

  const currentStep = TOUR_STEPS[currentStepIndex];

  const handleExecuteCurrentStep = () => {
    onSwitchTab(currentStep.tab);
    if (currentStep.prompt) {
      onRunPrompt(currentStep.prompt);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-xs font-sans">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-zinc-900 rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-zinc-300 dark:border-zinc-800 relative space-y-4 font-mono"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 px-2.5 py-1 text-zinc-500 hover:text-zinc-950 dark:hover:text-white rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-bold transition-colors cursor-pointer border border-zinc-300 dark:border-zinc-700 uppercase"
        >
          [ Close ]
        </button>

        {/* Step Indicator */}
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950 text-[10px] font-bold">
            [ STEP {currentStep.step} / {TOUR_STEPS.length} ]
          </span>
          <span className="text-xs text-zinc-500 uppercase tracking-wider">
            [ JURY DEMONSTRATION TOUR ]
          </span>
        </div>

        {/* Title */}
        <h3 className="text-2xl font-serif text-zinc-950 dark:text-white">
          {currentStep.title}
        </h3>

        {/* Presenter's Speech Box */}
        <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-300 dark:border-zinc-700 rounded-2xl space-y-1.5 font-sans">
          <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-wider block">
            [ Suggested Presentation Script ]:
          </span>
          <p className="text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 italic leading-relaxed">
            {currentStep.speech}
          </p>
        </div>

        {/* Sample Prompt Preview */}
        {currentStep.prompt && (
          <div className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-xl border border-zinc-300 dark:border-zinc-700 text-xs text-zinc-950 dark:text-zinc-100 font-mono">
            <span className="text-zinc-500 select-none">[ TEST QUERY ]: </span>
            &quot;{currentStep.prompt}&quot;
          </div>
        )}

        {/* Navigation Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-zinc-200 dark:border-zinc-800 font-mono text-xs">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentStepIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentStepIndex === 0}
              className="px-2.5 py-1.5 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white disabled:opacity-30 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer border border-zinc-300 dark:border-zinc-700 font-bold uppercase"
            >
              [ ← Prev ]
            </button>
            <span className="text-zinc-500 px-1">
              {currentStepIndex + 1}/{TOUR_STEPS.length}
            </span>
            <button
              onClick={() =>
                setCurrentStepIndex((prev) => Math.min(TOUR_STEPS.length - 1, prev + 1))
              }
              disabled={currentStepIndex === TOUR_STEPS.length - 1}
              className="px-2.5 py-1.5 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white disabled:opacity-30 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer border border-zinc-300 dark:border-zinc-700 font-bold uppercase"
            >
              [ Next → ]
            </button>
          </div>

          <button
            onClick={handleExecuteCurrentStep}
            className="px-5 py-2.5 bg-zinc-950 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-white text-white dark:text-zinc-950 text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer uppercase tracking-wider"
          >
            [ {currentStep.actionLabel} → ]
          </button>
        </div>
      </motion.div>
    </div>
  );
};
export default DemoTourModal;
