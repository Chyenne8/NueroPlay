import { motion } from "framer-motion";
import { Card } from './ui/card';
import { Button } from './ui/button';
import { X, TrendingUp, Star, Brain, Target, Users } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, LineChart, Line } from 'recharts';

interface ProgressDashboardProps {
  onClose: () => void;
  userData: {
    sensoryScore: number;
    cognitiveScore: number;
    executiveScore: number;
    socialScore: number;
    completedChallenges: number;
    sessionHistory?: Array<{ date: string; score: number; mood?: string }>;
  };
}

export function ProgressDashboard({ onClose, userData }: ProgressDashboardProps) {
  const skillData = [
    { id: 'sensory', skill: 'Sensory', score: userData.sensoryScore, icon: '🌈', color: '#ec4899' },
    { id: 'cognitive', skill: 'Thinking', score: userData.cognitiveScore, icon: '🧠', color: '#8b5cf6' },
    { id: 'executive', skill: 'Planning', score: userData.executiveScore, icon: '🎯', color: '#3b82f6' },
    { id: 'social', skill: 'Social', score: userData.socialScore, icon: '😊', color: '#10b981' },
  ];

  const radarData = skillData.map(item => ({
    id: item.id,
    skill: item.skill,
    value: item.score,
    fullMark: 100,
  }));

  const sessionData = userData.sessionHistory || [];
  
  const averageScore = skillData.reduce((acc, curr) => acc + curr.score, 0) / skillData.length;
  const strongestSkill = skillData.reduce((max, curr) => curr.score > max.score ? curr : max);
  const growthArea = skillData.reduce((min, curr) => curr.score < min.score ? curr : min);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-6xl my-8"
      >
        <Card className="p-6 bg-white">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-gray-800 mb-1 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-green-500" />
                My Progress Journey
              </h2>
              <p className="text-gray-600">See how much you've grown!</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
              <div className="flex items-center gap-3">
                <div className="bg-purple-500 rounded-full p-3">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Overall Score</p>
                  <p className="text-2xl font-bold text-gray-800">{Math.round(averageScore)}%</p>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
              <div className="flex items-center gap-3">
                <div className="bg-green-500 rounded-full p-3 text-2xl">
                  {strongestSkill.icon}
                </div>
                <div>
                  <p className="text-sm text-gray-600">Strongest Skill</p>
                  <p className="text-xl font-bold text-gray-800">{strongestSkill.skill}</p>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200">
              <div className="flex items-center gap-3">
                <div className="bg-blue-500 rounded-full p-3">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Challenges Done</p>
                  <p className="text-2xl font-bold text-gray-800">{userData.completedChallenges}/15</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Skill Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Bar Chart */}
            <Card className="p-6 border-2 border-gray-200">
              <h3 className="text-gray-800 mb-4 font-semibold">Skill Scores</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={skillData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="skill" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px' 
                    }} 
                  />
                  <Bar dataKey="score" fill="#8b5cf6" radius={[8, 8, 0, 0]} name="Score" />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Radar Chart */}
            <Card className="p-6 border-2 border-gray-200">
              <h3 className="text-gray-800 mb-4 font-semibold">Skills Overview</h3>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis dataKey="skill" stroke="#6b7280" />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#6b7280" />
                  <Radar 
                    name="Skills" 
                    dataKey="value" 
                    stroke="#8b5cf6" 
                    fill="#8b5cf6" 
                    fillOpacity={0.6}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Individual Skill Progress Bars */}
          <Card className="p-6 border-2 border-gray-200 mb-6">
            <h3 className="text-gray-800 mb-4 font-semibold">Detailed Progress</h3>
            <div className="space-y-4">
              {skillData.map((skill) => (
                <div key={skill.skill}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{skill.icon}</span>
                      <span className="font-semibold text-gray-700">{skill.skill}</span>
                    </div>
                    <span className="text-sm font-bold text-gray-600">{skill.score}%</span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-4 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.score}%` }}
                      transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: skill.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Growth Tips */}
          <Card className="p-6 bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200">
            <h3 className="text-gray-800 mb-3 font-semibold flex items-center gap-2">
              <Brain className="w-5 h-5 text-orange-500" />
              Tips to Grow
            </h3>
            <div className="space-y-2">
              <p className="text-gray-700">
                <span className="font-semibold">🌟 You're great at:</span> {strongestSkill.skill} skills! Keep practicing these.
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">💪 Try more:</span> {growthArea.skill} challenges to balance your skills.
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">🎯 Next goal:</span> Complete {15 - userData.completedChallenges} more challenges!
              </p>
            </div>
          </Card>

          {/* Close Button */}
          <div className="mt-6 text-center">
            <Button
              onClick={onClose}
              className="bg-purple-500 hover:bg-purple-600 text-white px-8"
            >
              Close
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}