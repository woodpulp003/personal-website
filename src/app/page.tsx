'use client';

import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import Link from 'next/link';

// Remove the redundant colorStops and isNightTime function
// Define color stops for the 24-hour cycle (Hour: { from: hex, to: hex })
// These colors are muted and inspired by Alto\'s Adventure aesthetic
// Note: This is also defined in layout.tsx, consider centralizing if needed elsewhere
// const colorStops = [
//   { hour: 0, palette: { from: '#1a1e33', to: '#2b304d' } }, // Midnight (Black/Purplish)
//   { hour: 4, palette: { from: '#2b304d', to: '#4a4e69' } }, // Late Night/Early Dawn Transition
//   { hour: 6, palette: { from: '#eacb8a', to: '#e3a975' } }, // Dawn (Orange)
//   { hour: 8, palette: { from: '#e3a975', to: '#87ceeb' } }, // Dawn to Morning Transition
//   { hour: 12, palette: { from: '#87ceeb', to: '#b0e0e6' } }, // Noon (Muted White-ish/Light Blue)
//   { hour: 17, palette: { from: '#b0e0e6', to: '#ffb703' } }, // Afternoon to Sunset Transition\
//   { hour: 19, palette: { from: '#ffb703', to: '#fb8b24' } }, // Sunset (Orange)
//   { hour: 21, palette: { from: '#fb8b24', to: '#4a4e69' } }, // Sunset to Dusk Transition
//   { hour: 23, palette: { from: '#4a4e69', to: '#1a1e33' } }, // Late Dusk to Midnight Transition
//   { hour: 24, palette: { from: '#1a1e33', to: '#2b304d' } }, // Wrap around to Midnight (Same as hour 0, for calculation ease)
// ];

// Helper function to determine if it\'s night based on hour (simplified)
// const isNightTime = (hour: number) => hour < 6 || hour >= 20;

// Component to render the star field only on the client
const StarField = ({ isNight, scrollY }: { isNight: boolean, scrollY: number }) => {
  const [stars, setStars] = useState<Array<{ id: number, style: CSSProperties }>>([]);

  // Effect to generate stars only on the client after mount
  useEffect(() => {
    const generatedStars = Array.from({ length: 100 }).map((_, i) => ({
      id: i,
      style: {
        width: `${Math.random() * 2}px`,
        height: `${Math.random() * 2}px`,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        opacity: Math.random(),
        animation: `twinkle ${Math.random() * 5 + 5}s ease-in-out infinite alternate`,
      }
    }));
    setStars(generatedStars);
  }, []); // Empty dependency array ensures this runs only once on mount

  // Render stars only if it's night and the stars array is populated
  if (!isNight || stars.length === 0) {
    return null; // Don't render stars if not night or not yet generated
  }

  return (
    <div className="absolute inset-0 z-[-2]" style={{ opacity: 1 - (scrollY * 0.001) }}>
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute bg-white rounded-full"
          style={star.style}
        />
      ))}
    </div>
  );
};

// Component to render geometric trees on a mountain layer
const MountainTrees = ({ colorClass, density, mountainHeight, scrollFactor }: { colorClass: string, density: number, mountainHeight: string, scrollFactor: number }) => {
  const [trees, setTrees] = useState<Array<{ id: number, style: CSSProperties }>>([]);
  const [scrollY, setScrollY] = useState(0);

  // Effect to generate trees only on the client after mount
  useEffect(() => {
    const generatedTrees = Array.from({ length: density }).map((_, i) => ({
      id: i,
      style: {
        position: 'absolute',
        // Random horizontal position across the mountain width
        left: `${Math.random() * 100}%`,
        // Random vertical position near the top of the mountain layer, adjusted for perceived perspective
        bottom: `${Math.random() * (parseInt(mountainHeight, 10) * 0.3) + (parseInt(mountainHeight, 10) * 0.6)}%`,
        width: `${Math.random() * 8 + 4}px`, // Random width
        height: `${Math.random() * 8 + 4}px`, // Random height
        // Use clip-path to create a triangle shape
        clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
        // The background color will be applied via the Tailwind class
        // transform: 'translateX(-50%)', // Center the triangle horizontally
      }
    }));
    setTrees(generatedTrees);

    // Add scroll listener for parallax effect
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);

  }, [density, mountainHeight]); // Regenerate trees if density or mountain height changes

  return (
    <div className="absolute inset-0 z-10">
      {trees.map((tree) => (
        <div
          key={tree.id}
          className={`absolute ${colorClass}`}
          style={{
            ...tree.style,
            transform: `translateY(${scrollY * scrollFactor}px) translateX(-50%)` // Apply parallax and center
          }}
        />
      ))}
    </div>
  );
};

