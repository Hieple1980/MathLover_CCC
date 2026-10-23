/**
 * MathLover CCC - Type Definitions
 * Independent student-led mathematics learning community for City Colleges of Chicago
 */

export type CCCCampus =
  | 'Harold Washington College'
  | 'Harry S Truman College'
  | 'Kennedy-King College'
  | 'Malcolm X College'
  | 'Olive-Harvey College'
  | 'Richard J. Daley College'
  | 'Wilbur Wright College';

export interface CampusInfo {
  name: CCCCampus;
  shortName: string;
  neighborhood: string;
  address: string;
  color: string;
  badgeBg: string;
}

export type MathCourse =
  | 'College Algebra (Math 125)'
  | 'Precalculus'
  | 'Trigonometry & Precalculus (Math 140/141)'
  | 'Elementary Statistics (Math 125/118)'
  | 'Calculus I (Math 207)'
  | 'Calculus II (Math 208)'
  | 'Calculus III (Math 209)'
  | 'Linear Algebra (Math 204)'
  | 'Discrete Mathematics (Math 212)'
  | 'Differential Equations (Math 210)'
  | 'Finite Mathematics (Math 160)';

export type StudyFormat = 'In-Person on Campus' | 'Online (Zoom / Discord)' | 'Hybrid (In-Person & Online)';

export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export type TimeSlot = 'Morning (8am - 12pm)' | 'Afternoon (12pm - 5pm)' | 'Evening (5pm - 9pm)' | 'Flexible / Weekends';

export type BadgeTier = 'bronze' | 'silver' | 'gold' | 'diamond';

export type BadgeId =
  | 'study_master'
  | 'top_contributor'
  | 'circle_host'
  | 'proof_pioneer'
  | 'chicago_connector';

export interface StudentBadge {
  id: BadgeId;
  title: string;
  tier: BadgeTier;
  level: number;
  description: string;
  category: 'community' | 'study_groups' | 'special';
  icon: string;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
  progressLabel: string;
  unlockedAt?: string;
  rewardPerk: string;
}

export interface StudentProfile {
  id: string;
  displayName: string;
  campus: CCCCampus;
  major: string;
  courses: MathCourse[];
  interests: string[];
  availability: {
    days: DayOfWeek[];
    timeSlots: TimeSlot[];
    format: StudyFormat;
  };
  bio: string;
  contactHandle: string; // e.g. discord or student email
  avatarSeed: string;
  updatedAt: string;
  featuredBadgeId?: BadgeId;
  contributorPoints?: number;
}

export interface PeerStudent {
  id: string;
  name: string;
  campus: CCCCampus;
  major: string;
  courses: MathCourse[];
  interests: string[];
  availabilityFormat: StudyFormat;
  preferredDays: DayOfWeek[];
  preferredTimes: string;
  bio: string;
  avatarUrl: string;
  connectionStatus?: 'none' | 'pending' | 'connected';
  mutualScore?: number;
  featuredBadge?: {
    title: string;
    tier: BadgeTier;
  };
}

export interface StudyGroup {
  id: string;
  title: string;
  course: MathCourse;
  campus: CCCCampus | 'Multi-Campus / Virtual';
  format: 'In-Person' | 'Online' | 'Hybrid';
  locationDetail: string; // e.g. "Daley College Library, Room 210" or "Zoom link sent to registered peers"
  date: string;
  time: string;
  hostName: string;
  hostCampus: CCCCampus;
  description: string;
  topics: string[];
  maxCapacity: number;
  members: string[]; // list of student names or IDs
  isUserMember?: boolean;
}

export interface CommunityReply {
  id: string;
  authorName: string;
  authorCampus: CCCCampus;
  authorRole?: string;
  content: string;
  mathFormula?: string;
  createdAt: string;
  upvotes: number;
  userUpvoted?: boolean;
  isSolution?: boolean;
}

export interface CommunityQuestion {
  id: string;
  title: string;
  subject: 'Calculus' | 'Linear Algebra' | 'Statistics' | 'College Algebra' | 'Discrete Math' | 'Precalculus' | 'General Math';
  course: MathCourse;
  content: string;
  mathExpression?: string;
  authorName: string;
  authorCampus: CCCCampus;
  createdAt: string;
  upvotes: number;
  userUpvoted?: boolean;
  tags: string[];
  replies: CommunityReply[];
  solved?: boolean;
}

export interface ConnectionRequest {
  id: string;
  peerId: string;
  peerName: string;
  peerCampus: CCCCampus;
  message: string;
  studyGoal: string;
  timestamp: string;
  status: 'pending' | 'connected';
}

export type ActiveScreen = 'dashboard' | 'profile' | 'match' | 'groups' | 'community';
