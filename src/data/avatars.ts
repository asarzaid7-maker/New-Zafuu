export interface AvatarOption {
  id: string;
  emoji: string;
  label: {
    en: string;
    ar: string;
  };
  bgGradient: string;
}

export const AVATAR_OPTIONS: AvatarOption[] = [
  {
    id: 'striker',
    emoji: '⚽',
    label: { en: 'Golden Striker', ar: 'الهداف الذهبي' },
    bgGradient: 'from-amber-500 to-yellow-600',
  },
  {
    id: 'tactician',
    emoji: '🧠',
    label: { en: 'The Tactician', ar: 'العبقري التكتيكي' },
    bgGradient: 'from-blue-600 to-indigo-700',
  },
  {
    id: 'legend',
    emoji: '👑',
    label: { en: 'Club Legend', ar: 'الأسطورة الخالدة' },
    bgGradient: 'from-purple-600 to-pink-600',
  },
  {
    id: 'gloves',
    emoji: '🧤',
    label: { en: 'The Wall (Keeper)', ar: 'الحارس الجدار' },
    bgGradient: 'from-emerald-600 to-teal-700',
  },
  {
    id: 'captain',
    emoji: '🎖️',
    label: { en: 'Team Captain', ar: 'قائد الفريق' },
    bgGradient: 'from-red-600 to-rose-700',
  },
  {
    id: 'maestro',
    emoji: '🪄',
    label: { en: 'Midfield Maestro', ar: 'مايسترو الوسط' },
    bgGradient: 'from-cyan-600 to-blue-700',
  },
];
