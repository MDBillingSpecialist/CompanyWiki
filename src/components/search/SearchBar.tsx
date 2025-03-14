"use client";

import React, { useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface SearchResult {
  title: string;
  description: string;
  path: string;
  matches: string[];
}

export const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) {
      setResults([]);
      setShowResults(false);
      return;
    }
    
    setIsSearching(true);
    setShowResults(true);
    
    // Simulated search results - in a real implementation, this would call an API
    setTimeout(() => {
      // Mock results based on the query
      const mockResults: SearchResult[] = [
        {
          title: "HIPAA Documentation",
          description: "Comprehensive guide to HIPAA compliance for healthcare software development",
          path: "/wiki/hipaa",
          matches: ["Comprehensive HIPAA resources"]
        },
        {
          title: "Technical Security Standards",
          description: "HIPAA technical security requirements for healthcare software",
          path: "/wiki/hipaa/core/technical-security",
          matches: ["All PHI stored in databases must be encrypted"]
        },
      ].filter(result => 
        result.title.toLowerCase().includes(query.toLowerCase()) || 
        result.description.toLowerCase().includes(query.toLowerCase()) ||
        result.matches.some(match => match.toLowerCase().includes(query.toLowerCase()))
      );
      
      setResults(mockResults);
      setIsSearching(false);
    }, 500);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    if (e.target.value === '') {
      setResults([]);
      setShowResults(false);
    }
  };

  const handleClickOutside = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setShowResults(false);
    }
  };

  return (
    <div className="relative w-full max-w-lg">
      <form onSubmit={handleSearch} className="w-full">
        <div className="relative">
          <input
            type="text"
            placeholder="Search documentation..."
            value={query}
            onChange={handleInputChange}
            onFocus={() => query.trim() && setShowResults(true)}
            className="w-full py-2 pl-10 pr-4 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3">
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 dark:text-gray-500" />
          </div>
          {isSearching && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <div className="w-4 h-4 border-2 border-gray-400 dark:border-gray-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>
      </form>

      {showResults && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-25 z-40"
          onClick={handleClickOutside}
        >
          <div className="absolute top-16 left-0 right-0 mx-auto w-full max-w-2xl bg-white dark:bg-gray-800 rounded-lg shadow-lg z-50 overflow-hidden max-h-[80vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Search Results {results.length ? `(${results.length})` : ''}
              </h3>
            </div>
            
            {results.length === 0 ? (
              <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                {isSearching ? 'Searching...' : 'No results found'}
              </div>
            ) : (
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {results.map((result, index) => (
                  <li key={index} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <a href={result.path} className="block" onClick={() => setShowResults(false)}>
                      <h4 className="text-base font-medium text-blue-600 dark:text-blue-400">{result.title}</h4>
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{result.description}</p>
                      {result.matches.length > 0 && (
                        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                          <span className="block font-medium mb-1">Matching content:</span>
                          {result.matches.map((match, idx) => (
                            <p key={idx} className="truncate">• {match}</p>
                          ))}
                        </div>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
