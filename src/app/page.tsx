import Link from 'next/link';

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto">
      <section className="py-20">
        <h1 className="text-4xl font-bold mb-4">
          Hi, I'm Sahil 👋
        </h1>
        <p className="text-xl text-stone-600 mb-8">
          Welcome to my corner of the internet. I'm passionate about technology, philosophy, and continuous learning.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link 
            href="/projects"
            className="p-6 border rounded-lg hover:border-stone-400 transition-colors"
          >
            <h2 className="text-xl font-semibold mb-2">Projects</h2>
            <p className="text-stone-600">Check out my latest work and experiments</p>
          </Link>
          <Link 
            href="/blog"
            className="p-6 border rounded-lg hover:border-stone-400 transition-colors"
          >
            <h2 className="text-xl font-semibold mb-2">Blog</h2>
            <p className="text-stone-600">Philosophical thoughts and musings</p>
          </Link>
          <Link 
            href="/notes"
            className="p-6 border rounded-lg hover:border-stone-400 transition-colors"
          >
            <h2 className="text-xl font-semibold mb-2">Notes</h2>
            <p className="text-stone-600">Technical notes and course reflections</p>
          </Link>
        </div>
      </section>
    </div>
  );
}
