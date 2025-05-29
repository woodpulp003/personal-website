'use client';

import { useEffect } from 'react';
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "../components/Navigation";

const inter = Inter({ subsets: ["latin"] });

// Define color stops for the 24-hour cycle (Hour: { from: hex, to: hex })
// These colors are muted and inspired by Alto\'s Adventure aesthetic
const colorStops = [
  { hour: 0, palette: { from: '#1a1e33', to: '#2b304d' } }, // Midnight (Black/Purplish)
  { hour: 4, palette: { from: '#2b304d', to: '#4a4e69' } }, // Late Night/Early Dawn Transition
  { hour: 6, palette: { from: '#eacb8a', to: '#e3a975' } }, // Dawn (Orange)
  { hour: 8, palette: { from: '#e3a975', to: '#87ceeb' } }, // Dawn to Morning Transition
  { hour: 12, palette: { from: '#87ceeb', to: '#b0e0e6' } }, // Noon (Muted White-ish/Light Blue)
  { hour: 17, palette: { from: '#b0e0e6', to: '#ffb703' } }, // Afternoon to Sunset Transition
  { hour: 19, palette: { from: '#ffb703', to: '#fb8b24' } }, // Sunset (Orange)
  { hour: 21, palette: { from: '#fb8b24', to: '#4a4e69' } }, // Sunset to Dusk Transition
  { hour: 23, palette: { from: '#4a4e69', to: '#1a1e33' } }, // Late Dusk to Midnight Transition
  { hour: 24, palette: { from: '#1a1e33', to: '#2b304d' } }, // Wrap around to Midnight (Same as hour 0, for calculation ease)
];

// Helper function to interpolate between two hex colors
const interpolateColor = (color1: string, color2: string, factor: number): string => {
  const hexToRgb = (hex: string) => {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return [r, g, b];
  };

  const rgbToHex = (rgb: number[]) => {
    return '#' + rgb.map(c => Math.round(c).toString(16).padStart(2, '0')).join('');
  };

  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  const interpolatedRgb = rgb1.map((c, i) => c + factor * (rgb2[i] - c));

  return rgbToHex(interpolatedRgb);
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  useEffect(() => {
    const updateBackground = () => {
      const now = new Date();
      const hour = now.getHours();
      const minute = now.getMinutes();
      const totalMinutes = hour * 60 + minute;

      let startStop = colorStops[0];
      let endStop = colorStops[0];
      let factor = 0;

      for (let i = 0; i < colorStops.length - 1; i++) {
        const currentStop = colorStops[i];
        const nextStop = colorStops[i + 1];

        let currentStopMinutes = currentStop.hour * 60;
        let nextStopMinutes = nextStop.hour * 60;
        let currentTotalMinutes = totalMinutes;

        // Handle wrap around for midnight (e.g., from 23:00 to 00:00)
        if (nextStopMinutes < currentStopMinutes) {
          nextStopMinutes += 24 * 60; // Treat next day stop as 24+ hours
          if (currentTotalMinutes < currentStopMinutes) {
            currentTotalMinutes += 24 * 60; // Treat current time as 24+ hours if past midnight
          }
        }

        if (currentTotalMinutes >= currentStopMinutes && currentTotalMinutes < nextStopMinutes) {
          startStop = currentStop;
          endStop = nextStop;
          const periodDuration = nextStopMinutes - currentStopMinutes;
          const elapsed = currentTotalMinutes - currentStopMinutes;
          factor = elapsed / periodDuration;
          break; // Found the correct interval
        }
         // Handle the specific case of the last interval before midnight wrap-around (23:00 to 00:00)
         // Check if the current time is within the last interval before midnight
        if (hour === colorStops[colorStops.length - 2].hour && nextStop.hour === 24) { // From 23:xx to 00:xx
            startStop = colorStops[colorStops.length - 2]; // 23:00 stop
            endStop = colorStops[colorStops.length - 1];   // 24:00 stop (same palette as 00:00)
            const startMinutes = startStop.hour * 60;
            const endMinutes = 24 * 60; // Treat end as 24:00 for calculation
            const periodDuration = endMinutes - startMinutes;
            const elapsed = totalMinutes - startMinutes; // totalMinutes is already adjusted for wrap around if needed
            factor = elapsed / periodDuration;
             if (factor >= 0 && factor <= 1) { // Ensure factor is within bounds due to potential edge cases
                 break; // Found the correct interval
            }
        }
      }

      // Interpolate colors
      const interpolatedFrom = interpolateColor(startStop.palette.from, endStop.palette.from, factor);
      const interpolatedTo = interpolateColor(startStop.palette.to, endStop.palette.to, factor);

      // Update CSS variables
      document.body.style.setProperty('--gradient-from', interpolatedFrom);
      document.body.style.setProperty('--gradient-to', interpolatedTo);
    };

    // Update immediately and then every minute
    updateBackground();
    const intervalId = setInterval(updateBackground, 60000); // Update every minute

    return () => clearInterval(intervalId);
  }, []); // Empty dependency array means this effect runs once on mount

  // Metadata can be defined as a constant here if not dynamic
  const metadata: Metadata = {
    title: "Sahil's Personal Website",
    description: "Personal website showcasing projects, thoughts, and technical notes",
  };

  return (
    <html lang="en">
      <head>
        <title>{metadata.title as string}</title>
        <meta name="description" content={metadata.description as string} />
      </head>
      <body className={inter.className}>
        <Navigation />
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
