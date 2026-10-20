/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, testFirestoreConnection, logoutUser } from './firebase.ts';
import { Header } from './components/Header.tsx';
import { Footer } from './components/Footer.tsx';
import { Calculator } from './components/Calculator.tsx';
import { HistoryView } from './components/HistoryView.tsx';
import { KnowledgeHub } from './components/KnowledgeHub.tsx';
import { HomeOverview } from './components/HomeOverview.tsx';
import { LoginPage } from './components/LoginPage.tsx';
import { ReportModal } from './components/ReportModal.tsx';
import { TeamPage } from './components/TeamPage.tsx';
import { CalculationResult } from './data/agronomy.ts';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState<'home' | 'calculator' | 'history' | 'knowledge' | 'team'>('home');
  const [reportResult, setReportResult] = useState<CalculationResult | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const [selectedCropForCalc, setSelectedCropForCalc] = useState<string>('durian');

  // Initialize Firebase Auth listener and test connection
  useEffect(() => {
    testFirestoreConnection();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthLoading(false);
      if (user) {
        // Ensure user lands on home page first upon login
        setCurrentTab('home');
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
      setCurrentUser(null);
    } catch (err) {
      console.error('Logout error:', err);
      setCurrentUser(null);
    }
  };

  const handleQuickReport = () => {
    setIsReportModalOpen(true);
  };

  const handleSearchCrop = (query: string) => {
    if (query.trim()) {
      setCurrentTab('calculator');
    }
  };

  // Auth Loading State
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#ebffe7] flex flex-col items-center justify-center font-sans">
        <div className="w-12 h-12 rounded-full border-4 border-emerald-300 border-t-emerald-800 animate-spin mb-4"></div>
        <p className="text-emerald-950 font-bold text-sm">กำลังโหลดระบบ TipGROW Smart Ag...</p>
      </div>
    );
  }

  // REQUIRE LOGIN FIRST: If user is not authenticated, show the full-page Login interface
  if (!currentUser) {
    return (
      <LoginPage
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          setCurrentTab('home');
        }}
      />
    );
  }

  // Once authenticated, render full TipGROW workspace
  return (
    <div className="min-h-screen bg-[#f4f9f3] text-[#0e1f10] flex flex-col font-sans antialiased selection:bg-emerald-200 selection:text-emerald-950">
      {/* Main Header */}
      <Header
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        currentUser={currentUser}
        onOpenAuth={() => {}}
        onLogout={handleLogout}
        onQuickReport={handleQuickReport}
        onSearchCrop={handleSearchCrop}
      />

      {/* Main Content Area */}
      <main className="flex-1 pt-24 pb-8">
        {currentTab === 'calculator' && (
          <Calculator
            currentUser={currentUser}
            initialCropId={selectedCropForCalc}
            onOpenAuth={() => {}}
            onOpenReport={(res) => {
              setReportResult(res);
              setIsReportModalOpen(true);
            }}
            onOpenKnowledge={() => setCurrentTab('knowledge')}
          />
        )}

        {currentTab === 'home' && (
          <HomeOverview
            onStartCalculation={(cropId) => {
              if (cropId) setSelectedCropForCalc(cropId);
              setCurrentTab('calculator');
            }}
            onOpenKnowledge={() => setCurrentTab('knowledge')}
            onOpenAuth={() => {}}
            onOpenTeam={() => setCurrentTab('team')}
          />
        )}

        {currentTab === 'history' && (
          <HistoryView
            currentUser={currentUser}
            onOpenAuth={() => {}}
            onNewCalculation={() => setCurrentTab('calculator')}
          />
        )}

        {currentTab === 'knowledge' && (
          <KnowledgeHub
            onSelectCropForCalc={(cropId) => {
              if (cropId) setSelectedCropForCalc(cropId);
              setCurrentTab('calculator');
            }}
          />
        )}

        {currentTab === 'team' && (
          <TeamPage
            onGoHome={() => setCurrentTab('home')}
            onStartCalculation={() => setCurrentTab('calculator')}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        onOpenKnowledge={() => setCurrentTab('knowledge')}
        onGoHome={() => setCurrentTab('home')}
        onOpenTeam={() => setCurrentTab('team')}
      />

      {/* Report Modal (Print / PDF Export) */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        result={reportResult}
        farmerName={currentUser?.displayName || currentUser?.email || 'คุณนิติฉัตร (เกษตรกร)'}
      />
    </div>
  );
}
