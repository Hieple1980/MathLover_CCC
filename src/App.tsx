/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { MathProvider, useMath } from './context/MathContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/ToastContainer';
import { HomeDashboard } from './screens/HomeDashboard';
import { StudentProfile } from './screens/StudentProfile';
import { MathMatch } from './screens/MathMatch';
import { StudyGroups } from './screens/StudyGroups';
import { MathCommunity } from './screens/MathCommunity';
import { Compass, GraduationCap, UserCheck, Users, MessageSquare } from 'lucide-react';
import { ActiveScreen } from './types';

const MainContent: React.FC = () => {
  const { activeScreen, setActiveScreen, connectionRequests } = useMath();

  const mobileTabs: { id: ActiveScreen; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Home', icon: Compass },
    { id: 'profile', label: 'Profile', icon: GraduationCap },
    { id: 'match', label: 'Match', icon: UserCheck },
    { id: 'groups', label: 'Groups', icon: Users },
    { id: 'community', label: 'Discuss', icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-purple-100 selection:text-purple-900">
      {/* Navigation Header */}
      <Navbar />

      {/* Main Dynamic Screen View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {activeScreen === 'dashboard' && <HomeDashboard />}
        {activeScreen === 'profile' && <StudentProfile />}
        {activeScreen === 'match' && <MathMatch />}
        {activeScreen === 'groups' && <StudyGroups />}
        {activeScreen === 'community' && <MathCommunity />}
      </main>

      {/* Footer */}
      <Footer />

      {/* Toast Notifications */}
      <ToastContainer />

      {/* Mobile Bottom Navigation Bar (Optimized for Chicago student commuters) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 shadow-lg flex items-center justify-around">
        {mobileTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeScreen === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveScreen(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all relative ${
                isActive
                  ? 'text-blue-600 font-bold'
                  : 'text-slate-500 hover:text-slate-900 font-medium'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
              <span className="text-[10px] mt-0.5">{tab.label}</span>
              {tab.id === 'match' && connectionRequests.length > 0 && (
                <span className="absolute top-0.5 right-2 w-2 h-2 rounded-full bg-purple-600"></span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default function App() {
  return (
    <MathProvider>
      <MainContent />
    </MathProvider>
  );
}
