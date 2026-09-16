import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY || '';
const SUPABASE_PUBLISHABLE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY || '';


let supabaseAdmin: SupabaseClient | null = null;

if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
  supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
} else {
  console.info('[Supabase Admin] Running in offline / local development mode (no SUPABASE_SERVICE_ROLE_KEY configured).');
}

export { supabaseAdmin };

export const getSupabaseAdmin = (): SupabaseClient => {
  if (!supabaseAdmin) {
    throw new Error(
      'Supabase Admin client is not initialized. Please configure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your environment.'
    );
  }
  return supabaseAdmin;
};

export const isSupabaseConfigured = (): boolean => {
  return Boolean(supabaseAdmin);
};
