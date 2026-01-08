'use client';

import { useEffect, useState, useRef } from 'react';
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

// Helper: interpolate between two hex colors
function lerpColor(a: string, b: string, t: number) {
  const ah = a.replace('#', '');
  const bh = b.replace('#', '');
  const ar = parseInt(ah.substring(0, 2), 16), ag = parseInt(ah.substring(2, 4), 16), ab = parseInt(ah.substring(4, 6), 16);
  const br = parseInt(bh.substring(0, 2), 16), bg = parseInt(bh.substring(2, 4), 16), bb = parseInt(bh.substring(4, 6), 16);
  const rr = Math.round(ar + (br - ar) * t);
  const rg = Math.round(ag + (bg - ag) * t);
  const rb = Math.round(ab + (bb - ab) * t);
  return `#${rr.toString(16).padStart(2, '0')}${rg.toString(16).padStart(2, '0')}${rb.toString(16).padStart(2, '0')}`;
}

// Helper: darken a hex color by a factor (0-1)
function darkenColor(color: string, factor: number = 0.3) {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  const newR = Math.max(0, Math.floor(r * (1 - factor)));
  const newG = Math.max(0, Math.floor(g * (1 - factor)));
  const newB = Math.max(0, Math.floor(b * (1 - factor)));
  
  return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
}

