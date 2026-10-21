import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Divyavani (v2.0) — AI-Powered Educational Doubt-Solving & Multi-Tab Chapter Workspace',
  description: 'Conceived by Vanshika & Divyanshi (Class IX-H). Double-Palette Block Architecture for Socratic doubt resolution and multi-tab chapter document reading.',
  keywords: ['Divyavani', 'Class 9 CBSE', 'Science Motion', 'Socratic Doubt Solver', 'NCERT Chapter Vault', 'Double-Palette UI'],
  authors: [{ name: 'Vanshika & Divyanshi (Class IX-H)' }, { name: 'Kushagr Rana' }],
  openGraph: {
    title: 'Divyavani — Your Doubt, Our Priority',
    description: 'Learn Better. Ask Freely. Understand Instantly. Socratic Doubt-Solving with Multi-Tab Chapter Document Workspace.',
    siteName: 'Divyavani Educational Platform',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="theme-color" content="#09090B" />
      </head>
      <body className="min-h-screen bg-obsidian text-alabaster antialiased selection:bg-royal selection:text-white">
        {children}
      </body>
    </html>
  );
}
