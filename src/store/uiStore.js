import { create } from 'zustand';

export const useUiStore = create((set) => ({
  sidebarOpen: true,
  darkMode: false,
  activeModal: null, // 'REGISTER_ASSET' | 'BOOK_RESOURCE' | 'RAISE_MAINTENANCE' | 'ALLOCATE_ASSET' | 'RETURN_ASSET' | null
  modalPayload: null, // Any initial data passed to modal (e.g. selected asset for allocation/return)
  activeDrawerAsset: null, // Asset object to show in the timeline history slide-over drawer
  toast: null, // { message: string, type: 'success' | 'error' | 'info' | 'warning' }

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  toggleDarkMode: () => set((state) => {
    const nextMode = !state.darkMode;
    if (nextMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    return { darkMode: nextMode };
  }),

  openModal: (modalName, payload = null) => set({ activeModal: modalName, modalPayload: payload }),
  closeModal: () => set({ activeModal: null, modalPayload: null }),

  openAssetDrawer: (asset) => set({ activeDrawerAsset: asset }),
  closeAssetDrawer: () => set({ activeDrawerAsset: null }),

  showToast: (message, type = 'success', durationMs = 3500) => {
    set({ toast: { message, type } });
    setTimeout(() => {
      set((state) => (state.toast && state.toast.message === message ? { toast: null } : {}));
    }, durationMs);
  },
  hideToast: () => set({ toast: null })
}));