export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  const [sunPosition, setSunPosition] = useState({ top: '16px', left: '50%' });
  const [isNight, setIsNight] = useState(false);
  const [farMountainColor, setFarMountainColor] = useState('#9095b3'); // Default to Alto's day color
  const [middleMountainColor, setMiddleMountainColor] = useState('#7a7f9e'); // Default to Alto's day color
  const [closeMountainColor, setCloseMountainColor] = useState('#6a6b85'); // Default to Alto's day color

  const [farTreeColor, setFarTreeColor] = useState('bg-alto-tree-day');
  const [middleTreeColor, setMiddleTreeColor] = useState('bg-alto-tree-day');
  const [closeTreeColor, setCloseTreeColor] = useState('bg-alto-tree-day');

  // Effect for parallax scrolling
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Effect for sun/moon position, night detection, and sky color
  useEffect(() => {
    const updateCelestialPosition = () => {
      // Use real time
      const now = new Date();
      const hour = now.getHours();
      const minute = now.getMinutes();

      // Determine if it's night based on hour
      const isNightTime = hour < 6 || hour >= 20;
      setIsNight(isNightTime);

      // Determine mountain colors based on time of day
      let farMountainHex = '#9095b3'; // default day color
      let middleMountainHex = '#7a7f9e'; // default day color
      let closeMountainHex = '#6a6b85'; // default day color

      if (hour >= 0 && hour < 6) { // Night to Dawn
        farMountainHex = '#2b304d';
        middleMountainHex = '#4a4e69';
        closeMountainHex = '#5a5d77';
      } else if (hour >= 6 && hour < 8) { // Dawn
        farMountainHex = '#e3a975';
        middleMountainHex = '#eacb8a';
        closeMountainHex = '#f5d6a1';
      } else if (hour >= 17 && hour < 20) { // Sunset to Dusk
        farMountainHex = '#fb8b24';
        middleMountainHex = '#ffb703';
        closeMountainHex = '#f5d6a1'; // Reusing a similar warm tone
      } else if (hour >= 20) { // Night
        farMountainHex = '#2b304d';
        middleMountainHex = '#4a4e69';
        closeMountainHex = '#5a5d77';
      }

      // Set mountain colors using hex codes for inline style
      setFarMountainColor(farMountainHex);
      setMiddleMountainColor(middleMountainHex);
      setCloseMountainColor(closeMountainHex);

      // Determine tree colors based on time of day
      let treeColor = 'bg-alto-tree-day';

      if (hour >= 0 && hour < 6) { // Night to Dawn
        treeColor = 'bg-alto-tree-night';
      } else if (hour >= 6 && hour < 8) { // Dawn
        treeColor = 'bg-alto-tree-dawn';
      } else if (hour >= 17 && hour < 20) { // Sunset to Dusk
        treeColor = 'bg-alto-tree-dusk';
      } else if (hour >= 20) { // Night
        treeColor = 'bg-alto-tree-night';
      }

      setFarTreeColor(treeColor);
      setMiddleTreeColor(treeColor);
      setCloseTreeColor(treeColor);

      // Calculate sun/moon position based on time
      const totalMinutes = hour * 60 + minute;
      const totalMinutesInDay = 24 * 60;

      const dayProgress = totalMinutes / totalMinutesInDay; // 0 to 1

      // Adjust progress for non-linear path (e.g., higher in the middle)
      const verticalProgress = Math.sin(dayProgress * Math.PI);

      // Simple linear left movement
      const left = `${dayProgress * 100}%`;

      // Vertical movement: starts low, goes up, comes down. Adjusted for a reasonable range.
      const minTop = 10; // vh
      const maxTop = 70; // vh
      const top = `${maxTop - verticalProgress * (maxTop - minTop)}vh`;

      setSunPosition({ top, left });
    };

    // Update immediately and then every minute
    updateCelestialPosition();
    const intervalId = setInterval(updateCelestialPosition, 60000); // Update every minute

    return () => clearInterval(intervalId);
  }, []); // Empty dependency array means this effect runs once on mount

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Sky Background */}
      <div 
        className="fixed inset-0 transition-colors duration-1000"
        style={{ 
          zIndex: -1,
          backgroundColor: isNight ? '#1a1e33' : '#87ceeb' // Night: dark blue, Day: light blue
        }}
      />

      {/* Star Field - Rendered as a separate component */}
      <StarField isNight={isNight} scrollY={scrollY} />

      {/* Sun/Moon */}
      <div
        className={`absolute w-24 h-24 rounded-full z-10 transition-colors duration-1000 ${isNight ? 'bg-gray-300 shadow-[0_0_30px_10px_#d1d5db]' : 'bg-[#f5d6a1] shadow-[0_0_30px_10px_#f5d6a1]'}`}
        style={{
          top: sunPosition.top,
          left: sunPosition.left,
          transform: `translate(-50%, ${scrollY * 0.2}px)`,
          opacity: 1 - (scrollY * 0.003)
        }}
      />

      {/* Mountain Background - Using Tailwind classes for colors */}
      <div className="absolute bottom-0 left-0 w-full h-[70vh] z-0">
        {/* Far Mountains */}
        <div
          className={`absolute bottom-0 w-full h-[60vh] transition-colors duration-1000`}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '60vh',
            clipPath: "polygon(0% 100%, 100% 100%, 100% 30%, 85% 20%, 70% 25%, 50% 15%, 30% 25%, 15% 20%, 0% 15%)",
            backgroundColor: farMountainColor, // Use inline style with hex color
            transform: `translateY(${scrollY * 0.1}px)`,
          }}
        >
          {/* Trees for Far Mountains */}
          <MountainTrees colorClass={farTreeColor} density={30} mountainHeight="60vh" scrollFactor={0.1} />
        </div>
        {/* Middle Mountains */}
        <div
          className={`absolute bottom-0 w-full h-[50vh] transition-colors duration-1000`}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '50vh',
            clipPath: "polygon(0% 100%, 100% 100%, 100% 45%, 80% 35%, 60% 40%, 40% 30%, 20% 40%, 0% 35%)",
            backgroundColor: middleMountainColor, // Use inline style with hex color
            transform: `translateY(${scrollY * 0.2}px)`
          }}
        >
          {/* Trees for Middle Mountains */}
          <MountainTrees colorClass={middleTreeColor} density={40} mountainHeight="50vh" scrollFactor={0.2} />
        </div>
        {/* Close Mountains */}
        <div
          className={`absolute bottom-0 w-full h-[40vh] transition-colors duration-1000`}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '40vh',
            clipPath: "polygon(0% 100%, 100% 100%, 100% 55%, 90% 45%, 75% 50%, 60% 40%, 45% 50%, 30% 45%, 15% 50%, 0% 40%)",
            backgroundColor: closeMountainColor, // Use inline style with hex color
            transform: `translateY(${scrollY * 0.3}px)`
          }}
        >
          {/* Trees for Close Mountains */}
          <MountainTrees colorClass={closeTreeColor} density={50} mountainHeight="40vh" scrollFactor={0.3} />
        </div>
      </div>

      {/* Content */}
      <div className="absolute top-0 left-0 right-0 z-20 pt-32 px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1
              className="text-5xl md:text-6xl font-bold mb-6 text-white drop-shadow-md"
              style={{
                transform: `translateY(${scrollY * 0.1}px)`,
                opacity: 1 - (scrollY * 0.002)
              }}
            >
              Sahil
            </h1>
            <p
              className="text-xl md:text-2xl text-gray-200 mb-12 drop-shadow-sm"
              style={{
                transform: `translateY(${scrollY * 0.15}px)`,
                opacity: 1 - (scrollY * 0.002)
              }}
            >
              Welcome to my corner of the internet. I&apos;m passionate about technology, philosophy, and continuous learning.
            </p>
          </div>

          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            style={{
              transform: `translateY(${scrollY * 0.2}px)`,
              opacity: 1 - (scrollY * 0.001)
            }}
          >
            <Link
              href="/projects"
              className="p-6 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-all duration-300 shadow-lg hover:shadow-xl border border-white/20"
            >
              <h2 className="text-xl font-semibold mb-2 text-white">Projects</h2>
              <p className="text-gray-200">Check out my latest work and experiments</p>
            </Link>
            <Link
              href="/blog"
              className="p-6 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-all duration-300 shadow-lg hover:shadow-xl border border-white/20"
            >
              <h2 className="text-xl font-semibold mb-2 text-white">Blog</h2>
              <p className="text-gray-200">Philosophical thoughts and musings</p>
            </Link>
            <Link
              href="/notes"
              className="p-6 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-all duration-300 shadow-lg hover:shadow-xl border border-white/20"
            >
              <h2 className="text-xl font-semibold mb-2 text-white">Notes</h2>
              <p className="text-gray-200">Technical notes and course reflections</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
