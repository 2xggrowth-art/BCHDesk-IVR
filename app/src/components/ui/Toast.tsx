// ============================================================
// BCH CRM - Toast Notification System
// ============================================================

import { useUIStore } from '@/store/uiStore';

export function ToastContainer() {
  const { toasts, removeToast } = useUIStore();

  if (toasts.length === 0) return null;

  const iconMap = {
    success: '✓',
    error: '✕',
    warning: '!',
    info: 'ℹ',
  };

  const colorMap = {
    success: 'bg-success-500',
    error: 'bg-danger-500',
    warning: 'bg-warning-500',
    info: 'bg-primary-500',
  };

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 w-[90%] max-w-[400px]">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          onClick={() => removeToast(toast.id)}
          className={`
            ${colorMap[toast.type]} text-white
            rounded-xl px-4 py-3 shadow-lg
            flex items-center gap-3
            animate-slide-down cursor-pointer
          `}
        >
          <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold flex-shrink-0">
            {iconMap[toast.type]}
          </span>
          <span className="text-sm font-medium flex-1">{toast.message}</span>
        </div>
      ))}
    </div>
  );
}
