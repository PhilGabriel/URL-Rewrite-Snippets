/**
 * Normalize accented characters to their plain ASCII base characters
 * using Unicode Normalization Form D (NFD).
 *
 * Ligatures that cannot be decomposed via NFD (æ, œ, ø, …) are
 * mapped explicitly before normalization.
 *
 * @example
 * normalizeAccents('Crème brûlée') // 'Creme brulee'
 * normalizeAccents('Ñoño')         // 'Nono'
 * normalizeAccents('Ærøskøbing')   // 'AEroskøbing' -> 'AEroskobing'
 */
export function normalizeAccents(input: string): string {
  const ligatures: Record<string, string> = {
    æ: 'ae',
    Æ: 'AE',
    œ: 'oe',
    Œ: 'OE',
    ø: 'o',
    Ø: 'O',
    ð: 'd',
    Ð: 'D',
    þ: 'th',
    Þ: 'TH',
    ł: 'l',
    Ł: 'L',
  };

  const withLigatures = input.replace(
    /[æÆœŒøØðÐþÞłŁ]/g,
    (char) => ligatures[char] ?? char,
  );

  return withLigatures
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}
