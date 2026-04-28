/**
 * Remove or replace special characters so only letters, digits,
 * and hyphens remain.
 *
 * Configurable replacements allow you to translate characters like
 * &, +, or @ into readable words before stripping everything else.
 *
 * @param {string} input - The string to process.
 * @param {{ replacements?: Record<string, string>, locale?: 'de' | 'en' }} [options]
 * @returns {string}
 *
 * @example
 * removeSpecialChars('Design & Entwicklung')
 * // 'Design  Entwicklung'  (& stripped; use replacements to keep 'und')
 *
 * removeSpecialChars('Design & Entwicklung', { replacements: { '&': 'und' } })
 * // 'Design und Entwicklung'
 *
 * removeSpecialChars('E-Mail@Work', { replacements: { '@': 'at' } })
 * // 'E-Mailat-Work'  (@ -> 'at', special chars gone)
 */
export function removeSpecialChars(input, options = {}) {
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
