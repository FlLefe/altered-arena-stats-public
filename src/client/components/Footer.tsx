import React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="text-xs text-muted-foreground text-center py-6 border-t border-footer-border bg-footer mt-12 space-y-3 px-4">
      <p>© 2025 Altered Arena Stats</p>
      <p>
        Altered Arena Stats est un projet non officiel, indépendant des éditeurs ou ayants droit
        d&apos;Altered.
      </p>

      <div className="flex justify-center flex-wrap gap-x-4 gap-y-2">
        <Link href="/legal/mentions" className="hover:underline">
          Mentions légales
        </Link>
        <Link href="/legal/privacy" className="hover:underline">
          Politique de confidentialité
        </Link>
      </div>
    </footer>
  );
}
