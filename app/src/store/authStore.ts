// ============================================================
// BCH CRM - Auth Store (Zustand)
// Handles: PIN-based login, logout, role-lock
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
// Each entry has a 4-digit PIN and allowed apps
const ALL_CREDENTIALS: { name: string; pin: string; user: User; allowedApps: string[] }[] = [
  {
    name: 'Anushka', pin: '1111',
    user: { id: 'c1a8c295-447e-498e-9702-52964d6d5352', name: 'Anushka', role: 'bdc', phone: null, avatar_url: null, specialty: 'BDC', pin: '1111', is_active: true, created_at: '', updated_at: '' },
    allowedApps: ['bdc', 'all'],
  },
  {
    name: 'Suma', pin: '2222',
    user: { id: 'bae31ae2-994a-469c-8554-e37b161c51e7', name: 'Suma', role: 'staff', phone: null, avatar_url: null, specialty: 'E-cycles', pin: '2222', is_active: true, created_at: '', updated_at: '' },
    allowedApps: ['staff', 'bdc', 'all'],
  },
  {
    name: 'Ibrahim', pin: '0000',
    user: { id: 'd8513f8d-877f-4c20-b243-6dc839582778', name: 'Ibrahim', role: 'manager', phone: null, avatar_url: null, specialty: 'Manager', pin: '0000', is_active: true, created_at: '', updated_at: '' },
    allowedApps: ['manager', 'staff', 'bdc', 'all'],
  },
  {
    name: 'Abhi Gowda', pin: '3333',
    user: { id: 'a1b2c3d4-1111-2222-3333-444455556666', name: 'Abhi Gowda', role: 'staff', phone: null, avatar_url: null, specialty: 'Gear Cycles', pin: '3333', is_active: true, created_at: '', updated_at: '' },
    allowedApps: ['staff', 'all'],
  },
  {
    name: 'Nithin', pin: '4444',
    user: { id: 'a1b2c3d4-2222-3333-4444-555566667777', name: 'Nithin', role: 'staff', phone: null, avatar_url: null, specialty: 'Kids/Budget', pin: '4444', is_active: true, created_at: '', updated_at: '' },
    allowedApps: ['staff', 'all'],
  },
  {
    name: 'Baba', pin: '5555',
    user: { id: 'a1b2c3d4-3333-4444-5555-666677778888', name: 'Baba', role: 'staff', phone: null, avatar_url: null, specialty: '2nd Life', pin: '5555', is_active: true, created_at: '', updated_at: '' },
    allowedApps: ['staff', 'all'],
  },
  {
    name: 'Ranjitha', pin: '6666',
    user: { id: 'a1b2c3d4-4444-5555-6666-777788889999', name: 'Ranjitha', role: 'staff', phone: null, avatar_url: null, specialty: 'Service', pin: '6666', is_active: true, created_at: '', updated_at: '' },
    allowedApps: ['staff', 'all'],
  },
  {
    name: 'Sunil', pin: '7777',
    user: { id: 'a1b2c3d4-5555-6666-7777-888899990000', name: 'Sunil', role: 'staff', phone: null, avatar_url: null, specialty: 'Premium', pin: '7777', is_active: true, created_at: '', updated_at: '' },
    allowedApps: ['staff', 'all'],
  },
];

// ---- Get all users for the login user picker ----
export function getAllUsers(): { id: string; name: string; role: UserRole; specialty: string | null }[] {
  return ALL_CREDENTIALS
    .filter(cred => cred.allowedApps.includes(BUILD_ROLE))
    .filter(cred => BUILD_ROLE === 'manager' || BUILD_ROLE === 'all' || cred.user.role !== 'manager')
    .map(cred => ({
      id: cred.user.id,
      name: cred.name,
      role: cred.user.role,
      specialty: cred.user.specialty,
    }));
}

// ---- Validate PIN locally ----
function validateLocal(userId: string, pin: string): User | null {
  for (const cred of ALL_CREDENTIALS) {
    if (cred.user.id === userId && cred.pin === pin) {
      if (!cred.allowedApps.includes(BUILD_ROLE)) {
        return null;
      }
      return cred.user;
    }
  }
  return null;
}

// ---- Update PIN for a user (manager action) ----
export function updateUserPin(userId: string, newPin: string): boolean {
  const cred = ALL_CREDENTIALS.find(c => c.user.id === userId);
  if (cred) {
    cred.pin = newPin;
    cred.user.pin = newPin;
    return true;
  }
  return false;
}

// ---- Add a new user (manager action) ----
export function addUser(name: string, pin: string, role: UserRole, specialty: string | null, allowedApps: string[]): User {
  const id = crypto.randomUUID();
  const user: User = {
    id,
    name,
    role,
    phone: null,
    avatar_url: null,
    specialty,
    pin,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  ALL_CREDENTIALS.push({ name, pin, user, allowedApps });
  return user;
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
  login: (userId: string, pin: string) => Promise<void>;
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
    set({ isLoading: false, isAuthenticated: false, user: null });
  },

  login: async (userId: string, pin: string) => {
    if (get().isLoginInProgress) return;

    set({ isLoginInProgress: true, authError: null });

    try {
      // Validate PIN locally
      const localUser = validateLocal(userId, pin);

      if (localUser) {
        const role = (BUILD_ROLE !== 'all' ? BUILD_ROLE : localUser.role) as UserRole;
        set({
          user: localUser,
          isAuthenticated: true,
          isLoading: false,
          isLoginInProgress: false,
          effectiveRole: role,
          authError: null,
        });

        // Establish Supabase session (wait up to 5s so data loads properly)
        if (isSupabaseConfigured()) {
          const emailMap: Record<string, { email: string; password: string }> = {
            'Anushka': { email: 'anushka@bch.com', password: 'bch2024bdc' },
            'Suma': { email: 'suma@bch.com', password: 'bch2024staff' },
            'Ibrahim': { email: 'ibrahim@bch.com', password: 'bch2024mgr' },
            'Abhi Gowda': { email: 'abhi@bch.com', password: 'bch2024staff' },
            'Nithin': { email: 'nithin@bch.com', password: 'bch2024staff' },
            'Baba': { email: 'baba@bch.com', password: 'bch2024staff' },
            'Ranjitha': { email: 'ranjitha@bch.com', password: 'bch2024staff' },
            'Sunil': { email: 'sunil@bch.com', password: 'bch2024staff' },
          };
          const creds = emailMap[localUser.name];
          if (creds) {
            try {
              const result = await Promise.race([
                supabase.auth.signInWithPassword(creds),
                new Promise<{ error: Error }>((resolve) =>
                  setTimeout(() => resolve({ error: new Error('timeout') }), 5000)
                ),
              ]);
              if (!result.error) setSupabaseSessionReady(true);
            } catch {
              // Supabase auth failed — app still works with local data
            }
          }
        }
        return;
      }

      // PIN validation failed
      const err = 'Invalid PIN. Please try again.';
      set({ isLoginInProgress: false, authError: err });
      throw new Error(err);

    } catch (err) {
      set({ isLoginInProgress: false });
      throw err;
    }
  },

  logout: async () => {
    setSupabaseSessionReady(false);
    set({ user: null, session: null, isAuthenticated: false, authError: null });
    clearAllCache().catch(() => {});
    deleteCredentials().catch(() => {});
    if (isSupabaseConfigured()) {
      supabase.auth.signOut().catch(() => {});
    }
  },

  setUser: (user) => set({ user, isAuthenticated: !!user }),
}));
