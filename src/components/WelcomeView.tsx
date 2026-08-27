import React, { useMemo } from 'react';
import { motion, Variants } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';

interface WelcomeViewProps {
  onStartChat: (initialPrompt?: string) => void;
  onExploreCatalog: () => void;
  onOpenComparator?: () => void;
  onOpenFeeEstimator?: () => void;
  onOpenHowRagWorks?: () => void;
}

interface FaqBlockData {
  id: string;
  num: string;
  question: string;
  answer: string;
  badge: string;
}

// Lightweight, memoized Text-First FAQ Card with GPU hardware acceleration
const FaqCard = React.memo(({ block, variants }: { block: FaqBlockData; variants: Variants }) => {
  return (
    <motion.div
      variants={variants}
      className="group relative bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-300 dark:border-zinc-800 p-6 sm:p-7 shadow-2xs hover:shadow-lg hover:border-zinc-400 dark:hover:border-zinc-700 transition-all duration-200 ease-out transform-gpu will-change-transform hover:-translate-y-1 flex flex-col justify-between"
    >
      <div className="space-y-4">
        {/* Numbered Badge & Category Tag */}
        <div className="flex items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2">
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950 tracking-wider">
              {block.num}
            </span>
            <span className="inline-flex items-center text-[11px] font-mono font-bold text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 px-2.5 py-0.5 rounded border border-zinc-200 dark:border-zinc-700 uppercase">
              {block.badge}
            </span>
          </div>
          <span className="font-mono text-[10px] text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
            [ CLAUSE VERIFIED ]
          </span>
        </div>

        {/* High-Contrast Bold Question Header */}
        <h3 className="font-serif text-xl sm:text-2xl text-zinc-950 dark:text-white leading-snug tracking-tight">
          {block.question}
        </h3>

        {/* Crisp, Balanced Answer Body */}
        <p className="text-zinc-600 dark:text-zinc-300 text-sm leading-relaxed font-sans">
          {block.answer}
        </p>
      </div>

      <div className="mt-5 pt-3 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
        <span>Verified Guidance</span>
        <span className="font-semibold text-zinc-900 dark:text-zinc-200 group-hover:underline">
          Read Clause Details →
        </span>
      </div>
    </motion.div>
  );
});

FaqCard.displayName = 'FaqCard';

