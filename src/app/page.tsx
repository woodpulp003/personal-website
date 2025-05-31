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

// Component to render the star field only on the client
const StarField = ({ isNight, scrollY }: { isNight: boolean, scrollY: number }) => {
  const [stars, setStars] = useState<Array<{ id: number, style: CSSProperties }>>([]);

  // Effect to generate stars only on the client after mount
  useEffect(() => {
    const generatedStars = Array.from({ length: 350 }).map((_, i) => {
      const size = Math.random() * 1.5 + 0.5;
      return {
        id: i,
        style: {
          width: `${size}px`,
          height: `${size}px`,
          top: `${Math.pow(Math.random(), 1.5) * 100}%`, // more stars near horizon
          left: `${Math.random() * 100}%`,
          opacity: Math.random() * 0.7 + 0.3,
          animation: `twinkle ${Math.random() * 5 + 5}s ease-in-out infinite alternate`,
          filter: 'blur(0.5px)',
        }
      };
    });
    setStars(generatedStars);
  }, []);

  // Render stars only if it's night and the stars array is populated
  if (!isNight || stars.length === 0) {
    return null; // Don't render stars if not night or not yet generated
  }

  return (
    <div className="absolute inset-0 z-[-2] pointer-events-none" style={{ opacity: 1 - (scrollY * 0.001) }}>
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
        position: 'absolute' as CSSProperties['position'],
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
  const [sunPosition, setSunPosition] = useState({ top: '16px', left: '50%', visible: false });
  const [moonPosition, setMoonPosition] = useState({ top: '16px', left: '50%', visible: false });
  const [isNight, setIsNight] = useState(false);
  const [farMountainColor, setFarMountainColor] = useState('#9095b3'); // Default to Alto's day color
  const [middleMountainColor, setMiddleMountainColor] = useState('#7a7f9e'); // Default to Alto's day color
  const [closeMountainColor, setCloseMountainColor] = useState('#6a6b85'); // Default to Alto's day color

  const [farTreeColor, setFarTreeColor] = useState('bg-alto-tree-day');
  const [middleTreeColor, setMiddleTreeColor] = useState('bg-alto-tree-day');
  const [closeTreeColor, setCloseTreeColor] = useState('bg-alto-tree-day');

  const [skyColor, setSkyColor] = useState('#87ceeb');
  const [arcCenterY, setArcCenterY] = useState(400); // Default value

  // Add useEffect to handle window dimensions
  useEffect(() => {
    const updateDimensions = () => {
      setArcCenterY(window.innerHeight / 2);
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
      const fastMinutes = ((now / 1000) % 120) / 120 * 1440;
      const dayProgress = fastMinutes / 1440;
      const sunAngle = dayProgress * 2 * Math.PI - Math.PI / 2;
      const moonAngle = sunAngle + Math.PI;
      const arcRadius = arcCenterY * 0.7;
      
      setSunPosition({
        top: `${arcCenterY - arcRadius * Math.sin(sunAngle)}px`,
        left: `${50 + 35 * Math.cos(sunAngle)}%`,
        visible: arcCenterY - arcRadius * Math.sin(sunAngle) < arcCenterY
      });
      
      setMoonPosition({
        top: `${arcCenterY - arcRadius * Math.sin(moonAngle)}px`,
        left: `${50 + 35 * Math.cos(moonAngle)}%`,
        visible: arcCenterY - arcRadius * Math.sin(moonAngle) < arcCenterY
      });
      
      // Night detection
      const hour = Math.floor(fastMinutes / 60);
      setIsNight(hour < 6 || hour >= 20);
      // Mountain and tree colors (unchanged)
      let farMountainHex = '#9095b3', middleMountainHex = '#7a7f9e', closeMountainHex = '#6a6b85';
      if (hour >= 0 && hour < 6) { farMountainHex = '#2b304d'; middleMountainHex = '#4a4e69'; closeMountainHex = '#5a5d77'; }
      else if (hour >= 6 && hour < 8) { farMountainHex = '#e3a975'; middleMountainHex = '#eacb8a'; closeMountainHex = '#f5d6a1'; }
      else if (hour >= 17 && hour < 20) { farMountainHex = '#fb8b24'; middleMountainHex = '#ffb703'; closeMountainHex = '#f5d6a1'; }
      else if (hour >= 20) { farMountainHex = '#2b304d'; middleMountainHex = '#4a4e69'; closeMountainHex = '#5a5d77'; }
      setFarMountainColor(farMountainHex);
      setMiddleMountainColor(middleMountainHex);
      setCloseMountainColor(closeMountainHex);
      let treeColor = 'bg-alto-tree-day';
      if (hour >= 0 && hour < 6) treeColor = 'bg-alto-tree-night';
      else if (hour >= 6 && hour < 8) treeColor = 'bg-alto-tree-dawn';
      else if (hour >= 17 && hour < 20) treeColor = 'bg-alto-tree-dusk';
      else if (hour >= 20) treeColor = 'bg-alto-tree-night';
      setFarTreeColor(treeColor); setMiddleTreeColor(treeColor); setCloseTreeColor(treeColor);
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
    // Mountain color stops
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
  }, [sunPosition, arcCenterY]);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Sky Background - color based on sun fade */}
      <div
        className="fixed inset-0 transition-colors duration-1000"
        style={{ zIndex: -1, backgroundColor: skyColor }}
      />

      {/* Star Field - Rendered as a separate component */}
      <StarField isNight={isNight} scrollY={scrollY} />

      {/* Sun/Moon - Rendered behind close mountain */}
      <div style={{ position: 'absolute', width: '100%', height: '100%', zIndex: 5, pointerEvents: 'none' }}>
        {/* Sun */}
        {(() => {
          const sunY = parseFloat(sunPosition.top);
          const sunRadius = 48; // px (half of w-24)
          const horizonY = arcCenterY; // middle of the page
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
                transform: `translate(-50%, ${scrollY * 0.2}px)`,
                opacity: sunOpacity * (1 - (scrollY * 0.003)),
              }}
            />
          );
        })()}
        {/* Moon (thinner crescent) */}
        {(() => {
          const moonY = parseFloat(moonPosition.top);
          const moonRadius = 28; // px (half of 56px)
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
              {/* Thinner crescent mask */}
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
            transform: `translateY(${scrollY * 0.3}px)`,
            zIndex: 10,
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
