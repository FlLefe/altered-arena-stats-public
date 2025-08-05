import type { PrismaClient } from '@prisma/client';

// Global types for UUIDs
declare global {
  var prisma: PrismaClient | undefined;

  // Simple types for UUIDs
  type UUID = string;
  type MatchId = string;
  type GameId = string;
}

export {};
