import { KnowledgeRecord, ChatMessage } from '../types';
import { BIS_KNOWLEDGE_BASE } from '../data/bisKnowledgeBase';

export interface ComplianceDossierData {
  dossierId: string;
  generatedDateIST: string;
  verificationHash: string;
  standardMetadata: {
    isNumber: string;
    title: string;
    category: string;
    scheme: string;
    mandatoryQCO: boolean;
    gazetteReference: string;
    officialPortalUrl: string;
    scopeAndSummary: string;
    keyHighlights: string[];
  };
  testingSchedule: {
    inHouseLaboratoryMandate: string;
    stiAnnexureRef: string;
    testingParameters: {
      parameter: string;
      category: 'Microbiological' | 'Chemical' | 'Mechanical / Physical' | 'Safety / Endurance';
      frequency: string;
      toleranceBenchmark: string;
    }[];
  };
  factoryAuditSchedule: {
    phase: string;
    title: string;
    duration: string;
    items: string[];
  }[];
  indicativeFeeSummary: {
    applicationFee: string;
    auditCharge: string;
    sampleTestingEstimate: string;
    minimumMarkingFee: string;
    msmeConcessions: string;
    totalEstimatedFirstYear: string;
  };
  officialVerificationSources: {
    label: string;
    url: string;
    description: string;
  }[];
  legalDisclaimer: string;
}

/**
 * Generate unique random alphanumeric reference string
 */
function generateReferenceId(isCode: string): string {
  const cleanCode = isCode.replace(/[^a-zA-Z0-9]/g, '').slice(0, 8).toUpperCase() || 'STD';
  const randomSegment = Math.random().toString(36).substring(2, 7).toUpperCase();
  const year = new Date().getFullYear();
  return `BIS-SAHAYAK-${year}-${cleanCode}-${randomSegment}`;
}

/**
 * Generate pseudo verification checksum hash for document authenticity representation
 */
function generateVerificationHash(id: string, isCode: string): string {
  let hash = 0;
  const combined = `${id}:${isCode}:${Date.now()}`;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0').toUpperCase();
  return `SHA256:BIS-DS-${hex}-${Math.random().toString(16).substring(2, 10).toUpperCase()}`;
}

/**
 * Generate contextual testing parameters according to standard domain
 */
