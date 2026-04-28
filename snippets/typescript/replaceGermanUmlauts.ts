/**
 * Replace German umlauts and the sharp s (ß) with their ASCII equivalents.
 */

export interface UmlautOptions {
  /** Keep the original casing of non-umlaut characters. Default: false (all lowercase). */
  preserveCase?: boolean;
  /** Replacement for ß: 'ss' (default) or 'sz'. */
  sharpS?: 'ss' | 'sz';
  /** How to handle uppercase umlauts Ä, Ö, Ü. Default: 'lower'. */
  uppercaseMode?: 'preserve' | 'lower';
}

/**
 * @example
 * replaceGermanUmlauts('Schöne Grüße')
 * // 'schoene gruesse'
 *
 * replaceGermanUmlauts('Maßstab', { sharpS: 'sz' })
 * // 'maszstab'
 *
 * replaceGermanUmlauts('Über', { preserveCase: true, uppercaseMode: 'preserve' })
 * // 'UEber'
 */
export function replaceGermanUmlauts(input: string, options: UmlautOptions = {}): string {
  const { preserveCase = false, sharpS = 'ss', uppercaseMode = 'lower' } = options;

  const map: Record<string, string> = {
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
