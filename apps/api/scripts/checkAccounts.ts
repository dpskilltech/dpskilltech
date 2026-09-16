import { supabaseAdmin } from '../src/lib/supabase';

async function main() {
  if (!supabaseAdmin) {
    console.log('Supabase admin not configured');
    return;
  }
  const { data: roles } = await supabaseAdmin.from('roles').select('*');
  console.log('Roles:', roles);

  const { data: profiles } = await supabaseAdmin.from('profiles').select('*');
  console.log('Profiles count:', profiles?.length);
  console.log('Profiles:', profiles);

  const { data: users } = await supabaseAdmin.auth.admin.listUsers();
  console.log('Auth users count:', users?.users?.length);
  users?.users?.forEach(u => console.log(` - ${u.email} (id: ${u.id})`));
}

main().catch(console.error);
