'use client';

import './globals.css';
import Navigation from "../components/Navigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black">
        <div>
          <Navigation />
          <main className="min-h-screen">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
