/**
 * MathLover CCC - Footer Component
 * Highlights the seven City Colleges of Chicago with explicit independent student disclaimer.
 */

import React from 'react';
import { useMath } from '../context/MathContext';
import { CCC_CAMPUSES } from '../data/mockData';
import { ShieldAlert, ExternalLink, Heart, BookOpen, Compass, GraduationCap, Users, MessageSquare } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveScreen } = useMath();

  return (
    <footer className="bg-slate-900 text-slate-300 mt-20 border-t border-slate-800">
      {/* Primary Disclaimer Banner */}
      <div className="bg-slate-950/80 border-b border-slate-800/80 py-4 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong className="text-slate-200">Independent Student Project Disclaimer:</strong> MathLover CCC is a student-created, peer-to-peer study platform. It is not managed, sponsored, or endorsed by the official City Colleges of Chicago (CCC) administration.
            </span>
          </div>
          <div className="text-slate-500 text-[11px] whitespace-nowrap">
            Demonstration Prototype &bull; Student Privacy Protected
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand & Mission */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center text-white font-serif font-bold italic text-base">
                ∫dx
              </div>
              <span className="text-xl font-bold text-white tracking-tight">MathLover CCC</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Empowering students across Chicago's 7 community colleges to conquer college math together through peer matches, weekly study groups, and open problem-solving discussions.
            </p>
            <div className="pt-2 text-xs text-slate-500">
              Free & open for all CCC students pursuing STEM, nursing, business, and liberal arts degrees.
            </div>
          </div>

          {/* City Colleges of Chicago Represented */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-100 flex items-center gap-1.5">
              <span>The 7 City Colleges</span>
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              {CCC_CAMPUSES.map((c) => (
                <li key={c.name} className="flex items-center justify-between group">
                  <span className="group-hover:text-white transition-colors">{c.shortName} College</span>
                  <span className="text-slate-500 text-[11px]">{c.neighborhood}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-100">
              Community Hubs
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => setActiveScreen('dashboard')}
                  className="hover:text-white transition-colors flex items-center gap-2"
                >
                  <Compass className="w-3.5 h-3.5 text-blue-400" />
                  <span>Home Dashboard</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveScreen('profile')}
                  className="hover:text-white transition-colors flex items-center gap-2"
                >
                  <GraduationCap className="w-3.5 h-3.5 text-purple-400" />
                  <span>Student Math Profile</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveScreen('match')}
                  className="hover:text-white transition-colors flex items-center gap-2"
                >
                  <Users className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Find a Math Match</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveScreen('groups')}
                  className="hover:text-white transition-colors flex items-center gap-2"
                >
                  <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Weekly Study Groups</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveScreen('community')}
                  className="hover:text-white transition-colors flex items-center gap-2"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Math Community Q&A</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Helpful Open Math Resources */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-100">
              Free Math Toolkits
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <a
                  href="https://www.desmos.com/calculator"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center justify-between"
                >
                  <span>Desmos Graphing Calculator</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://tutorial.math.lamar.edu/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center justify-between"
                >
                  <span>Paul's Online Math Notes</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.3blue1brown.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center justify-between"
                >
                  <span>3Blue1Brown (Essence of Linear Algebra & Calc)</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://openstax.org/subjects/math"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center justify-between"
                >
                  <span>OpenStax Free Math Textbooks</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} MathLover CCC. Student-led, non-commercial learning community.</p>
          <p className="flex items-center gap-1 text-slate-400">
            Designed with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" /> for Chicago community college students
          </p>
        </div>
      </div>
    </footer>
  );
};
