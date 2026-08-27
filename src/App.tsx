import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Header } from './components/Header';
import { WelcomeView } from './components/WelcomeView';
import { ChatView } from './components/ChatView';
import { StandardCatalogView } from './components/StandardCatalogView';
import { AboutView } from './components/AboutView';
import { PrivateToolsView } from './components/PrivateToolsView';
import { DeveloperGateView } from './components/DeveloperGateView';
import { DemoTourModal } from './components/DemoTourModal';
import { JuryEvaluationDrawer } from './components/JuryEvaluationDrawer';
import { Footer } from './components/Footer';
import { ChatMessage, ChatApiResponse, NavigationTab, UserType } from './types';
import { sendChatMessage, checkServerHealth } from './services/chatService';

import { LanguageProvider, useLanguage } from './context/LanguageContext';

function MainApp() {
  const { language } = useLanguage();
  // User type state: 'public' (default for end users) or 'developer' (authorized evaluators / judges / devs)
  const [userType, setUserType] = useState<UserType>(() => {
    const stored = sessionStorage.getItem('bis_user_type');
    return stored === 'developer' ? 'developer' : 'public';
  });

  const [activeTab, setActiveTab] = useState<NavigationTab>(() => {
    const hash = window.location.hash.replace('#', '') as NavigationTab;
    if (['welcome', 'chat', 'catalog', 'comparator', 'fee-estimator', 'about', 'private-tools', 'rag', 'test', 'guide'].includes(hash)) {
      return hash;
    }
    return 'welcome';
  });

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [isJuryDrawerOpen, setIsJuryDrawerOpen] = useState(false);
  const [lastQueryTimeMs, setLastQueryTimeMs] = useState(42);
  const [lastRetrievedCount, setLastRetrievedCount] = useState(4);
  const [lastConfidence, setLastConfidence] = useState('high');

  // Keep selectedLanguage in sync with context
  useEffect(() => {
    if (language === 'te') setSelectedLanguage('Telugu');
    else if (language === 'hi') setSelectedLanguage('Hindi');
    else setSelectedLanguage('English');
  }, [language]);

  // Global keyboard shortcut Ctrl+J / Cmd+J to toggle Jury Evaluation Panel
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'j') {
        e.preventDefault();
        setIsJuryDrawerOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  // Sync tab changes with URL hash for intuitive browser history / back button
  const handleTabChange = (tab: NavigationTab) => {
    setActiveTab(tab);
    window.location.hash = `#${tab}`;
  };

  const handleUnlockDevMode = () => {
    setUserType('developer');
    sessionStorage.setItem('bis_user_type', 'developer');
  };

  const handleLockDevMode = () => {
    setUserType('public');
    sessionStorage.removeItem('bis_user_type');
    // If currently on a private tab, redirect safely to public welcome
    if (['private-tools', 'rag', 'test', 'guide'].includes(activeTab)) {
      handleTabChange('welcome');
    }
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') as NavigationTab;
      if (['welcome', 'chat', 'catalog', 'about', 'private-tools', 'rag', 'test', 'guide'].includes(hash)) {
        setActiveTab(hash);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Check health and API key status on mount
  useEffect(() => {
    checkServerHealth().then(({ hasApiKey }) => {
      setHasApiKey(hasApiKey);
    });
  }, []);

  const handleSendMessage = async (queryText: string) => {
    const trimmed = queryText.trim();
    if (!trimmed || isLoading) return;

    handleTabChange('chat');

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: trimmed,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    const startTime = performance.now();

    try {
      const data: ChatApiResponse = await sendChatMessage(trimmed, selectedLanguage);
      const elapsedMs = Math.round(performance.now() - startTime);
      setLastQueryTimeMs(elapsedMs);
      setLastRetrievedCount(data.retrievedCount || 4);
      setLastConfidence(data.confidence || 'high');

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        text: data.answer,
        citations: data.citations,
        confidenceLevel: data.confidence,
        requiresLegalDisclaimer: data.requiresLegalDisclaimer,
        modelUsed: data.modelUsed,
        isFallback: data.isFallback,
        matchedSourcesCount: data.retrievedCount,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error('Chat request error:', err);
      const elapsedMs = Math.round(performance.now() - startTime);
      setLastQueryTimeMs(elapsedMs);
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        text: `Unable to process your question at this moment. (${err?.message || 'Connection error'})`,
        confidenceLevel: 'none',
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
  };

  const handleSelectPrompt = (prompt: string) => {
    handleSendMessage(prompt);
  };

  // Determine subtab for private tools if directly accessed
  const privateSubTab = (activeTab === 'test' ? 'test' : activeTab === 'guide' ? 'guide' : 'rag');
  const isPrivateTab = ['private-tools', 'rag', 'test', 'guide'].includes(activeTab);

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col justify-between selection:bg-zinc-900 selection:text-white font-sans antialiased text-zinc-900">
      <div>
        {/* Top Header Navigation (Filtered by User Type: Public vs Developer) */}
        <Header
          activeTab={activeTab}
          onTabChange={handleTabChange}
          selectedLanguage={selectedLanguage}
          onLanguageChange={setSelectedLanguage}
          hasApiKey={hasApiKey}
          onOpenDemoTour={() => setIsTourOpen(true)}
          onOpenJuryDrawer={() => setIsJuryDrawerOpen(true)}
          userType={userType}
          onLockDevMode={handleLockDevMode}
        />

        {/* Animated Main Content View */}
        <main className="w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              {activeTab === 'welcome' && (
                <WelcomeView
                  onStartChat={(prompt) => {
                    handleTabChange('chat');
                    if (prompt) {
                      handleSendMessage(prompt);
                    }
                  }}
                  onExploreCatalog={() => handleTabChange('catalog')}
                  onOpenComparator={() => handleTabChange('comparator')}
                  onOpenFeeEstimator={() => handleTabChange('fee-estimator')}
                />
              )}

              {activeTab === 'chat' && (
                <ChatView
                  messages={messages}
                  isLoading={isLoading}
                  onSendMessage={handleSendMessage}
                  onClearChat={handleClearChat}
                  onSelectStandardPrompt={handleSelectPrompt}
                  hasApiKey={hasApiKey}
                  onBackToWelcome={() => handleTabChange('welcome')}
                />
              )}

              {(activeTab === 'catalog' || activeTab === 'comparator' || activeTab === 'fee-estimator') && (
                <StandardCatalogView
                  activeSubTool={
                    activeTab === 'comparator'
                      ? 'comparator'
                      : activeTab === 'fee-estimator'
                      ? 'estimator'
                      : 'directory'
                  }
                  onSubToolChange={(tool) => {
                    if (tool === 'comparator') handleTabChange('comparator');
                    else if (tool === 'estimator') handleTabChange('fee-estimator');
                    else handleTabChange('catalog');
                  }}
                  onAskAboutStandard={(prompt) => {
                    handleTabChange('chat');
                    handleSendMessage(prompt);
                  }}
                />
              )}

              {activeTab === 'about' && (
                <AboutView
                  onStartChat={(prompt) => {
                    handleTabChange('chat');
                    if (prompt) {
                      handleSendMessage(prompt);
                    }
                  }}
                  onExploreCatalog={() => handleTabChange('catalog')}
                />
              )}

              {/* Private Developer & Presentation Routes: Restricted via Password Gate */}
              {isPrivateTab && (
                userType === 'developer' ? (
                  <PrivateToolsView
                    initialSubTab={privateSubTab}
                    onRunTestInChat={(prompt) => {
                      handleTabChange('chat');
                      handleSendMessage(prompt);
                    }}
                    onOpenDemoTour={() => setIsTourOpen(true)}
                  />
                ) : (
                  <DeveloperGateView
                    onUnlockSuccess={() => {
                      handleUnlockDevMode();
                    }}
                    onCancel={() => {
                      handleTabChange('welcome');
                    }}
                  />
                )
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Global Interactive Jury Tour Modal */}
      <DemoTourModal
        isOpen={isTourOpen}
        onClose={() => setIsTourOpen(false)}
        onRunPrompt={handleSendMessage}
        onSwitchTab={handleTabChange}
      />

      {/* Discrete Jury Presentation & Live Diagnostics Drawer */}
      <JuryEvaluationDrawer
        isOpen={isJuryDrawerOpen}
        onClose={() => setIsJuryDrawerOpen(false)}
        onRunScenario={handleSendMessage}
        lastQueryTimeMs={lastQueryTimeMs}
        lastRetrievedCount={lastRetrievedCount}
        lastConfidence={lastConfidence}
        hasApiKey={hasApiKey}
      />

      {/* Persistent Statutory Notice & Links Footer */}
      <Footer
        onNavigate={handleTabChange}
        onOpenJuryDrawer={() => setIsJuryDrawerOpen(true)}
      />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <MainApp />
    </LanguageProvider>
  );
}
