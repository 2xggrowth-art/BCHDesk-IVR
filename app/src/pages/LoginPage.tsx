// ============================================================
// BCH CRM - Login Page
// ============================================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import { BUILD_ROLE, getAppConfig } from '@/config/features';

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const { showToast } = useUIStore();
  const config = getAppConfig();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      showToast('Enter email and password', 'warning');
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
      navigate(config.defaultRoute);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      showToast(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Quick login with real credentials
  const handleDemoLogin = async (role: string) => {
    const credentials: Record<string, { email: string; password: string }> = {
      bdc: { email: 'anushka@bch.com', password: 'bch2024bdc' },
      staff: { email: 'suma@bch.com', password: 'bch2024staff' },
      manager: { email: 'ibrahim@bch.com', password: 'bch2024mgr' },
    };
    const cred = credentials[role];
    if (!cred) return;

    setIsLoading(true);
    try {
      await login(cred.email, cred.password);
      const routes: Record<string, string> = {
        bdc: '/bdc/incoming',
        staff: '/staff/leads',
        manager: '/manager/live',
      };
      navigate(routes[role] || '/');
    } catch {
      showToast('Login failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-500 to-primary-700 flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        {/* Logo area */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-3xl">🚲</span>
          </div>
          <h1 className="text-2xl font-bold text-white">{config.appName}</h1>
          <p className="text-sm text-white/70 mt-1">Bharath Cycle Hub</p>
          {BUILD_ROLE !== 'all' && (
            <span className="inline-block mt-2 px-3 py-1 bg-white/20 text-white text-xs rounded-full font-medium uppercase">
              {BUILD_ROLE} Login
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
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-300 focus:border-primary-400 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-300 focus:border-primary-400 outline-none"
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              />
            </div>

            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </div>

          {/* Quick login buttons */}
          <div className="mt-6 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-400 text-center mb-3">Quick Login</p>
            {BUILD_ROLE === 'all' ? (
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleDemoLogin('bdc')}
                  className="py-2.5 px-2 bg-primary-50 text-primary-600 text-xs font-semibold rounded-xl active:scale-95"
                >
                  BDC
                </button>
                <button
                  onClick={() => handleDemoLogin('staff')}
                  className="py-2.5 px-2 bg-success-50 text-success-500 text-xs font-semibold rounded-xl active:scale-95"
                >
                  Staff
                </button>
                <button
                  onClick={() => handleDemoLogin('manager')}
                  className="py-2.5 px-2 bg-purple-50 text-purple-600 text-xs font-semibold rounded-xl active:scale-95"
                >
                  Manager
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleDemoLogin(BUILD_ROLE)}
                className="w-full py-3 bg-primary-50 text-primary-600 text-sm font-semibold rounded-xl active:scale-95"
              >
                Login as {BUILD_ROLE === 'bdc' ? 'Anushka (BDC)' : BUILD_ROLE === 'staff' ? 'Suma (Staff)' : 'Ibrahim (Manager)'}
              </button>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-white/50 mt-6">v1.0.0 • BCH Lead Management</p>
      </div>
    </div>
  );
}
