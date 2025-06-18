
import { supabase } from '@/integrations/supabase/client';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
}

export async function signInAdmin(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  // Check if user is an admin
  if (data.user) {
    const { data: adminData, error: adminError } = await supabase
      .from('admins')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (adminError || !adminData) {
      await supabase.auth.signOut();
      throw new Error('Unauthorized: Admin access required');
    }

    return { user: data.user, admin: adminData };
  }

  throw new Error('Authentication failed');
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new Error(error.message);
  }
}

export async function getCurrentAdmin(): Promise<AdminUser | null> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;

  const { data: adminData, error } = await supabase
    .from('admins')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error || !adminData) return null;

  return adminData;
}
