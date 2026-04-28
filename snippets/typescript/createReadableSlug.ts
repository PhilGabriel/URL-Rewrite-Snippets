/**
 * Create a clean, readable URL slug from an arbitrary string.
 *
 * Full pipeline:
 *   1. Replace German umlauts (ä -> ae, ö -> oe, ü -> ue, ß -> ss/sz)
 *   2. Normalize accented characters (é -> e, ç -> c, …)
 *   3. Apply configurable character replacements (& -> und, + -> plus, …)
 *   4. Strip remaining special characters
 *   5. Collapse spaces / underscores / slashes into single hyphens
 *   6. Enforce lowercase
 *   7. Optionally truncate to maxLength at a hyphen boundary
 *   8. Optionally append a short hash for duplicate prevention
 */

import { replaceGermanUmlauts, UmlautOptions } from './replaceGermanUmlauts.js';
import { normalizeAccents } from './normalizeAccents.js';
import { removeSpecialChars } from './removeSpecialChars.js';
import { collapseDashes } from './collapseDashes.js';
import { appendShortHash } from './appendShortHash.js';

export interface SlugOptions {
  /** Language context for default symbol replacements. Default: 'de'. */
  locale?: 'de' | 'en' | 'auto';
  /** Separator character. Default: '-'. */
  separator?: string;
  /** Convert result to lowercase. Default: true. */
  lowercase?: boolean;
  /** Append a short hash suffix. Default: false. */
  appendHash?: boolean;
  /** Length of the hash suffix. Default: 6. */
  hashLength?: number;
  /** Seed for the hash (e.g. database ID). */
  hashSeed?: string | number;
  /** Replacement for ß. Default: 'ss'. */
  sharpS?: UmlautOptions['sharpS'];
  /** Custom character/string replacements applied before stripping. */
  replacements?: Record<string, string>;
  /** Truncate the slug (before hash) to this many characters. */
  maxLength?: number;
}

const DEFAULT_REPLACEMENTS_DE: Record<string, string> = {
  '&': 'und',
  '+': 'plus',
  '@': 'at',
  '%': 'prozent',
};

const DEFAULT_REPLACEMENTS_EN: Record<string, string> = {
  '&': 'and',
  '+': 'plus',
  '@': 'at',
  '%': 'percent',
};

/**
 * @example
 * createReadableSlug('Schöne Grüße aus Köln!')
 * // 'schoene-gruesse-aus-koeln'
 *
 * createReadableSlug('Schöne Grüße aus Köln!', { appendHash: true })
 * // 'schoene-gruesse-aus-koeln-a1b2c3'
 *
 * createReadableSlug('Maß & Mitte', { sharpS: 'sz', replacements: { '&': 'und' } })
 * // 'masz-und-mitte'
 *
 * createReadableSlug('100% Qualität!', { locale: 'de' })
 * // '100-prozent-qualitaet'
 */
export function createReadableSlug(input: string, options: SlugOptions = {}): string {
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

  const mergedReplacements: Record<string, string> = {
    ...defaultReplacements,
    ...(replacements ?? {}),
  };

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

  if (maxLength !== undefined && slug.length > maxLength) {
    const truncated = slug.slice(0, maxLength).replace(/-[^-]*$/, '');
    slug = truncated || slug.slice(0, maxLength).replace(/[^a-z0-9]/gi, '');
  }

  if (appendHash) {
    slug = appendShortHash(slug, { length: hashLength, seed: hashSeed });
  }

  return slug;
}
