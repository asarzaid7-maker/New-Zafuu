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
    label: { en: 'No. 9 Striker', ar: 'المهاجم رقم 9' },
    bgGradient: 'from-amber-500 to-red-600',
  },
  {
    id: 'playmaker',
    emoji: '🎯',
    label: { en: 'The Maestro', ar: 'المايسترو رقم 10' },
    bgGradient: 'from-blue-500 to-indigo-600',
  },
  {
    id: 'keeper',
    emoji: '🧤',
    label: { en: 'The Goalkeeper', ar: 'حامي العرين' },
    bgGradient: 'from-emerald-500 to-teal-700',
  },
  {
    id: 'captain',
    emoji: '👑',
    label: { en: 'El Capitano', ar: 'الكابيتانو' },
    bgGradient: 'from-yellow-400 to-amber-600',
  },
  {
    id: 'tactician',
    emoji: '📋',
    label: { en: 'The Head Coach', ar: 'المدرب التكتيكي' },
    bgGradient: 'from-purple-500 to-indigo-700',
  },
  {
    id: 'legend',
    emoji: '🏆',
    label: { en: 'Trophy Hunter', ar: 'صائد الكؤوس' },
    bgGradient: 'from-amber-400 to-orange-600',
  },
  {
    id: 'speedster',
    emoji: '⚡',
    label: { en: 'Pacey Winger', ar: 'الجناح السريع' },
    bgGradient: 'from-cyan-400 to-blue-600',
  },
  {
    id: 'ballondor',
    emoji: '⭐',
    label: { en: 'Ballon d’Or', ar: 'الكرة الذهبية' },
    bgGradient: 'from-yellow-300 to-yellow-600',
  },
];
