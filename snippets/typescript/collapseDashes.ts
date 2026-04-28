/**
 * Normalize separators in a string:
 *   - Spaces, underscores, forward- and back-slashes become hyphens.
 *   - Consecutive hyphens are collapsed into one.
 *   - Leading and trailing hyphens are removed.
 *
 * @example
 * collapseDashes('hello   world')            // 'hello-world'
 * collapseDashes('Produkt / Kategorie')       // 'Produkt-Kategorie'
 * collapseDashes('--leading-and-trailing--')  // 'leading-and-trailing'
 */
export function collapseDashes(input: string): string {
  return input
    .replace(/[\s_/\\]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-+|-+$/g, '');
}
