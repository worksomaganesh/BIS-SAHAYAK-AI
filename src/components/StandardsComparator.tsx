import React, { useState } from 'react';
import { KnowledgeRecord } from '../types';
import { BIS_KNOWLEDGE_BASE } from '../data/bisKnowledgeBase';
import { useLanguage } from '../context/LanguageContext';
import { ComplianceDossierModal } from './ComplianceDossierModal';
import { ComplianceDossierData, generateDossierFromRecord } from '../utils/dossierGenerator';

interface StandardsComparatorProps {
  onAskAboutStandard: (prompt: string) => void;
  defaultStandardAId?: string;
  defaultStandardBId?: string;
}

export const StandardsComparator: React.FC<StandardsComparatorProps> = ({
  onAskAboutStandard,
  defaultStandardAId = 'is-14543-packaged-water',
  defaultStandardBId = 'is-10500-drinking-water',
}) => {
  const { language } = useLanguage();

  const [standardAId, setStandardAId] = useState<string>(defaultStandardAId);
  const [standardBId, setStandardBId] = useState<string>(defaultStandardBId);
  const [activeDossier, setActiveDossier] = useState<ComplianceDossierData | null>(null);

  const availableStandards = BIS_KNOWLEDGE_BASE;

  const standardA = availableStandards.find((s) => s.id === standardAId) || availableStandards[0];
  const standardB = availableStandards.find((s) => s.id === standardBId) || availableStandards[1];

  const isSameSelection = standardAId === standardBId;

  // Preset comparison pairs
  const PRESETS = [
    {
      label: 'Packaged Water vs Tap Water (IS 14543 vs IS 10500)',
      idA: 'is-14543-packaged-water',
      idB: 'is-10500-drinking-water',
      category: 'Drinking Water & Health',
    },
    {
      label: 'OPC vs PPC Cement (IS 269 vs IS 1489)',
      idA: 'is-269-opc-cement',
      idB: 'is-1489-ppc-cement',
      category: 'Construction & Civil',
    },
    {
      label: 'TMT Steel Rebars vs Structural Cement (IS 1786 vs IS 269)',
      idA: 'is-1786-tmt-steel',
      idB: 'is-269-opc-cement',
      category: 'Infrastructure',
    },
    {
      label: 'Gold Jewelry vs Hallmarking Centres (IS 1417 vs IS 15820)',
      idA: 'is-1417-gold-hallmarking',
      idB: 'is-15820-ah-centre',
      category: 'Precious Metals',
    },
    {
      label: 'Toy Safety vs IT Equipment CRS (IS 9873 vs IS 13252)',
      idA: 'is-9873-toy-safety',
      idB: 'is-13252-it-electronics',
      category: 'Consumer & Electronics',
    },
  ];

  const handleSwap = () => {
    const temp = standardAId;
    setStandardAId(standardBId);
    setStandardBId(temp);
  };

  const handleCompareInChat = () => {
    let prompt = `Provide a detailed side-by-side technical and regulatory comparison between ${standardA.isNumber || standardA.title} and ${standardB.isNumber || standardB.title}. Explain the key differences in scope, mandatory QCO status, laboratory testing requirements, and licensing schemes.`;
    if (language === 'te') {
      prompt = `${standardA.isNumber || standardA.title} మరియు ${standardB.isNumber || standardB.title} మధ్య సమగ్ర పోలికను వివరించండి. పరిధి, తప్పనిసరి QCO నిబంధనలు, ల్యాబ్ టెస్టింగ్ అవసరాలు మరియు లైసెన్సింగ్ విధానాల మధ్య ముఖ్య తేడాలను తెలియజేయండి.`;
    } else if (language === 'hi') {
      prompt = `${standardA.isNumber || standardA.title} और ${standardB.isNumber || standardB.title} के बीच तकनीकी एवं विनियामक तुलना विस्तार से समझाएं। दोनों के कार्यक्षेत्र, अनिवार्य QCO स्थिति, प्रयोगशाला परीक्षण और प्रमाणन योजनाओं में मुख्य अंतर बताएं।`;
    }
    onAskAboutStandard(prompt);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header Banner (Text-First) */}
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-300 dark:border-zinc-800 shadow-xs space-y-4 font-mono">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                [ REGULATORY COMPARISON MATRIX ]
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif text-zinc-950 dark:text-white">
              Standards Side-by-Side Comparator
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-sans max-w-2xl">
              Compare any two Indian Standards across mandatory QCO status, certification schemes, testing parameters, and compliance scopes.
            </p>
          </div>

          <button
            type="button"
            onClick={handleCompareInChat}
            disabled={isSameSelection}
            className="px-5 py-2.5 bg-zinc-950 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-white disabled:bg-zinc-300 dark:disabled:bg-zinc-800 text-white dark:text-zinc-950 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer shrink-0 uppercase tracking-wider"
          >
            [ Ask AI Comparative Analysis → ]
          </button>
        </div>

        {/* Quick Presets Bar */}
        <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 space-y-2">
          <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider block">
            [ Popular Comparison Presets ]:
          </span>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setStandardAId(preset.idA);
                  setStandardBId(preset.idB);
                }}
                className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                  standardAId === preset.idA && standardBId === preset.idB
                    ? 'bg-zinc-950 text-white border-zinc-950 dark:bg-zinc-100 dark:text-zinc-950 dark:border-white shadow-2xs'
                    : 'bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 border-zinc-300 dark:border-zinc-700'
                }`}
              >
                [ {preset.label} ]
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Selectors Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center font-mono">
        {/* Selector Standard A */}
        <div className="md:col-span-5 bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-300 dark:border-zinc-800 shadow-2xs space-y-1.5">
          <label className="block text-xs font-bold text-zinc-500 uppercase">
            [ Standard A (Left Column) ]
          </label>
          <select
            id="select-standard-a"
            value={standardAId}
            onChange={(e) => setStandardAId(e.target.value)}
            className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 focus:border-zinc-950 dark:focus:border-zinc-200 rounded-lg text-xs font-semibold text-zinc-950 dark:text-white outline-none transition-all cursor-pointer"
          >
            {availableStandards.map((s) => (
              <option key={s.id} value={s.id}>
                {s.isNumber || s.citationLabel} — {s.title.substring(0, 45)}...
              </option>
            ))}
          </select>
        </div>

        {/* Swap Button */}
        <div className="md:col-span-2 flex justify-center">
          <button
            type="button"
            onClick={handleSwap}
            title="Swap Standard A and Standard B"
            className="p-3 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100 rounded-xl border border-zinc-300 dark:border-zinc-700 transition-colors cursor-pointer shadow-2xs text-xs font-bold uppercase tracking-wider"
          >
            [ Swap ⇄ ]
          </button>
        </div>

        {/* Selector Standard B */}
        <div className="md:col-span-5 bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-300 dark:border-zinc-800 shadow-2xs space-y-1.5">
          <label className="block text-xs font-bold text-zinc-500 uppercase">
            [ Standard B (Right Column) ]
          </label>
          <select
            id="select-standard-b"
            value={standardBId}
            onChange={(e) => setStandardBId(e.target.value)}
            className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 focus:border-zinc-950 dark:focus:border-zinc-200 rounded-lg text-xs font-semibold text-zinc-950 dark:text-white outline-none transition-all cursor-pointer"
          >
            {availableStandards.map((s) => (
              <option key={s.id} value={s.id}>
                {s.isNumber || s.citationLabel} — {s.title.substring(0, 45)}...
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Duplicate Warning */}
      {isSameSelection && (
        <div className="p-4 bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl flex items-center justify-between gap-3 text-zinc-900 dark:text-zinc-100 text-xs font-mono">
          <div>
            <span className="font-bold uppercase">[ NOTICE ]: </span>
            <span>You have selected the same standard for both columns. Please choose two different standards to compare.</span>
          </div>
          <button
            type="button"
            onClick={() => {
              const diff = availableStandards.find((s) => s.id !== standardAId);
              if (diff) setStandardBId(diff.id);
            }}
            className="px-3 py-1.5 bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 font-bold rounded-lg cursor-pointer shrink-0 uppercase"
          >
            [ Select Different ]
          </button>
        </div>
      )}

      {/* Side-by-Side Comparison Matrix */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-300 dark:border-zinc-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-zinc-950 text-white font-mono text-xs">
                <th className="p-4 w-1/4 border-r border-zinc-800 font-bold uppercase tracking-wider">
                  [ PARAMETER ]
                </th>
                <th className="p-4 w-[37.5%] border-r border-zinc-800 font-bold">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-sm">
                      {standardA.isNumber || standardA.citationLabel}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                      [ Standard A ]
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 font-normal mt-1 line-clamp-1 font-sans">
                    {standardA.title}
                  </p>
                </th>
                <th className="p-4 w-[37.5%] font-bold">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-sm">
                      {standardB.isNumber || standardB.citationLabel}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                      [ Standard B ]
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 font-normal mt-1 line-clamp-1 font-sans">
                    {standardB.title}
                  </p>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-xs font-sans">
              {/* Row 1: Target Product / Sector */}
              <tr className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                <td className="p-4 font-mono font-bold text-zinc-950 dark:text-white bg-zinc-50/50 dark:bg-zinc-900/50 border-r border-zinc-200 dark:border-zinc-800">
                  Product & Sector
                </td>
                <td className="p-4 border-r border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200">
                  <p className="font-semibold text-zinc-950 dark:text-white">{standardA.title}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-mono text-[10px]">
                    {standardA.category || standardA.topic}
                  </span>
                </td>
                <td className="p-4 text-zinc-800 dark:text-zinc-200">
                  <p className="font-semibold text-zinc-950 dark:text-white">{standardB.title}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-mono text-[10px]">
                    {standardB.category || standardB.topic}
                  </span>
                </td>
              </tr>

              {/* Row 2: Mandatory QCO Status */}
              <tr className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                <td className="p-4 font-mono font-bold text-zinc-950 dark:text-white bg-zinc-50/50 dark:bg-zinc-900/50 border-r border-zinc-200 dark:border-zinc-800">
                  Mandatory QCO Status
                </td>
                <td className="p-4 border-r border-zinc-200 dark:border-zinc-800">
                  {standardA.mandatoryQCO ? (
                    <div className="space-y-1">
                      <span className="inline-block px-2.5 py-1 rounded bg-zinc-950 dark:bg-zinc-100 text-white dark:text-zinc-950 font-mono font-bold text-[11px] uppercase">
                        [ MANDATORY (COMPULSORY QCO) ]
                      </span>
                      <p className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-1">
                        Cannot be manufactured, stored, or sold in India without valid BIS license.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <span className="inline-block px-2.5 py-1 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-mono font-bold text-[11px] uppercase">
                        [ VOLUNTARY / BENCHMARK SPEC ]
                      </span>
                      <p className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-1">
                        Serves as national benchmark reference for testing & public utilities.
                      </p>
                    </div>
                  )}
                </td>
                <td className="p-4">
                  {standardB.mandatoryQCO ? (
                    <div className="space-y-1">
                      <span className="inline-block px-2.5 py-1 rounded bg-zinc-950 dark:bg-zinc-100 text-white dark:text-zinc-950 font-mono font-bold text-[11px] uppercase">
                        [ MANDATORY (COMPULSORY QCO) ]
                      </span>
                      <p className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-1">
                        Cannot be manufactured, stored, or sold in India without valid BIS license.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <span className="inline-block px-2.5 py-1 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-mono font-bold text-[11px] uppercase">
                        [ VOLUNTARY / BENCHMARK SPEC ]
                      </span>
                      <p className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-1">
                        Serves as national benchmark reference for testing & public utilities.
                      </p>
                    </div>
                  )}
                </td>
              </tr>

              {/* Row 3: Certification Scheme */}
              <tr className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                <td className="p-4 font-mono font-bold text-zinc-950 dark:text-white bg-zinc-50/50 dark:bg-zinc-900/50 border-r border-zinc-200 dark:border-zinc-800">
                  Certification Scheme
                </td>
                <td className="p-4 border-r border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200">
                  <p className="font-mono font-bold text-zinc-950 dark:text-white">
                    {standardA.certificationScheme || standardA.scheme || 'Scheme-I (ISI Mark)'}
                  </p>
                  <p className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-0.5">
                    Requires factory audit, sample verification, and CM/L licence grant.
                  </p>
                </td>
                <td className="p-4 text-zinc-800 dark:text-zinc-200">
                  <p className="font-mono font-bold text-zinc-950 dark:text-white">
                    {standardB.certificationScheme || standardB.scheme || 'Scheme-I (ISI Mark)'}
                  </p>
                  <p className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-0.5">
                    Requires factory audit, sample verification, and CM/L licence grant.
                  </p>
                </td>
              </tr>

              {/* Row 4: Scope */}
              <tr className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                <td className="p-4 font-mono font-bold text-zinc-950 dark:text-white bg-zinc-50/50 dark:bg-zinc-900/50 border-r border-zinc-200 dark:border-zinc-800">
                  Scope & Objectives
                </td>
                <td className="p-4 border-r border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  {standardA.scopeAndSummary || standardA.content}
                </td>
                <td className="p-4 text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  {standardB.scopeAndSummary || standardB.content}
                </td>
              </tr>

              {/* Row 5: Testing */}
              <tr className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                <td className="p-4 font-mono font-bold text-zinc-950 dark:text-white bg-zinc-50/50 dark:bg-zinc-900/50 border-r border-zinc-200 dark:border-zinc-800">
                  Key Testing & Labs
                </td>
                <td className="p-4 border-r border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300">
                  <p className="text-xs leading-relaxed">
                    {standardA.testingAndLabRequirements || 'Standard in-house factory testing and NABL/BIS laboratory conformity testing.'}
                  </p>
                </td>
                <td className="p-4 text-zinc-700 dark:text-zinc-300">
                  <p className="text-xs leading-relaxed">
                    {standardB.testingAndLabRequirements || 'Standard in-house factory testing and NABL/BIS laboratory conformity testing.'}
                  </p>
                </td>
              </tr>

              {/* Row 6: Key Highlights */}
              <tr className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                <td className="p-4 font-mono font-bold text-zinc-950 dark:text-white bg-zinc-50/50 dark:bg-zinc-900/50 border-r border-zinc-200 dark:border-zinc-800">
                  Key Highlights
                </td>
                <td className="p-4 border-r border-zinc-200 dark:border-zinc-800">
                  <ul className="space-y-1.5 text-xs text-zinc-700 dark:text-zinc-300 font-mono">
                    {standardA.keyHighlights?.map((h, i) => (
                      <li key={i} className="font-sans">
                        • {h}
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="p-4">
                  <ul className="space-y-1.5 text-xs text-zinc-700 dark:text-zinc-300 font-mono">
                    {standardB.keyHighlights?.map((h, i) => (
                      <li key={i} className="font-sans">
                        • {h}
                      </li>
                    ))}
                  </ul>
                </td>
              </tr>

              {/* Row 7: Actions */}
              <tr className="bg-zinc-50/30 dark:bg-zinc-900/30 font-mono">
                <td className="p-4 font-bold text-zinc-950 dark:text-white bg-zinc-50/50 dark:bg-zinc-900/50 border-r border-zinc-200 dark:border-zinc-800">
                  Actions
                </td>
                <td className="p-4 border-r border-zinc-200 dark:border-zinc-800">
                  <div className="flex flex-wrap gap-2">
                    {standardA.officialPortalUrl && (
                      <a
                        href={standardA.officialPortalUrl}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100 text-xs font-bold uppercase"
                      >
                        [ Portal → ]
                      </a>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        const dossier = generateDossierFromRecord(standardA, language);
                        setActiveDossier(dossier);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100 text-xs font-bold uppercase cursor-pointer"
                    >
                      [ Dossier ]
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        onAskAboutStandard(
                          `Explain licensing and testing for ${standardA.isNumber || standardA.title}`
                        )
                      }
                      className="px-3 py-1.5 rounded-lg bg-zinc-950 dark:bg-zinc-100 hover:bg-zinc-800 text-white dark:text-zinc-950 text-xs font-bold uppercase cursor-pointer"
                    >
                      [ Ask AI → ]
                    </button>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex flex-wrap gap-2">
                    {standardB.officialPortalUrl && (
                      <a
                        href={standardB.officialPortalUrl}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100 text-xs font-bold uppercase"
                      >
                        [ Portal → ]
                      </a>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        const dossier = generateDossierFromRecord(standardB, language);
                        setActiveDossier(dossier);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100 text-xs font-bold uppercase cursor-pointer"
                    >
                      [ Dossier ]
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        onAskAboutStandard(
                          `Explain licensing and testing for ${standardB.isNumber || standardB.title}`
                        )
                      }
                      className="px-3 py-1.5 rounded-lg bg-zinc-950 dark:bg-zinc-100 hover:bg-zinc-800 text-white dark:text-zinc-950 text-xs font-bold uppercase cursor-pointer"
                    >
                      [ Ask AI → ]
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Compliance Dossier Printable Modal */}
      <ComplianceDossierModal
        dossier={activeDossier}
        isOpen={!!activeDossier}
        onClose={() => setActiveDossier(null)}
      />
    </div>
  );
};
export default StandardsComparator;
