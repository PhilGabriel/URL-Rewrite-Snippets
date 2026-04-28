/**
 * Replace German umlauts and the sharp s (ß) with their ASCII equivalents.
 *
 * @param {string} input - The string to process.
 * @param {{ preserveCase?: boolean, sharpS?: 'ss' | 'sz', uppercaseMode?: 'preserve' | 'lower' }} [options]
 * @returns {string}
 *
 * @example
 * replaceGermanUmlauts('Schöne Grüße')         // 'Schoene Gruesse'
 * replaceGermanUmlauts('Schöne Grüße', { preserveCase: false })  // 'schoene-gruesse' (after full slug process)
 * replaceGermanUmlauts('Maßstab', { sharpS: 'sz' })              // 'Maszstab'
 */
export function replaceGermanUmlauts(input, options = {}) {
  const { preserveCase = false, sharpS = 'ss', uppercaseMode = 'lower' } = options;

  const map = {
    ä: 'ae',
    ö: 'oe',
    ü: 'ue',
    ß: sharpS,
    Ä: uppercaseMode === 'lower' ? 'ae' : 'AE',
    Ö: uppercaseMode === 'lower' ? 'oe' : 'OE',
    Ü: uppercaseMode === 'lower' ? 'ue' : 'UE',
  };

  let result = input.replace(/[äöüßÄÖÜ]/g, (char) => map[char] ?? char);

  if (!preserveCase) {
    result = result.toLowerCase();
  }

  return result;
}