export const WelcomeView: React.FC<WelcomeViewProps> = ({
  onStartChat,
  onExploreCatalog,
  onOpenComparator,
  onOpenFeeEstimator,
}) => {
  const { language, t } = useLanguage();

  // 6 Essential Institutional Questions & Answers (Localized for English, Telugu, Hindi)
  const faqBlocks: FaqBlockData[] = useMemo(() => {
    if (language === 'te') {
      return [
        {
          id: 'block-1',
          num: '01',
          question: 'BIS అంటే ఏమిటి?',
          answer: 'BIS అంటే బ్యూరో ఆఫ్ ఇండియన్ స్టాండర్డ్స్ (Bureau of Indian Standards), ఇది BIS చట్టం 2016 కింద స్థాపించబడిన భారతదేశ జాతీయ ప్రమాణాల సంస్థ. వస్తువుల ప్రమాణీకరణ, ISI మార్కింగ్ మరియు నాణ్యత ధృవీకరణను పర్యవేక్షించడం ద్వారా వినియోగదారుల భద్రతను నిర్ధారిస్తుంది.',
          badge: 'జాతీయ ప్రమాణాల సంస్థ',
        },
        {
          id: 'block-2',
          num: '02',
          question: 'BIS సహాయక్ AI అంటే ఏమిటి?',
          answer: "BIS సహాయక్ AI అనేది మూలాల ఆధారంగా (Grounded RAG) సమాచారం అందించే కృత్రిమ మేధస్సు సహాయకి. సంక్లిష్టమైన సాంకేతిక నిబంధనలు, గెజిట్ నోటిఫికేషన్లు మరియు ధృవీకరణ మార్గదర్శకాలను సులభమైన భాషలో అర్థమయ్యేలా వివరిస్తుంది.",
          badge: 'RAG ఆధారిత సహాయకి',
        },
        {
          id: 'block-3',
          num: '03',
          question: 'ఈ అప్లికేషన్ ఎందుకు సృష్టించబడింది?',
          answer: 'వందలాది భారతీయ ప్రమాణాలు, ల్యాబ్ టెస్టింగ్ నిబంధనలు మరియు సర్టిఫికేషన్ విధానాలను సులభతరం చేయడానికి ఈ వేదిక రూపొందించబడింది. ఇది సరైన సమాచారాన్ని వేగంగా మరియు నేరుగా ధృవీకరించిన లింకులతో అందిస్తుంది.',
          badge: 'పరిష్కారం & ఉద్దేశం',
        },
        {
          id: 'block-4',
          num: '04',
          question: 'ఈ వేదికను ఎవరు ఉపయోగించవచ్చు?',
          answer: 'తయారీదారులు, స్టార్టప్‌లు, పరిశోధకులు, ఇంజనీరింగ్ విద్యార్థులు, బంగారం హాల్‌మార్కింగ్ లేదా ISI మార్క్ తనిఖీ చేసే సాధారణ వినియోగదారులు మరియు ఎగుమతి/దిగుమతి వ్యాపారులు ఉపయోగించవచ్చు.',
          badge: 'లక్ష్య వినియోగదారులు',
        },
        {
          id: 'block-5',
          num: '05',
          question: 'వినియోగదారులు ఏ ప్రశ్నలు అడగవచ్చు?',
          answer: 'ఉత్పత్తి పేరుతో IS నంబర్ల శోధన (ఉదా. త్రాగునీరు, సిమెంట్, బొమ్మలు), ISI మార్క్ లేదా CRS రిజిస్ట్రేషన్ ప్రక్రియ, 4-దశల అనుగుణ్యత చెక్‌లిస్ట్‌లు మరియు గుర్తింపు పొందిన ల్యాబ్‌ల వివరాలను అడగవచ్చు.',
          badge: 'సహజ భాషా శోధన',
        },
        {
          id: 'block-6',
          num: '06',
          question: 'ఇది అధికారిక BIS పోర్టలా?',
          answer: 'కాదు. BIS సహాయక్ AI అనేది పరిశోధన మరియు విద్యా ప్రయోజనాల కోసం రూపొందించబడిన స్వతంత్ర హ్యాకథాన్ ప్రోటోటైప్. ఇది లైసెన్సులు మంజూరు చేయదు. అధికారిక ధృవీకరణ కోసం bis.gov.in మరియు manakonline.in పోర్టల్‌లను సంప్రదించాలి.',
          badge: 'ప్రోటోటైప్ & గమనిక',
        },
      ];
    }

    if (language === 'hi') {
      return [
        {
          id: 'block-1',
          num: '01',
          question: 'बीआईएस (BIS) का क्या अर्थ है?',
          answer: 'बीआईएस का अर्थ भारतीय मानक ब्यूरो (Bureau of Indian Standards) है, जो बीआईएस अधिनियम 2016 के तहत स्थापित भारत का राष्ट्रीय मानक निकाय है। यह मानकीकरण, गुणवत्ता प्रमाणन और उपभोक्ता सुरक्षा सुनिश्चित करता है।',
          badge: 'राष्ट्रीय मानक निकाय',
        },
        {
          id: 'block-2',
          num: '02',
          question: 'बीआईएस सहायक एआई क्या है?',
          answer: "बीआईएस सहायक एआई एक स्रोत-आधारित (Source-Grounded) डिजिटल सहायक है। यह जटिल तकनीकी मानकों और प्रमाणन प्रक्रियाओं को सरल और स्पष्ट भाषा में समझाता है।",
          badge: 'विश्वसनीय सहायक',
        },
        {
          id: 'block-3',
          num: '03',
          question: 'यह एप्लिकेशन क्यों बनाया गया?',
          answer: 'सैकड़ों भारतीय मानकों, लैब परीक्षण नियमों और प्रमाणन प्रक्रियाओं को सरल बनाने के लिए इसे बनाया गया है ताकि उपयोगकर्ताओं को सत्यापित जानकारी तुरंत मिल सके।',
          badge: 'उद्देश्य एवं समाधान',
        },
        {
          id: 'block-4',
          num: '04',
          question: 'इस प्लेटफॉर्म का उपयोग कौन कर सकता है?',
          answer: 'निर्माता, स्टार्टअप, इंजीनियरिंग शोधकर्ता, हॉलमार्किंग व आईएसआई मार्क की पुष्टि करने वाले उपभोक्ता और व्यापारी इस प्लेटफॉर्म का उपयोग कर सकते हैं।',
          badge: 'लक्षित उपयोगकर्ता',
        },
        {
          id: 'block-5',
          num: '05',
          question: 'उपयोगकर्ता क्या पूछ सकते हैं?',
          answer: 'उत्पाद के नाम से मानक (जैसे पेयजल, सीमेंट, खिलौने), आईएसआई मार्क प्रक्रिया, 4-चरणीय अनुपालन चेकलिस्ट और बीआईएस मान्यता प्राप्त प्रयोगशालाओं के विवरण पूछ सकते हैं।',
          badge: 'नेचुरल लैंग्वेज सर्च',
        },
        {
          id: 'block-6',
          num: '06',
          question: 'क्या यह आधिकारिक बीआईएस पोर्टल है?',
          answer: 'नहीं। बीआईएस सहायक एआई एक स्वतंत्र हैकथॉन प्रोटोटाइप है। यह कानूनी अनुमोदन या लाइसेंस जारी नहीं करता। आधिकारिक सत्यापन के लिए bis.gov.in पर जाएं।',
          badge: 'प्रोटोटाइप सूचना',
        },
      ];
    }

    return [
      {
        id: 'block-1',
        num: '01',
        question: 'What does BIS mean?',
        answer: 'BIS stands for the Bureau of Indian Standards, which is the National Standard Body of India established under the BIS Act 2016. It is responsible for the harmonious development of standardization, marking, and quality certification of goods, ensuring product safety, reliability, and consumer protection across the nation.',
        badge: 'National Standards Body',
      },
      {
        id: 'block-2',
        num: '02',
        question: 'What is BIS Sahayak AI?',
        answer: "BIS Sahayak AI is an intelligent, source-grounded conversational digital assistant. The word 'Sahayak' means helper. It acts as an easy-to-use bridge that translates complex technical standards, gazette notifications, and certification guidelines into simple, structured, plain-language answers.",
        badge: 'Grounded Assistant',
      },
      {
        id: 'block-3',
        num: '03',
        question: 'Why was this application created?',
        answer: 'Navigating hundreds of Indian Standards, lab testing mandates, and certification procedures across multiple portals can be overwhelming for non-experts. BIS Sahayak AI was built to eliminate manual discovery friction, prevent reliance on unverified third-party advice, and make standard discovery fast, intuitive, and accessible.',
        badge: 'Problem Solved',
      },
      {
        id: 'block-4',
        num: '04',
        question: 'Who can use this platform?',
        answer: 'This platform is built for small manufacturers, startups, and entrepreneurs preparing for product compliance; students and researchers exploring engineering benchmarks; consumers verifying product safety and hallmarking; and exporters/importers checking Indian regulatory specifications.',
        badge: 'Target Audience',
      },
      {
        id: 'block-5',
        num: '05',
        question: 'What can users ask?',
        answer: 'Users can ask natural language questions such as finding applicable Indian Standards by product name (e.g., packaged drinking water, cement, toys), looking up specific IS numbers, understanding ISI mark or CRS registration steps, locating recognized testing laboratories, or clarifying consumer safety marks.',
        badge: 'Natural Language Discovery',
      },
      {
        id: 'block-6',
        num: '06',
        question: 'Is this an official BIS portal?',
        answer: 'No. BIS Sahayak AI is an independent hackathon research prototype built for decision-support and educational assistance. It does not grant certifications, issue licenses, or provide legal compliance approvals. Users must always verify critical requirements on official BIS portals (bis.gov.in / services.bis.gov.in).',
        badge: 'Prototype & Advisory Notice',
      },
    ];
  }, [language]);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.25 },
    },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-12 contain-paint">
      {/* Hero Monolith Header (Text-First Swiss Layout) */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="relative overflow-hidden rounded-3xl bg-zinc-950 text-zinc-100 p-8 sm:p-12 lg:p-14 border border-zinc-800 shadow-xl transform-gpu will-change-transform"
      >
        <div className="relative z-10 max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-zinc-900 text-zinc-300 border border-zinc-700 uppercase tracking-wider">
            [ AI-POWERED BIS INFORMATION ASSISTANT ]
          </div>

          <div className="space-y-3">
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl tracking-tight text-white leading-[1.12]">
              {t.welcomeTitle}
            </h1>
            <p className="text-xl sm:text-2xl text-zinc-300 font-serif">
              {t.welcomeSubtitle}
            </p>
            <p className="text-sm sm:text-base text-zinc-400 font-normal leading-relaxed max-w-2xl font-sans pt-1">
              {t.welcomeDescription}
            </p>
          </div>

          {/* Quick Technical Indicator Bar */}
          <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-xs">
            <span className="px-3 py-1 rounded bg-zinc-900 text-zinc-300 border border-zinc-800 font-bold">
              [ LEXICAL RETRIEVAL ]
            </span>
            <span className="px-3 py-1 rounded bg-zinc-900 text-zinc-300 border border-zinc-800 font-bold">
              [ MULTILINGUAL: EN / TE / HI ]
            </span>
            <span className="px-3 py-1 rounded bg-zinc-900 text-zinc-300 border border-zinc-800 font-bold">
              [ VERIFIED CLAUSES ]
            </span>
          </div>

          {/* Core Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-3 font-mono">
            <motion.button
              id="hero-start-button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onStartChat()}
              className="px-7 py-3.5 bg-white hover:bg-zinc-100 text-zinc-950 font-black text-xs sm:text-sm rounded-xl shadow-lg transition-all cursor-pointer uppercase tracking-wider border border-white"
            >
              [ OPEN ASSISTANT ]
            </motion.button>

            <motion.button
              id="hero-explore-catalog-button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onExploreCatalog}
              className="px-5 py-3.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 font-bold text-xs sm:text-sm rounded-xl border border-zinc-700 transition-all cursor-pointer uppercase tracking-wider"
            >
              [ {t.findStandard} ]
            </motion.button>

            {onOpenComparator && (
              <motion.button
                id="hero-comparator-button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onOpenComparator}
                className="px-5 py-3.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 font-bold text-xs sm:text-sm rounded-xl border border-zinc-700 transition-all cursor-pointer uppercase tracking-wider"
              >
                [ {language === 'te' ? 'స్టాండర్డ్స్ పోలిక' : language === 'hi' ? 'मानक तुलना' : 'COMPARATOR'} ]
              </motion.button>
            )}

            {onOpenFeeEstimator && (
              <motion.button
                id="hero-fee-estimator-button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onOpenFeeEstimator}
                className="px-5 py-3.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 font-bold text-xs sm:text-sm rounded-xl border border-zinc-700 transition-all cursor-pointer uppercase tracking-wider"
              >
                [ {language === 'te' ? 'ఫీజు కాలిక్యులేటర్' : language === 'hi' ? 'शुल्क अनुमान' : 'FEE ESTIMATOR'} ]
              </motion.button>
            )}
          </div>
        </div>
      </motion.section>

      {/* 6-Block Introductory Q&A Section */}
      <section className="space-y-6">
        <div className="border-b border-zinc-300 dark:border-zinc-800 pb-4 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
          <div>
            <div className="text-[11px] font-mono font-bold uppercase tracking-widest text-zinc-500">
              [ FREQUENTLY ASKED QUESTIONS & ESSENTIAL OVERVIEW ]
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif text-zinc-950 dark:text-white tracking-tight mt-1">
              Everything You Need to Know
            </h2>
          </div>
          <p className="text-xs font-mono text-zinc-500">
            [ 6 Core Institutional & Architectural Pillars ]
          </p>
        </div>

        {/* 6 Structured Cards Responsive Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-20px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transform-gpu"
        >
          {faqBlocks.map((block) => (
            <FaqCard key={block.id} block={block} variants={itemVariants} />
          ))}
        </motion.div>
      </section>

      {/* Action Bar / CTA Section */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative overflow-hidden bg-zinc-950 text-white rounded-3xl p-8 sm:p-10 border border-zinc-800 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 transform-gpu will-change-transform"
      >
        <div className="relative z-10 space-y-2 text-center sm:text-left">
          <div className="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-mono text-zinc-300 bg-zinc-900 border border-zinc-700 font-bold uppercase">
            [ GET STARTED IN SECONDS ]
          </div>
          <h3 className="text-2xl sm:text-3xl font-serif tracking-tight text-white">
            Ready to query Indian Standards & Regulations?
          </h3>
          <p className="text-xs sm:text-sm text-zinc-400 font-sans max-w-xl leading-relaxed">
            Start a conversational session with BIS Sahayak AI to search specifications, verify mandatory QCOs, or explore testing laboratory requirements.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-3 shrink-0 font-mono">
          <motion.button
            id="overview-bottom-start-button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onStartChat()}
            className="px-7 py-3.5 bg-white hover:bg-zinc-100 text-zinc-950 font-bold text-xs sm:text-sm rounded-xl shadow-lg transition-all cursor-pointer uppercase tracking-wider"
          >
            [ START EXPLORING ]
          </motion.button>

          <a
            href="https://www.bis.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-3.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-mono font-bold rounded-xl border border-zinc-700 transition-colors uppercase tracking-wider"
          >
            [ OFFICIAL PORTAL → ]
          </a>
        </div>
      </motion.section>
    </div>
  );
};
export default WelcomeView;
