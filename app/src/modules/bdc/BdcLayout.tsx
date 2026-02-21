// ============================================================
// BCH CRM - BDC Module Layout
// ============================================================

import { Outlet } from 'react-router-dom';
import { TopBar } from '@/components/layout/TopBar';
import { BottomNav } from '@/components/layout/BottomNav';
import type { TabItem } from '@/types';

const BDC_NAV_ITEMS: TabItem[] = [
  { id: 'incoming', label: 'Incoming', icon: '📞' },
  { id: 'qualify', label: 'Qualify', icon: '📋' },
  { id: 'leads', label: 'Leads', icon: '📄' },
  { id: 'callbacks', label: 'Callbacks', icon: '🔔' },
];

export function BdcLayout() {
  return (
    <>
      <TopBar title="BCH Caller" />
      <div className="pb-20">
        <Outlet />
      </div>
      <BottomNav items={BDC_NAV_ITEMS} basePath="/bdc" />
    </>
  );
}
