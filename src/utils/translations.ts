import { Language } from '../types';

export interface TranslationDictionary {
  appName: string;
  appSub: string;
  nationalBody: string;
  groundedAssistant: string;
  navWelcome: string;
  navChat: string;
  navFindStandard: string;
  navCatalog: string;
  start: string;
  startBtn: string;
  findStandard: string;
  exploreCatalog: string;
  searchPlaceholder: string;
  askSahayak: string;
  clearChat: string;
  clearHistory: string;
  send: string;
  queryBtn: string;
  typeQueryPlaceholder: string;
  copyGuidance: string;
  copiedGuidance: string;
  generateChecklistAction: string;
  voiceInput: string;
  listening: string;
  listeningPrompt: (lang: string) => string;
  micNotSupported: string;
  micDenied: string;
  stopListening: string;
  openOfficialPortal: string;
  details: string;
  mandatoryQCO: string;
  mandatoryQCOOnly: string;
  allStandards: string;
  popularSearches: string;
  filterBySector: string;
  showingCount: (showing: number, total: number) => string;
  noStandardsFound: string;
  resetFilters: string;
  disclaimerTitle: string;
  disclaimerText: string;
  complianceChecklistBtn: string;
  copyChecklistBtn: string;
  checklistCopied: string;
  tryPrompt: string;
  onlineStatus: string;
  heroHeadline: string;
  heroSubheadline: string;
  heroDescription: string;
  welcomeTitle: string;
  welcomeSubtitle: string;
  welcomeDescription: string;
  faqSectionTitle: string;
  faqSectionSubtitle: string;
  sixPillars: string;
  readyToQuery: string;
  readyToQuerySub: string;
  // 6 Introductory questions and answers
  q1_title: string;
  q1_ans: string;
  q2_title: string;
  q2_ans: string;
  q3_title: string;
  q3_ans: string;
  q4_title: string;
  q4_ans: string;
  q5_title: string;
  q5_ans: string;
  q6_title: string;
  q6_ans: string;
}

