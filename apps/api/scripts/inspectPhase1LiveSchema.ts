import { supabaseAdmin, isSupabaseConfigured } from '../src/lib/supabase';

async function inspectSchema() {
  if (!isSupabaseConfigured() || !supabaseAdmin) {
    console.error('Supabase admin is not configured');
    process.exit(1);
  }

  console.log('--- Inspecting Phase 1 Tables in Live Database ---');
  const phase1Tables = [
    'roles',
    'permissions',
    'role_permissions',
    'profiles',
    'user_roles',
    'student_profiles',
    'parent_profiles',
    'teacher_profiles',
    'parent_students',
    'courses',
    'teacher_courses',
    'modules',
    'lessons',
    'student_lessons_view',
    'lesson_completions',
    'batches',
    'recurring_schedules',
    'schedule_overrides',
    'enrollments',
    'course_progress',
    'fee_plans',
    'installments',
    'payments',
    'demo_bookings',
    'general_inquiries',
    'certificates',
    'certificate_signatures',
    'notifications',
    'audit_logs',
    'file_assets'
  ];

  const present: string[] = [];
  const missing: string[] = [];

  for (const table of phase1Tables) {
    const { data, error } = await supabaseAdmin.from(table).select('*').limit(0);
    if (error) {
      missing.push(`${table} (${error.message})`);
    } else {
      present.push(table);
    }
  }

  console.log(`Found ${present.length} active Phase 1 tables/views:`, present);
  if (missing.length > 0) {
    console.log(`Missing or error on ${missing.length} tables:`, missing);
  }

  // Inspect existing columns on key Phase 1 tables
  console.log('\n--- Inspecting Key Table Columns ---');
  const checkColumns = async (tableName: string) => {
    const { data, error } = await supabaseAdmin.from(tableName).select('*').limit(1);
    if (error) {
      console.log(`Table ${tableName}: error reading - ${error.message}`);
    } else {
      const cols = data && data.length > 0 ? Object.keys(data[0]) : 'empty table (exists)';
      console.log(`Table ${tableName} columns sample:`, cols);
    }
  };

  await checkColumns('courses');
  await checkColumns('lessons');
  await checkColumns('course_progress');
  await checkColumns('batches');
  await checkColumns('enrollments');
  await checkColumns('student_profiles');
  await checkColumns('teacher_profiles');
  await checkColumns('parent_students');
  await checkColumns('audit_logs');
}

inspectSchema().catch(console.error);
