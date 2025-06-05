'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import './globals.css';
import Navigation from "../components/Navigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <html lang="en">
      <body>
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <Navigation />
            <main className="min-h-screen">
              {children}
            </main>
          </motion.div>
        </AnimatePresence>
      </body>
    </html>
  );
}
