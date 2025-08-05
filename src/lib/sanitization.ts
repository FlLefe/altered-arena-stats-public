import DOMPurify from 'dompurify';

/**
 * Decodes HTML entities back to their original characters
 * @param input - The string with HTML entities
 * @returns The decoded string
 */
export function decodeHtmlEntities(input: string): string {
  if (typeof window === 'undefined') {
    // Server-side: decode using a simple replace method
    return input
      .replace(/&#x27;/g, "'")
      .replace(/&quot;/g, '"')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&#x2F;/g, '/');
  }

  // Client-side: decode HTML entities
  const textarea = document.createElement('textarea');
  textarea.innerHTML = input;
  return textarea.value;
}

/**
 * Sanitizes a string to remove malicious HTML
 * @param input - The string to sanitize
 * @returns The sanitized string
 */
export function sanitizeString(input: string): string {
  if (typeof window !== 'undefined') {
    // Client-side
    return DOMPurify.sanitize(input, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
  } else {
    // Server-side - basic fallback
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }
}

/**
 * Sanitizes an object with string properties
 * @param obj - The object to sanitize
 * @returns The object with sanitized strings
 */
export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
  const sanitized = { ...obj } as T;

  for (const [key, value] of Object.entries(sanitized)) {
    if (typeof value === 'string') {
      (sanitized as Record<string, unknown>)[key] = sanitizeString(value);
    } else if (typeof value === 'object' && value !== null) {
      (sanitized as Record<string, unknown>)[key] = sanitizeObject(
        value as Record<string, unknown>,
      );
    }
  }

  return sanitized;
}

/**
 * Specifically sanitize comments (allows basic tags)
 * @param comment - The comment to sanitize
 * @returns The sanitized comment
 */
export function sanitizeComment(comment: string): string {
  if (typeof window !== 'undefined') {
    return DOMPurify.sanitize(comment, {
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'br'],
      ALLOWED_ATTR: [],
    });
  } else {
    // Server-side - complete escaping
    return sanitizeString(comment);
  }
}
