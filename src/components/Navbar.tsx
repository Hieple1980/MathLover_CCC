/**
 * MathLover CCC - Navigation Bar Component
 * Responsive navigation connecting all 5 screens with campus identity badge.
 */

import React, { useState } from 'react';
import { useMath } from '../context/MathContext';
import { ActiveScreen } from '../types';
import { 
  BookOpen, 
  Users, 
  UserCheck, 
  MessageSquare, 
  Menu, 
  X, 
  GraduationCap, 
  Compass, 
  Sparkles,
  Info,
  Award
} from 'lucide-react';
import { BadgeDisplay } from './BadgeDisplay';

export const Navbar: React.FC = () => {
  const { activeScreen, setActiveScreen, userProfile, connectionRequests, featuredBadge } = useMath();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: ActiveScreen; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Home Dashboard', icon: Compass },
    { id: 'profile', label: 'Student Profile', icon: GraduationCap },
    { id: 'match', label: 'Math Match', icon: UserCheck },
    { id: 'groups', label: 'Study Groups', icon: Users },
    { id: 'community', label: 'Math Community', icon: MessageSquare },
  ];

  const handleNavClick = (screen: ActiveScreen) => {
    setActiveScreen(screen);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Community Disclaimer Notice Bar */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 font-medium truncate">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="hidden sm:inline">Independent Student Network:</span>
            <span>Connecting math students across Harold Washington, Truman, Kennedy-King, Malcolm X, Olive-Harvey, Daley, and Wright</span>
          </div>
          <div className="hidden md:flex items-center gap-1 text-blue-200 text-[11px] whitespace-nowrap">
            <Info className="w-3.5 h-3.5" />
            <span>Not officially affiliated with CCC administration</span>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Brand */}
          <button
            onClick={() => handleNavClick('dashboard')}
            className="flex items-center gap-3 text-left focus:outline-hidden group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <span className="font-serif font-bold text-xl italic select-none">∫dx</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                  MathLover
                </span>
                <span className="text-xs font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-purple-100 text-purple-700 border border-purple-200">
                  CCC
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">City Colleges of Chicago Peer Math Network</p>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeScreen === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 font-semibold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.id === 'match' && connectionRequests.length > 0 && (
                    <span className="inline-flex items-center justify-center px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-purple-100 text-purple-700">
                      {connectionRequests.length}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* User Profile Quick Access Button */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={() => handleNavClick('profile')}
              className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-full border border-slate-200 hover:border-purple-300 hover:bg-purple-50/40 transition-all text-left group"
              title="View and edit your math profile & contributor badges"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white font-bold text-xs flex items-center justify-center ring-2 ring-white shadow-xs">
                {userProfile.displayName.slice(0, 2).toUpperCase()}
              </div>
              <div className="text-xs">
                <div className="flex items-center gap-1.5">
                  <p className="font-semibold text-slate-800 leading-tight group-hover:text-purple-600">
                    {userProfile.displayName}
                  </p>
                  {featuredBadge && (
                    <BadgeDisplay
                      title={featuredBadge.title}
                      tier={featuredBadge.tier}
                      size="xs"
                    />
                  )}
                </div>
                <p className="text-[10px] text-slate-500 truncate max-w-[130px]">
                  {userProfile.campus === 'Harry S Truman College' ? 'Truman College' : userProfile.campus.replace(' College', '')}
                </p>
              </div>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => handleNavClick('profile')}
              className="sm:hidden w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center"
            >
              {userProfile.displayName.slice(0, 2).toUpperCase()}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-hidden"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-1 shadow-lg animate-in slide-in-from-top-2 duration-200">
          <div className="pb-3 border-b border-slate-100 mb-2">
            <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-lg">
              <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold text-sm flex items-center justify-center">
                {userProfile.displayName.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-slate-900 text-sm">{userProfile.displayName}</p>
                <p className="text-xs text-blue-600 font-medium">{userProfile.campus}</p>
              </div>
            </div>
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-semibold'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.id === 'match' && connectionRequests.length > 0 && (
                  <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-purple-100 text-purple-700">
                    {connectionRequests.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
