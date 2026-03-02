// ============================================================
// BCH CRM - Login Page
// Features: user selection + 4-digit PIN login
// ============================================================

import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { useAuthStore, getAllUsers } from '@/store/authStore';
import { BUILD_ROLE, getAppConfig } from '@/config/features';

export function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoginInProgress, authError } = useAuthStore();
  const config = getAppConfig();
  const availableUsers = getAllUsers();

  const [selectedUserId, setSelectedUserId] = useState('');
  const [pin, setPin] = useState(['', '', '', '']);
  const [localError, setLocalError] = useState('');
  const pinRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

  // Auto-submit when all 4 digits entered
  useEffect(() => {
    if (pin.every(d => d !== '') && selectedUserId) {
      handleLogin(pin.join(''));
    }
  }, [pin]);

  const handlePinChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // Only digits

    const newPin = [...pin];
    if (value.length > 1) {
      // Handle paste: distribute digits across boxes
      const digits = value.split('').slice(0, 4 - index);
      digits.forEach((d, i) => {
        if (index + i < 4) newPin[index + i] = d;
      });
      setPin(newPin);
      const nextIdx = Math.min(index + digits.length, 3);
      pinRefs[nextIdx]?.current?.focus();
      return;
    }

    newPin[index] = value;
    setPin(newPin);
    setLocalError('');

    if (value && index < 3) {
      pinRefs[index + 1]?.current?.focus();
    }
  };

  const handlePinKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      const newPin = [...pin];
      newPin[index - 1] = '';
      setPin(newPin);
      pinRefs[index - 1]?.current?.focus();
    }
  };

  const handleLogin = async (pinCode?: string) => {
    if (isLoginInProgress) return;

    const fullPin = pinCode || pin.join('');

    if (!selectedUserId) {
      setLocalError('Select your name');
      return;
    }
    if (fullPin.length !== 4) {
      setLocalError('Enter your 4-digit PIN');
      return;
    }

    setLocalError('');

    try {
      await login(selectedUserId, fullPin);
      navigate(config.defaultRoute, { replace: true });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Login failed';
      setLocalError(msg);
      // Clear PIN on error
      setPin(['', '', '', '']);
      pinRefs[0]?.current?.focus();
    }
  };

  const handleUserSelect = (userId: string) => {
    setSelectedUserId(userId);
    setLocalError('');
    setPin(['', '', '', '']);
    // Focus first PIN box after selecting user
    setTimeout(() => pinRefs[0]?.current?.focus(), 100);
  };

  const displayError = localError || authError || '';
  const selectedUser = availableUsers.find(u => u.id === selectedUserId);

  const roleColor = (role: string) => {
    if (role === 'manager') return 'bg-purple-100 text-purple-700 border-purple-200';
    if (role === 'bdc') return 'bg-green-100 text-green-700 border-green-200';
    return 'bg-blue-100 text-blue-700 border-blue-200';
  };

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

        {/* Login card */}
        <div className="bg-white rounded-2xl p-6 shadow-xl">
          {/* Step 1: User Selection */}
          {!selectedUserId ? (
            <div>
              <h2 className="text-sm font-bold text-gray-700 mb-3">Who are you?</h2>
              <div className="space-y-2 max-h-72 overflow-y-auto">
                {availableUsers.map(user => (
                  <button
                    key={user.id}
                    onClick={() => handleUserSelect(user.id)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-100 active:scale-[0.98] active:bg-gray-50 transition-all"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-primary-600">{user.name.charAt(0)}</span>
                    </div>
                    <div className="text-left flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${roleColor(user.role)}`}>
                          {user.role.toUpperCase()}
                        </span>
                        {user.specialty && (
                          <span className="text-[10px] text-gray-400 truncate">{user.specialty}</span>
                        )}
                      </div>
                    </div>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-300 flex-shrink-0">
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Step 2: PIN Entry */
            <div>
              {/* Selected user header */}
              <button
                onClick={() => { setSelectedUserId(''); setPin(['', '', '', '']); setLocalError(''); }}
                className="flex items-center gap-2 mb-5 text-primary-500 active:opacity-70"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
                <span className="text-xs font-semibold">Change User</span>
              </button>

              <div className="text-center mb-6">
                <div className="w-14 h-14 rounded-full bg-primary-50 flex items-center justify-center mx-auto mb-2">
                  <span className="text-lg font-bold text-primary-600">{selectedUser?.name.charAt(0)}</span>
                </div>
                <p className="text-base font-bold text-gray-900">{selectedUser?.name}</p>
                <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${roleColor(selectedUser?.role || 'staff')}`}>
                  {selectedUser?.role.toUpperCase()}
                </span>
              </div>

              <p className="text-xs font-semibold text-gray-500 uppercase text-center mb-3">Enter 4-Digit PIN</p>

              {/* PIN Input Boxes */}
              <div className="flex justify-center gap-3 mb-4">
                {pin.map((digit, i) => (
                  <input
                    key={i}
                    ref={pinRefs[i]}
                    type="password"
                    inputMode="numeric"
                    maxLength={4}
                    value={digit}
                    onChange={(e) => handlePinChange(i, e.target.value)}
                    onKeyDown={(e) => handlePinKeyDown(i, e)}
                    disabled={isLoginInProgress}
                    className="w-14 h-14 text-center text-xl font-bold border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-300 focus:border-primary-400 outline-none disabled:opacity-50 disabled:bg-gray-50"
                  />
                ))}
              </div>

              {/* Error message */}
              {displayError && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-2.5 mb-4">
                  <p className="text-xs text-red-600 font-medium text-center">{displayError}</p>
                </div>
              )}

              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={() => handleLogin()}
                disabled={isLoginInProgress || pin.some(d => d === '')}
              >
                {isLoginInProgress ? 'Signing in...' : 'Sign In'}
              </Button>
            </div>
          )}

          {/* Error when no user selected */}
          {!selectedUserId && displayError && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-2.5 mt-3">
              <p className="text-xs text-red-600 font-medium text-center">{displayError}</p>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-white/50 mt-6">v1.0.7 • BCH Lead Management</p>
      </div>
    </div>
  );
}
