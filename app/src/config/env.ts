// ============================================================
// BCH CRM - Environment Configuration
// ============================================================

export const ENV = {
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL as string || '',
  SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY as string || '',
  APP_ROLE: import.meta.env.VITE_APP_ROLE as string || 'all',
  IS_PRODUCTION: import.meta.env.PROD,
  IS_DEVELOPMENT: import.meta.env.DEV,
} as const;

// Validate required env vars
export function validateEnv(): void {
  if (!ENV.SUPABASE_URL) {
    console.warn('VITE_SUPABASE_URL is not set. Running in offline/demo mode.');
  }
  if (!ENV.SUPABASE_ANON_KEY) {
    console.warn('VITE_SUPABASE_ANON_KEY is not set. Running in offline/demo mode.');
  }
}
