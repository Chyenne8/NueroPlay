import { useState, useEffect } from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { isApiAvailable } from '../utils/api';

export function ApiStatusBadge() {
  const [status, setStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  useEffect(() => {
    checkStatus();
    const interval = setInterval(checkStatus, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const checkStatus = async () => {
    const available = await isApiAvailable();
    setStatus(available ? 'online' : 'offline');
  };

  if (status === 'checking') {
    return null;
  }

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs ${
        status === 'online'
          ? 'bg-green-100 text-green-700 border border-green-300'
          : 'bg-gray-100 text-gray-600 border border-gray-300'
      }`}
    >
      {status === 'online' ? (
        <>
          <Wifi className="w-3 h-3" />
          <span>Database Connected</span>
        </>
      ) : (
        <>
          <WifiOff className="w-3 h-3" />
          <span>Offline Mode</span>
        </>
      )}
    </div>
  );
}
