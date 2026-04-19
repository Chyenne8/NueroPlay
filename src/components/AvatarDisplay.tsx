import { motion } from 'motion/react';

interface AvatarDisplayProps {
  avatar: {
    character: string;
    accessory: string;
    background: string;
  };
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showBackground?: boolean;
  animate?: boolean;
}

const characters: Record<string, string> = {
  cat: '🐱',
  dog: '🐶',
  bear: '🐻',
  rabbit: '🐰',
  fox: '🦊',
  panda: '🐼',
  koala: '🐨',
  lion: '🦁',
  unicorn: '🦄',
  dragon: '🐉',
  dino: '🦕',
  penguin: '🐧',
};

const accessories: Record<string, string> = {
  none: '',
  crown: '👑',
  star: '⭐',
  rainbow: '🌈',
  sparkle: '✨',
  heart: '💝',
  trophy: '🏆',
  medal: '🏅',
};

const backgrounds: Record<string, string> = {
  pastel: 'from-pink-100 via-purple-100 to-blue-100',
  ocean: 'from-blue-200 via-cyan-200 to-teal-200',
  forest: 'from-green-200 via-emerald-200 to-lime-200',
  sunset: 'from-orange-200 via-pink-200 to-purple-200',
  rainbow: 'from-red-200 via-yellow-200 to-green-200',
  galaxy: 'from-purple-300 via-blue-300 to-indigo-300',
};

const sizeClasses = {
  sm: {
    container: 'w-16 h-16 p-2',
    character: 'text-3xl',
    accessory: 'text-xl -top-2 -right-2',
  },
  md: {
    container: 'w-24 h-24 p-3',
    character: 'text-5xl',
    accessory: 'text-3xl -top-3 -right-3',
  },
  lg: {
    container: 'w-32 h-32 p-4',
    character: 'text-7xl',
    accessory: 'text-4xl -top-4 -right-4',
  },
  xl: {
    container: 'w-48 h-48 p-6',
    character: 'text-9xl',
    accessory: 'text-6xl -top-6 -right-6',
  },
};

export function AvatarDisplay({ 
  avatar, 
  size = 'md', 
  showBackground = true,
  animate = false 
}: AvatarDisplayProps) {
  const characterEmoji = characters[avatar.character] || '🐱';
  const accessoryEmoji = accessories[avatar.accessory] || '';
  const bgGradient = backgrounds[avatar.background] || backgrounds.pastel;
  const sizes = sizeClasses[size];

  const content = (
    <div className="relative inline-block">
      <span className={sizes.character}>{characterEmoji}</span>
      {accessoryEmoji && (
        <span className={`absolute ${sizes.accessory}`}>
          {accessoryEmoji}
        </span>
      )}
    </div>
  );

  if (showBackground) {
    return (
      <motion.div
        whileHover={animate ? { scale: 1.05 } : {}}
        className={`${sizes.container} bg-gradient-to-br ${bgGradient} rounded-full flex items-center justify-center border-4 border-white shadow-lg`}
      >
        {content}
      </motion.div>
    );
  }

  return content;
}
