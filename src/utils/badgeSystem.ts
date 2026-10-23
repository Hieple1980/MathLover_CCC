/**
 * MathLover CCC - Badge and Recognition System
 * Calculates student contributor points, unlocks 'Study Master' and 'Top Contributor'
 * achievements, and evaluates progress based on real student activity.
 */

import { BadgeId, BadgeTier, CommunityQuestion, PeerStudent, StudentBadge, StudentProfile, StudyGroup } from '../types';

export interface ContributorMetrics {
  groupsJoined: number;
  groupsHosted: number;
  questionsAsked: number;
  repliesGiven: number;
  upvotesReceived: number;
  connectionsCount: number;
  campusesConnected: number;
  formulasShared: number;
}

export interface ContributorLevelInfo {
  level: number;
  title: string;
  points: number;
  nextLevelPoints: number;
  progressPercent: number;
  badgeFlair: string;
  badgeColor: string;
}

/**
 * Calculates raw metrics for a given user displayName from the current application state.
 */
export function calculateUserMetrics(
  userName: string,
  studyGroups: StudyGroup[],
  questions: CommunityQuestion[],
  connectionCount: number
): ContributorMetrics {
  // Count groups joined
  const groupsJoined = studyGroups.filter((g) => g.members.includes(userName)).length;
  // Count groups hosted
  const groupsHosted = studyGroups.filter((g) => g.hostName === userName).length;

  // Count questions asked by this student
  const questionsAsked = questions.filter((q) => q.authorName === userName).length;

  // Count replies given and upvotes received
  let repliesGiven = 0;
  let upvotesReceived = 0;
  let formulasShared = 0;

  questions.forEach((q) => {
    q.replies.forEach((rep) => {
      if (rep.authorName === userName) {
        repliesGiven += 1;
        upvotesReceived += rep.upvotes || 0;
        if (rep.mathFormula) {
          formulasShared += 1;
        }
      }
    });

    if (q.authorName === userName && q.mathExpression) {
      formulasShared += 1;
    }
  });

  return {
    groupsJoined,
    groupsHosted,
    questionsAsked,
    repliesGiven,
    upvotesReceived,
    connectionsCount: connectionCount,
    campusesConnected: Math.min(7, Math.max(1, connectionCount)),
    formulasShared,
  };
}

/**
 * Evaluates all badges and calculates current tier & progress.
 */
