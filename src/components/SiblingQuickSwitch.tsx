import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Users, LogIn, X } from 'lucide-react';
import { useNavigate } from 'react-router';
import { AvatarDisplay } from './AvatarDisplay';

interface SiblingProfile {
  username: string;
  name?: string;
  avatar?: {
    character: string;
    accessory: string;
    background: string;
  };
}

export function SiblingQuickSwitch() {
  const [show, setShow] = useState(false);
  const [siblings, setSiblings] = useState<SiblingProfile[]>([]);
  const [currentUser, setCurrentUser] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    // Load all kid users
    const users = JSON.parse(localStorage.getItem('neuroPlayUsers') || '[]');
    const current = JSON.parse(localStorage.getItem('currentUser') || '{}');
    setCurrentUser(current.username);
    
    // Debug logging
    console.log('🔍 DEBUG - Current User:', current);
    console.log('🔍 DEBUG - Current caregiverId:', current.caregiverId);
    console.log('🔍 DEBUG - All users:', users);
    
    // Only show siblings who have the same caregiver
    const currentCaregiverId = current.caregiverId;
    
    if (!currentCaregiverId) {
      // No caregiver linked - can't have siblings
      console.log('❌ No caregiverId found for current user');
      setSiblings([]);
      return;
    }
    
    const kidUsers = users.filter((u: any) => {
      const isKid = u.role === 'kid';
      const isDifferentUser = u.username !== current.username;
      const hasSameCaregiver = u.caregiverId === currentCaregiverId;
      
      console.log(`🔍 Checking user ${u.username}:`, { isKid, isDifferentUser, hasSameCaregiver, caregiverId: u.caregiverId });
      
      return isKid && isDifferentUser && hasSameCaregiver;
    });
    
    console.log('✅ Filtered siblings:', kidUsers);
    setSiblings(kidUsers);
  }, [show]);

  const switchToUser = (username: string) => {
    const users = JSON.parse(localStorage.getItem('neuroPlayUsers') || '[]');
    const user = users.find((u: any) => u.username === username);
    
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      setShow(false);
      // Reload page to update dashboard
      window.location.reload();
    }
  };

  const logout = () => {
    if (confirm('Logout and return to login screen?')) {
      localStorage.removeItem('currentUser');
      navigate('/');
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShow(true)}
        className="fixed top-4 right-4 bg-purple-500 hover:bg-purple-600 text-white rounded-full p-3 shadow-lg border-4 border-white z-40"
        title="Switch Profile"
      >
        <Users className="w-6 h-6" />
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-md"
            >
              <Card className="p-6 bg-white">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-gray-800 font-bold">Switch Profile</h3>
                  <button
                    onClick={() => setShow(false)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                <div className="space-y-3 mb-6">
                  {siblings.length === 0 && (
                    <Card className="p-6 text-center bg-blue-50 border-2 border-blue-200">
                      <div className="text-5xl mb-3">👨‍👩‍👧‍👦</div>
                      <p className="text-gray-700 font-semibold mb-2">No Siblings Found</p>
                      <p className="text-sm text-gray-600 mb-4">
                        You can only switch between siblings who share the same parent/caregiver account.
                      </p>
                      <div className="bg-white rounded-lg p-4 border border-blue-300 text-left">
                        <p className="text-xs text-gray-600 mb-2">
                          <strong>📝 How sibling switching works:</strong>
                        </p>
                        <ul className="text-xs text-gray-600 space-y-1 ml-4">
                          <li>• Your parent/caregiver creates a Caregiver account</li>
                          <li>• They add all siblings through the Caregiver Dashboard</li>
                          <li>• All kids under the same parent can switch instantly!</li>
                        </ul>
                        <div className="mt-3 pt-3 border-t border-blue-200">
                          <p className="text-xs text-blue-700">
                            <strong>Ask your parent</strong> to log into the <strong>Caregiver Portal</strong> and click <strong>"Add New Child"</strong> to add your siblings!
                          </p>
                        </div>
                      </div>
                    </Card>
                  )}

                  {siblings.map((sibling) => (
                    <motion.button
                      key={sibling.username}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => switchToUser(sibling.username)}
                      disabled={sibling.username === currentUser}
                      className={`w-full p-4 rounded-xl border-4 transition-all flex items-center gap-4 ${
                        sibling.username === currentUser
                          ? 'bg-purple-100 border-purple-500 cursor-default'
                          : 'bg-gray-50 border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      {sibling.avatar ? (
                        <AvatarDisplay avatar={sibling.avatar} size="sm" />
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-2xl">
                          👤
                        </div>
                      )}
                      <div className="flex-1 text-left">
                        <p className="font-bold text-gray-800">
                          {sibling.name || sibling.username}
                        </p>
                        {sibling.username === currentUser && (
                          <p className="text-sm text-purple-600">Current Profile</p>
                        )}
                      </div>
                      {sibling.username !== currentUser && (
                        <LogIn className="w-5 h-5 text-gray-400" />
                      )}
                    </motion.button>
                  ))}
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={logout}
                    variant="outline"
                    className="flex-1 border-gray-300"
                  >
                    Logout
                  </Button>
                  <Button
                    onClick={() => setShow(false)}
                    className="flex-1 bg-purple-500 hover:bg-purple-600 text-white"
                  >
                    Cancel
                  </Button>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}