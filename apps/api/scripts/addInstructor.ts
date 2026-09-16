import { supabaseAdmin } from '../src/lib/supabase';

async function addInstructor() {
  if (!supabaseAdmin) return;
  const email = 'instructor@dpskilltech.in';
  const password = 'DPskilltech@2026';
  const fullName = 'Dr. Rajesh Verma (Lead Instructor)';
  const role = 'TEACHER';

  const { data: created, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { role, full_name: fullName }
  });

  const userId = created?.user?.id;
  if (userId) {
    await supabaseAdmin.from('profiles').upsert({
      id: userId,
      full_name: fullName,
      email,
      status: 'ACTIVE',
      requires_password_change: false
    }, { onConflict: 'id' });

    const { data: roleRow } = await supabaseAdmin.from('roles').select('id').eq('name', role).single();
    if (roleRow) {
      await supabaseAdmin.from('user_roles').upsert({
        user_id: userId,
        role_id: roleRow.id
      }, { onConflict: 'user_id,role_id' });
    }

    await supabaseAdmin.from('teacher_profiles').upsert({
      profile_id: userId,
      bio: 'Principal Software Architect & Lead Instructor for Python + AI tracks.',
      expertise: ['Python', 'AI', 'Distributed Systems'],
      status: 'ACTIVE'
    }, { onConflict: 'profile_id' });

    console.log(`✅ Created and assigned: ${email}`);
  } else {
    console.log('Instructor user creation result:', error?.message);
  }
}

addInstructor().catch(console.error);
