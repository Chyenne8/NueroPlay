import { motion } from "framer-motion";
import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { X, Volume2, Play } from 'lucide-react';
import { tts } from '../utils/textToSpeech';

interface TTSSettingsProps {
  onClose: () => void;
}

export function TTSSettings({ onClose }: TTSSettingsProps) {
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [volume, setVolume] = useState(1);
  const [selectedVoice, setSelectedVoice] = useState<number>(0);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    // Load saved settings
    const savedSettings = localStorage.getItem('ttsSettings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setRate(settings.rate || 1);
      setPitch(settings.pitch || 1);
      setVolume(settings.volume || 1);
      setSelectedVoice(settings.voiceIndex || 0);
    }

    // Load available voices
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const saveSettings = () => {
    const settings = {
      rate,
      pitch,
      volume,
      voiceIndex: selectedVoice,
    };
    localStorage.setItem('ttsSettings', JSON.stringify(settings));
    tts.setRate(rate);
    tts.setPitch(pitch);
    tts.setVolume(volume);
    if (voices[selectedVoice]) {
      tts.setVoice(voices[selectedVoice]);
    }
  };

  const testVoice = () => {
    saveSettings();
    tts.speak('This is how I sound! Do you like my voice?');
  };

  const handleSave = () => {
    saveSettings();
    tts.speak('Settings saved!');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-2xl"
      >
        <Card className="p-6 bg-white">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-gray-800 mb-1 flex items-center gap-2">
                <Volume2 className="w-6 h-6 text-purple-500" />
                Voice Settings
              </h2>
              <p className="text-gray-600">Customize how I speak to you</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          {/* Voice Selection */}
          {voices.length > 0 && (
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">
                Choose Voice
              </label>
              <select
                value={selectedVoice}
                onChange={(e) => setSelectedVoice(Number(e.target.value))}
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
              >
                {voices.map((voice, index) => (
                  <option key={index} value={index}>
                    {voice.name} ({voice.lang})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Speed */}
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">
              Speaking Speed: {rate.toFixed(1)}x
            </label>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Slow</span>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                className="flex-1 h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
              <span className="text-sm text-gray-600">Fast</span>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0.5x</span>
              <span>1.0x (Normal)</span>
              <span>2.0x</span>
            </div>
          </div>

          {/* Pitch */}
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">
              Voice Pitch: {pitch.toFixed(1)}
            </label>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Low</span>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={pitch}
                onChange={(e) => setPitch(Number(e.target.value))}
                className="flex-1 h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <span className="text-sm text-gray-600">High</span>
            </div>
          </div>

          {/* Volume */}
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">
              Volume: {Math.round(volume * 100)}%
            </label>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Quiet</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="flex-1 h-2 bg-green-200 rounded-lg appearance-none cursor-pointer accent-green-500"
              />
              <span className="text-sm text-gray-600">Loud</span>
            </div>
          </div>

          {/* Test Button */}
          <Button
            onClick={testVoice}
            className="w-full mb-4 bg-blue-500 hover:bg-blue-600 text-white"
          >
            <Play className="w-5 h-5 mr-2" />
            Test Voice
          </Button>

          {/* Save Button */}
          <div className="flex gap-3">
            <Button
              onClick={handleSave}
              className="flex-1 bg-purple-500 hover:bg-purple-600 text-white"
            >
              Save Settings
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className="border-gray-300"
            >
              Cancel
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
