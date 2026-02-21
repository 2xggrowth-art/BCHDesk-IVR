// ============================================================
// BCH CRM - Top Bar Navigation
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
  const { user } = useAuthStore();
  const { isOffline, pendingSyncCount } = useUIStore();
  const config = getAppConfig();

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
        </div>
      </div>
    </div>
  );
}
