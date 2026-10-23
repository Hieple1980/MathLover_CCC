/**
 * MathLover CCC - Screen 4: Study Groups
 * Browse, join, and organize mathematics study circles across City Colleges of Chicago.
 * Includes interactive group creation modal, RSVP confirmations, and capacity indicators.
 */

import React, { useState, useMemo } from 'react';
import { useMath } from '../context/MathContext';
import { CCC_CAMPUSES, MATH_COURSES } from '../data/mockData';
import { CCCCampus, MathCourse, StudyGroup } from '../types';
import {
  Users,
  Plus,
  Calendar,
  Clock,
  MapPin,
  BookOpen,
  CheckCircle,
  X,
  Search,
  Check,
  Video,
  AlertCircle,
  Sparkles,
  Share2
} from 'lucide-react';
import { BadgeDisplay } from '../components/BadgeDisplay';

export const StudyGroups: React.FC = () => {
  const {
    studyGroups,
    joinStudyGroup,
    leaveStudyGroup,
    createStudyGroup,
    userProfile,
    selectedCourseFilter,
    setSelectedCourseFilter,
  } = useMath();

  // Tab: 'all' | 'my-groups'
  const [activeTab, setActiveTab] = useState<'all' | 'my-groups'>('all');

  // Filters
  const [courseFilter, setCourseFilter] = useState<string>(selectedCourseFilter || 'all');
  const [formatFilter, setFormatFilter] = useState<string>('all');
  const [campusFilter, setCampusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Create Group Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCourse, setNewCourse] = useState<MathCourse>(MATH_COURSES[0]);
  const [newFormat, setNewFormat] = useState<'In-Person' | 'Online' | 'Hybrid'>('In-Person');
  const [newCampus, setNewCampus] = useState<string>(userProfile.campus);
  const [newLocation, setNewLocation] = useState('Harold Washington Library, 5th Floor Pod B');
  const [newDate, setNewDate] = useState('Thursday, Nov 5');
  const [newTime, setNewTime] = useState('3:00 PM - 5:00 PM');
  const [newCapacity, setNewCapacity] = useState(8);
  const [newDescription, setNewDescription] = useState('');
  const [newTopics, setNewTopics] = useState('Midterm Review, Practice Problems, Homework Q&A');
  const [formError, setFormError] = useState<string | null>(null);

  // RSVP Confirmation Modal State
  const [confirmedGroup, setConfirmedGroup] = useState<StudyGroup | null>(null);

  // Synchronize when navigating from HomeDashboard topic click
  React.useEffect(() => {
    if (selectedCourseFilter) {
      setCourseFilter(selectedCourseFilter);
    }
  }, [selectedCourseFilter]);

  // Filter logic
  const filteredGroups = useMemo(() => {
    return studyGroups.filter((group) => {
      // Tab filter
      if (activeTab === 'my-groups' && !group.members.includes(userProfile.displayName)) {
        return false;
      }
      // Course filter
      if (courseFilter !== 'all' && group.course !== courseFilter) {
        return false;
      }
      // Format filter
      if (formatFilter !== 'all' && group.format !== formatFilter) {
        return false;
      }
      // Campus filter
      if (campusFilter !== 'all' && group.campus !== campusFilter) {
        return false;
      }
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = group.title.toLowerCase().includes(q);
        const matchesDesc = group.description.toLowerCase().includes(q);
        const matchesHost = group.hostName.toLowerCase().includes(q);
        const matchesTopics = group.topics.some((t) => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesDesc && !matchesHost && !matchesTopics) {
          return false;
        }
      }
      return true;
    });
  }, [studyGroups, activeTab, courseFilter, formatFilter, campusFilter, searchQuery, userProfile.displayName]);

  // Handle joining group with confirmation popup
  const handleJoinWithConfirmation = (group: StudyGroup) => {
    joinStudyGroup(group.id);
    setConfirmedGroup(group);
  };

  // Submit create group
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!newTitle.trim()) {
      setFormError('Please enter a descriptive study group title.');
      return;
    }
    if (!newLocation.trim()) {
      setFormError('Please provide specific campus room details or virtual meeting notes.');
      return;
    }

    const topicsArray = newTopics
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const res = createStudyGroup({
      title: newTitle.trim(),
      course: newCourse,
      campus: newFormat === 'Online' ? 'Multi-Campus / Virtual' : (newCampus as CCCCampus),
      format: newFormat,
      locationDetail: newLocation.trim(),
      date: newDate.trim(),
      time: newTime.trim(),
      description: newDescription.trim() || `Collaborative study group for ${newCourse}.`,
      topics: topicsArray.length > 0 ? topicsArray : ['Exam Preparation', 'Problem Sets'],
      maxCapacity: Number(newCapacity) || 8,
    });

    if (res.success) {
      setIsCreateModalOpen(false);
      // Reset form fields
      setNewTitle('');
      setNewDescription('');
    } else if (res.error) {
      setFormError(res.error);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-2 border border-blue-200">
            <Users className="w-3.5 h-3.5" />
            <span>Collaborative Math Circles</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            City Colleges Math Study Groups
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            Join scheduled student-run study sessions on campus libraries or connect via virtual whiteboard rooms.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Tab switcher */}
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Groups ({studyGroups.length})
            </button>
            <button
              onClick={() => setActiveTab('my-groups')}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'my-groups'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              My Joined Groups
            </button>
          </div>

          {/* Create Group Action */}
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md shadow-blue-500/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create Study Group</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by topic, host, or keyword..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Course filter */}
          <div>
            <select
              value={courseFilter}
              onChange={(e) => {
                setCourseFilter(e.target.value);
                setSelectedCourseFilter(null);
              }}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-medium text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Math Courses</option>
              {MATH_COURSES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Format filter */}
          <div>
            <select
              value={formatFilter}
              onChange={(e) => setFormatFilter(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-medium text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Any Format (In-Person / Online)</option>
              <option value="In-Person">In-Person on Campus</option>
              <option value="Online">Online / Discord / Zoom</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>

          {/* Campus filter */}
          <div>
            <select
              value={campusFilter}
              onChange={(e) => setCampusFilter(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-medium text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Campuses</option>
              <option value="Multi-Campus / Virtual">Virtual / Multi-Campus</option>
              {CCC_CAMPUSES.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.shortName} College
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Reset button if filtered */}
        {(courseFilter !== 'all' || formatFilter !== 'all' || campusFilter !== 'all' || searchQuery) && (
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
            <span>
              Showing {filteredGroups.length} of {studyGroups.length} study groups
            </span>
            <button
              onClick={() => {
                setCourseFilter('all');
                setFormatFilter('all');
                setCampusFilter('all');
                setSearchQuery('');
                setSelectedCourseFilter(null);
              }}
              className="text-blue-600 hover:text-blue-800 font-semibold"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      {/* Study Groups List Grid */}
      {filteredGroups.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No study groups found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {activeTab === 'my-groups'
              ? 'You have not joined any study groups yet. Switch to "All Groups" to reserve a seat!'
              : 'Be the first student to organize a study group for this topic!'}
          </p>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700"
          >
            Create This Study Group
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGroups.map((group) => {
            const isMember = group.members.includes(userProfile.displayName);
            const isFull = group.members.length >= group.maxCapacity;
            const spotsRemaining = group.maxCapacity - group.members.length;

            return (
              <div
                key={group.id}
                className={`bg-white rounded-2xl border transition-all p-5 flex flex-col justify-between space-y-4 ${
                  isMember
                    ? 'border-blue-300 shadow-sm ring-1 ring-blue-200'
                    : 'border-slate-200/90 hover:border-slate-300 hover:shadow-md'
                }`}
              >
                <div>
                  {/* Badges */}
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200 truncate">
                      {group.course}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                        group.format === 'Online'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {group.format}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {group.title}
                  </h3>

                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {group.description}
                  </p>

                  {/* Agenda Topics */}
                  <div className="mt-3 flex flex-wrap gap-1">
                    {group.topics.map((topic, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md text-[10px] bg-slate-100 text-slate-600 font-medium"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>

                  {/* Meeting Details */}
                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-500">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="font-medium text-slate-700">{group.date} &bull; {group.time}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {group.format === 'Online' ? (
                        <Video className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                      ) : (
                        <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      )}
                      <span className="truncate">{group.locationDetail}</span>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-1 text-[11px] pt-1">
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="text-slate-500">Host:</span>
                        <strong className="text-slate-700 truncate">{group.hostName}</strong>
                        <BadgeDisplay title="Study Master" tier="gold" size="xs" />
                      </div>
                      <span className="text-blue-600 font-medium truncate max-w-[140px]">
                        {group.campus.replace(' College', '')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Capacity and Action Button */}
                <div className="pt-3 border-t border-slate-100 space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">
                      Attendance: <strong className="text-slate-800">{group.members.length} / {group.maxCapacity}</strong>
                    </span>
                    <span
                      className={`text-[11px] font-bold ${
                        isFull
                          ? 'text-rose-600'
                          : spotsRemaining <= 2
                          ? 'text-amber-600'
                          : 'text-emerald-600'
                      }`}
                    >
                      {isFull ? 'Full (0 spots)' : `${spotsRemaining} spots left`}
                    </span>
                  </div>

                  {/* Capacity Bar */}
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all rounded-full ${
                        isFull ? 'bg-rose-500' : 'bg-blue-600'
                      }`}
                      style={{ width: `${Math.min(100, (group.members.length / group.maxCapacity) * 100)}%` }}
                    />
                  </div>

                  {/* Button Action */}
                  {isMember ? (
                    <div className="flex items-center gap-2">
                      <span className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200">
                        <Check className="w-3.5 h-3.5" />
                        <span>Seat Reserved</span>
                      </span>
                      <button
                        onClick={() => leaveStudyGroup(group.id)}
                        className="px-3 py-2 rounded-xl border border-slate-200 text-slate-500 hover:text-rose-600 hover:bg-rose-50 text-xs font-semibold transition-colors"
                        title="Unregister from study group"
                      >
                        Leave
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleJoinWithConfirmation(group)}
                      disabled={isFull}
                      className={`w-full py-2.5 rounded-xl text-xs font-semibold transition-all ${
                        isFull
                          ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                          : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                      }`}
                    >
                      {isFull ? 'Group is Full' : 'Join Study Group'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Confirmation Modal when student joins a group */}
      {confirmedGroup && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150 space-y-4 text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                Seat Confirmed!
              </span>
              <h3 className="text-lg font-extrabold text-slate-900 mt-1">
                You're In: {confirmedGroup.title}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Your name ({userProfile.displayName}) has been added to the participant list.
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-left space-y-2 text-xs">
              <div className="flex items-center gap-2 text-slate-700">
                <Calendar className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="font-semibold">{confirmedGroup.date} &bull; {confirmedGroup.time}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <MapPin className="w-4 h-4 text-purple-600 shrink-0" />
                <span>{confirmedGroup.locationDetail}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <Users className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>Group Host: {confirmedGroup.hostName} ({confirmedGroup.hostCampus.replace(' College', '')})</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setConfirmedGroup(null)}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Study Group Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto space-y-5">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  New Study Session
                </span>
                <h3 className="text-lg font-bold text-slate-900">
                  Organize a Math Study Group
                </h3>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              {/* Group Title */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Study Group Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g., Calc II Integration by Parts & Midterm Review"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Math Course */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Course Topic <span className="text-rose-500">*</span>
                </label>
                <select
                  value={newCourse}
                  onChange={(e) => setNewCourse(e.target.value as MathCourse)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white"
                >
                  {MATH_COURSES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Format & Campus */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Meeting Format
                  </label>
                  <select
                    value={newFormat}
                    onChange={(e) => setNewFormat(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="In-Person">In-Person on Campus</option>
                    <option value="Online">Online (Zoom / Discord)</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>

                {newFormat !== 'Online' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Campus Host
                    </label>
                    <select
                      value={newCampus}
                      onChange={(e) => setNewCampus(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white"
                    >
                      {CCC_CAMPUSES.map((c) => (
                        <option key={c.name} value={c.name}>
                          {c.shortName} College
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Location Detail */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Location Detail / Virtual Room <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  placeholder="e.g. Truman College Library 2nd floor study carrels OR Discord channel"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    placeholder="e.g. Tuesday, Nov 10"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Time Window <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    placeholder="e.g. 4:00 PM - 5:30 PM"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              {/* Capacity */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Participant Capacity (Max seats)
                </label>
                <input
                  type="number"
                  min={2}
                  max={25}
                  value={newCapacity}
                  onChange={(e) => setNewCapacity(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                />
              </div>

              {/* Topics / Agenda */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Focus Topics (Comma separated)
                </label>
                <input
                  type="text"
                  value={newTopics}
                  onChange={(e) => setNewTopics(e.target.value)}
                  placeholder="e.g. Limits, L'Hopital's Rule, Derivatives"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Short Description / Group Goals
                </label>
                <textarea
                  rows={2}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Share what students should bring or prep beforehand..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs"
                >
                  Publish Study Group
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
