'use client';

import { useState } from 'react';

export default function Blog() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === process.env.NEXT_PUBLIC_BLOG_PASSWORD) {
      setIsAuthenticated(true);
    } else {
      alert('Incorrect password');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto mt-20">
        <h1 className="text-3xl font-bold mb-8">Private Blog</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-stone-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border border-stone-300 px-3 py-2"
              placeholder="Enter password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-stone-900 text-white px-4 py-2 rounded-md hover:bg-stone-800"
          >
            Access Blog
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Blog Posts</h1>
      <div className="space-y-8">
        {/* Add your blog posts here */}
        <article className="border-b pb-8">
          <h2 className="text-2xl font-semibold mb-2">First Blog Post</h2>
          <p className="text-stone-600 mb-4">
            This is where your philosophical thoughts and musings will go.
          </p>
          <div className="text-sm text-stone-500">Posted on: March 19, 2024</div>
        </article>
      </div>
    </div>
  );
} 