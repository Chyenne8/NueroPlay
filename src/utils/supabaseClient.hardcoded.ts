// TEMPORARY: Hardcoded Supabase client for testing
// This bypasses environment variables to test if Supabase works

import { createClient } from '@supabase/supabase-js';

// HARDCODED CREDENTIALS (for testing only - DELETE THIS FILE after testing!)
const SUPABASE_URL = 'https://adrdvqqpimkscatwcawg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFkcmR2cXFwaW1rc2NhdHdjYXdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY3NzQ5MjksImV4cCI6MjA1MjM1MDkyOX0.8ksqx2eV4qZXqEPvkE9I0gKXVZEn2B3PsaW5FLAqL5Y';

console.log('🚀 Using HARDCODED Supabase credentials (testing mode)');

// Create Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export function isSupabaseConfigured(): boolean {
  return true;
}

const KV_TABLE = 'kv_store_3f317989';

// ============= KEY-VALUE STORE METHODS =============

export async function kvGet(key: string): Promise<any | null> {
  try {
    const { data, error } = await supabase
      .from(KV_TABLE)
      .select('value')
      .eq('key', key)
      .single();

    if (error) {
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

export async function kvSet(key: string, value: any): Promise<boolean> {
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

export async function kvDelete(key: string): Promise<boolean> {
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

export async function kvList(pattern: string): Promise<string[]> {
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

export async function saveCaregiver(email: string, caregiverData: any): Promise<{ data: any; error: any }> {
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

export async function getCaregiver(email: string, password?: string): Promise<{ data: any; error: any }> {
  const key = `caregiver:${email}`;
  const data = await kvGet(key);
  
  if (!data) {
    return { data: null, error: { message: 'Caregiver not found' } };
  }
  
  if (password !== undefined && data.password !== password) {
    return { data: null, error: { message: 'Invalid password' } };
  }
  
  return { data, error: null };
}

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

export async function deleteCaregiver(email: string): Promise<boolean> {
  const key = `caregiver:${email}`;
  return await kvDelete(key);
}

export async function saveChild(caregiverEmail: string, childUsername: string, childData: any): Promise<boolean> {
  const { data: caregiver } = await getCaregiver(caregiverEmail);
  if (!caregiver) return false;

  if (!caregiver.children) {
    caregiver.children = [];
  }

  const childIndex = caregiver.children.findIndex((c: any) => c.username === childUsername);
  if (childIndex >= 0) {
    caregiver.children[childIndex] = childData;
  } else {
    caregiver.children.push(childData);
  }

  const success = await kvSet(`caregiver:${caregiverEmail}`, caregiver);
  return success;
}

export async function removeChild(caregiverEmail: string, childUsername: string): Promise<boolean> {
  const { data: caregiver } = await getCaregiver(caregiverEmail);
  if (!caregiver) return false;

  if (caregiver.children) {
    caregiver.children = caregiver.children.filter((c: any) => c.username !== childUsername);
  }

  const success = await kvSet(`caregiver:${caregiverEmail}`, caregiver);
  return success;
}

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
