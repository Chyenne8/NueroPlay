import { useState } from "react";
import { Link } from "react-router";
import { Home, Clock } from "lucide-react";

type Player = "player1" | "player2";

const blockColors = ["#FF6B6B", "#4D96FF", "#FFD93D", "#6BCF7F", "#A78BFA", "#FF6B9D", "#FFA500"];

const storySentences = [
  { player1: "Once upon a time, there was a dragon", player2: "who loved to eat cookies!" },
  { player1: "The dragon flew over the mountains", player2: "and found a magical castle." },
  { player1: "Inside the castle lived a friendly wizard", player2: "who had a pet rainbow unicorn." },
  { player1: "They decided to go on an adventure", player2: "to find the golden treasure." },
  { player1: "On their journey, they met a talking tree", player2: "who gave them a magic map." },
  { player1: "The map showed them the way", player2: "to a secret garden full of flowers." },
  { player1: "In the garden, they had a picnic", player2: "with sandwiches and chocolate cake!" },
  { player1: "When the sun started to set", player2: "they flew back home together." },
];

const turnTakingActivities = [
  {
    id: 1,
    title: "Building Blocks",
    emoji: "🧱",
    description: "Take turns adding blocks to the tower",
    type: "blocks" as const,
  },
  {
    id: 2,
    title: "Story Time",
    emoji: "📖",
    description: "Take turns adding to the story",
    type: "story" as const,
  },
  {
    id: 3,
    title: "Drawing Together",
    emoji: "🎨",
    description: "Take turns drawing shapes",
    type: "drawing" as const,
  },
];

const socialPhrases = [
  "Can I have a turn please?",
  "Thank you for waiting!",
  "Your turn now!",
  "Can I go next?",
  "Let's take turns!",
];

const drawingShapes = ["⭐", "❤️", "🌙", "☀️", "🌈", "🦋", "🌸", "🎈"];

