import { SupabaseDiagnostic } from '../components/SupabaseDiagnostic';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';

export default function SupabaseTest() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-8">
      <div className="max-w-4xl mx-auto">
        <Button 
          onClick={() => navigate('/')} 
          variant="outline"
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <h1 className="text-4xl font-bold mb-2 text-gray-900">
          Supabase Connection Test
        </h1>
        <p className="text-gray-600 mb-8">
          This page will help diagnose your Supabase configuration and connection.
        </p>

        <SupabaseDiagnostic />

        <div className="mt-8 p-6 bg-white rounded-lg border shadow-sm">
          <h2 className="font-bold text-lg mb-3">📚 Quick Links</h2>
          <div className="space-y-2 text-sm">
            <a 
              href="https://app.supabase.com/project/adrdvqqpimkscatwcawg" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block text-blue-600 hover:underline"
            >
              → Open Supabase Dashboard
            </a>
            <a 
              href="https://app.supabase.com/project/adrdvqqpimkscatwcawg/editor" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block text-blue-600 hover:underline"
            >
              → View Table Editor
            </a>
            <a 
              href="https://app.supabase.com/project/adrdvqqpimkscatwcawg/sql" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block text-blue-600 hover:underline"
            >
              → Open SQL Editor
            </a>
          </div>
        </div>

        <div className="mt-6 p-6 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-2">💡 Expected Configuration</h3>
          <div className="space-y-2 text-sm text-blue-800">
            <p><strong>Project URL:</strong> https://adrdvqqpimkscatwcawg.supabase.co</p>
            <p><strong>Table Name:</strong> kv_store_3f317989</p>
            <p><strong>Environment File:</strong> .env (in project root)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
