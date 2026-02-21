// ============================================================
// BCH CRM - Role-Based Route Guard
// ============================================================

import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { hasFeature, BUILD_ROLE, getAppConfig, type FeatureFlags } from '@/config/features';
import type { UserRole } from '@/types';

interface RoleGuardProps {
  allowedRoles: UserRole[];
  requiredFeature?: keyof FeatureFlags;
  children: React.ReactNode;
}

export function RoleGuard({ allowedRoles, requiredFeature, children }: RoleGuardProps) {
  const { isAuthenticated, effectiveRole } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check build-level role lock
  if (BUILD_ROLE !== 'all' && !allowedRoles.includes(BUILD_ROLE as UserRole)) {
    return <Navigate to={getAppConfig().defaultRoute} replace />;
  }

  // Check user role
  if (!allowedRoles.includes(effectiveRole)) {
    return <Navigate to={getAppConfig().defaultRoute} replace />;
  }

  // Check feature flag
  if (requiredFeature && !hasFeature(requiredFeature)) {
    return <Navigate to={getAppConfig().defaultRoute} replace />;
  }

  return <>{children}</>;
}

// Simple auth guard (any authenticated user)
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-pulse text-primary-500 text-lg font-medium">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
