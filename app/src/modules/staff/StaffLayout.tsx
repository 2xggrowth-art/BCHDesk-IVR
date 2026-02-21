// ============================================================
// BCH CRM - Staff Module Layout
// ============================================================

import { Outlet } from 'react-router-dom';
import { TopBar } from '@/components/layout/TopBar';
import { BottomNav } from '@/components/layout/BottomNav';
import type { TabItem } from '@/types';

const STAFF_NAV_ITEMS: TabItem[] = [
  { id: 'leads', label: 'My Leads', icon: '📄' },
  { id: 'followups', label: 'Follow-ups', icon: '📅' },
  { id: 'walkin', label: 'Walk-in', icon: '🚶' },
];

export function StaffLayout() {
  return (
    <>
      <TopBar title="BCH Sales" />
      <div className="pb-20">
        <Outlet />
      </div>
      <BottomNav items={STAFF_NAV_ITEMS} basePath="/staff" />
    </>
  );
}
