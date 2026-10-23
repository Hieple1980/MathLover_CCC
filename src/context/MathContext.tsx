/**
 * MathLover CCC - Main Application State & LocalStorage Synchronization
 * Provides reactive data store for student profile, peer matches, study groups,
 * and community questions across all components.
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  DEFAULT_USER_PROFILE,
  INITIAL_PEER_STUDENTS,
  INITIAL_QUESTIONS,
  INITIAL_STUDY_GROUPS,
} from '../data/mockData';
import {
  ActiveScreen,
  BadgeId,
  CommunityQuestion,
  CommunityReply,
  ConnectionRequest,
  MathCourse,
  PeerStudent,
  StudentBadge,
  StudentProfile,
  StudyGroup,
} from '../types';
import {
  calculateContributorPoints,
  calculateUserMetrics,
  ContributorLevelInfo,
  ContributorMetrics,
  evaluateBadges,
} from '../utils/badgeSystem';

export interface ToastMessage {
  id: string;
  title: string;
  description: string;
  type: 'success' | 'info' | 'warning';
}

interface MathContextType {
  // Screen routing
  activeScreen: ActiveScreen;
  setActiveScreen: (screen: ActiveScreen) => void;
  selectedCourseFilter: MathCourse | null;
  setSelectedCourseFilter: (course: MathCourse | null) => void;

  // Student Profile
  userProfile: StudentProfile;
  updateUserProfile: (profile: Partial<StudentProfile>) => { success: boolean; error?: string };
  resetUserProfile: () => void;

  // Badge & Contributor Reward System
  badges: StudentBadge[];
  contributorMetrics: ContributorMetrics;
  contributorLevel: ContributorLevelInfo;
  featuredBadge: StudentBadge | undefined;
  setFeaturedBadge: (badgeId: BadgeId) => void;

  // Peer Matching
  peers: PeerStudent[];
  connectionRequests: ConnectionRequest[];
  connectWithPeer: (peerId: string, message: string, studyGoal: string) => void;

  // Study Groups
  studyGroups: StudyGroup[];
  joinStudyGroup: (groupId: string) => void;
  leaveStudyGroup: (groupId: string) => void;
  createStudyGroup: (groupData: {
    title: string;
    course: MathCourse;
    campus: any;
    format: 'In-Person' | 'Online' | 'Hybrid';
    locationDetail: string;
    date: string;
    time: string;
    description: string;
    topics: string[];
    maxCapacity: number;
  }) => { success: boolean; error?: string };

  // Community Questions & Discussions
  questions: CommunityQuestion[];
  addQuestion: (questionData: {
    title: string;
    subject: any;
    course: MathCourse;
    content: string;
    mathExpression?: string;
    tags: string[];
  }) => { success: boolean; error?: string };
  addReply: (questionId: string, content: string, mathFormula?: string) => void;
  toggleUpvoteQuestion: (questionId: string) => void;
  toggleUpvoteReply: (questionId: string, replyId: string) => void;

  // Toasts
  toasts: ToastMessage[];
  addToast: (title: string, description: string, type?: 'success' | 'info' | 'warning') => void;
  removeToast: (id: string) => void;
}

const STORAGE_KEYS = {
  PROFILE: 'mathlover_user_profile',
  PEERS: 'mathlover_peers',
  GROUPS: 'mathlover_study_groups',
  QUESTIONS: 'mathlover_questions',
  CONNECTIONS: 'mathlover_connections',
};

const MathContext = createContext<MathContextType | undefined>(undefined);

export const MathProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Active Navigation Screen
  const [activeScreen, setActiveScreenState] = useState<ActiveScreen>('dashboard');
  const [selectedCourseFilter, setSelectedCourseFilter] = useState<MathCourse | null>(null);

  // User Profile
  const [userProfile, setUserProfile] = useState<StudentProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
      if (saved) {
        const parsed = JSON.parse(saved);
        let modified = false;
        if (parsed.displayName === 'Alex Rivera') {
          parsed.displayName = 'Hiep Le';
          modified = true;
        }
        if (parsed.campus === 'Harold Washington College' || !parsed.campus) {
          parsed.campus = 'Harry S Truman College';
          modified = true;
        }
        if (
          parsed.contactHandle === 'arivera@student.ccc.edu' ||
          parsed.contactHandle === 'hle@student.ccc.edu' ||
          !parsed.contactHandle
        ) {
          parsed.contactHandle = 'hle61@gmail.com';
          modified = true;
        }
        if (parsed.avatarSeed === 'alex-rivera') {
          parsed.avatarSeed = 'hiep-le';
          modified = true;
        }
        if (modified) {
          localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(parsed));
        }
        return parsed;
      }
      return DEFAULT_USER_PROFILE;
    } catch {
      return DEFAULT_USER_PROFILE;
    }
  });

  // Peer Students
  const [peers, setPeers] = useState<PeerStudent[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PEERS);
      return saved ? JSON.parse(saved) : INITIAL_PEER_STUDENTS;
    } catch {
      return INITIAL_PEER_STUDENTS;
    }
  });

  // Connections
  const [connectionRequests, setConnectionRequests] = useState<ConnectionRequest[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CONNECTIONS);
      if (saved) return JSON.parse(saved);
      // default initial connection demonstration
      return [
        {
          id: 'conn_init_1',
          peerId: 'peer_4',
          peerName: 'Jamal Crawford',
          peerCampus: 'Kennedy-King College',
          message: 'Hey Hiep! Would love to co-study on Linear Algebra matrix transformations.',
          studyGoal: 'Midterm Chapter 4 prep',
          timestamp: 'Yesterday',
          status: 'connected',
        },
      ];
    } catch {
      return [];
    }
  });

  // Study Groups
  const [studyGroups, setStudyGroups] = useState<StudyGroup[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.GROUPS);
      return saved ? JSON.parse(saved) : INITIAL_STUDY_GROUPS;
    } catch {
      return INITIAL_STUDY_GROUPS;
    }
  });

  // Community Questions
  const [questions, setQuestions] = useState<CommunityQuestion[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.QUESTIONS);
      return saved ? JSON.parse(saved) : INITIAL_QUESTIONS;
    } catch {
      return INITIAL_QUESTIONS;
    }
  });

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (title: string, description: string, type: 'success' | 'info' | 'warning' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, description, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Dynamic Badge & Contributor Calculations
  const contributorMetrics = React.useMemo(() => {
    return calculateUserMetrics(userProfile.displayName, studyGroups, questions, connectionRequests.length);
  }, [userProfile.displayName, studyGroups, questions, connectionRequests.length]);

  const badges = React.useMemo(() => {
    return evaluateBadges(contributorMetrics);
  }, [contributorMetrics]);

  const contributorLevel = React.useMemo(() => {
    return calculateContributorPoints(contributorMetrics);
  }, [contributorMetrics]);

  const featuredBadge = React.useMemo(() => {
    if (userProfile.featuredBadgeId) {
      const match = badges.find((b) => b.id === userProfile.featuredBadgeId);
      if (match) return match;
    }
    return badges.find((b) => b.unlocked) || badges[0];
  }, [badges, userProfile.featuredBadgeId]);

  const setFeaturedBadge = (badgeId: BadgeId) => {
    setUserProfile((prev) => ({
      ...prev,
      featuredBadgeId: badgeId,
    }));
    const badgeObj = badges.find((b) => b.id === badgeId);
    addToast(
      'Showcase Badge Updated!',
      `You are now featuring the "${badgeObj?.title || badgeId}" badge on your public student card.`,
      'success'
    );
  };

  // Sync to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(userProfile));
    } catch (e) {
      console.warn('LocalStorage error saving profile', e);
    }
  }, [userProfile]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PEERS, JSON.stringify(peers));
    } catch (e) {
      console.warn('LocalStorage error saving peers', e);
    }
  }, [peers]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CONNECTIONS, JSON.stringify(connectionRequests));
    } catch (e) {
      console.warn('LocalStorage error saving connections', e);
    }
  }, [connectionRequests]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.GROUPS, JSON.stringify(studyGroups));
    } catch (e) {
      console.warn('LocalStorage error saving groups', e);
    }
  }, [studyGroups]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(questions));
    } catch (e) {
      console.warn('LocalStorage error saving questions', e);
    }
  }, [questions]);

  const setActiveScreen = (screen: ActiveScreen) => {
    setActiveScreenState(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Profile operations
  const updateUserProfile = (updated: Partial<StudentProfile>) => {
    if (updated.displayName !== undefined && !updated.displayName.trim()) {
      return { success: false, error: 'Student display name cannot be blank.' };
    }
    if (updated.courses !== undefined && updated.courses.length === 0) {
      return { success: false, error: 'Please select at least one active mathematics course.' };
    }

    setUserProfile((prev) => ({
      ...prev,
      ...updated,
      updatedAt: new Date().toISOString(),
    }));

    addToast('Profile Updated', 'Your student math profile has been saved successfully!', 'success');
    return { success: true };
  };

  const resetUserProfile = () => {
    setUserProfile(DEFAULT_USER_PROFILE);
    addToast('Profile Reset', 'Reset to default student profile demonstration data.', 'info');
  };

  // Peer matching operations
  const connectWithPeer = (peerId: string, message: string, studyGoal: string) => {
    const peer = peers.find((p) => p.id === peerId);
    if (!peer) return;

    setPeers((prev) =>
      prev.map((p) => (p.id === peerId ? { ...p, connectionStatus: 'connected' } : p))
    );

    const newReq: ConnectionRequest = {
      id: `req_${Date.now()}`,
      peerId,
      peerName: peer.name,
      peerCampus: peer.campus,
      message: message.trim() || 'Excited to study math together this semester!',
      studyGoal: studyGoal.trim() || 'Weekly problem sets & exam review',
      timestamp: 'Just now',
      status: 'connected',
    };

    setConnectionRequests((prev) => [newReq, ...prev]);
    addToast(
      'Connected with ' + peer.name + '!',
      `You're now linked for math collaboration at ${peer.campus}. Check "My Connections" tab.`,
      'success'
    );
  };

  // Study group operations
  const joinStudyGroup = (groupId: string) => {
    const group = studyGroups.find((g) => g.id === groupId);
    if (!group) return;

    if (group.members.includes(userProfile.displayName)) {
      addToast('Already Joined', 'You are already a registered member of this study group.', 'info');
      return;
    }

    if (group.members.length >= group.maxCapacity) {
      addToast('Group Full', 'This study group has reached its maximum capacity.', 'warning');
      return;
    }

    setStudyGroups((prev) =>
      prev.map((g) => {
        if (g.id === groupId) {
          return {
            ...g,
            members: [...g.members, userProfile.displayName],
            isUserMember: true,
          };
        }
        return g;
      })
    );

    addToast(
      'Study Group Joined! (+25 pts)',
      `You reserved a seat in "${group.title}". You earned +25 Contributor points toward the Study Master badge!`,
      'success'
    );
  };

  const leaveStudyGroup = (groupId: string) => {
    const group = studyGroups.find((g) => g.id === groupId);
    if (!group) return;

    setStudyGroups((prev) =>
      prev.map((g) => {
        if (g.id === groupId) {
          return {
            ...g,
            members: g.members.filter((m) => m !== userProfile.displayName),
            isUserMember: false,
          };
        }
        return g;
      })
    );

    addToast('Left Study Group', `You have unregistered from "${group.title}".`, 'info');
  };

  const createStudyGroup = (groupData: {
    title: string;
    course: MathCourse;
    campus: any;
    format: 'In-Person' | 'Online' | 'Hybrid';
    locationDetail: string;
    date: string;
    time: string;
    description: string;
    topics: string[];
    maxCapacity: number;
  }) => {
    if (!groupData.title.trim()) {
      return { success: false, error: 'Study group title is required.' };
    }
    if (!groupData.locationDetail.trim()) {
      return { success: false, error: 'Location detail or virtual link note is required.' };
    }
    if (!groupData.date.trim() || !groupData.time.trim()) {
      return { success: false, error: 'Please choose a scheduled date and time.' };
    }

    const newGroup: StudyGroup = {
      id: `group_${Date.now()}`,
      title: groupData.title.trim(),
      course: groupData.course,
      campus: groupData.campus,
      format: groupData.format,
      locationDetail: groupData.locationDetail.trim(),
      date: groupData.date.trim(),
      time: groupData.time.trim(),
      hostName: userProfile.displayName,
      hostCampus: userProfile.campus,
      description: groupData.description.trim() || 'Open peer math study session for CCC students.',
      topics: groupData.topics.length > 0 ? groupData.topics : ['General Problem Sets', 'Midterm Prep'],
      maxCapacity: groupData.maxCapacity || 8,
      members: [userProfile.displayName],
      isUserMember: true,
    };

    setStudyGroups((prev) => [newGroup, ...prev]);
    addToast(
      'Study Group Published! (+50 pts)',
      `"${newGroup.title}" is live! Earned +50 Contributor points & Circle Host badge progress.`,
      'success'
    );
    return { success: true };
  };

  // Community discussion operations
  const addQuestion = (data: {
    title: string;
    subject: any;
    course: MathCourse;
    content: string;
    mathExpression?: string;
    tags: string[];
  }) => {
    if (!data.title.trim()) {
      return { success: false, error: 'Question title cannot be empty.' };
    }
    if (!data.content.trim()) {
      return { success: false, error: 'Please provide the problem details or where you are stuck.' };
    }

    const newQ: CommunityQuestion = {
      id: `q_${Date.now()}`,
      title: data.title.trim(),
      subject: data.subject,
      course: data.course,
      content: data.content.trim(),
      mathExpression: data.mathExpression?.trim() || undefined,
      authorName: userProfile.displayName,
      authorCampus: userProfile.campus,
      createdAt: 'Just now',
      upvotes: 1,
      userUpvoted: true,
      tags: data.tags.length > 0 ? data.tags : [data.subject],
      replies: [],
    };

    setQuestions((prev) => [newQ, ...prev]);
    addToast(
      'Question Posted! (+15 pts)',
      'Your mathematics question is published! Gained +15 Contributor points.',
      'success'
    );
    return { success: true };
  };

  const addReply = (questionId: string, content: string, mathFormula?: string) => {
    if (!content.trim()) return;

    const newReply: CommunityReply = {
      id: `rep_${Date.now()}`,
      authorName: userProfile.displayName,
      authorCampus: userProfile.campus,
      authorRole: 'Peer Student',
      content: content.trim(),
      mathFormula: mathFormula?.trim() || undefined,
      createdAt: 'Just now',
      upvotes: 1,
      userUpvoted: true,
    };

    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id === questionId) {
          return {
            ...q,
            replies: [...q.replies, newReply],
          };
        }
        return q;
      })
    );

    addToast(
      'Reply Submitted! (+30 pts)',
      'Your explanation was posted! You earned +30 points toward the Top Contributor badge.',
      'success'
    );
  };

  const toggleUpvoteQuestion = (questionId: string) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id === questionId) {
          const upvoted = !q.userUpvoted;
          return {
            ...q,
            userUpvoted: upvoted,
            upvotes: upvoted ? q.upvotes + 1 : q.upvotes - 1,
          };
        }
        return q;
      })
    );
  };

  const toggleUpvoteReply = (questionId: string, replyId: string) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id === questionId) {
          return {
            ...q,
            replies: q.replies.map((r) => {
              if (r.id === replyId) {
                const upvoted = !r.userUpvoted;
                return {
                  ...r,
                  userUpvoted: upvoted,
                  upvotes: upvoted ? r.upvotes + 1 : r.upvotes - 1,
                };
              }
              return r;
            }),
          };
        }
        return q;
      })
    );
  };

  return (
    <MathContext.Provider
      value={{
        activeScreen,
        setActiveScreen,
        selectedCourseFilter,
        setSelectedCourseFilter,
        userProfile,
        updateUserProfile,
        resetUserProfile,
        badges,
        contributorMetrics,
        contributorLevel,
        featuredBadge,
        setFeaturedBadge,
        peers,
        connectionRequests,
        connectWithPeer,
        studyGroups,
        joinStudyGroup,
        leaveStudyGroup,
        createStudyGroup,
        questions,
        addQuestion,
        addReply,
        toggleUpvoteQuestion,
        toggleUpvoteReply,
        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </MathContext.Provider>
  );
};

export const useMath = () => {
  const context = useContext(MathContext);
  if (!context) {
    throw new Error('useMath must be used within a MathProvider');
  }
  return context;
};
