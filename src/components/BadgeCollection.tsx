import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { X, Sparkles, Trophy, Lock } from 'lucide-react';

interface Badge {
  id: string;
  name: string;
  emoji: string;
  description: string;
  requirement: number; // number of challenges to unlock
  category: 'sensory' | 'cognitive' | 'executive' | 'social' | 'special';
}

export const allBadges: Badge[] = [
  // Sensory Badges
  { id: 'first_challenge', name: 'First Step', emoji: '⭐', description: 'Complete your first challenge!', requirement: 1, category: 'sensory' },
  { id: 'sensory_explorer', name: 'Sensory Explorer', emoji: '🌈', description: 'Complete 3 sensory challenges', requirement: 3, category: 'sensory' },
  { id: 'sensory_master', name: 'Sensory Master', emoji: '🎨', description: 'Complete all sensory challenges', requirement: 5, category: 'sensory' },
  
  // Cognitive Badges
  { id: 'thinker', name: 'Thinker', emoji: '🧠', description: 'Complete your first cognitive challenge', requirement: 4, category: 'cognitive' },
  { id: 'puzzle_solver', name: 'Puzzle Solver', emoji: '🧩', description: 'Complete 3 cognitive challenges', requirement: 7, category: 'cognitive' },
  { id: 'genius', name: 'Genius', emoji: '💡', description: 'Master all cognitive challenges', requirement: 10, category: 'cognitive' },
  
  // Executive Function Badges
  { id: 'planner', name: 'Planner', emoji: '📋', description: 'Complete your first planning challenge', requirement: 8, category: 'executive' },
  { id: 'organizer', name: 'Organizer', emoji: '🗂️', description: 'Complete 3 executive challenges', requirement: 11, category: 'executive' },
  { id: 'executive_pro', name: 'Executive Pro', emoji: '🎯', description: 'Master all executive challenges', requirement: 13, category: 'executive' },
  
  // Social Badges
  { id: 'friendly', name: 'Friendly', emoji: '😊', description: 'Complete your first social challenge', requirement: 11, category: 'social' },
  { id: 'social_star', name: 'Social Star', emoji: '🌟', description: 'Complete 3 social challenges', requirement: 13, category: 'social' },
  { id: 'people_person', name: 'People Person', emoji: '👥', description: 'Master all social challenges', requirement: 15, category: 'social' },
  
  // Special Achievement Badges
  { id: 'early_bird', name: 'Early Bird', emoji: '🐦', description: 'Play before 9 AM', requirement: 0, category: 'special' },
  { id: 'night_owl', name: 'Night Owl', emoji: '🦉', description: 'Play after 6 PM', requirement: 0, category: 'special' },
  { id: 'perfectionist', name: 'Perfectionist', emoji: '💯', description: 'Get 100% on any challenge', requirement: 0, category: 'special' },
  { id: 'streak_keeper', name: 'Streak Keeper', emoji: '🔥', description: 'Play 3 days in a row', requirement: 0, category: 'special' },
  { id: 'champion', name: 'Champion', emoji: '🏆', description: 'Complete all 15 challenges!', requirement: 15, category: 'special' },
  { id: 'super_star', name: 'Super Star', emoji: '⭐', description: 'Earn 10 other badges', requirement: 0, category: 'special' },
  { id: 'rainbow_collector', name: 'Rainbow Collector', emoji: '🌈', description: 'Earn badges from all categories', requirement: 0, category: 'special' },
  { id: 'speed_demon', name: 'Speed Demon', emoji: '⚡', description: 'Complete a challenge in under 2 minutes', requirement: 0, category: 'special' },
];

interface BadgeCollectionProps {
  earnedBadges: string[];
  onClose: () => void;
  completedChallenges?: number;
}

