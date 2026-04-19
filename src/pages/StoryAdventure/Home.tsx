import { Link } from "react-router";
import { Palette, Heart, Users, Repeat, BookOpen, ArrowLeft } from "lucide-react";

export default function StoryAdventureHome() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-purple-100 p-6 flex flex-col items-center justify-center">
      <div className="max-w-md w-full space-y-8">
        {/* Back to Main Menu */}
        <Link to="/kid-dashboard">
          <button className="bg-white p-3 rounded-full shadow-lg flex items-center space-x-2 px-6">
            <ArrowLeft className="w-5 h-5 text-gray-700" />
            <span className="text-gray-700 font-bold">Main Menu</span>
          </button>
        </Link>

        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-5xl font-bold text-purple-600">Story Adventure</h1>
          <p className="text-xl text-gray-700">Let's Play and Learn!</p>
        </div>

        {/* Word of the Day Banner */}
        <Link to="/story-adventure/word-of-day">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-3xl p-6 shadow-lg hover:shadow-xl transition-shadow cursor-pointer border-4 border-yellow-300">
            <div className="flex items-center space-x-4">
              <div className="bg-white p-4 rounded-2xl">
                <BookOpen className="w-12 h-12 text-orange-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Word of the Day!</h2>
                <p className="text-yellow-50">Practice new words</p>
              </div>
            </div>
          </div>
        </Link>

        {/* Activity Cards */}
        <div className="space-y-4">
          {/* Yes/No Boundaries Game */}
          <Link to="/story-adventure/boundaries">
            <div className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-shadow cursor-pointer border-4 border-green-400">
              <div className="flex items-center space-x-4">
                <div className="bg-green-100 p-4 rounded-2xl">
                  <Heart className="w-12 h-12 text-green-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Yes or No?</h2>
                  <p className="text-gray-600">Learn about boundaries</p>
                </div>
              </div>
            </div>
          </Link>

          {/* Turn Taking */}
          <Link to="/story-adventure/turn-taking">
            <div className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-shadow cursor-pointer border-4 border-orange-400">
              <div className="flex items-center space-x-4">
                <div className="bg-orange-100 p-4 rounded-2xl">
                  <Repeat className="w-12 h-12 text-orange-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Take Turns</h2>
                  <p className="text-gray-600">Practice waiting & sharing</p>
                </div>
              </div>
            </div>
          </Link>

          {/* Cooperative Play */}
          <Link to="/story-adventure/cooperative">
            <div className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-shadow cursor-pointer border-4 border-blue-400">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 p-4 rounded-2xl">
                  <Users className="w-12 h-12 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Play Together</h2>
                  <p className="text-gray-600">Cooperative activities</p>
                </div>
              </div>
            </div>
          </Link>

          {/* Coloring Book */}
          <Link to="/story-adventure/coloring">
            <div className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-shadow cursor-pointer border-4 border-pink-400">
              <div className="flex items-center space-x-4">
                <div className="bg-pink-100 p-4 rounded-2xl">
                  <Palette className="w-12 h-12 text-pink-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Color & Create</h2>
                  <p className="text-gray-600">Interactive coloring book</p>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
