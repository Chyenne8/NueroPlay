import { useState } from "react";
import { Link } from "react-router-dom";
import { Home, Palette, RotateCcw } from "lucide-react";

// Coloring page templates with themes
const coloringPages = [
  {
    id: 1,
    name: "Friendly Dinosaur",
    theme: "dinosaur",
    emoji: "🦕",
    regions: [
      { id: "body", path: "M100 200 Q80 150 100 120 L120 100 L140 110 L150 100 L160 110 L180 100 L200 120 Q220 150 200 200 L190 220 Q180 250 150 250 Q120 250 110 220 Z", label: "Body", color: "#90EE90" },
      { id: "head", path: "M120 100 Q100 80 110 60 Q120 50 140 55 Q150 50 160 55 Q180 50 190 60 Q200 80 180 100 Z", label: "Head", color: "#98D8C8" },
      { id: "spots1", path: "M130 140 m -10 0 a 10 10 0 1 0 20 0 a 10 10 0 1 0 -20 0", label: "Spot", color: "#FFB6C1" },
      { id: "spots2", path: "M160 160 m -8 0 a 8 8 0 1 0 16 0 a 8 8 0 1 0 -16 0", label: "Spot", color: "#FFB6C1" },
      { id: "spots3", path: "M140 180 m -12 0 a 12 12 0 1 0 24 0 a 12 12 0 1 0 -24 0", label: "Spot", color: "#FFB6C1" },
      { id: "eye", path: "M140 70 m -5 0 a 5 5 0 1 0 10 0 a 5 5 0 1 0 -10 0", label: "Eye", color: "#000000" },
      { id: "tail", path: "M200 180 Q230 170 240 160 L245 165 Q235 180 210 185 Z", label: "Tail", color: "#7FCDBB" },
    ],
  },
  {
    id: 2,
    name: "Beautiful Princess",
    theme: "princess",
    emoji: "👸",
    regions: [
      { id: "face", path: "M150 140 m -30 0 a 30 30 0 1 0 60 0 a 30 30 0 1 0 -60 0", label: "Face", color: "#FFE4C4" },
      { id: "crown", path: "M120 110 L130 100 L135 110 L140 95 L145 110 L150 90 L155 110 L160 95 L165 110 L170 100 L180 110 Z", label: "Crown", color: "#FFD700" },
      { id: "dress", path: "M130 170 L120 240 Q120 260 150 260 Q180 260 180 240 L170 170 Q150 180 130 170 Z", label: "Dress", color: "#FFB6D9" },
      { id: "hair-left", path: "M125 115 Q110 120 105 140 Q108 155 120 150 L125 130 Z", label: "Hair", color: "#8B4513" },
      { id: "hair-right", path: "M175 115 Q190 120 195 140 Q192 155 180 150 L175 130 Z", label: "Hair", color: "#8B4513" },
      { id: "eye-left", path: "M135 135 m -3 0 a 3 3 0 1 0 6 0 a 3 3 0 1 0 -6 0", label: "Eye", color: "#000000" },
      { id: "eye-right", path: "M165 135 m -3 0 a 3 3 0 1 0 6 0 a 3 3 0 1 0 -6 0", label: "Eye", color: "#000000" },
      { id: "jewel", path: "M150 103 L145 98 L150 93 L155 98 Z", label: "Jewel", color: "#FF69B4" },
    ],
  },
  {
    id: 3,
    name: "Cool Race Car",
    theme: "car",
    emoji: "🏎️",
    regions: [
      { id: "body", path: "M80 180 L80 160 L100 150 L120 140 L180 140 L200 150 L220 160 L220 180 L210 180 L210 200 L90 200 L90 180 Z", label: "Body", color: "#FF4444" },
      { id: "window", path: "M130 145 L130 160 L170 160 L170 145 Z", label: "Window", color: "#87CEEB" },
      { id: "spoiler", path: "M75 165 L70 155 L80 155 L80 165 Z", label: "Spoiler", color: "#FF6B6B" },
      { id: "stripe", path: "M100 170 L200 170 L195 175 L105 175 Z", label: "Stripe", color: "#FFFFFF" },
      { id: "wheel1", path: "M105 200 m -15 0 a 15 15 0 1 0 30 0 a 15 15 0 1 0 -30 0", label: "Wheel", color: "#333333" },
      { id: "wheel1-center", path: "M105 200 m -8 0 a 8 8 0 1 0 16 0 a 8 8 0 1 0 -16 0", label: "Hub", color: "#C0C0C0" },
      { id: "wheel2", path: "M195 200 m -15 0 a 15 15 0 1 0 30 0 a 15 15 0 1 0 -30 0", label: "Wheel", color: "#333333" },
      { id: "wheel2-center", path: "M195 200 m -8 0 a 8 8 0 1 0 16 0 a 8 8 0 1 0 -16 0", label: "Hub", color: "#C0C0C0" },
    ],
  },
  {
    id: 4,
    name: "Smiling Sun",
    theme: "nature",
    emoji: "☀️",
    regions: [
      { id: "sun", path: "M150 150 m -50 0 a 50 50 0 1 0 100 0 a 50 50 0 1 0 -100 0", label: "Sun", color: "#FFD700" },
      { id: "ray1", path: "M150 70 L145 40 L150 35 L155 40 Z", label: "Ray", color: "#FFA500" },
      { id: "ray2", path: "M185 85 L205 60 L210 65 L190 90 Z", label: "Ray", color: "#FFA500" },
      { id: "ray3", path: "M215 115 L245 105 L245 115 L215 125 Z", label: "Ray", color: "#FFA500" },
      { id: "ray4", path: "M215 185 L245 195 L245 185 L215 175 Z", label: "Ray", color: "#FFA500" },
      { id: "ray5", path: "M185 215 L205 240 L200 245 L180 220 Z", label: "Ray", color: "#FFA500" },
      { id: "ray6", path: "M150 230 L145 260 L150 265 L155 260 Z", label: "Ray", color: "#FFA500" },
      { id: "ray7", path: "M115 215 L95 240 L90 235 L110 210 Z", label: "Ray", color: "#FFA500" },
      { id: "ray8", path: "M85 185 L55 195 L55 185 L85 175 Z", label: "Ray", color: "#FFA500" },
      { id: "eye-left", path: "M135 140 m -5 0 a 5 5 0 1 0 10 0 a 5 5 0 1 0 -10 0", label: "Eye", color: "#000000" },
      { id: "eye-right", path: "M165 140 m -5 0 a 5 5 0 1 0 10 0 a 5 5 0 1 0 -10 0", label: "Eye", color: "#000000" },
      { id: "smile", path: "M135 160 Q150 170 165 160", label: "Smile", color: "#000000", stroke: true },
    ],
  },
];

