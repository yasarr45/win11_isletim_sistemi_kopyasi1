import { create } from 'zustand';

export interface AppConfig {
  id: string;
  name: string;
  icon: string;
  component: string;
  defaultWidth: number;
  defaultHeight: number;
}

export const APPS: AppConfig[] = [
  { id: 'browser', name: 'Tarayıcı', icon: 'Globe', component: 'Browser', defaultWidth: 800, defaultHeight: 600 },
  { id: 'notepad', name: 'Not Defteri', icon: 'FileText', component: 'Notepad', defaultWidth: 600, defaultHeight: 400 },
  { id: 'settings', name: 'Ayarlar', icon: 'Settings', component: 'Settings', defaultWidth: 700, defaultHeight: 500 },
  { id: 'explorer', name: 'Dosya Gezgini', icon: 'Folder', component: 'FileExplorer', defaultWidth: 700, defaultHeight: 500 },
  { id: 'terminal', name: 'Terminal', icon: 'TerminalSquare', component: 'Terminal', defaultWidth: 600, defaultHeight: 400 },
  { id: 'discord', name: 'Discord', icon: 'MessageSquare', component: 'Discord', defaultWidth: 850, defaultHeight: 550 },
  { id: 'spotify', name: 'Spotify', icon: 'Music', component: 'Spotify', defaultWidth: 800, defaultHeight: 500 },
  { id: 'pubg', name: 'PUBG', icon: 'Crosshair', component: 'Pubg', defaultWidth: 1024, defaultHeight: 600 },
];

export interface WindowState {
  id: string; // unique window instance id
  appId: string;
  title: string;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

interface NotificationState {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

interface OSState {
  systemState: 'booting' | 'login' | 'desktop';
  theme: 'dark' | 'light';
  wallpaper: string;
  performanceMode: boolean; // low performance mode
  
  windows: WindowState[];
  activeWindowId: string | null;
  highestZIndex: number;
  
  startMenuOpen: boolean;
  quickSettingsOpen: boolean;
  calendarOpen: boolean;
  trayOpen: boolean;
  
  notifications: NotificationState[];
  
  // Actions
  setSystemState: (state: 'booting' | 'login' | 'desktop') => void;
  setTheme: (theme: 'dark' | 'light') => void;
  setWallpaper: (url: string) => void;
  togglePerformanceMode: () => void;
  
  openApp: (appId: string) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  restoreWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  updateWindowPosition: (id: string, x: number, y: number) => void;
  updateWindowSize: (id: string, width: number, height: number) => void;
  
  toggleStartMenu: () => void;
  toggleQuickSettings: () => void;
  toggleCalendar: () => void;
  toggleTray: () => void;
  closeAllMenus: () => void;
  
  addNotification: (notification: Omit<NotificationState, 'id'>) => void;
  removeNotification: (id: string) => void;
}

export const useOSStore = create<OSState>((set, get) => ({
  systemState: 'booting',
  theme: 'dark',
  wallpaper: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop', // Default beautiful abstract wallpaper
  performanceMode: false,
  
  windows: [],
  activeWindowId: null,
  highestZIndex: 10,
  
  startMenuOpen: false,
  quickSettingsOpen: false,
  calendarOpen: false,
  trayOpen: false,
  
  notifications: [],
  
  setSystemState: (state) => set({ systemState: state }),
  setTheme: (theme) => set({ theme }),
  setWallpaper: (url) => set({ wallpaper: url }),
  togglePerformanceMode: () => set((state) => ({ performanceMode: !state.performanceMode })),
  
  openApp: (appId) => {
    const { windows, highestZIndex, focusWindow } = get();
    const app = APPS.find(a => a.id === appId);
    if (!app) return;
    
    // Check if app is already open, focus it if single-instance, but for this OS we allow multiple instances or just one?
    // Let's allow one instance per app for simplicity unless it's notepad/explorer
    // Actually, simple way: check if it's already open
    const existingWindow = windows.find(w => w.appId === appId);
    if (existingWindow) {
      if (existingWindow.isMinimized) {
        set({ windows: windows.map(w => w.id === existingWindow.id ? { ...w, isMinimized: false } : w) });
      }
      focusWindow(existingWindow.id);
      return;
    }
    
    const newWindowId = `${appId}-${Date.now()}`;
    const newZIndex = highestZIndex + 1;
    
    const newWindow: WindowState = {
      id: newWindowId,
      appId,
      title: app.name,
      isMinimized: false,
      isMaximized: false,
      zIndex: newZIndex,
      position: { x: 50 + windows.length * 30, y: 50 + windows.length * 30 },
      size: { width: app.defaultWidth, height: app.defaultHeight }
    };
    
    set({
      windows: [...windows, newWindow],
      activeWindowId: newWindowId,
      highestZIndex: newZIndex,
    });
    get().closeAllMenus();
  },
  
  closeWindow: (id) => set((state) => ({
    windows: state.windows.filter(w => w.id !== id),
    activeWindowId: state.activeWindowId === id ? null : state.activeWindowId
  })),
  
  minimizeWindow: (id) => set((state) => {
    const updatedWindows = state.windows.map(w => w.id === id ? { ...w, isMinimized: true } : w);
    return {
      windows: updatedWindows,
      activeWindowId: state.activeWindowId === id ? null : state.activeWindowId
    };
  }),
  
  maximizeWindow: (id) => set((state) => ({
    windows: state.windows.map(w => w.id === id ? { ...w, isMaximized: true } : w)
  })),
  
  restoreWindow: (id) => set((state) => ({
    windows: state.windows.map(w => w.id === id ? { ...w, isMaximized: false } : w)
  })),
  
  focusWindow: (id) => {
    const { activeWindowId, highestZIndex, windows } = get();
    if (activeWindowId === id) return;
    
    const newZIndex = highestZIndex + 1;
    set({
      windows: windows.map(w => w.id === id ? { ...w, zIndex: newZIndex, isMinimized: false } : w),
      activeWindowId: id,
      highestZIndex: newZIndex,
    });
    get().closeAllMenus();
  },
  
  updateWindowPosition: (id, x, y) => set((state) => ({
    windows: state.windows.map(w => w.id === id ? { ...w, position: { x, y } } : w)
  })),
  
  updateWindowSize: (id, width, height) => set((state) => ({
    windows: state.windows.map(w => w.id === id ? { ...w, size: { width, height } } : w)
  })),
  
  toggleStartMenu: () => set((state) => {
    if (!state.startMenuOpen) get().closeAllMenus();
    return { startMenuOpen: !state.startMenuOpen };
  }),
  toggleQuickSettings: () => set((state) => {
    if (!state.quickSettingsOpen) get().closeAllMenus();
    return { quickSettingsOpen: !state.quickSettingsOpen };
  }),
  toggleCalendar: () => set((state) => {
    if (!state.calendarOpen) get().closeAllMenus();
    return { calendarOpen: !state.calendarOpen };
  }),
  toggleTray: () => set((state) => {
    if (!state.trayOpen) get().closeAllMenus();
    return { trayOpen: !state.trayOpen };
  }),
  closeAllMenus: () => set({ startMenuOpen: false, quickSettingsOpen: false, calendarOpen: false, trayOpen: false }),
  
  addNotification: (notif) => {
    const id = `notif-${Date.now()}`;
    set((state) => ({
      notifications: [...state.notifications, { ...notif, id }]
    }));
    
    // Auto remove after 3 seconds
    setTimeout(() => {
      get().removeNotification(id);
    }, 3000);
  },
  
  removeNotification: (id) => set((state) => ({
    notifications: state.notifications.filter(n => n.id !== id)
  }))
}));
