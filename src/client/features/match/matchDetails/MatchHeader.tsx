'use client';

import { memo } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const MatchHeader = memo(function MatchHeader() {
  const router = useRouter();

  return (
    <div className="relative">
      <h1 className="text-xl sm:text-2xl font-bold text-center">Détails du match</h1>
      <Button
        variant="outline"
        onClick={() => router.push('/dashboard/matches')}
        className="flex items-center gap-2 w-fit mt-4 mx-auto"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour aux matches
      </Button>
    </div>
  );
});
