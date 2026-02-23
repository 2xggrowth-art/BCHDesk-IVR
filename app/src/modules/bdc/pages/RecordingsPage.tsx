// ============================================================
// BCH CRM - Call Recordings Page
// Plays audio recordings from device call recorder
// ============================================================

import { useState, useEffect, useRef, useCallback } from 'react';
import { Card } from '@/components/ui/Card';
import { getCallRecordings, getPlayableUrl, formatFileSize, requestStoragePermission } from '@/services/calllog';
import type { CallRecording } from '@/services/calllog';

function formatDate(timestamp: number): string {
  const d = new Date(timestamp);
  const now = new Date();
  const time = d.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true });

  if (d.toDateString() === now.toDateString()) return `Today ${time}`;
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) return `Yesterday ${time}`;
  return `${d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} ${time}`;
}

function formatAudioDuration(ms: number): string {
  if (!ms || ms <= 0) return '';
  const totalSec = Math.floor(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

// Extract phone number from filename (common patterns: "Call_9876543210_...", "recording_98765...")
function extractPhoneFromFilename(name: string): string {
  const match = name.match(/(\d{10,13})/);
  return match ? match[1] : '';
}

export function RecordingsPage() {
  const [recordings, setRecordings] = useState<CallRecording[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [permRequested, setPermRequested] = useState(false);
  const [debugMsg, setDebugMsg] = useState('');
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<number | null>(null);

  const loadRecordings = useCallback(async () => {
    setIsLoading(true);
    const result = await getCallRecordings();
    setRecordings(result.recordings);
    if (result.debug) setDebugMsg(result.debug);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    (async () => {
      await requestStoragePermission();
      await loadRecordings();
    })();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [loadRecordings]);

  const handlePlay = (index: number, filePath: string) => {
    // If same recording is playing, toggle pause/play
    if (playingIndex === index && audioRef.current) {
      if (audioRef.current.paused) {
        audioRef.current.play();
        startProgressTracker();
      } else {
        audioRef.current.pause();
        if (intervalRef.current) clearInterval(intervalRef.current);
      }
      return;
    }

    // Stop current playback
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (intervalRef.current) clearInterval(intervalRef.current);

    // Start new playback
    const url = getPlayableUrl(filePath);
    const audio = new Audio(url);
    audioRef.current = audio;
    setPlayingIndex(index);
    setCurrentTime(0);

    audio.addEventListener('loadedmetadata', () => {
      setAudioDuration(audio.duration);
    });

    audio.addEventListener('ended', () => {
      setPlayingIndex(null);
      setCurrentTime(0);
      if (intervalRef.current) clearInterval(intervalRef.current);
    });

    audio.addEventListener('error', () => {
      setPlayingIndex(null);
      setCurrentTime(0);
    });

    audio.play();
    startProgressTracker();
  };

  const startProgressTracker = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = window.setInterval(() => {
      if (audioRef.current) {
        setCurrentTime(audioRef.current.currentTime);
      }
    }, 250);
  };

  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    if (intervalRef.current) clearInterval(intervalRef.current);
    setPlayingIndex(null);
    setCurrentTime(0);
  };

  if (isLoading) {
    return (
      <div className="p-4 pb-24">
        <div className="text-center py-12">
          <div className="w-10 h-10 border-3 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-500">Scanning recordings...</p>
        </div>
      </div>
    );
  }

  if (recordings.length === 0) {
    return (
      <div className="p-4 pb-24">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-400">
              <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
              <path d="M19 10v2a7 7 0 01-14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="23" />
              <line x1="8" y1="23" x2="16" y2="23" />
            </svg>
          </div>
          <h3 className="text-base font-bold text-gray-700 mb-1">No Recordings Found</h3>
          <p className="text-sm text-gray-500 mb-4">
            Enable call recording in your phone's<br />dialer settings to see recordings here.
          </p>
          <button
            onClick={async () => {
              setPermRequested(true);
              setDebugMsg('');
              await requestStoragePermission();
              await loadRecordings();
              setPermRequested(false);
            }}
            disabled={permRequested}
            className="px-6 py-2.5 bg-primary-500 text-white text-sm font-semibold rounded-xl active:scale-95 disabled:opacity-50"
          >
            {permRequested ? 'Scanning...' : 'Grant Storage Permission & Scan'}
          </button>
          {debugMsg && (
            <p className="text-[10px] text-gray-400 mt-3 break-all px-4">{debugMsg}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 pb-24 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Call Recordings</h2>
          <p className="text-xs text-gray-500">{recordings.length} recording{recordings.length !== 1 ? 's' : ''} found</p>
        </div>
        <button
          onClick={loadRecordings}
          className="text-xs font-medium text-primary-500 px-3 py-1.5 bg-primary-50 rounded-lg active:scale-95"
        >
          Refresh
        </button>
      </div>

      {/* Recordings list */}
      <div className="space-y-2">
        {recordings.map((rec, i) => {
          const isPlaying = playingIndex === i;
          const phone = extractPhoneFromFilename(rec.fileName);
          const progress = isPlaying && audioDuration > 0 ? (currentTime / audioDuration) * 100 : 0;

          return (
            <Card key={`${rec.filePath}-${i}`} className="p-3">
              <div className="flex items-center gap-3">
                {/* Play/Pause button */}
                <button
                  onClick={() => handlePlay(i, rec.filePath)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 active:scale-90 ${
                    isPlaying ? 'bg-primary-500' : 'bg-primary-50'
                  }`}
                >
                  {isPlaying && audioRef.current && !audioRef.current.paused ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                      <rect x="6" y="4" width="4" height="16" rx="1" />
                      <rect x="14" y="4" width="4" height="16" rx="1" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill={isPlaying ? 'white' : '#3b82f6'}>
                      <polygon points="5,3 19,12 5,21" />
                    </svg>
                  )}
                </button>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {phone || rec.fileName}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[11px] text-gray-400">{formatDate(rec.date)}</span>
                    {rec.duration > 0 && (
                      <span className="text-[11px] text-gray-400">{formatAudioDuration(rec.duration)}</span>
                    )}
                    <span className="text-[11px] text-gray-400">{formatFileSize(rec.size)}</span>
                  </div>
                </div>

                {/* Stop button when playing */}
                {isPlaying && (
                  <button
                    onClick={handleStop}
                    className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0 active:scale-90"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="#dc2626">
                      <rect x="4" y="4" width="16" height="16" rx="2" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Progress bar when playing */}
              {isPlaying && (
                <div className="mt-2 h-1 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary-500 rounded-full transition-all duration-200"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              )}

              {/* Phone actions when has phone number */}
              {phone && !isPlaying && (
                <div className="flex gap-2 mt-2 pt-2 border-t border-gray-50">
                  <button
                    onClick={() => window.open(`tel:${phone}`, '_self')}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium text-green-700 bg-green-50 rounded-lg active:scale-95"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                    </svg>
                    Call
                  </button>
                  <button
                    onClick={() => window.open(`sms:${phone}`, '_self')}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 rounded-lg active:scale-95"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                    </svg>
                    SMS
                  </button>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
