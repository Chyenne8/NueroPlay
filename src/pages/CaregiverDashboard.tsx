import { motion } from "framer-motion";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Plus, 
  Brain, 
  Target, 
  Heart, 
  Award, 
  Calendar, 
  LogOut, 
  ArrowLeft,
  Link as LinkIcon,
  FileText,
  Printer,
  BookOpen,
  Settings,
  Eye,
  EyeOff,
  Key,
  RefreshCw,
  Trash2,
  Edit,
  Database,
  HardDrive,
  Shield,
  X
} from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { AccessibilityMenu } from '../components/AccessibilityMenu';
import { CaregiverNotes } from '../components/CaregiverNotes';
import { PrintableReport } from '../components/PrintableReport';
import { PrivacySettings } from '../components/PrivacySettings';
import { DataConsentDialog, loadDataConsent, saveDataConsent } from '../components/DataConsentDialog';
import { tts } from '../utils/textToSpeech';
import { isSupabaseConfigured, getCaregiver, saveCaregiver as saveSupabaseCaregiver } from '../utils/supabaseClient';

export default function CaregiverDashboard() {
  const navigate = useNavigate();
  const [caregiver, setCaregiver] = useState<any>(null);
  const [children, setChildren] = useState<any[]>([]);
  const [selectedChild, setSelectedChild] = useState<any>(null);
  const [childStats, setChildStats] = useState<any>(null);
  const [showAddChild, setShowAddChild] = useState(false);
  const [newChildName, setNewChildName] = useState('');
  const [newChildAge, setNewChildAge] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showLinkExisting, setShowLinkExisting] = useState(false);
  const [linkUsername, setLinkUsername] = useState('');
  const [linkPassword, setLinkPassword] = useState('');
  const [showNotes, setShowNotes] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [showPrivacySettings, setShowPrivacySettings] = useState(false);
  const [showConsentDialog, setShowConsentDialog] = useState(false);
  const [consentChildUsername, setConsentChildUsername] = useState<string | null>(null);
  const [consentIsRequired, setConsentIsRequired] = useState(false);

  useEffect(() => {
    loadCaregiverData();
  }, []);

  useEffect(() => {
    if (selectedChild) {
      loadChildStats(selectedChild.username);
    }
  }, [selectedChild]);

  // Check for 6-month consent renewals
  useEffect(() => {
    if (!caregiver || children.length === 0) return;

    // Check each child's consent status
    children.forEach((child) => {
      const consent = loadDataConsent(child.username);
      if (consent && consent.lastUpdated) {
        const lastUpdated = new Date(consent.lastUpdated);
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        // If it's been 6+ months since last update, show reminder
        if (lastUpdated <= sixMonthsAgo) {
          // Store reminder flag
          const reminderKey = `consentReminder_${child.username}`;
          const lastReminder = localStorage.getItem(reminderKey);
          
          // Don't show reminder more than once per week
          if (lastReminder) {
            const lastReminderDate = new Date(lastReminder);
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
            if (lastReminderDate > oneWeekAgo) return;
          }

          // Show reminder
          setTimeout(() => {
            if (window.confirm(`📋 Privacy Reminder for ${child.name}\n\nIt's been 6 months since you last reviewed data consent preferences for ${child.name}.\n\nWould you like to review them now?`)) {
              setConsentChildUsername(child.username);
              setConsentIsRequired(false);
              setShowConsentDialog(true);
            }
            // Mark that we showed the reminder
            localStorage.setItem(reminderKey, new Date().toISOString());
          }, 2000); // Show after 2 seconds to not interrupt loading
        }
      }
    });
  }, [children, caregiver]);

  const loadCaregiverData = () => {
    try {
      const stored = localStorage.getItem('currentCaregiver');
      if (!stored) {
        navigate('/caregiver-login');
        return;
      }

      const caregiverData = JSON.parse(stored);
      setCaregiver(caregiverData);

      // Load children from caregiver data AND verify against neuroPlayUsers
      const storedChildren = caregiverData.children || [];
      
      // Cross-reference with neuroPlayUsers to ensure data integrity
      const users = localStorage.getItem('neuroPlayUsers');
      if (users) {
        const allUsers = JSON.parse(users);
        // Filter to only show children that belong to this caregiver
        const verifiedChildren = storedChildren.filter((child: any) => {
          const userAccount = allUsers.find((u: any) => 
            u.username === child.username && u.caregiverId === caregiverData.id
          );
          return userAccount !== undefined;
        });
        
        setChildren(verifiedChildren);
        
        if (verifiedChildren.length > 0) {
          setSelectedChild(verifiedChildren[0]);
        }
      } else {
        setChildren(storedChildren);
        
        if (storedChildren.length > 0) {
          setSelectedChild(storedChildren[0]);
        }
      }
    } catch (err) {
      console.error('Error loading caregiver data:', err);
      setError('Failed to load data.');
    } finally {
      setLoading(false);
    }
  };

  const loadChildStats = (childUsername: string) => {
    try {
      // Load child data from neuroPlayUsers
      const users = localStorage.getItem('neuroPlayUsers');
      if (!users) return;
      
      const allUsers = JSON.parse(users);
      const childUser = allUsers.find((u: any) => u.username === childUsername);
      
      // Security check: Verify the child belongs to this caregiver
      if (childUser && childUser.caregiverId !== caregiver?.id) {
        console.error('Security: Attempted to access child from different caregiver');
        setError('Access denied: This child belongs to a different caregiver.');
        return;
      }
      
      if (childUser && childUser.quizResults) {
        // Extract numeric scores from quizResults
        const results = childUser.quizResults;
        setChildStats({
          averageScores: {
            cognitive: typeof results.cognitive === 'number' ? results.cognitive : 0,
            executive: typeof results.executiveFunction === 'number' ? results.executiveFunction : 0,
            social: typeof results.socialInteraction === 'number' ? results.socialInteraction : 0,
          },
          totalSessions: 1,
          latestSession: {
            completedAt: childUser.completedAt
          },
          preferences: results
        });
      } else {
        setChildStats({ totalSessions: 0 });
      }
    } catch (err) {
      console.error('Error loading child stats:', err);
    }
  };

  const handleAddChild = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChildName) return;

    try {
      // Generate a username from the child's name
      const baseUsername = newChildName.toLowerCase().replace(/\s+/g, '');
      const childAge = newChildAge ? parseInt(newChildAge) : 8;
      
      // Check if username already exists and make it unique
      const existingUsers = localStorage.getItem('neuroPlayUsers');
      const allUsers = existingUsers ? JSON.parse(existingUsers) : [];
      let username = baseUsername;
      let counter = 1;
      while (allUsers.find((u: any) => u.username === username)) {
        username = `${baseUsername}${counter}`;
        counter++;
      }

      // Create the child record for caregiver dashboard
      const newChild = {
        id: Date.now().toString(),
        name: newChildName,
        username: username,
        age: childAge,
        avatar: '👤',
        createdAt: new Date().toISOString(),
        caregiverId: caregiver.id
      };

      // Create a user account for the child in the main system
      const newUser = {
        username: username,
        password: 'child123', // Default password (caregiver can change this)
        role: 'kid',
        age: childAge,
        createdAt: new Date().toISOString(),
        quizCompleted: false,
        quizResults: null,
        theme: 'pastel',
        soundEnabled: true,
        canRetakeQuiz: true,
        childId: newChild.id,
        caregiverId: caregiver.id,
        parentEmail: caregiver.email
      };

      // Add user to neuroPlayUsers
      allUsers.push(newUser);
      localStorage.setItem('neuroPlayUsers', JSON.stringify(allUsers));

      // Update caregiver's children list
      const updatedChildren = [...children, newChild];
      setChildren(updatedChildren);
      
      // Update caregiver in localStorage
      const updatedCaregiver = {
        ...caregiver,
        children: updatedChildren
      };
      
      localStorage.setItem('currentCaregiver', JSON.stringify(updatedCaregiver));
      
      // Update caregivers list
      const caregivers = localStorage.getItem('neuroPlayCaregivers');
      if (caregivers) {
        const allCaregivers = JSON.parse(caregivers);
        const index = allCaregivers.findIndex((c: any) => c.id === caregiver.id);
        if (index !== -1) {
          allCaregivers[index] = updatedCaregiver;
          localStorage.setItem('neuroPlayCaregivers', JSON.stringify(allCaregivers));
        }
      }
      
      setCaregiver(updatedCaregiver);
      setNewChildName('');
      setNewChildAge('');
      setShowAddChild(false);
      
      if (tts.isEnabled()) {
        tts.speak(`Added ${newChildName} to your children. Their username is ${username} and password is child123`);
      }
      
      // Show success message with login credentials
      setError('');
      
      // Show consent dialog for the new child IMMEDIATELY (required before they can play)
      setConsentChildUsername(username);
      setConsentIsRequired(true);
      setShowConsentDialog(true);
      
      // Store the credentials to show after consent is completed
      sessionStorage.setItem('newChildCredentials', JSON.stringify({
        username,
        name: newChildName
      }));
    } catch (err) {
      console.error('Error adding child:', err);
      setError('Failed to add child');
    }
  };

  const handleLinkExisting = (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkUsername || !linkPassword) {
      setError('Please enter both username and password.');
      return;
    }

    try {
      // Load all users
      const usersStr = localStorage.getItem('neuroPlayUsers');
      if (!usersStr) {
        setError('No users found in the system.');
        return;
      }
      
      const allUsers = JSON.parse(usersStr);
      const childUserIndex = allUsers.findIndex((u: any) => u.username === linkUsername);
      
      if (childUserIndex === -1) {
        setError('❌ Username not found. Please check the spelling.');
        return;
      }

      const childUser = allUsers[childUserIndex];

      // Verify password
      if (childUser.password !== linkPassword) {
        setError('❌ Incorrect password. Please try again.');
        return;
      }

      // Check if already linked to another caregiver
      if (childUser.caregiverId && childUser.caregiverId !== caregiver.id) {
        setError('⚠️ This child is already linked to another caregiver.');
        return;
      }

      // Check if already in this caregiver's list
      if (children.find((c: any) => c.username === linkUsername)) {
        setError('ℹ️ This child is already in your list.');
        return;
      }

      // Create child ID if it doesn't exist
      const childId = childUser.childId || `child-${Date.now()}`;

      // Update the user account with caregiver link
      allUsers[childUserIndex] = {
        ...childUser,
        caregiverId: caregiver.id,
        parentEmail: caregiver.email,
        childId: childId
      };
      localStorage.setItem('neuroPlayUsers', JSON.stringify(allUsers));

      // Create child record for caregiver dashboard
      const newChild = {
        id: childId,
        name: childUser.username,
        username: childUser.username,
        age: childUser.age || 8,
        avatar: '👤',
        createdAt: childUser.createdAt || new Date().toISOString(),
        caregiverId: caregiver.id
      };

      // Update caregiver's children list
      const updatedChildren = [...children, newChild];
      setChildren(updatedChildren);
      
      // Update caregiver in localStorage
      const updatedCaregiver = {
        ...caregiver,
        children: updatedChildren
      };
      
      localStorage.setItem('currentCaregiver', JSON.stringify(updatedCaregiver));
      
      // Update caregivers list
      const caregivers = localStorage.getItem('neuroPlayCaregivers');
      if (caregivers) {
        const allCaregivers = JSON.parse(caregivers);
        const index = allCaregivers.findIndex((c: any) => c.id === caregiver.id);
        if (index !== -1) {
          allCaregivers[index] = updatedCaregiver;
          localStorage.setItem('neuroPlayCaregivers', JSON.stringify(allCaregivers));
        }
      }
      
      setCaregiver(updatedCaregiver);
      setLinkUsername('');
      setLinkPassword('');
      setShowLinkExisting(false);
      setError('');
      
      if (tts.isEnabled()) {
        tts.speak(`Successfully linked ${childUser.username} to your account.`);
      }
      
      // Check if this child signed up independently (has default "no consent" settings)
      const existingConsent = loadDataConsent(childUser.username);
      const needsParentalConsent = existingConsent?.childSignedUpIndependently === true;
      
      if (needsParentalConsent) {
        // Show REQUIRED consent dialog for independently signed-up child
        setTimeout(() => {
          alert(`✅ Child linked successfully!\\n\\n⚠️ ${childUser.username} signed up independently.\\n\\nAs their parent/caregiver, you must now set data consent preferences.`);
          setConsentChildUsername(childUser.username);
          setConsentIsRequired(true);
          setShowConsentDialog(true);
        }, 500);
      } else {
        // Show success message
        alert(`✅ Child linked successfully!\\n\\n👤 ${childUser.username} is now connected to your caregiver account.\\n\\n${childUser.quizCompleted ? '📊 You can now view their progress!' : '🎮 They can start taking quizzes!'}`);
      }
    } catch (err) {
      console.error('Error linking child:', err);
      setError('Failed to link child. Please try again.');
    }
  };

  // Admin functions for managing children
  const [showManageChild, setShowManageChild] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [editingPassword, setEditingPassword] = useState(false);

  const getChildUserAccount = (childUsername: string) => {
    const users = localStorage.getItem('neuroPlayUsers');
    if (!users) return null;
    const allUsers = JSON.parse(users);
    return allUsers.find((u: any) => u.username === childUsername && u.caregiverId === caregiver?.id);
  };

  const handleAllowRetake = () => {
    if (!selectedChild) return;
    
    try {
      const users = localStorage.getItem('neuroPlayUsers');
      if (!users) return;
      
      const allUsers = JSON.parse(users);
      const userIndex = allUsers.findIndex((u: any) => 
        u.username === selectedChild.username && u.caregiverId === caregiver.id
      );
      
      if (userIndex !== -1) {
        allUsers[userIndex].canRetakeQuiz = true;
        allUsers[userIndex].quizCompleted = false;
        localStorage.setItem('neuroPlayUsers', JSON.stringify(allUsers));
        
        alert(`✅ ${selectedChild.name} can now retake the quiz!`);
        if (tts.isEnabled()) {
          tts.speak(`${selectedChild.name} can now retake the quiz`);
        }
        loadChildStats(selectedChild.username);
      }
    } catch (err) {
      console.error('Error allowing retake:', err);
      setError('Failed to allow quiz retake.');
    }
  };

  const handleChangePassword = () => {
    if (!selectedChild || !newPassword) return;
    
    if (newPassword.length < 3) {
      alert('⚠️ Password must be at least 3 characters long.');
      return;
    }
    
    try {
      const users = localStorage.getItem('neuroPlayUsers');
      if (!users) return;
      
      const allUsers = JSON.parse(users);
      const userIndex = allUsers.findIndex((u: any) => 
        u.username === selectedChild.username && u.caregiverId === caregiver.id
      );
      
      if (userIndex !== -1) {
        allUsers[userIndex].password = newPassword;
        localStorage.setItem('neuroPlayUsers', JSON.stringify(allUsers));
        
        alert(`✅ Password changed successfully!\n\n👤 Username: ${selectedChild.username}\n🔑 New Password: ${newPassword}`);
        if (tts.isEnabled()) {
          tts.speak(`Password changed successfully for ${selectedChild.name}`);
        }
        setNewPassword('');
        setEditingPassword(false);
      }
    } catch (err) {
      console.error('Error changing password:', err);
      setError('Failed to change password.');
    }
  };

  const handleDeleteChild = () => {
    if (!selectedChild) return;
    
    const confirmed = window.confirm(
      `⚠️ Are you sure you want to remove ${selectedChild.name}?\n\nThis will:\n- Remove them from your caregiver account\n- Delete their user account\n- Erase all their progress\n\nThis action cannot be undone!`
    );
    
    if (!confirmed) return;
    
    try {
      // Remove from neuroPlayUsers
      const users = localStorage.getItem('neuroPlayUsers');
      if (users) {
        const allUsers = JSON.parse(users);
        const filteredUsers = allUsers.filter((u: any) => 
          !(u.username === selectedChild.username && u.caregiverId === caregiver.id)
        );
        localStorage.setItem('neuroPlayUsers', JSON.stringify(filteredUsers));
      }
      
      // Remove from caregiver's children list
      const updatedChildren = children.filter((c: any) => c.id !== selectedChild.id);
      setChildren(updatedChildren);
      
      // Update caregiver in localStorage
      const updatedCaregiver = {
        ...caregiver,
        children: updatedChildren
      };
      localStorage.setItem('currentCaregiver', JSON.stringify(updatedCaregiver));
      
      // Update caregivers list
      const caregivers = localStorage.getItem('neuroPlayCaregivers');
      if (caregivers) {
        const allCaregivers = JSON.parse(caregivers);
        const index = allCaregivers.findIndex((c: any) => c.id === caregiver.id);
        if (index !== -1) {
          allCaregivers[index] = updatedCaregiver;
          localStorage.setItem('neuroPlayCaregivers', JSON.stringify(allCaregivers));
        }
      }
      
      setCaregiver(updatedCaregiver);
      setSelectedChild(updatedChildren.length > 0 ? updatedChildren[0] : null);
      setShowManageChild(false);
      
      alert(`✅ ${selectedChild.name} has been removed.`);
      if (tts.isEnabled()) {
        tts.speak(`${selectedChild.name} has been removed`);
      }
    } catch (err) {
      console.error('Error deleting child:', err);
      setError('Failed to delete child.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('currentCaregiver');
    navigate('/caregiver-login');
  };

  const handleSaveConsent = (consent: any) => {
    if (consentChildUsername) {
      saveDataConsent(consentChildUsername, consent);
      
      // Check if this was a new child signup (credentials stored in sessionStorage)
      const newChildCreds = sessionStorage.getItem('newChildCredentials');
      if (newChildCreds) {
        const { username, name } = JSON.parse(newChildCreds);
        sessionStorage.removeItem('newChildCredentials');
        
        // Show success message with login credentials
        setTimeout(() => {
          alert(`✅ Child added successfully!\n\n👤 Username: ${username}\n🔑 Password: child123\n\n${name} can now log in and start playing!`);
        }, 500);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="text-6xl mb-4"
          >
            🔄
          </motion.div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate('/')}
              className="bg-white text-gray-700 hover:bg-gray-100"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Login
            </Button>
            <div>
              <h1 className="text-gray-800">Caregiver Dashboard</h1>
              <p className="text-gray-600">Welcome, {caregiver?.name}! 👋</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setShowPrivacySettings(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Shield className="w-4 h-4 mr-2" />
              Privacy Settings
            </Button>
            <Button
              onClick={() => {
                // Test button to trigger consent dialog
                if (children.length > 0) {
                  setConsentChildUsername(children[0].username);
                  setConsentIsRequired(true);
                  setShowConsentDialog(true);
                } else {
                  alert('Please add a child first to test the consent dialog');
                }
              }}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              🧪 Test Consent Dialog
            </Button>
            <Button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {error && (
          <div className="bg-yellow-50 border-2 border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg mb-4">
            ⚠️ {error}
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Children List */}
        <div className="lg:col-span-1">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-gray-800 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Children
              </h2>
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    setShowLinkExisting(!showLinkExisting);
                    setShowAddChild(false);
                  }}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                  size="sm"
                  title="Link existing child account"
                >
                  <LinkIcon className="w-4 h-4" />
                </Button>
                <Button
                  onClick={() => {
                    setShowAddChild(!showAddChild);
                    setShowLinkExisting(false);
                  }}
                  className="bg-purple-500 hover:bg-purple-600 text-white"
                  size="sm"
                  title="Add new child"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {showAddChild && (
              <motion.form
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                onSubmit={handleAddChild}
                className="mb-4 p-4 bg-purple-50 rounded-lg"
              >
                <input
                  type="text"
                  placeholder="Child's name"
                  value={newChildName}
                  onChange={(e) => setNewChildName(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-purple-200 rounded-lg mb-2"
                />
                <input
                  type="number"
                  placeholder="Age (optional)"
                  value={newChildAge}
                  onChange={(e) => setNewChildAge(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-purple-200 rounded-lg mb-2"
                />
                <Button type="submit" className="w-full bg-purple-500 hover:bg-purple-600 text-white">
                  Add Child
                </Button>
              </motion.form>
            )}

            {showLinkExisting && (
              <motion.form
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                onSubmit={handleLinkExisting}
                className="mb-4 p-4 bg-purple-50 rounded-lg"
              >
                <input
                  type="text"
                  placeholder="Username"
                  value={linkUsername}
                  onChange={(e) => setLinkUsername(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-purple-200 rounded-lg mb-2"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={linkPassword}
                  onChange={(e) => setLinkPassword(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-purple-200 rounded-lg mb-2"
                />
                <Button type="submit" className="w-full bg-purple-500 hover:bg-purple-600 text-white">
                  Link Existing Child
                </Button>
              </motion.form>
            )}

            <div className="space-y-2">
              {children.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No children added yet. Click + to add a child.
                </p>
              ) : (
                children.map((child) => (
                  <motion.button
                    key={child.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedChild(child)}
                    className={`w-full p-4 rounded-lg text-left transition-all ${
                      selectedChild?.id === child.id
                        ? 'bg-purple-100 border-2 border-purple-400'
                        : 'bg-gray-50 border-2 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-2xl">
                        {child.avatar || '👤'}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{child.name}</p>
                        {child.age && <p className="text-sm text-gray-600">Age {child.age}</p>}
                      </div>
                    </div>
                  </motion.button>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Child Statistics */}
        <div className="lg:col-span-2">
          {selectedChild ? (
            <>
              <Card className="p-6 mb-6">
                <h2 className="text-gray-800 mb-4">
                  {selectedChild.name}'s Progress
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="bg-blue-50 p-4 rounded-xl border-2 border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Brain className="w-5 h-5 text-blue-600" />
                      <p className="font-semibold text-blue-800">Cognitive</p>
                    </div>
                    <p className="text-3xl font-bold text-blue-600">
                      {childStats?.averageScores?.cognitive?.toFixed(1) || '0.0'}
                    </p>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-xl border-2 border-purple-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="w-5 h-5 text-purple-600" />
                      <p className="font-semibold text-purple-800">Executive</p>
                    </div>
                    <p className="text-3xl font-bold text-purple-600">
                      {childStats?.averageScores?.executive?.toFixed(1) || '0.0'}
                    </p>
                  </div>

                  <div className="bg-pink-50 p-4 rounded-xl border-2 border-pink-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Heart className="w-5 h-5 text-pink-600" />
                      <p className="font-semibold text-pink-800">Social</p>
                    </div>
                    <p className="text-3xl font-bold text-pink-600">
                      {childStats?.averageScores?.social?.toFixed(1) || '0.0'}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Button
                    onClick={() => setShowNotes(true)}
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    View Notes
                  </Button>
                  <Button
                    onClick={() => setShowReport(true)}
                    className="bg-green-500 hover:bg-green-600 text-white"
                    disabled={!childStats || childStats.totalSessions === 0}
                  >
                    <Printer className="w-4 h-4 mr-2" />
                    Print Report
                  </Button>
                  <Button
                    onClick={() => setShowManageChild(true)}
                    className="bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Manage Account
                  </Button>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-gray-800 mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Session History
                </h3>

                {childStats?.totalSessions === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">
                      {selectedChild.name} hasn't completed any quizzes yet.
                    </p>
                    <Button
                      onClick={() => {
                        // Save child to localStorage for quiz
                        localStorage.setItem('currentChild', JSON.stringify(selectedChild));
                        // Create a temporary kid account for the quiz
                        const tempUser = {
                          username: selectedChild.name,
                          childId: selectedChild.id,
                          age: selectedChild.age,
                          createdAt: new Date().toISOString(),
                          quizCompleted: false,
                          quizResults: null,
                          theme: 'pastel',
                          soundEnabled: true,
                          canRetakeQuiz: true,
                        };
                        localStorage.setItem('currentUser', JSON.stringify(tempUser));
                        navigate('/quiz');
                      }}
                      className="bg-purple-500 hover:bg-purple-600 text-white"
                    >
                      Start First Quiz 🎮
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border-2 border-green-200">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-green-600" />
                        <div>
                          <p className="font-semibold text-green-800">Total Sessions</p>
                          <p className="text-sm text-green-600">{childStats?.totalSessions || 0} completed</p>
                        </div>
                      </div>
                      <div className="text-3xl font-bold text-green-600">
                        {childStats?.totalSessions || 0}
                      </div>
                    </div>

                    {childStats?.latestSession && (
                      <div className="p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
                        <p className="font-semibold text-gray-800 mb-2">Latest Session</p>
                        <p className="text-sm text-gray-600">
                          Completed: {new Date(childStats.latestSession.completedAt).toLocaleDateString()}
                        </p>
                      </div>
                    )}

                    <h4 className="font-semibold text-gray-800 mt-6 mb-2">Preferences</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                        <p className="text-sm font-semibold text-purple-800 mb-1">Color</p>
                        <p className="text-sm text-purple-600">
                          {Object.keys(childStats?.preferences?.colorPreference || {}).join(', ') || 'Not set'}
                        </p>
                      </div>
                      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-sm font-semibold text-blue-800 mb-1">Sound</p>
                        <p className="text-sm text-blue-600">
                          {Object.keys(childStats?.preferences?.soundPreference || {}).join(', ') || 'Not set'}
                        </p>
                      </div>
                      <div className="p-3 bg-pink-50 rounded-lg border border-pink-200">
                        <p className="text-sm font-semibold text-pink-800 mb-1">Speed</p>
                        <p className="text-sm text-pink-600">
                          {Object.keys(childStats?.preferences?.speedPreference || {}).join(', ') || 'Not set'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            </>
          ) : (
            <Card className="p-12 text-center">
              <div className="text-6xl mb-4">👈</div>
              <p className="text-gray-600">Select a child to view their progress</p>
            </Card>
          )}
        </div>
      </div>

      <AccessibilityMenu />
      
      {/* Caregiver Notes Modal */}
      {showNotes && selectedChild && (
        <CaregiverNotes
          childUsername={selectedChild.username}
          onClose={() => setShowNotes(false)}
        />
      )}
      
      {/* Printable Report Modal */}
      {showReport && selectedChild && childStats && (
        <PrintableReport
          onClose={() => setShowReport(false)}
          childData={{
            name: selectedChild.name,
            username: selectedChild.username,
            age: selectedChild.age,
            completedChallenges: 0,
            sensoryScore: 75,
            cognitiveScore: childStats.averageScores.cognitive || 0,
            executiveScore: childStats.averageScores.executive || 0,
            socialScore: childStats.averageScores.social || 0,
            earnedBadges: [],
          }}
        />
      )}

      {/* Manage Child Account Modal */}
      {showManageChild && selectedChild && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setShowManageChild(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
          >
            <Card className="p-8 max-w-md w-full shadow-2xl border-2 border-orange-200 bg-white">
              <div className="text-center mb-6">
                <div className="bg-gradient-to-br from-orange-400 to-yellow-400 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                  <Settings className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-gray-800 mb-2">Manage {selectedChild.name}'s Account</h2>
                <p className="text-gray-600 text-sm">Full account management controls</p>
              </div>

              <div className="space-y-4">
                {/* View Password Section */}
                <div className="bg-gray-50 p-4 rounded-lg border-2 border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-gray-800 flex items-center gap-2">
                      <Key className="w-4 h-4" />
                      Login Credentials
                    </p>
                    <Button
                      onClick={() => setShowPassword(!showPassword)}
                      size="sm"
                      className="bg-gray-300 hover:bg-gray-400 text-gray-800"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-gray-600">Username:</p>
                      <p className="text-sm font-mono bg-white px-2 py-1 rounded border border-gray-300">{selectedChild.username}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Password:</p>
                      <p className="text-sm font-mono bg-white px-2 py-1 rounded border border-gray-300">
                        {showPassword ? (getChildUserAccount(selectedChild.username)?.password || '****') : '••••••••'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Change Password Section */}
                <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
                  <p className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                    <Edit className="w-4 h-4" />
                    Change Password
                  </p>
                  {editingPassword ? (
                    <div className="space-y-2">
                      <Input
                        type="text"
                        placeholder="New password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="border-2 border-blue-300"
                      />
                      <div className="flex gap-2">
                        <Button
                          onClick={handleChangePassword}
                          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
                          size="sm"
                        >
                          Save
                        </Button>
                        <Button
                          onClick={() => {
                            setEditingPassword(false);
                            setNewPassword('');
                          }}
                          className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800"
                          size="sm"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button
                      onClick={() => setEditingPassword(true)}
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                      size="sm"
                    >
                      Change Password
                    </Button>
                  )}
                </div>

                {/* Allow Quiz Retake */}
                <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200">
                  <p className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                    <RefreshCw className="w-4 h-4" />
                    Quiz Management
                  </p>
                  <Button
                    onClick={handleAllowRetake}
                    className="w-full bg-green-500 hover:bg-green-600 text-white"
                    size="sm"
                  >
                    Allow Quiz Retake
                  </Button>
                  <p className="text-xs text-green-700 mt-2">
                    This will reset the quiz status and allow {selectedChild.name} to take it again.
                  </p>
                </div>

                {/* Delete Account */}
                <div className="bg-red-50 p-4 rounded-lg border-2 border-red-200">
                  <p className="font-semibold text-red-800 mb-2 flex items-center gap-2">
                    <Trash2 className="w-4 h-4" />
                    Danger Zone
                  </p>
                  <Button
                    onClick={handleDeleteChild}
                    className="w-full bg-red-500 hover:bg-red-600 text-white"
                    size="sm"
                  >
                    Delete Account
                  </Button>
                  <p className="text-xs text-red-700 mt-2">
                    ⚠️ This will permanently delete all data. This action cannot be undone!
                  </p>
                </div>
              </div>

              <Button
                onClick={() => setShowManageChild(false)}
                className="w-full mt-6 bg-gray-600 hover:bg-gray-700 text-white"
              >
                Close
              </Button>
            </Card>
          </motion.div>
        </div>
      )}

      {/* Privacy Settings Modal */}
      {showPrivacySettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto" onClick={() => setShowPrivacySettings(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-5xl my-8"
          >
            <Card className="p-8 bg-white max-h-[85vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Shield className="w-6 h-6 text-blue-600" />
                  Privacy & Data Settings
                </h2>
                <Button
                  onClick={() => setShowPrivacySettings(false)}
                  variant="ghost"
                  size="sm"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <PrivacySettings children={children} />
            </Card>
          </motion.div>
        </div>
      )}

      {/* Data Consent Dialog */}
      {showConsentDialog && consentChildUsername && (
        <DataConsentDialog
          isOpen={showConsentDialog}
          onClose={() => {
            setShowConsentDialog(false);
            setConsentChildUsername(null);
            setConsentIsRequired(false);
          }}
          currentConsent={loadDataConsent(consentChildUsername)}
          onSaveConsent={handleSaveConsent}
          childName={children.find((c) => c.username === consentChildUsername)?.name || 'your child'}
          isRequired={consentIsRequired}
        />
      )}
    </div>
  );
}