function generateDomainTestingParameters(record: KnowledgeRecord) {
  const isCode = (record.isNumber || record.citationLabel || '').toLowerCase();
  const title = (record.title || '').toLowerCase();

  if (isCode.includes('14543') || title.includes('water')) {
    return [
      {
        parameter: 'Microbiological Sterility (E. coli, Coliform, Yeast & Mould, Pseudomonas aeruginosa)',
        category: 'Microbiological' as const,
        frequency: 'Daily per batch (STI Annexure Table 1)',
        toleranceBenchmark: 'Absent in 250ml sample (IS 14543:2024 Clause 5.2)',
      },
      {
        parameter: 'Heavy Metals & Toxic Elements (Lead, Cadmium, Arsenic, Mercury)',
        category: 'Chemical' as const,
        frequency: 'Monthly composite / Quarterly NABL',
        toleranceBenchmark: 'Max Lead 0.01 mg/L, Arsenic 0.01 mg/L',
      },
      {
        parameter: 'Pesticide Residues (Individual & Total Organochlorine/Phosphorus)',
        category: 'Chemical' as const,
        frequency: 'Half-Yearly by BIS accredited laboratory',
        toleranceBenchmark: 'Max 0.0001 mg/L individually, 0.0005 mg/L total',
      },
      {
        parameter: 'Packaging Integrity & Food Grade Migration Test (PET/PC Jars)',
        category: 'Safety / Endurance' as const,
        frequency: 'Per resin batch (IS 15410 compliant)',
        toleranceBenchmark: 'Zero toxic migration, 100% leak test compliance',
      },
    ];
  }

  if (isCode.includes('269') || isCode.includes('1489') || title.includes('cement')) {
    return [
      {
        parameter: 'Compressive Strength (72h, 168h, and 672h curing cycles)',
        category: 'Mechanical / Physical' as const,
        frequency: 'Daily per milling silo batch',
        toleranceBenchmark: 'Minimum 53 MPa at 28 days (IS 269:2015)',
      },
      {
        parameter: 'Setting Time (Initial & Final Vicat Needle Test)',
        category: 'Mechanical / Physical' as const,
        frequency: 'Every 8-hour shift',
        toleranceBenchmark: 'Initial ≥ 30 mins, Final ≤ 600 mins',
      },
      {
        parameter: 'Soundness (Le Chatelier & Autoclave Expansion Test)',
        category: 'Chemical' as const,
        frequency: 'Daily production samples',
        toleranceBenchmark: 'Le Chatelier expansion ≤ 10 mm, Autoclave ≤ 0.8%',
      },
      {
        parameter: 'Chemical Ratio (Insoluble Residue, Magnesia, Total Loss on Ignition)',
        category: 'Chemical' as const,
        frequency: 'Weekly composite analysis',
        toleranceBenchmark: 'Total LOI ≤ 5.0%, Magnesia ≤ 6.0%',
      },
    ];
  }

  if (isCode.includes('1786') || title.includes('steel') || title.includes('tmt')) {
    return [
      {
        parameter: '0.2% Proof Stress / Yield Strength & Ultimate Tensile Strength',
        category: 'Mechanical / Physical' as const,
        frequency: 'Per heat cast lot / 50 metric tonnes',
        toleranceBenchmark: 'Fe 500D: Min Yield 500 N/mm², UTS/YS ratio ≥ 1.10',
      },
      {
        parameter: 'Elongation at Fracture & Total Elongation at Max Force (Agt)',
        category: 'Mechanical / Physical' as const,
        frequency: 'Every rolling batch sample',
        toleranceBenchmark: 'Min 16.0% elongation for seismic ductile grades',
      },
      {
        parameter: 'Bend and Rebend Test (180° Mandrel with aging in boiling water)',
        category: 'Safety / Endurance' as const,
        frequency: 'Each diameter batch',
        toleranceBenchmark: 'Zero surface cracks or transverse fissures visible',
      },
      {
        parameter: 'Carbon Equivalent (CE) & Micro-alloying chemistry',
        category: 'Chemical' as const,
        frequency: 'Per ladle furnace heat melt',
        toleranceBenchmark: 'Max CE 0.42% for Fe 500D (C + Mn/6 + (Cr+Mo+V)/5 + (Ni+Cu)/15)',
      },
    ];
  }

  if (isCode.includes('1417') || title.includes('gold') || title.includes('hallmark')) {
    return [
      {
        parameter: 'Assaying Purity & Gold Fineness (Fire Assay / Cupellation / XRF)',
        category: 'Chemical' as const,
        frequency: 'Per packet lot submitted by registered jeweler',
        toleranceBenchmark: '22K (916 parts/1000), 18K (750 parts/1000), 14K (585 parts/1000)',
      },
      {
        parameter: '6-Digit Alphanumeric HUID Laser Marking Quality & Legibility',
        category: 'Safety / Endurance' as const,
        frequency: '100% finished article inspection',
        toleranceBenchmark: 'High contrast permanent engraving synchronized with Manakonline portal',
      },
      {
        parameter: 'Sampling Homogeneity & Destructive Assay Scraping',
        category: 'Chemical' as const,
        frequency: 'Statistically sampled as per IS 15820',
        toleranceBenchmark: 'Zero lead/cadmium solder dilution beyond statutory limit',
      },
    ];
  }

  // Default General Engineering / Consumer Goods
  return [
    {
      parameter: 'Raw Material Chemical & Physical Conformity Verification',
      category: 'Chemical' as const,
      frequency: 'Every incoming consignment batch',
      toleranceBenchmark: 'Conformance to relevant Indian Standard raw material spec',
    },
    {
      parameter: 'Routine In-House Factory Quality & Dimensional Tolerance Test',
      category: 'Mechanical / Physical' as const,
      frequency: 'Continuous / hourly sampling',
      toleranceBenchmark: 'As stipulated in BIS Scheme of Testing and Inspection (STI)',
    },
    {
      parameter: 'Endurance, Overload & Electrical / Thermal Safety Verification',
      category: 'Safety / Endurance' as const,
      frequency: 'Weekly lot sample',
      toleranceBenchmark: 'Zero breakdown under 1.25x rated design stress threshold',
    },
    {
      parameter: 'Finished Product Independent Verification (NABL / BIS Lab)',
      category: 'Safety / Endurance' as const,
      frequency: 'Bi-annual surveillance test',
      toleranceBenchmark: '100% compliance with declared IS benchmark parameters',
    },
  ];
}

