import { useEffect, useState } from 'react';
import { authService } from '../services/auth';

export const useAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const initializeAuth = async () => {
      const { user, error } = await authService.getUser();
      if (error) {
        setError(error);
      } else {
        setUser(user);
      }
      setLoading(false);
    };

    initializeAuth();

    const { data: { subscription } } = authService.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string) => {
    setLoading(true);
    const { user, error } = await authService.signUp(email, password);
    if (error) {
      setError(error);
    } else {
      setUser(user);
    }
    setLoading(false);
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    const { user, error } = await authService.signIn(email, password);
    if (error) {
      setError(error);
    } else {
      setUser(user);
    }
    setLoading(false);
  };

  const signOut = async () => {
    setLoading(true);
    const { error } = await authService.signOut();
    if (error) {
      setError(error);
    } else {
      setUser(null);
    }
    setLoading(false);
  };

  const resetPassword = async (email: string) => {
    setLoading(true);
    const { error } = await authService.resetPassword(email);
    if (error) {
      setError(error);
    }
    setLoading(false);
  };

  return {
    user,
    loading,
    error,
    signUp,
    signIn,
    signOut,
    resetPassword,
    isAuthenticated: !!user,
  };
};
