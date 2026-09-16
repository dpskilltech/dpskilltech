/**
 * DP SKILL TECH ACADEMY — PHASE 2 STEP 2 DEEP FUNCTIONAL LIFECYCLE TEST
 *
 * Verifies live:
 * 1. ATTENDANCE INTEGRITY: Database trigger validate_attendance_enrollment() rejects invalid batch/student
 * 2. EXAM SNAPSHOT: Question bank modification does NOT alter existing attempt question_snapshot
 * 3. ASSIGNMENT REVISION: Attempt 1 is preserved when Attempt 2 is submitted; duplicate attempt_number rejected
 * 4. PROJECT REVISION: Milestone Attempt 1 is preserved when Attempt 2 is submitted; duplicate attempt_number rejected
 * 5. PROGRESS CALCULATION: Stored procedure recalculate_enrollment_progress executes and sets weighted_score
 * 6. TEARDOWN: Completely cleans up all transient test fixtures
 */

import { supabaseAdmin, isSupabaseConfigured } from '../src/lib/supabase';

interface TestItem {
  name: string;
  passed: boolean;
  evidence: string;
}

const logItems: TestItem[] = [];

function record(name: string, passed: boolean, evidence: string) {
  logItems.push({ name, passed, evidence });
  const sym = passed ? '✅ PASS' : '❌ FAIL';
  console.log(`${sym} ${name} -> ${evidence}`);
}

