// ============================================================
// BCH CRM - UI Store (Zustand)
// ============================================================

import { create } from 'zustand';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

interface UIState {
  activeTab: string;
  isModalOpen: boolean;
  modalContent: string | null;
  toasts: Toast[];
  isOffline: boolean;
  pendingSyncCount: number;

  setActiveTab: (tab: string) => void;
  openModal: (content: string) => void;
  closeModal: () => void;
  showToast: (message: string, type?: Toast['type'], duration?: number) => void;
  removeToast: (id: string) => void;
  setOffline: (offline: boolean) => void;
  setPendingSyncCount: (count: number) => void;
}

export const useUIStore = create<UIState>((set) => ({
  activeTab: '',
  isModalOpen: false,
  modalContent: null,
  toasts: [],
  isOffline: !navigator.onLine,
  pendingSyncCount: 0,

  setActiveTab: (tab) => set({ activeTab: tab }),

  openModal: (content) => set({ isModalOpen: true, modalContent: content }),

  closeModal: () => set({ isModalOpen: false, modalContent: null }),

  showToast: (message, type = 'info', duration = 3000) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    set((state) => ({
      toasts: [...state.toasts, { id, message, type, duration }],
    }));

    if (duration > 0) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      }, duration);
    }
  },

  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),

  setOffline: (offline) => set({ isOffline: offline }),

  setPendingSyncCount: (count) => set({ pendingSyncCount: count }),
}));

// Auto-detect online/offline
window.addEventListener('online', () => useUIStore.getState().setOffline(false));
window.addEventListener('offline', () => useUIStore.getState().setOffline(true));
