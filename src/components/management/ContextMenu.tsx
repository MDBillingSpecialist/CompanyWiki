"use client";

/**
 * Context Menu Component
 * 
 * A reusable context menu component that can be positioned anywhere on the screen.
 * Used for providing contextual actions in the content management interface.
 * 
 * #tags: ui context-menu management
 */
import React, { useEffect, useRef } from 'react';

interface MenuItem {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}

interface ContextMenuProps {
  x: number;
  y: number;
  items: MenuItem[];
  onClose: () => void;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, items, onClose }) => {
  const menuRef = useRef<HTMLDivElement>(null);
  
  // Adjust position to ensure menu stays within viewport
  const adjustedPosition = () => {
    if (!menuRef.current) return { top: y, left: x };
    
    const { width, height } = menuRef.current.getBoundingClientRect();
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    
    const adjustedX = Math.min(x, windowWidth - width);
    const adjustedY = Math.min(y, windowHeight - height);
    
    return {
      top: adjustedY,
      left: adjustedX
    };
  };
  
  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);
  
  // Close menu when pressing Escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);
  
  const position = adjustedPosition();
  
  return (
    <div
      ref={menuRef}
      className="absolute z-50 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 py-1 min-w-[160px]"
      style={{
        top: position.top,
        left: position.left
      }}
    >
      <ul>
        {items.map((item, index) => (
          <li key={index}>
            <button
              className={`w-full text-left px-4 py-2 flex items-center space-x-2 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                item.disabled ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              onClick={() => {
                if (!item.disabled) {
                  item.onClick();
                }
              }}
              disabled={item.disabled}
            >
              {item.icon && <span>{item.icon}</span>}
              <span>{item.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
