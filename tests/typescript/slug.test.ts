/**
 * Tests for the TypeScript URL-Rewrite-Snippets.
 *
 * Run with:  npm run test:ts
 */

import { replaceGermanUmlauts } from '../../snippets/typescript/replaceGermanUmlauts.js';
import { normalizeAccents } from '../../snippets/typescript/normalizeAccents.js';
import { removeSpecialChars } from '../../snippets/typescript/removeSpecialChars.js';
import { collapseDashes } from '../../snippets/typescript/collapseDashes.js';
import { appendShortHash } from '../../snippets/typescript/appendShortHash.js';
import { createReadableSlug } from '../../snippets/typescript/createReadableSlug.js';

// ── replaceGermanUmlauts ────────────────────────────────────────────────────

describe('replaceGermanUmlauts (TS)', () => {
  test('replaces lowercase umlauts', () => {
    expect(replaceGermanUmlauts('ä ö ü')).toBe('ae oe ue');
  });

  test('replaces ß as ss by default', () => {
    expect(replaceGermanUmlauts('Maßstab')).toBe('massstab');
  });

  test('replaces ß as sz when configured', () => {
    expect(replaceGermanUmlauts('Maßstab', { sharpS: 'sz' })).toBe('maszstab');
  });

  test('lowercases uppercase umlauts by default', () => {
    expect(replaceGermanUmlauts('Ä Ö Ü')).toBe('ae oe ue');
  });

  test('preserves uppercase umlauts when uppercaseMode is preserve', () => {
    expect(replaceGermanUmlauts('Ä Ö Ü', { preserveCase: true, uppercaseMode: 'preserve' })).toBe(
      'AE OE UE',
    );
  });

  test('handles empty string', () => {
    expect(replaceGermanUmlauts('')).toBe('');
  });
});

// ── normalizeAccents ────────────────────────────────────────────────────────

describe('normalizeAccents (TS)', () => {
  test('normalizes French accents', () => {
    expect(normalizeAccents('crème brûlée')).toBe('creme brulee');
  });

  test('normalizes Spanish tilde', () => {
    expect(normalizeAccents('ñ')).toBe('n');
  });

  test('replaces æ ligature', () => {
    expect(normalizeAccents('æ')).toBe('ae');
  });

  test('replaces œ ligature', () => {
    expect(normalizeAccents('œ')).toBe('oe');
  });

  test('handles empty string', () => {
    expect(normalizeAccents('')).toBe('');
  });
});

// ── removeSpecialChars ──────────────────────────────────────────────────────

describe('removeSpecialChars (TS)', () => {
  test('removes punctuation', () => {
    expect(removeSpecialChars('hello!')).toBe('hello');
  });

  test('replaces & with custom word', () => {
    expect(removeSpecialChars('Design & Entwicklung', { replacements: { '&': 'und' } })).toBe(
      'Design und Entwicklung',
    );
  });

  test('handles string with only special chars', () => {
    expect(removeSpecialChars('!@#$%')).toBe('');
  });

  test('handles empty string', () => {
    expect(removeSpecialChars('')).toBe('');
  });
});

// ── collapseDashes ──────────────────────────────────────────────────────────

describe('collapseDashes (TS)', () => {
  test('replaces spaces with hyphens', () => {
    expect(collapseDashes('hello world')).toBe('hello-world');
  });

  test('removes leading and trailing hyphens', () => {
    expect(collapseDashes('--hello--')).toBe('hello');
  });

  test('collapses consecutive hyphens', () => {
    expect(collapseDashes('a---b')).toBe('a-b');
  });

  test('handles empty string', () => {
    expect(collapseDashes('')).toBe('');
  });
});

// ── appendShortHash ─────────────────────────────────────────────────────────

describe('appendShortHash (TS)', () => {
  test('appends a 6-character hash by default', () => {
    expect(appendShortHash('mein-artikel')).toMatch(/^mein-artikel-[0-9a-f]{6}$/);
  });

  test('hash is deterministic', () => {
    expect(appendShortHash('mein-artikel')).toBe(appendShortHash('mein-artikel'));
  });

  test('different seeds produce different hashes', () => {
    const a = appendShortHash('mein-artikel', { seed: 'id-1' });
    const b = appendShortHash('mein-artikel', { seed: 'id-2' });
    expect(a).not.toBe(b);
  });

  test('respects length option', () => {
    expect(appendShortHash('slug', { length: 4 })).toMatch(/^slug-[0-9a-f]{4}$/);
  });
});

// ── createReadableSlug ──────────────────────────────────────────────────────

describe('createReadableSlug (TS)', () => {
  test('converts German umlauts', () => {
    expect(createReadableSlug('Schöne Grüße aus Köln')).toBe('schoene-gruesse-aus-koeln');
  });

  test('converts ß to ss by default', () => {
    expect(createReadableSlug('Maßstab')).toBe('massstab');
  });

  test('converts ß to sz when configured', () => {
    expect(createReadableSlug('Maßstab', { sharpS: 'sz' })).toBe('maszstab');
  });

  test('handles accents', () => {
    expect(createReadableSlug('Crème brûlée')).toBe('creme-brulee');
  });

  test('handles special characters', () => {
    expect(createReadableSlug('100% Qualität!')).toBe('100-prozent-qualitaet');
  });

  test('handles empty string', () => {
    expect(createReadableSlug('')).toBe('');
  });

  test('handles string with only special chars', () => {
    expect(createReadableSlug('!!!')).toBe('');
  });

  test('appends hash when appendHash is true', () => {
    expect(createReadableSlug('Schöne Grüße aus Köln!', { appendHash: true })).toMatch(
      /^schoene-gruesse-aus-koeln-[0-9a-f]{6}$/,
    );
  });

  test('hash is stable across calls', () => {
    const a = createReadableSlug('Mein Artikel', { appendHash: true, hashSeed: 'id-1' });
    const b = createReadableSlug('Mein Artikel', { appendHash: true, hashSeed: 'id-1' });
    expect(a).toBe(b);
  });

  test('different hash seeds produce different results', () => {
    const a = createReadableSlug('Mein Artikel', { appendHash: true, hashSeed: 'id-1' });
    const b = createReadableSlug('Mein Artikel', { appendHash: true, hashSeed: 'id-2' });
    expect(a).not.toBe(b);
  });

  test('respects maxLength', () => {
    const result = createReadableSlug('Schöne Grüße aus Köln!', { maxLength: 15 });
    expect(result.length).toBeLessThanOrEqual(15);
  });

  test('applies custom replacements', () => {
    expect(
      createReadableSlug('Maß & Mitte', { sharpS: 'sz', replacements: { '&': 'und' } }),
    ).toBe('masz-und-mitte');
  });

  test('uses English replacements with locale en', () => {
    expect(createReadableSlug('Design & Development', { locale: 'en' })).toBe(
      'design-and-development',
    );
  });

  test('Über uns', () => {
    expect(createReadableSlug('Über uns')).toBe('ueber-uns');
  });

  test('Ärger mit Öl', () => {
    expect(createReadableSlug('Ärger mit Öl')).toBe('aerger-mit-oel');
  });
});
