import { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Shield, AlertCircle, Check, X, Info, Lock, Database, Eye, Users } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';
import { Alert, AlertDescription } from './ui/alert';

export interface DataConsentSettings {
  allowDevelopmentData: boolean;
  allowAnonymizedAnalytics: boolean;
  allowGameplayImprovement: boolean;
  consentDate?: string;
  lastUpdated?: string;
}

interface DataConsentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentConsent?: DataConsentSettings;
  onSaveConsent: (consent: DataConsentSettings) => void;
  childName?: string;
  isRequired?: boolean; // For first-time setup
}

export function DataConsentDialog({
  isOpen,
  onClose,
  currentConsent,
  onSaveConsent,
  childName = 'your child',
  isRequired = false,
}: DataConsentDialogProps) {
  const [consent, setConsent] = useState<DataConsentSettings>(
    currentConsent || {
      allowDevelopmentData: false,
      allowAnonymizedAnalytics: false,
      allowGameplayImprovement: false,
    }
  );

  const [showDetails, setShowDetails] = useState(false);

  const handleSave = () => {
    const updatedConsent = {
      ...consent,
      consentDate: currentConsent?.consentDate || new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    };
    onSaveConsent(updatedConsent);
    onClose();
  };

  const dataUsageDetails = [
    {
      title: 'Development & Research',
      icon: Database,
      description: 'Help us improve NeuroPlay by allowing anonymous game data for development',
      includes: [
        'Game completion rates and challenge difficulty',
        'Feature usage patterns (anonymized)',
        'Error reports and technical issues',
        'Time spent on different activities',
      ],
      excludes: [
        'Personal names or identifiable information',
        'Exact dates of birth',
        'Email addresses or contact information',
        'Location data',
      ],
      key: 'allowDevelopmentData' as keyof DataConsentSettings,
    },
    {
      title: 'Analytics',
      icon: Eye,
      description: 'Anonymous analytics to understand how NeuroPlay is used',
      includes: [
        'Which games are most engaging',
        'Session duration statistics',
        'Device and browser type (technical)',
        'Feature popularity metrics',
      ],
      excludes: [
        'Individual user tracking',
        'Personal information',
        'Specific gameplay recordings',
        'Communication content',
      ],
      key: 'allowAnonymizedAnalytics' as keyof DataConsentSettings,
    },
    {
      title: 'Gameplay Improvement',
      icon: Users,
      description: 'Use aggregated data to make challenges more effective and engaging',
      includes: [
        'Challenge difficulty adjustments',
        'Recommendations algorithm improvement',
        'Accessibility feature enhancement',
        'Age-appropriate content suggestions',
      ],
      excludes: [
        'Sharing data with third parties',
        'Selling or marketing data',
        'Individual profile analysis',
        'Cross-platform tracking',
      ],
      key: 'allowGameplayImprovement' as keyof DataConsentSettings,
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={isRequired ? undefined : onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-blue-100 p-3 rounded-full">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <DialogTitle className="text-2xl">Privacy & Data Consent</DialogTitle>
          </div>
          <DialogDescription className="text-base">
            Your child's privacy is our top priority. You have complete control over how we use
            data from {childName}'s NeuroPlay experience.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 my-4">
          {/* Privacy Guarantee */}
          <Alert className="border-green-200 bg-green-50">
            <Lock className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-900">
              <strong>Our Promise:</strong> All data is stored securely, never sold to third
              parties, and can be deleted at any time upon request.
            </AlertDescription>
          </Alert>

          {/* What We Never Collect */}
          <Card className="p-4 bg-purple-50 border-purple-200">
            <h3 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
              <X className="w-5 h-5" />
              What We NEVER Collect
            </h3>
            <ul className="text-sm text-purple-800 space-y-1 ml-7">
              <li>• Photographs or videos of your child</li>
              <li>• Audio recordings of speech or sounds</li>
              <li>• Exact location or GPS data</li>
              <li>• Contact information (email, phone, address)</li>
              <li>• Medical or diagnostic information</li>
              <li>• Third-party tracking cookies</li>
            </ul>
          </Card>

          {/* Consent Options */}
          <div className="space-y-3">
            {dataUsageDetails.map((item, index) => (
              <Card key={index} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3">
                  <Checkbox
                    id={item.key}
                    checked={consent[item.key] as boolean}
                    onCheckedChange={(checked) =>
                      setConsent({ ...consent, [item.key]: checked as boolean })
                    }
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <Label
                      htmlFor={item.key}
                      className="text-base font-semibold flex items-center gap-2 cursor-pointer"
                    >
                      <item.icon className="w-5 h-5 text-blue-600" />
                      {item.title}
                    </Label>
                    <p className="text-sm text-gray-600 mt-1">{item.description}</p>

                    {showDetails && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-3 space-y-2"
                      >
                        <div className="bg-green-50 p-3 rounded-md border border-green-200">
                          <p className="text-xs font-semibold text-green-800 mb-1 flex items-center gap-1">
                            <Check className="w-3 h-3" /> INCLUDES:
                          </p>
                          <ul className="text-xs text-green-700 space-y-0.5 ml-4">
                            {item.includes.map((inc, i) => (
                              <li key={i}>• {inc}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="bg-red-50 p-3 rounded-md border border-red-200">
                          <p className="text-xs font-semibold text-red-800 mb-1 flex items-center gap-1">
                            <X className="w-3 h-3" /> EXCLUDES:
                          </p>
                          <ul className="text-xs text-red-700 space-y-0.5 ml-4">
                            {item.excludes.map((exc, i) => (
                              <li key={i}>• {exc}</li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Show/Hide Details Toggle */}
          <Button
            variant="ghost"
            onClick={() => setShowDetails(!showDetails)}
            className="w-full text-blue-600 hover:text-blue-700"
          >
            <Info className="w-4 h-4 mr-2" />
            {showDetails ? 'Hide' : 'Show'} Detailed Information
          </Button>

          {/* Important Notice */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>You can change these settings anytime</strong> in the Settings menu. Opting
              out will not affect your child's ability to play NeuroPlay games.
            </AlertDescription>
          </Alert>

          {/* All options declined notice */}
          {!consent.allowDevelopmentData &&
            !consent.allowAnonymizedAnalytics &&
            !consent.allowGameplayImprovement && (
              <Alert className="border-orange-200 bg-orange-50">
                <Info className="h-4 w-4 text-orange-600" />
                <AlertDescription className="text-orange-900">
                  You've opted out of all data collection. Your child can still enjoy all NeuroPlay
                  features, but we won't be able to use their gameplay to improve the platform for
                  other children.
                </AlertDescription>
              </Alert>
            )}
        </div>

        <DialogFooter className="gap-2">
          {!isRequired && (
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          )}
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
            <Check className="w-4 h-4 mr-2" />
            Save Preferences
          </Button>
        </DialogFooter>

        {/* Last Updated Info */}
        {currentConsent?.lastUpdated && (
          <p className="text-xs text-gray-500 text-center mt-2">
            Last updated: {new Date(currentConsent.lastUpdated).toLocaleDateString()}
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}

/**
 * Helper function to save consent to localStorage
 */
export function saveDataConsent(username: string, consent: DataConsentSettings) {
  const key = `dataConsent_${username}`;
  localStorage.setItem(key, JSON.stringify(consent));
}

/**
 * Helper function to load consent from localStorage
 */
export function loadDataConsent(username: string): DataConsentSettings | null {
  const key = `dataConsent_${username}`;
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : null;
}

/**
 * Helper function to check if consent has been given
 */
export function hasConsentBeenSet(username: string): boolean {
  const consent = loadDataConsent(username);
  return consent !== null && consent.consentDate !== undefined;
}
