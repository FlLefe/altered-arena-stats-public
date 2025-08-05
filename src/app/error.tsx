'use client';

import Link from 'next/link';

export default function ErrorPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-background px-4 text-center">
      <h1 className="text-3xl font-bold mb-4">Une erreur est survenue</h1>
      <Link href="/" className="text-primary hover:underline">
        {/* eslint-disable-next-line react/no-unescaped-entities */}
        Retour à l'accueil
      </Link>
    </main>
  );
}
