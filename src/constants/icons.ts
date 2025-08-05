export const CustomIcons = {
  // Altered Factions
  Axiom: '\uE007',
  Bravos: '\uE008',
  Lyra: '\uE009',
  Ordis: '\uE00B',
  Muna: '\uE00A',
  Yzmir: '\uE00C',
  Altered: '\uE00F',
  BGA: '\uE010',
  Forest: '\uE037',
  Mountain: '\uE025',
  Water: '\uE02D',
  Exhaust: '\uE030',
  Anchor: '\uE031',
  Asleep: '\uE034',

  // User Interface
  Close: '\uE029',
  Plus: '\uE03A',
  Target: '\uE015',
  Shield: '\uE017',
  Reserve: '\uE024',
  Hand: '\uE023',
  Import: '\uE027',
  Pen: '\uE02E',
  Infinity: '\uE02F',
  Globe: '\uE038',
  Trophy: '\uE039',

  // Actions
  ArrowRight: '\uE026',

  // Game
  Card: '\uE00E',
  Orb: '\uE012',
  Pipe: '\uE013',
  Chair: '\uE014',
  Window: '\uE035',
  Brackets: '\uE036',

  // Visuals
  Swirl: '\uE028',
  Blob: '\uE00D',

  // Numbers
  Number0: '\uE022',
  Number1: '\uE01B',
  Number2: '\uE01A',
  Number3: '\uE019',
  Number4: '\uE020',
  Number5: '\uE01C',
  Number6: '\uE01E',
  Number7: '\uE01D',
  Number9: '\uE021',
} as const;

export type IconName = keyof typeof CustomIcons;

export function getIcon(name: IconName): string {
  return CustomIcons[name];
}

export function isValidIcon(name: string): name is IconName {
  return name in CustomIcons;
}

// Function to get the icon of a faction
export function getFactionIcon(factionName: string): string {
  const iconName = factionName as IconName;
  return isValidIcon(iconName) ? getIcon(iconName) : '?';
}

// Mapping factions to their icons
export const FactionIcons = {
  Axiom: getIcon('Axiom'),
  Bravos: getIcon('Bravos'),
  Lyra: getIcon('Lyra'),
  Muna: getIcon('Muna'),
  Ordis: getIcon('Ordis'),
  Yzmir: getIcon('Yzmir'),
} as const;
