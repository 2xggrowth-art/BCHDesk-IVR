// ============================================================
// BCH CRM - Device Call Log Page
// Shows real call history from Android device with filters
// ============================================================

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { getDeviceCallLog, formatDuration, requestCallLogPermission } from '@/services/calllog';
import type { CallLogEntry } from '@/services/calllog';

type FilterType = 'all' | 'missed' | 'incoming' | 'outgoing';

const FILTERS: { id: FilterType; label: string; color: string }[] = [
  { id: 'all', label: 'All', color: 'bg-gray-900 text-white' },
  { id: 'missed', label: 'Missed', color: 'bg-red-500 text-white' },
  { id: 'incoming', label: 'Incoming', color: 'bg-green-500 text-white' },
  { id: 'outgoing', label: 'Outgoing', color: 'bg-blue-500 text-white' },
];

function formatTime(timestamp: number): string {
  const d = new Date(timestamp);
  const now = new Date();
  const hours = d.getHours();
  const mins = d.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const h12 = hours % 12 || 12;
  const timeStr = `${h12}:${mins} ${ampm}`;

  if (d.toDateString() === now.toDateString()) return timeStr;

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) return `Yesterday ${timeStr}`;

  return `${d.getDate()}/${d.getMonth() + 1} ${timeStr}`;
}

function getDateGroup(timestamp: number): string {
  const d = new Date(timestamp);
  const now = new Date();
  if (d.toDateString() === now.toDateString()) return 'Today';
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

function CallTypeIcon({ type }: { type: CallLogEntry['type'] }) {
  if (type === 'incoming') {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5">
        <polyline points="17 17 7 7" /><polyline points="7 17 7 7 17 7" />
      </svg>
    );
  }
  if (type === 'outgoing') {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.5">
        <polyline points="7 7 17 17" /><polyline points="17 7 17 17 7 17" />
      </svg>
    );
  }
  if (type === 'missed') {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5">
        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    );
  }
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
    </svg>
  );
}

export function CallLogPage() {
  const navigate = useNavigate();
  const [entries, setEntries] = useState<CallLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [filter, setFilter] = useState<FilterType>('all');
  const [permRequested, setPermRequested] = useState(false);

  const loadCallLog = useCallback(async () => {
    setIsLoading(true);
    const result = await getDeviceCallLog(200);
    setEntries(result.entries);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    (async () => {
      await requestCallLogPermission();
      await loadCallLog();
    })();
  }, [loadCallLog]);

  // Filter entries
  const filteredEntries = useMemo(() => {
    if (filter === 'all') return entries;
    return entries.filter(e => e.type === filter);
  }, [entries, filter]);

  // Count per type
  const counts = useMemo(() => ({
    all: entries.length,
    missed: entries.filter(e => e.type === 'missed').length,
    incoming: entries.filter(e => e.type === 'incoming').length,
    outgoing: entries.filter(e => e.type === 'outgoing').length,
  }), [entries]);

  // Group filtered entries by date
  const grouped = useMemo(() => {
    return filteredEntries.reduce<Record<string, CallLogEntry[]>>((acc, entry) => {
      const group = getDateGroup(entry.date);
      if (!acc[group]) acc[group] = [];
      acc[group].push(entry);
      return acc;
    }, {});
  }, [filteredEntries]);

  const handleCall = (number: string) => {
    window.open(`tel:${number}`, '_self');
  };

  const handleSms = (number: string) => {
    window.open(`sms:${number}`, '_self');
  };

  if (isLoading) {
    return (
      <div className="p-4 pb-24">
        <div className="text-center py-12">
          <div className="w-10 h-10 border-3 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-500">Loading call log...</p>
        </div>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="p-4 pb-24">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-400">
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
            </svg>
          </div>
          <h3 className="text-base font-bold text-gray-700 mb-1">No Call History</h3>
          <p className="text-sm text-gray-500 mb-4">Call log permission may be needed.</p>
          <button
            onClick={async () => {
              setPermRequested(true);
              await requestCallLogPermission();
              await loadCallLog();
              setPermRequested(false);
            }}
            disabled={permRequested}
            className="px-6 py-2.5 bg-primary-500 text-white text-sm font-semibold rounded-xl active:scale-95 disabled:opacity-50"
          >
            {permRequested ? 'Requesting...' : 'Grant Permission & Load'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 pb-24 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">Call Log</h2>
        <button
          onClick={loadCallLog}
          className="text-xs font-medium text-primary-500 px-3 py-1.5 bg-primary-50 rounded-lg active:scale-95"
        >
          Refresh
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {FILTERS.map(f => (
          <button
            key={f.id}
            onClick={() => { setFilter(f.id); setExpandedIndex(null); }}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all active:scale-95 ${
              filter === f.id ? f.color : 'bg-gray-100 text-gray-500'
            }`}
          >
            {f.label} {counts[f.id] > 0 ? `(${counts[f.id]})` : ''}
          </button>
        ))}
      </div>

      {/* Filtered results */}
      {filteredEntries.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-sm text-gray-400">No {filter} calls found</p>
        </div>
      ) : (
        Object.entries(grouped).map(([date, items]) => (
          <div key={date}>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">{date}</p>
            <div className="space-y-1.5">
              {items.map((entry, i) => {
                const globalIdx = filteredEntries.indexOf(entry);
                const isExpanded = expandedIndex === globalIdx;
                return (
                  <Card
                    key={`${entry.number}-${entry.date}-${i}`}
                    className={`p-3 ${entry.type === 'missed' ? 'border-l-3 border-l-red-400' : ''}`}
                    onClick={() => setExpandedIndex(isExpanded ? null : globalIdx)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0">
                        <CallTypeIcon type={entry.type} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {entry.name || entry.number}
                        </p>
                        {entry.name && (
                          <p className="text-xs text-gray-500">{entry.number}</p>
                        )}
                      </div>

                      <div className="text-right flex-shrink-0">
                        <p className={`text-xs font-medium ${entry.type === 'missed' ? 'text-red-500' : 'text-gray-500'}`}>
                          {formatTime(entry.date)}
                        </p>
                        {entry.duration > 0 && (
                          <p className="text-[10px] text-gray-400">{formatDuration(entry.duration)}</p>
                        )}
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleCall(entry.number); }}
                          className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-green-50 text-green-700 rounded-xl text-sm font-semibold active:scale-95"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                          </svg>
                          Call
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleSms(entry.number); }}
                          className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-50 text-blue-700 rounded-xl text-sm font-semibold active:scale-95"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                          </svg>
                          SMS
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); navigate(`/bdc/incoming?phone=${encodeURIComponent(entry.number)}`); }}
                          className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-primary-50 text-primary-700 rounded-xl text-sm font-semibold active:scale-95"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="8.5" cy="7" r="4" /><line x1="20" y1="8" x2="20" y2="14" /><line x1="23" y1="11" x2="17" y2="11" />
                          </svg>
                          Create Lead
                        </button>
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
