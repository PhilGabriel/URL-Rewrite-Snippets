/**
 * Create a clean, readable URL slug from an arbitrary string.
 *
 * This function composes all individual snippets into a full slug pipeline:
 *   1. Replace German umlauts (ä -> ae, ö -> oe, ü -> ue, ß -> ss/sz)
 *   2. Normalize accented characters (é -> e, ç -> c, …)
 *   3. Apply custom character replacements (& -> und, + -> plus, …)
 *   4. Remove remaining special characters
 *   5. Collapse whitespace and separators into single hyphens
 *   6. Enforce lowercase
 *   7. Optionally truncate to maxLength (cuts at a hyphen boundary)
 *   8. Optionally append a short hash for duplicate prevention
 *
 * @param {string} input
 * @param {{
 *   locale?: 'de' | 'en' | 'auto',
 *   separator?: string,
 *   lowercase?: boolean,
 *   appendHash?: boolean,
 *   hashLength?: number,
 *   hashSeed?: string | number,
 *   sharpS?: 'ss' | 'sz',
 *   replacements?: Record<string, string>,
 *   maxLength?: number
 * }} [options]
 * @returns {string}
 *
 * @example
 * createReadableSlug('Schöne Grüße aus Köln!')
 * // 'schoene-gruesse-aus-koeln'
 *
 * createReadableSlug('Schöne Grüße aus Köln!', { appendHash: true })
 * // 'schoene-gruesse-aus-koeln-a1b2c3'
 *
 * createReadableSlug('Maß & Mitte', { sharpS: 'sz', replacements: { '&': 'und' } })
 * // 'masz-und-mitte'
 */

import { replaceGermanUmlauts } from './replace-german-umlauts.js';
import { normalizeAccents } from './normalize-accents.js';
import { removeSpecialChars } from './remove-special-chars.js';
import { collapseDashes } from './collapse-dashes.js';
import { appendShortHash } from './append-short-hash.js';

const DEFAULT_REPLACEMENTS_DE = {
  '&': 'und',
  '+': 'plus',
  '@': 'at',
  '%': 'prozent',
};

const DEFAULT_REPLACEMENTS_EN = {
  '&': 'and',
  '+': 'plus',
  '@': 'at',
  '%': 'percent',
};

export function createReadableSlug(input, options = {}) {
  const {
    locale = 'de',
    separator = '-',
    lowercase = true,
    appendHash = false,
    hashLength = 6,
    hashSeed,
    sharpS = 'ss',
    replacements,
    maxLength,
  } = options;

  const defaultReplacements =
    locale === 'en' ? DEFAULT_REPLACEMENTS_EN : DEFAULT_REPLACEMENTS_DE;

  const mergedReplacements = { ...defaultReplacements, ...(replacements ?? {}) };

  let slug = input;

  slug = replaceGermanUmlauts(slug, { preserveCase: true, sharpS });
  slug = normalizeAccents(slug);
  slug = removeSpecialChars(slug, { replacements: mergedReplacements });

  if (lowercase) {
    slug = slug.toLowerCase();
  }

  slug = collapseDashes(slug);

  if (separator !== '-') {
    slug = slug.replace(/-/g, separator);
  }

  if (maxLength && slug.length > maxLength) {
    slug = slug.slice(0, maxLength).replace(/-[^-]*$/, '');
    if (!slug) slug = input.slice(0, maxLength).replace(/[^a-z0-9]/gi, '');
  }

  if (appendHash) {
    slug = appendShortHash(slug, { length: hashLength, seed: hashSeed });
  }

  return slug;
}
