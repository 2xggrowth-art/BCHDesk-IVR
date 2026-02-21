// ============================================================
// BCH CRM - Bottom Navigation Bar
// ============================================================

import { useNavigate, useLocation } from 'react-router-dom';
import type { TabItem } from '@/types';

interface BottomNavProps {
  items: TabItem[];
  basePath: string;
}

export function BottomNav({ items, basePath }: BottomNavProps) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-200 safe-area-bottom">
      <div className="flex items-stretch max-w-mobile mx-auto">
        {items.map((item) => {
          const path = `${basePath}/${item.id}`;
          const isActive = location.pathname === path || location.pathname.startsWith(path + '/');

          return (
            <button
              key={item.id}
              onClick={() => navigate(path)}
              className={`
                flex-1 flex flex-col items-center justify-center
                py-2 px-1 relative
                transition-colors duration-150
                ${isActive ? 'text-primary-500' : 'text-gray-400'}
              `}
            >
              <span className="text-xl relative">
                {item.icon}
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1 -right-2 min-w-[16px] h-4 px-1 bg-danger-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </span>
              <span className={`text-[10px] mt-0.5 font-medium ${isActive ? 'font-bold' : ''}`}>
                {item.label}
              </span>
              {isActive && (
                <div className="absolute top-0 left-1/4 right-1/4 h-0.5 bg-primary-500 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
