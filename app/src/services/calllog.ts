// ============================================================
// BCH CRM - Call Log & Recordings Service
// Bridge to native CallLogPlugin for Android call history,
// device call recording files, and speech-to-text
// ============================================================

import { Capacitor, registerPlugin } from '@capacitor/core';

// Types
export interface CallLogEntry {
  number: string;
  name: string;
  type: 'incoming' | 'outgoing' | 'missed' | 'rejected' | 'unknown';
  date: number; // timestamp ms
  duration: number; // seconds
}

export interface CallRecording {
  fileName: string;
  filePath: string;
  date: number; // timestamp ms
  duration: number; // ms (0 if unknown)
  size: number; // bytes
}

export interface PermissionStatus {
  callLog: boolean;
  storage: boolean;
  microphone: boolean;
}

// Native plugin interface
interface CallLogPluginInterface {
  getCallLog(options?: { limit?: number }): Promise<{ entries: CallLogEntry[]; error?: string }>;
  getCallRecordings(): Promise<{ recordings: CallRecording[] }>;
  requestCallLogPermission(): Promise<{ granted: boolean }>;
  requestStoragePermission(): Promise<{ granted: boolean }>;
  requestMicPermission(): Promise<{ granted: boolean }>;
  checkPermissions(): Promise<PermissionStatus>;
  startSpeechRecognition(options?: { language?: string }): Promise<{ text: string; error?: string }>;
  stopSpeechRecognition(): Promise<void>;
  startCallListener(): Promise<void>;
  stopCallListener(): Promise<void>;
  addListener(event: string, callback: (data: Record<string, unknown>) => void): Promise<{ remove: () => void }>;
}

// Register the native plugin
const CallLogNative = registerPlugin<CallLogPluginInterface>('CallLog');

/** Check all permission states */
export async function checkPermissions(): Promise<PermissionStatus> {
  try {
    if (Capacitor.getPlatform() === 'web') return { callLog: false, storage: false, microphone: false };
    return await CallLogNative.checkPermissions();
  } catch {
    return { callLog: false, storage: false, microphone: false };
  }
}

/** Request call log permission */
export async function requestCallLogPermission(): Promise<boolean> {
  try {
    if (Capacitor.getPlatform() === 'web') return false;
    const result = await CallLogNative.requestCallLogPermission();
    return result.granted;
  } catch {
    return false;
  }
}

/** Request storage permission */
export async function requestStoragePermission(): Promise<boolean> {
  try {
    if (Capacitor.getPlatform() === 'web') return false;
    const result = await CallLogNative.requestStoragePermission();
    return result.granted;
  } catch {
    return false;
  }
}

/** Request microphone permission */
export async function requestMicPermission(): Promise<boolean> {
  try {
    if (Capacitor.getPlatform() === 'web') return false;
    const result = await CallLogNative.requestMicPermission();
    return result.granted;
  } catch {
    return false;
  }
}

/** Fetch device call log (last N entries) */
export async function getDeviceCallLog(limit = 100): Promise<{ entries: CallLogEntry[]; error?: string }> {
  try {
    if (Capacitor.getPlatform() === 'web') return { entries: [] };
    const result = await CallLogNative.getCallLog({ limit });
    return { entries: result.entries || [], error: result.error };
  } catch (e: unknown) {
    return { entries: [], error: String(e) };
  }
}

/** Fetch call recording audio files from device storage */
export async function getCallRecordings(): Promise<{ recordings: CallRecording[]; debug?: string }> {
  try {
    if (Capacitor.getPlatform() === 'web') return { recordings: [] };
    const result = await CallLogNative.getCallRecordings();
    return { recordings: result.recordings || [], debug: (result as Record<string, unknown>).debug as string };
  } catch (e: unknown) {
    return { recordings: [], debug: String(e) };
  }
}

/** Start speech recognition and return transcribed text */
export async function startSpeechRecognition(language = 'en-IN'): Promise<{ text: string; error?: string }> {
  try {
    if (Capacitor.getPlatform() === 'web') return { text: '', error: 'Not available on web' };
    return await CallLogNative.startSpeechRecognition({ language });
  } catch {
    return { text: '', error: 'Speech recognition failed' };
  }
}

/** Stop speech recognition */
export async function stopSpeechRecognition(): Promise<void> {
  try {
    if (Capacitor.getPlatform() === 'web') return;
    await CallLogNative.stopSpeechRecognition();
  } catch {
    // ignore
  }
}

/** Convert native file path to WebView-accessible URL */
export function getPlayableUrl(filePath: string): string {
  return Capacitor.convertFileSrc(filePath);
}

/** Format duration in seconds to MM:SS */
export function formatDuration(seconds: number): string {
  if (!seconds || seconds <= 0) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

/** Format file size to human readable */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ========== INCOMING CALL LISTENER ==========

export interface IncomingCallData {
  state: 'ringing' | 'answered' | 'idle';
  number: string;
}

/** Start listening for incoming calls */
export async function startCallListener(): Promise<void> {
  try {
    if (Capacitor.getPlatform() === 'web') return;
    await CallLogNative.startCallListener();
  } catch {
    // ignore
  }
}

/** Stop listening for incoming calls */
export async function stopCallListener(): Promise<void> {
  try {
    if (Capacitor.getPlatform() === 'web') return;
    await CallLogNative.stopCallListener();
  } catch {
    // ignore
  }
}

/** Listen for incoming call events */
export function onIncomingCall(callback: (data: IncomingCallData) => void): () => void {
  if (Capacitor.getPlatform() === 'web') return () => {};
  let removeRef: { remove: () => void } | null = null;
  CallLogNative.addListener('incomingCall', (data) => {
    callback(data as unknown as IncomingCallData);
  }).then(ref => { removeRef = ref; });
  return () => { removeRef?.remove(); };
}

/** Listen for call state changes (answered, idle) */
export function onCallStateChanged(callback: (data: IncomingCallData) => void): () => void {
  if (Capacitor.getPlatform() === 'web') return () => {};
  let removeRef: { remove: () => void } | null = null;
  CallLogNative.addListener('callStateChanged', (data) => {
    callback(data as unknown as IncomingCallData);
  }).then(ref => { removeRef = ref; });
  return () => { removeRef?.remove(); };
}