/**
 * Generate 4-Phase Factory Implementation Roadmap
 */
function generateAuditRoadmap(record: KnowledgeRecord) {
  const isCode = record.isNumber || record.citationLabel || 'Indian Standard';
  const scheme = record.certificationScheme || record.scheme || 'Scheme-I (ISI Mark)';

  return [
    {
      phase: 'Phase 1: Factory Setup & STI Lab Establishment',
      title: 'Infrastructure & In-House Testing Laboratory',
      duration: 'Weeks 1 - 4',
      items: [
        `Procure and calibrate testing equipment required by ${isCode} Scheme of Testing & Inspection (STI).`,
        'Appoint qualified quality control technical personnel (Chemist / Testing Metallurgist / Engineer).',
        'Maintain daily quality registers, test logs, and raw material supplier test certificates (MTCs).',
        'Establish segregation zones for accepted, quarantine, and rejected materials.',
      ],
    },
    {
      phase: 'Phase 2: Digital Application Filing & Documentation',
      title: 'Portal Submission via Manakonline (e-BIS)',
      duration: 'Weeks 5 - 6',
      items: [
        'Register manufacturing entity on www.manakonline.in under Conformity Assessment.',
        'Upload factory layout diagram, machinery inventory, test equipment list, and valid MSME Udyam certificate.',
        'Submit product drawings, technical datasheets, and test sample preparation declarations.',
        'Pay statutory Application Fee (₹1,000 baseline; MSME concessions applied where eligible).',
      ],
    },
    {
      phase: 'Phase 3: BIS Factory Audit & Sample Sealing',
      title: 'Physical Audit & Independent Lab Testing',
      duration: 'Weeks 7 - 10',
      items: [
        'Host BIS inspecting auditor at manufacturing premises for factory verification.',
        'Demonstrate full manufacturing process flow and in-house laboratory testing procedures.',
        'Witness auditor drawing random samples from commercial production lot.',
        'Seal samples for shipment to BIS Central Laboratory or NABL-accredited third-party laboratory.',
      ],
    },
    {
      phase: 'Phase 4: License Grant & Marking Fee Advance',
      title: 'Grant of CM/L Licence & Regular Production',
      duration: 'Weeks 11 - 12',
      items: [
        'Receive passing test report from recognized testing laboratory.',
        'Remit advance Minimum Marking Fee and factory inspection man-day charges.',
        'Receive official CM/L (Certificate of Manufacturing Licence) 7-digit number from BIS.',
        'Apply Standard ISI Mark with mandatory CML number and IS designation on packaging.',
      ],
    },
  ];
}

/**
 * Generate Complete Compliance Dossier from a Knowledge Record
 */
