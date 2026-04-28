/**
 * Normalize separators: turn spaces, underscores and slashes into hyphens,
 * collapse consecutive hyphens into one, and strip leading/trailing hyphens.
 *
 * @param {string} input - The string to process.
 * @returns {string}
 *
 * @example
 * collapseDashes('hello   world')           // 'hello-world'
 * collapseDashes('Produkt / Kategorie')      // 'Produkt---Kategorie' -> 'Produkt-Kategorie'
 * collapseDashes('--leading-and-trailing--') // 'leading-and-trailing'
 */
export function collapseDashes(input) {
  return input
    .replace(/[\s_/\\]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-+|-+$/g, '');
}
