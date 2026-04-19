import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';

export function SupabaseDiagnostic() {
  const [diagnostics, setDiagnostics] = useState<any>(null);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    runDiagnostics();
  }, []);

  const runDiagnostics = async () => {
    setTesting(true);
    const results: any = {
      timestamp: new Date().toISOString(),
      checks: []
    };

    // Check 1: import.meta availability
    try {
      results.checks.push({
        name: 'import.meta available',
        status: typeof import.meta !== 'undefined' ? 'pass' : 'fail',
        value: typeof import.meta !== 'undefined' ? 'Available' : 'Not available'
      });
    } catch (e) {
      results.checks.push({
        name: 'import.meta available',
        status: 'fail',
        value: 'Error: ' + (e as Error).message
      });
    }

    // Check 2: import.meta.env availability
    try {
      results.checks.push({
        name: 'import.meta.env available',
        status: (import.meta && import.meta.env) ? 'pass' : 'fail',
        value: (import.meta && import.meta.env) ? 'Available' : 'Not available'
      });
    } catch (e) {
      results.checks.push({
        name: 'import.meta.env available',
        status: 'fail',
        value: 'Error: ' + (e as Error).message
      });
    }

    // Check 3: VITE_SUPABASE_URL
    try {
      const url = import.meta?.env?.VITE_SUPABASE_URL;
      results.checks.push({
        name: 'VITE_SUPABASE_URL',
        status: url ? 'pass' : 'fail',
        value: url || 'Not set'
      });
    } catch (e) {
      results.checks.push({
        name: 'VITE_SUPABASE_URL',
        status: 'fail',
        value: 'Error: ' + (e as Error).message
      });
    }

    // Check 4: VITE_SUPABASE_ANON_KEY
    try {
      const key = import.meta?.env?.VITE_SUPABASE_ANON_KEY;
      results.checks.push({
        name: 'VITE_SUPABASE_ANON_KEY',
        status: key ? 'pass' : 'fail',
        value: key ? 'Set (hidden)' : 'Not set'
      });
    } catch (e) {
      results.checks.push({
        name: 'VITE_SUPABASE_ANON_KEY',
        status: 'fail',
        value: 'Error: ' + (e as Error).message
      });
    }

    // Check 5: Supabase client
    try {
      const { isSupabaseConfigured } = await import('../utils/supabaseClient');
      const configured = isSupabaseConfigured();
      results.checks.push({
        name: 'Supabase client initialized',
        status: configured ? 'pass' : 'fail',
        value: configured ? 'Yes' : 'No'
      });
    } catch (e) {
      results.checks.push({
        name: 'Supabase client initialized',
        status: 'fail',
        value: 'Error: ' + (e as Error).message
      });
    }

    // Check 6: Test connection
    try {
      const { supabase } = await import('../utils/supabaseClient');
      if (supabase) {
        const { data, error } = await supabase
          .from('kv_store_3f317989')
          .select('count')
          .limit(1);
        
        results.checks.push({
          name: 'Database connection',
          status: error ? 'fail' : 'pass',
          value: error ? error.message : 'Connected'
        });
      } else {
        results.checks.push({
          name: 'Database connection',
          status: 'skip',
          value: 'Supabase not configured'
        });
      }
    } catch (e) {
      results.checks.push({
        name: 'Database connection',
        status: 'fail',
        value: 'Error: ' + (e as Error).message
      });
    }

    setDiagnostics(results);
    setTesting(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'fail':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass':
        return 'bg-green-50 border-green-200';
      case 'fail':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  if (!diagnostics) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-3">
          <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
          <div>
            <h3 className="font-semibold">Running Diagnostics...</h3>
            <p className="text-sm text-gray-600">Checking Supabase configuration</p>
          </div>
        </div>
      </Card>
    );
  }

  const allPassed = diagnostics.checks.every((c: any) => c.status === 'pass');
  const anyFailed = diagnostics.checks.some((c: any) => c.status === 'fail');

  return (
    <Card className={`p-6 border-2 ${allPassed ? 'bg-green-50 border-green-200' : anyFailed ? 'bg-red-50 border-red-200' : 'bg-yellow-50 border-yellow-200'}`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-lg">Supabase Diagnostics</h3>
          <p className="text-sm text-gray-600">
            {allPassed ? '✅ All checks passed!' : anyFailed ? '❌ Some checks failed' : '⚠️ Configuration incomplete'}
          </p>
        </div>
        <Button onClick={runDiagnostics} disabled={testing} size="sm">
          <RefreshCw className={`w-4 h-4 mr-2 ${testing ? 'animate-spin' : ''}`} />
          Retest
        </Button>
      </div>

      <div className="space-y-3">
        {diagnostics.checks.map((check: any, i: number) => (
          <div key={i} className={`p-3 rounded-lg border ${getStatusColor(check.status)}`}>
            <div className="flex items-start gap-3">
              {getStatusIcon(check.status)}
              <div className="flex-1">
                <p className="font-medium text-sm">{check.name}</p>
                <p className="text-xs text-gray-600 mt-1 font-mono">{check.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {anyFailed && (
        <div className="mt-6 p-4 bg-white rounded-lg border border-red-300">
          <h4 className="font-semibold text-red-900 mb-2">🔧 Troubleshooting Steps:</h4>
          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
            <li>Make sure <code className="bg-gray-100 px-1 rounded">.env</code> file exists in project root</li>
            <li>Verify it contains:
              <pre className="bg-gray-100 p-2 rounded mt-1 text-xs overflow-x-auto">
{`VITE_SUPABASE_URL=https://adrdvqqpimkscatwcawg.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here`}
              </pre>
            </li>
            <li>Restart your development server completely</li>
            <li>Clear browser cache and reload</li>
            <li>Check that the table <code className="bg-gray-100 px-1 rounded">kv_store_3f317989</code> exists in Supabase</li>
          </ol>
        </div>
      )}

      <div className="mt-4 text-xs text-gray-500">
        Last checked: {new Date(diagnostics.timestamp).toLocaleTimeString()}
      </div>
    </Card>
  );
}
