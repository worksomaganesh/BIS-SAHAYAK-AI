import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ComplianceDossierData, downloadDossierTextFile } from '../utils/dossierGenerator';
import { useLanguage } from '../context/LanguageContext';

interface ComplianceDossierModalProps {
  dossier: ComplianceDossierData | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ComplianceDossierModal: React.FC<ComplianceDossierModalProps> = ({
  dossier,
  isOpen,
  onClose,
}) => {
  const { language } = useLanguage();
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState(false);

  if (!isOpen || !dossier) return null;

  const toggleCheck = (id: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(dossier.dossierId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-zinc-950/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 md:p-6 modal-backdrop-print font-sans">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ type: 'spring', duration: 0.35, bounce: 0 }}
          className="relative w-full max-w-4xl bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl overflow-hidden border border-zinc-300 dark:border-zinc-800 flex flex-col max-h-[92vh]"
        >
          {/* Modal Chrome Header (Hidden on Print) */}
          <div className="no-print px-5 py-4 bg-zinc-950 text-white flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 shrink-0 font-mono">
            <div>
              <h3 className="text-sm font-bold font-display flex items-center gap-2">
                <span>[ OFFICIAL COMPLIANCE DOSSIER ]</span>
                <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 text-[10px] border border-zinc-700">
                  A4 PRINTABLE REPORT
                </span>
              </h3>
              <p className="text-xs text-zinc-400">
                Ref: {dossier.dossierId}
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs">
              {/* Print / Save PDF Button */}
              <button
                type="button"
                onClick={handlePrint}
                className="px-3.5 py-1.5 bg-white text-zinc-950 hover:bg-zinc-200 font-bold rounded-lg transition-colors cursor-pointer uppercase"
                title="Print or Save as PDF"
              >
                [ Print / Save PDF ]
              </button>

              {/* Download Markdown / Text File */}
              <button
                type="button"
                onClick={() => downloadDossierTextFile(dossier)}
                className="px-3.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 font-bold rounded-lg transition-colors cursor-pointer border border-zinc-700 uppercase"
                title="Download Markdown summary"
              >
                [ Export Text (.md) ]
              </button>

              {/* Close Button */}
              <button
                type="button"
                onClick={onClose}
                className="px-2.5 py-1 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer ml-1 border border-zinc-800 font-bold uppercase"
                title="Close"
              >
                [ Close ]
              </button>
            </div>
          </div>

          {/* Printable Document Container */}
          <div className="overflow-y-auto p-4 sm:p-8 bg-zinc-100 dark:bg-zinc-950 flex justify-center">
            <div
              id="compliance-dossier-print-container"
              className="relative w-full max-w-3xl bg-white dark:bg-zinc-900 p-6 sm:p-10 shadow-lg border border-zinc-300 dark:border-zinc-800 text-zinc-950 dark:text-zinc-100 font-sans print:shadow-none print:border-none print:p-0"
              style={{ minHeight: '297mm' }}
            >
              {/* Subtle Diagonal Watermark */}
              <div className="pointer-events-none absolute inset-0 overflow-hidden flex items-center justify-center opacity-[0.035] select-none z-0">
                <div className="text-zinc-950 font-mono font-black text-4xl sm:text-5xl -rotate-45 tracking-widest text-center uppercase leading-snug">
                  INFORMATIONAL ADVISORY DEMO
                  <br />
                  NOT AN OFFICIAL BIS CERTIFICATE
                </div>
              </div>

              <div className="relative z-10 space-y-6">
                {/* 1. Formal Document Header */}
                <div className="border-b-2 border-zinc-950 dark:border-zinc-700 pb-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                          [ BUREAU OF INDIAN STANDARDS — DECISION SUPPORT SYSTEM ]
                        </span>
                      </div>
                      <h1 className="text-2xl sm:text-3xl font-serif tracking-tight text-zinc-950 dark:text-white">
                        REGULATORY COMPLIANCE ADVISORY DOSSIER
                      </h1>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 font-serif italic">
                        Scheme-I / Scheme-II Factory Audit, Testing Schedule & Licensing Readiness Assessment
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="inline-block p-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded text-center font-mono">
                        <div className="text-[9px] text-zinc-500 uppercase">[ Standard ]</div>
                        <div className="text-sm font-bold text-zinc-950 dark:text-white">
                          {dossier.standardMetadata.isNumber}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Metadata Sub-Header Bar */}
                  <div className="mt-4 pt-3 border-t border-zinc-200 dark:border-zinc-800 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono">
                    <div className="flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300">
                      <span>Ref: <strong>{dossier.dossierId}</strong></span>
                      <button
                        type="button"
                        onClick={handleCopyId}
                        className="no-print text-zinc-500 hover:text-zinc-950 dark:hover:text-white transition-colors uppercase text-[10px] font-bold"
                        title="Copy Reference ID"
                      >
                        {copiedId ? '[Copied]' : '[Copy]'}
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300">
                      <span>Date: <strong>{dossier.generatedDateIST}</strong></span>
                    </div>

                    <div className="flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300 sm:justify-end">
                      <span className="text-[11px] truncate" title={dossier.verificationHash}>
                        Hash: {dossier.verificationHash.slice(0, 18)}...
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. Standard Identification Matrix */}
                <div className="print-avoid-break space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-950 dark:text-white">
                      [ 1. Standard Identification & Legal Mandate ]
                    </h2>
                    {dossier.standardMetadata.mandatoryQCO && (
                      <span className="px-2 py-0.5 bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950 font-mono text-[10px] font-bold rounded">
                        [ MANDATORY QCO ENFORCED ]
                      </span>
                    )}
                  </div>

                  <div className="bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-300 dark:border-zinc-700 rounded-lg p-4 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-zinc-500 font-mono text-[10px] uppercase block">Official Title</span>
                        <span className="font-bold text-zinc-950 dark:text-white font-display text-sm">
                          {dossier.standardMetadata.title}
                        </span>
                      </div>
                      <div>
                        <span className="text-zinc-500 font-mono text-[10px] uppercase block">Sector / Category</span>
                        <span className="font-medium text-zinc-800 dark:text-zinc-200 font-mono">
                          {dossier.standardMetadata.category}
                        </span>
                      </div>
                      <div>
                        <span className="text-zinc-500 font-mono text-[10px] uppercase block">Certification Scheme</span>
                        <span className="font-medium text-zinc-800 dark:text-zinc-200 font-mono">
                          {dossier.standardMetadata.scheme}
                        </span>
                      </div>
                      <div>
                        <span className="text-zinc-500 font-mono text-[10px] uppercase block">Gazette Regulatory Basis</span>
                        <span className="font-medium text-zinc-800 dark:text-zinc-200">
                          {dossier.standardMetadata.gazetteReference}
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-zinc-200 dark:border-zinc-700 text-xs">
                      <span className="text-zinc-500 font-mono text-[10px] uppercase block mb-1">
                        Executive Scope Summary:
                      </span>
                      <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed font-sans">
                        {dossier.standardMetadata.scopeAndSummary}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 3. Mandatory Laboratory Testing & STI Parameters */}
                <div className="print-avoid-break space-y-3 font-sans">
                  <div className="flex items-center justify-between font-mono">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-950 dark:text-white">
                      [ 2. Mandatory Testing Schedule (STI Annexure) ]
                    </h2>
                    <span className="text-[10px] text-zinc-500">
                      Doc Ref: {dossier.testingSchedule.stiAnnexureRef}
                    </span>
                  </div>

