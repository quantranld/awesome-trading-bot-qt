import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_KEY
);

export interface AuthService {
  signUp(email: string, password: string): Promise<{ user?: any; error?: Error }>;
  signIn(email: string, password: string): Promise<{ user?: any; error?: Error }>;
  signOut(): Promise<{ error?: Error }>;
  resetPassword(email: string): Promise<{ error?: Error }>;
  getSession(): Promise<{ session?: any; error?: Error }>;
  getUser(): Promise<{ user?: any; error?: Error }>;
  onAuthStateChange(callback: (event: string, session: any) => void): { data: { subscription: { unsubscribe: () => void } } };
}

export const authService: AuthService = {
  async signUp(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    return { user: data.user, error };
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { user: data.user, error };
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    return { error };
  },

  async getSession() {
    const { data, error } = await supabase.auth.getSession();
    return { session: data.session, error };
  },

  async getUser() {
    const { data, error } = await supabase.auth.getUser();
    return { user: data.user, error };
  },

  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  }
};
