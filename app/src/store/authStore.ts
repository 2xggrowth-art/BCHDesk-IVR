// ============================================================
// BCH CRM - Auth Store (Zustand)
// ============================================================

import { create } from 'zustand';
import { supabase, isSupabaseConfigured } from '@/services/supabase';
import { BUILD_ROLE } from '@/config/features';
import type { User, UserRole } from '@/types';

interface AuthState {
  user: User | null;
  session: unknown | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  effectiveRole: UserRole;

  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  isLoading: true,
  isAuthenticated: false,
  effectiveRole: (BUILD_ROLE === 'all' ? 'staff' : BUILD_ROLE) as UserRole,

  initialize: async () => {
    if (!isSupabaseConfigured()) {
      // Demo mode - create a mock user based on build role
      const mockUsers: Record<string, User> = {
        bdc: { id: 'bdc-1', name: 'Anushka', role: 'bdc', phone: null, avatar_url: null, specialty: 'BDC', is_active: true, created_at: '', updated_at: '' },
        staff: { id: 'staff-1', name: 'Suma', role: 'staff', phone: null, avatar_url: null, specialty: 'E-cycles', is_active: true, created_at: '', updated_at: '' },
        manager: { id: 'mgr-1', name: 'Ibrahim', role: 'manager', phone: null, avatar_url: null, specialty: 'Manager', is_active: true, created_at: '', updated_at: '' },
      };

      const role = BUILD_ROLE === 'all' ? 'staff' : BUILD_ROLE;
      set({
        user: mockUsers[role] || mockUsers.staff,
        isAuthenticated: true,
        isLoading: false,
        effectiveRole: role as UserRole,
      });
      return;
    }

    // Set up auth state listener
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        try {
          const { data: profile } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profile) {
            set({
              user: profile as User,
              session,
              isAuthenticated: true,
              isLoading: false,
              effectiveRole: (profile as User).role,
            });
          }
        } catch {
          set({ isLoading: false });
        }
      } else if (event === 'SIGNED_OUT') {
        set({ user: null, session: null, isAuthenticated: false });
      }
    });

    // Check for existing session
    try {
      const { data, error } = await supabase.auth.getSession();

      if (error || !data.session?.user) {
        set({ isLoading: false });
        return;
      }

      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.session.user.id)
        .single();

      if (profile) {
        const userProfile = profile as User;
        if (BUILD_ROLE !== 'all' && userProfile.role !== BUILD_ROLE) {
          set({ isLoading: false, isAuthenticated: false, user: null });
          return;
        }
        set({
          user: userProfile,
          session: data.session,
          isAuthenticated: true,
          isLoading: false,
          effectiveRole: userProfile.role,
        });
      } else {
        set({ isLoading: false });
      }
    } catch {
      set({ isLoading: false });
    }
  },

  login: async (email: string, password: string) => {
    const demoUsers: Record<string, User> = {
      'anushka@bch.com': { id: 'bdc-1', name: 'Anushka', role: 'bdc', phone: null, avatar_url: null, specialty: 'BDC', is_active: true, created_at: '', updated_at: '' },
      'suma@bch.com': { id: 'staff-1', name: 'Suma', role: 'staff', phone: null, avatar_url: null, specialty: 'E-cycles', is_active: true, created_at: '', updated_at: '' },
      'ibrahim@bch.com': { id: 'mgr-1', name: 'Ibrahim', role: 'manager', phone: null, avatar_url: null, specialty: 'Manager', is_active: true, created_at: '', updated_at: '' },
    };

    const loginWithDemo = (emailKey: string) => {
      const mockUser = demoUsers[emailKey];
      if (mockUser) {
        if (BUILD_ROLE !== 'all' && mockUser.role !== BUILD_ROLE) {
          set({ isLoading: false });
          throw new Error(`This app is for ${BUILD_ROLE} role only.`);
        }
        set({ user: mockUser, isAuthenticated: true, isLoading: false, effectiveRole: mockUser.role });
        return true;
      }
      return false;
    };

    if (!isSupabaseConfigured()) {
      if (!loginWithDemo(email)) get().initialize();
      return;
    }

    set({ isLoading: true });

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        // Supabase auth failed - fallback to demo mode
        if (loginWithDemo(email)) return;
        set({ isLoading: false });
        throw error;
      }

      if (data.user) {
        try {
          const { data: profile } = await supabase
            .from('users')
            .select('*')
            .eq('id', data.user.id)
            .single();

          if (profile) {
            const userProfile = profile as User;
            if (BUILD_ROLE !== 'all' && userProfile.role !== BUILD_ROLE) {
              await supabase.auth.signOut();
              set({ isLoading: false });
              throw new Error(`This app is for ${BUILD_ROLE} role only. Your role: ${userProfile.role}`);
            }
            set({ user: userProfile, session: data.session, isAuthenticated: true, isLoading: false, effectiveRole: userProfile.role });
          } else if (!loginWithDemo(email)) {
            set({ isLoading: false });
          }
        } catch {
          // Profile fetch failed - use demo
          if (!loginWithDemo(email)) set({ isLoading: false });
        }
      }
    } catch (err) {
      // Network error - fallback to demo
      if (loginWithDemo(email)) return;
      set({ isLoading: false });
      throw err;
    }
  },

  logout: async () => {
    if (isSupabaseConfigured()) {
      await supabase.auth.signOut();
    }
    set({ user: null, session: null, isAuthenticated: false });
  },

  setUser: (user) => set({ user, isAuthenticated: !!user }),
}));
