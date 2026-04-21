import { motion } from "framer-motion";
import { Card } from './ui/card';
import { Button } from './ui/button';
import { X, Download, Printer } from 'lucide-react';

interface PrintableReportProps {
  onClose: () => void;
  childData: {
    name: string;
    username: string;
    age?: number;
    completedChallenges: number;
    sensoryScore: number;
    cognitiveScore: number;
    executiveScore: number;
    socialScore: number;
    earnedBadges: string[];
    sessionHistory?: Array<{ date: string; mood?: string; score?: number }>;
  };
}

export function PrintableReport({ onClose, childData }: PrintableReportProps) {
  const handlePrint = () => {
    window.print();
  };

  const getRecommendations = () => {
    const scores = [
      { domain: 'Sensory', score: childData.sensoryScore },
      { domain: 'Cognitive', score: childData.cognitiveScore },
      { domain: 'Executive Function', score: childData.executiveScore },
      { domain: 'Social', score: childData.socialScore },
    ];

    const lowestScore = scores.reduce((min, curr) => curr.score < min.score ? curr : min);
    const highestScore = scores.reduce((max, curr) => curr.score > max.score ? curr : max);

    return {
      strengths: highestScore,
      growthAreas: lowestScore,
    };
  };

  const recommendations = getRecommendations();
  const averageScore = Math.round(
    (childData.sensoryScore + childData.cognitiveScore + 
     childData.executiveScore + childData.socialScore) / 4
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-4xl my-8"
      >
        <Card className="p-6 bg-white">
          {/* Header - Hide on print */}
          <div className="flex items-center justify-between mb-6 print:hidden">
            <div>
              <h2 className="text-gray-800 mb-1">Progress Report</h2>
              <p className="text-gray-600">Download or print to share</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          {/* Action Buttons - Hide on print */}
          <div className="flex gap-3 mb-6 print:hidden">
            <Button
              onClick={handlePrint}
              className="flex-1 bg-purple-500 hover:bg-purple-600 text-white"
            >
              <Printer className="w-5 h-5 mr-2" />
              Print Report
            </Button>
          </div>

          {/* Printable Content */}
          <div className="print:p-8">
            {/* Report Header */}
            <div className="text-center mb-8 border-b-4 border-purple-500 pb-6">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                NeuroPlay Progress Report
              </h1>
              <p className="text-gray-600">Child-Friendly Skills Assessment</p>
              <p className="text-sm text-gray-500 mt-2">
                Generated: {new Date().toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>

            {/* Child Information */}
            <Card className="p-6 mb-6 bg-blue-50 border-2 border-blue-200">
              <h3 className="font-bold text-gray-800 mb-3">Child Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-semibold text-gray-800">{childData.name || childData.username}</p>
                </div>
                {childData.age && (
                  <div>
                    <p className="text-sm text-gray-600">Age</p>
                    <p className="font-semibold text-gray-800">{childData.age} years</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-600">Challenges Completed</p>
                  <p className="font-semibold text-gray-800">{childData.completedChallenges} / 15</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Overall Progress</p>
                  <p className="font-semibold text-gray-800">{averageScore}%</p>
                </div>
              </div>
            </Card>

            {/* Skills Assessment */}
            <Card className="p-6 mb-6 border-2 border-gray-200">
              <h3 className="font-bold text-gray-800 mb-4">Skills Assessment</h3>
              <div className="space-y-4">
                {[
                  { name: 'Sensory Processing', score: childData.sensoryScore, icon: '🌈' },
                  { name: 'Cognitive Skills', score: childData.cognitiveScore, icon: '🧠' },
                  { name: 'Executive Function', score: childData.executiveScore, icon: '🎯' },
                  { name: 'Social Interaction', score: childData.socialScore, icon: '😊' },
                ].map(skill => (
                  <div key={skill.name}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-700">
                        {skill.icon} {skill.name}
                      </span>
                      <span className="font-bold text-gray-800">{skill.score}%</span>
                    </div>
                    <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-purple-500 h-full rounded-full"
                        style={{ width: `${skill.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Strengths & Growth Areas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <Card className="p-6 bg-green-50 border-2 border-green-200">
                <h3 className="font-bold text-gray-800 mb-3">💪 Strengths</h3>
                <p className="text-gray-700 mb-2">
                  <span className="font-semibold">{recommendations.strengths.domain}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Score: {recommendations.strengths.score}%
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  This child shows strong abilities in this area. Continue to build on these strengths!
                </p>
              </Card>

              <Card className="p-6 bg-yellow-50 border-2 border-yellow-200">
                <h3 className="font-bold text-gray-800 mb-3">🌱 Growth Areas</h3>
                <p className="text-gray-700 mb-2">
                  <span className="font-semibold">{recommendations.growthAreas.domain}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Score: {recommendations.growthAreas.score}%
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  Additional practice in this area could be beneficial. Consider more activities focused here.
                </p>
              </Card>
            </div>

            {/* Achievements */}
            <Card className="p-6 mb-6 bg-yellow-50 border-2 border-yellow-200">
              <h3 className="font-bold text-gray-800 mb-3">🏆 Achievements</h3>
              <p className="text-gray-700 mb-2">
                Earned <span className="font-bold">{childData.earnedBadges.length}</span> badges
              </p>
              <p className="text-sm text-gray-600">
                Badges represent milestones and encourage continued engagement with the platform.
              </p>
            </Card>

            {/* Recommendations */}
            <Card className="p-6 mb-6 border-2 border-purple-200 bg-purple-50">
              <h3 className="font-bold text-gray-800 mb-3">📋 Recommendations</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 font-bold">•</span>
                  <span>Continue practicing {recommendations.strengths.domain.toLowerCase()} activities to maintain strength</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 font-bold">•</span>
                  <span>Increase exposure to {recommendations.growthAreas.domain.toLowerCase()} challenges</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 font-bold">•</span>
                  <span>Play sessions work best at times when energy levels are optimal</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 font-bold">•</span>
                  <span>Regular breaks help maintain focus and prevent overwhelm</span>
                </li>
              </ul>
            </Card>

            {/* Footer */}
            <div className="border-t-2 border-gray-300 pt-4 text-center text-xs text-gray-500">
              <p className="mb-1">
                <strong>About NeuroPlay:</strong> A child-friendly platform that learns preferences and strengths 
                to personalize the player experience across sensory, cognitive, executive function, and social interaction skills.
              </p>
              <p>
                This report is for informational purposes only and does not constitute a medical diagnosis. 
                Consult with healthcare professionals for comprehensive assessments.
              </p>
            </div>
          </div>
        </Card>
      </motion.div>

      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print\\:p-8, .print\\:p-8 * {
            visibility: visible;
          }
          .print\\:p-8 {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
