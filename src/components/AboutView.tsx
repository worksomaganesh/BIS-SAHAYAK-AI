import React from 'react';
import { motion } from 'motion/react';

interface AboutViewProps {
  onStartChat: (prompt?: string) => void;
  onExploreCatalog: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onStartChat, onExploreCatalog }) => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-12 font-sans">
      {/* Header Monolith */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-8 sm:p-10 bg-zinc-950 text-zinc-100 rounded-3xl border border-zinc-800 shadow-xl space-y-4 font-mono"
      >
        <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
          [ ABOUT & OFFICIAL SOURCES ]
        </div>
        <h1 className="text-3xl sm:text-5xl font-serif text-white tracking-tight leading-[1.12]">
          Understanding Indian Standards & BIS Services
        </h1>
        <p className="text-sm sm:text-base text-zinc-300 max-w-2xl font-sans leading-relaxed">
          BIS Sahayak AI is a source-grounded digital assistant that helps users discover and understand BIS Standards and services in simple language. It searches a curated BIS knowledge base and presents answers with verified source links.
        </p>
      </motion.div>

      {/* Grid: What is BIS vs What is BIS Sahayak AI */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: What is BIS? */}
        <div className="bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-3xl border border-zinc-300 dark:border-zinc-800 shadow-xs space-y-4">
          <div className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-wider">
            [ NATIONAL STANDARDS BODY ]
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif text-zinc-950 dark:text-white">
            What is the Bureau of Indian Standards (BIS)?
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans">
            The <strong>Bureau of Indian Standards (BIS)</strong> is the National Standards Body of India, established under the <em>Bureau of Indian Standards Act, 2016</em>. BIS is responsible for formulating Indian Standards (IS), running the ISI Mark certification scheme, overseeing Compulsory Registration (CRS) for electronics, administering Gold Hallmarking with 6-digit HUID, and maintaining testing laboratories across India.
          </p>
          <ul className="space-y-2 text-xs text-zinc-700 dark:text-zinc-300 font-mono pt-2 border-t border-zinc-200 dark:border-zinc-800">
            <li>• Over 21,000+ formulated Indian Standards</li>
            <li>• Product conformity marks: ISI Mark, CRS, Hallmarking</li>
            <li>• Central & Regional Laboratory Recognition Scheme (LRS)</li>
          </ul>
        </div>

        {/* Card 2: What is BIS Sahayak AI? */}
        <div className="bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-3xl border border-zinc-300 dark:border-zinc-800 shadow-xs space-y-4">
          <div className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-wider">
            [ DIGITAL DECISION SUPPORT ]
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif text-zinc-950 dark:text-white">
            What is BIS Sahayak AI?
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans">
            <strong>BIS Sahayak AI</strong> is an AI-powered intelligent information assistant built for hackathon evaluation (SIH26107). It simplifies dense technical clauses, Quality Control Orders (QCOs), and licensing procedures into plain language with direct, clickable official source citations.
          </p>
          <ul className="space-y-2 text-xs text-zinc-700 dark:text-zinc-300 font-mono pt-2 border-t border-zinc-200 dark:border-zinc-800">
            <li>• 100% document-grounded answers without guessing</li>
            <li>• Interactive clause inspection and official portal links</li>
            <li>• Reliable local fallback when offline or without API keys</li>
          </ul>
        </div>
      </div>

      {/* How to use */}
      <div className="bg-zinc-50 dark:bg-zinc-900/50 p-6 sm:p-8 rounded-3xl border border-zinc-300 dark:border-zinc-800 space-y-6 font-mono">
        <div>
          <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
            [ SIMPLE USER WORKFLOW ]
          </div>
          <h3 className="text-xl sm:text-2xl font-serif text-zinc-950 dark:text-white mt-0.5">
            How to Use BIS Sahayak AI
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-300 dark:border-zinc-800 shadow-2xs space-y-2 font-sans">
            <span className="font-mono text-xs font-bold text-zinc-500 block">
              [ STAGE 1 ]
            </span>
            <h4 className="text-lg font-serif text-zinc-950 dark:text-white">Ask in Plain Language</h4>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Type questions naturally or search by standard number (e.g. <em>IS 14543</em>, <em>IS 1786</em>) or product name (e.g. <em>drinking water</em>, <em>toys</em>, <em>helmets</em>).
            </p>
          </div>

          <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-300 dark:border-zinc-800 shadow-2xs space-y-2 font-sans">
            <span className="font-mono text-xs font-bold text-zinc-500 block">
              [ STAGE 2 ]
            </span>
            <h4 className="text-lg font-serif text-zinc-950 dark:text-white">Read Grounded Answers</h4>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              The assistant scans verified clauses, highlights mandatory Quality Control Orders (QCOs), and structures requirements clearly.
            </p>
          </div>

          <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-300 dark:border-zinc-800 shadow-2xs space-y-2 font-sans">
            <span className="font-mono text-xs font-bold text-zinc-500 block">
              [ STAGE 3 ]
            </span>
            <h4 className="text-lg font-serif text-zinc-950 dark:text-white">Verify Official Sources</h4>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Click source badges to inspect exact clause excerpts and open official links on Manakonline for legal applications.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
          <button
            onClick={() => onStartChat()}
            className="px-5 py-2.5 bg-zinc-950 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-white text-white dark:text-zinc-950 font-bold rounded-xl shadow-xs transition-all cursor-pointer uppercase tracking-wider"
          >
            [ Ask a Question Now → ]
          </button>
          <button
            onClick={onExploreCatalog}
            className="px-4 py-2.5 bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100 border border-zinc-300 dark:border-zinc-700 font-bold rounded-xl transition-all cursor-pointer uppercase"
          >
            [ Search Standard Catalog ]
          </button>
        </div>
      </div>

      {/* Official Portals Directory */}
      <div className="bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-3xl border border-zinc-300 dark:border-zinc-800 shadow-xs space-y-6 font-mono">
        <div>
          <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
            [ AUTHENTIC GOVERNMENT CHANNELS ]
          </div>
          <h3 className="text-lg font-bold font-display text-zinc-950 dark:text-white mt-0.5 font-sans">
            Official BIS Portals & Services Directory
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs font-sans">
          {[
            {
              title: 'BIS Official Portal',
              url: 'https://www.bis.gov.in',
              desc: 'Official website for standards formulation, gazette notifications, hallmarking, and consumer affairs.',
              tag: 'Main Portal'
            },
            {
              title: 'Manakonline (e-BIS)',
              url: 'https://www.manakonline.in',
              desc: 'Digital portal for online license applications, Know Your Standard (KYS), and Scheme of Testing.',
              tag: 'e-Services'
            },
            {
              title: 'CRS Electronic Registration',
              url: 'https://www.crsbis.in',
              desc: 'Compulsory Registration Scheme for electronics, IT goods, solar inverters, and battery cells.',
              tag: 'CRS Portal'
            },
            {
              title: 'BIS Care Mobile App',
              url: 'https://www.bis.gov.in/consumer-affairs/bis-care-app/',
              desc: 'Official mobile app for citizens to verify 6-digit HUID on gold and authentic ISI mark registrations.',
              tag: 'Citizen App'
            },
            {
              title: 'Compulsory QCOs Registry',
              url: 'https://www.bis.gov.in/product-certification/products-under-compulsory-certification/',
              desc: 'Complete list of products covered under mandatory Quality Control Orders (QCOs).',
              tag: 'Mandatory List'
            },
            {
              title: 'Laboratory Network (LRS)',
              url: 'https://www.bis.gov.in/laboratory-overview/',
              desc: 'Directory of Central, Regional, and recognized testing laboratories under LRS.',
              tag: 'Testing Network'
            }
          ].map((portal, idx) => (
            <a
              key={idx}
              href={portal.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-2xl flex flex-col justify-between group transition-all"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-zinc-600 dark:text-zinc-400 uppercase px-2 py-0.5 rounded bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700">
                    [ {portal.tag} ]
                  </span>
                </div>
                <h4 className="font-bold font-display text-zinc-950 dark:text-white text-sm">
                  {portal.title}
                </h4>
                <p className="text-zinc-600 dark:text-zinc-400 text-xs leading-relaxed font-sans">
                  {portal.desc}
                </p>
              </div>
              <span className="text-[11px] font-mono text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-950 dark:group-hover:text-white underline mt-3 block">
                [ {portal.url.replace('https://', '')} → ]
              </span>
            </a>
          ))}
        </div>
      </div>

      {/* Mandatory Statutory Notice */}
      <div className="p-5 bg-zinc-100 dark:bg-zinc-900 rounded-2xl border border-zinc-300 dark:border-zinc-800 text-xs text-zinc-800 dark:text-zinc-200 space-y-1 font-mono">
        <span className="font-bold text-zinc-950 dark:text-white uppercase tracking-wider block">
          [ STATUTORY PROTOTYPE NOTICE ]
        </span>
        <p className="leading-relaxed font-sans text-xs text-zinc-700 dark:text-zinc-300">
          BIS Sahayak AI is a hackathon prototype for navigating BIS-related information. It is not an official BIS portal and does not provide certification approval, legal advice, or final compliance decisions. Always verify current information through official BIS sources on <a href="https://www.bis.gov.in" target="_blank" rel="noopener noreferrer" className="underline font-bold text-zinc-950 dark:text-white">www.bis.gov.in</a> and <a href="https://www.manakonline.in" target="_blank" rel="noopener noreferrer" className="underline font-bold text-zinc-950 dark:text-white">www.manakonline.in</a>.
        </p>
      </div>
    </div>
  );
};
export default AboutView;