const colorPalette = [
  { name: "Red", color: "#FF6B6B" },
  { name: "Orange", color: "#FFA500" },
  { name: "Yellow", color: "#FFD93D" },
  { name: "Green", color: "#6BCF7F" },
  { name: "Blue", color: "#4D96FF" },
  { name: "Purple", color: "#A78BFA" },
  { name: "Pink", color: "#FF6B9D" },
  { name: "Brown", color: "#C49C6D" },
  { name: "Gray", color: "#9CA3AF" },
  { name: "Black", color: "#000000" },
  { name: "White", color: "#FFFFFF" },
];

export default function ColoringBook() {
  const [selectedPage, setSelectedPage] = useState<number | null>(null);
  const [selectedColor, setSelectedColor] = useState(colorPalette[0].color);
  const [regionColors, setRegionColors] = useState<{ [key: string]: string }>({});

  const currentPage = selectedPage !== null 
    ? coloringPages.find(p => p.id === selectedPage)
    : null;

  const handleRegionClick = (regionId: string) => {
    setRegionColors({
      ...regionColors,
      [regionId]: selectedColor,
    });
  };

  const handleReset = () => {
    setRegionColors({});
  };

  const handleSelectPage = (pageId: number) => {
    setSelectedPage(pageId);
    setRegionColors({});
  };

  const handleBack = () => {
    setSelectedPage(null);
    setRegionColors({});
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-100 to-purple-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link to="/kid-dashboard">
            <button className="bg-white p-3 rounded-full shadow-lg">
              <Home className="w-6 h-6 text-gray-700" />
            </button>
          </Link>
          <h1 className="text-3xl font-bold text-pink-600">Color & Create</h1>
          <button onClick={handleReset} className="bg-white p-3 rounded-full shadow-lg">
            <RotateCcw className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        {!selectedPage ? (
          /* Page Selection */
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
              Choose a Picture to Color
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {coloringPages.map((page) => (
                <button
                  key={page.id}
                  onClick={() => handleSelectPage(page.id)}
                  className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                >
                  <div className="text-8xl mb-4">{page.emoji}</div>
                  <h3 className="text-2xl font-bold text-gray-800">{page.name}</h3>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Back Button */}
            <button
              onClick={handleBack}
              className="bg-white px-6 py-3 rounded-full shadow-lg text-gray-700 font-bold mb-6"
            >
              ← Choose Different Picture
            </button>

            {/* Page Title */}
            <div className="text-center mb-4">
              <h2 className="text-3xl font-bold text-gray-800">{currentPage?.name}</h2>
              <p className="text-gray-600 mt-2">Tap a color, then tap on the picture!</p>
            </div>

            <div className="grid md:grid-cols-[1fr,auto] gap-6">
              {/* Canvas */}
              <div className="bg-white rounded-3xl p-8 shadow-xl">
                <svg
                  viewBox="0 0 300 300"
                  className="w-full h-full max-w-md mx-auto"
                  style={{ maxHeight: "500px" }}
                >
                  {/* Background */}
                  <rect width="300" height="300" fill="#FAFAFA" />

                  {/* Render regions */}
                  {currentPage?.regions.map((region) => (
                    <g key={region.id}>
                      <path
                        d={region.path}
                        fill={regionColors[region.id] || "#FFFFFF"}
                        stroke="#333333"
                        strokeWidth="2"
                        onClick={() => handleRegionClick(region.id)}
                        style={{ cursor: "pointer" }}
                        className="transition-all hover:opacity-80"
                      />
                    </g>
                  ))}
                </svg>
              </div>

              {/* Color Palette */}
              <div className="bg-white rounded-3xl p-6 shadow-xl max-h-[600px] overflow-y-auto">
                <div className="flex items-center space-x-2 mb-4">
                  <Palette className="w-6 h-6 text-gray-700" />
                  <h3 className="text-xl font-bold text-gray-800">Pick a Color</h3>
                </div>

                <div className="space-y-3">
                  {colorPalette.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.color)}
                      className={`w-full flex items-center space-x-4 p-4 rounded-2xl transition-all ${
                        selectedColor === color.color
                          ? "ring-4 ring-purple-500 scale-105"
                          : "hover:scale-105"
                      } ${color.color === "#FFFFFF" ? "border-2 border-gray-300" : ""}`}
                      style={{ backgroundColor: color.color }}
                    >
                      <div className="w-12 h-12 rounded-full bg-white bg-opacity-30 flex items-center justify-center">
                        {selectedColor === color.color && (
                          <span className="text-2xl">✓</span>
                        )}
                      </div>
                      <span
                        className="text-xl font-bold"
                        style={{
                          color: color.color === "#FFFFFF" || color.color === "#FFD93D" ? "#333333" : "#FFFFFF",
                        }}
                      >
                        {color.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}