                  <p className="text-xs text-zinc-600 dark:text-zinc-400 italic">
                    {dossier.testingSchedule.inHouseLaboratoryMandate}
                  </p>

                  <div className="overflow-x-auto border border-zinc-300 dark:border-zinc-700 rounded-lg font-mono">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-zinc-100 dark:bg-zinc-800 border-b border-zinc-300 dark:border-zinc-700 text-[11px] text-zinc-900 dark:text-zinc-100">
                        <tr>
                          <th className="py-2.5 px-3 font-bold uppercase">[ Parameter ]</th>
                          <th className="py-2.5 px-3 font-bold uppercase">[ Category ]</th>
                          <th className="py-2.5 px-3 font-bold uppercase">[ Frequency ]</th>
                          <th className="py-2.5 px-3 font-bold uppercase">[ Tolerance ]</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 bg-white dark:bg-zinc-900">
                        {dossier.testingSchedule.testingParameters.map((param, idx) => (
                          <tr key={idx} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                            <td className="py-2.5 px-3 font-medium text-zinc-950 dark:text-white max-w-xs font-sans">
                              {param.parameter}
                            </td>
                            <td className="py-2.5 px-3 text-[11px] text-zinc-600 dark:text-zinc-400">
                              <span className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
                                {param.category}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-zinc-700 dark:text-zinc-300 text-[11px]">
                              {param.frequency}
                            </td>
                            <td className="py-2.5 px-3 text-[11px] text-zinc-950 dark:text-white font-semibold">
                              {param.toleranceBenchmark}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 4. 4-Phase Implementation & Audit Roadmap */}
                <div className="print-avoid-break space-y-3">
                  <div className="flex items-center justify-between font-mono">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-950 dark:text-white">
                      [ 3. 4-Phase Factory Audit & Implementation Checklist ]
                    </h2>
                    <span className="text-[10px] text-zinc-500">
                      Standard Duration: 8 - 12 Weeks
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {dossier.factoryAuditSchedule.map((stage, sIdx) => (
                      <div
                        key={sIdx}
                        className="bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-300 dark:border-zinc-700 rounded-lg p-3.5 space-y-2 font-mono"
                      >
                        <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-700 pb-1.5">
                          <span className="text-[10px] font-bold text-zinc-700 dark:text-zinc-300 uppercase">
                            [ {stage.phase} ]
                          </span>
                          <span className="text-[10px] text-zinc-500 bg-white dark:bg-zinc-800 px-1.5 py-0.5 rounded border border-zinc-200 dark:border-zinc-700">
                            {stage.duration}
                          </span>
                        </div>

                        <h4 className="font-bold text-xs text-zinc-950 dark:text-white font-sans">
                          {stage.title}
                        </h4>

                        <div className="space-y-1.5 pt-1">
                          {stage.items.map((item, iIdx) => {
                            const itemId = `check-${sIdx}-${iIdx}`;
                            const isChecked = checkedItems[itemId] || false;

                            return (
                              <div
                                key={iIdx}
                                onClick={() => toggleCheck(itemId)}
                                className="flex items-start gap-2 text-[11px] leading-snug text-zinc-700 dark:text-zinc-300 cursor-pointer select-none font-sans"
                              >
                                <span className="font-mono text-xs font-bold shrink-0">
                                  {isChecked ? '[✓]' : '[ ]'}
                                </span>
                                <span className={isChecked ? 'line-through text-zinc-400' : ''}>
                                  {item}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 5. Indicative Fee & MSME Concessions Summary */}
                <div className="print-avoid-break space-y-3 font-mono">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-950 dark:text-white">
                      [ 4. Indicative Fee Structure & MSME Subsidies ]
                    </h2>
                    <span className="text-[10px] text-zinc-500">
                      As per BIS Reg. 2018
                    </span>
                  </div>

                  <div className="bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-300 dark:border-zinc-700 rounded-lg p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2.5 gap-x-4 text-xs">
                      <div className="flex justify-between border-b border-zinc-200 dark:border-zinc-700 pb-1">
                        <span className="text-zinc-600 dark:text-zinc-400">Application Filing Fee:</span>
                        <span className="font-bold text-zinc-950 dark:text-white">{dossier.indicativeFeeSummary.applicationFee}</span>
                      </div>
                      <div className="flex justify-between border-b border-zinc-200 dark:border-zinc-700 pb-1">
                        <span className="text-zinc-600 dark:text-zinc-400">Factory Audit Rate:</span>
                        <span className="font-bold text-zinc-950 dark:text-white">{dossier.indicativeFeeSummary.auditCharge}</span>
                      </div>
                      <div className="flex justify-between border-b border-zinc-200 dark:border-zinc-700 pb-1">
                        <span className="text-zinc-600 dark:text-zinc-400">Sample Testing Baseline:</span>
                        <span className="font-bold text-zinc-950 dark:text-white">{dossier.indicativeFeeSummary.sampleTestingEstimate}</span>
                      </div>
                      <div className="flex justify-between border-b border-zinc-200 dark:border-zinc-700 pb-1">
                        <span className="text-zinc-600 dark:text-zinc-400">Advance Marking Fee:</span>
                        <span className="font-bold text-zinc-950 dark:text-white">{dossier.indicativeFeeSummary.minimumMarkingFee}</span>
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-zinc-200 dark:border-zinc-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                      <div className="text-[11px] text-zinc-600 dark:text-zinc-400 font-sans">
                        <strong>MSME Policy:</strong> {dossier.indicativeFeeSummary.msmeConcessions}
                      </div>
                      <div className="bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950 px-3 py-1.5 rounded text-right shrink-0">
                        <span className="text-[10px] text-zinc-400 dark:text-zinc-600 block uppercase">1st Year Budget Est.</span>
                        <span className="font-bold">{dossier.indicativeFeeSummary.totalEstimatedFirstYear}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 6. Official Verification Sources */}
                <div className="print-avoid-break space-y-2 pt-2 font-mono">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-950 dark:text-white">
                    [ 5. Verified Government Portals & Sources ]
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {dossier.officialVerificationSources.map((src, idx) => (
                      <a
                        key={idx}
                        href={src.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-300 dark:border-zinc-700 rounded-lg hover:bg-zinc-100 transition-colors block text-xs"
                      >
                        <span className="font-bold text-zinc-950 dark:text-white block text-[11px] truncate">
                          {src.label}
                        </span>
                        <span className="text-[10px] text-zinc-600 dark:text-zinc-400 underline truncate block mt-0.5">
                          {src.url}
                        </span>
                        <p className="text-[10px] text-zinc-500 line-clamp-2 mt-1 leading-tight font-sans">
                          {src.description}
                        </p>
                      </a>
                    ))}
                  </div>
                </div>

                {/* 7. Legal Disclaimer Footer Banner */}
                <div className="print-avoid-break border-t-2 border-zinc-950 dark:border-zinc-700 pt-4 space-y-2">
                  <div className="p-3 bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-300 dark:border-zinc-700 rounded-lg text-[11px] text-zinc-800 dark:text-zinc-200 leading-relaxed font-sans">
                    <strong>[ STATUTORY DISCLAIMER ]:</strong> {dossier.legalDisclaimer}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono text-zinc-500 pt-1 uppercase">
                    <span>BIS Sahayak AI Decision Support System</span>
                    <span>Confidential Regulatory Working Document</span>
                    <span>Verify at www.manakonline.in</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ComplianceDossierModal;
