import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'RepoPulse | Git Health & Conventional Commits Auditor',
  description:
    'Real-time Git repository audit dashboard and Conventional Commits compliance engine powered by @nirajsatam/git-commit-audit.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-indigo-500/30 selection:text-indigo-200 font-sans">
        {children}
      </body>
    </html>
  );
}
