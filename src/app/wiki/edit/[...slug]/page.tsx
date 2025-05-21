'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { WikiLayout } from '@/components/layout/WikiLayout';

interface Frontmatter {
  title: string;
  description?: string;
  tags?: string[];
  [key: string]: any;
}

export default function EditWikiPage({ params }: { params: { slug: string[] } }) {
  const router = useRouter();
  const slugPath = params.slug.join('/');
  const [loading, setLoading] = useState(true);
  const [frontmatter, setFrontmatter] = useState<Frontmatter>({ title: '' });
  const [tagsInput, setTagsInput] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function fetchContent() {
      try {
        setLoading(true);
        const res = await fetch(`/api/files/${slugPath}`);
        const data = await res.json();
        if (!data.success) {
          throw new Error(data.error?.message || 'Failed to load content');
        }
        const fm: Frontmatter = data.data.frontmatter || { title: '' };
        setFrontmatter(fm);
        if (fm.tags) {
          setTagsInput(Array.isArray(fm.tags) ? fm.tags.join(', ') : String(fm.tags));
        }
        setContent(data.data.content || '');
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : 'Failed to load content');
      } finally {
        setLoading(false);
      }
    }
    fetchContent();
  }, [slugPath]);

  const handleFrontmatterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFrontmatter(prev => ({ ...prev, [name]: value }));
  };

  const handleTagsChange = (value: string) => {
    setTagsInput(value);
    setFrontmatter(prev => ({
      ...prev,
      tags: value
        .split(',')
        .map(t => t.trim())
        .filter(Boolean),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      const res = await fetch(`/api/files/${slugPath}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          frontmatter: {
            ...frontmatter,
            tags: frontmatter.tags,
            lastUpdated: new Date().toISOString().split('T')[0],
          },
        }),
      });
      const result = await res.json();
      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to update page');
      }
      setSuccess(true);
      setTimeout(() => {
        router.push(`/wiki/${slugPath}`);
      }, 1500);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Failed to update page');
    }
  };

  return (
    <WikiLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Edit Wiki Page</h1>
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : error ? (
          <div className="p-4 bg-red-50 dark:bg-red-900/30 rounded-md">
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={frontmatter.title}
                onChange={handleFrontmatterChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                required
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Description
              </label>
              <input
                type="text"
                id="description"
                name="description"
                value={frontmatter.description || ''}
                onChange={handleFrontmatterChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                id="tags"
                value={tagsInput}
                onChange={e => handleTagsChange(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Content (Markdown)
              </label>
              <textarea
                id="content"
                value={content}
                onChange={e => setContent(e.target.value)}
                rows={20}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white font-mono"
              />
            </div>
            {success && (
              <div className="p-4 bg-green-50 dark:bg-green-900/30 rounded-md">
                <p className="text-green-700 dark:text-green-300">Page updated successfully! Redirecting...</p>
              </div>
            )}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Save Changes
              </button>
            </div>
          </form>
        )}
      </div>
    </WikiLayout>
  );
}