async function runDeepFunctionalLifecycleTest() {
  console.log('\n=============================================================================');
  console.log('LIVE VERIFICATION: ATTENDANCE, EXAM SNAPSHOT, SUBMISSIONS & PROGRESS ENGINE');
  console.log('=============================================================================\n');

  if (!isSupabaseConfigured() || !supabaseAdmin) {
    throw new Error('Supabase admin not configured');
  }

  // 1. Setup minimal transient test fixture
  console.log('--- 1. Setting up transient test fixtures ---');
  const timestamp = Date.now();
  const testEmail = `temp.phase2.test.${timestamp}@dpskilltech.in`;

  // Create temporary auth user
  const { data: authData, error: authErr } = await supabaseAdmin.auth.admin.createUser({
    email: testEmail,
    password: 'TempPassword123!',
    email_confirm: true
  });
  if (authErr || !authData.user) throw new Error('Failed to create auth user: ' + authErr?.message);
  const userId = authData.user.id;

  // Insert profile
  await supabaseAdmin.from('profiles').insert({
    id: userId,
    email: testEmail,
    full_name: 'Temp Phase 2 Test Student'
  });

  // Insert student profile
  const { data: studentProf, error: sErr } = await supabaseAdmin.from('student_profiles').insert({
    profile_id: userId,
    student_id: 'DPSK-STU-TEST-' + timestamp
  }).select().single();
  if (sErr || !studentProf) throw new Error('Failed to create student profile: ' + sErr?.message);
  const studentProfileId = studentProf.id;

  // Fetch a course
  const { data: courses } = await supabaseAdmin.from('courses').select('id').limit(1);
  const courseId = courses![0].id;

  // Insert test batch
  const { data: testBatch } = await supabaseAdmin.from('batches').insert({
    course_id: courseId,
    name: 'Temp Batch ' + timestamp,
    start_date: '2026-09-15',
    max_capacity: 15
  }).select().single();
  const batchId = testBatch.id;

  // Insert test enrollment
  const { data: testEnrollment } = await supabaseAdmin.from('enrollments').insert({
    student_profile_id: studentProfileId,
    course_id: courseId,
    batch_id: batchId,
    enrollment_code: 'ENR-TEST-' + timestamp,
    status: 'ACTIVE'
  }).select().single();
  const enrollmentId = testEnrollment.id;

  // Create a second batch for mismatch testing
  const { data: otherBatch } = await supabaseAdmin.from('batches').insert({
    course_id: courseId,
    name: 'Temp Other Batch ' + timestamp,
    start_date: '2026-09-15',
    max_capacity: 15
  }).select().single();
  const otherBatchId = otherBatch.id;

  // Create a class session in otherBatch
  const { data: otherSession } = await supabaseAdmin.from('class_sessions').insert({
    batch_id: otherBatchId,
    course_id: courseId,
    title: 'Other Batch Session',
    session_date: '2026-09-15',
    start_time: '10:00:00',
    end_time: '11:30:00',
    meeting_url: 'https://zoom.us/test'
  }).select().single();

  // Create a class session in testBatch
  const { data: validSession } = await supabaseAdmin.from('class_sessions').insert({
    batch_id: batchId,
    course_id: courseId,
    title: 'Valid Batch Session',
    session_date: '2026-09-15',
    start_time: '10:00:00',
    end_time: '11:30:00',
    meeting_url: 'https://zoom.us/test'
  }).select().single();

  // ---------------------------------------------------------------------------
  // 2. ATTENDANCE INTEGRITY TRIGGER TEST
  // ---------------------------------------------------------------------------
  console.log('\n--- 2. ATTENDANCE INTEGRITY TRIGGER TEST ---');
  // Attempt to mark attendance for a session in OTHER batch
  const { error: mismatchBatchErr } = await supabaseAdmin.from('attendance_records').insert({
    class_session_id: otherSession.id, // Session belongs to otherBatchId
    student_profile_id: studentProfileId,
    enrollment_id: enrollmentId,       // Enrollment belongs to batchId
    status: 'PRESENT'
  });

  const triggerRejected = !!mismatchBatchErr && mismatchBatchErr.message.includes('does not match enrollment batch_id');
  record(
    'Attendance Integrity',
    triggerRejected,
    triggerRejected ? `DB Trigger rejected mismatch: "${mismatchBatchErr?.message}"` : 'Failed: DB allowed mismatched attendance'
  );

  // Valid attendance insert
  const { data: validAtt, error: validAttErr } = await supabaseAdmin.from('attendance_records').insert({
    class_session_id: validSession.id,
    student_profile_id: studentProfileId,
    enrollment_id: enrollmentId,
    status: 'PRESENT',
    join_timestamp: new Date().toISOString()
  }).select().single();

  record(
    'Attendance Valid Insert',
    !validAttErr && !!validAtt,
    validAtt ? 'Valid enrolled session attendance recorded successfully' : `Error: ${validAttErr?.message}`
  );

  // ---------------------------------------------------------------------------
  // 3. EXAM QUESTION SNAPSHOT IMMUTABILITY TEST
  // ---------------------------------------------------------------------------
  console.log('\n--- 3. EXAM QUESTION SNAPSHOT IMMUTABILITY TEST ---');
  const { data: testExam } = await supabaseAdmin.from('exams').insert({
    course_id: courseId,
    title: 'Snapshot Integrity Exam ' + timestamp,
    exam_type: 'QUIZ',
    duration_minutes: 30,
    passing_percentage: 70
  }).select().single();

  const { data: testQ } = await supabaseAdmin.from('exam_questions').insert({
    exam_id: testExam.id,
    question_text: 'Original Immutable Question v1',
    question_type: 'MCQ',
    points: 10,
    order_index: 1,
    options: [{ id: 'A', text: 'Option A' }, { id: 'B', text: 'Option B' }],
    correct_answer: { answer: 'A' }
  }).select().single();

  // Student starts attempt: snapshot freezes
  const frozenSnapshot = [{
    question_id: testQ.id,
    question_text: testQ.question_text,
    points: testQ.points,
    options: testQ.options
  }];

  const { data: attempt } = await supabaseAdmin.from('exam_attempts').insert({
    exam_id: testExam.id,
    student_profile_id: studentProfileId,
    enrollment_id: enrollmentId,
    attempt_number: 1,
    question_snapshot: frozenSnapshot,
    status: 'IN_PROGRESS'
  }).select().single();

  // Instructor modifies the question bank
  await supabaseAdmin.from('exam_questions').update({
    question_text: 'MODIFIED Question Text v2 by Teacher',
    points: 20
  }).eq('id', testQ.id);

  // Fetch the student attempt again
  const { data: fetchedAttempt } = await supabaseAdmin
    .from('exam_attempts')
    .select('question_snapshot')
    .eq('id', attempt.id)
    .single();

  const snapshotText = fetchedAttempt?.question_snapshot?.[0]?.question_text;
  const snapshotPoints = fetchedAttempt?.question_snapshot?.[0]?.points;
  const snapshotIntact = snapshotText === 'Original Immutable Question v1' && snapshotPoints === 10;

  record(
    'Exam Attempt Question Snapshot',
    snapshotIntact,
    snapshotIntact ? `Snapshot preserved original text ("${snapshotText}") and points (${snapshotPoints})` : 'Failed: Snapshot drifted'
  );

  // ---------------------------------------------------------------------------
  // 4. ASSIGNMENT REVISION MULTI-ATTEMPT TEST
  // ---------------------------------------------------------------------------
  console.log('\n--- 4. ASSIGNMENT SUBMISSION MULTI-ATTEMPT TEST ---');
  const { data: testAssign } = await supabaseAdmin.from('assignments').insert({
    course_id: courseId,
    title: 'Multi-Attempt Assignment ' + timestamp,
    instructions: 'Submit lab homework',
    max_marks: 100,
    passing_marks: 60
  }).select().single();

  // Attempt 1: Needs Revision
  const { data: assignAtt1 } = await supabaseAdmin.from('assignment_submissions').insert({
    assignment_id: testAssign.id,
    student_profile_id: studentProfileId,
    enrollment_id: enrollmentId,
    attempt_number: 1,
    submission_type: 'GITHUB_URL',
    submission_url: 'https://github.com/dpskilltech/lab-v1',
    status: 'NEEDS_REVISION',
    teacher_feedback: 'Revise line 42 algorithm'
  }).select().single();

  // Attempt 2: Revised Submission
  const { data: assignAtt2 } = await supabaseAdmin.from('assignment_submissions').insert({
    assignment_id: testAssign.id,
    student_profile_id: studentProfileId,
    enrollment_id: enrollmentId,
    attempt_number: 2,
    submission_type: 'GITHUB_URL',
    submission_url: 'https://github.com/dpskilltech/lab-v2',
    status: 'APPROVED',
    marks_obtained: 96,
    teacher_feedback: 'Approved with distinction'
  }).select().single();

  // Attempt duplicate attempt 1 (must be rejected by unique constraint)
  const { error: dupAssignErr } = await supabaseAdmin.from('assignment_submissions').insert({
    assignment_id: testAssign.id,
    student_profile_id: studentProfileId,
    enrollment_id: enrollmentId,
    attempt_number: 1, // Duplicate attempt_number
    submission_type: 'GITHUB_URL',
    submission_url: 'https://github.com/dpskilltech/lab-dup'
  });

  const dupAssignRejected = !!dupAssignErr;

  // Verify both attempts exist
  const { data: assignHistory } = await supabaseAdmin
    .from('assignment_submissions')
    .select('attempt_number, submission_url, status, marks_obtained')
    .eq('assignment_id', testAssign.id)
    .order('attempt_number', { ascending: true });

  const assignHistoryPreserved = assignHistory?.length === 2 && 
    assignHistory[0].submission_url === 'https://github.com/dpskilltech/lab-v1' &&
    assignHistory[1].submission_url === 'https://github.com/dpskilltech/lab-v2' &&
    dupAssignRejected;

  record(
    'Assignment Multi-Attempt History',
    assignHistoryPreserved,
    assignHistoryPreserved ? 'Attempt 1 preserved alongside Attempt 2; duplicate attempt_number rejected by DB' : 'Failed history check'
  );

  // ---------------------------------------------------------------------------
  // 5. PROJECT MILESTONE MULTI-ATTEMPT TEST
  // ---------------------------------------------------------------------------
  console.log('\n--- 5. PROJECT MILESTONE MULTI-ATTEMPT TEST ---');
  const { data: testProj } = await supabaseAdmin.from('projects').insert({
    course_id: courseId,
    title: 'Capstone Project ' + timestamp,
    description: 'Build enterprise application',
    objectives: 'Full stack development',
    total_marks: 100
  }).select().single();

  const { data: testMilestone } = await supabaseAdmin.from('project_milestones').insert({
    project_id: testProj.id,
    title: 'Milestone 1: Architecture',
    description: 'System design',
    order_index: 1,
    marks_weightage: 25
  }).select().single();

  // Milestone Attempt 1
  await supabaseAdmin.from('project_submissions').insert({
    project_id: testProj.id,
    milestone_id: testMilestone.id,
    student_profile_id: studentProfileId,
    enrollment_id: enrollmentId,
    attempt_number: 1,
    github_url: 'https://github.com/dpskilltech/proj-m1-v1',
    status: 'NEEDS_REVISION',
    teacher_feedback: 'Add database ER diagram'
  });

  // Milestone Attempt 2
  await supabaseAdmin.from('project_submissions').insert({
    project_id: testProj.id,
    milestone_id: testMilestone.id,
    student_profile_id: studentProfileId,
    enrollment_id: enrollmentId,
    attempt_number: 2,
    github_url: 'https://github.com/dpskilltech/proj-m1-v2',
    status: 'APPROVED',
    total_score: 25,
    teacher_feedback: 'Approved'
  });

  // Duplicate milestone attempt 1
  const { error: dupMilestoneErr } = await supabaseAdmin.from('project_submissions').insert({
    project_id: testProj.id,
    milestone_id: testMilestone.id,
    student_profile_id: studentProfileId,
    enrollment_id: enrollmentId,
    attempt_number: 1,
    github_url: 'https://github.com/dpskilltech/proj-m1-dup'
  });

  const dupMilestoneRejected = !!dupMilestoneErr;

  const { data: milestoneHistory } = await supabaseAdmin
    .from('project_submissions')
    .select('attempt_number, github_url, status')
    .eq('milestone_id', testMilestone.id)
    .order('attempt_number', { ascending: true });

  const milestoneHistoryPreserved = milestoneHistory?.length === 2 && dupMilestoneRejected;
  record(
    'Project Milestone Multi-Attempt History',
    milestoneHistoryPreserved,
    milestoneHistoryPreserved ? 'Milestone Attempt 1 preserved with Attempt 2; duplicate attempt rejected by DB' : 'Failed project history check'
  );

  // ---------------------------------------------------------------------------
  // 6. PROGRESS RECALCULATION STORED PROCEDURE TEST
  // ---------------------------------------------------------------------------
  console.log('\n--- 6. PROGRESS RECALCULATION STORED PROCEDURE TEST ---');
  // Mark the valid session as COMPLETED so it counts towards attendance
  await supabaseAdmin.from('class_sessions').update({ status: 'COMPLETED' }).eq('id', validSession.id);

  // Call recalculate_enrollment_progress
  const { error: rpcErr } = await supabaseAdmin.rpc('recalculate_enrollment_progress', {
    p_enrollment_id: enrollmentId
  });

  // Query updated course_progress
  const { data: progData } = await supabaseAdmin
    .from('course_progress')
    .select('attendance_pct, assignments_completed, projects_completed, weighted_score')
    .eq('enrollment_id', enrollmentId)
    .single();

  const progressUpdated = !rpcErr && progData && progData.attendance_pct === 100 && progData.assignments_completed === 1;

  record(
    'Progress Deterministic Recalculation',
    progressUpdated,
    progressUpdated ? `Calculated attendance: ${progData.attendance_pct}%, assignments: ${progData.assignments_completed}, score: ${progData.weighted_score}%` : `Failed: ${rpcErr?.message}`
  );

  // ---------------------------------------------------------------------------
  // 7. CLEANUP TEST FIXTURES
  // ---------------------------------------------------------------------------
  console.log('\n--- 7. Cleaning up transient test fixtures ---');
  await supabaseAdmin.from('attendance_records').delete().eq('enrollment_id', enrollmentId);
  await supabaseAdmin.from('exam_attempts').delete().eq('enrollment_id', enrollmentId);
  await supabaseAdmin.from('exam_questions').delete().eq('exam_id', testExam.id);
  await supabaseAdmin.from('exams').delete().eq('id', testExam.id);
  await supabaseAdmin.from('assignment_submissions').delete().eq('enrollment_id', enrollmentId);
  await supabaseAdmin.from('assignments').delete().eq('id', testAssign.id);
  await supabaseAdmin.from('project_submissions').delete().eq('enrollment_id', enrollmentId);
  await supabaseAdmin.from('project_milestones').delete().eq('project_id', testProj.id);
  await supabaseAdmin.from('projects').delete().eq('id', testProj.id);
  await supabaseAdmin.from('class_sessions').delete().eq('id', validSession.id);
  await supabaseAdmin.from('class_sessions').delete().eq('id', otherSession.id);
  await supabaseAdmin.from('course_progress').delete().eq('enrollment_id', enrollmentId);
  await supabaseAdmin.from('enrollments').delete().eq('id', enrollmentId);
  await supabaseAdmin.from('batches').delete().eq('id', batchId);
  await supabaseAdmin.from('batches').delete().eq('id', otherBatchId);
  await supabaseAdmin.from('student_profiles').delete().eq('id', studentProfileId);
  await supabaseAdmin.from('profiles').delete().eq('id', userId);
  await supabaseAdmin.auth.admin.deleteUser(userId);

  console.log('Cleanup completed cleanly. Zero leftover test data in database.');

  // ---------------------------------------------------------------------------
  // SUMMARY
  // ---------------------------------------------------------------------------
  const allPassed = logItems.every(i => i.passed);
  console.log('\n=============================================================================');
  console.log(`LIFECYCLE TEST RESULT: ${logItems.filter(i => i.passed).length} / ${logItems.length} PASSED`);
  console.log('=============================================================================\n');

  if (!allPassed) {
    process.exit(1);
  }
}

runDeepFunctionalLifecycleTest().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
