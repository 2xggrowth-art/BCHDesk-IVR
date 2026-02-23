// ============================================================
// BCH CRM - Manager Module Layout
// ============================================================

import { Outlet } from 'react-router-dom';
import { TopBar } from '@/components/layout/TopBar';
import { BottomNav } from '@/components/layout/BottomNav';
import type { TabItem } from '@/types';

const MANAGER_NAV_ITEMS: TabItem[] = [
  { id: 'live', label: 'Live', icon: '📊' },
  { id: 'content', label: 'Content', icon: '📈' },
  { id: 'pipeline', label: 'Pipeline', icon: '🔄' },
  { id: 'team', label: 'Team', icon: '👥' },
  { id: 'users', label: 'Users', icon: '👤' },
];

export function ManagerLayout() {
  return (
    <>
      <TopBar title="BCH Manager" />
      <div className="pb-20">
        <Outlet />
      </div>
      <BottomNav items={MANAGER_NAV_ITEMS} basePath="/manager" />
    </>
  );
}
