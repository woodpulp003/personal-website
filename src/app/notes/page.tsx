'use client';

import { useState } from 'react';

const CONSTELLATIONS = [
  {
    name: 'Physics',
    color: '#7C3AED', // purple
    stars: [
      { id: '8.01', label: '8.01', name: 'Classical Mechanics', x: 120, y: 80 },
      { id: '8.02', label: '8.02', name: 'Electricity & Magnetism', x: 200, y: 160 },
      { id: '8.03', label: '8.03', name: 'Waves', x: 80, y: 200 },
    ],
    lines: [
      [0, 1], [1, 2], [2, 0]
    ]
  },
  {
    name: 'Math',
    color: '#38BDF8', // blue
    stars: [
      { id: '18.01', label: '18.01', name: 'Single Variable Calculus', x: 400, y: 120 },
      { id: '18.02', label: '18.02', name: 'Multivariable Calculus', x: 480, y: 200 },
      { id: '18.06', label: '18.06', name: 'Linear Algebra', x: 350, y: 250 },
    ],
    lines: [
      [0, 1], [1, 2]
    ]
  },
  {
    name: 'Computer Science',
    color: '#F472B6', // pink
    stars: [
      { id: '6.0001', label: '6.0001', name: 'Intro to CS', x: 700, y: 100 },
      { id: '6.006', label: '6.006', name: 'Algorithms', x: 800, y: 180 },
      { id: '6.046', label: '6.046', name: 'Design & Analysis', x: 720, y: 260 },
    ],
    lines: [
      [0, 1], [1, 2]
    ]
  }
];

export default function NotesPage() {
  const [selectedCourse, setSelectedCourse] = useState<null | { id: string; label: string; name: string }>(null);
  const [fade, setFade] = useState<'in' | 'out'>('in');

  // Responsive SVG viewBox calculation
  const allStars = CONSTELLATIONS.flatMap(c => c.stars);
  const minX = Math.min(...allStars.map(s => s.x));
  const maxX = Math.max(...allStars.map(s => s.x));
  const minY = Math.min(...allStars.map(s => s.y));
  const maxY = Math.max(...allStars.map(s => s.y));
  const pad = 60;
  const viewBox = `${minX - pad} ${minY - pad} ${maxX - minX + 2 * pad} ${maxY - minY + 2 * pad}`;

  // Handle smooth fade transition
  function handleStarClick(star: { id: string; label: string; name: string }) {
    setFade('out');
    setTimeout(() => {
      setSelectedCourse(star);
      setFade('in');
    }, 350);
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#18122B] via-[#1E1B2E] to-[#232946] flex items-center justify-center relative overflow-hidden">
      {/* Fade transition wrapper */}
      <div className={`absolute inset-0 transition-opacity duration-300 ${fade === 'out' ? 'opacity-0' : 'opacity-100'} flex items-center justify-center`}>
        {/* Main constellation view */}
        {!selectedCourse && (
          <>
            <svg
              width="1000"
              height="500"
              className="block mx-auto"
              style={{maxWidth: '100vw', maxHeight: '70vh'}}
              viewBox={viewBox}
            >
              {CONSTELLATIONS.map((c) => (
                <g key={c.name}>
                  {/* Draw lines */}
                  {c.lines.map(([from, to], li) => {
                    const s1 = c.stars[from];
                    const s2 = c.stars[to];
                    return (
                      <line
                        key={li}
                        x1={s1.x}
                        y1={s1.y}
                        x2={s2.x}
                        y2={s2.y}
                        stroke={c.color}
                        strokeWidth="1.5"
                        opacity="0.5"
                      />
                    );
                  })}
                  {/* Draw stars */}
                  {c.stars.map((star) => (
                    <g key={star.id} style={{cursor: 'pointer'}}>
                      <circle
                        cx={star.x}
                        cy={star.y}
                        r="10"
                        fill={c.color}
                        filter="url(#glow)"
                        className="transition-all duration-200 hover:drop-shadow-[0_0_12px_rgba(124,58,237,0.7)] hover:brightness-150 hover:r-16"
                        style={{
                          transition: 'filter 0.2s, r 0.2s',
                        }}
                        onClick={() => handleStarClick(star)}
                        onMouseOver={e => e.currentTarget.setAttribute('r', '16')}
                        onMouseOut={e => e.currentTarget.setAttribute('r', '10')}
                      />
                      <text
                        x={star.x + 16}
                        y={star.y + 5}
                        fontSize="1rem"
                        fill="#E0E7FF"
                        className="select-none"
                      >
                        {star.label}
                      </text>
                    </g>
                  ))}
                </g>
              ))}
              {/* SVG filter for glow effect */}
              <defs>
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
            </svg>
            {/* Constellation labels */}
            <div className="absolute left-1/2 top-8 -translate-x-1/2 flex gap-12">
              {CONSTELLATIONS.map((c) => (
                <span key={c.name} className="text-lg font-semibold" style={{color: c.color, textShadow: '0 0 8px #0008'}}>{c.name}</span>
              ))}
            </div>
          </>
        )}
        {/* Course notes view */}
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
              aria-label="Back to constellations"
            >
              ←
            </button>
            <div className="bg-[#232946]/80 rounded-xl shadow-2xl p-10 max-w-xl w-full flex flex-col items-center">
              <h2 className="text-3xl font-bold mb-2 text-center" style={{color: '#A5B4FC'}}>{selectedCourse.label}: {selectedCourse.name}</h2>
              <div className="text-neutral-200 text-lg mt-4 text-center">
                {/* Placeholder for notes */}
                <p>Notes for <span className="font-semibold">{selectedCourse.label}</span> will appear here.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 