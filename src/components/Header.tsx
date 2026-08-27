import React, { useEffect, useState } from 'react';
import { motion, useScroll, useSpring } from 'motion/react';
import { NavigationTab, UserType, Language } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface HeaderProps {
  activeTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
  selectedLanguage: string;
  onLanguageChange: (lang: string) => void;
  hasApiKey: boolean;
  onOpenDemoTour: () => void;
  onOpenJuryDrawer?: () => void;
  userType?: UserType;
  onLockDevMode?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  selectedLanguage: _selectedLanguage,
  onLanguageChange,
  userType = 'public',
}) => {
  const { language, setLanguage, languageNames } = useLanguage();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Standard navigation links: Overview, Assistant, Directory, Compare, Fee Estimator
  const publicNavItems = [
    { id: 'welcome' as NavigationTab, label: language === 'te' ? 'అవలోకనం' : language === 'hi' ? 'अवलोकन' : 'Overview' },
    { id: 'chat' as NavigationTab, label: language === 'te' ? 'సహాయక్' : language === 'hi' ? 'सहायक' : 'Assistant' },
    { id: 'catalog' as NavigationTab, label: language === 'te' ? 'డైరెక్టరీ' : language === 'hi' ? 'निर्देशिका' : 'Directory' },
    { id: 'comparator' as NavigationTab, label: language === 'te' ? 'పోలిక' : language === 'hi' ? 'तुलना' : 'Compare' },
    { id: 'fee-estimator' as NavigationTab, label: language === 'te' ? 'ఫీజు కాలిక్యులేటర్' : language === 'hi' ? 'शुल्क कैलकुलेटर' : 'Fee Estimator' },
  ];

  const developerNavItems = [
    ...publicNavItems,
    { id: 'private-tools' as NavigationTab, label: 'Private Tools' },
  ];

  const navItems = userType === 'developer' ? developerNavItems : publicNavItems;

  const handleLangChange = (langCode: Language) => {
    setLanguage(langCode);
    if (langCode === 'en') onLanguageChange('English');
    else if (langCode === 'te') onLanguageChange('Telugu');
    else if (langCode === 'hi') onLanguageChange('Hindi');
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-200 ${
        scrolled
          ? 'bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 shadow-2xs'
          : 'bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md border-b border-zinc-200/80 dark:border-zinc-800/80'
      }`}
    >
      {/* Precision Scroll Progress Line */}
      <motion.div
        className="h-[2px] bg-zinc-950 dark:bg-white origin-left w-full absolute top-0 left-0 z-50"
        style={{ scaleX }}
      />

      {/* Main Clean Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
        {/* Minimalist Brand Title */}
        <div
          className="flex items-center gap-3 cursor-pointer select-none shrink-0"
          onClick={() => onTabChange('welcome')}
        >
          <div className="px-2.5 py-1 rounded-lg bg-zinc-950 text-white font-mono font-bold text-xs tracking-wider">
            BIS
          </div>
          <span className="font-serif text-2xl font-normal text-zinc-950 dark:text-white tracking-wide uppercase">
            BIS Sahayak
          </span>
        </div>

        {/* Standard Navigation Links */}
        <nav className="hidden md:inline-flex p-1 bg-zinc-100 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 relative">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`tab-${item.id}`}
                onClick={() => onTabChange(item.id as NavigationTab)}
                className={`relative z-10 px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold tracking-wide transition-colors cursor-pointer select-none uppercase ${
                  isActive
                    ? 'text-zinc-950 dark:text-white'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute inset-0 bg-white dark:bg-zinc-800 rounded-lg shadow-2xs border border-zinc-200 dark:border-zinc-700 -z-10"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Controls: Compact Language Selector */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-0.5 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-0.5 text-xs">
            {languageNames.map((langItem) => {
              const isSelected = language === langItem.code;
              return (
                <button
                  key={langItem.code}
                  id={`lang-btn-${langItem.code}`}
                  onClick={() => handleLangChange(langItem.code)}
                  className={`px-2 py-1 rounded-md text-xs font-mono transition-all cursor-pointer select-none uppercase ${
                    isSelected
                      ? 'bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white font-bold shadow-2xs'
                      : 'text-zinc-500 hover:text-zinc-950 dark:hover:text-white'
                  }`}
                  title={`Switch to ${langItem.label}`}
                >
                  {langItem.code.toUpperCase()}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile Navigation Row (Horizontal Scroll on Mobile) */}
      <div className="md:hidden px-4 pb-2.5 overflow-x-auto flex items-center gap-1.5 scrollbar-none border-t border-zinc-100 dark:border-zinc-800/60 pt-2">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id as NavigationTab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold tracking-wide shrink-0 transition-colors uppercase ${
                isActive
                  ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 font-bold shadow-2xs'
                  : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
export default Header;
