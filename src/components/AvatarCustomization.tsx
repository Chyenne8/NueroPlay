import { motion } from 'motion/react';
import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Sparkles, Check } from 'lucide-react';

interface AvatarCustomizationProps {
  currentAvatar: {
    character: string;
    accessory: string;
    background: string;
  };
  onSave: (avatar: { character: string; accessory: string; background: string }) => void;
  unlockedAccessories?: string[];
  onClose?: () => void;
}

const characters = [
  { id: 'cat', emoji: '🐱', name: 'Kitty', color: 'from-orange-100 to-orange-200' },
  { id: 'dog', emoji: '🐶', name: 'Puppy', color: 'from-amber-100 to-amber-200' },
  { id: 'bear', emoji: '🐻', name: 'Bear', color: 'from-brown-100 to-brown-200' },
  { id: 'rabbit', emoji: '🐰', name: 'Bunny', color: 'from-pink-100 to-pink-200' },
  { id: 'fox', emoji: '🦊', name: 'Fox', color: 'from-orange-100 to-red-200' },
  { id: 'panda', emoji: '🐼', name: 'Panda', color: 'from-gray-100 to-gray-200' },
  { id: 'koala', emoji: '🐨', name: 'Koala', color: 'from-gray-100 to-blue-200' },
  { id: 'lion', emoji: '🦁', name: 'Lion', color: 'from-yellow-100 to-orange-200' },
  { id: 'unicorn', emoji: '🦄', name: 'Unicorn', color: 'from-purple-100 to-pink-200' },
  { id: 'dragon', emoji: '🐉', name: 'Dragon', color: 'from-green-100 to-blue-200' },
  { id: 'dino', emoji: '🦕', name: 'Dino', color: 'from-green-100 to-green-200' },
  { id: 'penguin', emoji: '🐧', name: 'Penguin', color: 'from-blue-100 to-gray-200' },
];

const accessories = [
  { id: 'none', emoji: '', name: 'None', unlock: 0 },
  { id: 'crown', emoji: '👑', name: 'Crown', unlock: 0 },
  { id: 'star', emoji: '⭐', name: 'Star', unlock: 5 },
  { id: 'rainbow', emoji: '🌈', name: 'Rainbow', unlock: 5 },
  { id: 'sparkle', emoji: '✨', name: 'Sparkles', unlock: 10 },
  { id: 'heart', emoji: '💝', name: 'Heart', unlock: 10 },
  { id: 'trophy', emoji: '🏆', name: 'Trophy', unlock: 15 },
  { id: 'medal', emoji: '🏅', name: 'Medal', unlock: 15 },
];

const backgrounds = [
  { id: 'pastel', name: 'Pastel', gradient: 'from-pink-100 via-purple-100 to-blue-100' },
  { id: 'ocean', name: 'Ocean', gradient: 'from-blue-200 via-cyan-200 to-teal-200' },
  { id: 'forest', name: 'Forest', gradient: 'from-green-200 via-emerald-200 to-lime-200' },
  { id: 'sunset', name: 'Sunset', gradient: 'from-orange-200 via-pink-200 to-purple-200' },
  { id: 'rainbow', name: 'Rainbow', gradient: 'from-red-200 via-yellow-200 to-green-200' },
  { id: 'galaxy', name: 'Galaxy', gradient: 'from-purple-300 via-blue-300 to-indigo-300' },
];

