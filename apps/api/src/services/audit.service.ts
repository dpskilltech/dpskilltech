import { supabaseAdmin } from '../lib/supabase';

export interface AuditLogEntry {
  actorUserId?: string;
  action: string;
  entityType: string;
  entityId: string;
  previousValue?: Record<string, any>;
  newValue?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

class AuditService {
  // In-memory buffer for offline development resilience
  private memoryLogs: Array<AuditLogEntry & { id: string; timestamp: Date }> = [];

  public async log(entry: AuditLogEntry): Promise<void> {
    const timestamp = new Date();

    // Store in memory
    this.memoryLogs.push({
      id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp,
      ...entry
    });

    // Trim in-memory buffer to last 1000 items
    if (this.memoryLogs.length > 1000) {
      this.memoryLogs.shift();
    }

    // Persist to Supabase if connected
    if (supabaseAdmin) {
      try {
        const { error } = await supabaseAdmin.from('audit_logs').insert({
          actor_user_id: entry.actorUserId || null,
          action: entry.action,
          entity_type: entry.entityType,
          entity_id: entry.entityId,
          previous_value: entry.previousValue || null,
          new_value: entry.newValue || null,
          ip_address: entry.ipAddress || null,
          user_agent: entry.userAgent || null,
          created_at: timestamp.toISOString()
        });

        if (error) {
          console.warn('[AuditService] Supabase insert warning:', error.message);
        }
      } catch (err) {
        console.error('[AuditService] Database logging error:', err);
      }
    }
  }

  public getRecentLogs(limit: number = 50): Array<AuditLogEntry & { id: string; timestamp: Date }> {
    return this.memoryLogs.slice(-limit).reverse();
  }
}

export const auditService = new AuditService();
