// Prefix list
const PREFIXES = [
  'Shadow',
  'Blade',
  'Phoenix',
  'Wolf',
  'Dragon',
  'Eagle',
  'Tiger',
  'Lion',
  'Ghost',
  'Viper',
  'Cobra',
  'Hawk',
  'Falcon',
  'Raven',
  'Storm',
  'Thunder',
  'Fire',
  'Ice',
  'Dark',
  'Light',
  'Night',
  'Day',
  'Star',
  'Moon',
  'Sun',
  'Crystal',
  'Steel',
  'Iron',
  'Gold',
  'Silver',
  'Bronze',
  'Diamond',
  'Ruby',
  'Emerald',
  'Sapphire',
  'Jade',
  'Onyx',
  'Obsidian',
  'Granite',
  'Marble',
  'Frost',
  'Flame',
  'Wind',
  'Earth',
  'Water',
  'Lightning',
  'Void',
  'Chaos',
  'Order',
  'Justice',
  'Freedom',
  'Power',
  'Might',
  'Force',
  'Energy',
  'Spirit',
  'Soul',
  'Mind',
  'Heart',
  'Fist',
  'Hand',
  'Eye',
  'Fang',
  'Claw',
  'Wing',
  'Tail',
  'Horn',
  'Spike',
  'Shield',
  'Sword',
  'Axe',
  'Bow',
  'Arrow',
  'Spear',
  'Mace',
  'Hammer',
  'Dagger',
  'Knife',
  'Blade',
  'Edge',
  'Point',
  'Tip',
];

/**
 * Generates a random alias for anonymization
 * Format: [Prefix][1-4 digits]
 * Examples: Shadow42, Blade789, Phoenix1234
 */
export function generateAnonymousAlias(): string {
  const prefix = PREFIXES[Math.floor(Math.random() * PREFIXES.length)];
  const numbers = Math.floor(Math.random() * 9999) + 1; // 1 à 9999
  return `${prefix}${numbers}`;
}

/**
 * Verify if an alias is anonymized (contains digits at the end)
 */
export function isAnonymousAlias(alias: string): boolean {
  return /^[A-Za-z]+\d+$/.test(alias);
}

/**
 * Generates a unique alias by checking if it doesn't already exist
 */
export async function generateUniqueAnonymousAlias(
  checkExists: (alias: string) => Promise<boolean>,
): Promise<string> {
  let attempts = 0;
  const maxAttempts = 50;

  while (attempts < maxAttempts) {
    const alias = generateAnonymousAlias();
    const exists = await checkExists(alias);

    if (!exists) {
      return alias;
    }

    attempts++;
  }

  // Fallback with timestamp if too many collisions
  const prefix = PREFIXES[Math.floor(Math.random() * PREFIXES.length)];
  const timestamp = Date.now().toString().slice(-4);
  return `${prefix}${timestamp}`;
}
