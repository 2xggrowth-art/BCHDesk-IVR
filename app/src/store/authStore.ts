// ============================================================
// BCH CRM - Auth Store (Zustand)
// Handles: login, logout, biometric, role-lock
// Always requires login on app restart (no persisted sessions)
// ============================================================

import { create } from 'zustand';
import { supabase, isSupabaseConfigured } from '@/services/supabase';
import { BUILD_ROLE } from '@/config/features';
import { deleteCredentials } from '@/services/biometric';
import { clearAllCache } from '@/services/offline';
import { setSupabaseSessionReady } from '@/services/api';
import type { User, UserRole } from '@/types';

// ---- Hardcoded credentials (local auth fallback) ----
// Each entry has allowed apps: which BUILD_ROLE APKs this user can login to
const ALL_CREDENTIALS: { email: string; password: string; user: User; allowedApps: string[] }[] = [
  {
    email: 'anushka@bch.com', password: 'bch2024bdc',
    user: { id: 'c1a8c295-447e-498e-9702-52964d6d5352', name: 'Anushka', role: 'bdc', phone: null, avatar_url: null, specialty: 'BDC', is_active: true, created_at: '', updated_at: '' },
    allowedApps: ['bdc', 'all'],
  },
  {
    email: 'suma@bch.com', password: 'bch2024staff',
    user: { id: 'bae31ae2-994a-469c-8554-e37b161c51e7', name: 'Suma', role: 'staff', phone: null, avatar_url: null, specialty: 'E-cycles', is_active: true, created_at: '', updated_at: '' },
    allowedApps: ['staff', 'bdc', 'all'],
  },
  {
    email: 'ibrahim@bch.com', password: 'bch2024mgr',
    user: { id: 'd8513f8d-877f-4c20-b243-6dc839582778', name: 'Ibrahim', role: 'manager', phone: null, avatar_url: null, specialty: 'Manager', is_active: true, created_at: '', updated_at: '' },
    allowedApps: ['manager', 'staff', 'bdc', 'all'], // manager can login to all apps
  },
  {
    email: 'abhi@bch.com', password: 'bch2024staff',
    user: { id: 'a1b2c3d4-1111-2222-3333-444455556666', name: 'Abhi Gowda', role: 'staff', phone: null, avatar_url: null, specialty: 'Gear Cycles', is_active: true, created_at: '', updated_at: '' },
    allowedApps: ['staff', 'all'],
  },
  {
    email: 'nithin@bch.com', password: 'bch2024staff',
    user: { id: 'a1b2c3d4-2222-3333-4444-555566667777', name: 'Nithin', role: 'staff', phone: null, avatar_url: null, specialty: 'Kids/Budget', is_active: true, created_at: '', updated_at: '' },
    allowedApps: ['staff', 'all'],
  },
  {
    email: 'baba@bch.com', password: 'bch2024staff',
    user: { id: 'a1b2c3d4-3333-4444-5555-666677778888', name: 'Baba', role: 'staff', phone: null, avatar_url: null, specialty: '2nd Life', is_active: true, created_at: '', updated_at: '' },
    allowedApps: ['staff', 'all'],
  },
  {
    email: 'ranjitha@bch.com', password: 'bch2024staff',
    user: { id: 'a1b2c3d4-4444-5555-6666-777788889999', name: 'Ranjitha', role: 'staff', phone: null, avatar_url: null, specialty: 'Service', is_active: true, created_at: '', updated_at: '' },
    allowedApps: ['staff', 'all'],
  },
  {
    email: 'sunil@bch.com', password: 'bch2024staff',
    user: { id: 'a1b2c3d4-5555-6666-7777-888899990000', name: 'Sunil', role: 'staff', phone: null, avatar_url: null, specialty: 'Premium', is_active: true, created_at: '', updated_at: '' },
    allowedApps: ['staff', 'all'],
  },
];

// ---- Validate credentials locally ----
function validateLocal(email: string, password: string): User | null {
  for (const cred of ALL_CREDENTIALS) {
    if (cred.email === email && cred.password === password) {
      if (!cred.allowedApps.includes(BUILD_ROLE)) {
        return null; // This user can't login to this APK
      }
      return cred.user;
    }
  }
  return null;
}

