import { useState } from "react";
import { Link } from "react-router";
import { Home, Volume2, RefreshCw, CheckCircle } from "lucide-react";

interface WordOfDay {
  word: string;
  meaning: string;
  emoji: string;
  examples: string[];
  practice: {
    scenario: string;
    characters: string[];
    blanks: string;
  };
}

const words: WordOfDay[] = [
  {
    word: "PLEASE",
    meaning: "A polite word we use when we ask for something",
    emoji: "🙏",
    examples: [
      "Can I have a cookie, PLEASE?",
      "May I play with that toy, PLEASE?",
      "PLEASE help me tie my shoes",
    ],
    practice: {
      scenario: "You want to borrow a crayon from your friend.",
      characters: ["👧", "👦"],
      blanks: "Can I use your crayon, ___?",
    },
  },
  {
    word: "THANK YOU",
    meaning: "Words we say when someone does something nice for us",
    emoji: "💙",
    examples: [
      "THANK YOU for sharing your snack!",
      "THANK YOU for helping me!",
      "THANK YOU for playing with me!",
    ],
    practice: {
      scenario: "Your teacher gives you a sticker.",
      characters: ["👧", "👨‍🏫"],
      blanks: "___ ___ for the sticker!",
    },
  },
  {
    word: "SORRY",
    meaning: "A word we use when we make a mistake or hurt someone",
    emoji: "😔",
    examples: [
      "SORRY for bumping into you",
      "I'm SORRY I took your toy",
      "SORRY for being too loud",
    ],
    practice: {
      scenario: "You accidentally knocked over your friend's blocks.",
      characters: ["👦", "👧"],
      blanks: "I'm ___, I didn't mean to!",
    },
  },
  {
    word: "WAIT",
    meaning: "To stay patient until it's your turn",
    emoji: "⏰",
    examples: [
      "Please WAIT for your turn",
      "I can WAIT until you're done",
      "Let's WAIT together",
    ],
    practice: {
      scenario: "The swing is being used. You want a turn.",
      characters: ["👦", "👧"],
      blanks: "I'll ___ for my turn!",
    },
  },
  {
    word: "SHARE",
    meaning: "To let someone else use or have some of what you have",
    emoji: "🤝",
    examples: [
      "Let's SHARE the crayons!",
      "I can SHARE my snack with you",
      "We can SHARE the toy",
    ],
    practice: {
      scenario: "You have lots of blocks and your friend wants some.",
      characters: ["👧", "👦"],
      blanks: "Let's ___ the blocks!",
    },
  },
  {
    word: "HELP",
    meaning: "To ask for or give support when something is hard",
    emoji: "🤲",
    examples: [
      "Can you HELP me, please?",
      "I need HELP with my zipper",
      "Let me HELP you!",
    ],
    practice: {
      scenario: "You can't reach something on the high shelf.",
      characters: ["👦", "👨"],
      blanks: "Can you ___ me reach it?",
    },
  },
];