export default function TurnTakingGame() {
  const [selectedActivity, setSelectedActivity] = useState<number | null>(null);
  const [currentTurn, setCurrentTurn] = useState<Player>("player1");
  const [turnCount, setTurnCount] = useState(0);
  const [isWaiting, setIsWaiting] = useState(false);
  const [showPhrase, setShowPhrase] = useState(false);
  const [currentPhrase, setCurrentPhrase] = useState("");
  
  // Activity-specific state
  const [blocks, setBlocks] = useState<string[]>([]);
  const [storyParts, setStoryParts] = useState<{ text: string; player: Player }[]>([]);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [drawings, setDrawings] = useState<{ shape: string; player: Player; x: number; y: number }[]>([]);

  const activity = selectedActivity !== null
    ? turnTakingActivities.find(a => a.id === selectedActivity)
    : null;

  const handleTakeTurn = () => {
    setIsWaiting(true);
    setShowPhrase(false);

    // Perform the action based on activity type
    if (activity?.type === "blocks") {
      // Add a block
      const color = blockColors[Math.floor(Math.random() * blockColors.length)];
      setBlocks([...blocks, color]);
    } else if (activity?.type === "story") {
      // Add story sentence
      if (currentStoryIndex < storySentences.length) {
        const sentence = storySentences[currentStoryIndex];
        const text = currentTurn === "player1" ? sentence.player1 : sentence.player2;
        setStoryParts([...storyParts, { text, player: currentTurn }]);
        if (currentTurn === "player2") {
          setCurrentStoryIndex(currentStoryIndex + 1);
        }
      }
    } else if (activity?.type === "drawing") {
      // Add a drawing
      const shape = drawingShapes[Math.floor(Math.random() * drawingShapes.length)];
      const x = Math.random() * 80 + 10; // 10-90%
      const y = Math.random() * 80 + 10;
      setDrawings([...drawings, { shape, player: currentTurn, x, y }]);
    }
    
    // Simulate waiting time
    setTimeout(() => {
      setIsWaiting(false);
      setTurnCount(turnCount + 1);
      setCurrentTurn(currentTurn === "player1" ? "player2" : "player1");
      
      // Randomly show a social phrase
      if (Math.random() > 0.5) {
        const phrase = socialPhrases[Math.floor(Math.random() * socialPhrases.length)];
        setCurrentPhrase(phrase);
        setShowPhrase(true);
      }
    }, 1500);
  };

  const handleReset = () => {
    setSelectedActivity(null);
    setCurrentTurn("player1");
    setTurnCount(0);
    setIsWaiting(false);
    setShowPhrase(false);
    setBlocks([]);
    setStoryParts([]);
    setCurrentStoryIndex(0);
    setDrawings([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-100 to-yellow-100 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link to="/kid-dashboard">
            <button className="bg-white p-3 rounded-full shadow-lg">
              <Home className="w-6 h-6 text-gray-700" />
            </button>
          </Link>
          <h1 className="text-3xl font-bold text-orange-600">Take Turns</h1>
          <div className="w-12"></div>
        </div>

        {!selectedActivity ? (
          /* Activity Selection */
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
              Choose an Activity
            </h2>
            {turnTakingActivities.map((activity) => (
              <button
                key={activity.id}
                onClick={() => setSelectedActivity(activity.id)}
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
        ) : (
          /* Turn Taking Interface */
          <div className="space-y-6">
            <button
              onClick={handleReset}
              className="bg-white px-6 py-3 rounded-full shadow-lg text-gray-700 font-bold"
            >
              ← Back to Activities
            </button>

            <div className="bg-white rounded-3xl p-8 shadow-xl">
              <div className="text-center space-y-6">
                <div className="text-8xl">{activity?.emoji}</div>
                <h2 className="text-3xl font-bold text-gray-800">{activity?.title}</h2>

                {/* Turn Counter */}
                <div className="bg-purple-50 rounded-2xl p-4">
                  <p className="text-gray-600">Turns taken:</p>
                  <p className="text-4xl font-bold text-purple-600">{turnCount}</p>
                </div>

                {/* Players */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Player 1 */}
                  <div className={`rounded-2xl p-6 transition-all ${
                    currentTurn === "player1" && !isWaiting
                      ? "bg-green-400 scale-105 ring-4 ring-green-500"
                      : "bg-gray-200"
                  }`}>
                    <div className="text-5xl mb-2">👧</div>
                    <p className="text-xl font-bold text-gray-800">Player 1</p>
                    {currentTurn === "player1" && !isWaiting && (
                      <p className="text-sm text-green-800 mt-2">Your turn!</p>
                    )}
                  </div>

                  {/* Player 2 */}
                  <div className={`rounded-2xl p-6 transition-all ${
                    currentTurn === "player2" && !isWaiting
                      ? "bg-blue-400 scale-105 ring-4 ring-blue-500"
                      : "bg-gray-200"
                  }`}>
                    <div className="text-5xl mb-2">👦</div>
                    <p className="text-xl font-bold text-gray-800">Player 2</p>
                    {currentTurn === "player2" && !isWaiting && (
                      <p className="text-sm text-blue-800 mt-2">Your turn!</p>
                    )}
                  </div>
                </div>

                {/* Activity Display */}
                {activity?.type === "blocks" && blocks.length > 0 && (
                  <div className="bg-gradient-to-b from-blue-50 to-green-50 rounded-2xl p-6 min-h-[200px] flex items-end justify-center">
                    <div className="flex flex-col-reverse items-center space-y-reverse space-y-1">
                      {blocks.map((color, index) => (
                        <div
                          key={index}
                          className="w-20 h-12 rounded shadow-lg"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {activity?.type === "story" && storyParts.length > 0 && (
                  <div className="bg-yellow-50 rounded-2xl p-6 max-h-[300px] overflow-y-auto text-left">
                    {storyParts.map((part, index) => (
                      <p
                        key={index}
                        className={`text-lg mb-3 ${
                          part.player === "player1" ? "text-green-700" : "text-blue-700"
                        }`}
                      >
                        <span className="font-bold">
                          {part.player === "player1" ? "👧: " : "👦: "}
                        </span>
                        {part.text}
                      </p>
                    ))}
                  </div>
                )}

                {activity?.type === "drawing" && drawings.length > 0 && (
                  <div className="bg-white border-4 border-dashed border-purple-300 rounded-2xl p-6 min-h-[200px] relative">
                    {drawings.map((drawing, index) => (
                      <div
                        key={index}
                        className="absolute text-4xl"
                        style={{ left: `${drawing.x}%`, top: `${drawing.y}%` }}
                      >
                        {drawing.shape}
                      </div>
                    ))}
                  </div>
                )}

                {/* Waiting State */}
                {isWaiting && (
                  <div className="bg-yellow-100 rounded-2xl p-6 border-4 border-yellow-400">
                    <Clock className="w-12 h-12 text-yellow-600 mx-auto mb-2 animate-pulse" />
                    <p className="text-2xl font-bold text-gray-800">
                      ⏳ Waiting for your turn...
                    </p>
                    <p className="text-gray-600 mt-2">Good job being patient!</p>
                  </div>
                )}

                {/* Social Phrase */}
                {showPhrase && !isWaiting && (
                  <div className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-2xl p-6 border-4 border-purple-400">
                    <p className="text-sm text-gray-600 mb-2">Practice saying:</p>
                    <p className="text-2xl font-bold text-gray-800">
                      "{currentPhrase}"
                    </p>
                  </div>
                )}

                {/* Take Turn Button */}
                {!isWaiting && (
                  <button
                    onClick={handleTakeTurn}
                    className={`rounded-2xl px-12 py-6 text-2xl font-bold shadow-lg transition-all transform hover:scale-105 ${
                      currentTurn === "player1"
                        ? "bg-green-500 hover:bg-green-600 text-white"
                        : "bg-blue-500 hover:bg-blue-600 text-white"
                    }`}
                  >
                    {activity?.type === "blocks" && "Add a Block"}
                    {activity?.type === "story" && "Add to Story"}
                    {activity?.type === "drawing" && "Draw Something"}
                  </button>
                )}

                {/* Instructions */}
                <div className="bg-blue-50 rounded-2xl p-4">
                  <p className="text-gray-700">
                    🎯 <strong>Remember:</strong> Wait for your turn, then click the button!
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}