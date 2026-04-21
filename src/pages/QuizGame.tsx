import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { challenges } from '../components/challenges';
import { ProgressBar } from '../components/ProgressBar';
import { ResultsProfile } from '../components/ResultsProfile';
import { GameData } from '../types/game';
import { AccessibilityMenu } from '../components/AccessibilityMenu';

export default function QuizGame() {
  const navigate = useNavigate();
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [gameData, setGameData] = useState<GameData>({
    sensory: {},
    cognitive: {},
    executiveFunction: {},
    socialInteraction: {},
  });
  const [showResults, setShowResults] = useState(false);
  const [devMode, setDevMode] = useState(false);

  // Safety check for challenge index
  const safeCurrentChallenge = Math.max(0, Math.min(currentChallenge, challenges.length - 1));

  // Check if user is logged in and hasn't completed quiz
  useEffect(() => {
    console.log('QuizGame: useEffect triggered');
    const userStr = localStorage.getItem('currentUser');
    console.log('QuizGame: Current user:', userStr);
    
    if (!userStr) {
      console.log('QuizGame: No user found, redirecting to login');
      navigate('/');
      return;
    }
    
    const user = JSON.parse(userStr);
    console.log('QuizGame: User parsed:', user);
    
    // Allow users to retake the quiz anytime by clicking Challenge Quest
    // No need to block them if they've already completed it
    
    // Check if challenges are loaded
    console.log('QuizGame: Challenges array:', challenges);
    console.log('QuizGame: Challenges length:', challenges?.length);
    console.log('QuizGame: First challenge:', challenges?.[0]);
    console.log('QuizGame: Each challenge type:', challenges.map((c, i) => ({ index: i, type: typeof c, name: c?.name })));
    
    if (challenges && challenges.length > 0) {
      console.log('QuizGame: Challenges loaded successfully, setting isLoading to false');
      setIsLoading(false);
    } else {
      console.error('Challenges not loaded properly:', challenges);
    }
  }, [navigate]);

  // Dev skip function
  const skipQuiz = () => {
    const mockData: GameData = {
      sensory: {
        colorPreference: 'pastel',
        soundPreference: 'gentle',
        speedPreference: 'steady',
      },
      cognitive: {
        patternRecognition: true,
        visualReasoning: true,
        memory: true,
        sequencing: true,
        symbolRecognition: true,
      },
      executiveFunction: {
        ruleSwitching: true,
        multiStep: true,
        impulseControl: true,
        persistence: true,
      },
      socialInteraction: {
        emotionRecognition: true,
        turnTaking: true,
        socialCues: true,
      },
    };

    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      const user = JSON.parse(userStr);
      const updatedUser = {
        ...user,
        quizCompleted: true,
        quizResults: mockData,
        canRetakeQuiz: false,
        completedAt: new Date().toISOString(),
      };
      
      // Update current user
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      
      // Update in users array
      const users = JSON.parse(localStorage.getItem('neuroPlayUsers') || '[]');
      const userIndex = users.findIndex((u: any) => u.username === user.username);
      if (userIndex !== -1) {
        users[userIndex] = updatedUser;
        localStorage.setItem('neuroPlayUsers', JSON.stringify(users));
      }
      
      navigate('/dashboard');
    }
  };

  const handleChallengeComplete = (data: Partial<GameData>) => {
    console.log('Challenge completed:', currentChallenge, 'of', challenges.length - 1);
    
    setGameData((prev) => ({
      sensory: { ...prev.sensory, ...data.sensory },
      cognitive: { ...prev.cognitive, ...data.cognitive },
      executiveFunction: { ...prev.executiveFunction, ...data.executiveFunction },
      socialInteraction: { ...prev.socialInteraction, ...data.socialInteraction },
    }));

    if (currentChallenge < challenges.length - 1) {
      console.log('Moving to next challenge:', currentChallenge + 1);
      setCurrentChallenge((prev) => prev + 1);
    } else {
      console.log('All challenges complete! Showing results...');
      setShowResults(true);
      
      // Save results to user profile
      const userStr = localStorage.getItem('currentUser');
      if (userStr) {
        const user = JSON.parse(userStr);
        const finalGameData = {
          ...gameData,
          sensory: { ...gameData.sensory, ...data.sensory },
          cognitive: { ...gameData.cognitive, ...data.cognitive },
          executiveFunction: { ...gameData.executiveFunction, ...data.executiveFunction },
          socialInteraction: { ...gameData.socialInteraction, ...data.socialInteraction },
        };
        
        const updatedUser = {
          ...user,
          quizCompleted: true,
          quizResults: finalGameData,
          canRetakeQuiz: false,
          completedAt: new Date().toISOString(),
        };
        
        // Update current user
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        
        // Update in users array
        const users = JSON.parse(localStorage.getItem('neuroPlayUsers') || '[]');
        const userIndex = users.findIndex((u: any) => u.username === user.username);
        if (userIndex !== -1) {
          users[userIndex] = updatedUser;
          localStorage.setItem('neuroPlayUsers', JSON.stringify(users));
        }
        
        // Legacy storage for backward compatibility
        localStorage.setItem('gameResults', JSON.stringify(updatedUser.quizResults));
        localStorage.setItem('quizCompleted', 'true');
      }
    }
  };

  const handleRestart = () => {
    navigate('/dashboard');
  };

  const handleRetakeQuiz = () => {
    // This should never be called since we removed the retake button
    // But keeping it for safety
    navigate('/dashboard');
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="inline-block mb-4"
          >
            <div className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full" />
          </motion.div>
          <p className="text-gray-700 text-lg">Loading your adventure...</p>
        </div>
      </div>
    );
  }

  const CurrentChallengeComponent = challenges[safeCurrentChallenge];

  if (!CurrentChallengeComponent) {
    console.error('Challenge not found at index:', currentChallenge);
    console.error('Total challenges:', challenges.length);
    console.error('Challenges array:', challenges);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-xl p-8 text-center max-w-md">
          <p className="text-red-600 text-lg mb-2">Challenge Not Found</p>
          <p className="text-gray-600 text-sm mb-4">
            Looking for challenge {currentChallenge + 1} of {challenges.length}
          </p>
          <p className="text-gray-500 text-xs mb-4">
            This is a technical error. Please go back to the dashboard.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (showResults) {
    return <ResultsProfile gameData={gameData} onRestart={handleRestart} onRetake={handleRetakeQuiz} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Dev Skip Button */}
        <div className="fixed top-4 right-4 z-50">
          {!devMode ? (
            <button
              onClick={() => setDevMode(true)}
              className="bg-gray-800 text-white px-3 py-1 rounded text-xs opacity-20 hover:opacity-100 transition-opacity"
            >
              DEV
            </button>
          ) : (
            <div className="bg-gray-800 text-white p-3 rounded-lg shadow-lg">
              <p className="text-xs mb-2 font-semibold">Developer Mode</p>
              <button
                onClick={skipQuiz}
                className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded text-sm mb-2"
              >
                ⚡ Skip Quiz
              </button>
              <button
                onClick={() => setDevMode(false)}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-1 rounded text-xs"
              >
                Close
              </button>
            </div>
          )}
        </div>

        <ProgressBar current={currentChallenge + 1} total={challenges.length} />
        
        <AnimatePresence mode="wait">
          <motion.div
            key={currentChallenge}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
          >
            <CurrentChallengeComponent 
              onComplete={handleChallengeComplete}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Accessibility Menu */}
      <AccessibilityMenu />
    </div>
  );
}