import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, X, MessageCircle, HelpCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { tts } from '../utils/textToSpeech';

interface VoiceHelperProps {
  show: boolean;
  onClose: () => void;
}

const helperMessages = [
  "Hi! I'm your helper buddy! 👋",
  "Click on any game to start playing!",
  "Need help? Just ask me!",
  "You're doing great! Keep going! ⭐",
];

export function VoiceHelper({ show, onClose }: VoiceHelperProps) {
  const [currentMessage, setCurrentMessage] = useState(0);

  useEffect(() => {
    if (show) {
      const timer = setInterval(() => {
        setCurrentMessage((prev) => (prev + 1) % helperMessages.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [show]);

  const speak = (text: string) => {
    if (tts.isEnabled()) {
      tts.speak(text);
    }
  };

  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        className="fixed bottom-24 left-6 z-50"
      >
        <Card className="bg-gradient-to-br from-purple-500 to-pink-500 text-white p-4 shadow-2xl border-4 border-white max-w-xs">
          <div className="flex items-start gap-3">
            <div className="bg-white rounded-full p-2 flex-shrink-0">
              <MessageCircle className="w-6 h-6 text-purple-500" />
            </div>
            <div className="flex-1">
              <p className="text-lg font-bold mb-2">{helperMessages[currentMessage]}</p>
              <div className="flex gap-2 mt-3">
                <Button
                  size="sm"
                  className="bg-white text-purple-600 hover:bg-purple-50"
                  onClick={() => speak("Click on a game card to start playing! All games are ready for you.")}
                >
                  <Volume2 className="w-4 h-4 mr-1" />
                  Help
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-transparent border-white text-white hover:bg-white hover:text-purple-600"
                  onClick={onClose}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}

// Hook to add voice feedback to any button
export function useVoiceButton(text: string, enabled: boolean = true) {
  const handleMouseEnter = () => {
    if (enabled && tts.isEnabled()) {
      tts.speak(text);
    }
  };

  return {
    onMouseEnter: handleMouseEnter,
    'aria-label': text,
  };
}