export function BadgeCollection({ earnedBadges, onClose, completedChallenges = 0 }: BadgeCollectionProps) {
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const [filter, setFilter] = useState<'all' | 'earned' | 'locked'>('all');

  const isUnlocked = (badge: Badge) => {
    // Check if badge is earned
    if (earnedBadges.includes(badge.id)) return true;
    
    // Check requirement-based badges
    if (badge.requirement > 0 && completedChallenges >= badge.requirement) return true;
    
    return false;
  };

  const filteredBadges = allBadges.filter(badge => {
    if (filter === 'earned') return earnedBadges.includes(badge.id);
    if (filter === 'locked') return !isUnlocked(badge);
    return true;
  });

  const earnedCount = allBadges.filter(badge => earnedBadges.includes(badge.id)).length;
  const totalBadges = allBadges.length;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        <Card className="p-6 bg-white">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-gray-800 mb-1 flex items-center gap-2">
                <Trophy className="w-6 h-6 text-yellow-500" />
                My Badge Collection
              </h2>
              <p className="text-gray-600">
                {earnedCount} of {totalBadges} badges earned
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="bg-gray-200 rounded-full h-4 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(earnedCount / totalBadges) * 100}%` }}
                className="bg-gradient-to-r from-yellow-400 to-orange-500 h-full"
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
            <p className="text-sm text-gray-600 mt-2 text-center">
              {Math.round((earnedCount / totalBadges) * 100)}% Complete
            </p>
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-2 mb-6">
            <Button
              onClick={() => setFilter('all')}
              variant={filter === 'all' ? 'default' : 'outline'}
              className={filter === 'all' ? 'bg-purple-500 text-white' : ''}
            >
              All ({totalBadges})
            </Button>
            <Button
              onClick={() => setFilter('earned')}
              variant={filter === 'earned' ? 'default' : 'outline'}
              className={filter === 'earned' ? 'bg-green-500 text-white' : ''}
            >
              Earned ({earnedCount})
            </Button>
            <Button
              onClick={() => setFilter('locked')}
              variant={filter === 'locked' ? 'default' : 'outline'}
              className={filter === 'locked' ? 'bg-gray-500 text-white' : ''}
            >
              Locked ({totalBadges - earnedCount})
            </Button>
          </div>

          {/* Badge Grid */}
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredBadges.map((badge) => {
              const unlocked = isUnlocked(badge);
              const earned = earnedBadges.includes(badge.id);
              
              return (
                <motion.button
                  key={badge.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedBadge(badge)}
                  className={`relative p-4 rounded-xl border-4 transition-all ${
                    earned
                      ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-400 shadow-lg'
                      : unlocked
                      ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300'
                      : 'bg-gray-100 border-gray-300 opacity-60'
                  }`}
                >
                  <div className="text-5xl mb-2">
                    {earned ? badge.emoji : unlocked ? badge.emoji : '🔒'}
                  </div>
                  <p className="text-xs font-semibold text-gray-700 line-clamp-2">
                    {badge.name}
                  </p>
                  {earned && (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      className="absolute -top-2 -right-2 bg-yellow-400 rounded-full p-1 border-2 border-white"
                    >
                      <Sparkles className="w-4 h-4 text-white" />
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </div>

          {filteredBadges.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No badges found</p>
            </div>
          )}
        </Card>
      </motion.div>

      {/* Badge Detail Modal */}
      <AnimatePresence>
        {selectedBadge && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-60"
            onClick={() => setSelectedBadge(null)}
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center"
            >
              <div className="text-8xl mb-4">
                {earnedBadges.includes(selectedBadge.id) ? selectedBadge.emoji : '🔒'}
              </div>
              <h3 className="text-gray-800 mb-2">{selectedBadge.name}</h3>
              <p className="text-gray-600 mb-4">{selectedBadge.description}</p>
              
              {!earnedBadges.includes(selectedBadge.id) && selectedBadge.requirement > 0 && (
                <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-blue-800">
                    <Lock className="w-4 h-4 inline mr-1" />
                    Complete {selectedBadge.requirement} challenges to unlock
                  </p>
                  <div className="mt-2 bg-white rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-blue-500 h-full"
                      style={{ width: `${Math.min((completedChallenges / selectedBadge.requirement) * 100, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-blue-600 mt-1">
                    {completedChallenges} / {selectedBadge.requirement}
                  </p>
                </div>
              )}
              
              {earnedBadges.includes(selectedBadge.id) && (
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg p-4 mb-4">
                  <p className="font-semibold flex items-center justify-center gap-2">
                    <Trophy className="w-5 h-5" />
                    Badge Earned!
                  </p>
                </div>
              )}
              
              <Button
                onClick={() => setSelectedBadge(null)}
                className="bg-purple-500 hover:bg-purple-600 text-white"
              >
                Close
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
