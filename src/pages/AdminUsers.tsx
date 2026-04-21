import { motion } from "framer-motion";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { 
  Users, 
  User,
  RefreshCw,
  Trash2,
  UserCheck,
  Lock,
  Unlock,
  Download,
  ChevronLeft,
  Eye,
  Search,
  Filter,
  UserPlus,
  Settings,
  BarChart3,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  EyeOff,
  Key,
  Database,
  Terminal,
  Code,
  Zap,
  FileJson,
  Upload,
  HardDrive,
  Cloud,
  Shield
} from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { isSupabaseConfigured, getAllCaregivers } from '../utils/supabaseClient';
import { loadDataConsent, type DataConsentSettings } from '../components/DataConsentDialog';

export default function AdminUsers() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [caregivers, setCaregivers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'not-started'>('all');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [visiblePasswords, setVisiblePasswords] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState('users');
  const supabaseConnected = isSupabaseConfigured();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const storedUsers = localStorage.getItem('neuroPlayUsers');
    setUsers(storedUsers ? JSON.parse(storedUsers) : []);
    
    const storedCaregivers = localStorage.getItem('neuroPlayCaregivers');
    setCaregivers(storedCaregivers ? JSON.parse(storedCaregivers) : []);
  };

  const handleLogin = () => {
    // Developer password
    if (password === 'dev123' || password.toLowerCase() === 'admin' || password === '1234') {
      setIsAuthenticated(true);
    } else {
      alert('⚠️ Incorrect developer password');
    }
  };

  const handleAllowRetake = (username: string) => {
    if (confirm(`Allow ${username} to retake the quest?`)) {
      const updatedUsers = users.map(u => 
        u.username === username ? { ...u, canRetakeQuiz: true } : u
      );
      setUsers(updatedUsers);
      localStorage.setItem('neuroPlayUsers', JSON.stringify(updatedUsers));
      
      const currentUserStr = localStorage.getItem('currentUser');
      if (currentUserStr) {
        const currentUser = JSON.parse(currentUserStr);
        if (currentUser.username === username) {
          localStorage.setItem('currentUser', JSON.stringify({ ...currentUser, canRetakeQuiz: true }));
        }
      }
      
      alert(`${username} can now retake the quest!`);
      loadData();
    }
  };

  const handleResetProgress = (username: string) => {
    if (confirm(`Reset ALL progress for ${username}? This cannot be undone!`)) {
      const updatedUsers = users.map(u => 
        u.username === username 
          ? { 
              ...u, 
              quizCompleted: false, 
              quizResults: null, 
              canRetakeQuiz: true,
              completedAt: null 
            } 
          : u
      );
      setUsers(updatedUsers);
      localStorage.setItem('neuroPlayUsers', JSON.stringify(updatedUsers));
      
      const currentUserStr = localStorage.getItem('currentUser');
      if (currentUserStr) {
        const currentUser = JSON.parse(currentUserStr);
        if (currentUser.username === username) {
          const resetUser = {
            ...currentUser,
            quizCompleted: false,
            quizResults: null,
            canRetakeQuiz: true,
            completedAt: null
          };
          localStorage.setItem('currentUser', JSON.stringify(resetUser));
        }
      }
      
      alert(`${username}'s progress has been reset!`);
      loadData();
    }
  };

  const handleDeleteUser = (username: string) => {
    if (confirm(`Delete user ${username}? This action cannot be undone!`)) {
      const updatedUsers = users.filter(u => u.username !== username);
      setUsers(updatedUsers);
      localStorage.setItem('neuroPlayUsers', JSON.stringify(updatedUsers));
      
      const currentUserStr = localStorage.getItem('currentUser');
      if (currentUserStr) {
        const currentUser = JSON.parse(currentUserStr);
        if (currentUser.username === username) {
          localStorage.removeItem('currentUser');
        }
      }
      
      alert(`User ${username} has been deleted.`);
      loadData();
    }
  };

  const exportUserData = (user: any) => {
    const dataStr = JSON.stringify(user, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${user.username}-profile-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = 
      filterStatus === 'all' ? true :
      filterStatus === 'completed' ? user.quizCompleted :
      !user.quizCompleted;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: users.length,
    completed: users.filter(u => u.quizCompleted).length,
    notStarted: users.filter(u => !u.quizCompleted).length,
    locked: users.filter(u => u.quizCompleted && !u.canRetakeQuiz).length,
  };

  const handleBulkExport = () => {
    const dataStr = JSON.stringify(users, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `all-users-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const handleViewProfile = (username: string) => {
    navigate(`/admin/profile/${username}`);
  };

  const togglePasswordVisibility = (username: string) => {
    setVisiblePasswords(prev => {
      const newSet = new Set(prev);
      if (newSet.has(username)) {
        newSet.delete(username);
      } else {
        newSet.add(username);
      }
      return newSet;
    });
  };

  // Helper to get consent status for a user
  const getUserConsent = (username: string): DataConsentSettings | null => {
    return loadDataConsent(username);
  };

  // Helper to check if user can be viewed/exported based on consent
  const canAccessUserData = (username: string, dataType: 'development' | 'analytics' | 'gameplay'): boolean => {
    const consent = getUserConsent(username);
    if (!consent) return false; // No consent set = no access
    
    switch (dataType) {
      case 'development':
        return consent.allowDevelopmentData;
      case 'analytics':
        return consent.allowAnonymizedAnalytics;
      case 'gameplay':
        return consent.allowGameplayImprovement;
      default:
        return false;
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md"
        >
          <div className="text-center mb-8">
            <div className="bg-gradient-to-br from-purple-400 to-pink-400 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
              <Lock className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-gray-800 mb-2">Admin Access</h1>
            <p className="text-gray-600">Enter developer password</p>
          </div>

          <div className="space-y-4">
            <div>
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                className="w-full"
              />
            </div>
            <Button 
              onClick={handleLogin}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            >
              <Unlock className="w-4 h-4 mr-2" />
              Login
            </Button>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 text-center">
              🔒 Demo passwords: <code className="bg-gray-200 px-2 py-1 rounded">admin</code>, <code className="bg-gray-200 px-2 py-1 rounded">dev123</code>, or <code className="bg-gray-200 px-2 py-1 rounded">1234</code>
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-purple-400 to-pink-400 rounded-full p-3">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-gray-800">Admin Panel</h1>
                <p className="text-gray-600">Manage users and system settings</p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => navigate('/kid-dashboard')}
              className="border-gray-300"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList>
            <TabsTrigger value="users">
              <Users className="w-4 h-4 mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="caregivers">
              <UserCheck className="w-4 h-4 mr-2" />
              Caregivers
            </TabsTrigger>
            <TabsTrigger value="devtools">
              <Terminal className="w-4 h-4 mr-2" />
              Dev Tools
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-600 text-sm mb-1">Total Users</p>
                    <p className="text-blue-900 font-bold">{stats.total}</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-600 text-sm mb-1">Completed</p>
                    <p className="text-green-900 font-bold">{stats.completed}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-600 text-sm mb-1">Not Started</p>
                    <p className="text-orange-900 font-bold">{stats.notStarted}</p>
                  </div>
                  <Clock className="w-8 h-8 text-orange-600" />
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-600 text-sm mb-1">Locked</p>
                    <p className="text-purple-900 font-bold">{stats.locked}</p>
                  </div>
                  <Lock className="w-8 h-8 text-purple-600" />
                </div>
              </Card>
            </div>

            {/* Filters and Actions */}
            <Card className="p-6">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex-1 w-full md:max-w-md">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      placeholder="Search by username..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={filterStatus === 'all' ? 'default' : 'outline'}
                    onClick={() => setFilterStatus('all')}
                    size="sm"
                  >
                    All
                  </Button>
                  <Button
                    variant={filterStatus === 'completed' ? 'default' : 'outline'}
                    onClick={() => setFilterStatus('completed')}
                    size="sm"
                  >
                    Completed
                  </Button>
                  <Button
                    variant={filterStatus === 'not-started' ? 'default' : 'outline'}
                    onClick={() => setFilterStatus('not-started')}
                    size="sm"
                  >
                    Not Started
                  </Button>
                </div>
                <Button onClick={handleBulkExport} variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export All
                </Button>
              </div>
            </Card>

            {/* User List */}
            <div className="space-y-4">
              {filteredUsers.length === 0 ? (
                <Card className="p-12 text-center">
                  <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">
                    {searchQuery ? 'No users found matching your search.' : 'No users registered yet.'}
                  </p>
                </Card>
              ) : (
                filteredUsers.map((user, index) => (
                  <motion.div
                    key={user.username}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="p-6 hover:shadow-lg transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="bg-gradient-to-br from-purple-400 to-pink-400 rounded-full p-3">
                            <User className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-gray-800 font-semibold">{user.username}</h3>
                              {user.quizCompleted ? (
                                <Badge className="bg-green-100 text-green-700 border-green-300">
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Completed
                                </Badge>
                              ) : (
                                <Badge className="bg-orange-100 text-orange-700 border-orange-300">
                                  <Clock className="w-3 h-3 mr-1" />
                                  Not Started
                                </Badge>
                              )}
                              {user.quizCompleted && !user.canRetakeQuiz && (
                                <Badge className="bg-purple-100 text-purple-700 border-purple-300">
                                  <Lock className="w-3 h-3 mr-1" />
                                  Locked
                                </Badge>
                              )}
                            </div>
                            
                            <div className="text-gray-600 space-y-1 text-sm ml-0">
                              <p>Age: {user.age || 'Not specified'}</p>
                              <p>Created: {new Date(user.createdAt).toLocaleDateString()}</p>
                              {user.completedAt && (
                                <p>Completed: {new Date(user.completedAt).toLocaleDateString()}</p>
                              )}
                              {user.parentEmail && (
                                <p className="text-indigo-600">👨‍👩‍👧‍👦 Parent: {user.parentEmail}</p>
                              )}
                              
                              {/* Privacy Consent Status */}
                              {(() => {
                                const consent = getUserConsent(user.username);
                                if (!consent) {
                                  return (
                                    <div className="flex items-center gap-2 mt-2">
                                      <Shield className="w-3 h-3 text-gray-400" />
                                      <span className="text-gray-500 text-xs">No consent data set</span>
                                    </div>
                                  );
                                }
                                return (
                                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                                    <Shield className="w-3 h-3 text-blue-600" />
                                    <span className="text-gray-500 text-xs">Privacy:</span>
                                    {consent.allowDevelopmentData && (
                                      <Badge className="bg-blue-100 text-blue-700 border-blue-300 text-xs">
                                        <Database className="w-2 h-2 mr-1" />
                                        Dev
                                      </Badge>
                                    )}
                                    {consent.allowAnonymizedAnalytics && (
                                      <Badge className="bg-purple-100 text-purple-700 border-purple-300 text-xs">
                                        <Eye className="w-2 h-2 mr-1" />
                                        Analytics
                                      </Badge>
                                    )}
                                    {consent.allowGameplayImprovement && (
                                      <Badge className="bg-green-100 text-green-700 border-green-300 text-xs">
                                        <Zap className="w-2 h-2 mr-1" />
                                        Gameplay
                                      </Badge>
                                    )}
                                    {!consent.allowDevelopmentData && !consent.allowAnonymizedAnalytics && !consent.allowGameplayImprovement && (
                                      <Badge className="bg-gray-100 text-gray-700 border-gray-300 text-xs">
                                        <XCircle className="w-2 h-2 mr-1" />
                                        All Declined
                                      </Badge>
                                    )}
                                  </div>
                                );
                              })()}
                              
                              <div className="flex items-center gap-2 mt-2">
                                <Key className="w-3 h-3 text-purple-600" />
                                <span className="text-gray-500">Password:</span>
                                <code className="text-purple-700 font-mono bg-purple-50 px-2 py-0.5 rounded">
                                  {visiblePasswords.has(user.username) ? user.password : '••••••••'}
                                </code>
                                <button
                                  onClick={() => togglePasswordVisibility(user.username)}
                                  className="text-purple-600 hover:text-purple-800 transition-colors"
                                  title={visiblePasswords.has(user.username) ? 'Hide password' : 'Show password'}
                                >
                                  {visiblePasswords.has(user.username) ? (
                                    <EyeOff className="w-3 h-3" />
                                  ) : (
                                    <Eye className="w-3 h-3" />
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          {user.quizCompleted && !user.canRetakeQuiz && (
                            <Button
                              onClick={() => handleAllowRetake(user.username)}
                              size="sm"
                              variant="outline"
                              className="border-blue-300 text-blue-600 hover:bg-blue-50"
                            >
                              <Unlock className="w-4 h-4 mr-2" />
                              Allow Retake
                            </Button>
                          )}
                          <Button
                            onClick={() => handleResetProgress(user.username)}
                            size="sm"
                            variant="outline"
                            className="border-orange-300 text-orange-600 hover:bg-orange-50"
                          >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Reset
                          </Button>
                          <Button
                            onClick={() => exportUserData(user)}
                            size="sm"
                            variant="outline"
                            className="border-green-300 text-green-600 hover:bg-green-50"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Export
                          </Button>
                          <Button
                            onClick={() => handleDeleteUser(user.username)}
                            size="sm"
                            variant="outline"
                            className="border-red-300 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full p-3">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-gray-800">System Analytics</h2>
                  <p className="text-gray-600">Overview of user activity and completion rates</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Privacy Consent Summary */}
                <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-200 md:col-span-2">
                  <div className="flex items-center gap-2 mb-4">
                    <Shield className="w-5 h-5 text-indigo-600" />
                    <h3 className="text-indigo-900">Privacy Consent Summary</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {(() => {
                      const consentStats = {
                        total: users.length,
                        development: users.filter(u => canAccessUserData(u.username, 'development')).length,
                        analytics: users.filter(u => canAccessUserData(u.username, 'analytics')).length,
                        gameplay: users.filter(u => canAccessUserData(u.username, 'gameplay')).length,
                      };
                      return (
                        <>
                          <div className="bg-white p-4 rounded-lg border border-indigo-200">
                            <div className="flex items-center gap-2 mb-2">
                              <Database className="w-4 h-4 text-blue-600" />
                              <span className="text-sm text-gray-600">Development Data</span>
                            </div>
                            <p className="text-2xl font-bold text-blue-700">{consentStats.development}</p>
                            <p className="text-xs text-gray-500">
                              {consentStats.total > 0 ? Math.round((consentStats.development / consentStats.total) * 100) : 0}% consented
                            </p>
                          </div>
                          <div className="bg-white p-4 rounded-lg border border-indigo-200">
                            <div className="flex items-center gap-2 mb-2">
                              <Eye className="w-4 h-4 text-purple-600" />
                              <span className="text-sm text-gray-600">Analytics</span>
                            </div>
                            <p className="text-2xl font-bold text-purple-700">{consentStats.analytics}</p>
                            <p className="text-xs text-gray-500">
                              {consentStats.total > 0 ? Math.round((consentStats.analytics / consentStats.total) * 100) : 0}% consented
                            </p>
                          </div>
                          <div className="bg-white p-4 rounded-lg border border-indigo-200">
                            <div className="flex items-center gap-2 mb-2">
                              <Zap className="w-4 h-4 text-green-600" />
                              <span className="text-sm text-gray-600">Gameplay Data</span>
                            </div>
                            <p className="text-2xl font-bold text-green-700">{consentStats.gameplay}</p>
                            <p className="text-xs text-gray-500">
                              {consentStats.total > 0 ? Math.round((consentStats.gameplay / consentStats.total) * 100) : 0}% consented
                            </p>
                          </div>
                          <div className="bg-white p-4 rounded-lg border border-indigo-200">
                            <div className="flex items-center gap-2 mb-2">
                              <Shield className="w-4 h-4 text-gray-600" />
                              <span className="text-sm text-gray-600">No Consent Set</span>
                            </div>
                            <p className="text-2xl font-bold text-gray-700">
                              {users.filter(u => !getUserConsent(u.username)).length}
                            </p>
                            <p className="text-xs text-gray-500">
                              {consentStats.total > 0 ? Math.round((users.filter(u => !getUserConsent(u.username)).length / consentStats.total) * 100) : 0}% pending
                            </p>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                  <div className="mt-4 p-3 bg-indigo-100 rounded-md">
                    <p className="text-xs text-indigo-800">
                      <strong>Note:</strong> Admin can only view/export data for users who have granted consent. 
                      Users without consent data or who have declined permissions cannot have their data accessed.
                    </p>
                  </div>
                </div>

                <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                  <h3 className="text-blue-900 mb-4">Completion Rate</h3>
                  <div className="mb-4">
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-blue-700 font-bold">{stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%</span>
                      <span className="text-blue-600 text-sm">of users completed</span>
                    </div>
                    <div className="bg-blue-200 rounded-full h-4 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-500"
                        style={{ width: `${stats.total > 0 ? (stats.completed / stats.total) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-blue-700 text-sm">
                    {stats.completed} out of {stats.total} users
                  </div>
                </div>

                <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                  <h3 className="text-green-900 mb-4">Recent Completions</h3>
                  <div className="space-y-2 text-sm text-green-700">
                    {users
                      .filter(u => u.completedAt)
                      .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
                      .slice(0, 5)
                      .map(user => (
                        <div key={user.username} className="flex items-center justify-between py-2 border-b border-green-200 last:border-0">
                          <span>{user.username}</span>
                          <span className="text-green-600">{new Date(user.completedAt).toLocaleDateString()}</span>
                        </div>
                      ))}
                    {users.filter(u => u.completedAt).length === 0 && (
                      <p className="text-green-600">No completions yet</p>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="caregivers" className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full p-3">
                  <UserCheck className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-gray-800">Caregivers</h2>
                  <p className="text-gray-600">Manage parent and caregiver accounts</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                  <h3 className="text-blue-900 mb-4">Caregiver List</h3>
                  <div className="space-y-2 text-sm text-blue-700">
                    {caregivers.map(caregiver => (
                      <div key={caregiver.username} className="flex items-center justify-between py-2 border-b border-blue-200 last:border-0">
                        <span>{caregiver.username}</span>
                        <span className="text-blue-600">{caregiver.email}</span>
                      </div>
                    ))}
                    {caregivers.length === 0 && (
                      <p className="text-blue-600">No caregivers registered yet</p>
                    )}
                  </div>
                </div>

                <div className="bg-cyan-50 p-6 rounded-lg border border-cyan-200">
                  <h3 className="text-cyan-900 mb-4">Statistics</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-cyan-700">Total Caregivers:</span>
                      <span className="text-cyan-900 font-bold">{caregivers.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-cyan-700">Active Users:</span>
                      <span className="text-cyan-900 font-bold">{users.length}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="devtools" className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-br from-gray-700 to-gray-900 rounded-full p-3">
                  <Terminal className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-gray-800">Developer Tools</h2>
                  <p className="text-gray-600">Advanced debugging and data management</p>
                </div>
              </div>

              <div className="grid gap-4">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <HardDrive className="w-5 h-5 text-gray-600" />
                      <h3 className="text-gray-800">LocalStorage Data</h3>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const data = {
                          users: JSON.parse(localStorage.getItem('neuroPlayUsers') || '[]'),
                          caregivers: JSON.parse(localStorage.getItem('neuroPlayCaregivers') || '[]'),
                          currentUser: JSON.parse(localStorage.getItem('currentUser') || 'null'),
                        };
                        console.log('LocalStorage Data:', data);
                        alert('Data logged to console');
                      }}
                    >
                      <Code className="w-4 h-4 mr-2" />
                      Log to Console
                    </Button>
                  </div>
                  <p className="text-sm text-gray-600">View all localStorage data in browser console</p>
                </div>

                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-amber-600" />
                      <h3 className="text-amber-800">Clear All Data</h3>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-red-300 text-red-600 hover:bg-red-50"
                      onClick={() => {
                        if (confirm('⚠️ This will delete ALL user and caregiver data! Are you sure?')) {
                          localStorage.removeItem('neuroPlayUsers');
                          localStorage.removeItem('neuroPlayCaregivers');
                          localStorage.removeItem('currentUser');
                          loadData();
                          alert('All data cleared!');
                        }
                      }}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Clear All
                    </Button>
                  </div>
                  <p className="text-sm text-amber-700">⚠️ Warning: This action cannot be undone!</p>
                </div>

                {supabaseConnected && (
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Cloud className="w-5 h-5 text-green-600" />
                      <h3 className="text-green-800">Supabase Connection</h3>
                    </div>
                    <p className="text-sm text-green-700">✅ Connected to Supabase backend</p>
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-br from-purple-400 to-pink-400 rounded-full p-3">
                  <Settings className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-gray-800">System Settings</h2>
                  <p className="text-gray-600">Configure admin panel preferences</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <h3 className="text-purple-900 mb-2">Admin Access</h3>
                  <p className="text-sm text-purple-700 mb-3">
                    Current demo passwords: <code className="bg-purple-100 px-2 py-1 rounded">admin</code>, 
                    <code className="bg-purple-100 px-2 py-1 rounded ml-2">dev123</code>, 
                    <code className="bg-purple-100 px-2 py-1 rounded ml-2">1234</code>
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-purple-300"
                    onClick={() => {
                      setIsAuthenticated(false);
                      setPassword('');
                    }}
                  >
                    Logout
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}