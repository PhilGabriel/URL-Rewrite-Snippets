/**
 * Remove or replace special characters so only letters, digits,
 * spaces, and hyphens remain.
 *
 * Apply optional `replacements` before stripping unknown characters –
 * this lets you turn & into "und" or "and" before it vanishes entirely.
 */

export interface SpecialCharOptions {
  /** Map of characters or strings to replace before stripping. */
  replacements?: Record<string, string>;
}

/**
 * @example
 * removeSpecialChars('Design & Entwicklung', { replacements: { '&': 'und' } })
 * // 'Design und Entwicklung'
 *
 * removeSpecialChars('100% Qualität!')
 * // '100 Qualitat'  (after accent normalization upstream)
 */
export function removeSpecialChars(input: string, options: SpecialCharOptions = {}): string {
  const { replacements = {} } = options;

  let result = input;

  for (const [from, to] of Object.entries(replacements)) {
    const escaped = from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    result = result.replace(new RegExp(escaped, 'g'), ` ${to} `);
  }

  result = result.replace(/[^a-zA-Z0-9\s-]/g, ' ');

  result = result.replace(/\s+/g, ' ').trim();

  return result;
}
