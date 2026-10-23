/**
 * MathLover CCC - Screen 1: Home Dashboard
 * Welcome hub with navigation cards, math topic explorer, upcoming study sessions,
 * and peer community metrics with soft blue and purple accents.
 */

import React from 'react';
import { useMath } from '../context/MathContext';
import { CCC_CAMPUSES, MATH_COURSES } from '../data/mockData';
import { MathCourse } from '../types';
import {
  Compass,
  GraduationCap,
  Users,
  MessageSquare,
  ArrowRight,
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  BookOpen,
  CheckCircle,
  HelpCircle,
  TrendingUp,
  School,
  ChevronRight,
  Trophy,
  Zap,
  Award,
  Star
} from 'lucide-react';
import { BadgeDisplay } from '../components/BadgeDisplay';

export const HomeDashboard: React.FC = () => {
  const { 
    setActiveScreen, 
    studyGroups, 
    joinStudyGroup, 
    userProfile, 
    setSelectedCourseFilter, 
    questions,
    featuredBadge,
    contributorLevel 
  } = useMath();

  const handleTopicClick = (course: MathCourse) => {
    setSelectedCourseFilter(course);
    setActiveScreen('groups');
  };

  // Find next 3 upcoming sessions
  const upcomingGroups = studyGroups.slice(0, 3);

  return (
    <div className="space-y-12 pb-16">
      {/* Main MathLover Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-200/90 shadow-sm bg-white">
        {/* Uploaded MathLover City Colleges of Chicago Artwork Banner */}
        <div className="relative w-full overflow-hidden bg-[#0d223a] flex items-center justify-center p-3 sm:p-5 border-b border-slate-200/80">
          <img
            src="/assets/aistudio/Screenshot_2026-10-19_at_3.46.53_PM_3aa1a60b.png"
            alt="Connecting Every Angle. MathLover. City Colleges of Chicago"
            className="w-full max-w-4xl max-h-[480px] h-auto object-contain rounded-xl shadow-lg"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Welcome, Contributor Status & Action Hub Bar */}
        <div className="p-6 sm:p-8 bg-gradient-to-b from-white to-slate-50/60 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 border-t border-slate-100">
          <div className="space-y-3 max-w-2xl">
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Welcome to <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">MathLover CCC!</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
              An independent, student-led mathematics community uniting peers across all seven <strong>City Colleges of Chicago</strong>. 
              Connect with study partners, organize weekly math circles, and conquer challenging problem sets together.
            </p>

            {/* User Welcome Callout with Contributor Badge */}
            <div className="flex flex-wrap items-center gap-2.5 text-sm text-slate-700 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-2xs w-fit">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
              <span>Signed in as <strong>{userProfile.displayName}</strong> ({userProfile.campus === 'Harry S Truman College' ? 'Truman College' : userProfile.campus.replace(' College', '')})</span>
              {featuredBadge && (
                <BadgeDisplay
                  title={featuredBadge.title}
                  tier={featuredBadge.tier}
                  size="xs"
                  showTierLabel
                />
              )}
              <button
                onClick={() => setActiveScreen('profile')}
                className="text-xs font-semibold text-purple-600 hover:text-purple-800 flex items-center gap-1 ml-1"
                title="View Contributor Badges & Rewards"
              >
                <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
                <span>{contributorLevel.points} Pts &bull; View Badges</span>
              </button>
            </div>
          </div>

          {/* Quick Action Button Group */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 w-full sm:w-auto shrink-0">
            <button
              onClick={() => setActiveScreen('match')}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold text-sm shadow-md shadow-blue-500/20 hover:shadow-lg transition-all"
            >
              <Users className="w-4 h-4" />
              <span>Find a Math Match</span>
              <ArrowRight className="w-4 h-4 ml-0.5" />
            </button>

            <button
              onClick={() => setActiveScreen('groups')}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm border border-slate-200 hover:border-slate-300 shadow-2xs transition-all"
            >
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <span>Browse Study Groups ({studyGroups.length})</span>
            </button>

            <button
              onClick={() => setActiveScreen('community')}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-semibold text-sm border border-purple-200/70 transition-all"
            >
              <MessageSquare className="w-4 h-4 text-purple-600" />
              <span>Ask a Question</span>
            </button>
          </div>
        </div>
      </section>

      {/* 4 Core App Screen Navigation Cards */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Explore Your Math Community
            </h2>
            <p className="text-sm text-slate-500">
              Jump straight into our 4 dedicated student learning spaces
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Student Profile */}
          <div
            onClick={() => setActiveScreen('profile')}
            className="group relative cursor-pointer bg-white rounded-2xl p-5 border border-slate-200/90 hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center mb-4 group-hover:scale-105 group-hover:bg-blue-600 group-hover:text-white transition-all">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                Student Profile
              </h3>
              <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                Set your CCC campus, active math courses, problem-solving interests, and study availability hours.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600">
              <span>View & Edit Profile</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: Math Match */}
          <div
            onClick={() => setActiveScreen('match')}
            className="group relative cursor-pointer bg-white rounded-2xl p-5 border border-slate-200/90 hover:border-purple-400 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center mb-4 group-hover:scale-105 group-hover:bg-purple-600 group-hover:text-white transition-all">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
                Math Match
              </h3>
              <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                Discover fellow Chicago students taking the same math classes, filter by campus, and send study partner requests.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-purple-600">
              <span>Find Study Partners</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: Study Groups */}
          <div
            onClick={() => setActiveScreen('groups')}
            className="group relative cursor-pointer bg-white rounded-2xl p-5 border border-slate-200/90 hover:border-indigo-400 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center mb-4 group-hover:scale-105 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                Study Groups
              </h3>
              <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                Join scheduled study circles held on CCC campus libraries or via Discord/Zoom. Create your own math review circle!
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-indigo-600">
              <span>Explore Groups</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 4: Math Community */}
          <div
            onClick={() => setActiveScreen('community')}
            className="group relative cursor-pointer bg-white rounded-2xl p-5 border border-slate-200/90 hover:border-emerald-400 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center mb-4 group-hover:scale-105 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                Math Community
              </h3>
              <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                Post difficult homework problems, exchange LaTeX proofs, and learn from step-by-step peer solutions.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-emerald-600">
              <span>View Q&A Threads</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Math Topics Section */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="font-serif italic text-blue-600 text-2xl font-bold">π</span>
              <span>Supported CCC Mathematics Courses</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Select any topic to filter upcoming study circles and discussions
            </p>
          </div>
          <span className="text-xs font-medium text-slate-400 self-start sm:self-auto">
            {MATH_COURSES.length} Active Curricula
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {MATH_COURSES.map((course) => {
            const isUserCourse = userProfile.courses.includes(course);
            return (
              <button
                key={course}
                onClick={() => handleTopicClick(course)}
                className={`p-3.5 rounded-xl border text-left transition-all relative flex flex-col justify-between h-28 group ${
                  isUserCourse
                    ? 'bg-blue-50/70 border-blue-300 hover:border-blue-500'
                    : 'bg-slate-50/70 border-slate-200 hover:border-purple-300 hover:bg-purple-50/40'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {course === 'Precalculus' || course.includes('Precalculus')
                        ? 'Precalculus'
                        : course.includes('208') || course.includes('207') || course.includes('209')
                        ? 'Calculus'
                        : 'Mathematics'}
                    </span>
                    {isUserCourse && (
                      <span className="inline-block w-2 h-2 rounded-full bg-blue-600" title="Your enrolled course"></span>
                    )}
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-blue-700 transition-colors mt-1 line-clamp-2">
                    {course}
                  </h4>
                </div>
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 group-hover:text-blue-600">
                  <span>View Groups</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Upcoming Study Sessions Section */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-600" />
              <span>Upcoming Study Sessions</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Interactive peer math reviews scheduled this week across Chicago
            </p>
          </div>
          <button
            onClick={() => setActiveScreen('groups')}
            className="text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 self-start sm:self-auto"
          >
            <span>View all ({studyGroups.length}) sessions</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {upcomingGroups.map((group) => {
            const isMember = group.members.includes(userProfile.displayName);
            const isFull = group.members.length >= group.maxCapacity;

            return (
              <div
                key={group.id}
                className="bg-white rounded-2xl p-5 border border-slate-200/90 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                      {group.course}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      group.format === 'Online' 
                        ? 'bg-purple-100 text-purple-700' 
                        : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {group.format}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 leading-snug line-clamp-2">
                    {group.title}
                  </h3>

                  <p className="text-xs text-slate-600 mt-2 line-clamp-2">
                    {group.description}
                  </p>

                  <div className="mt-4 space-y-1.5 text-xs text-slate-500">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{group.date} &bull; {group.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{group.locationDetail}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>Hosted by {group.hostName} ({group.hostCampus.replace(' College', '')})</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-xs text-slate-500">
                    <span className="font-semibold text-slate-800">{group.members.length}</span> / {group.maxCapacity} Seats
                  </div>

                  {isMember ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Reserved</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => joinStudyGroup(group.id)}
                      disabled={isFull}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        isFull
                          ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                          : 'bg-blue-600 hover:bg-blue-700 text-white shadow-2xs'
                      }`}
                    >
                      {isFull ? 'Full' : 'Join Group'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Community Activity Spotlight */}
      <section className="bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-950 text-white rounded-3xl p-6 sm:p-10 shadow-lg">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          <div className="lg:col-span-2 space-y-4">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-200 border border-purple-400/30">
              Recent Peer Math Discussion
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Stuck on Calculus II or Linear Algebra Homework?
            </h3>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Don't struggle in isolation. Ask questions on the Math Community board and get detailed explanations, intuition graphs, and step-by-step proofs from peers who took the class.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={() => setActiveScreen('community')}
                className="px-5 py-2.5 rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-semibold text-sm transition-all shadow-sm"
              >
                Go to Math Community
              </button>
              <button
                onClick={() => setActiveScreen('match')}
                className="px-5 py-2.5 rounded-xl bg-purple-600/60 hover:bg-purple-600 text-white border border-purple-400/40 font-semibold text-sm transition-all"
              >
                Find a Study Partner
              </button>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-purple-200">
              Community Health Highlights
            </h4>
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                <div className="text-2xl font-black text-white">7 / 7</div>
                <div className="text-[11px] text-slate-300 mt-0.5">Campuses Active</div>
              </div>
              <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                <div className="text-2xl font-black text-purple-300">{studyGroups.length}</div>
                <div className="text-[11px] text-slate-300 mt-0.5">Weekly Circles</div>
              </div>
              <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                <div className="text-2xl font-black text-blue-300">{questions.length}</div>
                <div className="text-[11px] text-slate-300 mt-0.5">Active Math Q&As</div>
              </div>
              <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                <div className="text-2xl font-black text-emerald-300">100%</div>
                <div className="text-[11px] text-slate-300 mt-0.5">Student Run</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