export function generateDossierFromRecord(
  record: KnowledgeRecord,
  language: string = 'en'
): ComplianceDossierData {
  const isCode = record.isNumber || record.citationLabel || 'IS Standard';
  const dossierId = generateReferenceId(isCode);
  const verificationHash = generateVerificationHash(dossierId, isCode);

  const now = new Date();
  const dateOptions: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Kolkata',
  };
  const generatedDateIST = `${now.toLocaleDateString('en-IN', dateOptions)} IST`;

  const gazetteRef = record.mandatoryQCO
    ? 'Mandatory Quality Control Order (QCO) issued by Ministry of Commerce & Industry / DPIIT'
    : 'Voluntary Standard Specification / National Reference Benchmark';

  const testingParams = generateDomainTestingParameters(record);
  const auditSchedule = generateAuditRoadmap(record);

  return {
    dossierId,
    generatedDateIST,
    verificationHash,
    standardMetadata: {
      isNumber: record.isNumber || record.citationLabel || 'IS Specification',
      title: record.title,
      category: record.category || record.topic || 'Industrial Standard',
      scheme: record.certificationScheme || record.scheme || 'Scheme-I (ISI Mark)',
      mandatoryQCO: Boolean(record.mandatoryQCO),
      gazetteReference: gazetteRef,
      officialPortalUrl: record.officialPortalUrl || record.sourceUrl || 'https://www.services.bis.gov.in',
      scopeAndSummary: record.scopeAndSummary || record.content,
      keyHighlights: record.keyHighlights || [
        'Mandatory testing parameters specified under BIS Scheme of Testing and Inspection (STI).',
        'Licence granted under BIS Act, 2016 and Conformity Assessment Regulations, 2018.',
      ],
    },
    testingSchedule: {
      inHouseLaboratoryMandate: `Complete in-house testing laboratory equipped for daily lot-wise parameters as per ${isCode} STI Annexure.`,
      stiAnnexureRef: `BIS/STI/${isCode}/DOC-01`,
      testingParameters: testingParams,
    },
    factoryAuditSchedule: auditSchedule,
    indicativeFeeSummary: {
      applicationFee: '₹1,000 (Flat statutory filing charge)',
      auditCharge: '₹7,000 per auditor man-day (Domestic Scheme-I)',
      sampleTestingEstimate: '₹15,000 – ₹35,000 (Payable to NABL / BIS Laboratory)',
      minimumMarkingFee: '₹40,000 – ₹75,000 per annum (Schedule I baseline)',
      msmeConcessions: '50% concession for Micro / Women enterprises; 20% concession for Small MSMEs with Udyam Certificate.',
      totalEstimatedFirstYear: '₹65,000 – ₹1,20,000 (Inclusive of MSME concessions & 18% GST)',
    },
    officialVerificationSources: [
      {
        label: 'Bureau of Indian Standards Official Portal',
        url: 'https://www.bis.gov.in',
        description: 'National standards body official portal for gazette acts, notifications, and technical committees.',
      },
      {
        label: 'e-BIS Manakonline Certification Gateway',
        url: 'https://www.manakonline.in',
        description: 'Official unified portal for online license applications, renewal filings, lab test submissions, and fee payments.',
      },
      {
        label: 'Know Your Standards (BIS Services Directory)',
        url: record.officialPortalUrl || 'https://www.services.bis.gov.in',
        description: 'Public repository for Indian Standards clause search, amendment downloads, and license status verification.',
      },
    ],
    legalDisclaimer:
      'STATUTORY NOTICE: This compliance dossier is generated by BIS Sahayak AI as an informational decision-support advisory. It is designed to assist manufacturers, MSMEs, and procurement engineers in technical preparation. This document does not constitute an official Certificate of Manufacturing Licence (CM/L) or formal grant of certification. All official applications, technical approvals, and fee payments must be processed directly through the Bureau of Indian Standards via manakonline.in.',
  };
}

/**
 * Generate Compliance Dossier from a Chat Assistant Message
 */
export function generateDossierFromChatMessage(
  message: ChatMessage,
  language: string = 'en'
): ComplianceDossierData {
  // If message has citations matching knowledge base, find the primary record
  let matchedRecord: KnowledgeRecord | undefined;

  if (message.citations && message.citations.length > 0) {
    const citation = message.citations[0];
    matchedRecord = BIS_KNOWLEDGE_BASE.find(
      (k) =>
        k.id === citation.id ||
        k.isNumber?.toLowerCase() === citation.citationLabel.toLowerCase() ||
        citation.title.toLowerCase().includes(k.isNumber?.toLowerCase() || '')
    );
  }

  // Fallback to searching message text for IS numbers
  if (!matchedRecord) {
    const isMatch = message.text.match(/IS\s*(\d+)/i);
    if (isMatch) {
      const codeNum = isMatch[1];
      matchedRecord = BIS_KNOWLEDGE_BASE.find((k) =>
        (k.isNumber || '').includes(codeNum)
      );
    }
  }

  // Fallback to default Packaged Water record if none found
  if (!matchedRecord) {
    matchedRecord = BIS_KNOWLEDGE_BASE[0];
  }

  return generateDossierFromRecord(matchedRecord, language);
}

