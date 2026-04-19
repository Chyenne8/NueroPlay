import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { CheckCircle, XCircle, Loader2, Database } from 'lucide-react';

export default function QuickSupabaseTest() {
  const [status, setStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [testData, setTestData] = useState<any>(null);

  const runTest = async () => {
    setStatus('testing');
    setMessage('Testing Supabase connection...');

    try {
      // Import the hardcoded client
      const { supabase, kvSet, kvGet } = await import('../utils/supabaseClient.hardcoded');

      setMessage('✅ Supabase client loaded');

      // Test 1: Insert data
      const testKey = `test-${Date.now()}`;
      const testValue = {
        message: 'Hello from NeuroPlay!',
        timestamp: new Date().toISOString(),
        test: true
      };

      setMessage('📝 Inserting test data...');
      
      const saveSuccess = await kvSet(testKey, testValue);
      
      if (!saveSuccess) {
        throw new Error('Failed to save data');
      }

      setMessage('✅ Data inserted successfully!');

      // Test 2: Retrieve data
      setMessage('📖 Retrieving data...');
      
      const retrieved = await kvGet(testKey);
      
      if (!retrieved) {
        throw new Error('Failed to retrieve data');
      }

      setMessage('✅ Data retrieved successfully!');

      // Test 3: List all data
      setMessage('📋 Listing all data...');
      
      const { data: allData, error } = await supabase
        .from('kv_store_3f317989')
        .select('*')
        .limit(10);

      if (error) {
        throw error;
      }

      setTestData(allData);
      setMessage(`✅ Found ${allData?.length || 0} rows in database!`);
      setStatus('success');

    } catch (error: any) {
      console.error('Test failed:', error);
      setMessage(`❌ Error: ${error.message || String(error)}`);
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
      <div className="max-w-3xl mx-auto">
        <Card className="p-8">
          <div className="text-center mb-8">
            <Database className="w-16 h-16 mx-auto mb-4 text-blue-600" />
            <h1 className="text-3xl font-bold mb-2">Quick Supabase Test</h1>
            <p className="text-gray-600">
              This uses hardcoded credentials to bypass environment variable issues
            </p>
          </div>

          <div className="flex justify-center mb-8">
            <Button 
              onClick={runTest} 
              disabled={status === 'testing'}
              size="lg"
              className="px-8"
            >
              {status === 'testing' ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  <Database className="w-5 h-5 mr-2" />
                  Run Connection Test
                </>
              )}
            </Button>
          </div>

          {message && (
            <div className={`p-4 rounded-lg border-2 mb-6 ${
              status === 'success' ? 'bg-green-50 border-green-300' :
              status === 'error' ? 'bg-red-50 border-red-300' :
              status === 'testing' ? 'bg-blue-50 border-blue-300' :
              'bg-gray-50 border-gray-300'
            }`}>
              <div className="flex items-start gap-3">
                {status === 'success' && <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />}
                {status === 'error' && <XCircle className="w-6 h-6 text-red-600 flex-shrink-0" />}
                {status === 'testing' && <Loader2 className="w-6 h-6 text-blue-600 flex-shrink-0 animate-spin" />}
                <p className="font-medium flex-1">{message}</p>
              </div>
            </div>
          )}

          {testData && testData.length > 0 && (
            <div className="mt-6">
              <h3 className="font-bold mb-3">📊 Database Contents:</h3>
              <div className="bg-gray-50 rounded-lg p-4 border max-h-96 overflow-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Key</th>
                      <th className="text-left p-2">Value</th>
                      <th className="text-left p-2">Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {testData.map((row: any, i: number) => (
                      <tr key={i} className="border-b">
                        <td className="p-2 font-mono text-xs">{row.key}</td>
                        <td className="p-2 font-mono text-xs max-w-md truncate">
                          {JSON.stringify(row.value).slice(0, 100)}...
                        </td>
                        <td className="p-2 text-xs">
                          {new Date(row.created_at).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {status === 'success' && (
            <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-900 mb-2">🎉 Success!</h4>
              <p className="text-sm text-green-800">
                Supabase is working! You can now:
              </p>
              <ul className="list-disc list-inside text-sm text-green-800 mt-2 space-y-1">
                <li>Create caregiver accounts</li>
                <li>Add children</li>
                <li>Save quiz results</li>
                <li>View data in Supabase dashboard</li>
              </ul>
              <a 
                href="https://app.supabase.com/project/adrdvqqpimkscatwcawg/editor"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-3 text-blue-600 hover:underline text-sm font-medium"
              >
                → Open Supabase Table Editor
              </a>
            </div>
          )}

          {status === 'error' && (
            <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-200">
              <h4 className="font-semibold text-red-900 mb-2">Common Issues:</h4>
              <ol className="list-decimal list-inside text-sm text-red-800 space-y-2">
                <li>Table <code className="bg-red-100 px-1 rounded">kv_store_3f317989</code> doesn't exist
                  <br />
                  <span className="text-xs">→ Run CREATE TABLE in Supabase SQL Editor</span>
                </li>
                <li>Row Level Security is blocking access
                  <br />
                  <span className="text-xs">→ Run: ALTER TABLE kv_store_3f317989 DISABLE ROW LEVEL SECURITY;</span>
                </li>
                <li>Network/firewall issue
                  <br />
                  <span className="text-xs">→ Check browser console for CORS errors</span>
                </li>
              </ol>
            </div>
          )}
        </Card>

        <div className="mt-6 text-center">
          <a 
            href="/"
            className="text-blue-600 hover:underline"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
