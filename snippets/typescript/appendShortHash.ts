/**
 * Append a short, deterministic hash to a slug to prevent duplicate URLs.
 *
 * Uses FNV-1a 32-bit – fast, non-cryptographic, stable.
 * The hash contains only lowercase hex characters (URL-safe).
 * Pass a seed (e.g. database ID or UUID) to differentiate entries
 * with identical slugs.
 */

export interface HashOptions {
  /** Number of characters to use from the hash. Default: 6. */
  length?: number;
  /** Optional seed to make the hash unique per entry. */
  seed?: string | number;
}

/**
 * @example
 * appendShortHash('mein-artikel')
 * // 'mein-artikel-a1b2c3'
 *
 * appendShortHash('mein-artikel', { seed: 'db-id-42' })
 * // 'mein-artikel-9f4e2a'  (different hash due to seed)
 *
 * appendShortHash('produkt-name', { length: 8 })
 * // 'produkt-name-9f4e2a1b'
 */
export function appendShortHash(slug: string, options: HashOptions = {}): string {
  const { length = 6, seed = 0 } = options;

  const input = `${slug}::${seed}`;
  const hash = fnv1a32(input).toString(16).padStart(8, '0');
  const shortHash = hash.slice(0, length);

  return `${slug}-${shortHash}`;
}

/**
 * FNV-1a 32-bit hash (non-cryptographic, deterministic).
 */
function fnv1a32(str: string): number {
  let hash = 2166136261;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 16777619) >>> 0;
  }
  return hash;
}
