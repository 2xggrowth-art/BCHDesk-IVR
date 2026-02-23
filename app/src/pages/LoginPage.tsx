// ============================================================
// BCH CRM - Login Page
// Features: email login, biometric login, password toggle, role identity
// ============================================================

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';
import { BUILD_ROLE, getAppConfig } from '@/config/features';
import {
  isBiometricAvailable,
  isBiometricEnabled,
  verifyBiometric,
  saveCredentials,
  getCredentials,
} from '@/services/biometric';

export function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoginInProgress, authError } = useAuthStore();
  const config = getAppConfig();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState('');
  const [biometricReady, setBiometricReady] = useState(false);
  const [showBiometricPrompt, setShowBiometricPrompt] = useState(false);
  const pendingCredsRef = useRef<{ email: string; password: string } | null>(null);

  // Check biometric availability on mount
  useEffect(() => {
    async function checkBiometric() {
      try {
        const available = await isBiometricAvailable();
        const enabled = await isBiometricEnabled();
        setBiometricReady(available && enabled);
      } catch {
        setBiometricReady(false);
      }
    }
    checkBiometric();
  }, []);

  // No auto-redirect useEffect — all navigation is explicit in handlers
  // This prevents race conditions with the biometric prompt

  const handleLogin = async () => {
    if (isLoginInProgress) return;

    if (!email || !password) {
      setLocalError('Enter email and password');
      return;
    }

    setLocalError('');

    try {
      await login(email.trim().toLowerCase(), password.trim());

      // Login succeeded — now check biometric BEFORE navigating
      try {
        const available = await isBiometricAvailable();
        const enabled = await isBiometricEnabled();

        if (available && !enabled) {
          // Save creds in ref (survives re-render) and show prompt
          pendingCredsRef.current = { email: email.trim().toLowerCase(), password };
          setShowBiometricPrompt(true);
          return; // Don't navigate — show biometric prompt instead
        }
      } catch {
        // Biometric check failed — just proceed to app
      }

      navigate(config.defaultRoute, { replace: true });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Login failed';
      setLocalError(msg);
    }
  };

  const handleBiometricLogin = async () => {
    if (isLoginInProgress) return;
    setLocalError('');

    try {
      const creds = await getCredentials();
      if (creds) {
        await login(creds.email, creds.password);
        navigate(config.defaultRoute, { replace: true });
      } else {
        setLocalError('Biometric cancelled. Please use email login.');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Biometric login failed';
      setLocalError(msg);
    }
  };

  const handleEnableBiometric = async () => {
    if (pendingCredsRef.current) {
      // Trigger device biometric/PIN prompt to verify identity FIRST
      const verified = await verifyBiometric();
      if (verified) {
        await saveCredentials(pendingCredsRef.current.email, pendingCredsRef.current.password);
      } else {
        // Verification failed/cancelled — don't save, just proceed to app
        setLocalError('Biometric verification failed. You can enable it later.');
      }
    }
    pendingCredsRef.current = null;
    setShowBiometricPrompt(false);
    navigate(config.defaultRoute, { replace: true });
  };

  const handleSkipBiometric = () => {
    pendingCredsRef.current = null;
    setShowBiometricPrompt(false);
    navigate(config.defaultRoute, { replace: true });
  };

  const displayError = localError || authError || '';

  // Biometric enable prompt (shown after first successful email login)
  if (showBiometricPrompt) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary-500 to-primary-700 flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <div className="bg-white rounded-2xl p-6 shadow-xl text-center">
            <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-primary-500">
                <path d="M12 11c0-1.1-.9-2-2-2s-2 .9-2 2 .9 2 2 2" />
                <path d="M12 11c0-2.76-2.24-5-5-5s-5 2.24-5 5 2.24 5 5 5" />
                <path d="M12 11c0-4.42-3.58-8-8-8" />
                <path d="M20 11c0-4.42-3.58-8-8-8" />
                <path d="M20 11c0 4.42-3.58 8-8 8" />
                <path d="M12 11c0 2.76-2.24 5-5 5" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-gray-900 mb-2">Enable Fingerprint Login?</h2>
            <p className="text-sm text-gray-500 mb-6">
              Use your fingerprint to sign in quickly next time without typing your password.
            </p>
            <div className="space-y-3">
              <Button variant="primary" size="lg" fullWidth onClick={handleEnableBiometric}>
                Enable Fingerprint
              </Button>
              <button
                onClick={handleSkipBiometric}
                className="w-full py-3 text-sm text-gray-500 font-medium"
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-500 to-primary-700 flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        {/* Logo + App Identity */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg overflow-hidden p-2">
            <img src="/bch-logo.png" alt="BCH" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-2xl font-bold text-white">{config.appName}</h1>
          <p className="text-sm text-white/70 mt-1">Bharath Cycle Hub</p>
          {BUILD_ROLE !== 'all' && (
            <span className="inline-block mt-2 px-4 py-1.5 bg-white/20 text-white text-xs rounded-full font-bold uppercase tracking-wider">
              {BUILD_ROLE === 'bdc' ? 'BDC Caller App' : BUILD_ROLE === 'staff' ? 'Sales Staff App' : 'Manager App'}
            </span>
          )}
        </div>

        {/* Login form */}
        <div className="bg-white rounded-2xl p-6 shadow-xl">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setLocalError(''); }}
                placeholder="your@email.com"
                disabled={isLoginInProgress}
                className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-300 focus:border-primary-400 outline-none disabled:opacity-50 disabled:bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setLocalError(''); }}
                  placeholder="Enter password"
                  disabled={isLoginInProgress}
                  className="w-full px-4 py-3 pr-12 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-300 focus:border-primary-400 outline-none disabled:opacity-50 disabled:bg-gray-50"
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 active:text-gray-600 p-1"
                >
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Error message */}
            {displayError && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">
                <p className="text-xs text-red-600 font-medium">{displayError}</p>
              </div>
            )}

            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={handleLogin}
              disabled={isLoginInProgress}
            >
              {isLoginInProgress ? 'Signing in...' : 'Sign In'}
            </Button>
          </div>

          {/* Biometric login button (only if previously enabled) */}
          {biometricReady && (
            <div className="mt-5 pt-4 border-t border-gray-100">
              <button
                onClick={handleBiometricLogin}
                disabled={isLoginInProgress}
                className="w-full flex items-center justify-center gap-3 py-3 bg-gray-50 rounded-xl active:scale-[0.98] disabled:opacity-50"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-primary-500">
                  <path d="M12 11c0-1.1-.9-2-2-2s-2 .9-2 2 .9 2 2 2" />
                  <path d="M12 11c0-2.76-2.24-5-5-5s-5 2.24-5 5 2.24 5 5 5" />
                  <path d="M12 11c0-4.42-3.58-8-8-8" />
                  <path d="M20 11c0-4.42-3.58-8-8-8" />
                  <path d="M20 11c0 4.42-3.58 8-8 8" />
                  <path d="M12 11c0 2.76-2.24 5-5 5" />
                </svg>
                <span className="text-sm font-semibold text-gray-700">Sign in with Fingerprint</span>
              </button>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-white/50 mt-6">v1.0.6 • BCH Lead Management</p>
      </div>
    </div>
  );
}
