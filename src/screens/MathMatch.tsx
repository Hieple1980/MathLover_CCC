/**
 * MathLover CCC - Screen 3: Math Match
 * Connect with fellow City Colleges of Chicago students studying the same mathematics topics.
 * Includes interactive filters, mutual match calculations, and a working "Connect" demo interaction.
 */

import React, { useState, useMemo } from 'react';
import { useMath } from '../context/MathContext';
import { CCC_CAMPUSES, MATH_COURSES } from '../data/mockData';
import { CCCCampus, MathCourse, PeerStudent, StudyFormat } from '../types';
import {
  UserCheck,
  Search,
  Filter,
  MapPin,
  BookOpen,
  Sparkles,
  Check,
  MessageCircle,
  Clock,
  Send,
  X,
  UserPlus,
  Users,
  CheckCircle2,
  Share2
} from 'lucide-react';
import { BadgeDisplay } from '../components/BadgeDisplay';

export const MathMatch: React.FC = () => {
  const { peers, connectWithPeer, userProfile, connectionRequests } = useMath();

  // Active view tab: 'browse' | 'connections'
  const [activeTab, setActiveTab] = useState<'browse' | 'connections'>('browse');

  // Filters
  const [campusFilter, setCampusFilter] = useState<string>('all');
  const [courseFilter, setCourseFilter] = useState<string>('all');
  const [formatFilter, setFormatFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Interactive Connect Modal State
  const [selectedPeerForConnect, setSelectedPeerForConnect] = useState<PeerStudent | null>(null);
  const [connectNote, setConnectNote] = useState('');
  const [selectedStudyGoal, setSelectedStudyGoal] = useState('Prep for upcoming midterm & homework problem sets');

  // Quick message demonstration drawer
  const [chattingPeer, setChattingPeer] = useState<PeerStudent | null>(null);
  const [chatMessages, setChatMessages] = useState<Record<string, Array<{ sender: string; text: string; time: string }>>>({
    peer_4: [
      { sender: 'Jamal Crawford', text: 'Hey Hiep! Glad we connected on MathLover.', time: '10:15 AM' },
      { sender: 'Jamal Crawford', text: 'Are you working on the Linear Algebra orthogonal vectors assignment tonight?', time: '10:16 AM' },
    ],
  });
  const [newChatText, setNewChatText] = useState('');

  // Filter peers
  const filteredPeers = useMemo(() => {
    return peers.filter((peer) => {
      // Campus filter
      if (campusFilter !== 'all' && peer.campus !== campusFilter) {
        return false;
      }
      // Course filter
      if (courseFilter !== 'all') {
        const matchesCourse = peer.courses.some((c) => {
          if (courseFilter === 'Precalculus') {
            return c === 'Precalculus';
          }
          if (courseFilter === 'Trigonometry & Precalculus (Math 140/141)') {
            return c === 'Trigonometry & Precalculus (Math 140/141)';
          }
          return c === courseFilter || c.includes(courseFilter);
        });
        if (!matchesCourse) {
          return false;
        }
      }
      // Format filter
      if (formatFilter !== 'all' && peer.availabilityFormat !== formatFilter) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = peer.name.toLowerCase().includes(query);
        const matchesMajor = peer.major.toLowerCase().includes(query);
        const matchesBio = peer.bio.toLowerCase().includes(query);
        const matchesCourse = peer.courses.some((c) => c.toLowerCase().includes(query));
        const matchesInterest = peer.interests.some((i) => i.toLowerCase().includes(query));
        if (!matchesName && !matchesMajor && !matchesBio && !matchesCourse && !matchesInterest) {
          return false;
        }
      }
      return true;
    });
  }, [peers, campusFilter, courseFilter, formatFilter, searchQuery]);

  // Handle open connect modal
  const handleOpenConnect = (peer: PeerStudent) => {
    setSelectedPeerForConnect(peer);
    setConnectNote(`Hi ${peer.name.split(' ')[0]}! I noticed we are both taking math at CCC. Would love to collaborate on problem sets.`);
    setSelectedStudyGoal('Weekly problem set sprints & exam review');
  };

  // Submit connect request
  const handleSubmitConnect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPeerForConnect) return;

    connectWithPeer(selectedPeerForConnect.id, connectNote, selectedStudyGoal);
    setSelectedPeerForConnect(null);
  };

  // Handle sending chat message in demonstration
  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chattingPeer || !newChatText.trim()) return;

    const pId = chattingPeer.id;
    const msg = {
      sender: userProfile.displayName,
      text: newChatText.trim(),
      time: 'Just now',
    };

    setChatMessages((prev) => ({
      ...prev,
      [pId]: [...(prev[pId] || []), msg],
    }));
    setNewChatText('');
  };

  // Compute common courses between user and peer
  const getMutualCourses = (peerCourses: MathCourse[]) => {
    return peerCourses.filter((pc) => userProfile.courses.includes(pc));
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold mb-2 border border-purple-200">
            <UserCheck className="w-3.5 h-3.5" />
            <span>Peer Compatibility Network</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Math Match: Find Your Study Partners
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            Partner with dedicated students across City Colleges of Chicago. Compare math syllabi, find peers with matching study schedules, and team up.
          </p>
        </div>

        {/* Tab Switcher: Browse vs Connections */}
        <div className="flex bg-slate-100 p-1 rounded-xl self-start md:self-center">
          <button
            onClick={() => setActiveTab('browse')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'browse'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Browse Peers ({peers.length})
          </button>
          <button
            onClick={() => setActiveTab('connections')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'connections'
                ? 'bg-white text-purple-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>My Connections</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-purple-100 text-purple-700 font-bold">
              {connectionRequests.length}
            </span>
          </button>
        </div>
      </div>

      {activeTab === 'browse' ? (
        <>
          {/* Filter Bar */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex flex-col md:flex-row gap-3">
              {/* Search Bar */}
              <div className="flex-1 relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by student name, topic, major, or keywords..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-purple-500 text-xs sm:text-sm"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Campus Filter */}
              <div className="w-full md:w-56">
                <select
                  value={campusFilter}
                  onChange={(e) => setCampusFilter(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-medium text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">All 7 CCC Campuses</option>
                  {CCC_CAMPUSES.map((c) => (
                    <option key={c.name} value={c.name}>
                      {c.shortName} College
                    </option>
                  ))}
                </select>
              </div>

              {/* Course Filter */}
              <div className="w-full md:w-56">
                <select
                  value={courseFilter}
                  onChange={(e) => setCourseFilter(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-medium text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">All Math Courses</option>
                  {MATH_COURSES.map((course) => (
                    <option key={course} value={course}>
                      {course}
                    </option>
                  ))}
                </select>
              </div>

              {/* Study Format Filter */}
              <div className="w-full md:w-48">
                <select
                  value={formatFilter}
                  onChange={(e) => setFormatFilter(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-medium text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">Any Study Format</option>
                  <option value="In-Person on Campus">In-Person on Campus</option>
                  <option value="Online (Zoom / Discord)">Online (Zoom/Discord)</option>
                  <option value="Hybrid (In-Person & Online)">Hybrid</option>
                </select>
              </div>
            </div>

            {/* Active filter counter and clear button */}
            {(campusFilter !== 'all' || courseFilter !== 'all' || formatFilter !== 'all' || searchQuery) && (
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
                <span>
                  Showing {filteredPeers.length} of {peers.length} students matching your criteria
                </span>
                <button
                  onClick={() => {
                    setCampusFilter('all');
                    setCourseFilter('all');
                    setFormatFilter('all');
                    setSearchQuery('');
                  }}
                  className="text-purple-600 hover:text-purple-800 font-semibold"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>

          {/* Student Cards Grid */}
          {filteredPeers.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
              <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800">No matching math students found</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Try widening your campus, course, or availability filters to discover more students across Chicago.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPeers.map((peer) => {
                const mutualCourses = getMutualCourses(peer.courses);
                const isConnected = peer.connectionStatus === 'connected';
                const isPending = peer.connectionStatus === 'pending';

                return (
                  <div
                    key={peer.id}
                    className="bg-white rounded-2xl border border-slate-200/90 hover:border-purple-300 hover:shadow-md transition-all p-5 flex flex-col justify-between space-y-4"
                  >
                    <div>
                      {/* Top Header */}
                      <div className="flex items-start gap-3.5 mb-3">
                        <img
                          src={peer.avatarUrl}
                          alt={peer.name}
                          className="w-12 h-12 rounded-xl object-cover ring-2 ring-purple-100 shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="text-base font-bold text-slate-900 truncate">
                              {peer.name}
                            </h3>
                            {peer.mutualScore && (
                              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                {peer.mutualScore}% Match
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 truncate">{peer.major}</p>
                          <div className="mt-1 flex flex-wrap items-center gap-1.5">
                            <span className="flex items-center gap-1 text-[11px] font-medium text-blue-700">
                              <MapPin className="w-3 h-3 text-blue-600 shrink-0" />
                              <span className="truncate">{peer.campus.replace(' College', '')}</span>
                            </span>
                            {peer.featuredBadge && (
                              <BadgeDisplay
                                title={peer.featuredBadge.title}
                                tier={peer.featuredBadge.tier}
                                size="xs"
                                showTierLabel
                              />
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Bio */}
                      <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-3">
                        "{peer.bio}"
                      </p>

                      {/* Courses */}
                      <div className="space-y-1.5 mb-3">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Enrolled Courses:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {peer.courses.map((course) => {
                            const isMutual = userProfile.courses.includes(course);
                            return (
                              <span
                                key={course}
                                className={`px-2 py-0.5 rounded-md text-[11px] font-medium ${
                                  isMutual
                                    ? 'bg-purple-100 text-purple-800 border border-purple-200 font-semibold'
                                    : 'bg-slate-100 text-slate-700'
                                }`}
                              >
                                {isMutual && '★ '}
                                {course.split(' (')[0]}
                              </span>
                            );
                          })}
                        </div>
                      </div>

                      {/* Math Interests */}
                      <div className="space-y-1.5 mb-3">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Focus Areas:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {peer.interests.map((interest) => (
                            <span
                              key={interest}
                              className="px-2 py-0.5 rounded-full text-[10px] bg-slate-50 text-slate-600 border border-slate-100"
                            >
                              {interest}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Availability & Preferred Times */}
                      <div className="pt-2 border-t border-slate-100 text-xs text-slate-500 space-y-1">
                        <div className="flex items-center gap-1.5 font-medium text-slate-700">
                          <Clock className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                          <span>{peer.availabilityFormat}</span>
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {peer.preferredDays.join(', ')} &bull; {peer.preferredTimes}
                        </div>
                      </div>
                    </div>

                    {/* Connect Action Button */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      {mutualCourses.length > 0 ? (
                        <span className="text-[11px] font-semibold text-purple-700">
                          Mutual: {mutualCourses[0].split(' (')[0]}
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400">Same Community</span>
                      )}

                      {isConnected ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setChattingPeer(peer)}
                            className="px-3 py-1.5 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 text-xs font-semibold flex items-center gap-1 transition-colors"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>Message</span>
                          </button>
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-200">
                            <Check className="w-3.5 h-3.5" />
                            <span>Connected</span>
                          </span>
                        </div>
                      ) : isPending ? (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Request Sent</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => handleOpenConnect(peer)}
                          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors"
                        >
                          <UserPlus className="w-3.5 h-3.5" />
                          <span>Connect</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      ) : (
        /* Connections Tab View */
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Your Math Study Network ({connectionRequests.length})
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Peers you have connected with on MathLover CCC. Click on any partner to coordinate study sessions or problem-set discussions.
            </p>

            {connectionRequests.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-slate-200 rounded-xl">
                <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-700">No active connections yet</p>
                <p className="text-xs text-slate-500 mt-1">Browse peers and click "Connect" to build your math study circle.</p>
                <button
                  onClick={() => setActiveTab('browse')}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700"
                >
                  Browse Student Directory
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {connectionRequests.map((conn) => {
                  const peerObj = peers.find((p) => p.id === conn.peerId);
                  return (
                    <div
                      key={conn.id}
                      className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-purple-200 transition-all space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-sm font-bold text-slate-900">{conn.peerName}</h4>
                          <span className="text-xs text-blue-600 font-medium">{conn.peerCampus}</span>
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          Active Partner
                        </span>
                      </div>

                      <div className="text-xs text-slate-600 bg-white p-2.5 rounded-lg border border-slate-100">
                        <span className="font-semibold text-slate-700">Study Goal: </span>
                        <span>{conn.studyGoal}</span>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <span className="text-[11px] text-slate-400">Connected {conn.timestamp}</span>
                        {peerObj && (
                          <button
                            onClick={() => setChattingPeer(peerObj)}
                            className="px-3 py-1.5 rounded-lg bg-purple-600 text-white hover:bg-purple-700 text-xs font-semibold flex items-center gap-1.5 shadow-2xs"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>Open Math Chat</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Interactive Connect Modal */}
      {selectedPeerForConnect && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150 space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-purple-600">
                  Study Partnership Invitation
                </span>
                <h3 className="text-lg font-bold text-slate-900">
                  Connect with {selectedPeerForConnect.name}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {selectedPeerForConnect.campus} &bull; {selectedPeerForConnect.major}
                </p>
              </div>
              <button
                onClick={() => setSelectedPeerForConnect(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitConnect} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Primary Study Objective
                </label>
                <select
                  value={selectedStudyGoal}
                  onChange={(e) => setSelectedStudyGoal(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium text-slate-800"
                >
                  <option value="Prep for upcoming midterm & homework problem sets">
                    Prep for upcoming midterm & homework problem sets
                  </option>
                  <option value="Weekly problem set accountability sprint">
                    Weekly problem set accountability sprint
                  </option>
                  <option value="Concept review & step-by-step whiteboard proofs">
                    Concept review & step-by-step whiteboard proofs
                  </option>
                  <option value="Transfer university preparation (UIC, IIT, UIUC)">
                    Transfer university preparation (UIC, IIT, UIUC)
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Personal Note or Invitation Message
                </label>
                <textarea
                  rows={3}
                  value={connectNote}
                  onChange={(e) => setConnectNote(e.target.value)}
                  placeholder="Introduce yourself and propose a time or chapter to review..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-purple-500 leading-relaxed"
                />
              </div>

              <div className="bg-blue-50/70 p-3 rounded-xl border border-blue-200 text-xs text-blue-800 space-y-1">
                <p className="font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>Demonstration Interaction Ready</span>
                </p>
                <p className="text-[11px] text-blue-700">
                  Sending this invitation updates your study network state and activates mutual messaging demonstration.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedPeerForConnect(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-xs font-semibold shadow-md shadow-purple-500/20 flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Connection Request</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Demonstration Math Chat Drawer / Modal */}
      {chattingPeer && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 flex flex-col h-[520px]">
            {/* Chat Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <img
                  src={chattingPeer.avatarUrl}
                  alt={chattingPeer.name}
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-purple-100"
                />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{chattingPeer.name}</h4>
                  <p className="text-[11px] text-slate-500">{chattingPeer.campus}</p>
                </div>
              </div>
              <button
                onClick={() => setChattingPeer(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto py-4 space-y-3">
              {(chatMessages[chattingPeer.id] || [
                {
                  sender: chattingPeer.name,
                  text: `Hey ${userProfile.displayName}! Great connecting with you. Excited to work on math problems together!`,
                  time: 'Just now',
                },
              ]).map((msg, i) => {
                const isMe = msg.sender === userProfile.displayName;
                return (
                  <div
                    key={i}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <span className="text-[10px] text-slate-400 mb-0.5 px-1">{msg.sender}</span>
                    <div
                      className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed ${
                        isMe
                          ? 'bg-purple-600 text-white rounded-br-xs'
                          : 'bg-slate-100 text-slate-800 rounded-bl-xs'
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[9px] text-slate-400 mt-0.5 px-1">{msg.time}</span>
                  </div>
                );
              })}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendChatMessage} className="pt-3 border-t border-slate-100 flex gap-2">
              <input
                type="text"
                value={newChatText}
                onChange={(e) => setNewChatText(e.target.value)}
                placeholder="Type a math question or propose meeting time..."
                className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-purple-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-purple-600 text-white rounded-xl text-xs font-semibold hover:bg-purple-700 flex items-center gap-1 shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
