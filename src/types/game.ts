export interface GameData {
  sensory: {
    colorPreference?: 'bright' | 'soft' | 'pastel';
    soundPreference?: 'gentle' | 'upbeat' | 'silence';
    speedPreference?: 'fast' | 'slow' | 'steady';
  };
  cognitive: {
    patternRecognition?: number | boolean;
    visualReasoning?: number | boolean;
    visualMemory?: number | boolean;
    memory?: number | boolean;
    sequencing?: number | boolean;
    symbolRecognition?: number | boolean;
  };
  executiveFunction: {
    flexibility?: number | boolean;
    ruleSwitching?: number | boolean;
    multiStep?: number | boolean;
    impulseControl?: number | boolean;
    persistence?: number | boolean;
  };
  socialInteraction: {
    emotionRecognition?: number | boolean;
    turnTaking?: number | boolean;
    socialCues?: number | boolean;
  };
}