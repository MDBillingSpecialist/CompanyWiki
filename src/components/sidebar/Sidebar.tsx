"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRightIcon, ChevronDownIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import { ThemeToggle } from '../theme/ThemeToggle';

type NavItem = {
  title: string;
  path: string;
  children?: NavItem[];
};

const mainNavItems: NavItem[] = [
  {
    title: 'Home',
    path: '/',
  },
  {
    title: 'Company Wiki',
    path: '/wiki/company-wiki',
    children: [
      {
        title: 'About',
        path: '/wiki/company-wiki/about',
      },
      {
        title: 'Teams',
        path: '/wiki/company-wiki/teams',
      },
    ],
  },
  {
    title: 'HIPAA',
    path: '/wiki/hipaa',
    children: [
      {
        title: 'Comprehensive Guide',
        path: '/wiki/hipaa/comprehensive-guide',
      },
      {
        title: 'Dashboard',
        path: '/wiki/hipaa/dashboard',
      },
      {
        title: 'Checklists',
        path: '/wiki/hipaa/checklists',
      },
      {
        title: 'Documentation',
        path: '/wiki/hipaa/documentation',
        children: [
          {
            title: 'Technical Security',
            path: '/wiki/hipaa/documentation/technical-security',
          },
          {
            title: 'Access Control',
            path: '/wiki/hipaa/documentation/access-control',
          },
          {
            title: 'CCM Requirements',
            path: '/wiki/hipaa/documentation/ccm-specific-requirements',
          },
          {
            title: 'Incident Response',
            path: '/wiki/hipaa/documentation/incident-response',
          },
          {
            title: 'LLM Compliance',
            path: '/wiki/hipaa/documentation/llm-compliance',
          },
        ],
      }
    ],
  },
  {
    title: 'SOPs',
    path: '/wiki/sop',
    children: [
      {
        title: 'Engineering',
        path: '/wiki/sop/engineering',
        children: [
          {
            title: 'Deployment',
            path: '/wiki/sop/engineering/deployment',
          },
          {
            title: 'Code Review',
            path: '/wiki/sop/engineering/code-review',
          },
        ],
      },
      {
        title: 'Compliance',
        path: '/wiki/sop/compliance',
        children: [
          {
            title: 'Incident Response',
            path: '/wiki/sop/compliance/incident-response',
          },
          {
            title: 'Audit Procedures',
            path: '/wiki/sop/compliance/audit-procedures',
          },
        ],
      },
    ],
  },
];

// NavItem component
const NavItem = ({ item, depth = 0 }: { item: NavItem; depth?: number }) => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(pathname.startsWith(item.path));
  const hasChildren = item.children && item.children.length > 0;
  const isActive = pathname === item.path;
  
  return (
    <div className="w-full">
      <div 
        className={`flex items-center justify-between py-2 pr-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 ${
          isActive ? 'bg-gray-100 dark:bg-gray-800 font-medium' : ''
        }`}
        style={{ paddingLeft: `${depth * 0.75 + 0.5}rem` }}
      >
        <Link 
          href={item.path}
          className={`flex-grow text-sm ${isActive ? 'text-blue-600 dark:text-blue-400' : ''}`}
        >
          {item.title}
        </Link>
        
        {hasChildren && (
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            {isOpen ? (
              <ChevronDownIcon className="w-4 h-4" />
            ) : (
              <ChevronRightIcon className="w-4 h-4" />
            )}
          </button>
        )}
      </div>
      
      {/* Child items */}
      {hasChildren && isOpen && (
        <div className="pl-4 border-l border-gray-200 dark:border-gray-700 ml-2">
          {item.children?.map((child) => (
            <NavItem key={child.path} item={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

export const Sidebar = () => {
  return (
    <div className="w-64 h-screen overflow-y-auto border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 py-4 px-2 flex flex-col">
      <div className="flex items-center justify-between px-2 mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Company Wiki</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Documentation & SOPs</p>
        </div>
        <ThemeToggle />
      </div>
      
      <nav className="space-y-1 flex-1 overflow-y-auto">
        {mainNavItems.map((item) => (
          <NavItem key={item.path} item={item} />
        ))}
      </nav>
      
      <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-800">
        <div className="px-2 py-2 flex items-center text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md">
          <Cog6ToothIcon className="w-5 h-5 mr-2" />
          <span>Settings</span>
        </div>
      </div>
    </div>
  );
};
