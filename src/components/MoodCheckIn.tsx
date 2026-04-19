import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Heart, Sparkles } from 'lucide-react';
import { tts } from '../utils/textToSpeech';

interface MoodCheckInProps {
  show: boolean;
  onComplete: (mood: string, energy: number) => void;
  type: 'before' | 'after';
}

const moods = [
  { id: 'happy', emoji: '😊', label: 'Happy', color: 'from-yellow-100 to-yellow-200' },
  { id: 'excited', emoji: '🤩', label: 'Excited', color: 'from-orange-100 to-orange-200' },
  { id: 'calm', emoji: '😌', label: 'Calm', color: 'from-blue-100 to-blue-200' },
  { id: 'okay', emoji: '😐', label: 'Okay', color: 'from-gray-100 to-gray-200' },
  { id: 'tired', emoji: '😴', label: 'Tired', color: 'from-purple-100 to-purple-200' },
  { id: 'sad', emoji: '😢', label: 'Sad', color: 'from-blue-200 to-blue-300' },
  { id: 'worried', emoji: '😰', label: 'Worried', color: 'from-yellow-200 to-yellow-300' },
  { id: 'frustrated', emoji: '😤', label: 'Frustrated', color: 'from-red-100 to-red-200' },
];

const energyLevels = [
  { level: 1, emoji: '🪫', label: 'Very Low', color: 'bg-red-200' },
  { level: 2, emoji: '🔋', label: 'Low', color: 'bg-orange-200' },
  { level: 3, emoji: '🔋', label: 'Medium', color: 'bg-yellow-200' },
  { level: 4, emoji: '🔋', label: 'Good', color: 'bg-green-200' },
  { level: 5, emoji: '⚡', label: 'Super High!', color: 'bg-green-300' },
];

export function MoodCheckIn({ show, onComplete, type }: MoodCheckInProps) {
  const [step, setStep] = useState<'mood' | 'energy'>('mood');
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [selectedEnergy, setSelectedEnergy] = useState<number | null>(null);

  useEffect(() => {
    if (show && tts.isEnabled()) {
      if (type === 'before') {
        tts.speak('How are you feeling right now?');
      } else {
        tts.speak('How do you feel after playing?');
      }
    }
  }, [show, type]);

  const handleMoodSelect = (moodId: string) => {
    setSelectedMood(moodId);
    const mood = moods.find(m => m.id === moodId);
    if (tts.isEnabled() && mood) {
      tts.speak(`You feel ${mood.label}`);
    }
  };

  const handleEnergySelect = (level: number) => {
    setSelectedEnergy(level);
    const energy = energyLevels.find(e => e.level === level);
    if (tts.isEnabled() && energy) {
      tts.speak(`Your energy is ${energy.label}`);
    }
  };

  const handleNext = () => {
    if (step === 'mood' && selectedMood) {
      setStep('energy');
      if (tts.isEnabled()) {
        tts.speak('How much energy do you have?');
      }
    } else if (step === 'energy' && selectedEnergy) {
      onComplete(selectedMood!, selectedEnergy);
      // Reset for next time
      setStep('mood');
      setSelectedMood(null);
      setSelectedEnergy(null);
    }
  };

  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ scale: 0.8, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.8, y: 50 }}
          className="w-full max-w-2xl"
        >
          <Card className="p-8 bg-gradient-to-br from-pink-50 to-purple-50 border-4 border-pink-200">
            {step === 'mood' && (
              <div>
                <div className="text-center mb-6">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                    className="text-6xl mb-4 inline-block"
                  >
                    💭
                  </motion.div>
                  <h2 className="text-gray-800 mb-2">
                    {type === 'before' ? 'How Are You Feeling?' : 'How Do You Feel Now?'}
                  </h2>
                  <p className="text-gray-600">Pick the face that matches your mood</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                  {moods.map((mood) => (
                    <motion.button
                      key={mood.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleMoodSelect(mood.id)}
                      className={`p-6 rounded-2xl border-4 transition-all bg-gradient-to-br ${mood.color} ${
                        selectedMood === mood.id
                          ? 'border-purple-500 shadow-lg scale-105'
                          : 'border-transparent hover:border-purple-300'
                      }`}
                    >
                      <div className="text-5xl mb-2">{mood.emoji}</div>
                      <p className="text-sm font-semibold text-gray-700">{mood.label}</p>
                    </motion.button>
                  ))}
                </div>

                <div className="text-center">
                  <Button
                    onClick={handleNext}
                    disabled={!selectedMood}
                    className="bg-purple-500 hover:bg-purple-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                    <Sparkles className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {step === 'energy' && (
              <div>
                <div className="text-center mb-6">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="text-6xl mb-4 inline-block"
                  >
                    ⚡
                  </motion.div>
                  <h2 className="text-gray-800 mb-2">How Much Energy Do You Have?</h2>
                  <p className="text-gray-600">Pick your energy level</p>
                </div>

                <div className="space-y-3 mb-6">
                  {energyLevels.map((energy) => (
                    <motion.button
                      key={energy.level}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleEnergySelect(energy.level)}
                      className={`w-full p-4 rounded-xl border-4 transition-all ${energy.color} ${
                        selectedEnergy === energy.level
                          ? 'border-purple-500 shadow-lg scale-105'
                          : 'border-transparent hover:border-purple-300'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-4xl">{energy.emoji}</span>
                        <div className="flex-1 text-left">
                          <p className="font-bold text-gray-800">{energy.label}</p>
                          <div className="flex gap-1 mt-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <div
                                key={i}
                                className={`h-2 w-8 rounded-full ${
                                  i < energy.level ? 'bg-purple-500' : 'bg-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>

                <div className="flex gap-3 justify-center">
                  <Button
                    onClick={() => setStep('mood')}
                    variant="outline"
                    className="border-gray-300"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleNext}
                    disabled={!selectedEnergy}
                    className="bg-purple-500 hover:bg-purple-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    Done!
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
