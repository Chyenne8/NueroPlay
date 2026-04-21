import { motion } from "framer-motion";
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { 
  Brain, 
  Palette, 
  Zap, 
  Users, 
  Trophy,
  Star,
  ChevronLeft,
  Download,
  Target,
  Calendar
} from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

export default function AdminProfileView() {
  const navigate = useNavigate();
  const { username } = useParams();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem('neuroPlayUsers') || '[]');
    const foundUser = users.find((u: any) => u.username === username);
    setUser(foundUser);
  }, [username]);

  const exportUserData = () => {
    if (user) {
      const dataStr = JSON.stringify(user, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${user.username}-profile-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="p-8 text-center max-w-md">
          <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-gray-800 mb-2">User Not Found</h2>
          <p className="text-gray-600 mb-4">Could not find user "{username}"</p>
          <Button onClick={() => navigate('/admin')}>Back to Users</Button>
        </Card>
      </div>
    );
  }

  if (!user.quizCompleted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="p-8 text-center max-w-md">
          <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-gray-800 mb-2">No Profile Data</h2>
          <p className="text-gray-600 mb-4">{user.username} hasn't completed the quest yet.</p>
          <Button onClick={() => navigate('/admin')}>Back to Users</Button>
        </Card>
      </div>
    );
  }

  const results = user.quizResults || {};
  const cognitiveScore = Object.values(results.cognitive || {}).filter(v => v).length;
  const executiveScore = Object.values(results.executiveFunction || {}).filter(v => v).length;
  const socialScore = Object.values(results.socialInteraction || {}).filter(v => v).length;

  const stats = [
    {
      icon: Brain,
      label: 'Cognitive Skills',
      score: cognitiveScore,
      total: 5,
      color: 'blue',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      textColor: 'text-blue-600',
      gradient: 'from-blue-400 to-cyan-400',
    },
    {
      icon: Zap,
      label: 'Executive Function',
      score: executiveScore,
      total: 4,
      color: 'orange',
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
      textColor: 'text-orange-600',
      gradient: 'from-orange-400 to-yellow-400',
    },
    {
      icon: Users,
      label: 'Social Interaction',
      score: socialScore,
      total: 3,
      color: 'pink',
      iconBg: 'bg-pink-100',
      iconColor: 'text-pink-600',
      textColor: 'text-pink-600',
      gradient: 'from-pink-400 to-rose-400',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => navigate('/admin')}>
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back to Users
              </Button>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                <Trophy className="w-4 h-4 mr-1" />
                Profile Complete
              </Badge>
              <Button variant="outline" size="sm" onClick={exportUserData}>
                <Download className="w-4 h-4 mr-1" />
                Export Data
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-gray-900 mb-2">{user.username}'s Profile</h1>
          <p className="text-gray-600">
            Age: {user.age || 'Not specified'} | Completed: {new Date(user.completedAt).toLocaleDateString()}
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div>
              <h2 className="text-gray-800 mb-4">Performance Summary</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  const percentage = (stat.score / stat.total) * 100;
                  return (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 * index }}
                    >
                      <Card className="p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                          <div className={`${stat.iconBg} rounded-full p-3`}>
                            <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                          </div>
                        </div>
                        <h3 className="text-gray-700 mb-2">{stat.label}</h3>
                        <div className="flex items-baseline gap-2">
                          <span className={stat.textColor}>
                            {stat.score}/{stat.total}
                          </span>
                          <span className="text-gray-500">tasks</span>
                        </div>
                        <div className="mt-3 bg-gray-200 rounded-full h-2 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                            className={`h-full bg-gradient-to-r ${stat.gradient}`}
                          />
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-purple-100 rounded-full p-3">
                  <Palette className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-gray-800">Sensory Preferences</h3>
                  <p className="text-gray-600">Environmental preferences identified</p>
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-purple-50 p-6 rounded-lg">
                  <h4 className="text-gray-700 mb-3">Color Preference</h4>
                  <div className={`p-4 rounded-lg ${
                    results.sensory?.colorPreference === 'bright'
                      ? 'bg-gradient-to-br from-yellow-100 to-pink-100'
                      : 'bg-gradient-to-br from-blue-50 to-purple-50'
                  }`}>
                    <p className="text-purple-700">
                      {results.sensory?.colorPreference === 'bright' ? 'Bright, vibrant colors' : 'Soft, muted colors'}
                    </p>
                  </div>
                </div>
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h4 className="text-gray-700 mb-3">Sound Preference</h4>
                  <div className="p-4 bg-white rounded-lg">
                    <p className="text-blue-700">
                      {results.sensory?.soundPreference === 'gentle' && 'Calm, peaceful music'}
                      {results.sensory?.soundPreference === 'upbeat' && 'Fun, energetic music'}
                      {results.sensory?.soundPreference === 'silence' && 'Quiet environment'}
                    </p>
                  </div>
                </div>
                <div className="bg-green-50 p-6 rounded-lg">
                  <h4 className="text-gray-700 mb-3">Animation Speed</h4>
                  <div className="p-4 bg-white rounded-lg">
                    <p className="text-green-700">
                      {results.sensory?.speedPreference === 'fast' ? 'Fast animations' : 'Smooth movements'}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-indigo-100 rounded-full p-3">
                  <Star className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-gray-800">Personalized Recommendations</h3>
                  <p className="text-gray-600">Game types based on profile</p>
                </div>
              </div>

              <div className="space-y-6">
                {cognitiveScore >= 3 && (
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <h4 className="text-blue-800 mb-3">Strong Cognitive Skills</h4>
                    <ul className="space-y-2 text-blue-700">
                      <li>✓ Puzzle adventures</li>
                      <li>✓ Pattern challenges</li>
                      <li>✓ Memory games</li>
                    </ul>
                  </div>
                )}

                {executiveScore >= 2 && (
                  <div className="bg-orange-50 p-6 rounded-lg">
                    <h4 className="text-orange-800 mb-3">Strong Executive Function</h4>
                    <ul className="space-y-2 text-orange-700">
                      <li>✓ Strategy games</li>
                      <li>✓ Multi-step tasks</li>
                      <li>✓ Goal-oriented activities</li>
                    </ul>
                  </div>
                )}

                {socialScore >= 2 && (
                  <div className="bg-pink-50 p-6 rounded-lg">
                    <h4 className="text-pink-800 mb-3">Strong Social Awareness</h4>
                    <ul className="space-y-2 text-pink-700">
                      <li>✓ Story-based games</li>
                      <li>✓ Social scenarios</li>
                      <li>✓ Emotion recognition</li>
                    </ul>
                  </div>
                )}
              </div>
            </Card>

            <Card className="p-6 bg-amber-50 border-amber-200">
              <div className="flex gap-4">
                <Calendar className="w-6 h-6 text-amber-600 flex-shrink-0" />
                <div>
                  <h4 className="text-amber-900 mb-2">Important Note</h4>
                  <p className="text-amber-800">
                    This assessment identifies preferences and skills during gameplay. 
                    It is NOT a diagnostic tool. Results help personalize game experiences.
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
