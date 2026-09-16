/**
 * Database Connection Diagnostic Utility
 * Single Source of Truth: Supabase PostgreSQL
 * Prisma has been decommissioned in Phase 1.
 */

import { supabaseAdmin, isSupabaseConfigured } from '../lib/supabase';

export const prisma = null;

export interface DbConnectionStatus {
  isConnected: boolean;
  message: string;
  timestamp: string;
  error?: string;
  singleSourceOfTruth?: string;
}

/**
 * Validates connectivity to the PostgreSQL database (Supabase is single source of truth)
 */
export async function checkDatabaseConnection(): Promise<DbConnectionStatus> {
  const timestamp = new Date().toISOString();

  // Primary: Check Supabase PostgreSQL
  if (isSupabaseConfigured() && supabaseAdmin) {
    try {
      const { error } = await supabaseAdmin.from('roles').select('id').limit(1);
      if (!error) {
        return {
          isConnected: true,
          message: 'Supabase PostgreSQL connection verified and active (Single Source of Truth)',
          singleSourceOfTruth: 'Supabase PostgreSQL',
          timestamp
        };
      }
    } catch (err: any) {
      return {
        isConnected: false,
        message: 'Supabase PostgreSQL connection failed',
        singleSourceOfTruth: 'Supabase PostgreSQL',
        timestamp,
        error: err?.message || String(err)
      };
    }
  }

  return {
    isConnected: false,
    message: 'Supabase PostgreSQL is the academy database authority. Configure SUPABASE_URL & SUPABASE_SERVICE_ROLE_KEY to connect live database.',
    singleSourceOfTruth: 'Supabase PostgreSQL',
    timestamp
  };
}
