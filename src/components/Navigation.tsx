import { motion } from 'motion/react';
import { useNavigate, useLocation } from 'react-router';
import { Home, Play, Trophy, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';

export function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const isQuizPage = location.pathname === '/quiz';

  if (isQuizPage) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-4 left-4 z-50"
      >
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            if (confirm('Are you sure you want to leave? Your progress will be lost.')) {
              navigate('/');
            }
          }}
          className="bg-white/90 backdrop-blur-sm shadow-lg"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Exit Quiz
        </Button>
      </motion.div>
    );
  }

  return null;
}
