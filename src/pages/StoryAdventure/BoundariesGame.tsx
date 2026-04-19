import { useState } from "react";
import { Link } from "react-router";
import { Home, ThumbsUp, ThumbsDown, RefreshCw } from "lucide-react";

// Character components
const Character = ({ emoji, position }: { emoji: string; position: "left" | "right" }) => (
  <div className={`flex flex-col items-center ${position === "right" ? "order-2" : ""}`}>
    <div className="text-6xl mb-2">{emoji}</div>
  </div>
);

const scenarios = [
  {
    id: 1,
    character1: "👧",
    character2: "👦",
    situation: "Maya wants to play with Alex's toy car.",
    question: "Should Maya take the toy without asking?",
    answer: "no",
    explanation: "NO! Maya should ask Alex first. We say: 'Can I play with your car, please?'",
    correctPhrase: "Can I play with your car?",
  },
  {
    id: 2,
    character1: "👦",
    character2: "👧",
    situation: "Sam wants to give Emma a hug.",
    question: "Should Sam ask before hugging Emma?",
    answer: "yes",
    explanation: "YES! Sam should ask: 'Can I give you a hug?' Emma can say YES or NO.",
    correctPhrase: "Can I give you a hug?",
  },
  {
    id: 3,
    character1: "👧",
    character2: "👨‍🏫",
    situation: "Mia wants to use the computer. The teacher is using it.",
    question: "Should Mia wait for her turn?",
    answer: "yes",
    explanation: "YES! Mia should wait and say: 'May I use the computer when you're done?'",
    correctPhrase: "May I use it next?",
  },
  {
    id: 4,
    character1: "👦",
    character2: "👧",
    situation: "Leo is playing a game. His friend wants him to stop and play with her.",
    question: "Is it okay for Leo to say NO and keep playing?",
    answer: "yes",
    explanation: "YES! Leo can say: 'No thank you, I want to finish my game first.'",
    correctPhrase: "No thank you, I'm busy",
  },
  {
    id: 5,
    character1: "👧",
    character2: "👦",
    situation: "Zoe sees Ben eating cookies. She wants one too.",
    question: "Should Zoe just take a cookie?",
    answer: "no",
    explanation: "NO! Zoe should ask: 'May I have a cookie, please?'",
    correctPhrase: "May I have a cookie?",
  },
  {
    id: 6,
    character1: "👦",
    character2: "👧",
    situation: "Someone is touching Jake and he doesn't like it.",
    question: "Can Jake say 'Stop, please'?",
    answer: "yes",
    explanation: "YES! Jake can always say: 'Stop, please. I don't like that.'",
    correctPhrase: "Stop, please",
  },
  {
    id: 7,
    character1: "👧",
    character2: "👦",
    situation: "Lily wants to join the game her friends are playing.",
    question: "Should Lily ask to join?",
    answer: "yes",
    explanation: "YES! Lily should say: 'Can I play too, please?'",
    correctPhrase: "Can I play too?",
  },
  {
    id: 8,
    character1: "👦",
    character2: "👧",
    situation: "Tom finished his snack. He wants his sister's snack too.",
    question: "Can Tom take his sister's snack?",
    answer: "no",
    explanation: "NO! Tom needs to ask: 'Can I have some of your snack?' She might say YES or NO.",
    correctPhrase: "Can I have some?",
  },
];

export default function BoundariesGame() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [showPhrase, setShowPhrase] = useState(false);

  const currentScenario = scenarios[currentIndex];

  const handleAnswer = (answer: "yes" | "no") => {
    const correct = answer === currentScenario.answer;
    setIsCorrect(correct);
    setShowResult(true);
    if (correct) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    setShowResult(false);
    setShowPhrase(false);
    if (currentIndex < scenarios.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Game complete
      setCurrentIndex(0);
      setScore(0);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setShowResult(false);
    setShowPhrase(false);
    setScore(0);
  };

  const handleShowPhrase = () => {
    setShowPhrase(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 to-blue-100 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link to="/kid-dashboard">
            <button className="bg-white p-3 rounded-full shadow-lg">
              <Home className="w-6 h-6 text-gray-700" />
            </button>
          </Link>
          <div className="bg-white px-6 py-3 rounded-full shadow-lg">
            <span className="text-2xl font-bold text-purple-600">
              Score: {score} / {scenarios.length}
            </span>
          </div>
          <button onClick={handleRestart} className="bg-white p-3 rounded-full shadow-lg">
            <RefreshCw className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl p-8 shadow-xl">
          {!showResult ? (
            <div className="space-y-8">
              {/* Characters */}
              <div className="flex justify-around items-center">
                <Character emoji={currentScenario.character1} position="left" />
                <div className="text-4xl">💬</div>
                <Character emoji={currentScenario.character2} position="right" />
              </div>

              {/* Situation */}
              <div className="bg-blue-50 rounded-2xl p-6">
                <p className="text-xl text-gray-700 text-center leading-relaxed">
                  {currentScenario.situation}
                </p>
              </div>

              {/* Question */}
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  {currentScenario.question}
                </h2>
                <p className="text-gray-600">
                  Question {currentIndex + 1} of {scenarios.length}
                </p>
              </div>

              {/* Answer Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleAnswer("yes")}
                  className="bg-green-400 hover:bg-green-500 text-white rounded-2xl p-8 text-3xl font-bold shadow-lg transition-all transform hover:scale-105 flex flex-col items-center space-y-2"
                >
                  <ThumbsUp className="w-16 h-16" />
                  <span>YES</span>
                </button>
                <button
                  onClick={() => handleAnswer("no")}
                  className="bg-red-400 hover:bg-red-500 text-white rounded-2xl p-8 text-3xl font-bold shadow-lg transition-all transform hover:scale-105 flex flex-col items-center space-y-2"
                >
                  <ThumbsDown className="w-16 h-16" />
                  <span>NO</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-8 text-center">
              {/* Result */}
              <div className="text-8xl">
                {isCorrect ? "🎉" : "🤔"}
              </div>
              <h2 className={`text-4xl font-bold ${isCorrect ? "text-green-600" : "text-orange-600"}`}>
                {isCorrect ? "Great Job!" : "Let's Learn!"}
              </h2>
              
              {/* Explanation */}
              <div className="bg-purple-50 rounded-2xl p-6">
                <p className="text-2xl text-gray-700 leading-relaxed">
                  {currentScenario.explanation}
                </p>
              </div>

              {/* Practice Phrase */}
              <div>
                {!showPhrase ? (
                  <button
                    onClick={handleShowPhrase}
                    className="bg-blue-500 hover:bg-blue-600 text-white rounded-2xl px-8 py-4 text-xl font-bold shadow-lg transition-all"
                  >
                    💭 Show me what to say
                  </button>
                ) : (
                  <div className="bg-gradient-to-r from-yellow-100 to-yellow-200 rounded-2xl p-6 border-4 border-yellow-400">
                    <p className="text-sm text-gray-600 mb-2">Practice saying:</p>
                    <p className="text-3xl font-bold text-gray-800">
                      "{currentScenario.correctPhrase}"
                    </p>
                  </div>
                )}
              </div>

              {/* Next Button */}
              <button
                onClick={handleNext}
                className="bg-purple-500 hover:bg-purple-600 text-white rounded-2xl px-12 py-6 text-2xl font-bold shadow-lg transition-all transform hover:scale-105"
              >
                {currentIndex < scenarios.length - 1 ? "Next Scenario" : "Play Again"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}