// © Konectr 2026. All rights reserved.
// Proprietary and confidential.

// Every value here mirrors the shipped app. Sources:
//   tiers            → lib/features/gamification/enums/profile_tier.dart
//   badge families   → lib/features/gamification/enums/badge_enums.dart + the badges table
//   streaks / flames → lib/features/gamification/constants/streak_constants.dart
//   daily rewards    → lib/features/gamification/constants/reward_constants.dart
// If you change copy here, check it against those files first.

export const tiers = [
  {
    name: "Basic",
    emoji: "⭐",
    color: "#9CA3AF",
    activitiesRequired: 0,
    description: "Where everyone starts. Attend activities to climb.",
    perks: ["Start activities", "Join meetups", "Simple profile frame"],
  },
  {
    name: "Bronze",
    emoji: "🥉",
    color: "#CD7F32",
    activitiesRequired: 10,
    description: "Ten activities in. You're a regular now.",
    perks: ["Bronze profile frame", "Thicker frame border"],
  },
  {
    name: "Silver",
    emoji: "🥈",
    color: "#C0C0C0",
    activitiesRequired: 50,
    description: "Fifty real meetups. People recognise your face.",
    perks: ["Silver profile frame"],
  },
  {
    name: "Gold",
    emoji: "🥇",
    color: "#FFD700",
    activitiesRequired: 100,
    description: "A hundred activities. You show up, consistently.",
    perks: ["Gold gradient frame"],
  },
  {
    name: "Platinum",
    emoji: "💎",
    color: "#E5E4E2",
    activitiesRequired: 200,
    description: "Two hundred activities. Rare company.",
    perks: ["Platinum gradient frame", "Animated shimmer"],
  },
  {
    name: "Legendary",
    emoji: "🔥",
    color: "#FF774D",
    activitiesRequired: 300,
    description: "Three hundred activities. A pillar of the community.",
    perks: ["Orange gradient frame", "Animated pulse", "Glow effect"],
  },
];

export const badgeCategories = [
  {
    emoji: "🤝",
    name: "Social",
    description: "Meet new people and build out your Circle",
    example: "First Contact",
  },
  {
    emoji: "🗺️",
    name: "Explorer",
    description: "Discover and revisit venues around the city",
    example: "Venue Hopper",
  },
  {
    emoji: "🎯",
    name: "Activity",
    description: "Turn up to plans",
    example: "First Activity",
  },
  {
    emoji: "🔥",
    name: "Streak",
    description: "Stay active day after day without breaking the chain",
    example: "Monthly Master",
  },
  {
    emoji: "🚀",
    name: "Starter",
    description: "Start activities and bring people together",
    example: "First Start",
  },
  {
    emoji: "✨",
    name: "Special",
    description: "Earned once, for being here early or being invited in",
    example: "Early Adopter",
  },
];

export const badgeRarities = [
  { name: "Common", color: "#9CA3AF" },
  { name: "Uncommon", color: "#3B82F6" },
  { name: "Rare", color: "#8B5CF6" },
  { name: "Epic", color: "#F59E0B" },
  { name: "Legendary", color: "#EF4444" },
];

export const streakMilestones = [
  { days: 3, label: "3 Days", color: "#F59E0B", description: "Streak ignited" },
  { days: 7, label: "1 Week", color: "#F97316", description: "Weekly Warrior — earns a shield" },
  { days: 14, label: "2 Weeks", color: "#3B82F6", description: "Fortnight Force" },
  { days: 30, label: "1 Month", color: "#9333EA", description: "Monthly Master — earns a shield" },
];

export const flamePhases = [
  { range: "0-13 days", color: "#FF774D", label: "Orange" },
  { range: "14-29 days", color: "#3B82F6", label: "Blue" },
  { range: "30-99 days", color: "#9333EA", label: "Purple" },
  { range: "100+ days", color: "#FFD700", label: "Gold" },
];

export const dailyRewardsHighlights = [
  { day: 1, xp: 10, emoji: "🎁", label: "Welcome Bonus" },
  { day: 3, xp: 15, emoji: "⚡", label: "Getting Started" },
  { day: 7, xp: 50, emoji: "🔥", label: "Week One", special: true },
  { day: 14, xp: 100, emoji: "💎", label: "Two Weeks", special: true },
  { day: 21, xp: 40, emoji: "🏆", label: "Three Weeks" },
  { day: 30, xp: 200, emoji: "👑", label: "Full Cycle", special: true },
];