export default function WordOfTheDay() {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [showExamples, setShowExamples] = useState(false);
  const [showPractice, setShowPractice] = useState(false);
  const [userAnswer, setUserAnswer] = useState("");
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [practiceComplete, setPracticeComplete] = useState(false);

  const currentWord = words[currentWordIndex];

  const handleNextWord = () => {
    setCurrentWordIndex((currentWordIndex + 1) % words.length);
    setShowExamples(false);
    setShowPractice(false);
    setUserAnswer("");
    setIsCorrect(null);
    setPracticeComplete(false);
  };

  const handleCheckAnswer = () => {
    const correct = userAnswer.trim().toUpperCase() === currentWord.word;
    setIsCorrect(correct);
    if (correct) {
      setPracticeComplete(true);
    }
  };

  const speakWord = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(currentWord.word);
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-100 to-orange-100 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link to="/kid-dashboard">
            <button className="bg-white p-3 rounded-full shadow-lg">
              <Home className="w-6 h-6 text-gray-700" />
            </button>
          </Link>
          <h1 className="text-3xl font-bold text-orange-600">Word of the Day</h1>
          <button onClick={handleNextWord} className="bg-white p-3 rounded-full shadow-lg">
            <RefreshCw className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Word Card */}
          <div className="bg-white rounded-3xl p-8 shadow-xl">
            <div className="text-center space-y-6">
              {/* Emoji */}
              <div className="text-8xl">{currentWord.emoji}</div>

              {/* Word */}
              <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl p-6">
                <h2 className="text-5xl font-bold text-white mb-2">
                  {currentWord.word}
                </h2>
                <button
                  onClick={speakWord}
                  className="bg-white bg-opacity-30 hover:bg-opacity-50 rounded-full p-3 transition-all"
                >
                  <Volume2 className="w-6 h-6 text-white" />
                </button>
              </div>

              {/* Meaning */}
              <div className="bg-blue-50 rounded-2xl p-6">
                <p className="text-2xl text-gray-800 leading-relaxed">
                  {currentWord.meaning}
                </p>
              </div>
            </div>
          </div>

          {/* Examples Section */}
          <div className="bg-white rounded-3xl p-8 shadow-xl">
            <button
              onClick={() => setShowExamples(!showExamples)}
              className="w-full text-center mb-4"
            >
              <h3 className="text-2xl font-bold text-gray-800">
                📝 See Examples {showExamples ? "▲" : "▼"}
              </h3>
            </button>

            {showExamples && (
              <div className="space-y-4">
                {currentWord.examples.map((example, index) => (
                  <div
                    key={index}
                    className="bg-purple-50 rounded-2xl p-4 border-2 border-purple-200"
                  >
                    <p className="text-xl text-gray-700">
                      {example.split(currentWord.word).map((part, i, arr) => (
                        <span key={i}>
                          {part}
                          {i < arr.length - 1 && (
                            <strong className="text-orange-600 text-2xl">
                              {currentWord.word}
                            </strong>
                          )}
                        </span>
                      ))}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Practice Section */}
          <div className="bg-white rounded-3xl p-8 shadow-xl">
            <button
              onClick={() => setShowPractice(!showPractice)}
              className="w-full text-center mb-4"
            >
              <h3 className="text-2xl font-bold text-gray-800">
                🎯 Practice Using It {showPractice ? "▲" : "▼"}
              </h3>
            </button>

            {showPractice && (
              <div className="space-y-6">
                {/* Characters */}
                <div className="flex justify-around items-center">
                  {currentWord.practice.characters.map((char, idx) => (
                    <div key={idx} className="text-6xl">{char}</div>
                  ))}
                </div>

                {/* Scenario */}
                <div className="bg-blue-50 rounded-2xl p-6">
                  <p className="text-xl text-gray-700 text-center">
                    {currentWord.practice.scenario}
                  </p>
                </div>

                {/* Fill in the blank */}
                <div className="bg-yellow-50 rounded-2xl p-6 border-4 border-yellow-300">
                  <p className="text-sm text-gray-600 mb-4 text-center">
                    Fill in the blank:
                  </p>
                  <p className="text-2xl text-gray-800 text-center mb-4">
                    {currentWord.practice.blanks}
                  </p>

                  {!practiceComplete && (
                    <>
                      <input
                        type="text"
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        placeholder="Type the word here..."
                        className="w-full p-4 text-xl rounded-xl border-2 border-gray-300 mb-4 text-center"
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            handleCheckAnswer();
                          }
                        }}
                      />

                      <button
                        onClick={handleCheckAnswer}
                        className="w-full bg-green-500 hover:bg-green-600 text-white rounded-2xl py-4 text-xl font-bold shadow-lg transition-all"
                      >
                        Check Answer
                      </button>
                    </>
                  )}

                  {/* Feedback */}
                  {isCorrect !== null && (
                    <div className={`mt-4 p-4 rounded-xl ${
                      isCorrect ? "bg-green-100" : "bg-orange-100"
                    }`}>
                      <div className="flex items-center justify-center space-x-2">
                        {isCorrect ? (
                          <>
                            <CheckCircle className="w-8 h-8 text-green-600" />
                            <p className="text-2xl font-bold text-green-600">
                              Perfect! Great job!
                            </p>
                          </>
                        ) : (
                          <>
                            <p className="text-xl text-orange-600">
                              Try again! The word is: <strong>{currentWord.word}</strong>
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  {practiceComplete && (
                    <div className="mt-4 text-center">
                      <div className="text-6xl mb-4">🌟</div>
                      <p className="text-2xl font-bold text-purple-600">
                        You did it!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Next Word Button */}
          <button
            onClick={handleNextWord}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-3xl py-6 text-2xl font-bold shadow-xl transition-all transform hover:scale-105"
          >
            Next Word →
          </button>
        </div>
      </div>
    </div>
  );
}