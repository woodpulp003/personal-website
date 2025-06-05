'use client';

import { useState, useEffect } from 'react';

const projects = [
  {
    title: "Personal Website",
    description: "A modern, responsive personal website built with Next.js and Tailwind CSS, featuring a dynamic day/night cycle and parallax scrolling effects.",
    tags: ["Next.js", "Tailwind CSS", "TypeScript"],
    image: "/images/vinyl-placeholder-1.png",
    link: "https://github.com/woodpulp003/personal-website"
  },
  {
    title: "AI-Powered Code Review",
    description: "An AI system that analyzes code changes and provides detailed feedback on potential issues, code quality, and best practices.",
    tags: ["Python", "OpenAI", "GitHub API"],
    image: "/images/vinyl-placeholder-2.png",
    link: "https://github.com/woodpulp003/ai-code-review"
  },
  {
    title: "Smart Home Dashboard",
    description: "A centralized dashboard for managing smart home devices, with real-time monitoring and automated control systems.",
    tags: ["React", "Node.js", "IoT"],
    image: "/images/vinyl-placeholder-3.png",
    link: "https://github.com/woodpulp003/smart-home-dashboard"
  },
  {
    title: "Language Learning App",
    description: "An interactive language learning platform with personalized learning paths and real-time progress tracking.",
    tags: ["Flutter", "Firebase", "Dart"],
    image: "/images/vinyl-placeholder-1.png",
    link: "https://github.com/woodpulp003/language-learning-app"
  },
  {
    title: "E-commerce Analytics",
    description: "A comprehensive analytics platform for e-commerce businesses, providing insights into customer behavior and sales trends.",
    tags: ["Python", "Django", "PostgreSQL"],
    image: "/images/vinyl-placeholder-2.png",
    link: "https://github.com/woodpulp003/ecommerce-analytics"
  },
  {
    title: "Task Management System",
    description: "A collaborative task management system with real-time updates, team collaboration features, and progress tracking.",
    tags: ["Vue.js", "Express", "MongoDB"],
    image: "/images/vinyl-placeholder-3.png",
    link: "https://github.com/woodpulp003/task-management"
  }
];

