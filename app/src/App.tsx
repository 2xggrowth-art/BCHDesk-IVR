// ============================================================
// BCH CRM - Main App with Role-Based Routing
// ============================================================

import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { AuthGuard, RoleGuard } from '@/guards/RoleGuard';
import { useAuthStore } from '@/store/authStore';
import { BUILD_ROLE, getAppConfig } from '@/config/features';
import { validateEnv } from '@/config/env';
import { initOfflineDB } from '@/services/offline';
import { startAutomationEngine } from '@/modules/automation/engine';
import { PushNotifications } from '@capacitor/push-notifications';
import { Network } from '@capacitor/network';

// Pages
import { LoginPage } from '@/pages/LoginPage';

// BDC Module
import { BdcLayout } from '@/modules/bdc/BdcLayout';
import { IncomingPage } from '@/modules/bdc/pages/IncomingPage';
import { CallLogPage } from '@/modules/bdc/pages/CallLogPage';
import { RecordingsPage } from '@/modules/bdc/pages/RecordingsPage';
import { LeadsListPage } from '@/modules/bdc/pages/LeadsListPage';
import { CallbacksPage } from '@/modules/bdc/pages/CallbacksPage';

// Staff Module
import { StaffLayout } from '@/modules/staff/StaffLayout';
import { MyLeadsPage } from '@/modules/staff/pages/MyLeadsPage';
import { LeadDetailPage } from '@/modules/staff/pages/LeadDetailPage';
import { WalkinPage } from '@/modules/staff/pages/WalkinPage';
import { FollowupsPage } from '@/modules/staff/pages/FollowupsPage';

// Manager Module
import { ManagerLayout } from '@/modules/manager/ManagerLayout';
import { LiveDashboard } from '@/modules/manager/pages/LiveDashboard';
import { ContentROI } from '@/modules/manager/pages/ContentROI';
import { PipelinePage } from '@/modules/manager/pages/PipelinePage';
import { TeamPage } from '@/modules/manager/pages/TeamPage';
import { UsersPage } from '@/modules/manager/pages/UsersPage';

// Login route — no auto-redirect, LoginPage handles navigation explicitly
function LoginRoute() {
  return <LoginPage />;
}

// Request device permissions on first launch
async function requestPermissions() {
  try {
    // Push notifications permission
    const pushStatus = await PushNotifications.checkPermissions();
    if (pushStatus.receive !== 'granted') {
      await PushNotifications.requestPermissions();
    }
  } catch { /* not available on web */ }

  try {
    // Network status
    await Network.getStatus();
  } catch { /* ignore */ }

}

export default function App() {
  const { initialize, isLoading } = useAuthStore();
  const config = getAppConfig();

  useEffect(() => {
    validateEnv();
    initOfflineDB();
    initialize();

    // Request device permissions on first launch
    requestPermissions();

    // Start automation for manager role
    if (BUILD_ROLE === 'manager' || BUILD_ROLE === 'all') {
      startAutomationEngine();
    }
  }, [initialize]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse shadow-lg overflow-hidden p-2">
            <img src="/bch-logo.png" alt="BCH" className="w-full h-full object-contain" />
          </div>
          <p className="text-sm text-gray-500 font-medium">{config.appName}</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <AppShell>
        <Routes>
          {/* Login - redirects to dashboard if already authenticated */}
          <Route path="/login" element={<LoginRoute />} />

          {/* BDC Routes */}
          {(BUILD_ROLE === 'bdc' || BUILD_ROLE === 'all') && (
            <Route
              path="/bdc"
              element={
                <AuthGuard>
                  <RoleGuard allowedRoles={['bdc', 'manager']}>
                    <BdcLayout />
                  </RoleGuard>
                </AuthGuard>
              }
            >
              <Route index element={<Navigate to="incoming" replace />} />
              <Route path="incoming" element={<IncomingPage />} />
              <Route path="calllog" element={<CallLogPage />} />
              <Route path="recordings" element={<RecordingsPage />} />
              <Route path="leads" element={<LeadsListPage />} />
              <Route path="leads/:id" element={<LeadDetailPage />} />
              <Route path="callbacks" element={<CallbacksPage />} />
            </Route>
          )}

          {/* Staff Routes */}
          {(BUILD_ROLE === 'staff' || BUILD_ROLE === 'all') && (
            <Route
              path="/staff"
              element={
                <AuthGuard>
                  <RoleGuard allowedRoles={['staff', 'manager']}>
                    <StaffLayout />
                  </RoleGuard>
                </AuthGuard>
              }
            >
              <Route index element={<Navigate to="leads" replace />} />
              <Route path="leads" element={<MyLeadsPage />} />
              <Route path="lead/:id" element={<LeadDetailPage />} />
              <Route path="followups" element={<FollowupsPage />} />
              <Route path="walkin" element={<WalkinPage />} />
            </Route>
          )}

          {/* Manager Routes */}
          {(BUILD_ROLE === 'manager' || BUILD_ROLE === 'all') && (
            <Route
              path="/manager"
              element={
                <AuthGuard>
                  <RoleGuard allowedRoles={['manager']}>
                    <ManagerLayout />
                  </RoleGuard>
                </AuthGuard>
              }
            >
              <Route index element={<Navigate to="live" replace />} />
              <Route path="live" element={<LiveDashboard />} />
              <Route path="content" element={<ContentROI />} />
              <Route path="pipeline" element={<PipelinePage />} />
              <Route path="team" element={<TeamPage />} />
              <Route path="users" element={<UsersPage />} />
            </Route>
          )}

          {/* Default redirect based on build role */}
          <Route
            path="/"
            element={<Navigate to={config.defaultRoute} replace />}
          />
          <Route path="*" element={<Navigate to={config.defaultRoute} replace />} />
        </Routes>
      </AppShell>
    </BrowserRouter>
  );
}
