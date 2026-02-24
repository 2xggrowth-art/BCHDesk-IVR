// ============================================================
// BCH CRM - App Shell (Mobile Layout Container)
// ============================================================

import type { ReactNode } from 'react';
import { ToastContainer } from '@/components/ui/Toast';
import { useSync } from '@/hooks/useSync';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  // Enable offline sync — syncs pending actions when connectivity returns
  useSync();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-mobile mx-auto min-h-screen bg-gray-50 relative">
        <ToastContainer />
        {children}
      </div>
    </div>
  );
}
