// Streak Tracking System - Daily Learning Motivation

export interface Badge {
  id: string;
  name: string;
  description: string;
  streakRequired: number;
  icon: string;
  color: string;
  unlockedAt?: string;
}

export interface DailyCourseCount {
  date: string; // YYYY-MM-DD format
  count: number;
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string; // ISO date
  lastLoginDate: string; // ISO date
  hasActivityToday: boolean;
  badges: Badge[];
  totalDaysActive: number;
  totalCoursesInteracted: number;
  dailyCourseCounts: DailyCourseCount[]; // Track courses per day
}

const STORAGE_KEY = 'coursera-streak-data';

// Badge definitions
export const BADGE_TIERS: Omit<Badge, 'unlockedAt'>[] = [
  {
    id: 'streak-3',
    name: 'Getting Started',
    description: 'Complete 3 days of learning in a row',
    streakRequired: 3,
    icon: '🌱',
    color: '#7DEBA3',
  },
  {
    id: 'streak-7',
    name: 'Week Warrior',
    description: 'Maintain a 7-day learning streak',
    streakRequired: 7,
    icon: '🔥',
    color: '#FF6D70',
  },
  {
    id: 'streak-14',
    name: 'Two Week Champion',
    description: 'Keep your streak alive for 14 days',
    streakRequired: 14,
    icon: '⚡',
    color: '#D7FF54',
  },
  {
    id: 'streak-30',
    name: 'Monthly Master',
    description: 'Achieve 30 consecutive days of learning',
    streakRequired: 30,
    icon: '🏆',
    color: '#F59E0B',
  },
  {
    id: 'streak-60',
    name: 'Learning Legend',
    description: 'Incredible! 60 days straight',
    streakRequired: 60,
    icon: '💎',
    color: '#A98BFF',
  },
  {
    id: 'streak-100',
    name: 'Century Scholar',
    description: 'Phenomenal! 100 days of dedication',
    streakRequired: 100,
    icon: '👑',
    color: '#83D6FF',
  },
];

// Get today's date at midnight (for consistent daily comparison)
const getTodayMidnight = (): Date => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

// Get date at midnight from ISO string
const getDateMidnight = (isoString: string): Date => {
  const date = new Date(isoString);
  date.setHours(0, 0, 0, 0);
  return date;
};

// Check if two dates are the same day
export const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

// Check if dates are consecutive days
export const isConsecutiveDay = (lastDate: Date, today: Date): boolean => {
  const oneDayMs = 24 * 60 * 60 * 1000;
  const diffMs = today.getTime() - lastDate.getTime();
  const diffDays = Math.floor(diffMs / oneDayMs);
  return diffDays === 1;
};

// Get days between two dates
export const getDaysBetween = (date1: Date, date2: Date): number => {
  const oneDayMs = 24 * 60 * 60 * 1000;
  const diffMs = Math.abs(date2.getTime() - date1.getTime());
  return Math.floor(diffMs / oneDayMs);
};

// Initialize default streak data
const getDefaultStreakData = (): StreakData => ({
  currentStreak: 0,
  longestStreak: 0,
  lastActivityDate: '',
  lastLoginDate: '',
  hasActivityToday: false,
  badges: [],
  totalDaysActive: 0,
  totalCoursesInteracted: 0,
  dailyCourseCounts: [],
});

// Load streak data from localStorage
export const loadStreakData = (): StreakData => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading streak data:', error);
  }
  return getDefaultStreakData();
};

// Save streak data to localStorage
export const saveStreakData = (data: StreakData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving streak data:', error);
  }
};

// Check and update streak status
export const checkStreakStatus = (data: StreakData): StreakData => {
  const today = getTodayMidnight();
  
  if (!data.lastActivityDate) {
    // First time user
    return data;
  }

  const lastActivity = getDateMidnight(data.lastActivityDate);
  
  // Check if today
  if (isSameDay(lastActivity, today)) {
    // Already counted today
    return data;
  }

  // Check if consecutive day
  if (isConsecutiveDay(lastActivity, today)) {
    // Streak continues, but needs activity today
    return { ...data, hasActivityToday: false };
  }

  // More than 1 day gap - reset streak
  const daysSince = getDaysBetween(lastActivity, today);
  if (daysSince > 1) {
    return {
      ...data,
      currentStreak: 0,
      hasActivityToday: false,
    };
  }

  return data;
};