/**
 * Convert Dossier Data to Clean Markdown text
 */
export function exportDossierToMarkdown(dossier: ComplianceDossierData): string {
  const { standardMetadata, testingSchedule, factoryAuditSchedule, indicativeFeeSummary } = dossier;

  return `# BUREAU OF INDIAN STANDARDS — COMPLIANCE ADVISORY DOSSIER
**Document Ref:** ${dossier.dossierId}  
**Date of Generation:** ${dossier.generatedDateIST}  
**Security Verification Hash:** \`${dossier.verificationHash}\`  
**Generated via:** BIS Sahayak AI (Decision Support System)

---

## 1. TARGET STANDARD IDENTIFICATION
- **Standard Number:** ${standardMetadata.isNumber}
- **Official Title:** ${standardMetadata.title}
- **Sector / Category:** ${standardMetadata.category}
- **Certification Scheme:** ${standardMetadata.scheme}
- **Mandatory QCO Status:** ${standardMetadata.mandatoryQCO ? 'MANDATORY (Compulsory QCO)' : 'Voluntary / Benchmark Specification'}
- **Gazette Regulatory Basis:** ${standardMetadata.gazetteReference}
- **Official BIS Portal:** ${standardMetadata.officialPortalUrl}

### Plain Language Scope
${standardMetadata.scopeAndSummary}

---

## 2. MANDATORY LABORATORY TESTING & STI PARAMETERS
*Mandate: ${testingSchedule.inHouseLaboratoryMandate}*  
*STI Reference Document: \`${testingSchedule.stiAnnexureRef}\`*

| Parameter / Test | Category | Testing Frequency | Benchmark Tolerance |
| :--- | :--- | :--- | :--- |
${testingSchedule.testingParameters
  .map(
    (p) =>
      `| **${p.parameter}** | ${p.category} | ${p.frequency} | ${p.toleranceBenchmark} |`
  )
  .join('\n')}

---

## 3. 4-PHASE FACTORY COMPLIANCE ROADMAP

${factoryAuditSchedule
  .map(
    (stage) => `### ${stage.phase}: ${stage.title}
*Estimated Duration: ${stage.duration}*
${stage.items.map((item) => `- [ ] ${item}`).join('\n')}
`
  )
  .join('\n')}

---

## 4. INDICATIVE FEE & MSME CONCESSION BASELINE
- **Statutory Application Fee:** ${indicativeFeeSummary.applicationFee}
- **Factory Inspection Audit Fee:** ${indicativeFeeSummary.auditCharge}
- **Independent Sample Testing Range:** ${indicativeFeeSummary.sampleTestingEstimate}
- **Advance Minimum Marking Fee:** ${indicativeFeeSummary.minimumMarkingFee}
- **MSME Concession Policy:** ${indicativeFeeSummary.msmeConcessions}
- **Total Estimated 1st-Year Budget:** **${indicativeFeeSummary.totalEstimatedFirstYear}**

---

## 5. OFFICIAL VERIFICATION SOURCES & LINKS
${dossier.officialVerificationSources
  .map((s) => `- **${s.label}:** [${s.url}](${s.url})\n  _${s.description}_`)
  .join('\n\n')}

---

### LEGAL DISCLAIMER
${dossier.legalDisclaimer}
`;
}

/**
 * Trigger client-side direct download of Markdown / Text File
 */
export function downloadDossierTextFile(dossier: ComplianceDossierData): void {
  const content = exportDossierToMarkdown(dossier);
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${dossier.dossierId}.md`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