export function AvatarCustomization({ currentAvatar, onSave, unlockedAccessories = [], onClose }: AvatarCustomizationProps) {
  const [character, setCharacter] = useState(currentAvatar.character || 'cat');
  const [accessory, setAccessory] = useState(currentAvatar.accessory || 'none');
  const [background, setBackground] = useState(currentAvatar.background || 'pastel');

  const selectedCharacter = characters.find(c => c.id === character) || characters[0];
  const selectedAccessory = accessories.find(a => a.id === accessory) || accessories[0];
  const selectedBackground = backgrounds.find(b => b.id === background) || backgrounds[0];

  // Calculate completed challenges from localStorage
  const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
  const completedChallenges = user.quizCompleted ? 15 : 0;

  const handleSave = () => {
    onSave({ character, accessory, background });
  };

  const isAccessoryUnlocked = (item: typeof accessories[0]) => {
    return item.unlock === 0 || completedChallenges >= item.unlock;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        <Card className="p-6 bg-white">
          <div className="text-center mb-6">
            <h2 className="text-gray-800 mb-2 flex items-center justify-center gap-2">
              <Sparkles className="w-6 h-6 text-purple-500" />
              Create Your Character
            </h2>
            <p className="text-gray-600">Pick your favorite character, accessory, and background!</p>
          </div>

          {/* Preview */}
          <div className="mb-8">
            <Card className={`p-8 bg-gradient-to-br ${selectedBackground.gradient} border-4 border-purple-200`}>
              <div className="text-center">
                <motion.div
                  key={`${character}-${accessory}`}
                  initial={{ scale: 0.8, rotate: -10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  className="text-9xl mb-4 inline-block relative"
                >
                  <span>{selectedCharacter.emoji}</span>
                  {selectedAccessory.emoji && (
                    <motion.span
                      initial={{ y: -20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      className="absolute -top-8 -right-8 text-6xl"
                    >
                      {selectedAccessory.emoji}
                    </motion.span>
                  )}
                </motion.div>
                <p className="text-gray-700 font-semibold text-xl">
                  {selectedCharacter.name}
                  {selectedAccessory.id !== 'none' && ` with ${selectedAccessory.name}`}
                </p>
              </div>
            </Card>
          </div>

          {/* Character Selection */}
          <div className="mb-6">
            <h3 className="text-gray-800 mb-3 font-semibold">Choose Your Character</h3>
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {characters.map((char) => (
                <motion.button
                  key={char.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCharacter(char.id)}
                  className={`bg-gradient-to-br ${char.color} rounded-xl p-4 border-4 transition-all relative ${
                    character === char.id
                      ? 'border-purple-500 shadow-lg'
                      : 'border-transparent hover:border-purple-300'
                  }`}
                >
                  <div className="text-5xl mb-2">{char.emoji}</div>
                  <p className="text-xs font-semibold text-gray-700">{char.name}</p>
                  {character === char.id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-1 right-1 bg-purple-500 rounded-full p-1"
                    >
                      <Check className="w-3 h-3 text-white" />
                    </motion.div>
                  )}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Accessory Selection */}
          <div className="mb-6">
            <h3 className="text-gray-800 mb-3 font-semibold flex items-center gap-2">
              Accessories
              <span className="text-sm text-gray-500 font-normal">
                (Unlock more by completing challenges!)
              </span>
            </h3>
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-3">
              {accessories.map((acc) => {
                const unlocked = isAccessoryUnlocked(acc);
                return (
                  <motion.button
                    key={acc.id}
                    whileHover={{ scale: unlocked ? 1.05 : 1 }}
                    whileTap={{ scale: unlocked ? 0.95 : 1 }}
                    onClick={() => unlocked && setAccessory(acc.id)}
                    disabled={!unlocked}
                    className={`bg-gradient-to-br rounded-xl p-4 border-4 transition-all relative ${
                      unlocked
                        ? `from-yellow-50 to-yellow-100 ${
                            accessory === acc.id
                              ? 'border-purple-500 shadow-lg'
                              : 'border-transparent hover:border-purple-300'
                          }`
                        : 'from-gray-100 to-gray-200 border-gray-300 opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <div className="text-4xl mb-1">
                      {unlocked ? acc.emoji || '⭕' : '🔒'}
                    </div>
                    <p className="text-xs font-semibold text-gray-700">{acc.name}</p>
                    {!unlocked && (
                      <p className="text-[10px] text-gray-500 mt-1">{acc.unlock} challenges</p>
                    )}
                    {accessory === acc.id && unlocked && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-1 right-1 bg-purple-500 rounded-full p-1"
                      >
                        <Check className="w-3 h-3 text-white" />
                      </motion.div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Background Selection */}
          <div className="mb-6">
            <h3 className="text-gray-800 mb-3 font-semibold">Choose Background</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {backgrounds.map((bg) => (
                <motion.button
                  key={bg.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setBackground(bg.id)}
                  className={`bg-gradient-to-br ${bg.gradient} rounded-xl p-6 border-4 transition-all relative ${
                    background === bg.id
                      ? 'border-purple-500 shadow-lg'
                      : 'border-gray-300 hover:border-purple-300'
                  }`}
                >
                  <p className="text-xs font-semibold text-gray-700">{bg.name}</p>
                  {background === bg.id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-1 right-1 bg-purple-500 rounded-full p-1"
                    >
                      <Check className="w-3 h-3 text-white" />
                    </motion.div>
                  )}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end">
            {onClose && (
              <Button
                onClick={onClose}
                variant="outline"
                className="border-gray-300 text-gray-700"
              >
                Cancel
              </Button>
            )}
            <Button
              onClick={handleSave}
              className="bg-purple-500 hover:bg-purple-600 text-white"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Save Character
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
