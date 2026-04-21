import { useState, useEffect } from 'react';
import { Volume2, VolumeX, Eye, EyeOff, Palette, Type, Minus, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { tts } from '../utils/textToSpeech';

export function AccessibilityMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(tts.isEnabled());
  const [highContrast, setHighContrast] = useState(
    localStorage.getItem('highContrast') === 'true'
  );
  const [reducedMotion, setReducedMotion] = useState(
    localStorage.getItem('reducedMotion') === 'true'
  );
  const [fontSize, setFontSize] = useState(
    localStorage.getItem('fontSize') || 'medium'
  );

  useEffect(() => {
    if (highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  }, [highContrast]);

  useEffect(() => {
    if (reducedMotion) {
      document.body.classList.add('reduced-motion');
    } else {
      document.body.classList.remove('reduced-motion');
    }
  }, [reducedMotion]);

  useEffect(() => {
    // Remove all font size classes
    document.body.classList.remove('font-small', 'font-medium', 'font-large', 'font-xlarge');
    // Add the current font size class
    document.body.classList.add(`font-${fontSize}`);
  }, [fontSize]);

  const toggleTTS = () => {
    const newValue = !ttsEnabled;
    setTtsEnabled(newValue);
    tts.setEnabled(newValue);
    if (newValue) {
      tts.speak('Text to speech is now on');
    }
  };

  const toggleHighContrast = () => {
    const newValue = !highContrast;
    setHighContrast(newValue);
    localStorage.setItem('highContrast', newValue.toString());
    if (ttsEnabled) {
      tts.speak(newValue ? 'High contrast mode on' : 'High contrast mode off');
    }
  };

  const toggleReducedMotion = () => {
    const newValue = !reducedMotion;
    setReducedMotion(newValue);
    localStorage.setItem('reducedMotion', newValue.toString());
    if (ttsEnabled) {
      tts.speak(newValue ? 'Calm mode on' : 'Calm mode off');
    }
  };

  const increaseFontSize = () => {
    const sizes = ['small', 'medium', 'large', 'xlarge'];
    const currentIndex = sizes.indexOf(fontSize);
    if (currentIndex < sizes.length - 1) {
      const newValue = sizes[currentIndex + 1];
      setFontSize(newValue);
      localStorage.setItem('fontSize', newValue);
      if (ttsEnabled) {
        tts.speak(`Font size increased to ${newValue}`);
      }
    }
  };

  const decreaseFontSize = () => {
    const sizes = ['small', 'medium', 'large', 'xlarge'];
    const currentIndex = sizes.indexOf(fontSize);
    if (currentIndex > 0) {
      const newValue = sizes[currentIndex - 1];
      setFontSize(newValue);
      localStorage.setItem('fontSize', newValue);
      if (ttsEnabled) {
        tts.speak(`Font size decreased to ${newValue}`);
      }
    }
  };

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="bg-white rounded-2xl shadow-2xl p-4 mb-3 border-4 border-purple-200"
          >
            <h3 className="font-bold text-purple-700 mb-3 text-center text-lg">
              Help Me Read & See
            </h3>

            <div className="space-y-2">
              {/* Text to Speech Toggle */}
              <button
                onClick={toggleTTS}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                  ttsEnabled
                    ? 'bg-green-100 border-2 border-green-400'
                    : 'bg-gray-100 border-2 border-gray-300'
                }`}
              >
                {ttsEnabled ? (
                  <Volume2 className="w-6 h-6 text-green-600" />
                ) : (
                  <VolumeX className="w-6 h-6 text-gray-500" />
                )}
                <div className="flex-1 text-left">
                  <p className="font-semibold text-sm">Read to Me</p>
                  <p className="text-xs text-gray-600">
                    {ttsEnabled ? 'On' : 'Off'}
                  </p>
                </div>
              </button>

              {/* High Contrast Toggle */}
              <button
                onClick={toggleHighContrast}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                  highContrast
                    ? 'bg-blue-100 border-2 border-blue-400'
                    : 'bg-gray-100 border-2 border-gray-300'
                }`}
              >
                {highContrast ? (
                  <Eye className="w-6 h-6 text-blue-600" />
                ) : (
                  <EyeOff className="w-6 h-6 text-gray-500" />
                )}
                <div className="flex-1 text-left">
                  <p className="font-semibold text-sm">Bold Colors</p>
                  <p className="text-xs text-gray-600">
                    {highContrast ? 'On' : 'Off'}
                  </p>
                </div>
              </button>

              {/* Reduced Motion Toggle */}
              <button
                onClick={toggleReducedMotion}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                  reducedMotion
                    ? 'bg-purple-100 border-2 border-purple-400'
                    : 'bg-gray-100 border-2 border-gray-300'
                }`}
              >
                <Palette className={`w-6 h-6 ${reducedMotion ? 'text-purple-600' : 'text-gray-500'}`} />
                <div className="flex-1 text-left">
                  <p className="font-semibold text-sm">Calm Mode</p>
                  <p className="text-xs text-gray-600">
                    {reducedMotion ? 'On' : 'Off'}
                  </p>
                </div>
              </button>

              {/* Font Size Adjustments */}
              <div className="bg-orange-100 border-2 border-orange-300 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Type className="w-5 h-5 text-orange-600" />
                  <p className="font-semibold text-sm text-gray-800">Text Size</p>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <button
                    onClick={decreaseFontSize}
                    disabled={fontSize === 'small'}
                    className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all ${
                      fontSize === 'small'
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-white border-2 border-orange-300 hover:bg-orange-50'
                    }`}
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <div className="flex-1 text-center">
                    <p className="text-xs text-gray-600 capitalize">{fontSize}</p>
                    <div className="flex items-center justify-center gap-1 mt-1">
                      <div className={`h-2 w-2 rounded-full ${fontSize === 'small' || fontSize === 'medium' || fontSize === 'large' || fontSize === 'xlarge' ? 'bg-orange-500' : 'bg-gray-300'}`} />
                      <div className={`h-2 w-2 rounded-full ${fontSize === 'medium' || fontSize === 'large' || fontSize === 'xlarge' ? 'bg-orange-500' : 'bg-gray-300'}`} />
                      <div className={`h-2 w-2 rounded-full ${fontSize === 'large' || fontSize === 'xlarge' ? 'bg-orange-500' : 'bg-gray-300'}`} />
                      <div className={`h-2 w-2 rounded-full ${fontSize === 'xlarge' ? 'bg-orange-500' : 'bg-gray-300'}`} />
                    </div>
                  </div>
                  <button
                    onClick={increaseFontSize}
                    disabled={fontSize === 'xlarge'}
                    className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all ${
                      fontSize === 'xlarge'
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-white border-2 border-orange-300 hover:bg-orange-50'
                    }`}
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="bg-purple-500 hover:bg-purple-600 text-white rounded-full p-4 shadow-lg border-4 border-white"
      >
        <div className="w-8 h-8 flex items-center justify-center">
          <span className="text-2xl">⚙️</span>
        </div>
      </motion.button>
    </div>
  );
}