// Add seeded random number generator
function mulberry32(a: number) {
  return function() {
    let t = a += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
}

// Component to render the star field only on the client
const StarField = ({ isNight, scrollY }: { isNight: boolean, scrollY: number }) => {
  const [stars, setStars] = useState<Array<{ id: number, style: CSSProperties }>>([]);

  // Effect to generate stars only on the client after mount
  useEffect(() => {
    const random = mulberry32(5); // Use seed 42 for stars
    const generatedStars = Array.from({ length: 500 }).map((_, i) => {
      // Create more stars near the top using exponential distribution
      const top = Math.pow(random(), 2) * 100; // This creates more stars near 0%
      const size = random() * 1.2 + 0.3; // Smaller stars: 0.3-1.5px
      const opacity = random() * 0.5 + 0.3; // Opacity between 0.3-0.8
      const twinkleDuration = random() * 3 + 2; // Twinkle duration between 2-5s
      
      return {
        id: i,
        style: {
          width: `${size}px`,
          height: `${size}px`,
          top: `${top}%`,
          left: `${random() * 100}%`,
          opacity,
          animation: `twinkle ${twinkleDuration}s ease-in-out infinite alternate`,
          filter: 'blur(0.2px)',
        }
      };
    });
    setStars(generatedStars);
  }, []);

  // Render stars only if it's night and the stars array is populated
  if (!isNight || stars.length === 0) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none" style={{ opacity: 1 - (scrollY * 0.001) }}>
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

// Component to render geometric trees on mountains
const MountainTrees = ({ mountainColor, mountainHeight, scrollFactor, treeZIndex = 10 }: { mountainColor: string, mountainHeight: string, scrollFactor: number, treeZIndex?: number }) => {
  const [trees, setTrees] = useState<Array<{ id: number, style: CSSProperties }>>([]);
  const [scrollY, setScrollY] = useState(0);

  // Effect to generate trees only on the client after mount
  useEffect(() => {
    // Use different seeds for different mountain layers based on height
    const seed = mountainHeight === '60vh' ? 123 : mountainHeight === '50vh' ? 456 : 789;
    const random = mulberry32(seed);
    
    // Generate trees with arc distribution (denser at edges)
    const treeCount = 30; // Increased count for better coverage
    const generatedTrees: Array<{ id: number, style: CSSProperties }> = [];
    
    for (let i = 0; i < treeCount; i++) {
      // Create arc distribution: more density at edges (0% and 100%), less in middle (50%)
      // Use a U-shaped distribution
      let leftPercent: number;
      const rand = random();
      
      // 60% chance to be in edge regions (0-30% or 70-100%), 40% in middle (30-70%)
      if (rand < 0.3) {
        // Left edge: 0-30%
        leftPercent = random() * 30;
      } else if (rand < 0.6) {
        // Right edge: 70-100%
        leftPercent = 70 + random() * 30;
      } else {
        // Middle: 30-70% (less dense)
        leftPercent = 30 + random() * 40;
      }
      
      // Add some randomness to make it look natural
      leftPercent += (random() - 0.5) * 5; // Add ±2.5% jitter
      leftPercent = Math.max(5, Math.min(95, leftPercent)); // Clamp between 5-95%
      
      // Height based on position: taller at edges, smaller in middle
      // Distance from center (50%) determines height
      const distanceFromCenter = Math.abs(leftPercent - 50) / 50; // 0 at center, 1 at edges
      const baseHeight = 30 + distanceFromCenter * 40; // 30px at center, 70px at edges
      const heightVariation = (random() - 0.5) * 20; // ±10px random variation
      const height = Math.max(25, Math.min(80, baseHeight + heightVariation));
      
      const width = height * 0.5; // Width is 50% of height
      const bottom = random() * 25 + 5; // Position between 5-30% from bottom
      
      generatedTrees.push({
        id: i,
        style: {
          position: 'absolute' as CSSProperties['position'],
          left: `${leftPercent}%`,
          bottom: `${bottom}%`,
          width: `${width}px`,
          height: `${height}px`,
          clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
          transition: 'background-color 1s ease-in-out',
        }
      });
    }
    
    setTrees(generatedTrees);

    // Add scroll listener for parallax effect
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);

  }, [mountainHeight]);

  // Darken the mountain color for trees to make them visible
  const treeColor = darkenColor(mountainColor, 0.25);

  return (
    <div className="absolute inset-0" style={{ zIndex: treeZIndex }}>
      {trees.map((tree) => (
        <div
          key={tree.id}
          className="absolute"
          style={{
            ...tree.style,
            backgroundColor: treeColor, // Use darkened mountain color for visibility
            transform: `translateY(${scrollY * scrollFactor}px)`, // Remove translateX(-50%) to fix positioning
          }}
        />
      ))}
    </div>
  );
};

export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  // Calculate initial arcCenterY based on window height (or default if SSR)
  const getInitialArcCenterY = () => typeof window !== 'undefined' ? window.innerHeight / 2 : 400;
  const [arcCenterY, setArcCenterY] = useState(getInitialArcCenterY);
  
  // Helper function to calculate celestial positions
  const calculateCelestialPositions = (centerY: number) => {
    const now = performance.now();
    const currentTimeMs = Date.now() % 120000;
    const fastMinutes = ((now / 1000 + currentTimeMs / 1000) % 120) / 120 * 1440;
    const dayProgress = fastMinutes / 1440;
    const sunAngle = dayProgress * 2 * Math.PI - Math.PI / 2;
    const moonAngle = sunAngle + Math.PI;
    const arcRadius = centerY * 0.7;
    
    const sunTop = centerY - arcRadius * Math.sin(sunAngle);
    const sunLeft = 50 + 35 * Math.cos(sunAngle);
    const moonTop = centerY - arcRadius * Math.sin(moonAngle);
    const moonLeft = 50 + 35 * Math.cos(moonAngle);
    
    return {
      sun: {
        top: `${sunTop}px`,
        left: `${sunLeft}%`,
        visible: sunTop < centerY
      },
      moon: {
        top: `${moonTop}px`,
        left: `${moonLeft}%`,
        visible: moonTop < centerY
      }
    };
  };
  
  // Initialize sun/moon positions correctly from the start
  const initialPositions = calculateCelestialPositions(arcCenterY);
  const [sunPosition, setSunPosition] = useState(initialPositions.sun);
  const [moonPosition, setMoonPosition] = useState(initialPositions.moon);
  const [isNight, setIsNight] = useState(false);
  const [farMountainColor, setFarMountainColor] = useState('#9095b3'); // Default to Alto's day color
  const [middleMountainColor, setMiddleMountainColor] = useState('#7a7f9e'); // Default to Alto's day color
  const [closeMountainColor, setCloseMountainColor] = useState('#6a6b85'); // Default to Alto's day color
  const [skyColor, setSkyColor] = useState('#87ceeb');
  const [showCopied, setShowCopied] = useState(false);

  // Add useEffect to handle window dimensions
  useEffect(() => {
    const updateDimensions = () => {
      const newCenterY = window.innerHeight / 2;
      setArcCenterY(newCenterY);
      
      // Immediately set initial sun/moon positions to avoid janky effect
      const positions = calculateCelestialPositions(newCenterY);
      setSunPosition(positions.sun);
      setMoonPosition(positions.moon);
    };
    
    // Set initial dimensions
    updateDimensions();
    
    // Add event listener
    window.addEventListener('resize', updateDimensions);
    
    // Cleanup
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Effect for parallax scrolling
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fast sun/moon cycle, color, and phase
  useEffect(() => {
    let animationFrame: number;
    function updateCelestial() {
      const now = performance.now();
      // Get current time in milliseconds and modulo by 2 minutes (120000ms)
      const currentTimeMs = Date.now() % 120000;
      // Add the current time offset to the animation
      const fastMinutes = ((now / 1000 + currentTimeMs / 1000) % 120) / 120 * 1440;
      const dayProgress = fastMinutes / 1440;
      const sunAngle = dayProgress * 2 * Math.PI - Math.PI / 2;
      const moonAngle = sunAngle + Math.PI;
      const arcRadius = arcCenterY * 0.7;
      
      const newSunTop = `${arcCenterY - arcRadius * Math.sin(sunAngle)}px`;
      const newSunLeft = `${50 + 35 * Math.cos(sunAngle)}%`;
      const isSunVisible = arcCenterY - arcRadius * Math.sin(sunAngle) < arcCenterY;
      
      setSunPosition({
        top: newSunTop,
        left: newSunLeft,
        visible: isSunVisible
      });
      
      setMoonPosition({
        top: `${arcCenterY - arcRadius * Math.sin(moonAngle)}px`,
        left: `${50 + 35 * Math.cos(moonAngle)}%`,
        visible: arcCenterY - arcRadius * Math.sin(moonAngle) < arcCenterY
      });
      
      // Night detection
      const hour = Math.floor(fastMinutes / 60);
      setIsNight(hour < 6 || hour >= 20);
      
      // Mountain and tree colors based on sun position
      const sunY = parseFloat(newSunTop);
      const sunRadius = 48;
      const horizonY = arcCenterY;
      let sunOpacity = 1;
      if (sunY + sunRadius > horizonY) {
        sunOpacity = 0;
      } else if (sunY + sunRadius > horizonY - sunRadius * 2) {
        sunOpacity = 1 - ((sunY + sunRadius - (horizonY - sunRadius * 2)) / (sunRadius * 2));
      }

      // Mountain colors
      const farDay = '#9095b3', farDusk = '#eacb8a', farNight = '#2b304d';
      const midDay = '#7a7f9e', midDusk = '#e3a975', midNight = '#4a4e69';
      const closeDay = '#6a6b85', closeDusk = '#f5d6a1', closeNight = '#5a5d77';
      
      let far, mid, close;
      
      if (sunOpacity > 0.7) {
        far = lerpColor(farDay, farDusk, (1 - sunOpacity) / 0.3);
        mid = lerpColor(midDay, midDusk, (1 - sunOpacity) / 0.3);
        close = lerpColor(closeDay, closeDusk, (1 - sunOpacity) / 0.3);
      } else if (sunOpacity > 0.2) {
        far = lerpColor(farDusk, farNight, (0.7 - sunOpacity) / 0.5);
        mid = lerpColor(midDusk, midNight, (0.7 - sunOpacity) / 0.5);
        close = lerpColor(closeDusk, closeNight, (0.7 - sunOpacity) / 0.5);
      } else {
        far = farNight;
        mid = midNight;
        close = closeNight;
      }
      
      setFarMountainColor(far);
      setMiddleMountainColor(mid);
      setCloseMountainColor(close);
      
      animationFrame = requestAnimationFrame(updateCelestial);
    }
    animationFrame = requestAnimationFrame(updateCelestial);
    return () => cancelAnimationFrame(animationFrame);
  }, [arcCenterY]);

  useEffect(() => {
    const sunY = parseFloat(sunPosition.top);
    const sunRadius = 48;
    const horizonY = arcCenterY;
    let sunOpacity = 1;
    if (sunY + sunRadius > horizonY) {
      sunOpacity = 0;
    } else if (sunY + sunRadius > horizonY - sunRadius * 2) {
      sunOpacity = 1 - ((sunY + sunRadius - (horizonY - sunRadius * 2)) / (sunRadius * 2));
    }
    // Color stops
    const day = '#87ceeb';
    const dusk = '#e3a975';
    const night = '#1a1e33';
    let bg;
    if (sunOpacity > 0.7) {
      bg = lerpColor(day, dusk, (1 - sunOpacity) / 0.3);
    } else if (sunOpacity > 0.2) {
      bg = lerpColor(dusk, night, (0.7 - sunOpacity) / 0.5);
    } else {
      bg = night;
    }
    setSkyColor(bg);
  }, [sunPosition, arcCenterY]);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText('sahil003akhtar@gmail.com');
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy email:', err);
    }
  };

  return (
    <div className="relative min-h-[200vh] overflow-x-hidden">
      {/* Sky Background - color based on sun fade */}
      <div
        className="fixed inset-0 transition-colors duration-1000"
        style={{ zIndex: -2, backgroundColor: skyColor }}
      />

      {/* Star Field - Rendered as a separate component */}
      <StarField isNight={isNight} scrollY={scrollY} />

      {/* Sun/Moon - Rendered behind close mountain */}
      <div style={{ position: 'fixed', width: '100%', height: '100%', zIndex: 5, pointerEvents: 'none' }}>
        {/* Sun */}
        {(() => {
          const sunY = parseFloat(sunPosition.top);
          const sunRadius = 48;
          const horizonY = arcCenterY;
          let sunOpacity = 1;
          if (sunY + sunRadius > horizonY) {
            sunOpacity = 0;
          } else if (sunY + sunRadius > horizonY - sunRadius * 2) {
            sunOpacity = 1 - ((sunY + sunRadius - (horizonY - sunRadius * 2)) / (sunRadius * 2));
          }
          return (
            <div
              className={`absolute w-24 h-24 rounded-full transition-colors duration-1000 ${isNight ? 'bg-gray-300 shadow-[0_0_30px_10px_#d1d5db]' : 'bg-[#f5d6a1] shadow-[0_0_30px_10px_#f5d6a1]'}`}
              style={{
                top: sunPosition.top,
                left: sunPosition.left,
                transform: 'translate(-50%, -50%)',
                opacity: sunOpacity,
              }}
            />
          );
        })()}
        {/* Moon (thinner crescent) */}
        {(() => {
          const moonY = parseFloat(moonPosition.top);
          const moonRadius = 28;
          const horizonY = arcCenterY;
          let moonOpacity = 1;
          if (moonY + moonRadius > horizonY) {
            moonOpacity = 0;
          } else if (moonY + moonRadius > horizonY - moonRadius * 2) {
            moonOpacity = 1 - ((moonY + moonRadius - (horizonY - moonRadius * 2)) / (moonRadius * 2));
          }
          return (
            <div
              style={{
                position: 'absolute',
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: 'radial-gradient(ellipse at 60% 40%, #e0e7ef 80%, #b6b8c9 100%)',
                boxShadow: '0 0 32px 8px #b6b8c9cc',
                top: moonPosition.top,
                left: moonPosition.left,
                zIndex: 20,
                transform: 'translate(-50%, -50%)',
                overflow: 'hidden',
                opacity: moonOpacity,
              }}
              aria-label="Moon"
            >
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: '55%',
                  width: '50%',
                  height: '100%',
                  background: '#232946',
                  borderRadius: '50%',
                  boxShadow: '0 0 32px 8px #232946',
                  opacity: 0.85,
                }}
              />
            </div>
          );
        })()}
      </div>

      {/* Mountain Background */}
      <div className="fixed bottom-0 left-0 w-full h-[70vh] z-0">
        {/* Far Mountains */}
        <div
          className={`absolute bottom-0 w-full h-[60vh] transition-colors duration-1000`}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '60vh',
            clipPath: "polygon(0% 100%, 100% 100%, 100% 30%, 85% 25%, 70% 28%, 50% 20%, 30% 28%, 15% 25%, 0% 30%)",
            backgroundColor: farMountainColor,
            transform: `translateY(${scrollY * 0.1}px)`,
          }}
        >
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
            clipPath: "polygon(0% 100%, 100% 100%, 100% 45%, 80% 40%, 60% 43%, 40% 35%, 20% 43%, 0% 40%)",
            backgroundColor: middleMountainColor,
            transform: `translateY(${scrollY * 0.2}px)`
          }}
        >
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
            clipPath: "polygon(0% 100%, 100% 100%, 100% 55%, 90% 50%, 75% 53%, 60% 45%, 45% 53%, 30% 50%, 15% 53%, 0% 50%)",
            backgroundColor: closeMountainColor,
            transform: `translateY(${scrollY * 0.3}px)`,
            zIndex: 10,
          }}
        >
          <MountainTrees mountainColor={closeMountainColor} mountainHeight="40vh" scrollFactor={0.3} treeZIndex={17} />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-20 pt-32 px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1
              className="text-5xl md:text-6xl font-bold mb-6 text-white drop-shadow-md"
              style={{
                transform: `translateY(${scrollY * 0.1}px)`,
                opacity: 1 - (scrollY * 0.002)
              }}
            >
              Sahil Akhtar
            </h1>
            <p
              className="text-xl md:text-2xl text-gray-200 mb-12 drop-shadow-sm"
              style={{
                transform: `translateY(${scrollY * 0.15}px)`,
                opacity: 1 - (scrollY * 0.002)
              }}
            >
              Drowning, wishing it was headfirst.
            </p>
            <p>
              Scroll down.
            </p>
          </div>
        </div>
      </div>

      {/* Bouncing Arrow */}
      <div 
        className="fixed bottom-12 left-1/2 transform -translate-x-1/2 z-30"
        style={{
          opacity: Math.max(0, 1 - (scrollY * 0.005))
        }}
      >
        <div className="w-12 h-12 rounded-full border-2 border-white/30 flex items-center justify-center">
          <div className="animate-bounce">
            <svg 
              className="w-6 h-6 text-white" 
              fill="none" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
          </div>
        </div>
      </div>

      {/* Main Content Sections */}
      <div className="relative z-20 mt-[100vh]">
        {/* Navigation Cards */}
        <div className="px-4 md:px-8 mb-32">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link
                href="/projects"
                className="p-6 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-all duration-300 shadow-lg hover:shadow-xl border border-white/20"
              >
                <h2 className="text-xl font-semibold mb-2 text-white">Projects [WIP]</h2>
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
                <h2 className="text-xl font-semibold mb-2 text-white">Notes [WIP]</h2>
                <p className="text-gray-200">Technical notes and course reflections</p>
              </Link>
            </div>
          </div>
        </div>

        {/* About Me Section */}
        <div className="px-4 md:px-8 mb-32">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold mb-6 text-white">About Me</h2>
                <p className="text-lg text-gray-200 mb-4">
                  {/* I&apos;m a passionate developer and lifelong learner with a keen interest in technology and philosophy. 
                  My journey in tech has led me through various domains, from web development to artificial intelligence. */}
                  I&apos;m a sophomore at MIT majoring in Physics and Computer Science from Kolkata, India. I am passionate about Machine Learning, Music, Philosophy and Teaching. 
                </p>
                <p className="text-lg text-gray-200 mb-4">
                  {/* When I&apos;m not coding, you can find me exploring philosophical concepts, reading about emerging technologies, 
                  or experimenting with new ideas. I believe in the power of continuous learning and sharing knowledge with others. */}
                  In my free time, I can be found beatboxing, singing or chatting with friends about topics of questionable importance. 
                </p>
                <p className="text-lg text-gray-200">
                  {/* My goal is to create meaningful solutions that make a positive impact while pushing the boundaries of what&apos;s possible. */}
                  I deeply care about the truth. If anything, I wish to find out what makes us intelligent and conscious.
                </p>
                <p className="text-lg text-gray-200 mt-4">
                  <a 
                    href="/sahil_resume.pdf" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-white hover:text-gray-300 underline underline-offset-4 transition-colors duration-200"
                  >
                    You can find a copy of my resume here.
                  </a>
                </p>
              </div>
              <div className="relative">
                <div className="aspect-square rounded-lg overflow-hidden bg-white/10 backdrop-blur-sm border border-white/20">
                  <img
                    src="/images/sahil.jpg"
                    alt="Sahil Akhtar"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="px-4 md:px-8 mb-32">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-12 text-white text-center">Get in Touch</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <button
                onClick={handleCopyEmail}
                className="p-6 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-all duration-300 shadow-lg hover:shadow-xl border border-white/20 text-center relative"
              >
                <svg className="w-8 h-8 mx-auto mb-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <h3 className="text-xl font-semibold mb-2 text-white">Email</h3>
                <p className="text-gray-200">sahil003akhtar@gmail.com</p>
                {showCopied && (
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-3 py-1 rounded text-sm whitespace-nowrap">
                    Copied to clipboard!
                  </div>
                )}
              </button>
              <a
                href="https://github.com/woodpulp003"
                target="_blank"
                rel="noopener noreferrer"
                className="p-6 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-all duration-300 shadow-lg hover:shadow-xl border border-white/20 text-center"
              >
                <svg className="w-8 h-8 mx-auto mb-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                <h3 className="text-xl font-semibold mb-2 text-white">GitHub</h3>
                <p className="text-gray-200">@woodpulp003</p>
              </a>
              <a
                href="https://linkedin.com/in/sahil003"
                target="_blank"
                rel="noopener noreferrer"
                className="p-6 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-all duration-300 shadow-lg hover:shadow-xl border border-white/20 text-center"
              >
                <svg className="w-8 h-8 mx-auto mb-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
                <h3 className="text-xl font-semibold mb-2 text-white">LinkedIn</h3>
                <p className="text-gray-200">in/sahil003</p>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
