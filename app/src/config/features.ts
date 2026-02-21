// ============================================================
// BCH CRM - Feature Flag System for Multi-APK Builds
// ============================================================

import type { UserRole } from '@/types';

// Build-time role from environment variable
export const BUILD_ROLE: UserRole | 'all' =
  (import.meta.env.VITE_APP_ROLE as UserRole | 'all') || 'all';

// Feature definitions
export interface FeatureFlags {
  // BDC Features
  incomingLeads: boolean;
  qualificationForm: boolean;
  callbackQueue: boolean;
  spamMarking: boolean;
  autoAssign: boolean;

  // Staff Features
  myLeads: boolean;
  leadDetail: boolean;
  callActions: boolean;
  whatsappActions: boolean;
  outcomeChips: boolean;
  followupScheduling: boolean;
  walkinCapture: boolean;
  visitConversion: boolean;
  customerTimeline: boolean;

  // Manager Features
  liveDashboard: boolean;
  contentROI: boolean;
  teamPerformance: boolean;
  pipelineView: boolean;
  reportsAnalytics: boolean;
  leadReassignment: boolean;

  // Shared
  automationEngine: boolean;
  offlineMode: boolean;
}

// Role-specific feature configurations
const BDC_FEATURES: FeatureFlags = {
  // BDC: ON
  incomingLeads: true,
  qualificationForm: true,
  callbackQueue: true,
  spamMarking: true,
  autoAssign: true,

  // Staff: OFF
  myLeads: false,
  leadDetail: false,
  callActions: false,
  whatsappActions: false,
  outcomeChips: false,
  followupScheduling: false,
  walkinCapture: false,
  visitConversion: false,
  customerTimeline: false,

  // Manager: OFF
  liveDashboard: false,
  contentROI: false,
  teamPerformance: false,
  pipelineView: false,
  reportsAnalytics: false,
  leadReassignment: false,

  // Shared
  automationEngine: false,
  offlineMode: true,
};

const STAFF_FEATURES: FeatureFlags = {
  // BDC: OFF
  incomingLeads: false,
  qualificationForm: false,
  callbackQueue: false,
  spamMarking: false,
  autoAssign: false,

  // Staff: ON
  myLeads: true,
  leadDetail: true,
  callActions: true,
  whatsappActions: true,
  outcomeChips: true,
  followupScheduling: true,
  walkinCapture: true,
  visitConversion: true,
  customerTimeline: true,

  // Manager: OFF
  liveDashboard: false,
  contentROI: false,
  teamPerformance: false,
  pipelineView: false,
  reportsAnalytics: false,
  leadReassignment: false,

  // Shared
  automationEngine: false,
  offlineMode: true,
};

const MANAGER_FEATURES: FeatureFlags = {
  // BDC: OFF (hide qualification/callback)
  incomingLeads: false,
  qualificationForm: false,
  callbackQueue: false,
  spamMarking: false,
  autoAssign: false,

  // Staff: Partial (view-only)
  myLeads: false,
  leadDetail: true,
  callActions: false,
  whatsappActions: false,
  outcomeChips: false,
  followupScheduling: false,
  walkinCapture: false,
  visitConversion: false,
  customerTimeline: true,

  // Manager: ON
  liveDashboard: true,
  contentROI: true,
  teamPerformance: true,
  pipelineView: true,
  reportsAnalytics: true,
  leadReassignment: true,

  // Shared
  automationEngine: true,
  offlineMode: true,
};

const ALL_FEATURES: FeatureFlags = {
  incomingLeads: true,
  qualificationForm: true,
  callbackQueue: true,
  spamMarking: true,
  autoAssign: true,
  myLeads: true,
  leadDetail: true,
  callActions: true,
  whatsappActions: true,
  outcomeChips: true,
  followupScheduling: true,
  walkinCapture: true,
  visitConversion: true,
  customerTimeline: true,
  liveDashboard: true,
  contentROI: true,
  teamPerformance: true,
  pipelineView: true,
  reportsAnalytics: true,
  leadReassignment: true,
  automationEngine: true,
  offlineMode: true,
};

const FEATURE_MAP: Record<string, FeatureFlags> = {
  bdc: BDC_FEATURES,
  staff: STAFF_FEATURES,
  manager: MANAGER_FEATURES,
  all: ALL_FEATURES,
};

export function getFeatures(role?: UserRole | 'all'): FeatureFlags {
  const effectiveRole = role || BUILD_ROLE;
  return FEATURE_MAP[effectiveRole] || ALL_FEATURES;
}

export function hasFeature(feature: keyof FeatureFlags, role?: UserRole | 'all'): boolean {
  return getFeatures(role)[feature];
}

// App metadata per role
export interface AppConfig {
  appName: string;
  appId: string;
  primaryColor: string;
  icon: string;
  defaultRoute: string;
}

export const APP_CONFIGS: Record<string, AppConfig> = {
  bdc: {
    appName: 'BCH Caller',
    appId: 'com.crm.bdc',
    primaryColor: '#1a73e8',
    icon: '/icons/bdc/icon.png',
    defaultRoute: '/bdc/incoming',
  },
  staff: {
    appName: 'BCH Sales',
    appId: 'com.crm.staff',
    primaryColor: '#0d904f',
    icon: '/icons/staff/icon.png',
    defaultRoute: '/staff/leads',
  },
  manager: {
    appName: 'BCH Manager',
    appId: 'com.crm.manager',
    primaryColor: '#7c3aed',
    icon: '/icons/manager/icon.png',
    defaultRoute: '/manager/live',
  },
  all: {
    appName: 'BCH CRM',
    appId: 'com.crm.bch',
    primaryColor: '#1a73e8',
    icon: '/icons/bdc/icon.png',
    defaultRoute: '/login',
  },
};

export function getAppConfig(): AppConfig {
  return APP_CONFIGS[BUILD_ROLE] || APP_CONFIGS.all;
}
