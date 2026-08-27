import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { KnowledgeRecord } from '../types';
import { BIS_KNOWLEDGE_BASE } from '../data/bisKnowledgeBase';
import { useLanguage } from '../context/LanguageContext';
import { useSpeechToText } from '../hooks/useSpeechToText';
import { StandardsComparator } from './StandardsComparator';
import { FeeEstimator } from './FeeEstimator';
import { ComplianceDossierModal } from './ComplianceDossierModal';
import { ComplianceDossierData, generateDossierFromRecord } from '../utils/dossierGenerator';

export type FindStandardSubTool = 'directory' | 'comparator' | 'estimator';

interface FindStandardViewProps {
  onAskAboutStandard: (prompt: string) => void;
  activeSubTool?: FindStandardSubTool;
  onSubToolChange?: (subTool: FindStandardSubTool) => void;
}

export const FindStandardView: React.FC<FindStandardViewProps> = ({
  onAskAboutStandard,
  activeSubTool: controlledSubTool,
  onSubToolChange,
}) => {
  const { language, t } = useLanguage();
  const [internalSubTool, setInternalSubTool] = useState<FindStandardSubTool>('directory');

  const currentSubTool = controlledSubTool || internalSubTool;
  const setSubTool = (tool: FindStandardSubTool) => {
    setInternalSubTool(tool);
    if (onSubToolChange) onSubToolChange(tool);
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [onlyMandatory, setOnlyMandatory] = useState(false);
  const [activeModalRecord, setActiveModalRecord] = useState<KnowledgeRecord | null>(null);
  const [activeDossier, setActiveDossier] = useState<ComplianceDossierData | null>(null);
  const [speechToast, setSpeechToast] = useState<string | null>(null);

  // Speech to text
  const {
    isListening,
    isSupported: isSpeechSupported,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechToText({
    language,
    onFinalTranscript: (text) => {
      setSearchTerm((prev) => (prev ? `${prev} ${text}` : text));
    },
  });

  const handleToggleVoice = () => {
    if (!isSpeechSupported) {
      setSpeechToast(t.micNotSupported);
      setTimeout(() => setSpeechToast(null), 4000);
      return;
    }
    if (isListening) {
      stopListening();
    } else {
      resetTranscript();
      startListening();
    }
  };

  // Category filter chips
  const CATEGORIES = [
    { label: t.allStandards, value: 'All' },
    { label: language === 'te' ? 'ఆహారం & నీరు' : language === 'hi' ? 'खाद्य एवं जल' : 'Food & Water', value: 'Drinking Water & Beverages' },
    { label: language === 'te' ? 'నిర్మాణం & స్టీల్' : language === 'hi' ? 'निर्माण एवं स्टील' : 'Construction & Steel', value: 'Construction & Steel' },
    { label: language === 'te' ? 'ఎలక్ట్రానిక్స్ / CRS' : language === 'hi' ? 'इलेक्ट्रॉनिक्स / CRS' : 'Electronics / CRS', value: 'Electrical & Electronics' },
    { label: language === 'te' ? 'బొమ్మలు & భద్రత' : language === 'hi' ? 'खिलौने एवं सुरक्षा' : 'Consumer Goods & Toys', value: 'Consumer Safety & Toys' },
    { label: language === 'te' ? 'బంగారు హాల్‌మార్కింగ్' : language === 'hi' ? 'स्वर्ण हॉलमार्किंग' : 'Gold Hallmarking', value: 'Gold & Silver Hallmarking' },
    { label: language === 'te' ? 'రసాయనాలు & ప్లాస్టిక్స్' : language === 'hi' ? 'रसायन एवं पॉलिमर' : 'Chemicals & Polymers', value: 'Chemicals & Plastics' },
    { label: language === 'te' ? 'ల్యాబ్‌లు & పరీక్ష (LRS)' : language === 'hi' ? 'प्रयोगशालाएं (LRS)' : 'Testing & Labs (LRS)', value: 'Laboratories & Testing' },
  ];

  const SUGGESTED_SEARCHES = [
    'IS 14543',
    'Packaged Drinking Water',
    'IS 1786 Steel Rebar',
    'IS 269 Cement',
    'IS 9873 Toy Safety',
    'IS 1417 Gold Hallmarking',
    'IS 13252 Electronics CRS',
    'IS 4151 Helmets',
  ];

  const handleAskSahayak = (record: KnowledgeRecord) => {
    let prompt = `Explain ${record.isNumber || record.title} (${record.title}) and its certification/testing process in simple steps.`;
    if (language === 'te') {
      prompt = `${record.isNumber || record.title} (${record.title}) మరియు దాని సర్టిఫికేషన్/ల్యాబ్ టెస్టింగ్ ప్రక్రియను సులభమైన దశల్లో వివరించండి.`;
    } else if (language === 'hi') {
      prompt = `${record.isNumber || record.title} (${record.title}) और इसकी प्रमाणन/परीक्षण प्रक्रिया को सरल चरणों में समझाएं।`;
    }
    onAskAboutStandard(prompt);
  };

  const handleGenerateChecklist = (record: KnowledgeRecord) => {
    let prompt = `Generate a 4-step actionable BIS Compliance Checklist and certification roadmap for ${record.isNumber || record.title} (${record.title}).`;
    if (language === 'te') {
      prompt = `${record.isNumber || record.title} (${record.title}) కోసం 4-దశల BIS అనుగుణ్యత చెక్‌లిస్ట్ (Compliance Checklist) మరియు రోడ్‌మ్యాప్‌ను రూపొందించండి.`;
    } else if (language === 'hi') {
      prompt = `${record.isNumber || record.title} (${record.title}) के लिए 4-चरणीय बीआईएस अनुपालन चेकलिस्ट (Compliance Checklist) और प्रमाणन रोडमैप तैयार करें।`;
    }
    onAskAboutStandard(prompt);
  };

  const filteredRecords = useMemo(() => {
    return BIS_KNOWLEDGE_BASE.filter((record) => {
      if (selectedCategory !== 'All') {
        if (selectedCategory === 'Drinking Water & Beverages' && record.topic !== 'Drinking Water & Beverages') return false;
        if (selectedCategory === 'Construction & Steel' && record.topic !== 'Construction & Steel') return false;
        if (selectedCategory === 'Electrical & Electronics' && record.topic !== 'Electrical & Electronics') return false;
        if (selectedCategory === 'Consumer Safety & Toys' && record.topic !== 'Consumer Safety & Toys') return false;
        if (selectedCategory === 'Gold & Silver Hallmarking' && record.topic !== 'Gold & Silver Hallmarking') return false;
        if (selectedCategory === 'Chemicals & Plastics' && record.topic !== 'Chemicals & Plastics') return false;
        if (selectedCategory === 'Laboratories & Testing' && record.topic !== 'Laboratories & Testing') return false;
      }

      if (onlyMandatory && !record.mandatoryQCO) return false;

      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase().trim();
        const rawQueryDigits = query.replace(/\D/g, '');

        const matchesIS = record.isNumber?.toLowerCase().includes(query) || false;
        const matchesISDigits = rawQueryDigits.length >= 3 && (record.isNumber?.replace(/\D/g, '').includes(rawQueryDigits) || false);
        const matchesTitle = record.title.toLowerCase().includes(query);
        const matchesCategory = record.category?.toLowerCase().includes(query) || record.topic.toLowerCase().includes(query);
        const matchesKeywords = record.productKeywords?.some((k) => k.toLowerCase().includes(query)) || false;
        const matchesSummary = record.scopeAndSummary?.toLowerCase().includes(query) || false;
        const matchesContent = record.content.toLowerCase().includes(query);

        return matchesIS || matchesISDigits || matchesTitle || matchesCategory || matchesKeywords || matchesSummary || matchesContent;
      }

      return true;
    });
  }, [searchTerm, selectedCategory, onlyMandatory]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setOnlyMandatory(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8 font-sans">
      {/* Header Banner (Text-First Swiss Style) */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 sm:p-8 bg-zinc-950 text-zinc-100 rounded-3xl border border-zinc-800 shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-6 font-mono"
      >
        <div className="space-y-2 max-w-2xl">
          <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
            [ INDIAN STANDARDS & QUALITY CONTROL ORDERS ]
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif tracking-tight text-white font-sans">
            Standards Directory & Verification
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 font-sans leading-relaxed">
            Search verified Indian Standards (IS), mandatory Quality Control Orders (QCOs), and Scheme-I/CRS certification guidelines. Instantly transfer any standard into the Chat Assistant for step-by-step compliance guidance.
          </p>
        </div>

        {/* Quick Metrics */}
        <div className="flex items-center gap-4 text-xs font-mono bg-zinc-900 p-4 rounded-2xl border border-zinc-800 shrink-0">
          <div className="text-center px-2">
            <div className="text-2xl font-bold font-display text-white">{BIS_KNOWLEDGE_BASE.length}</div>
            <div className="text-[10px] text-zinc-400 uppercase tracking-wider">[ Indexed ]</div>
          </div>
          <div className="h-8 w-px bg-zinc-800" />
          <div className="text-center px-2">
            <div className="text-2xl font-bold font-display text-white">
              {BIS_KNOWLEDGE_BASE.filter((r) => r.mandatoryQCO).length}
            </div>
            <div className="text-[10px] text-zinc-400 uppercase tracking-wider">[ Mandatory QCO ]</div>
          </div>
        </div>
      </motion.div>

      {/* Sub-Tools Segmented Navigation Bar */}
      <div className="bg-zinc-200/70 dark:bg-zinc-900 p-1.5 rounded-2xl border border-zinc-300 dark:border-zinc-800 flex flex-wrap gap-1.5 shadow-2xs font-mono">
        <button
          type="button"
          onClick={() => setSubTool('directory')}
          className={`flex-1 min-w-[160px] py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center cursor-pointer uppercase tracking-wider ${
            currentSubTool === 'directory'
              ? 'bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white shadow-xs border border-zinc-300 dark:border-zinc-700'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-200/60 dark:hover:bg-zinc-800'
          }`}
        >
          [ Standards Directory ]
        </button>

        <button
          type="button"
          onClick={() => setSubTool('comparator')}
          className={`flex-1 min-w-[160px] py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center cursor-pointer uppercase tracking-wider ${
            currentSubTool === 'comparator'
              ? 'bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white shadow-xs border border-zinc-300 dark:border-zinc-700'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-200/60 dark:hover:bg-zinc-800'
          }`}
        >
          [ Standards Comparator ]
        </button>

        <button
          type="button"
          onClick={() => setSubTool('estimator')}
          className={`flex-1 min-w-[160px] py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center cursor-pointer uppercase tracking-wider ${
            currentSubTool === 'estimator'
              ? 'bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white shadow-xs border border-zinc-300 dark:border-zinc-700'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-200/60 dark:hover:bg-zinc-800'
          }`}
        >
          [ Fee Estimator ]
        </button>
      </div>

      {/* Sub-Tool View: Comparator */}
      {currentSubTool === 'comparator' && (
        <StandardsComparator onAskAboutStandard={onAskAboutStandard} />
      )}

      {/* Sub-Tool View: Fee Estimator */}
      {currentSubTool === 'estimator' && (
        <FeeEstimator onAskAboutBudget={onAskAboutStandard} />
      )}

      {/* Sub-Tool View: Directory */}
      {currentSubTool === 'directory' && (
        <>
          {/* Search & Filter Control Monolith */}
          <div className="bg-white dark:bg-zinc-900 p-4 sm:p-6 rounded-2xl border border-zinc-300 dark:border-zinc-800 shadow-xs space-y-4 font-mono">
            {/* Toast Notification */}
            <AnimatePresence>
              {speechToast && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800"
                >
                  <span className="font-bold">[ NOTICE ]: </span>
                  <span>{speechToast}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Search Input and QCO Checkbox */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  id="input-find-standard-search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={
                    isListening
                      ? `[ Listening... Speak now in ${language === 'te' ? 'Telugu' : language === 'hi' ? 'Hindi' : 'English'} ]`
                      : t.searchPlaceholder
                  }
                  className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-800 focus:bg-white dark:focus:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 focus:border-zinc-950 dark:focus:border-zinc-200 rounded-xl text-xs sm:text-sm text-zinc-950 dark:text-white outline-none transition-all font-mono"
                />
                <div className="absolute right-2 top-2 flex items-center gap-1">
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="px-1.5 py-0.5 text-zinc-400 hover:text-zinc-900 dark:hover:text-white cursor-pointer text-xs font-bold"
                      title="Clear search"
                    >
                      [ ✕ ]
                    </button>
                  )}
                  <button
                    type="button"
                    id="btn-voice-search-find-standard"
                    onClick={handleToggleVoice}
                    className={`px-2 py-0.5 rounded text-xs font-bold uppercase transition-all cursor-pointer ${
                      isListening
                        ? 'bg-zinc-950 text-white'
                        : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-200/60 dark:hover:bg-zinc-800'
                    }`}
                    title={isListening ? t.stopListening : t.voiceInput}
                  >
                    {isListening ? '[ Voice: Active ]' : '[ Voice ]'}
                  </button>
                </div>
              </div>

              <label className="flex items-center gap-2 px-4 py-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl text-xs font-bold text-zinc-900 dark:text-zinc-100 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors shrink-0 select-none uppercase">
                <input
                  type="checkbox"
                  id="filter-mandatory-checkbox"
                  checked={onlyMandatory}
                  onChange={(e) => setOnlyMandatory(e.target.checked)}
                  className="w-4 h-4 rounded accent-zinc-950 cursor-pointer"
                />
                <span>Mandatory QCO Only</span>
              </label>
            </div>

            {/* Category Filter Chips */}
            <div className="space-y-2 pt-1 border-t border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center justify-between text-xs text-zinc-500">
                <span className="font-bold uppercase">[ Filter by Industry Sector ]:</span>
                <span className="text-[11px] font-bold text-zinc-800 dark:text-zinc-200">
                  Showing {filteredRecords.length} of {BIS_KNOWLEDGE_BASE.length} standards
                </span>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
                {CATEGORIES.map((cat) => {
                  const isSelected = selectedCategory === cat.value;
                  return (
                    <button
                      key={cat.value}
                      id={`cat-chip-${cat.value.replace(/\s+/g, '-').toLowerCase()}`}
                      onClick={() => setSelectedCategory(cat.value)}
                      className={`px-3 py-1.5 rounded-lg shrink-0 text-xs font-bold uppercase transition-all cursor-pointer select-none ${
                        isSelected
                          ? 'bg-zinc-950 dark:bg-zinc-100 text-white dark:text-zinc-950 shadow-xs'
                          : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                      }`}
                    >
                      [ {cat.label} ]
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Suggestion Pills */}
            {!searchTerm && (
              <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs text-zinc-500">
                <span className="text-[11px] font-bold mr-1 uppercase">Popular:</span>
                {SUGGESTED_SEARCHES.slice(0, 5).map((query) => (
                  <button
                    key={query}
                    onClick={() => setSearchTerm(query)}
                    className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded text-[11px] transition-colors cursor-pointer"
                  >
                    {query}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Matching Standards Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredRecords.length === 0 ? (
              <div className="col-span-full py-16 text-center bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-300 dark:border-zinc-800 p-8 space-y-4 font-mono">
                <div className="space-y-1">
                  <h3 className="text-xl sm:text-2xl font-serif text-zinc-950 dark:text-white">
                    [ No matching Indian Standards found ]
                  </h3>
                  <p className="text-xs text-zinc-500 max-w-md mx-auto">
                    No indexed standards match "{searchTerm}". Try searching by product name or standard number from the suggestions below.
                  </p>
                </div>

                <div className="flex flex-wrap justify-center gap-2 max-w-lg mx-auto pt-2">
                  {SUGGESTED_SEARCHES.map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => setSearchTerm(suggestion)}
                      className="px-2.5 py-1 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-lg text-xs transition-colors cursor-pointer border border-zinc-300 dark:border-zinc-700"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleResetFilters}
                    className="px-5 py-2.5 bg-zinc-950 dark:bg-white hover:bg-zinc-800 text-white dark:text-zinc-950 text-xs font-bold rounded-xl cursor-pointer uppercase tracking-wider"
                  >
                    [ Reset All Filters ]
                  </button>
                </div>
              </div>
            ) : (
              filteredRecords.map((record) => {
                const isCode = record.isNumber || record.citationLabel;
                const officialUrl = record.officialPortalUrl || record.sourceUrl || 'https://www.services.bis.gov.in';

                return (
                  <motion.div
                    key={record.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-2xl p-6 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between h-full group relative"
                  >
                    <div className="space-y-3.5">
                      {/* Header Row */}
                      <div className="flex flex-wrap items-center justify-between gap-2 font-mono">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-2.5 py-1 rounded-md bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950 text-xs font-bold">
                            {isCode}
                          </span>

                          {record.mandatoryQCO && (
                            <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-300 text-[10px] font-bold border border-emerald-300 dark:border-emerald-800 uppercase">
                              [ MANDATORY QCO ]
                            </span>
                          )}

                          <span className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-[10px] font-bold border border-zinc-200 dark:border-zinc-700 uppercase">
                            {record.scheme || record.certificationScheme || 'Scheme I'}
                          </span>
                        </div>

                        <button
                          onClick={() => setActiveModalRecord(record)}
                          className="text-[11px] text-zinc-500 hover:text-zinc-950 dark:hover:text-white font-bold cursor-pointer uppercase"
                          title="Inspect full parameters"
                        >
                          [ Details → ]
                        </button>
                      </div>

                      {/* Official Standard Title */}
                      <div>
                        <h2 className="text-xl sm:text-2xl font-serif text-zinc-950 dark:text-white group-hover:text-zinc-900 line-clamp-2">
                          {record.title}
                        </h2>
                        <div className="text-[11px] font-mono text-zinc-500 mt-1 uppercase">
                          [ {record.category || record.topic} ]
                        </div>
                      </div>

                      {/* Summary */}
                      <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed font-sans line-clamp-3">
                        {record.scopeAndSummary || record.content}
                      </p>

                      {/* Highlights */}
                      {record.keyHighlights && record.keyHighlights.length > 0 && (
                        <div className="space-y-1.5 bg-zinc-50 dark:bg-zinc-800/60 p-3 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-mono">
                          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">
                            [ Core Compliance Highlights ]:
                          </span>
                          {record.keyHighlights.slice(0, 2).map((highlight, idx) => (
                            <div key={idx} className="text-[11px] text-zinc-700 dark:text-zinc-300 font-sans">
                              • {highlight}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Card Action Footer */}
                    <div className="mt-5 pt-3.5 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 font-mono">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <a
                          href={officialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2 py-1.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-[11px] font-bold rounded-lg border border-zinc-300 dark:border-zinc-700 transition-colors uppercase"
                          title={t.openOfficialPortal}
                        >
                          [ Portal → ]
                        </a>

                        <button
                          type="button"
                          id={`btn-checklist-${record.id}`}
                          onClick={() => handleGenerateChecklist(record)}
                          className="px-2 py-1.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-[11px] font-bold rounded-lg border border-zinc-300 dark:border-zinc-700 transition-colors cursor-pointer uppercase"
                          title="Generate 4-Step Actionable Compliance Checklist"
                        >
                          [ Checklist ]
                        </button>

                        <button
                          type="button"
                          id={`btn-dossier-${record.id}`}
                          onClick={() => {
                            const dossierData = generateDossierFromRecord(record, language);
                            setActiveDossier(dossierData);
                          }}
                          className="px-2 py-1.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-[11px] font-bold rounded-lg border border-zinc-300 dark:border-zinc-700 transition-colors cursor-pointer uppercase"
                          title="Generate Official Compliance Dossier"
                        >
                          [ Dossier ]
                        </button>
                      </div>

                      <button
                        id={`btn-ask-sahayak-${record.id}`}
                        onClick={() => handleAskSahayak(record)}
                        className="px-3 py-1.5 bg-zinc-950 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-white text-white dark:text-zinc-950 text-xs font-bold rounded-lg transition-all cursor-pointer shrink-0 uppercase tracking-wider"
                      >
                        [ {t.askSahayak} → ]
                      </button>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>

          {/* Slide-in Detail Drawer */}
          <AnimatePresence>
            {activeModalRecord && (
              <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/50 backdrop-blur-xs font-mono">
                <motion.div
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'spring', damping: 30, stiffness: 350 }}
                  className="w-full max-w-lg h-full bg-white dark:bg-zinc-950 border-l border-zinc-300 dark:border-zinc-800 shadow-2xl p-6 sm:p-8 overflow-y-auto flex flex-col justify-between"
                >
                  <div className="space-y-6">
                    <div className="flex items-center justify-between border-b border-zinc-300 dark:border-zinc-800 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950 text-xs font-bold">
                          {activeModalRecord.isNumber || activeModalRecord.citationLabel}
                        </span>
                        <span className="text-xs text-zinc-500">
                          {activeModalRecord.topic}
                        </span>
                      </div>
                      <button
                        onClick={() => setActiveModalRecord(null)}
                        className="px-2 py-0.5 rounded text-zinc-500 hover:text-zinc-950 dark:hover:text-white font-bold cursor-pointer uppercase text-xs"
                      >
                        [ Close ✕ ]
                      </button>
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-display font-bold text-xl text-zinc-950 dark:text-white font-sans">
                        {activeModalRecord.title}
                      </h3>
                      <div className="flex flex-wrap gap-2 text-xs pt-1">
                        {activeModalRecord.mandatoryQCO && (
                          <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-300 border border-emerald-300 rounded font-bold uppercase">
                            [ MANDATORY QCO ]
                          </span>
                        )}
                        <span className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700 rounded font-bold uppercase">
                          {activeModalRecord.scheme || activeModalRecord.certificationScheme || 'Scheme I'}
                        </span>
                        <span className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-300 dark:border-zinc-700 rounded">
                          Verified: {activeModalRecord.lastVerified}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-xs font-bold text-zinc-950 dark:text-white uppercase">
                        [ Full Standard Overview & Scope ]
                      </div>
                      <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed bg-zinc-50 dark:bg-zinc-900 p-4 rounded-xl border border-zinc-300 dark:border-zinc-800 font-sans">
                        {activeModalRecord.scopeAndSummary || activeModalRecord.content}
                      </p>
                    </div>

                    {activeModalRecord.testingAndLabRequirements && (
                      <div className="space-y-2">
                        <div className="text-xs font-bold text-zinc-950 dark:text-white uppercase">
                          [ Testing & Laboratory Requirements ]
                        </div>
                        <div className="p-3.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-xl text-xs text-zinc-800 dark:text-zinc-200 font-sans leading-relaxed">
                          {activeModalRecord.testingAndLabRequirements}
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <div className="text-xs font-bold text-zinc-950 dark:text-white uppercase">
                        [ Key Specifications & Compliance Rules ]
                      </div>
                      <div className="space-y-2">
                        {activeModalRecord.keyHighlights.map((h, i) => (
                          <div key={i} className="p-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-xl text-xs text-zinc-800 dark:text-zinc-200 font-sans">
                            • {h}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-3 bg-zinc-100 dark:bg-zinc-900 rounded-xl text-xs text-zinc-600 dark:text-zinc-400 space-y-1">
                      <div><strong>Official Source URL:</strong> {activeModalRecord.officialPortalUrl || activeModalRecord.sourceUrl}</div>
                      <div><strong>Certification Scheme:</strong> {activeModalRecord.certificationScheme || activeModalRecord.scheme || 'Scheme I'}</div>
                      <div><strong>Source Document Type:</strong> {activeModalRecord.sourceType}</div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-zinc-300 dark:border-zinc-800 flex flex-wrap gap-2.5">
                    <button
                      onClick={() => {
                        const rec = activeModalRecord;
                        setActiveModalRecord(null);
                        handleGenerateChecklist(rec);
                      }}
                      className="flex-1 py-2.5 px-3 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100 text-xs font-bold rounded-xl cursor-pointer border border-zinc-300 dark:border-zinc-700 uppercase"
                    >
                      [ Checklist ]
                    </button>

                    <button
                      onClick={() => {
                        const rec = activeModalRecord;
                        if (rec) {
                          const dossierData = generateDossierFromRecord(rec, language);
                          setActiveDossier(dossierData);
                        }
                      }}
                      className="py-2.5 px-3 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100 text-xs font-bold rounded-xl cursor-pointer border border-zinc-300 dark:border-zinc-700 uppercase"
                      title="Export Official Compliance Dossier"
                    >
                      [ Dossier PDF ]
                    </button>

                    <button
                      onClick={() => {
                        const rec = activeModalRecord;
                        setActiveModalRecord(null);
                        handleAskSahayak(rec);
                      }}
                      className="flex-1 py-2.5 px-3 bg-zinc-950 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-white text-white dark:text-zinc-950 text-xs font-bold rounded-xl cursor-pointer uppercase tracking-wider"
                    >
                      [ {t.askSahayak} ]
                    </button>

                    <a
                      href={activeModalRecord.officialPortalUrl || activeModalRecord.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2.5 px-3 bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-bold rounded-xl cursor-pointer border border-zinc-300 dark:border-zinc-700 uppercase"
                    >
                      [ Portal → ]
                    </a>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </>
      )}

      {/* Compliance Dossier Printable Modal */}
      <ComplianceDossierModal
        dossier={activeDossier}
        isOpen={!!activeDossier}
        onClose={() => setActiveDossier(null)}
      />
    </div>
  );
};
export default FindStandardView;