// ---- Store ----

interface AuthState {
  user: User | null;
  session: unknown | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isLoginInProgress: boolean;
  effectiveRole: UserRole;
  authError: string | null;

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
  isLoginInProgress: false,
  effectiveRole: (BUILD_ROLE === 'all' ? 'staff' : BUILD_ROLE) as UserRole,
  authError: null,

  initialize: async () => {
    // Always require fresh login on app restart — no session restore
    set({ isLoading: false, isAuthenticated: false, user: null });
  },

  login: async (email: string, password: string) => {
    if (get().isLoginInProgress) return;

    set({ isLoginInProgress: true, authError: null });

    try {
      // Step 1: Validate credentials locally FIRST (instant, no network)
      const localUser = validateLocal(email, password);

      if (localUser) {
        // effectiveRole = the app's BUILD_ROLE so RoleGuard passes
        // (user is already authorized via allowedApps check)
        const role = (BUILD_ROLE !== 'all' ? BUILD_ROLE : localUser.role) as UserRole;
        set({
          user: localUser,
          isAuthenticated: true,
          isLoading: false,
          isLoginInProgress: false,
          effectiveRole: role,
          authError: null,
        });

        // Fire-and-forget Supabase login — don't block UI navigation
        // Once session is ready, API calls will switch from cache to live queries
        if (isSupabaseConfigured()) {
          supabase.auth.signInWithPassword({ email, password })
            .then(({ error }) => {
              if (!error) {
                setSupabaseSessionReady(true);
              }
            })
            .catch(() => {});
        }
        return;
      }

      // Step 2: If local validation failed, try Supabase with timeout
      if (isSupabaseConfigured()) {
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Connection timeout')), 5000)
        );

        try {
          const { data, error } = await Promise.race([
            supabase.auth.signInWithPassword({ email, password }),
            timeoutPromise,
          ]);

          if (!error && data.user) {
            const { data: profile } = await Promise.race([
              supabase.from('users').select('*').eq('id', data.user.id).single(),
              timeoutPromise,
            ]);

            if (profile) {
              const userProfile = (profile as { data: User }).data || profile as User;
              const localCred = ALL_CREDENTIALS.find(c => c.email === email);
              if (BUILD_ROLE !== 'all' && localCred && !localCred.allowedApps.includes(BUILD_ROLE)) {
                supabase.auth.signOut().catch(() => {});
                const err = `Access denied. This app is restricted to ${BUILD_ROLE} role.`;
                set({ isLoginInProgress: false, authError: err });
                throw new Error(err);
              }
              setSupabaseSessionReady(true);
              const supaRole = (BUILD_ROLE !== 'all' ? BUILD_ROLE : userProfile.role) as UserRole;
              set({
                user: userProfile,
                session: data.session,
                isAuthenticated: true,
                isLoading: false,
                isLoginInProgress: false,
                effectiveRole: supaRole,
                authError: null,
              });
              return;
            }
          }
        } catch (supaErr) {
          if ((supaErr as Error).message?.startsWith('Access denied')) {
            set({ isLoginInProgress: false });
            throw supaErr;
          }
        }
      }

      // Step 3: All auth methods failed
      const err = BUILD_ROLE !== 'all'
        ? 'Invalid credentials. Use the designated account for this app.'
        : 'Invalid email or password.';
      set({ isLoginInProgress: false, authError: err });
      throw new Error(err);

    } catch (err) {
      set({ isLoginInProgress: false });
      throw err;
    }
  },

  logout: async () => {
    // Clear state immediately, don't block on async cleanup
    setSupabaseSessionReady(false);
    set({ user: null, session: null, isAuthenticated: false, authError: null });
    // Non-blocking cleanup — clear PII from cache and biometric storage
    clearAllCache().catch(() => {});
    deleteCredentials().catch(() => {});
    if (isSupabaseConfigured()) {
      supabase.auth.signOut().catch(() => {});
    }
  },

  setUser: (user) => set({ user, isAuthenticated: !!user }),
}));
