// Supabase Client for NeuroPlay
// This connects directly to Supabase from the frontend for caregiver data

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Safely get environment variables
let supabaseUrl: string | undefined;
let supabaseAnonKey: string | undefined;

try {
  // Check if we're in a Vite environment with import.meta.env
  supabaseUrl = import.meta?.env?.VITE_SUPABASE_URL as string;
  supabaseAnonKey = import.meta?.env?.VITE_SUPABASE_ANON_KEY as string;
} catch (error) {
  // Fallback - import.meta.env not available
  console.warn('import.meta.env not available, Supabase not configured');
}

// Log configuration status (only in development)
if (typeof window !== 'undefined') {
  console.log('🔧 Supabase Configuration:');
  console.log('  URL:', supabaseUrl ? '✅ Set' : '❌ Missing');
  console.log('  Key:', supabaseAnonKey ? '✅ Set' : '❌ Missing');
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('⚠️ Supabase not configured. Using localStorage fallback.');
    console.warn('💡 Create a .env file with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
    console.warn('💡 Then restart your dev server: npm run dev');
  } else {
    console.log('✅ Supabase client ready!');
  }
}

// Create Supabase client
export const supabase: SupabaseClient | null = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Check if Supabase is configured
export function isSupabaseConfigured(): boolean {
  return !!(supabaseUrl && supabaseAnonKey && supabase);
}

// Table name for key-value store
const KV_TABLE = 'kv_store_3f317989';

// ============= KEY-VALUE STORE METHODS =============

/**
 * Get a value from the key-value store
 */
export async function kvGet(key: string): Promise<any | null> {
  if (!supabase) {
    console.warn('Supabase not configured. Using localStorage fallback.');
    return null;
  }

  try {
    const { data, error } = await supabase
      .from(KV_TABLE)
      .select('value')
      .eq('key', key)
      .single();

    if (error) {
      // Key not found is not an error, just return null
      if (error.code === 'PGRST116') {
        return null;
      }
      throw error;
    }

    return data?.value || null;
  } catch (error) {
    console.error('Supabase kvGet error:', error);
    return null;
  }
}

/**
 * Set a value in the key-value store
 */
export async function kvSet(key: string, value: any): Promise<boolean> {
  if (!supabase) {
    console.warn('Supabase not configured. Using localStorage fallback.');
    return false;
  }

  try {
    const { error } = await supabase
      .from(KV_TABLE)
      .upsert({ 
        key, 
        value,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'key'
      });

    if (error) {
      console.error('Supabase kvSet error:', error);
      throw error;
    }
    return true;
  } catch (error) {
    console.error('Supabase kvSet error:', error);
    return false;
  }
}

/**
 * Delete a value from the key-value store
 */
export async function kvDelete(key: string): Promise<boolean> {
  if (!supabase) {
    console.warn('Supabase not configured. Using localStorage fallback.');
    return false;
  }

  try {
    const { error } = await supabase
      .from(KV_TABLE)
      .delete()
      .eq('key', key);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Supabase kvDelete error:', error);
    return false;
  }
}

/**
 * List all keys matching a pattern
 */
export async function kvList(pattern: string): Promise<string[]> {
  if (!supabase) {
    console.warn('Supabase not configured. Using localStorage fallback.');
    return [];
  }

  try {
    const { data, error } = await supabase
      .from(KV_TABLE)
      .select('key')
      .like('key', pattern);

    if (error) throw error;
    return data?.map(row => row.key) || [];
  } catch (error) {
    console.error('Supabase kvList error:', error);
    return [];
  }
}

// ============= CAREGIVER HELPER METHODS =============

/**
 * Save caregiver data (for signup)
 */
export async function saveCaregiver(email: string, caregiverData: any): Promise<{ data: any; error: any }> {
  if (!supabase) {
    return { data: null, error: { message: 'Supabase not configured' } };
  }

  // Check if caregiver already exists (without password check)
  const key = `caregiver:${email}`;
  const existing = await kvGet(key);
  
  if (existing) {
    return { data: null, error: { message: 'Email already exists' } };
  }

  const success = await kvSet(key, caregiverData);
  
  if (success) {
    return { data: caregiverData, error: null };
  } else {
    return { data: null, error: { message: 'Failed to save caregiver' } };
  }
}

/**
 * Get caregiver data (for login - validates password)
 */
export async function getCaregiver(email: string, password?: string): Promise<{ data: any; error: any }> {
  const key = `caregiver:${email}`;
  const data = await kvGet(key);
  
  if (!data) {
    return { data: null, error: { message: 'Caregiver not found' } };
  }
  
  // If password is provided, validate it
  if (password !== undefined && data.password !== password) {
    return { data: null, error: { message: 'Invalid password' } };
  }
  
  return { data, error: null };
}

/**
 * Get all caregivers (for admin)
 */
export async function getAllCaregivers(): Promise<any[]> {
  const keys = await kvList('caregiver:%');
  const caregivers = [];

  for (const key of keys) {
    const data = await kvGet(key);
    if (data) {
      caregivers.push(data);
    }
  }

  return caregivers;
}

/**
 * Delete caregiver
 */
export async function deleteCaregiver(email: string): Promise<boolean> {
  const key = `caregiver:${email}`;
  return await kvDelete(key);
}

// ============= CHILD HELPER METHODS =============

/**
 * Save child data linked to caregiver
 */
export async function saveChild(caregiverEmail: string, childUsername: string, childData: any): Promise<boolean> {
  // Get caregiver data
  const { data: caregiver } = await getCaregiver(caregiverEmail);
  if (!caregiver) return false;

  // Add child to caregiver's children list
  if (!caregiver.children) {
    caregiver.children = [];
  }

  // Check if child already exists in list
  const childIndex = caregiver.children.findIndex((c: any) => c.username === childUsername);
  if (childIndex >= 0) {
    caregiver.children[childIndex] = childData;
  } else {
    caregiver.children.push(childData);
  }

  // Save updated caregiver data
  const success = await kvSet(`caregiver:${caregiverEmail}`, caregiver);
  return success;
}

/**
 * Remove child from caregiver
 */
export async function removeChild(caregiverEmail: string, childUsername: string): Promise<boolean> {
  const { data: caregiver } = await getCaregiver(caregiverEmail);
  if (!caregiver) return false;

  if (caregiver.children) {
    caregiver.children = caregiver.children.filter((c: any) => c.username !== childUsername);
  }

  const success = await kvSet(`caregiver:${caregiverEmail}`, caregiver);
  return success;
}

// ============= EXPORT DEFAULT =============

export default {
  supabase,
  isSupabaseConfigured,
  kvGet,
  kvSet,
  kvDelete,
  kvList,
  saveCaregiver,
  getCaregiver,
  getAllCaregivers,
  deleteCaregiver,
  saveChild,
  removeChild
};
