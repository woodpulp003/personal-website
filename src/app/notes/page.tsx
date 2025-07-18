'use client';

import { useState } from 'react';

interface Course {
  id: string;
  code: string;
  title: string;
  description: string;
  category: string;
  color: string;
}

const courses: Course[] = [
  // Physics
  {
    id: '8.033',
    code: '8.033',
    title: 'Relativity I',
    description: 'The Special Theory of Relativity. Relativistic generalizations of Electromagnetism. Introduction to General Theory of Relativity.',
    category: 'Physics',
    color: '#7C3AED'
  },
  {
    id: '8.223',
    code: '8.223',
    title: 'Classical Mechanics II',
    description: 'Lagrangian Formulation of Classical Mechanics.',
    category: 'Physics',
    color: '#7C3AED'
  },
  {
    id: '8.044',
    code: '8.044',
    title: 'Statistical Mechanics I',
    description: 'Statistical mechanics and thermodynamics.',
    category: 'Physics',
    color: '#7C3AED'
  },
  {
    id: '8.05',
    code: '8.05',
    title: 'Quantum Physics II',
    description: 'Linear Algebra formulation of quantum physics.',
    category: 'Physics',
    color: '#7C3AED'
  },
  {
    id: '8.07',
    code: '8.07',
    title: 'Electromagnetism II',
    description: 'Vector formulation of electromagnetic theory.',
    category: 'Physics',
    color: '#7C3AED'
  },
  {
    id: '8.08',
    code: '8.08**',
    title: 'Statistical Mechanics II',
    description: 'Advanced statistical mechanics.',
    category: 'Physics',
    color: '#7C3AED'
  },
  {
    id: '8.962',
    code: '8.962',
    title: 'General Relativity',
    description: 'Graduate level course on modeling spacetime as a manifold, whose curvature is informed by matter.',
    category: 'Physics',
    color: '#7C3AED'
  },

  // Mathematics
  {
    id: '18.03',
    code: '18.03*',
    title: 'Differential Equations',
    description: 'Various methods of solving ODEs, with a focus on linear systems. Some methods of solving PDEs.',
    category: 'Mathematics',
    color: '#38BDF8'
  },
  {
    id: '18.06',
    code: '18.06*',
    title: 'Linear Algebra',
    description: 'Fundamentals of linear algebra.',
    category: 'Mathematics',
    color: '#38BDF8'
  },
  {
    id: '18.211',
    code: '18.211**',
    title: 'Combinatorics I',
    description: 'Introduction to combinatorial mathematics.',
    category: 'Mathematics',
    color: '#38BDF8'
  },

  // Computer Science & Algorithms
  {
    id: '6.1220',
    code: '6.1220',
    title: 'Design and Analysis of Algorithms',
    description: 'Algorithm design and complexity analysis.',
    category: 'Computer Science & Algorithms',
    color: '#F472B6'
  },

  // Statistics & Machine Learning
  {
    id: '6.3700',
    code: '6.3700',
    title: 'Introduction to Probability',
    description: 'Fundamental concepts in probability theory.',
    category: 'Statistics & Machine Learning',
    color: '#10B981'
  },
  {
    id: '6.S184',
    code: '6.S184**',
    title: 'Introduction to Diffusion Models',
    description: 'Special topics in diffusion models.',
    category: 'Statistics & Machine Learning',
    color: '#10B981'
  },
  {
    id: '6.3730',
    code: '6.3730',
    title: 'Applied Statistics',
    description: 'Statistical methods and applications.',
    category: 'Statistics & Machine Learning',
    color: '#10B981'
  },
  {
    id: '6.7910',
    code: '6.7910',
    title: 'Statistical Learning Theory',
    description: 'A theoretical formulation of machine learning.',
    category: 'Statistics & Machine Learning',
    color: '#10B981'
  },
  {
    id: '6.7800',
    code: '6.7800',
    title: 'Inference and Information',
    description: 'Theory behind hypothesis tests, parameter estimation, model families and their asymptotics.',
    category: 'Statistics & Machine Learning',
    color: '#10B981'
  },
  {
    id: '6.S966',
    code: '6.S966',
    title: 'Symmetry and its Applications to Machine Learning',
    description: 'Quick introduction to representation theory, and using it to build symmetry-aware machine learning models.',
    category: 'Statistics & Machine Learning',
    color: '#10B981'
  },
  {
    id: '9.521',
    code: '9.521',
    title: 'Non-Asymptotic Statistics',
    description: 'Mathematical statistics on the non-asymptotic behavior of various probabilistic objects.',
    category: 'Statistics & Machine Learning',
    color: '#10B981'
  },

  // Philosophy & Cognitive Science
  {
    id: '24.09',
    code: '24.09',
    title: 'Minds and Machines',
    description: 'A Philosophical survey of the various theories of mind, ranging from Duality in 1600s to modern neurological frameworks of the mind.',
    category: 'Philosophy & Cognitive Science',
    color: '#F59E0B'
  }
];

