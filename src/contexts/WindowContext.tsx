import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface WindowConfig {
  id: string;
  title: string;
  component: ReactNode;
  position: { x: number; y: number };
  size: { width: number; height: number };
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
}

interface WindowContextType {
  windows: WindowConfig[];
  activeWindow: string | null;
  openWindow: (config: Omit<WindowConfig, 'position' | 'isMinimized' | 'isMaximized' | 'zIndex'>) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  setActiveWindow: (id: string) => void;
  updateWindowPosition: (id: string, position: { x: number; y: number }) => void;
  updateWindowSize: (id: string, size: { width: number; height: number }) => void;
}

const WindowContext = createContext<WindowContextType | undefined>(undefined);

export const useWindows = () => {
  const context = useContext(WindowContext);
  if (!context) {
    throw new Error('useWindows must be used within a WindowProvider');
  }
  return context;
};

interface WindowProviderProps {
  children: ReactNode;
}

export const WindowProvider: React.FC<WindowProviderProps> = ({ children }) => {
  const [windows, setWindows] = useState<WindowConfig[]>([]);
  const [activeWindow, setActiveWindowState] = useState<string | null>(null);
  const [nextZIndex, setNextZIndex] = useState(100);

  const openWindow = (config: Omit<WindowConfig, 'position' | 'isMinimized' | 'isMaximized' | 'zIndex'>) => {
    const existingWindow = windows.find(w => w.id === config.id);
    if (existingWindow) {
      setActiveWindow(config.id);
      return;
    }

    const newWindow: WindowConfig = {
      ...config,
      position: { x: 100 + windows.length * 30, y: 100 + windows.length * 30 },
      isMinimized: false,
      isMaximized: false,
      zIndex: nextZIndex,
    };

    setWindows(prev => [...prev, newWindow]);
    setActiveWindowState(config.id);
    setNextZIndex(prev => prev + 1);
  };

  const closeWindow = (id: string) => {
    setWindows(prev => prev.filter(w => w.id !== id));
    if (activeWindow === id) {
      setActiveWindowState(null);
    }
  };

  const minimizeWindow = (id: string) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, isMinimized: true } : w
    ));
    if (activeWindow === id) {
      setActiveWindowState(null);
    }
  };

  const maximizeWindow = (id: string) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { 
        ...w, 
        isMaximized: !w.isMaximized,
        position: w.isMaximized ? w.position : { x: 0, y: 0 },
        size: w.isMaximized ? w.size : { width: window.innerWidth, height: window.innerHeight - 30 }
      } : w
    ));
  };

  const setActiveWindow = (id: string) => {
    setActiveWindowState(id);
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, zIndex: nextZIndex, isMinimized: false } : w
    ));
    setNextZIndex(prev => prev + 1);
  };

  const updateWindowPosition = (id: string, position: { x: number; y: number }) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, position } : w
    ));
  };

  const updateWindowSize = (id: string, size: { width: number; height: number }) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, size } : w
    ));
  };

  return (
    <WindowContext.Provider value={{
      windows,
      activeWindow,
      openWindow,
      closeWindow,
      minimizeWindow,
      maximizeWindow,
      setActiveWindow,
      updateWindowPosition,
      updateWindowSize,
    }}>
      {children}
    </WindowContext.Provider>
  );
};