export const TRANSLATIONS: Record<Language, TranslationDictionary> = {
  en: {
    appName: 'BIS Sahayak AI',
    appSub: 'Bureau of Indian Standards Assistant',
    nationalBody: 'National Standards Body of India',
    groundedAssistant: 'Source-Grounded AI Assistant',
    navWelcome: 'Overview',
    navChat: 'Chat Assistant',
    navFindStandard: 'Find a Standard',
    navCatalog: 'Directory',
    start: 'Start',
    startBtn: 'Start',
    findStandard: 'Find a Standard',
    exploreCatalog: 'Browse Standards Directory',
    searchPlaceholder: 'Search by IS code (e.g. 14543, 1786, 269) or product name (e.g. water, cement, toys)...',
    typeQueryPlaceholder: 'Ask any question about Indian Standards (e.g. IS 14543 for drinking water, toy safety QCO, or how to search KYS)...',
    askSahayak: 'Ask Sahayak AI',
    clearChat: 'Clear Conversation',
    clearHistory: 'Clear Conversation',
    send: 'Query',
    queryBtn: 'Query',
    copyGuidance: 'Copy Guidance',
    copiedGuidance: 'Copied Guidance',
    generateChecklistAction: 'Generate Compliance Checklist',
    voiceInput: 'Voice Query (Microphone)',
    listening: 'Listening...',
    listeningPrompt: (lang: string) => `Listening... Speak your query in ${lang}`,
    micNotSupported: 'Speech recognition is not supported in this browser. Please type your query.',
    micDenied: 'Microphone permission denied. Please allow microphone access or type your query.',
    stopListening: 'Stop listening',
    openOfficialPortal: 'Open Official Portal',
    details: 'Details',
    mandatoryQCO: 'Mandatory QCO',
    mandatoryQCOOnly: 'Mandatory QCO Only',
    allStandards: 'All Standards',
    popularSearches: 'Popular searches:',
    filterBySector: 'Filter by Industry Sector:',
    showingCount: (showing, total) => `Showing ${showing} of ${total} standards`,
    noStandardsFound: 'No matching Indian Standards found',
    resetFilters: 'Reset All Filters',
    disclaimerTitle: 'Statutory Prototype Disclaimer',
    disclaimerText: 'BIS Sahayak AI is an independent research prototype for decision support. It is not an official BIS portal and does not issue legal licenses. Verify critical requirements on official portals (bis.gov.in / manakonline.in).',
    complianceChecklistBtn: 'Generate Compliance Checklist',
    copyChecklistBtn: 'Copy Checklist Roadmap',
    checklistCopied: 'Checklist Copied!',
    tryPrompt: 'Try asking:',
    onlineStatus: 'KNOWLEDGE BASE VERIFIED',
    heroHeadline: 'BIS Sahayak AI',
    heroSubheadline: 'Understand BIS Standards and Services Easily',
    heroDescription: 'BIS Sahayak AI is a source-grounded digital assistant that helps users discover and understand BIS Standards and services in simple language. It searches a curated BIS knowledge base and presents answers with verified source links.',
    welcomeTitle: 'Welcome to BIS Sahayak AI',
    welcomeSubtitle: 'Understand BIS Standards and Services Easily',
    welcomeDescription: 'BIS Sahayak AI is a source-grounded digital assistant that helps users discover and understand BIS Standards and services in simple language. It searches a curated BIS knowledge base and presents answers with verified source links.',
    faqSectionTitle: 'Everything You Need to Know',
    faqSectionSubtitle: 'FREQUENTLY ASKED QUESTIONS & ESSENTIAL OVERVIEW',
    sixPillars: '6 Core Institutional & Architectural Pillars',
    readyToQuery: 'Ready to query Indian Standards & Regulations?',
    readyToQuerySub: 'Start a conversational session with BIS Sahayak AI to search specifications, verify mandatory QCOs, or explore testing laboratory requirements.',
    q1_title: '1. What does BIS mean?',
    q1_ans: 'BIS stands for the Bureau of Indian Standards, which is the National Standard Body of India established under the BIS Act 2016. It is responsible for the harmonious development of standardization, marking, and quality certification of goods, ensuring product safety, reliability, and consumer protection across the nation.',
    q2_title: '2. What is BIS Sahayak AI?',
    q2_ans: "BIS Sahayak AI is an intelligent, source-grounded conversational digital assistant. The word 'Sahayak' means helper. It acts as an easy-to-use bridge that translates complex technical standards, gazette notifications, and certification guidelines into simple, structured, plain-language answers.",
    q3_title: '3. Why was this application created?',
    q3_ans: 'Navigating hundreds of Indian Standards, lab testing mandates, and certification procedures across multiple portals can be overwhelming for non-experts. BIS Sahayak AI was built to eliminate manual discovery friction, prevent reliance on unverified third-party advice, and make standard discovery fast, intuitive, and accessible.',
    q4_title: '4. Who can use this platform?',
    q4_ans: 'This platform is built for small manufacturers, startups, and entrepreneurs preparing for product compliance; students and researchers exploring engineering benchmarks; consumers verifying product safety and hallmarking; and exporters/importers checking Indian regulatory specifications.',
    q5_title: '5. What can users ask?',
    q5_ans: 'Users can ask natural language questions such as finding applicable Indian Standards by product name (e.g., packaged drinking water, cement, toys), looking up specific IS numbers, understanding ISI mark or CRS registration steps, locating recognized testing laboratories, or clarifying consumer safety marks.',
    q6_title: '6. Is this an official BIS portal?',
    q6_ans: 'No. BIS Sahayak AI is an independent hackathon research prototype built for decision-support and educational assistance. It does not grant certifications, issue licenses, or provide legal compliance approvals. Users must always verify critical requirements on official BIS portals (bis.gov.in / services.bis.gov.in).'
  },
  te: {
    appName: 'బిఐఎస్ సహాయక్ AI',
    appSub: 'భారతీయ ప్రమాణాల బ్యూరో డిజిటల్ సహాయకుడు',
    nationalBody: 'భారత జాతీయ ప్రమాణాల సంస్థ (BIS)',
    groundedAssistant: 'ఆధారిత AI సహాయకుడు',
    navWelcome: 'అవలోకనం',
    navChat: 'చాట్ సహాయకుడు',
    navFindStandard: 'ప్రమాణాన్ని శోధించండి',
    navCatalog: 'డైరెక్టరీ',
    start: 'ప్రారంభించండి',
    startBtn: 'ప్రారంభించండి',
    findStandard: 'ప్రమాణాన్ని శోధించండి',
    exploreCatalog: 'ప్రమాణాల డైరెక్టరీని చూడండి',
    searchPlaceholder: 'IS కోడ్ (ఉదా. 14543, 1786) లేదా ఉత్పత్తి పేరుతో శోధించండి (నీరు, సిమెంట్, బొమ్మలు)...',
    typeQueryPlaceholder: 'భారతీయ ప్రమాణాలు, ISI మార్క్ లేదా CRS గురించి ఏ ప్రశ్నైనా అడగండి (ఉదా. IS 14543 త్రాగునీరు)...',
    askSahayak: 'సహాయక్ AIని అడగండి',
    clearChat: 'సంభాషణను తొలగించు',
    clearHistory: 'సంభాషణను తొలగించు',
    send: 'ప్రశ్నించండి',
    queryBtn: 'ప్రశ్నించండి',
    copyGuidance: 'మార్గదర్శకత్వాన్ని కాపీ చేయండి',
    copiedGuidance: 'కాపీ చేయబడింది!',
    generateChecklistAction: 'అనుగుణ్యత చెక్‌లిస్ట్‌ను రూపొందించండి',
    voiceInput: 'వాయిస్ ద్వారా ప్రశ్నించండి (మైక్రోఫోన్)',
    listening: 'వింటున్నాను...',
    listeningPrompt: (lang: string) => `వింటున్నాను... దయచేసి ${lang} లో మాట్లాడండి`,
    micNotSupported: 'ఈ బ్రౌజర్‌లో వాయిస్ రికగ్నిషన్ సపోర్ట్ లేదు. దయచేసి టైప్ చేయండి.',
    micDenied: 'మైక్రోఫోన్ అనుమతి నిరాకరించబడింది. దయచేసి అనుమతించండి లేదా టైప్ చేయండి.',
    stopListening: 'ఆపివేయండి',
    openOfficialPortal: 'అధికారిక పోర్టల్ తెరవండి',
    details: 'వివరాలు',
    mandatoryQCO: 'తప్పనిసరి QCO',
    mandatoryQCOOnly: 'తప్పనిసరి QCO మాత్రమే',
    allStandards: 'అన్ని ప్రమాణాలు',
    popularSearches: 'ప్రముఖ శోధనలు:',
    filterBySector: 'రంగాల వారీగా ఫిల్టర్ చేయండి:',
    showingCount: (showing, total) => `${total} ప్రమాణాలలో ${showing} చూపబడుతున్నాయి`,
    noStandardsFound: 'సరిపోలే భారతీయ ప్రమాణాలు ఏవీ కనుగొనబడలేదు',
    resetFilters: 'అన్ని ఫిల్టర్‌లను రీసెట్ చేయండి',
    disclaimerTitle: 'ప్రోటోటైప్ చట్టబద్ధమైన గమనిక',
    disclaimerText: 'బిఐఎస్ సహాయక్ AI అనేది పరిశోధన మరియు విద్యా ప్రయోజనాల కోసం రూపొందించబడిన స్వతంత్ర ప్రోటోటైప్. ఇది అధికారిక బిఐఎస్ పోర్టల్ కాదు మరియు ధృవీకరణ పత్రాలు జారీ చేయదు. పూర్తి వివరాలకు bis.gov.in మరియు manakonline.in చూడండి.',
    complianceChecklistBtn: 'అనుగుణ్యత చెక్‌లిస్ట్‌ను రూపొందించండి',
    copyChecklistBtn: 'చెక్‌లిస్ట్‌ను కాపీ చేయండి',
    checklistCopied: 'చెక్‌లిస్ట్ కాపీ చేయబడింది!',
    tryPrompt: 'ప్రశ్నించండి:',
    onlineStatus: 'ధృవీకరించబడిన జ్ఞాన నిధి',
    heroHeadline: 'బిఐఎస్ సహాయక్ AI',
    heroSubheadline: 'BIS ప్రమాణాలు & సేవలను సులభంగా అర్థం చేసుకోండి',
    heroDescription: 'బిఐఎస్ సహాయక్ AI అనేది ధృవీకరించబడిన డేటా ఆధారంగా పనిచేసే డిజిటల్ అసిస్టెంట్. ఇది భారతీయ ప్రమాణాలను సరళమైన తెలుగు భాషలో అర్థం చేసుకోవడంలో సహాయపడుతుంది.',
    welcomeTitle: 'బిఐఎస్ సహాయక్ AI కి స్వాగతం',
    welcomeSubtitle: 'భారతీయ ప్రమాణాలు మరియు సేవలను సులభంగా అర్థం చేసుకోండి',
    welcomeDescription: 'బిఐఎస్ సహాయక్ AI అనేది ధృవీకరించబడిన డేటా ఆధారంగా పనిచేసే డిజిటల్ అసిస్టెంట్. ఇది భారతీయ ప్రమాణాలను సరళమైన తెలుగు భాషలో అర్థం చేసుకోవడంలో సహాయపడుతుంది.',
    faqSectionTitle: 'మీరు తెలుసుకోవలసిన ప్రతి సమాచారం',
    faqSectionSubtitle: 'తరచుగా అడిగే ప్రశ్నలు & అవలోకనం',
    sixPillars: '6 కీలక సంస్థాగత & నిర్మాణాత్మక స్తంభాలు',
    readyToQuery: 'భారతీయ ప్రమాణాల గురించి ప్రశ్నించడానికి సిద్ధంగా ఉన్నారా?',
    readyToQuerySub: 'నియమాలు, తప్పనిసరి QCOలు మరియు ల్యాబ్ పరీక్షల గురించి తెలుసుకోవడానికి బిఐఎస్ సహాయక్ AIతో సంభాషణ ప్రారంభించండి.',
    q1_title: '1. BIS అంటే ఏమిటి?',
    q1_ans: 'BIS అంటే బ్యూరో ఆఫ్ ఇండియన్ స్టాండర్డ్స్ (Bureau of Indian Standards). ఇది BIS చట్టం 2016 ప్రకారం స్థాపించబడిన భారతదేశ జాతీయ ప్రమాణాల సంస్థ. దేశవ్యాప్తంగా వస్తువుల ప్రమాణీకరణ, ISI మార్కింగ్ మరియు నాణ్యతా ధృవీకరణలను ఇది నిర్వహిస్తుంది.',
    q2_title: '2. బిఐఎస్ సహాయక్ AI అంటే ఏమిటి?',
    q2_ans: 'బిఐఎస్ సహాయక్ AI అనేది ధృవీకరించబడిన మూలాల ఆధారంగా పనిచేసే ఒక తెలివైన డిజిటల్ సహాయకుడు. సంక్లిష్టమైన సాంకేతిక ప్రమాణాలు మరియు ప్రభుత్వ నిబంధనలను సామాన్యులకు అర్థమయ్యే సరళమైన భాషలోకి ఇది అనువదిస్తుంది.',
    q3_title: '3. ఈ అప్లికేషన్ ఎందుకు సృష్టించబడింది?',
    q3_ans: 'వందలాది భారతీయ ప్రమాణాలు, ల్యాబ్ టెస్టింగ్ నిబంధనలు మరియు సర్టిఫికేషన్ ప్రక్రియలను అర్థం చేసుకోవడం కష్టంగా ఉంటుంది. ఈ సమస్యను పరిష్కరించి, ప్రామాణిక సమాచారాన్ని వేగంగా మరియు సులభంగా అందించడానికి ఇది రూపొందించబడింది.',
    q4_title: '4. ఈ ప్లాట్‌ఫామ్‌ను ఎవరు ఉపయోగించవచ్చు?',
    q4_ans: 'చిన్న పరిశ్రమలు, స్టార్టప్‌లు, పారిశ్రామికవేత్తలు, ఇంజనీరింగ్ విద్యార్థులు, బంగారు స్వచ్ఛత (HUID) & నాణ్యతను పరిశీలించే సాధారణ వినియోగదారులు మరియు ఎగుమతి-దిగుమతిదారులు దీనిని ఉపయోగించవచ్చు.',
    q5_title: '5. వినియోగదారులు ఏమి అడగవచ్చు?',
    q5_ans: 'ఉత్పత్తి పేరుతో భారతీయ ప్రమాణాలను శోధించడం (ఉదా. త్రాగునీరు, సిమెంట్, బొమ్మలు), IS నంబర్ల వివరాలు, ISI మార్క్ లేదా CRS నమోదు ప్రక్రియలు మరియు గుర్తింపు పొందిన పరీక్షా ప్రయోగశాలల సమాచారం అడగవచ్చు.',
    q6_title: '6. ఇది అధికారిక BIS పోర్టల్ అవునా?',
    q6_ans: 'కాదు. బిఐఎస్ సహాయక్ AI అనేది నిర్ణయ మద్దతు మరియు విద్యా ప్రయోజనాల కోసం రూపొందించబడిన స్వతంత్ర పరిశోధనా ప్రోటోటైప్. ఇది సర్టిఫికేట్లు లేదా లైసెన్సులను మంజూరు చేయదు. అధికారిక సమాచారం కోసం bis.gov.in చూడండి.'
  },
  hi: {
    appName: 'बीआईएस सहायक AI',
    appSub: 'भारतीय मानक ब्यूरो डिजिटल सहायक',
    nationalBody: 'भारत का राष्ट्रीय मानक निकाय (BIS)',
    groundedAssistant: 'सत्यापित स्रोतों पर आधारित AI सहायक',
    navWelcome: 'अवलोकन',
    navChat: 'चैट सहायक',
    navFindStandard: 'मानक खोजें',
    navCatalog: 'डायरेक्टरी',
    start: 'आरंभ करें',
    startBtn: 'आरंभ करें',
    findStandard: 'मानक खोजें',
    exploreCatalog: 'मानक निर्देशिका देखें',
    searchPlaceholder: 'IS कोड (उदा. 14543, 1786) या उत्पाद नाम (पानी, सीमेंट, खिलौने) से खोजें...',
    typeQueryPlaceholder: 'भारतीय मानकों, आईएसआई मार्क या सीआरएस के बारे में कोई भी प्रश्न पूछें (उदा. IS 14543 पेयजल)...',
    askSahayak: 'सहायक AI से पूछें',
    clearChat: 'बातचीत साफ़ करें',
    clearHistory: 'बातचीत साफ़ करें',
    send: 'पूछें',
    queryBtn: 'पूछें',
    copyGuidance: 'मार्गदर्शन कॉपी करें',
    copiedGuidance: 'कॉपी किया गया!',
    generateChecklistAction: 'अनुपालन चेकलिस्ट तैयार करें',
    voiceInput: 'वॉयस द्वारा पूछें (माइक्रोफ़ोन)',
    listening: 'सुन रहा हूँ...',
    listeningPrompt: (lang: string) => `सुन रहा हूँ... कृपया ${lang} में बोलें`,
    micNotSupported: 'इस ब्राउज़र में वॉयस रिकग्निशन समर्थित नहीं है। कृपया टाइप करें।',
    micDenied: 'माइक्रोफ़ोन अनुमति अस्वीकृत है। कृपया अनुमति दें या टाइप करें।',
    stopListening: 'रोकें',
    openOfficialPortal: 'आधिकारिक पोर्टल खोलें',
    details: 'विवरण',
    mandatoryQCO: 'अनिवार्य QCO',
    mandatoryQCOOnly: 'केवल अनिवार्य QCO',
    allStandards: 'सभी मानक',
    popularSearches: 'लोकप्रिय खोजें:',
    filterBySector: 'उद्योग क्षेत्र के अनुसार फ़िल्टर करें:',
    showingCount: (showing, total) => `${total} में से ${showing} मानक प्रदर्शित`,
    noStandardsFound: 'कोई मिलता-जुलता भारतीय मानक नहीं मिला',
    resetFilters: 'फ़िल्टर रीसेट करें',
    disclaimerTitle: 'सांविधिक प्रोटोटाइप अस्वीकरण',
    disclaimerText: 'बीआईएस सहायक AI निर्णय सहायता और शैक्षिक मार्गदर्शन के लिए एक स्वतंत्र प्रोटोटाइप है। यह आधिकारिक बीआईएस पोर्टल नहीं है और कानूनी प्रमाणन जारी नहीं करता है। आधिकारिक विवरण bis.gov.in या manakonline.in पर सत्यापित करें।',
    complianceChecklistBtn: 'अनुपालन चेकलिस्ट तैयार करें',
    copyChecklistBtn: 'चेकलिस्ट कॉपी करें',
    checklistCopied: 'चेकलिस्ट कॉपी हो गई!',
    tryPrompt: 'पूछें:',
    onlineStatus: 'सत्यापित ज्ञान भंडार',
    heroHeadline: 'बीआईएस सहायक AI',
    heroSubheadline: 'भारतीय मानकों और सेवाओं को सरलता से समझें',
    heroDescription: 'बीआईएस सहायक AI एक प्रामाणिक स्रोत-आधारित डिजिटल सहायक है जो उपयोगकर्ताओं को सरल भाषा में बीआईएस मानकों और प्रमाणन प्रक्रियाओं को खोजने और समझने में सहायता करता है।',
    welcomeTitle: 'बीआईएस सहायक AI में आपका स्वागत है',
    welcomeSubtitle: 'भारतीय मानकों और सेवाओं को सरलता से समझें',
    welcomeDescription: 'बीआईएस सहायक AI एक प्रामाणिक स्रोत-आधारित डिजिटल सहायक है जो उपयोगकर्ताओं को सरल भाषा में बीआईएस मानकों और प्रमाणन प्रक्रियाओं को खोजने और समझने में सहायता करता है।',
    faqSectionTitle: 'वह सब कुछ जो आपको जानना आवश्यक है',
    faqSectionSubtitle: 'अक्सर पूछे जाने वाले प्रश्न और आवश्यक अवलोकन',
    sixPillars: '6 मुख्य संस्थागत और वास्तुकला स्तंभ',
    readyToQuery: 'क्या आप भारतीय मानकों और नियमों के बारे में पूछने के लिए तैयार हैं?',
    readyToQuerySub: 'मानकों, अनिवार्य QCO और प्रयोगशाला परीक्षण आवश्यकताओं के बारे में जानने के लिए बीआईएस सहायक AI से बातचीत शुरू करें।',
    q1_title: '1. BIS का क्या अर्थ है?',
    q1_ans: 'BIS का अर्थ भारतीय मानक ब्यूरो (Bureau of Indian Standards) है, जो BIS अधिनियम 2016 के तहत स्थापित भारत का राष्ट्रीय मानक निकाय है। यह मानकीकरण, गुणवत्ता प्रमाणन और देश भर में उपभोक्ता सुरक्षा सुनिश्चित करने के लिए जिम्मेदार है।',
    q2_title: '2. बीआईएस सहायक AI क्या है?',
    q2_ans: 'बीआईएस सहायक AI एक बुद्धिमान, स्रोत-सत्यापित डिजिटल सहायक है। यह जटिल तकनीकी मानकों, गजट अधिसूचनाओं और प्रमाणन दिशानिर्देशों को सरल और संरचित भाषा में प्रस्तुत करता है।',
    q3_title: '3. यह एप्लिकेशन क्यों बनाया गया?',
    q3_ans: 'सैकड़ों भारतीय मानकों, लैब परीक्षण आदेशों और लाइसेंसिंग प्रक्रियाओं को समझना आम लोगों के लिए कठिन हो सकता है। इस खोज प्रक्रिया को तेज, सहज और सभी के लिए सुलभ बनाने के लिए इसे बनाया गया है।',
    q4_title: '4. इस प्लेटफॉर्म का उपयोग कौन कर सकता है?',
    q4_ans: 'लघु उद्योग (MSME), स्टार्टअप, उद्यमी, इंजीनियरिंग के छात्र, सोने के हॉलमार्किंग (HUID) और सुरक्षा मानकों की जांच करने वाले उपभोक्ता और आयातक-निर्यातक इसका उपयोग कर सकते हैं।',
    q5_title: '5. उपयोगकर्ता क्या पूछ सकते हैं?',
    q5_ans: 'उपयोगकर्ता उत्पाद के नाम से मानक खोज सकते हैं (उदा. पेयजल, सीमेंट, खिलौने), विशिष्ट IS नंबर समझ सकते हैं, ISI मार्क या CRS पंजीकरण के चरण जान सकते हैं और मान्यता प्राप्त प्रयोगशालाओं की जानकारी ले सकते हैं।',
    q6_title: '6. क्या यह एक आधिकारिक BIS पोर्टल है?',
    q6_ans: 'नहीं। बीआईएस सहायक AI निर्णय समर्थन और शैक्षिक सहायता के लिए बनाया गया एक स्वतंत्र अनुसंधान प्रोटोटाइप है। यह लाइसेंस या प्रमाणन जारी नहीं करता है। आधिकारिक जानकारी के लिए bis.gov.in देखें।'
  }
};