const categories = ['All', 'Physics', 'Mathematics', 'Computer Science & Algorithms', 'Statistics & Machine Learning', 'Philosophy & Cognitive Science'];

export default function NotesPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [fade, setFade] = useState<'in' | 'out'>('in');

  const filteredCourses = selectedCategory === 'All' 
    ? courses 
    : courses.filter(course => course.category === selectedCategory);

  // Handle smooth fade transition
  function handleCourseClick(course: Course) {
    setFade('out');
    setTimeout(() => {
      setSelectedCourse(course);
      setFade('in');
    }, 350);
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#18122B] via-[#1E1B2E] to-[#232946] flex flex-col">
      {/* Header */}
      <div className="px-4 md:px-12 pt-16 pb-8">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-none tracking-tight text-white">Coursework</h1>
        <p className="text-neutral-300 text-lg max-w-2xl">
          A collection of courses I&apos;ve taken at MIT, organized by subject area.
        </p>
      </div>

      {/* Category Filter */}
      <div className="px-4 md:px-12 py-6 border-b border-neutral-800/50">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-white/20 text-white'
                  : 'bg-neutral-800/50 text-neutral-300 hover:bg-neutral-700/50'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Fade transition wrapper */}
      <div className={`flex-1 transition-opacity duration-300 ${fade === 'out' ? 'opacity-0' : 'opacity-100'}`}>
        {/* Course Grid View */}
        {!selectedCourse && (
          <div className="px-4 md:px-12 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <div
                  key={course.id}
                  className="bg-neutral-800/50 rounded-lg p-6 hover:bg-neutral-700/50 transition-all duration-200 cursor-pointer border border-neutral-700/50 hover:border-neutral-600/50 hover:scale-105"
                  onClick={() => handleCourseClick(course)}
                  style={{
                    boxShadow: `0 4px 20px ${course.color}20`,
                    borderColor: `${course.color}30`
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-1" style={{color: course.color}}>{course.code}</h3>
                      <h4 className="text-white font-medium mb-2">{course.title}</h4>
                    </div>
                  </div>
                  <p className="text-neutral-300 text-sm leading-relaxed">{course.description}</p>
                  <div className="mt-4">
                    <span className="inline-block px-2 py-1 bg-neutral-700/50 text-neutral-300 rounded-full text-xs">
                      {course.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Course Detail View */}
        {selectedCourse && (
          <div className="min-h-screen w-full flex flex-col items-center justify-center relative">
            <button
              className="absolute top-8 left-8 text-neutral-300 hover:text-white text-2xl p-2 rounded-full bg-black/30 hover:bg-black/60 transition"
              onClick={() => {
                setFade('out');
                setTimeout(() => {
                  setSelectedCourse(null);
                  setFade('in');
                }, 350);
              }}
              aria-label="Back to courses"
            >
              ←
            </button>
            <div className="bg-[#232946]/80 rounded-xl shadow-2xl p-10 max-w-2xl w-full flex flex-col items-center">
              <h2 className="text-3xl font-bold mb-2 text-center" style={{color: selectedCourse.color}}>
                {selectedCourse.code}: {selectedCourse.title}
              </h2>
              <p className="text-neutral-200 text-lg mt-4 text-center leading-relaxed">
                {selectedCourse.description}
              </p>
              <div className="flex items-center justify-between w-full mt-6">
                <span className="inline-block px-3 py-1 bg-neutral-700/50 text-neutral-300 rounded-full text-sm">
                  {selectedCourse.category}
                </span>
                <span className="text-neutral-400 text-sm">MIT Course</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 