// ============================================================
// BCH CRM - Biometric Authentication Service
// Uses @aparajita/capacitor-biometric-auth for fingerprint/face
// Stores credentials via @capacitor/preferences (native SharedPreferences)
// NOT localStorage — which doesn't reliably persist on Android WebView
// ============================================================

import { BiometricAuth } from '@aparajita/capacitor-biometric-auth';
import { Preferences } from '@capacitor/preferences';
import { Capacitor } from '@capacitor/core';

const BIOMETRIC_FLAG_KEY = 'bch_biometric_enabled';
const BIOMETRIC_CREDS_KEY = 'bch_biometric_creds';

/** Check if biometric hardware is available on device */
export async function isBiometricAvailable(): Promise<boolean> {
  try {
    // On web platform, biometric is never truly available
    if (Capacitor.getPlatform() === 'web') return false;

    const result = await BiometricAuth.checkBiometry();
    // Accept if biometry is available OR device has secure lock (PIN/pattern/password)
    return result.isAvailable || result.deviceIsSecure;
  } catch {
    return false;
  }
}

/** Check if user has previously enabled biometric login (async — uses native storage) */
export async function isBiometricEnabled(): Promise<boolean> {
  try {
    const flag = await Preferences.get({ key: BIOMETRIC_FLAG_KEY });
    const creds = await Preferences.get({ key: BIOMETRIC_CREDS_KEY });
    return flag.value === 'true' && creds.value !== null;
  } catch {
    return false;
  }
}

/** Trigger biometric/device credential prompt to verify user identity */
export async function verifyBiometric(): Promise<boolean> {
  try {
    await BiometricAuth.authenticate({
      reason: 'Verify your identity to enable fingerprint login',
      androidTitle: 'Verify Identity',
      androidSubtitle: 'Use fingerprint or device PIN to confirm',
      allowDeviceCredential: true,
    });
    return true;
  } catch {
    return false;
  }
}

/** Save credentials after biometric verification (native persistent storage) */
export async function saveCredentials(email: string, password: string): Promise<boolean> {
  try {
    const encoded = btoa(JSON.stringify({ email, password }));
    await Preferences.set({ key: BIOMETRIC_CREDS_KEY, value: encoded });
    await Preferences.set({ key: BIOMETRIC_FLAG_KEY, value: 'true' });
    return true;
  } catch {
    return false;
  }
}

/** Prompt biometric verification and retrieve saved credentials */
export async function getCredentials(): Promise<{ email: string; password: string } | null> {
  try {
    // Prompt biometric verification
    await BiometricAuth.authenticate({
      reason: 'Sign in to BCH CRM',
      androidTitle: 'Biometric Login',
      androidSubtitle: 'Use fingerprint or face to sign in',
      allowDeviceCredential: true,
    });

    // Verification passed — retrieve stored credentials from native storage
    const result = await Preferences.get({ key: BIOMETRIC_CREDS_KEY });
    if (!result.value) return null;

    const { email, password } = JSON.parse(atob(result.value));
    return { email, password };
  } catch {
    return null;
  }
}

/** Clear stored biometric credentials (on logout) */
export async function deleteCredentials(): Promise<void> {
  await Preferences.remove({ key: BIOMETRIC_CREDS_KEY });
  await Preferences.remove({ key: BIOMETRIC_FLAG_KEY });
}
