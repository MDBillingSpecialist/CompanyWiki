/**
 * Theme Toggle Component Tests
 * 
 * Tests for the ThemeToggle component that allows switching between light and dark modes.
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

// We need to mock window.matchMedia and localStorage
// for the ThemeToggle component
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
};

// Mock matchMedia - doing it globally to avoid redefining property error
window.matchMedia = window.matchMedia || function() {
  return {
    matches: false,
    media: '',
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  };
};

// Setup before each test
beforeEach(() => {
  // Mock localStorage
  jest.spyOn(Storage.prototype, 'getItem').mockImplementation(mockLocalStorage.getItem);
  jest.spyOn(Storage.prototype, 'setItem').mockImplementation(mockLocalStorage.setItem);

  // Mock document.documentElement classList
  document.documentElement.classList = {
    add: jest.fn(),
    remove: jest.fn(),
    contains: jest.fn(),
    toggle: jest.fn(),
    replace: jest.fn(),
    item: jest.fn(),
    toString: jest.fn(),
    forEach: jest.fn(),
    keys: jest.fn(),
    values: jest.fn(),
    entries: jest.fn(),
    length: 0,
    [Symbol.iterator]: jest.fn(),
  };
  
  // Clear mocks
  jest.clearAllMocks();
});

// Mock the heroicons
jest.mock('@heroicons/react/24/outline', () => ({
  SunIcon: () => <span data-testid="sun-icon" />,
  MoonIcon: () => <span data-testid="moon-icon" />,
}));

describe('ThemeToggle Component', () => {
  it('renders the theme toggle button', () => {
    render(<ThemeToggle />);
    
    // Should be a button
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('uses system preference when no saved theme exists', () => {
    // Mock system preference for dark mode
    jest.spyOn(window, 'matchMedia').mockImplementation(query => ({
      matches: query === '(prefers-color-scheme: dark)',
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));
    
    mockLocalStorage.getItem.mockReturnValue(null);
    
    render(<ThemeToggle />);
    
    // Sun icon should be shown in dark mode
    expect(screen.getByTestId('sun-icon')).toBeInTheDocument();
  });

  it('uses saved theme preference when it exists', () => {
    mockLocalStorage.getItem.mockReturnValue('light');
    
    render(<ThemeToggle />);
    
    // Moon icon should be shown in light mode
    expect(screen.getByTestId('moon-icon')).toBeInTheDocument();
  });

  it('toggles between light and dark theme when clicked', () => {
    // Start with light mode
    mockLocalStorage.getItem.mockReturnValue('light');
    
    render(<ThemeToggle />);
    
    // Initially shows moon icon in light mode
    expect(screen.getByTestId('moon-icon')).toBeInTheDocument();
    
    // Click the toggle button
    fireEvent.click(screen.getByRole('button'));
    
    // Should now show sun icon (dark mode)
    expect(screen.getByTestId('sun-icon')).toBeInTheDocument();
    
    // Click again to toggle back
    fireEvent.click(screen.getByRole('button'));
    
    // Should now show moon icon (light mode) again
    expect(screen.getByTestId('moon-icon')).toBeInTheDocument();
  });

  it('saves theme preference to localStorage when toggled', () => {
    // Start with dark mode
    mockLocalStorage.getItem.mockReturnValue('dark');
    
    render(<ThemeToggle />);
    
    // Click the toggle button to switch to light mode
    fireEvent.click(screen.getByRole('button'));
    
    // Check if localStorage.setItem was called with the new theme
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('theme', 'light');
  });

  it('updates theme when toggled', () => {
    // Start with light mode
    mockLocalStorage.getItem.mockReturnValue('light');
    
    render(<ThemeToggle />);
    
    // Initially shows moon icon in light mode
    expect(screen.getByTestId('moon-icon')).toBeInTheDocument();
    
    // Click the toggle button to switch to dark mode
    fireEvent.click(screen.getByRole('button'));
    
    // Should now show sun icon (dark mode)
    expect(screen.getByTestId('sun-icon')).toBeInTheDocument();
  });
});