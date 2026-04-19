import { RouterProvider } from 'react-router';
import { router } from './routes';

export interface GameData {
  sensory: {
    colorPreference?: 'bright' | 'soft';
    soundPreference?: 'gentle' | 'upbeat' | 'silence';
    speedPreference?: 'fast' | 'slow';
  };
  cognitive: {
    patternRecognition?: number;
    visualReasoning?: number;
    visualMemory?: number;
    sequencing?: number;
    symbolRecognition?: number;
  };
  executiveFunction: {
    flexibility?: number;
    multiStep?: number;
    impulseControl?: number;
    persistence?: number;
  };
  socialInteraction: {
    emotionRecognition?: number;
    turnTaking?: number;
    socialCues?: number;
  };
}

export default function App() {
  return <RouterProvider router={router} />;
}