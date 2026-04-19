import { useState, useEffect } from 'react';
import { Database, Cloud, HardDrive, CheckCircle, XCircle } from 'lucide-react';
import { isSupabaseConfigured } from '../utils/supabaseClient';
import { Badge } from './ui/badge';

export function SupabaseStatus() {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = () => {
    setIsLoading(true);
    const connected = isSupabaseConfigured();
    setIsConnected(connected);
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <Badge className="bg-gray-100 text-gray-700 border-gray-300">
        <Database className="w-3 h-3 mr-1 animate-pulse" />
        Checking...
      </Badge>
    );
  }

  if (isConnected) {
    return (
      <Badge className="bg-green-100 text-green-700 border-green-300">
        <Cloud className="w-3 h-3 mr-1" />
        Supabase Connected
      </Badge>
    );
  }

  return (
    <Badge className="bg-orange-100 text-orange-700 border-orange-300">
      <HardDrive className="w-3 h-3 mr-1" />
      localStorage Only
    </Badge>
  );
}

export function SupabaseStatusCard() {
  const [isConnected, setIsConnected] = useState(false);
  const [details, setDetails] = useState({
    url: '',
    keySet: false
  });

  useEffect(() => {
    const connected = isSupabaseConfigured();
    setIsConnected(connected);
    
    setDetails({
      url: import.meta.env.VITE_SUPABASE_URL || 'Not set',
      keySet: !!import.meta.env.VITE_SUPABASE_ANON_KEY
    });
  }, []);

  return (
    <div className={`p-6 rounded-lg border-2 ${
      isConnected 
        ? 'bg-green-50 border-green-200' 
        : 'bg-orange-50 border-orange-200'
    }`}>
      <div className="flex items-center gap-3 mb-4">
        {isConnected ? (
          <div className="bg-green-200 rounded-full p-3">
            <Cloud className="w-6 h-6 text-green-700" />
          </div>
        ) : (
          <div className="bg-orange-200 rounded-full p-3">
            <HardDrive className="w-6 h-6 text-orange-700" />
          </div>
        )}
        <div>
          <h3 className={`font-semibold ${
            isConnected ? 'text-green-900' : 'text-orange-900'
          }`}>
            Database Connection
          </h3>
          <p className={`text-sm ${
            isConnected ? 'text-green-700' : 'text-orange-700'
          }`}>
            {isConnected ? 'Cloud database active' : 'Using local storage'}
          </p>
        </div>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between py-2 border-b border-gray-200">
          <span className="text-gray-700">Status</span>
          <Badge className={
            isConnected 
              ? 'bg-green-100 text-green-700 border-green-300'
              : 'bg-orange-100 text-orange-700 border-orange-300'
          }>
            {isConnected ? (
              <>
                <CheckCircle className="w-3 h-3 mr-1" />
                Connected
              </>
            ) : (
              <>
                <XCircle className="w-3 h-3 mr-1" />
                Not Connected
              </>
            )}
          </Badge>
        </div>

        <div className="flex items-center justify-between py-2 border-b border-gray-200">
          <span className="text-gray-700">Supabase URL</span>
          <span className={`text-xs font-mono ${
            details.url !== 'Not set' ? 'text-green-700' : 'text-orange-700'
          }`}>
            {details.url === 'Not set' 
              ? '❌ Not set' 
              : '✅ ' + details.url.replace('https://', '').slice(0, 20) + '...'}
          </span>
        </div>

        <div className="flex items-center justify-between py-2">
          <span className="text-gray-700">API Key</span>
          <span className={`text-xs font-mono ${
            details.keySet ? 'text-green-700' : 'text-orange-700'
          }`}>
            {details.keySet ? '✅ Set' : '❌ Not set'}
          </span>
        </div>
      </div>

      {!isConnected && (
        <div className="mt-4 p-3 bg-orange-100 rounded border border-orange-200">
          <p className="text-orange-800 text-xs">
            <strong>ℹ️ Info:</strong> Currently using localStorage. To enable cloud storage, 
            create a <code className="bg-orange-200 px-1 rounded">.env</code> file with 
            Supabase credentials. See{' '}
            <a 
              href="/HOW_TO_CONNECT_SUPABASE.md" 
              target="_blank"
              className="underline hover:text-orange-900"
            >
              setup guide
            </a>.
          </p>
        </div>
      )}

      {isConnected && (
        <div className="mt-4 p-3 bg-green-100 rounded border border-green-200">
          <p className="text-green-800 text-xs">
            <strong>✅ Success:</strong> Caregiver accounts are being saved to Supabase cloud database.
            Data will persist across devices and browsers.
          </p>
        </div>
      )}
    </div>
  );
}
