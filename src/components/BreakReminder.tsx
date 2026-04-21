import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Coffee, Heart, Wind, Sparkles } from 'lucide-react';
import { tts } from '../utils/textToSpeech';

interface BreakReminderProps {
  show: boolean;
  onTakeBreak: () => void;
  onKeepPlaying: () => void;
  challengesCompleted: number;
}

const breathingExercises = [
  {
    name: 'Balloon Breathing',
    icon: '🎈',
    description: 'Breathe in slowly like filling a balloon, then let it out gently',
    steps: ['Breathe in (1...2...3...4)', 'Hold (1...2)', 'Breathe out (1...2...3...4...5...6)']
  },
  {
    name: 'Rainbow Breathing',
    icon: '🌈',
    description: 'Breathe in colors of the rainbow',
    steps: ['Imagine red...breathe in', 'Imagine blue...breathe in', 'Imagine yellow...breathe out slowly']
  },
  {
    name: 'Star Breathing',
    icon: '⭐',
    description: 'Trace a star with your finger as you breathe',
    steps: ['Up the star...breathe in', 'Down the star...breathe out', 'Keep tracing slowly']
  }
];

const calmingActivities = [
  { name: 'Stretch your arms up high', icon: '🙆', duration: '30 seconds' },
  { name: 'Close your eyes and count to 10', icon: '😌', duration: '30 seconds' },
  { name: 'Get a drink of water', icon: '💧', duration: '1 minute' },
  { name: 'Do 5 jumping jacks', icon: '🤸', duration: '1 minute' },
  { name: 'Look out a window', icon: '🪟', duration: '1 minute' },
  { name: 'Hug yourself tight', icon: '🤗', duration: '30 seconds' },
];