export function evaluateBadges(metrics: ContributorMetrics): StudentBadge[] {
  // 1. Study Master Badge
  // Requires joining study groups and organizing/leading sessions
  let studyMasterTier: BadgeTier = 'bronze';
  let studyMasterLevel = 1;
  let studyMasterUnlocked = false;
  let studyMasterProgress = metrics.groupsJoined;
  const studyMasterMax = 3;

  if (metrics.groupsJoined >= 3 && metrics.groupsHosted >= 1) {
    studyMasterTier = 'gold';
    studyMasterLevel = 3;
    studyMasterUnlocked = true;
    studyMasterProgress = 3;
  } else if (metrics.groupsJoined >= 3) {
    studyMasterTier = 'silver';
    studyMasterLevel = 2;
    studyMasterUnlocked = true;
    studyMasterProgress = 3;
  } else if (metrics.groupsJoined >= 1) {
    studyMasterTier = 'bronze';
    studyMasterLevel = 1;
    studyMasterUnlocked = true;
    studyMasterProgress = metrics.groupsJoined;
  }

  // 2. Top Contributor Badge
  // Requires posting answers in Math Community and earning upvotes
  let topContribTier: BadgeTier = 'bronze';
  let topContribLevel = 1;
  let topContribUnlocked = false;
  let topContribProgress = metrics.repliesGiven + metrics.questionsAsked;
  const topContribMax = 4;

  if (metrics.repliesGiven >= 2 && metrics.upvotesReceived >= 10) {
    topContribTier = 'gold';
    topContribLevel = 3;
    topContribUnlocked = true;
    topContribProgress = 4;
  } else if (metrics.repliesGiven >= 2 || (metrics.repliesGiven >= 1 && metrics.questionsAsked >= 1)) {
    topContribTier = 'silver';
    topContribLevel = 2;
    topContribUnlocked = true;
    topContribProgress = Math.min(3, metrics.repliesGiven + metrics.questionsAsked);
  } else if (metrics.repliesGiven >= 1 || metrics.questionsAsked >= 1) {
    topContribTier = 'bronze';
    topContribLevel = 1;
    topContribUnlocked = true;
    topContribProgress = 1;
  }

  // 3. Circle Host Badge
  const circleHostUnlocked = metrics.groupsHosted >= 1;
  const circleHostTier: BadgeTier = metrics.groupsHosted >= 2 ? 'gold' : metrics.groupsHosted >= 1 ? 'silver' : 'bronze';

  // 4. Proof Pioneer Badge (Formula usage)
  const proofUnlocked = metrics.formulasShared >= 1;
  const proofTier: BadgeTier = metrics.formulasShared >= 3 ? 'gold' : metrics.formulasShared >= 1 ? 'silver' : 'bronze';

  // 5. Chicago Connector Badge
  const connectorUnlocked = metrics.connectionsCount >= 1;
  const connectorTier: BadgeTier = metrics.connectionsCount >= 3 ? 'gold' : metrics.connectionsCount >= 1 ? 'silver' : 'bronze';

  return [
    {
      id: 'study_master',
      title: 'Study Master',
      tier: studyMasterTier,
      level: studyMasterLevel,
      description: 'Awarded for active study circle participation, teamwork, and hosting review sessions across City Colleges.',
      category: 'study_groups',
      icon: 'Award',
      unlocked: studyMasterUnlocked,
      progress: Math.min(studyMasterMax, metrics.groupsJoined + (metrics.groupsHosted > 0 ? 1 : 0)),
      maxProgress: studyMasterMax,
      progressLabel: `${metrics.groupsJoined} of 3 sessions joined (${metrics.groupsHosted} hosted)`,
      rewardPerk: 'Priority seat reservations & highlighted "Study Master" title in group directories.',
    },
    {
      id: 'top_contributor',
      title: 'Top Contributor',
      tier: topContribTier,
      level: topContribLevel,
      description: 'Honors students who actively resolve math doubts, share clean proofs, and earn community upvotes.',
      category: 'community',
      icon: 'Star',
      unlocked: topContribUnlocked,
      progress: Math.min(topContribMax, topContribProgress),
      maxProgress: topContribMax,
      progressLabel: `${metrics.repliesGiven} replies & ${metrics.upvotesReceived} peer upvotes`,
      rewardPerk: 'Featured contributor badge on all questions and peer tutor status recognition.',
    },
    {
      id: 'circle_host',
      title: 'Circle Host',
      tier: circleHostTier,
      level: metrics.groupsHosted >= 2 ? 3 : metrics.groupsHosted >= 1 ? 2 : 1,
      description: 'Organizes and facilitates collaborative peer study sessions in campus libraries or online.',
      category: 'study_groups',
      icon: 'Users',
      unlocked: circleHostUnlocked,
      progress: Math.min(2, metrics.groupsHosted),
      maxProgress: 2,
      progressLabel: `${metrics.groupsHosted} of 2 groups hosted`,
      rewardPerk: 'Can set custom agenda tags & multi-campus event banners.',
    },
    {
      id: 'proof_pioneer',
      title: 'Proof Pioneer',
      tier: proofTier,
      level: metrics.formulasShared >= 3 ? 3 : metrics.formulasShared >= 1 ? 2 : 1,
      description: 'Employs rigorous mathematical formulas, symbols (∫, ∑, √), and step-by-step logic in problem threads.',
      category: 'community',
      icon: 'Sparkles',
      unlocked: proofUnlocked,
      progress: Math.min(3, metrics.formulasShared),
      maxProgress: 3,
      progressLabel: `${metrics.formulasShared} of 3 formulas formulated`,
      rewardPerk: 'Special LaTeX notation highlight flair on answers.',
    },
    {
      id: 'chicago_connector',
      title: 'Chicago Connector',
      tier: connectorTier,
      level: metrics.connectionsCount >= 3 ? 3 : metrics.connectionsCount >= 1 ? 2 : 1,
      description: 'Expands the math community across Chicago by connecting with students from multiple CCC colleges.',
      category: 'special',
      icon: 'Compass',
      unlocked: connectorUnlocked,
      progress: Math.min(3, metrics.connectionsCount),
      maxProgress: 3,
      progressLabel: `${metrics.connectionsCount} study partners connected`,
      rewardPerk: 'Cross-campus networking ambassador badge.',
    },
  ];
}

/**
 * Computes contributor points and current title tier.
 */
export function calculateContributorPoints(metrics: ContributorMetrics): ContributorLevelInfo {
  const points =
    metrics.groupsJoined * 25 +
    metrics.groupsHosted * 50 +
    metrics.questionsAsked * 15 +
    metrics.repliesGiven * 30 +
    metrics.upvotesReceived * 10 +
    metrics.connectionsCount * 20;

  if (points >= 300) {
    return {
      level: 4,
      title: 'Top Contributor (Gold)',
      points,
      nextLevelPoints: 500,
      progressPercent: Math.min(100, Math.round((points / 500) * 100)),
      badgeFlair: '🏆 Gold Master',
      badgeColor: 'from-amber-500 to-yellow-500 text-amber-950',
    };
  } else if (points >= 150) {
    return {
      level: 3,
      title: 'Study Master',
      points,
      nextLevelPoints: 300,
      progressPercent: Math.min(100, Math.round(((points - 150) / 150) * 100)),
      badgeFlair: '⭐ Study Master',
      badgeColor: 'from-purple-600 to-indigo-600 text-white',
    };
  } else if (points >= 60) {
    return {
      level: 2,
      title: 'Active Contributor',
      points,
      nextLevelPoints: 150,
      progressPercent: Math.min(100, Math.round(((points - 60) / 90) * 100)),
      badgeFlair: '🥈 Silver Contributor',
      badgeColor: 'from-blue-600 to-indigo-500 text-white',
    };
  } else {
    return {
      level: 1,
      title: 'Math Explorer',
      points,
      nextLevelPoints: 60,
      progressPercent: Math.min(100, Math.round((points / 60) * 100)),
      badgeFlair: '🥉 Bronze Explorer',
      badgeColor: 'from-slate-600 to-slate-700 text-white',
    };
  }
}
