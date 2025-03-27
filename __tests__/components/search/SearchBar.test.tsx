/**
 * SearchBar Component Tests
 */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SearchBar } from '@/components/search/SearchBar';

// Mock the heroicons
jest.mock('@heroicons/react/24/outline', () => ({
  MagnifyingGlassIcon: () => <span data-testid="search-icon" />,
}));

describe('SearchBar Component', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    
    // Mock timers for setTimeout
    jest.useFakeTimers();
  });

  afterEach(() => {
    // Restore timers after each test
    jest.useRealTimers();
  });

  it('renders search input correctly', () => {
    render(<SearchBar />);
    
    // Check that the search input exists
    const searchInput = screen.getByPlaceholderText('Search documentation...');
    expect(searchInput).toBeInTheDocument();
    
    // Check that search icon is rendered
    expect(screen.getByTestId('search-icon')).toBeInTheDocument();
  });

  it('updates query state when typing in the search input', () => {
    render(<SearchBar />);
    
    // Find the search input and type in it
    const searchInput = screen.getByPlaceholderText('Search documentation...');
    fireEvent.change(searchInput, { target: { value: 'hipaa' } });
    
    // Check that the input value has been updated
    expect(searchInput).toHaveValue('hipaa');
  });

  it('shows loading indicator when searching', async () => {
    render(<SearchBar />);
    
    // Type in the search input
    const searchInput = screen.getByPlaceholderText('Search documentation...');
    fireEvent.change(searchInput, { target: { value: 'hipaa' } });
    
    // Submit the form
    const form = searchInput.closest('form');
    fireEvent.submit(form!);
    
    // Check that the loading indicator is shown (a spinning element)
    const spinnerElement = screen.getByText('Searching...');
    expect(spinnerElement).toBeInTheDocument();
    
    // Fast-forward the timer to complete the search
    jest.advanceTimersByTime(500);
    
    // Wait for the loading indicator to disappear
    await waitFor(() => {
      expect(screen.queryByText('Searching...')).not.toBeInTheDocument();
    });
  });

  it('displays search results after searching', async () => {
    render(<SearchBar />);
    
    // Type in the search input
    const searchInput = screen.getByPlaceholderText('Search documentation...');
    fireEvent.change(searchInput, { target: { value: 'hipaa' } });
    
    // Submit the form
    const form = searchInput.closest('form');
    fireEvent.submit(form!);
    
    // Fast-forward the timer to complete the search
    jest.advanceTimersByTime(500);
    
    // Check that the search results are displayed
    await waitFor(() => {
      expect(screen.getByText('Search Results (2)')).toBeInTheDocument();
      expect(screen.getByText('HIPAA Documentation')).toBeInTheDocument();
      expect(screen.getByText('Technical Security Standards')).toBeInTheDocument();
    });
  });

  it('filters results correctly based on search query', async () => {
    render(<SearchBar />);
    
    // Type in the search input with a specific term
    const searchInput = screen.getByPlaceholderText('Search documentation...');
    fireEvent.change(searchInput, { target: { value: 'technical' } });
    
    // Submit the form
    const form = searchInput.closest('form');
    fireEvent.submit(form!);
    
    // Fast-forward the timer to complete the search
    jest.advanceTimersByTime(500);
    
    // Check that only matching results are displayed
    await waitFor(() => {
      expect(screen.getByText('Search Results (1)')).toBeInTheDocument();
      expect(screen.getByText('Technical Security Standards')).toBeInTheDocument();
      expect(screen.queryByText('HIPAA Documentation')).not.toBeInTheDocument();
    });
  });

  it('shows no results message when no matches found', async () => {
    render(<SearchBar />);
    
    // Type in the search input with a term that won't match anything
    const searchInput = screen.getByPlaceholderText('Search documentation...');
    fireEvent.change(searchInput, { target: { value: 'xyzabc123' } });
    
    // Submit the form
    const form = searchInput.closest('form');
    fireEvent.submit(form!);
    
    // Fast-forward the timer to complete the search
    jest.advanceTimersByTime(500);
    
    // Check that the no results message is displayed
    await waitFor(() => {
      expect(screen.getByText('No results found')).toBeInTheDocument();
    });
  });

  it('closes search results when clicking outside', async () => {
    render(<SearchBar />);
    
    // Type in the search input
    const searchInput = screen.getByPlaceholderText('Search documentation...');
    fireEvent.change(searchInput, { target: { value: 'hipaa' } });
    
    // Submit the form
    const form = searchInput.closest('form');
    fireEvent.submit(form!);
    
    // Fast-forward the timer to complete the search
    jest.advanceTimersByTime(500);
    
    // Wait for results to appear
    await waitFor(() => {
      expect(screen.getByText('Search Results')).toBeInTheDocument();
    });
    
    // Click outside the results
    const overlay = screen.getByText('Search Results').parentElement!.parentElement!.parentElement!;
    fireEvent.click(overlay);
    
    // Check that results are no longer displayed
    expect(screen.queryByText('Search Results')).not.toBeInTheDocument();
  });
});