export function BreakReminder({ show, onTakeBreak, onKeepPlaying, challengesCompleted }: BreakReminderProps) {
  const [showBreakActivity, setShowBreakActivity] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<'breathing' | 'calming' | null>(null);
  const [breathingStep, setBreathingStep] = useState(0);
  const [selectedExercise, setSelectedExercise] = useState(0);

  useEffect(() => {
    if (show && tts.isEnabled()) {
      tts.speak('Great job! Time for a quick break?');
    }
  }, [show]);

  const handleTakeBreak = () => {
    setShowBreakActivity(true);
    onTakeBreak();
  };

  const startBreathing = () => {
    setSelectedActivity('breathing');
    setBreathingStep(0);
    if (tts.isEnabled()) {
      tts.speak(`Let's try ${breathingExercises[selectedExercise].name}`);
    }
  };

  const nextBreathingStep = () => {
    const exercise = breathingExercises[selectedExercise];
    if (breathingStep < exercise.steps.length - 1) {
      setBreathingStep(breathingStep + 1);
      if (tts.isEnabled()) {
        tts.speak(exercise.steps[breathingStep + 1]);
      }
    } else {
      if (tts.isEnabled()) {
        tts.speak('Great job! You did it!');
      }
      setSelectedActivity(null);
      setBreathingStep(0);
    }
  };

  const selectCalmingActivity = () => {
    setSelectedActivity('calming');
    const randomActivity = calmingActivities[Math.floor(Math.random() * calmingActivities.length)];
    if (tts.isEnabled()) {
      tts.speak(randomActivity.name);
    }
  };

  if (!show && !showBreakActivity) return null;

  return (
    <AnimatePresence>
      {show && !showBreakActivity && (
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
          >
            <Card className="p-8 max-w-md bg-gradient-to-br from-blue-50 to-purple-50 border-4 border-blue-200">
              <div className="text-center">
                <motion.div
                  animate={{ 
                    rotate: [0, 10, -10, 10, 0],
                    scale: [1, 1.1, 1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 1
                  }}
                  className="text-8xl mb-4"
                >
                  ⏰
                </motion.div>
                
                <h2 className="text-gray-800 mb-3">Great Job!</h2>
                <p className="text-gray-700 text-lg mb-2">
                  You've completed {challengesCompleted} challenges!
                </p>
                <p className="text-gray-600 mb-6">
                  Would you like to take a quick break?
                </p>

                <div className="bg-white rounded-lg p-4 mb-6 border-2 border-purple-200">
                  <p className="text-sm text-gray-600 mb-2">Breaks help your brain:</p>
                  <div className="flex gap-2 justify-center text-3xl">
                    <span title="Rest">😌</span>
                    <span title="Recharge">🔋</span>
                    <span title="Get ready for more">💪</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={handleTakeBreak}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                  >
                    <Coffee className="w-5 h-5 mr-2" />
                    Yes, Break Time!
                  </Button>
                  <Button
                    onClick={onKeepPlaying}
                    variant="outline"
                    className="flex-1 border-gray-300"
                  >
                    Keep Playing
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      )}

      {showBreakActivity && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="w-full max-w-lg"
          >
            <Card className="p-8 bg-white">
              {!selectedActivity && (
                <div className="text-center">
                  <h2 className="text-gray-800 mb-6">Choose a Break Activity</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={startBreathing}
                      className="p-6 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl border-4 border-blue-300 hover:border-blue-400 transition-all"
                    >
                      <div className="text-5xl mb-3">🌬️</div>
                      <h3 className="font-bold text-gray-800 mb-2">Breathing Exercise</h3>
                      <p className="text-sm text-gray-600">Calm & relax</p>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={selectCalmingActivity}
                      className="p-6 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl border-4 border-green-300 hover:border-green-400 transition-all"
                    >
                      <div className="text-5xl mb-3">✨</div>
                      <h3 className="font-bold text-gray-800 mb-2">Quick Activity</h3>
                      <p className="text-sm text-gray-600">Move & refresh</p>
                    </motion.button>
                  </div>

                  <Button
                    onClick={() => setShowBreakActivity(false)}
                    variant="outline"
                    className="border-gray-300"
                  >
                    Back to Games
                  </Button>
                </div>
              )}

              {selectedActivity === 'breathing' && (
                <div className="text-center">
                  <h3 className="text-gray-800 mb-4">
                    {breathingExercises[selectedExercise].name}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {breathingExercises[selectedExercise].description}
                  </p>

                  <motion.div
                    key={breathingStep}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-12 mb-6 border-4 border-blue-200"
                  >
                    <motion.div
                      animate={{ 
                        scale: [1, 1.3, 1],
                      }}
                      transition={{ 
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="text-8xl mb-4"
                    >
                      {breathingExercises[selectedExercise].icon}
                    </motion.div>
                    <p className="text-2xl font-semibold text-gray-800">
                      {breathingExercises[selectedExercise].steps[breathingStep]}
                    </p>
                  </motion.div>

                  <div className="flex gap-3">
                    <Button
                      onClick={nextBreathingStep}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
                    >
                      {breathingStep < breathingExercises[selectedExercise].steps.length - 1 
                        ? 'Next Step' 
                        : 'Finish'
                      }
                    </Button>
                    <Button
                      onClick={() => setSelectedActivity(null)}
                      variant="outline"
                      className="border-gray-300"
                    >
                      Back
                    </Button>
                  </div>
                </div>
              )}

              {selectedActivity === 'calming' && (
                <div className="text-center">
                  <h3 className="text-gray-800 mb-6">Your Break Activity</h3>
                  
                  {calmingActivities.map((activity, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 mb-4 border-4 border-green-200"
                    >
                      <div className="text-6xl mb-3">{activity.icon}</div>
                      <h4 className="font-bold text-gray-800 mb-2 text-xl">{activity.name}</h4>
                      <p className="text-sm text-gray-600">{activity.duration}</p>
                    </motion.div>
                  ))}

                  <Button
                    onClick={() => {
                      setSelectedActivity(null);
                      setShowBreakActivity(false);
                    }}
                    className="bg-green-500 hover:bg-green-600 text-white mt-4"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    I'm Ready to Play Again!
                  </Button>
                </div>
              )}
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
