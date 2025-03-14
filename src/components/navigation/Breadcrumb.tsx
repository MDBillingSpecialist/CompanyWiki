"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline';

export const Breadcrumb = () => {
  const pathname = usePathname();
  
  // Skip rendering breadcrumbs on homepage
  if (pathname === '/') {
    return null;
  }
  
  // Convert pathname to breadcrumb items
  const pathSegments = pathname.split('/').filter(Boolean);
  const breadcrumbItems = pathSegments.map((segment, index) => {
    // Build the URL for this breadcrumb item
    const url = `/${pathSegments.slice(0, index + 1).join('/')}`;
    
    // Format the title (capitalize and replace hyphens with spaces)
    const title = segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    return { title, url };
  });
  
  // Add home as the first item
  breadcrumbItems.unshift({ title: 'Home', url: '/' });
  
  return (
    <nav className="flex py-3 px-4 text-sm text-gray-600 dark:text-gray-300 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        {breadcrumbItems.map((item, index) => (
          <li key={item.url} className="inline-flex items-center">
            {index > 0 && (
              <ChevronRightIcon className="w-4 h-4 mx-1 text-gray-400" />
            )}
            
            {index === 0 && (
              <HomeIcon className="w-4 h-4 mr-1" />
            )}
            
            {index === breadcrumbItems.length - 1 ? (
              <span className="text-gray-500 dark:text-gray-400" aria-current="page">
                {item.title}
              </span>
            ) : (
              <Link 
                href={item.url}
                className="hover:text-blue-600 dark:hover:text-blue-400"
              >
                {item.title}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};
