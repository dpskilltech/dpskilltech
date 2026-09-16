import { supabaseAdmin } from '../src/lib/supabase';

interface SeedAccount {
  email: string;
  fullName: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'TEACHER' | 'STUDENT';
  phone?: string;
  password: string;
}

const SEED_ACCOUNTS: SeedAccount[] = [
  {
    email: 'admin@dpskilltech.in',
    fullName: 'Siddharth Patel (Admin)',
    role: 'ADMIN',
    password: 'DPskilltech@2026'
  },
  {
    email: 'teacher@dpskilltech.in',
    fullName: 'Dr. Rajesh Verma (Instructor)',
    role: 'TEACHER',
    password: 'DPskilltech@2026'
  },
  {
    email: 'student@dpskilltech.in',
    fullName: 'Aarav Sharma (Student)',
    role: 'STUDENT',
    password: 'DPskilltech@2026'
  }
];

async function seedUsers() {
  if (!supabaseAdmin) {
    console.error('Supabase admin not configured');
    process.exit(1);
  }

  console.log('--- Seeding Live Users to Supabase Auth & Database ---');

  const { data: listUsers } = await supabaseAdmin.auth.admin.listUsers();
  const existingUsers = listUsers?.users || [];

  for (const acc of SEED_ACCOUNTS) {
    let userId: string;
    const existing = existingUsers.find(u => u.email === acc.email);

    if (existing) {
      console.log(`User ${acc.email} exists, updating password and metadata...`);
      userId = existing.id;
      const { error: updateErr } = await supabaseAdmin.auth.admin.updateUserById(userId, {
        password: acc.password,
        email_confirm: true,
        user_metadata: { role: acc.role, full_name: acc.fullName }
      });
      if (updateErr) console.error(`Error updating ${acc.email}:`, updateErr.message);
      else console.log(`✅ Updated auth user: ${acc.email}`);
    } else {
      console.log(`Creating user ${acc.email}...`);
      const { data: created, error: createErr } = await supabaseAdmin.auth.admin.createUser({
        email: acc.email,
        password: acc.password,
        email_confirm: true,
        user_metadata: { role: acc.role, full_name: acc.fullName }
      });
      if (createErr || !created?.user) {
        console.error(`Error creating ${acc.email}:`, createErr?.message);
        continue;
      }
      userId = created.user.id;
      console.log(`✅ Created auth user: ${acc.email} (${userId})`);
    }

    // Upsert Profile
    const { error: profErr } = await supabaseAdmin.from('profiles').upsert({
      id: userId,
      full_name: acc.fullName,
      email: acc.email,
      phone: acc.phone || null,
      status: 'ACTIVE',
      requires_password_change: false
    }, { onConflict: 'id' });

    if (profErr) {
      console.warn(`Profile upsert error for ${acc.email}:`, profErr.message);
    } else {
      console.log(`✅ Profile upserted for ${acc.email}`);
    }

    // Assign Role
    const { data: roleRow } = await supabaseAdmin.from('roles').select('id').eq('name', acc.role).single();
    if (roleRow) {
      await supabaseAdmin.from('user_roles').upsert({
        user_id: userId,
        role_id: roleRow.id
      }, { onConflict: 'user_id,role_id' });
      console.log(`✅ Role assigned: ${acc.role}`);
    }

    // Role-specific profile table
    if (acc.role === 'STUDENT') {
      await supabaseAdmin.from('student_profiles').upsert({
        profile_id: userId,
        student_id: 'DPSK-STU-2026-001',
        status: 'ACTIVE',
        admin_notes: 'Standard Dev Seed Student'
      }, { onConflict: 'profile_id' });
      console.log(`✅ student_profiles row created`);
    } else if (acc.role === 'TEACHER') {
      await supabaseAdmin.from('teacher_profiles').upsert({
        profile_id: userId,
        bio: 'Principal Software Architect & Lead Instructor for Python + AI tracks.',
        expertise: ['Python', 'AI', 'Distributed Systems'],
        status: 'ACTIVE'
      }, { onConflict: 'profile_id' });
      console.log(`✅ teacher_profiles row created`);
    }
  }

  console.log('\n--- Verifying sign in with Supabase Auth client ---');
  for (const acc of SEED_ACCOUNTS) {
    const { data, error } = await supabaseAdmin.auth.signInWithPassword({
      email: acc.email,
      password: acc.password
    });
    if (error) {
      console.error(`❌ Verification failed for ${acc.email}:`, error.message);
    } else {
      console.log(`🎉 Verification succeeded for ${acc.email}! Token received: ${data.session?.access_token ? 'YES' : 'NO'}`);
    }
  }
}

seedUsers().catch(console.error);
