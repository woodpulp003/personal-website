'use client';

import Link from 'next/link';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  slug: string;
}

const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Oscillations, Symmetry and Diagonalization',
    excerpt: 'From a single mass on a spring to a vibrating string, oscillatory systems are often taught in the typical classroom via a sequence of seemingly ad-hoc guesses: exponentials in time, normal modes in space, and Fourier series in the continuum limit. In this essay, we look at oscillations from a linear-operator lens, and use symmetries with which those operators commute to show how diagonalization naturally decouples the dynamics.',
    date: 'January 25, 2025',
    slug: 'oscillations-symmetry-and-diagonalization'
  }
];

export default function Blog() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-3xl mx-auto px-6 py-16 md:py-24">
        <header className="mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Blog</h1>
        </header>

        <div className="space-y-12">
          {blogPosts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="block group"
            >
              <article className="border border-white/20 pb-8 p-6 transition-opacity group-hover:opacity-70">
                <h2 className="text-2xl md:text-3xl font-semibold mb-3 group-hover:underline">
                  {post.title}
                </h2>
                <p className="text-gray-400 mb-4 leading-relaxed">
                  {post.excerpt}
                </p>
                <time className="text-xs text-gray-500">
                  {post.date}
                </time>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
} 