/**
 * Breadcrumb Navigation Component Tests
 * 
 * Tests for the Breadcrumb component that shows the hierarchical navigation path.
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Breadcrumb } from '@/components/navigation/Breadcrumb';

// Need to mock next/navigation since usePathname is a client hook
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

// Also mock the next/link component
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href} data-testid="next-link">
      {children}
    </a>
  );
});

// Mock the heroicons
jest.mock('@heroicons/react/24/outline', () => ({
  ChevronRightIcon: () => <span data-testid="chevron-icon" />,
  HomeIcon: () => <span data-testid="home-icon" />,
}));

describe('Breadcrumb Component', () => {
  const mockUsePathname = jest.requireMock('next/navigation').usePathname;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders nothing on the homepage', () => {
    // Mock the pathname to be the homepage
    mockUsePathname.mockReturnValue('/');
    
    const { container } = render(<Breadcrumb />);
    
    // Should be empty
    expect(container.firstChild).toBeNull();
  });

  it('renders breadcrumbs for a simple path', () => {
    mockUsePathname.mockReturnValue('/wiki/hipaa');
    
    render(<Breadcrumb />);
    
    // Should have 3 items: Home, Wiki, and HIPAA
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Wiki')).toBeInTheDocument();
    expect(screen.getByText('Hipaa')).toBeInTheDocument();
  });

  it('renders breadcrumbs for a complex path', () => {
    mockUsePathname.mockReturnValue('/wiki/hipaa/core/technical-security');
    
    render(<Breadcrumb />);
    
    // Check all segments are present
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Wiki')).toBeInTheDocument();
    expect(screen.getByText('Hipaa')).toBeInTheDocument();
    expect(screen.getByText('Core')).toBeInTheDocument();
    expect(screen.getByText('Technical Security')).toBeInTheDocument();
  });

  it('formats multi-word path segments correctly', () => {
    mockUsePathname.mockReturnValue('/wiki/technical-security-measures');
    
    render(<Breadcrumb />);
    
    // Check title case and space replacement
    expect(screen.getByText('Technical Security Measures')).toBeInTheDocument();
  });

  it('includes home icon for the home link', () => {
    mockUsePathname.mockReturnValue('/wiki');
    
    render(<Breadcrumb />);
    
    // Check home icon is rendered
    expect(screen.getByTestId('home-icon')).toBeInTheDocument();
  });

  it('includes separator icons between items', () => {
    mockUsePathname.mockReturnValue('/wiki/hipaa');
    
    render(<Breadcrumb />);
    
    // Should have at least 1 separator between links
    const separators = screen.getAllByTestId('chevron-icon');
    expect(separators.length).toBeGreaterThan(0);
  });

  it('marks the current page as aria-current', () => {
    mockUsePathname.mockReturnValue('/wiki/hipaa');
    
    render(<Breadcrumb />);
    
    // The last item should be the current page and not a link
    const currentPage = screen.getByText('Hipaa');
    expect(currentPage).toHaveAttribute('aria-current', 'page');
  });
});