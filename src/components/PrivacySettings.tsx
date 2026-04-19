import { useState, useEffect } from 'react';
import { Shield, Users, AlertTriangle, CheckCircle, Settings, Trash2, Download } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import {
  DataConsentDialog,
  DataConsentSettings,
  loadDataConsent,
  saveDataConsent,
  hasConsentBeenSet,
} from './DataConsentDialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';

interface PrivacySettingsProps {
  children: Array<{ username: string; name: string; age?: number }>;
}

export function PrivacySettings({ children }: PrivacySettingsProps) {
  const [selectedChild, setSelectedChild] = useState<string | null>(null);
  const [showConsentDialog, setShowConsentDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [childToDelete, setChildToDelete] = useState<string | null>(null);
  const [consentData, setConsentData] = useState<Record<string, DataConsentSettings>>({});

  useEffect(() => {
    // Load consent data for all children
    const data: Record<string, DataConsentSettings> = {};
    children.forEach((child) => {
      const consent = loadDataConsent(child.username);
      if (consent) {
        data[child.username] = consent;
      }
    });
    setConsentData(data);
  }, [children]);

  const handleOpenConsent = (username: string) => {
    setSelectedChild(username);
    setShowConsentDialog(true);
  };

  const handleSaveConsent = (consent: DataConsentSettings) => {
    if (selectedChild) {
      saveDataConsent(selectedChild, consent);
      setConsentData({ ...consentData, [selectedChild]: consent });
    }
  };

  const handleRequestDataDeletion = (username: string) => {
    setChildToDelete(username);
    setShowDeleteDialog(true);
  };

  const confirmDataDeletion = () => {
    if (childToDelete) {
      // Remove consent data
      localStorage.removeItem(`dataConsent_${childToDelete}`);
      
      // Update state
      const newConsentData = { ...consentData };
      delete newConsentData[childToDelete];
      setConsentData(newConsentData);
      
      setShowDeleteDialog(false);
      setChildToDelete(null);
      
      alert(`All stored consent preferences for this child have been removed.`);
    }
  };

  const handleExportData = (username: string) => {
    // Export child's data as JSON
    const childData = {
      username,
      consent: consentData[username],
      exportDate: new Date().toISOString(),
      gameData: localStorage.getItem(`gameData_${username}`),
      profile: localStorage.getItem(`profile_${username}`),
    };

    const dataStr = JSON.stringify(childData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `neuroplay-data-${username}-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getConsentStatus = (username: string) => {
    const consent = consentData[username];
    if (!consent) return { status: 'not-set', label: 'Not Set', color: 'gray' };

    const hasAnyConsent =
      consent.allowDevelopmentData ||
      consent.allowAnonymizedAnalytics ||
      consent.allowGameplayImprovement;

    if (hasAnyConsent) {
      return { status: 'opted-in', label: 'Partially or Fully Opted In', color: 'green' };
    } else {
      return { status: 'opted-out', label: 'All Opted Out', color: 'orange' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Shield className="w-8 h-8 text-blue-600" />
        <div>
          <h2 className="text-2xl font-bold">Privacy & Data Settings</h2>
          <p className="text-gray-600">Manage data consent preferences for your children</p>
        </div>
      </div>

      {/* Important Information */}
      <Alert className="border-blue-200 bg-blue-50">
        <AlertTriangle className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-900">
          <strong>Your Rights:</strong> You have the right to view, export, or delete your child's
          data at any time. All data is stored securely and never shared with third parties without
          your explicit consent.
        </AlertDescription>
      </Alert>

      {/* Children List */}
      <div className="space-y-4">
        {children.length === 0 ? (
          <Card className="p-8 text-center">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">No children added yet. Add a child to manage privacy settings.</p>
          </Card>
        ) : (
          children.map((child) => {
            const status = getConsentStatus(child.username);
            const consent = consentData[child.username];

            return (
              <Card key={child.username} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold">{child.name}</h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          status.color === 'green'
                            ? 'bg-green-100 text-green-700'
                            : status.color === 'orange'
                            ? 'bg-orange-100 text-orange-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {status.label}
                      </span>
                    </div>

                    {consent ? (
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          {consent.allowDevelopmentData ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <AlertTriangle className="w-4 h-4 text-gray-400" />
                          )}
                          <span>
                            Development Data:{' '}
                            {consent.allowDevelopmentData ? 'Allowed' : 'Not Allowed'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {consent.allowAnonymizedAnalytics ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <AlertTriangle className="w-4 h-4 text-gray-400" />
                          )}
                          <span>
                            Analytics: {consent.allowAnonymizedAnalytics ? 'Allowed' : 'Not Allowed'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {consent.allowGameplayImprovement ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <AlertTriangle className="w-4 h-4 text-gray-400" />
                          )}
                          <span>
                            Gameplay Improvement:{' '}
                            {consent.allowGameplayImprovement ? 'Allowed' : 'Not Allowed'}
                          </span>
                        </div>
                        {consent.lastUpdated && (
                          <p className="text-xs text-gray-500 mt-2">
                            Last updated: {new Date(consent.lastUpdated).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-600">
                        Consent preferences have not been set for this child.
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    <Button
                      onClick={() => handleOpenConsent(child.username)}
                      variant="outline"
                      size="sm"
                      className="whitespace-nowrap"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      {consent ? 'Update' : 'Set'} Consent
                    </Button>
                    <Button
                      onClick={() => handleExportData(child.username)}
                      variant="outline"
                      size="sm"
                      className="whitespace-nowrap"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export Data
                    </Button>
                    <Button
                      onClick={() => handleRequestDataDeletion(child.username)}
                      variant="outline"
                      size="sm"
                      className="whitespace-nowrap text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Data
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* Privacy Policy Link */}
      <Card className="p-4 bg-gray-50">
        <p className="text-sm text-gray-700">
          For more information about how we handle data, please review our{' '}
          <a href="#" className="text-blue-600 hover:underline font-medium">
            Privacy Policy
          </a>{' '}
          and{' '}
          <a href="#" className="text-blue-600 hover:underline font-medium">
            Terms of Service
          </a>
          .
        </p>
      </Card>

      {/* Consent Dialog */}
      {selectedChild && (
        <DataConsentDialog
          isOpen={showConsentDialog}
          onClose={() => {
            setShowConsentDialog(false);
            setSelectedChild(null);
          }}
          currentConsent={consentData[selectedChild]}
          onSaveConsent={handleSaveConsent}
          childName={children.find((c) => c.username === selectedChild)?.name || 'your child'}
          isRequired={false}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete All Data?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete all stored consent preferences for this child. This action
              cannot be undone. The child's game progress and profile will remain intact, but all
              consent records will be removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDataDeletion} className="bg-red-600 hover:bg-red-700">
              Delete Data
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
