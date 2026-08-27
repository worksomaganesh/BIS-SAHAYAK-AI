import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';

interface ComplianceRoadmapCardProps {
  text: string;
}

interface ChecklistItem {
  id: string;
  stage: number;
  stageTitle: string;
  stepText: string;
  done: boolean;
}

export const ComplianceRoadmapCard: React.FC<ComplianceRoadmapCardProps> = ({ text }) => {
  const { language, t } = useLanguage();
  const [copied, setCopied] = useState(false);

  // Parse markdown lines to extract steps or build structured items
  const parseChecklist = (): ChecklistItem[] => {
    const lines = text.split('\n');
    const items: ChecklistItem[] = [];
    let currentStage = 1;
    let currentStageTitle = language === 'te' ? 'దరఖాస్తు & పత్రాలు' : language === 'hi' ? 'आवेदन एवं दस्तावेजीकरण' : 'Application & Documentation';

    lines.forEach((line, index) => {
      const trimmed = line.trim();
      if (trimmed.includes('Stage 1') || trimmed.includes('దశ 1') || trimmed.includes('चरण 1')) {
        currentStage = 1;
        currentStageTitle = language === 'te' ? 'దరఖాస్తు & పత్రాలు' : language === 'hi' ? 'आवेदन एवं दस्तावेजीकरण' : 'Application & Documentation';
      } else if (trimmed.includes('Stage 2') || trimmed.includes('దశ 2') || trimmed.includes('चरण 2')) {
        currentStage = 2;
        currentStageTitle = language === 'te' ? 'ల్యాబ్ & అంతర్గత పరీక్ష' : language === 'hi' ? 'प्रयोगशाला एवं आंतरिक परीक्षण' : 'In-House & Laboratory Testing';
      } else if (trimmed.includes('Stage 3') || trimmed.includes('దశ 3') || trimmed.includes('चरण 3')) {
        currentStage = 3;
        currentStageTitle = language === 'te' ? 'ఫ్యాక్టరీ తనిఖీ & నాణ్యత (STI)' : language === 'hi' ? 'फैक्टरी निरीक्षण एवं गुणवत्ता (STI)' : 'Factory Inspection & Quality Control';
      } else if (trimmed.includes('Stage 4') || trimmed.includes('దశ 4') || trimmed.includes('चरण 4')) {
        currentStage = 4;
        currentStageTitle = language === 'te' ? 'లైసెన్స్ మంజూరు & మార్కింగ్' : language === 'hi' ? 'लाइसेंस एवं मार्किंग' : 'Grant of License & Marking Schedule';
      }

      if (trimmed.startsWith('- [ ]') || trimmed.startsWith('- [x]') || trimmed.startsWith('▢') || trimmed.startsWith('• Step') || trimmed.startsWith('- Step')) {
        const cleanStep = trimmed
          .replace(/^- \[[ x]\]\s*/i, '')
          .replace(/^▢\s*/, '')
          .replace(/^[•-]\s*/, '');

        if (cleanStep.length > 5) {
          items.push({
            id: `item-${index}`,
            stage: currentStage,
            stageTitle: currentStageTitle,
            stepText: cleanStep,
            done: trimmed.includes('[x]'),
          });
        }
      }
    });

    // Default fallback 4 steps if parsing returned fewer
    if (items.length === 0) {
      return [
        {
          id: 'def-1',
          stage: 1,
          stageTitle: language === 'te' ? 'దరఖాస్తు & పత్రాలు' : language === 'hi' ? 'आवेदन एवं दस्तावेजीकरण' : 'Application & Documentation',
          stepText: language === 'te' 
            ? 'manakonline.in పోర్టల్‌లో ఫారమ్ V మరియు ఫ్యాక్టరీ లేఅవుట్ పత్రాలను సమర్పించండి.' 
            : language === 'hi' 
            ? 'manakonline.in पोर्टल पर फॉर्म V और फैक्ट्री लेआउट दस्तावेज जमा करें।'
            : 'Submit online Form V on manakonline.in with factory layout, manufacturing machinery details, and application fee.',
          done: false
        },
        {
          id: 'def-2',
          stage: 2,
          stageTitle: language === 'te' ? 'ల్యాబ్ & అంతర్గత పరీక్ష' : language === 'hi' ? 'प्रयोगशाला एवं आंतरिक परीक्षण' : 'In-House & Laboratory Testing',
          stepText: language === 'te'
            ? 'STI ప్రకారం అంతర్గత ల్యాబ్‌ను ఏర్పాటు చేసి, BIS గుర్తింపు పొందిన ప్రయోగశాలలో నమూనా పరీక్షలు చేయించండి.'
            : language === 'hi'
            ? 'STI के अनुसार इन-हाउस लैब स्थापित करें और बीआईएस मान्यता प्राप्त प्रयोगशाला में नमूना परीक्षण करवाएं।'
            : 'Establish in-house testing equipment per Scheme of Testing & Inspection (STI) and conduct sample tests at BIS-Recognized Lab.',
          done: false
        },
        {
          id: 'def-3',
          stage: 3,
          stageTitle: language === 'te' ? 'ఫ్యాక్టరీ తనిఖీ & నాణ్యత (STI)' : language === 'hi' ? 'ఫ్యాక్టరీ निरीक्षण एवं गुणवत्ता (STI)' : 'Factory Inspection & Quality Control',
          stepText: language === 'te'
            ? 'BIS సాంకేతిక అధికారి ద్వారా ఫ్యాక్టరీ ఆడిట్, నాణ్యతా సిబ్బంది మరియు టెస్ట్ రిజిస్టర్లను ధృవీకరించండి.'
            : language === 'hi'
            ? 'बीआईएस तकनीकी अधिकारी द्वारा फैक्ट्री ऑडिट, गुणवत्ता कर्मियों और परीक्षण रजिस्टरों का सत्यापन करवाएं।'
            : 'Host factory audit by BIS Technical Officer to inspect manufacturing operations, quality control staff, and test registers.',
          done: false
        },
        {
          id: 'def-4',
          stage: 4,
          stageTitle: language === 'te' ? 'లైసెన్స్ మంజూరు & మార్కింగ్' : language === 'hi' ? 'लाइसेंस एवं मार्किंग' : 'Grant of License & Marking Schedule',
          stepText: language === 'te'
            ? 'మార్కింగ్ రుసుము చెల్లించి CM/L నంబర్ మరియు అధికారిక ISI మార్క్‌ను పొందండి.'
            : language === 'hi'
            ? 'मार्किंग शुल्क का भुगतान करें और CM/L नंबर तथा आधिकारिक ISI मार्क प्राप्त करें।'
            : 'Pay statutory marking fees, obtain Certification of Manufacturing License (CM/L), and affix ISI mark with CML number.',
          done: false
        }
      ];
    }

    return items;
  };

  const [checklist, setChecklist] = useState<ChecklistItem[]>(parseChecklist);

  const toggleItem = (id: string) => {
    setChecklist(prev =>
      prev.map(item => (item.id === id ? { ...item, done: !item.done } : item))
    );
  };

  const handleCopyChecklist = () => {
    const lines = [
      `# BIS Compliance Checklist & Roadmap`,
      `Generated by BIS Sahayak AI (${new Date().toLocaleDateString()})\n`,
      ...checklist.map(item => `${item.done ? '[x]' : '[ ]'} [Stage ${item.stage}: ${item.stageTitle}] ${item.stepText}`),
      `\nOfficial Verification: https://www.manakonline.in / https://www.bis.gov.in`
    ];

    navigator.clipboard.writeText(lines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const stages = [1, 2, 3, 4];
  const completedCount = checklist.filter(c => c.done).length;
  const progressPercent = Math.round((completedCount / (checklist.length || 1)) * 100);

  return (
    <div className="my-4 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-2xl shadow-xs overflow-hidden text-zinc-950 dark:text-zinc-100 font-sans">
      {/* Header Banner */}
      <div className="p-4 bg-zinc-950 text-white flex flex-wrap items-center justify-between gap-3 font-mono">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-display font-bold text-sm text-white">
              [ BIS COMPLIANCE CHECKLIST & ROADMAP ]
            </h4>
            <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 text-[10px] font-bold border border-zinc-700">
              4-STAGE PROTOCOL
            </span>
          </div>
          <p className="text-[11px] text-zinc-400 mt-0.5 font-sans">
            {completedCount} of {checklist.length} milestones checked ({progressPercent}%)
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={handleCopyChecklist}
            className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg transition-colors border border-zinc-800 cursor-pointer text-[11px] font-bold uppercase"
            title="Copy Checklist to Clipboard"
          >
            {copied ? '[ Copied! ]' : '[ Copy Checklist ]'}
          </button>

          <button
            onClick={handlePrint}
            className="hidden sm:inline-flex items-center px-2.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white rounded-lg transition-colors border border-zinc-800 cursor-pointer text-[11px] font-bold uppercase"
            title="Print Roadmap"
          >
            [ Print ]
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-1">
        <motion.div
          className="bg-zinc-950 dark:bg-white h-1 transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Step-by-Step Roadmap */}
      <div className="p-4 sm:p-5 space-y-4 divide-y divide-zinc-200 dark:divide-zinc-800">
        {stages.map(stageNum => {
          const stageItems = checklist.filter(i => i.stage === stageNum);
          if (stageItems.length === 0) return null;
          const stageTitle = stageItems[0].stageTitle;

          return (
            <div key={stageNum} className="pt-3 first:pt-0 space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-zinc-950 dark:text-white uppercase tracking-wider">
                <span className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 text-[10px]">
                  [ Stage {stageNum} ]
                </span>
                <span>{stageTitle}</span>
              </div>

              <div className="space-y-2 pl-4">
                {stageItems.map(item => (
                  <div
                    key={item.id}
                    onClick={() => toggleItem(item.id)}
                    className={`flex items-start gap-2.5 p-2.5 rounded-xl border transition-all cursor-pointer select-none ${
                      item.done
                        ? 'bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-zinc-500 line-through'
                        : 'bg-zinc-50 dark:bg-zinc-900/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-zinc-100'
                    }`}
                  >
                    <button
                      type="button"
                      className="mt-0.5 font-mono text-xs font-bold shrink-0 cursor-pointer text-zinc-900 dark:text-zinc-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleItem(item.id);
                      }}
                    >
                      {item.done ? '[✓]' : '[ ]'}
                    </button>
                    <span className="text-xs sm:text-[13px] leading-relaxed font-sans font-medium">
                      {item.stepText}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Portal Action */}
      <div className="p-3 bg-zinc-50 dark:bg-zinc-900/50 border-t border-zinc-200 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
        <span className="text-[11px] text-zinc-500">
          Official Portal: <strong>manakonline.in</strong>
        </span>
        <a
          href="https://www.manakonline.in"
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1 bg-white dark:bg-zinc-800 hover:bg-zinc-100 text-zinc-950 dark:text-white border border-zinc-300 dark:border-zinc-700 rounded-lg font-bold uppercase transition-colors"
        >
          [ Open e-BIS Portal → ]
        </a>
      </div>
    </div>
  );
};
export default ComplianceRoadmapCard;
