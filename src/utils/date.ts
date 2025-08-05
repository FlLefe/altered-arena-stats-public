/**
 * Convert a date string to a Date object or null if the string is empty/invalid
 * @param dateString - The date string to convert
 * @returns Date | null
 */
export function parseDateString(dateString: string | undefined | null): Date | null {
  if (!dateString || typeof dateString !== 'string' || dateString.trim() === '') {
    return null;
  }

  const date = new Date(dateString);
  return isNaN(date.getTime()) ? null : date;
}

/**
 * Format a date in french
 * @param date - The date to format
 * @returns The formatted date in french
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

/**
 * Validate a date in french format DD-MM-YYYY
 * @param dateString - The date string to validate
 * @returns true if the date is valid and in the correct format
 */
export function isValidFrenchDate(dateString: string): boolean {
  // French format DD-MM-YYYY (exactly 2 digits for day and month)
  const frenchDateRegex = /^(\d{2})-(\d{2})-(\d{4})$/;
  const match = dateString.match(frenchDateRegex);

  if (!match) return false;

  const [, day, month, year] = match;
  const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));

  return (
    date instanceof Date &&
    !isNaN(date.getTime()) &&
    date.getDate() === parseInt(day) &&
    date.getMonth() === parseInt(month) - 1 &&
    date.getFullYear() === parseInt(year)
  );
}

/**
 * Convertit une date française (DD-MM-YYYY) en objet Date
 * @param dateString - La chaîne de date au format français
 * @returns Date
 */
export function parseFrenchDate(dateString: string): Date {
  const [, day, month, year] = dateString.match(/^(\d{2})-(\d{2})-(\d{4})$/)!;
  return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
}