export default function Projects() {
  const [selected, setSelected] = useState(0);
  const [hovered, setHovered] = useState<number>(-1);
  const [isMobile, setIsMobile] = useState(false);

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="min-h-screen bg-neutral-900 text-white flex flex-col lg:flex-row">
      {/* Left: Album (70% on desktop, full width on mobile) */}
      <div className="w-full lg:w-[70%] h-screen flex flex-col">
        {/* Top: Album header, Spotify style */}
        <div className="flex items-end gap-8 px-4 md:px-12 pt-12 pb-8" style={{background: 'linear-gradient(180deg, #232526 60%, #181818 100%)', minHeight: '220px'}}>
          <img
            src="/images/vinyl-placeholder-1.png"
            alt="Projects Album Cover"
            className="w-32 h-32 md:w-44 md:h-44 rounded shadow-2xl object-cover border border-neutral-800"
            style={{boxShadow: '0 8px 32px 0 rgba(0,0,0,0.5)'}}
          />
          <div className="flex flex-col justify-end h-full">
            <span className="uppercase text-xs text-neutral-300 font-semibold mb-2 tracking-widest">Album</span>
            <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-none tracking-tight">Projects</h1>
            <div className="flex items-center gap-2 text-neutral-300 text-sm md:text-base font-medium">
              <span>2024</span>
              <span className="mx-1">•</span>
              <span>{projects.length} projects</span>
            </div>
          </div>
        </div>
        {/* Playlist */}
        <div className="flex-1 overflow-y-auto bg-neutral-900/95">
          <div className="px-4 md:px-12 pt-6 pb-2 flex items-center text-neutral-400 text-xs uppercase tracking-widest font-semibold border-b border-neutral-800 bg-neutral-900/80 sticky top-0 z-10">
            <span className="w-8">#</span>
            <span className="flex-1">Title</span>
            <span className="hidden md:block w-32 text-right">Tags</span>
          </div>
          <ul className="divide-y divide-neutral-800">
            {projects.map((project, idx) => (
              <li
                key={project.title}
                className={`flex items-center px-4 md:px-12 py-4 cursor-pointer transition-colors group ${
                  selected === idx
                    ? 'bg-green-900/20'
                    : hovered === idx
                    ? 'bg-neutral-800/80'
                    : ''
                }`}
                onMouseEnter={() => setHovered(idx)}
                onMouseLeave={() => setHovered(-1)}
                onClick={() => setSelected(idx)}
              >
                <div className="w-8 text-neutral-400 text-lg mr-4 flex-shrink-0 flex items-center justify-center">
                  {selected === idx ? (
                    <span className="text-green-400">▶</span>
                  ) : (
                    idx + 1
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-base truncate group-hover:underline">{project.title}</div>
                  <div className="text-neutral-400 text-xs truncate max-w-md">{project.description}</div>
                </div>
                <div className="hidden md:flex w-32 justify-end gap-1 flex-wrap">
                  {project.tags.map((tag, i) => (
                    <span key={i} className="px-2 py-0.5 bg-neutral-800 text-neutral-300 rounded-full text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right: Info Panel (30% on desktop, full width on mobile) */}
      {!isMobile && (
        <div className="w-[30%] h-screen bg-neutral-950/90 border-l border-neutral-800 p-0 flex flex-col">
          <div className="relative h-1/2 bg-neutral-900 flex flex-col justify-end p-8 pb-6 border-b border-neutral-800">
            <img
              src={projects[selected].image}
              alt={projects[selected].title}
              className="absolute inset-0 w-full h-full object-cover opacity-30 rounded-tl-lg rounded-bl-lg pointer-events-none select-none"
              style={{zIndex: 0}}
            />
            <div className="relative z-10">
              <span className="uppercase text-xs text-neutral-300 font-semibold mb-2 tracking-widest">Project</span>
              <h2 className="text-3xl font-bold mb-2 text-left">{projects[selected].title}</h2>
              <div className="flex flex-wrap gap-2 mb-2">
                {projects[selected].tags.map((tag, i) => (
                  <span key={i} className="px-2 py-1 bg-neutral-800 text-neutral-300 rounded-full text-xs">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto text-neutral-200 text-base leading-relaxed px-8 py-6">
            {projects[selected].description}
          </div>
          <a
            href={projects[selected].link}
            className="mb-8 mx-8 inline-block text-green-400 hover:underline text-left font-semibold"
            target="_blank"
            rel="noopener noreferrer"
          >
            View Project
          </a>
        </div>
      )}

      {/* Mobile Info Panel (shown when a project is selected) */}
      {isMobile && selected !== -1 && (
        <div className="fixed inset-0 bg-neutral-950/95 z-50 p-4">
          <div className="relative h-full flex flex-col">
            <button
              onClick={() => setSelected(-1)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="relative h-1/2 bg-neutral-900 flex flex-col justify-end p-8 pb-6 border-b border-neutral-800">
              <img
                src={projects[selected].image}
                alt={projects[selected].title}
                className="absolute inset-0 w-full h-full object-cover opacity-30 pointer-events-none select-none"
                style={{zIndex: 0}}
              />
              <div className="relative z-10">
                <span className="uppercase text-xs text-neutral-300 font-semibold mb-2 tracking-widest">Project</span>
                <h2 className="text-3xl font-bold mb-2 text-left">{projects[selected].title}</h2>
                <div className="flex flex-wrap gap-2 mb-2">
                  {projects[selected].tags.map((tag, i) => (
                    <span key={i} className="px-2 py-1 bg-neutral-800 text-neutral-300 rounded-full text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto text-neutral-200 text-base leading-relaxed px-8 py-6">
              {projects[selected].description}
            </div>
            <a
              href={projects[selected].link}
              className="mb-8 mx-8 inline-block text-green-400 hover:underline text-left font-semibold"
              target="_blank"
              rel="noopener noreferrer"
            >
              View Project
            </a>
          </div>
        </div>
      )}
    </div>
  );
} 