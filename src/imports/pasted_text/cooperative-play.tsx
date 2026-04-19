import { useState } from "react";
import { Link } from "react-router";
import { Home, Star, Cpu, Users } from "lucide-react";

const activities = [
  {
    id: 1,
    title: "Build a Tower Together",
    description: "Take turns adding blocks to build the tallest tower!",
    emoji: "🏗️",
    steps: [
      "Player 1 adds a block",
      "Player 2 adds a block",
      "Keep taking turns!",
      "Celebrate together!"
    ],
  },
  {
    id: 2,
    title: "Complete the Picture",
    description: "Work together to finish the puzzle!",
    emoji: "🧩",
    steps: [
      "Find a puzzle piece",
      "Help each other place it",
      "Take turns choosing pieces",
      "High five when done!"
    ],
  },
  {
    id: 3,
    title: "Garden Adventure",
    description: "Plant flowers together in the garden!",
    emoji: "🌻",
    steps: [
      "Choose a flower color",
      "Plant it in the garden",
      "Water it together",
      "Watch it grow!"
    ],
  },
];

type GameMode = "friend" | "computer";

export default function CooperativePlay() {
  const [selectedActivity, setSelectedActivity] = useState<number | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [gameMode, setGameMode] = useState<GameMode | null>(null);
  const [isComputerTurn, setIsComputerTurn] = useState(false);

  const activity = selectedActivity !== null 
    ? activities.find(a => a.id === selectedActivity) 
    : null;

  const handleStepComplete = () => {
    if (activity && currentStep < activity.steps.length - 1) {
      setCompletedSteps([...completedSteps, currentStep]);
      setCurrentStep(currentStep + 1);
      
      // If computer mode, simulate computer's turn
      if (gameMode === "computer" && currentStep + 1 < activity.steps.length) {
        setIsComputerTurn(true);
        setTimeout(() => {
          setCompletedSteps(prev => [...prev, currentStep + 1]);
          setCurrentStep(prev => prev + 1);
          setIsComputerTurn(false);
        }, 2000);
      }
    } else if (activity) {
      // Activity complete
      setCompletedSteps([...completedSteps, currentStep]);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setCompletedSteps([]);
  };

  const handleBack = () => {
    setSelectedActivity(null);
    setGameMode(null);
    setCurrentStep(0);
    setCompletedSteps([]);
    setIsComputerTurn(false);
  };

  const handleSelectActivity = (activityId: number) => {
    setSelectedActivity(activityId);
  };

  const handleSelectMode = (mode: GameMode) => {
    setGameMode(mode);
  };

  const isActivityComplete = activity && completedSteps.length === activity.steps.length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-green-100 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link to="/">
            <button className="bg-white p-3 rounded-full shadow-lg">
              <Home className="w-6 h-6 text-gray-700" />
            </button>
          </Link>
          <h1 className="text-3xl font-bold text-blue-600">Play Together</h1>
          <div className="w-12"></div>
        </div>

        {!selectedActivity ? (
          /* Activity Selection */
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
              Choose an Activity
            </h2>
            {activities.map((activity) => (
              <button
                key={activity.id}
                onClick={() => handleSelectActivity(activity.id)}
                className="w-full bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 text-left"
              >
                <div className="flex items-center space-x-4">
                  <div className="text-6xl">{activity.emoji}</div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-800">{activity.title}</h3>
                    <p className="text-gray-600 mt-1">{activity.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : !gameMode ? (
          /* Mode Selection */
          <div className="space-y-4">
            <button
              onClick={handleBack}
              className="bg-white px-6 py-3 rounded-full shadow-lg text-gray-700 font-bold mb-4"
            >
              ← Back to Activities
            </button>
            
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
              Who will you play with?
            </h2>

            <button
              onClick={() => handleSelectMode("friend")}
              className="w-full bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            >
              <div className="flex flex-col items-center space-y-4">
                <Users className="w-20 h-20 text-blue-600" />
                <h3 className="text-3xl font-bold text-gray-800">Play with a Friend</h3>
                <p className="text-gray-600">Take turns together!</p>
              </div>
            </button>

            <button
              onClick={() => handleSelectMode("computer")}
              className="w-full bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            >
              <div className="flex flex-col items-center space-y-4">
                <Cpu className="w-20 h-20 text-purple-600" />
                <h3 className="text-3xl font-bold text-gray-800">Play with Computer</h3>
                <p className="text-gray-600">The computer will help you practice!</p>
              </div>
            </button>
          </div>
        ) : (
          /* Activity Steps */
          <div className="space-y-6">
            <button
              onClick={handleBack}
              className="bg-white px-6 py-3 rounded-full shadow-lg text-gray-700 font-bold"
            >
              ← Back to Activities
            </button>

            <div className="bg-white rounded-3xl p-8 shadow-xl">
              <div className="text-center space-y-6">
                <div className="text-8xl">{activity.emoji}</div>
                <h2 className="text-3xl font-bold text-gray-800">{activity.title}</h2>
                
                {/* Show playing mode */}
                <div className="flex justify-center items-center space-x-2 text-gray-600">
                  {gameMode === "computer" ? (
                    <>
                      <Cpu className="w-5 h-5" />
                      <span>Playing with Computer</span>
                    </>
                  ) : (
                    <>
                      <Users className="w-5 h-5" />
                      <span>Playing with Friend</span>
                    </>
                  )}
                </div>

                {!isActivityComplete ? (
                  <>
                    {/* Progress */}
                    <div className="flex justify-center space-x-2">
                      {activity.steps.map((_, index) => (
                        <div
                          key={index}
                          className={`w-4 h-4 rounded-full ${
                            completedSteps.includes(index)
                              ? "bg-green-500"
                              : index === currentStep
                              ? "bg-blue-500"
                              : "bg-gray-300"
                          }`}
                        />
                      ))}
                    </div>

                    {/* Current Step */}
                    <div className="bg-blue-50 rounded-2xl p-8">
                      <p className="text-sm text-gray-600 mb-2">Step {currentStep + 1}</p>
                      <p className="text-3xl font-bold text-blue-600">
                        {activity.steps[currentStep]}
                      </p>
                    </div>

                    {/* Computer Turn Indicator */}
                    {isComputerTurn && (
                      <div className="bg-purple-100 rounded-2xl p-6 border-4 border-purple-400">
                        <Cpu className="w-12 h-12 text-purple-600 mx-auto mb-2 animate-pulse" />
                        <p className="text-2xl font-bold text-gray-800">
                          Computer's turn...
                        </p>
                        <p className="text-gray-600 mt-2">Watch and wait!</p>
                      </div>
                    )}

                    {/* Complete Step Button */}
                    {!isComputerTurn && (
                      <button
                        onClick={handleStepComplete}
                        className="bg-green-500 hover:bg-green-600 text-white rounded-2xl px-12 py-6 text-2xl font-bold shadow-lg transition-all transform hover:scale-105"
                      >
                        ✓ Done!
                      </button>
                    )}
                  </>
                ) : (
                  /* Activity Complete */
                  <>
                    <div className="text-8xl">🎉</div>
                    <h3 className="text-4xl font-bold text-green-600">
                      Amazing Teamwork!
                    </h3>
                    <p className="text-xl text-gray-700">
                      You worked together perfectly!
                    </p>
                    <div className="flex justify-center space-x-4">
                      <button
                        onClick={handleReset}
                        className="bg-blue-500 hover:bg-blue-600 text-white rounded-2xl px-8 py-4 text-xl font-bold shadow-lg transition-all"
                      >
                        Play Again
                      </button>
                      <button
                        onClick={handleBack}
                        className="bg-purple-500 hover:bg-purple-600 text-white rounded-2xl px-8 py-4 text-xl font-bold shadow-lg transition-all"
                      >
                        New Activity
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}