// ============================================================
// BCH CRM - Top Bar Navigation (with Logout)
// ============================================================

import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import { getAppConfig, BUILD_ROLE } from '@/config/features';

interface TopBarProps {
  title?: string;
  showBack?: boolean;
  badge?: number;
  rightAction?: React.ReactNode;
}

export function TopBar({ title, showBack, badge, rightAction }: TopBarProps) {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { isOffline, pendingSyncCount } = useUIStore();
  const config = getAppConfig();

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="sticky top-0 z-30 bg-primary-500 text-white shadow-md">
      <div className="flex items-center justify-between px-4 py-3 max-w-mobile mx-auto">
        <div className="flex items-center gap-3">
          {showBack && (
            <button
              onClick={() => navigate(-1)}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 active:scale-95"
            >
              ←
            </button>
          )}
          {!showBack && BUILD_ROLE === 'all' && (
            <button
              onClick={() => navigate('/')}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10"
            >
              🏠
            </button>
          )}
          <div>
            <h1 className="text-base font-bold leading-tight">
              {title || config.appName}
              {badge !== undefined && badge > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-danger-500 text-white text-xs rounded-full">
                  {badge}
                </span>
              )}
            </h1>
            {user && (
              <p className="text-[10px] text-white/70">{user.name} • {user.role.toUpperCase()}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isOffline && (
            <span className="px-2 py-1 bg-warning-500 text-white text-[10px] rounded-full font-bold">
              OFFLINE {pendingSyncCount > 0 && `(${pendingSyncCount})`}
            </span>
          )}
          {rightAction}
          {/* Logout button */}
          <button
            onClick={handleLogout}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 active:scale-95"
            title="Logout"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
