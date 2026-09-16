import { supabaseAdmin, isSupabaseConfigured } from '../src/lib/supabase';

async function checkTables() {
  if (!isSupabaseConfigured() || !supabaseAdmin) {
    console.error('Supabase admin client is not configured.');
    process.exit(1);
  }

  const phase2Tables = [
    'class_sessions',
    'attendance_records',
    'assignments',
    'assignment_submissions',
    'projects',
    'project_milestones',
    'project_submissions',
    'exams',
    'exam_questions',
    'exam_attempts',
    'exam_answers'
  ];

  console.log('Checking Phase 2 tables in Supabase...');
  for (const table of phase2Tables) {
    const { data, error } = await supabaseAdmin.from(table).select('*').limit(1);
    if (error) {
      console.log(`Table ${table}: NOT FOUND or error: ${error.message} (code: ${error.code})`);
    } else {
      console.log(`Table ${table}: ACTIVE (found)`);
    }
  }
}

checkTables().catch(console.error);
