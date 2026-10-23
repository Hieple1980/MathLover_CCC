/**
 * MathLover CCC - Screen 2: Student Profile
 * Allows students to configure their display name, CCC campus, active math courses,
 * math interests, and study availability hours with local storage synchronization.
 */

import React, { useState } from 'react';
import { useMath } from '../context/MathContext';
import { CCC_CAMPUSES, COMMON_INTERESTS, MATH_COURSES } from '../data/mockData';
import { CCCCampus, DayOfWeek, MathCourse, StudyFormat, TimeSlot } from '../types';
import { 
  GraduationCap, 
  Save, 
  RotateCcw, 
  Check, 
  MapPin, 
  Clock, 
  BookOpen, 
  Sparkles, 
  AlertCircle,
  Eye,
  Calendar,
  User,
  ShieldCheck,
  Award,
  Star,
  Trophy,
  Zap,
  TrendingUp,
  CheckCircle2
} from 'lucide-react';
import { BadgeDisplay } from '../components/BadgeDisplay';

const DAYS_OF_WEEK: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const TIME_SLOTS: TimeSlot[] = [
  'Morning (8am - 12pm)',
  'Afternoon (12pm - 5pm)',
  'Evening (5pm - 9pm)',
  'Flexible / Weekends',
];
const STUDY_FORMATS: StudyFormat[] = [
  'In-Person on Campus',
  'Online (Zoom / Discord)',
  'Hybrid (In-Person & Online)',
];

