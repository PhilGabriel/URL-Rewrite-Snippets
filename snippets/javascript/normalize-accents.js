/**
 * Normalize accented characters to their plain ASCII base characters
 * using Unicode Normalization Form D (NFD).
 *
 * Characters like é, è, ê, á, à, ç, ñ, æ, œ are reduced to their
 * base letters by decomposing them and stripping the combining marks.
 *
 * Special ligatures (æ, œ) that cannot be decomposed via NFD are
 * handled explicitly before normalization.
 *
 * @param {string} input - The string to normalize.
 * @returns {string}
 *
 * @example
 * normalizeAccents('Crème brûlée') // 'Creme brulee'
 * normalizeAccents('Ñoño')         // 'Nono'
 */
export function normalizeAccents(input) {
  const ligatures = {
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