// Track daily login
export const trackLogin = (): StreakData => {
  let data = loadStreakData();
  const today = new Date().toISOString();
  const todayMidnight = getTodayMidnight();

  // Check streak status first
  data = checkStreakStatus(data);

  // Update last login date
  if (!data.lastLoginDate || !isSameDay(getDateMidnight(data.lastLoginDate), todayMidnight)) {
    data.lastLoginDate = today;
  }

  saveStreakData(data);
  return data;
};

// Track course activity (the key action for streaks)
export const trackCourseActivity = (): { data: StreakData; newBadges: Badge[] } => {
  let data = loadStreakData();
  const today = new Date().toISOString();
  const todayMidnight = getTodayMidnight();
  const todayDateStr = todayMidnight.toISOString().split('T')[0]; // YYYY-MM-DD

  // Check streak status first
  data = checkStreakStatus(data);

  // Initialize dailyCourseCounts if not exists (for backward compatibility)
  if (!data.dailyCourseCounts) {
    data.dailyCourseCounts = [];
  }

  // Update daily course count (always increment, even if clicked multiple times today)
  const todayRecord = data.dailyCourseCounts.find(d => d.date === todayDateStr);
  if (todayRecord) {
    todayRecord.count += 1;
  } else {
    data.dailyCourseCounts.push({ date: todayDateStr, count: 1 });
  }

  // Keep only last 30 days of records
  const thirtyDaysAgo = new Date(todayMidnight);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const thirtyDaysAgoStr = thirtyDaysAgo.toISOString().split('T')[0];
  data.dailyCourseCounts = data.dailyCourseCounts.filter(d => d.date >= thirtyDaysAgoStr);

  // Check if activity already tracked today (for streak counting)
  if (data.lastActivityDate && isSameDay(getDateMidnight(data.lastActivityDate), todayMidnight)) {
    // Don't update streak, but save the course count
    saveStreakData(data);
    return { data, newBadges: [] };
  }

  // Check if this is consecutive day
  const lastActivity = data.lastActivityDate ? getDateMidnight(data.lastActivityDate) : null;
  const isConsecutive = lastActivity ? isConsecutiveDay(lastActivity, todayMidnight) : false;

  // Update streak
  if (!data.lastActivityDate || isConsecutive) {
    data.currentStreak += 1;
  } else {
    // First activity or streak was broken
    data.currentStreak = 1;
  }

  // Update longest streak
  if (data.currentStreak > data.longestStreak) {
    data.longestStreak = data.currentStreak;
  }

  // Update activity tracking
  data.lastActivityDate = today;
  data.hasActivityToday = true;
  data.totalDaysActive += 1;
  data.totalCoursesInteracted += 1;

  // Check for new badges
  const newBadges = checkBadgeUnlocks(data);

  saveStreakData(data);
  return { data, newBadges };
};

// Check and unlock badges
export const checkBadgeUnlocks = (data: StreakData): Badge[] => {
  const newBadges: Badge[] = [];
  const currentStreak = data.currentStreak;
  const unlockedBadgeIds = new Set(data.badges.map((b) => b.id));

  for (const badgeTier of BADGE_TIERS) {
    if (currentStreak >= badgeTier.streakRequired && !unlockedBadgeIds.has(badgeTier.id)) {
      const newBadge: Badge = {
        ...badgeTier,
        unlockedAt: new Date().toISOString(),
      };
      data.badges.push(newBadge);
      newBadges.push(newBadge);
    }
  }

  return newBadges;
};

// Get next badge to unlock
export const getNextBadge = (currentStreak: number): Omit<Badge, 'unlockedAt'> | null => {
  for (const badge of BADGE_TIERS) {
    if (currentStreak < badge.streakRequired) {
      return badge;
    }
  }
  return null;
};

// Get progress to next badge (0-100)
export const getProgressToNextBadge = (currentStreak: number): number => {
  const nextBadge = getNextBadge(currentStreak);
  if (!nextBadge) return 100;

  const previousTier = BADGE_TIERS.filter((b) => b.streakRequired < nextBadge.streakRequired).pop();
  const startStreak = previousTier ? previousTier.streakRequired : 0;
  const targetStreak = nextBadge.streakRequired;

  const progress = ((currentStreak - startStreak) / (targetStreak - startStreak)) * 100;
  return Math.max(0, Math.min(100, progress));
};

// Reset streak (for testing)
export const resetStreakData = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};

// Get all badges with unlock status
export const getAllBadgesWithStatus = (data: StreakData): (Badge & { locked: boolean })[] => {
  const unlockedIds = new Set(data.badges.map((b) => b.id));
  return BADGE_TIERS.map((badge) => ({
    ...badge,
    locked: !unlockedIds.has(badge.id),
    unlockedAt: data.badges.find((b) => b.id === badge.id)?.unlockedAt,
  }));
};