export const StudentProfile: React.FC = () => {
  const { 
    userProfile, 
    updateUserProfile, 
    resetUserProfile,
    badges,
    contributorMetrics,
    contributorLevel,
    featuredBadge,
    setFeaturedBadge
  } = useMath();

  // Form State (initially mirrors current userProfile)
  const [displayName, setDisplayName] = useState(userProfile.displayName);
  const [campus, setCampus] = useState<CCCCampus>(userProfile.campus);
  const [major, setMajor] = useState(userProfile.major || 'Associate in Science');
  const [selectedCourses, setSelectedCourses] = useState<MathCourse[]>(userProfile.courses);
  const [selectedInterests, setSelectedInterests] = useState<string[]>(userProfile.interests);
  const [customInterest, setCustomInterest] = useState('');
  const [selectedDays, setSelectedDays] = useState<DayOfWeek[]>(userProfile.availability.days);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<TimeSlot[]>(userProfile.availability.timeSlots);
  const [studyFormat, setStudyFormat] = useState<StudyFormat>(userProfile.availability.format);
  const [bio, setBio] = useState(userProfile.bio);
  const [contactHandle, setContactHandle] = useState(userProfile.contactHandle);

  // Status & Validation
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  // Toggle helpers
  const toggleCourse = (course: MathCourse) => {
    setSelectedCourses((prev) =>
      prev.includes(course) ? prev.filter((c) => c !== course) : [...prev, course]
    );
  };

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  const addCustomInterest = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = customInterest.trim();
    if (trimmed && !selectedInterests.includes(trimmed)) {
      setSelectedInterests((prev) => [...prev, trimmed]);
      setCustomInterest('');
    }
  };

  const toggleDay = (day: DayOfWeek) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const toggleTimeSlot = (slot: TimeSlot) => {
    setSelectedTimeSlots((prev) =>
      prev.includes(slot) ? prev.filter((s) => s !== slot) : [...prev, slot]
    );
  };

  // Save handler
  const handleSaveProfile = () => {
    setValidationError(null);

    if (!displayName.trim()) {
      setValidationError('Please provide a display name or nickname.');
      return;
    }
    if (selectedCourses.length === 0) {
      setValidationError('Please select at least one math course you are currently studying or reviewing.');
      return;
    }
    if (selectedDays.length === 0) {
      setValidationError('Please select at least one preferred study day.');
      return;
    }

    const res = updateUserProfile({
      displayName: displayName.trim(),
      campus,
      major: major.trim(),
      courses: selectedCourses,
      interests: selectedInterests,
      availability: {
        days: selectedDays,
        timeSlots: selectedTimeSlots,
        format: studyFormat,
      },
      bio: bio.trim(),
      contactHandle: contactHandle.trim(),
    });

    if (res.success) {
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } else if (res.error) {
      setValidationError(res.error);
    }
  };

  // Reset to original state
  const handleReset = () => {
    if (window.confirm('Reset profile to original demonstration defaults?')) {
      resetUserProfile();
      setDisplayName('Hiep Le');
      setCampus('Harry S Truman College');
      setMajor('Associate in Science (Pre-Engineering)');
      setSelectedCourses(['Calculus II (Math 208)', 'Linear Algebra (Math 204)']);
      setSelectedInterests(['Calculus for Pre-Engineering', 'Transfer Prep (UIC, IIT, UIUC, DePaul)', 'Step-by-Step Formal Proofs']);
      setSelectedDays(['Tuesday', 'Thursday', 'Saturday']);
      setSelectedTimeSlots(['Afternoon (12pm - 5pm)', 'Evening (5pm - 9pm)']);
      setStudyFormat('Hybrid (In-Person & Online)');
      setBio('Second-year student taking Calc II & Linear Algebra at Truman College. Planning to transfer to UIUC Grainger next fall. Love breaking down trigonometric substitutions and row operations over coffee in Uptown!');
      setContactHandle('hle61@gmail.com');
    }
  };

  const currentCampusInfo = CCC_CAMPUSES.find((c) => c.name === campus);

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold mb-2 border border-purple-200">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Student Profile Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Your Math Peer Profile
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            Customize your CCC campus, courses, interests, and availability. This information helps match you with compatible study partners across Chicago.
          </p>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          <button
            onClick={handleReset}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold transition-colors"
            title="Reset profile data"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            onClick={handleSaveProfile}
            className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-md ${
              isSaved
                ? 'bg-emerald-600 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20'
            }`}
          >
            {isSaved ? (
              <>
                <Check className="w-4 h-4" />
                <span>Saved!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Profile</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Validation Message */}
      {validationError && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Main Form Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Editable Form Fields (2 spans) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section 1: Basic Student Info */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <User className="w-4 h-4 text-blue-600" />
              <span>1. Basic Student Identity</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Student Display Name / Nickname <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="e.g., Hiep Le"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Degree Goal / Major
                </label>
                <input
                  type="text"
                  value={major}
                  onChange={(e) => setMajor(e.target.value)}
                  placeholder="e.g., Associate in Science, Pre-Nursing"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>

            {/* CCC Campus Dropdown - Required by Prompt */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                City Colleges of Chicago Campus <span className="text-rose-500">*</span>
              </label>
              <select
                value={campus}
                onChange={(e) => setCampus(e.target.value as CCCCampus)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-sm font-semibold text-slate-800"
              >
                {CCC_CAMPUSES.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name} &mdash; {c.neighborhood}
                  </option>
                ))}
              </select>
              {currentCampusInfo && (
                <p className="text-[11px] text-slate-500 mt-1.5 flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  <span>Campus Address: {currentCampusInfo.address}</span>
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Preferred Study Contact Handle
              </label>
              <input
                type="text"
                value={contactHandle}
                onChange={(e) => setContactHandle(e.target.value)}
                placeholder="e.g. hle61@gmail.com or Discord handle"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <span className="text-[11px] text-slate-400">
                Shared only when you accept a peer connection request.
              </span>
            </div>
          </div>

          {/* Section 2: Math Course Selection */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-purple-600" />
                <span>2. Math Courses Currently Studying</span>
              </h3>
              <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2.5 py-0.5 rounded-full">
                {selectedCourses.length} Selected
              </span>
            </div>

            <p className="text-xs text-slate-500">
              Select one or more math classes you are enrolled in or preparing for this academic year:
            </p>

            {/* Math Course Dropdown Menu Selector */}
            <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-200">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Course Dropdown Selector:
              </label>
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    toggleCourse(e.target.value as MathCourse);
                    e.target.value = '';
                  }
                }}
                defaultValue=""
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-purple-500"
              >
                <option value="" disabled>
                  -- Select a Math Course from Dropdown to Toggle --
                </option>
                {MATH_COURSES.map((course) => (
                  <option key={course} value={course}>
                    {course} {selectedCourses.includes(course) ? '✓ (Selected)' : ''}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {MATH_COURSES.map((course) => {
                const isSelected = selectedCourses.includes(course);
                return (
                  <button
                    key={course}
                    type="button"
                    onClick={() => toggleCourse(course)}
                    className={`flex items-center justify-between p-3 rounded-xl border text-left text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-purple-50/80 border-purple-400 text-purple-900 shadow-2xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-purple-200 hover:bg-slate-50'
                    }`}
                  >
                    <span className="truncate">{course}</span>
                    <span
                      className={`w-4 h-4 rounded-md flex items-center justify-center shrink-0 border ml-2 ${
                        isSelected
                          ? 'bg-purple-600 border-purple-600 text-white'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Mathematics Interests */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>3. Mathematics Interests & Study Goals</span>
            </h3>

            <div className="flex flex-wrap gap-2">
              {COMMON_INTERESTS.map((interest) => {
                const isSelected = selectedInterests.includes(interest);
                return (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {interest}
                  </button>
                );
              })}
            </div>

            {/* Custom Interest Input */}
            <form onSubmit={addCustomInterest} className="flex gap-2 pt-2">
              <input
                type="text"
                value={customInterest}
                onChange={(e) => setCustomInterest(e.target.value)}
                placeholder="Add custom math topic (e.g., Matrix Inverses, LaTeX, ACT/SAT Prep)..."
                className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-xl border border-indigo-200 transition-colors"
              >
                + Add Tag
              </button>
            </form>
          </div>

          {/* Section 4: Study Availability */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-5">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Clock className="w-4 h-4 text-blue-600" />
              <span>4. Study Availability & Meeting Format</span>
            </h3>

            {/* Format Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Preferred Study Format
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {STUDY_FORMATS.map((fmt) => {
                  const isSelected = studyFormat === fmt;
                  return (
                    <button
                      key={fmt}
                      type="button"
                      onClick={() => setStudyFormat(fmt)}
                      className={`p-3 rounded-xl border text-xs font-semibold text-center transition-all ${
                        isSelected
                          ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {fmt}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Days of Week */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Available Days of the Week
              </label>
              <div className="flex flex-wrap gap-2">
                {DAYS_OF_WEEK.map((day) => {
                  const isSelected = selectedDays.includes(day);
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDay(day)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                        isSelected
                          ? 'bg-blue-50 text-blue-700 border-blue-300'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time of Day */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Preferred Time of Day
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {TIME_SLOTS.map((slot) => {
                  const isSelected = selectedTimeSlots.includes(slot);
                  return (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => toggleTimeSlot(slot)}
                      className={`p-2.5 rounded-lg border text-xs text-left font-medium transition-all ${
                        isSelected
                          ? 'bg-blue-50 text-blue-800 border-blue-300'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Short Math Bio & Study Objectives
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Share a bit about what you're working toward, professors you have, or how you like to study..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-xs text-slate-700 leading-relaxed"
              />
            </div>
          </div>

          {/* Section 5: Badges & Contributor Rewards System */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-amber-500" />
                  <span>5. Contributor Badges & Achievement Rewards</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Rewards earned automatically by participating in Study Groups and helping peers in the Math Community.
                </p>
              </div>
              <div className="flex items-center gap-1.5 self-start sm:self-auto">
                <span className="text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                  <span>{contributorLevel.points} Total Points</span>
                </span>
              </div>
            </div>

            {/* Contributor Rank Banner */}
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 text-white rounded-2xl p-5 shadow-sm space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-400 to-amber-600 text-amber-950 font-black text-xl flex items-center justify-center shadow-md shadow-amber-500/20">
                    {contributorLevel.level >= 3 ? '👑' : '⭐'}
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-purple-300">
                      Current Community Standing
                    </span>
                    <h4 className="text-lg font-extrabold text-white">
                      {contributorLevel.title}
                    </h4>
                  </div>
                </div>

                <div className="text-right sm:text-right">
                  <span className="text-xs text-purple-200">
                    {contributorLevel.points} / {contributorLevel.nextLevelPoints} pts
                  </span>
                  <p className="text-[11px] text-slate-300">
                    {contributorLevel.nextLevelPoints - contributorLevel.points} pts to next rank
                  </p>
                </div>
              </div>

              {/* Progress bar to next rank */}
              <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 via-purple-400 to-pink-400 transition-all rounded-full"
                  style={{ width: `${Math.max(10, contributorLevel.progressPercent)}%` }}
                />
              </div>

              {/* Activity metrics chips */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-2 text-center">
                <div className="bg-white/5 rounded-xl p-2 border border-white/5">
                  <div className="text-base font-bold text-white">{contributorMetrics.groupsJoined}</div>
                  <div className="text-[10px] text-slate-300 truncate">Groups Joined</div>
                </div>
                <div className="bg-white/5 rounded-xl p-2 border border-white/5">
                  <div className="text-base font-bold text-amber-300">{contributorMetrics.groupsHosted}</div>
                  <div className="text-[10px] text-slate-300 truncate">Circles Hosted</div>
                </div>
                <div className="bg-white/5 rounded-xl p-2 border border-white/5">
                  <div className="text-base font-bold text-emerald-300">{contributorMetrics.repliesGiven}</div>
                  <div className="text-[10px] text-slate-300 truncate">Solutions Posted</div>
                </div>
                <div className="bg-white/5 rounded-xl p-2 border border-white/5">
                  <div className="text-base font-bold text-blue-300">{contributorMetrics.questionsAsked}</div>
                  <div className="text-[10px] text-slate-300 truncate">Questions Asked</div>
                </div>
                <div className="bg-white/5 rounded-xl p-2 border border-white/5">
                  <div className="text-base font-bold text-purple-300">{contributorMetrics.upvotesReceived}</div>
                  <div className="text-[10px] text-slate-300 truncate">Peer Upvotes</div>
                </div>
                <div className="bg-white/5 rounded-xl p-2 border border-white/5">
                  <div className="text-base font-bold text-pink-300">{contributorMetrics.connectionsCount}</div>
                  <div className="text-[10px] text-slate-300 truncate">Study Partners</div>
                </div>
              </div>
            </div>

            {/* Badges List Grid */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Earned Badges & Unlock Criteria
                </span>
                <span className="text-[11px] text-slate-400">
                  Click "Feature" to showcase a badge on your profile
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {badges.map((badge) => {
                  const isFeatured = (userProfile.featuredBadgeId || 'study_master') === badge.id;

                  return (
                    <div
                      key={badge.id}
                      className={`p-4 rounded-xl border transition-all flex flex-col justify-between space-y-3 ${
                        isFeatured
                          ? 'border-purple-400 bg-purple-50/40 shadow-xs ring-1 ring-purple-300'
                          : badge.unlocked
                          ? 'border-slate-200 bg-white hover:border-slate-300'
                          : 'border-dashed border-slate-200 bg-slate-50/50 opacity-70'
                      }`}
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <BadgeDisplay
                            title={badge.title}
                            tier={badge.tier}
                            size="md"
                            showTierLabel
                            isUnlocked={badge.unlocked}
                          />

                          {isFeatured && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-600 text-white shadow-2xs">
                              Featured Badge
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-slate-600 leading-relaxed mt-2">
                          {badge.description}
                        </p>

                        <div className="mt-3 space-y-1.5">
                          <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                            <span>Requirement Progress:</span>
                            <span className="font-bold text-slate-700">{badge.progressLabel}</span>
                          </div>
                          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                badge.unlocked ? 'bg-amber-500' : 'bg-slate-300'
                              }`}
                              style={{ width: `${Math.min(100, (badge.progress / badge.maxProgress) * 100)}%` }}
                            />
                          </div>
                        </div>

                        <div className="mt-2.5 pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex items-start gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
                          <span><strong>Perk:</strong> {badge.rewardPerk}</span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-end">
                        <button
                          type="button"
                          onClick={() => setFeaturedBadge(badge.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                            isFeatured
                              ? 'bg-purple-100 text-purple-800 cursor-default'
                              : 'bg-white hover:bg-purple-50 text-slate-700 hover:text-purple-700 border border-slate-200 hover:border-purple-300 shadow-2xs'
                          }`}
                        >
                          {isFeatured ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />
                              <span>Active on Profile</span>
                            </>
                          ) : (
                            <>
                              <Star className="w-3.5 h-3.5 text-slate-400" />
                              <span>Set as Featured Badge</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Peer Card Preview */}
        <div className="space-y-6">
          <div className="sticky top-24 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-purple-600" />
                <span>Live Card Preview</span>
              </span>
              <span className="text-[11px] text-slate-400">How peers see you</span>
            </div>

            {/* Preview Card */}
            <div className="bg-white rounded-2xl border-2 border-purple-200/80 p-5 shadow-md relative overflow-hidden">
              <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-purple-200/30 via-blue-200/20 to-transparent rounded-bl-full pointer-events-none" />

              <div className="flex items-start gap-3.5 mb-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 text-white font-bold text-base flex items-center justify-center shadow-xs shrink-0">
                  {displayName ? displayName.slice(0, 2).toUpperCase() : 'ME'}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="text-base font-bold text-slate-900 truncate">
                      {displayName || 'Your Name'}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-500 truncate">{major || 'Student'}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-1.5">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200/60 truncate">
                      <MapPin className="w-3 h-3 text-blue-600 shrink-0" />
                      <span className="truncate">{campus.replace(' College', '')}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Prominent Featured Badge Display */}
              <div className="mb-3.5 p-2.5 rounded-xl bg-gradient-to-r from-purple-50/70 to-blue-50/70 border border-purple-200/70 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BadgeDisplay
                    title={featuredBadge?.title || 'Study Master'}
                    tier={featuredBadge?.tier || 'gold'}
                    size="xs"
                    showTierLabel
                  />
                </div>
                <span className="text-[10px] font-bold text-purple-700 flex items-center gap-1">
                  <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
                  <span>{contributorLevel.points} Pts</span>
                </span>
              </div>

              {/* Bio Preview */}
              <p className="text-xs text-slate-600 italic bg-slate-50/70 p-2.5 rounded-xl border border-slate-100 leading-relaxed">
                "{bio || 'No bio provided yet.'}"
              </p>

              {/* Courses Preview */}
              <div className="mt-4 space-y-1.5">
                <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">
                  Active Courses:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedCourses.map((c) => (
                    <span
                      key={c}
                      className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-purple-50 text-purple-700 border border-purple-200"
                    >
                      {c}
                    </span>
                  ))}
                  {selectedCourses.length === 0 && (
                    <span className="text-xs text-slate-400 italic">None selected</span>
                  )}
                </div>
              </div>

              {/* Interests Preview */}
              <div className="mt-3 space-y-1.5">
                <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">
                  Interests:
                </span>
                <div className="flex flex-wrap gap-1">
                  {selectedInterests.slice(0, 4).map((i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-600"
                    >
                      {i}
                    </span>
                  ))}
                </div>
              </div>

              {/* Availability Preview */}
              <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500 space-y-1">
                <div className="flex items-center gap-1.5 font-medium text-slate-700">
                  <Clock className="w-3.5 h-3.5 text-blue-500" />
                  <span>{studyFormat}</span>
                </div>
                <div className="text-[11px] text-slate-500">
                  {selectedDays.length > 0 ? selectedDays.join(', ') : 'No days selected'}
                </div>
              </div>
            </div>

            {/* Bottom Save Action */}
            <button
              onClick={handleSaveProfile}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save & Update Profile</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
