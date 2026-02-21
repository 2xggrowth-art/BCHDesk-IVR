import type { CapacitorConfig } from '@capacitor/cli';

// Read the build flavor from environment
const appRole = process.env.VITE_APP_ROLE || 'all';

const APP_CONFIGS: Record<string, { appId: string; appName: string; webDir: string }> = {
  bdc: {
    appId: 'com.crm.bdc',
    appName: 'BCH Caller',
    webDir: 'dist/bdc',
  },
  staff: {
    appId: 'com.crm.staff',
    appName: 'BCH Sales',
    webDir: 'dist/staff',
  },
  manager: {
    appId: 'com.crm.manager',
    appName: 'BCH Manager',
    webDir: 'dist/manager',
  },
  all: {
    appId: 'com.crm.bch',
    appName: 'BCH CRM',
    webDir: 'dist',
  },
};

const flavorConfig = APP_CONFIGS[appRole] || APP_CONFIGS.all;

const config: CapacitorConfig = {
  appId: flavorConfig.appId,
  appName: flavorConfig.appName,
  webDir: flavorConfig.webDir,
  server: {
    androidScheme: 'https',
  },
  plugins: {
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
    Keyboard: {
      resize: 'body',
      style: 'dark',
    },
    StatusBar: {
      style: 'light',
      backgroundColor: '#1a73e8',
    },
  },
  android: {
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: false,
  },
};

export default config;
