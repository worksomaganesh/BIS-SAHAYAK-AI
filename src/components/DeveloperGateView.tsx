import React, { useState } from 'react';
import { motion } from 'motion/react';

interface DeveloperGateViewProps {
  onUnlockSuccess: () => void;
  onCancel: () => void;
}

export const DeveloperGateView: React.FC<DeveloperGateViewProps> = ({
  onUnlockSuccess,
  onCancel,
}) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Accepted authorized passcodes for developer/jury access
  const VALID_PASSCODES = ['bis@2026', 'sih26107', 'developer', 'admin', 'bis2026', 'sih'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanInput = password.trim().toLowerCase();
    if (!cleanInput) {
      setError('Please enter the developer passcode.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      if (VALID_PASSCODES.includes(cleanInput)) {
        onUnlockSuccess();
      } else {
        setError('Invalid developer passcode. Use the hackathon passcode hint below.');
        setIsSubmitting(false);
      }
    }, 250);
  };

  const handleQuickDemoUnlock = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      onUnlockSuccess();
    }, 200);
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12 font-mono">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-3xl shadow-xl overflow-hidden"
      >
        {/* Header Ribbon */}
        <div className="bg-zinc-950 p-6 sm:p-7 text-zinc-100 border-b border-zinc-800 relative">
          <div className="flex items-center justify-between mb-3">
            <div className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-zinc-800 text-zinc-300 border border-zinc-700">
              [ RESTRICTED DEVELOPER ROUTE ]
            </div>
            <span className="text-[10px] text-zinc-500">[ SIH26107 // LAB ]</span>
          </div>

          <h2 className="text-xl font-display font-bold text-white tracking-tight font-sans">
            Developer & Jury Authentication
          </h2>
          <p className="text-xs text-zinc-400 font-sans mt-1.5 leading-relaxed">
            This workspace is restricted to project developers, evaluators, and judges to inspect RAG pipeline diagnostics, chunking, and benchmarks.
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-7 space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="dev-passcode" className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5 uppercase tracking-wider">
                [ Developer / Jury Passcode ]
              </label>
              <div>
                <input
                  id="dev-passcode"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="Enter passcode (e.g. sih26107)"
                  className="w-full px-3 py-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl text-sm text-zinc-950 dark:text-white focus:bg-white dark:focus:bg-zinc-900 focus:border-zinc-950 dark:focus:border-white focus:outline-none transition-colors"
                  autoFocus
                />
              </div>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-zinc-900 dark:text-white font-bold mt-1.5"
                >
                  [ Error: {error} ]
                </motion.p>
              )}
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-2.5 px-4 bg-zinc-950 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-white disabled:opacity-50 text-white dark:text-zinc-950 text-xs font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer uppercase"
              >
                <span>{isSubmitting ? '[ Authenticating... ]' : '[ Unlock Developer Suite → ]'}</span>
              </button>

              <button
                type="button"
                onClick={onCancel}
                className="py-2.5 px-3 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-xs font-bold rounded-xl transition-colors cursor-pointer uppercase border border-zinc-300 dark:border-zinc-700"
              >
                [ Cancel ]
              </button>
            </div>
          </form>

          {/* Quick Jury Access Box */}
          <div className="p-3.5 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-300 dark:border-zinc-700 rounded-2xl space-y-2">
            <div className="flex items-center justify-between text-[11px] font-semibold text-zinc-700 dark:text-zinc-300">
              <span>[ Authorized Passcode ]</span>
              <code className="px-1.5 py-0.5 bg-zinc-200 dark:bg-zinc-700 rounded text-zinc-950 dark:text-white font-bold">sih26107</code>
            </div>

            <div className="pt-1 border-t border-zinc-200 dark:border-zinc-700 flex items-center justify-between">
              <span className="text-[11px] text-zinc-500 font-sans">
                Are you evaluating this project?
              </span>
              <button
                type="button"
                onClick={handleQuickDemoUnlock}
                className="text-[11px] font-bold text-zinc-950 dark:text-white underline cursor-pointer uppercase"
              >
                [ One-Click Jury Unlock → ]
              </button>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={onCancel}
              className="text-xs text-zinc-500 hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer uppercase"
            >
              [ ← Return to Public Assistant ]
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
export default DeveloperGateView;
