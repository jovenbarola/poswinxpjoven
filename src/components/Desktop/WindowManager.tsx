import React, { useState, useRef, useCallback } from 'react';
import { useWindows } from '../../contexts/WindowContext';

const WindowManager: React.FC = () => {
  const { 
    windows, 
    activeWindow, 
    closeWindow, 
    minimizeWindow, 
    maximizeWindow, 
    setActiveWindow,
    updateWindowPosition,
    updateWindowSize 
  } = useWindows();

  const [dragState, setDragState] = useState<{
    isDragging: boolean;
    windowId: string | null;
    offset: { x: number; y: number };
  }>({
    isDragging: false,
    windowId: null,
    offset: { x: 0, y: 0 }
  });

  const [resizeState, setResizeState] = useState<{
    isResizing: boolean;
    windowId: string | null;
    startPos: { x: number; y: number };
    startSize: { width: number; height: number };
  }>({
    isResizing: false,
    windowId: null,
    startPos: { x: 0, y: 0 },
    startSize: { width: 0, height: 0 }
  });

  const handleMouseDown = useCallback((e: React.MouseEvent, windowId: string, type: 'drag' | 'resize') => {
    e.preventDefault();
    setActiveWindow(windowId);

    const window = windows.find(w => w.id === windowId);
    if (!window) return;

    const rect = (e.target as HTMLElement).getBoundingClientRect();
    
    if (type === 'drag') {
      setDragState({
        isDragging: true,
        windowId,
        offset: {
          x: e.clientX - window.position.x,
          y: e.clientY - window.position.y
        }
      });
    } else if (type === 'resize') {
      setResizeState({
        isResizing: true,
        windowId,
        startPos: { x: e.clientX, y: e.clientY },
        startSize: { width: window.size.width, height: window.size.height }
      });
    }
  }, [windows, setActiveWindow]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (dragState.isDragging && dragState.windowId) {
      const newPosition = {
        x: Math.max(0, Math.min(window.innerWidth - 300, e.clientX - dragState.offset.x)),
        y: Math.max(0, Math.min(window.innerHeight - 100, e.clientY - dragState.offset.y))
      };
      updateWindowPosition(dragState.windowId, newPosition);
    }

    if (resizeState.isResizing && resizeState.windowId) {
      const deltaX = e.clientX - resizeState.startPos.x;
      const deltaY = e.clientY - resizeState.startPos.y;
      const newSize = {
        width: Math.max(300, resizeState.startSize.width + deltaX),
        height: Math.max(200, resizeState.startSize.height + deltaY)
      };
      updateWindowSize(resizeState.windowId, newSize);
    }
  }, [dragState, resizeState, updateWindowPosition, updateWindowSize]);

  const handleMouseUp = useCallback(() => {
    setDragState({ isDragging: false, windowId: null, offset: { x: 0, y: 0 } });
    setResizeState({ isResizing: false, windowId: null, startPos: { x: 0, y: 0 }, startSize: { width: 0, height: 0 } });
  }, []);

  React.useEffect(() => {
    if (dragState.isDragging || resizeState.isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [dragState.isDragging, resizeState.isResizing, handleMouseMove, handleMouseUp]);

  return (
    <>
      {windows.map((window) => (
        <div
          key={window.id}
          className={`xp-window ${activeWindow === window.id ? 'active' : 'inactive'} ${window.isMinimized ? 'minimized' : ''}`}
          style={{
            left: window.isMaximized ? 0 : window.position.x,
            top: window.isMaximized ? 0 : window.position.y,
            width: window.isMaximized ? '100vw' : window.size.width,
            height: window.isMaximized ? 'calc(100vh - 30px)' : window.size.height,
            zIndex: window.zIndex,
          }}
          onClick={() => setActiveWindow(window.id)}
        >
          <div 
            className="xp-window-header"
            onMouseDown={(e) => !window.isMaximized && handleMouseDown(e, window.id, 'drag')}
          >
            <div className="xp-window-icon"></div>
            <div className="xp-window-title">{window.title}</div>
            <div className="xp-window-controls">
              <button 
                className="xp-window-control minimize"
                onClick={() => minimizeWindow(window.id)}
              >
                _
              </button>
              <button 
                className="xp-window-control maximize"
                onClick={() => maximizeWindow(window.id)}
              >
                {window.isMaximized ? '⧉' : '□'}
              </button>
              <button 
                className="xp-window-control close"
                onClick={() => closeWindow(window.id)}
              >
                ×
              </button>
            </div>
          </div>
          <div className="xp-window-content">
            {window.component}
          </div>
          {!window.isMaximized && (
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: 16,
                height: 16,
                cursor: 'nw-resize',
                background: 'transparent'
              }}
              onMouseDown={(e) => handleMouseDown(e, window.id, 'resize')}
            />
          )}
        </div>
      ))}
    </>
  );
};

export default WindowManager;