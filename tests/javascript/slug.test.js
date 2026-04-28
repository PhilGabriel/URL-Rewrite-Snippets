/**
 * Tests for the JavaScript URL-Rewrite-Snippets.
 *
 * Run with:  npm run test:js
 */

import { replaceGermanUmlauts } from '../../snippets/javascript/replace-german-umlauts.js';
import { normalizeAccents } from '../../snippets/javascript/normalize-accents.js';
import { removeSpecialChars } from '../../snippets/javascript/remove-special-chars.js';
import { collapseDashes } from '../../snippets/javascript/collapse-dashes.js';
import { appendShortHash } from '../../snippets/javascript/append-short-hash.js';
import { createReadableSlug } from '../../snippets/javascript/create-readable-slug.js';

// ── replaceGermanUmlauts ────────────────────────────────────────────────────

describe('replaceGermanUmlauts', () => {
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
    expect(replaceGermanUmlauts('Ä Ö Ü', { preserveCase: true, uppercaseMode: 'preserve' })).toBe('AE OE UE');
  });

  test('preserves case of non-umlaut characters when preserveCase is true', () => {
    expect(replaceGermanUmlauts('Schöne', { preserveCase: true })).toBe('Schoene');
  });

  test('handles empty string', () => {
    expect(replaceGermanUmlauts('')).toBe('');
  });

  test('handles string with no umlauts', () => {
    expect(replaceGermanUmlauts('hello world')).toBe('hello world');
  });

  test('full sentence', () => {
    expect(replaceGermanUmlauts('Schöne Grüße', { preserveCase: true })).toBe('Schoene Gruesse');
  });
});

// ── normalizeAccents ────────────────────────────────────────────────────────

describe('normalizeAccents', () => {
  test('normalizes French accents', () => {
    expect(normalizeAccents('crème brûlée')).toBe('creme brulee');
  });

  test('normalizes Spanish tilde', () => {
    expect(normalizeAccents('ñ')).toBe('n');
  });

  test('normalizes cedilla', () => {
    expect(normalizeAccents('ç')).toBe('c');
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

  test('leaves plain ASCII unchanged', () => {
    expect(normalizeAccents('hello world')).toBe('hello world');
  });
});

// ── removeSpecialChars ──────────────────────────────────────────────────────

describe('removeSpecialChars', () => {
  test('removes punctuation', () => {
    expect(removeSpecialChars('hello!')).toBe('hello');
  });

  test('replaces & with custom word', () => {
    expect(removeSpecialChars('Design & Entwicklung', { replacements: { '&': 'und' } })).toBe(
      'Design und Entwicklung',
    );
  });

  test('replaces + with plus', () => {
    expect(removeSpecialChars('A+B', { replacements: { '+': 'plus' } })).toBe('A plus B');
  });

  test('collapses multiple spaces', () => {
    expect(removeSpecialChars('hello   world')).toBe('hello world');
  });

  test('handles empty string', () => {
    expect(removeSpecialChars('')).toBe('');
  });

  test('handles string with only special chars', () => {
    expect(removeSpecialChars('!@#$%')).toBe('');
  });

  test('preserves hyphens', () => {
    expect(removeSpecialChars('e-mail')).toBe('e-mail');
  });
});

// ── collapseDashes ──────────────────────────────────────────────────────────

describe('collapseDashes', () => {
  test('replaces spaces with hyphens', () => {
    expect(collapseDashes('hello world')).toBe('hello-world');
  });

  test('collapses multiple spaces', () => {
    expect(collapseDashes('hello   world')).toBe('hello-world');
  });

  test('collapses slashes', () => {
    expect(collapseDashes('a / b / c')).toBe('a-b-c');
  });

  test('collapses underscores', () => {
    expect(collapseDashes('hello_world')).toBe('hello-world');
  });

  test('removes leading hyphens', () => {
    expect(collapseDashes('--hello')).toBe('hello');
  });

  test('removes trailing hyphens', () => {
    expect(collapseDashes('hello--')).toBe('hello');
  });

  test('collapses consecutive hyphens', () => {
    expect(collapseDashes('a---b')).toBe('a-b');
  });

  test('handles empty string', () => {
    expect(collapseDashes('')).toBe('');
  });
});

// ── appendShortHash ─────────────────────────────────────────────────────────

describe('appendShortHash', () => {
  test('appends a 6-character hash by default', () => {
    const result = appendShortHash('mein-artikel');
    expect(result).toMatch(/^mein-artikel-[0-9a-f]{6}$/);
  });

  test('hash is deterministic', () => {
    const a = appendShortHash('mein-artikel');
    const b = appendShortHash('mein-artikel');
    expect(a).toBe(b);
  });

  test('different seeds produce different hashes', () => {
    const a = appendShortHash('mein-artikel', { seed: 'id-1' });
    const b = appendShortHash('mein-artikel', { seed: 'id-2' });
    expect(a).not.toBe(b);
  });

  test('respects length option', () => {
    const result = appendShortHash('mein-artikel', { length: 8 });
    expect(result).toMatch(/^mein-artikel-[0-9a-f]{8}$/);
  });

  test('hash contains only URL-safe chars', () => {
    const result = appendShortHash('test-slug', { seed: 'abc' });
    expect(result).toMatch(/^[a-z0-9-]+$/);
  });

  test('known hash value for mein-artikel (seed: 0)', () => {
    expect(appendShortHash('mein-artikel')).toBe('mein-artikel-6cd56d');
  });
});

// ── createReadableSlug ──────────────────────────────────────────────────────

describe('createReadableSlug', () => {
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

  test('handles spaces', () => {
    expect(createReadableSlug('hello world')).toBe('hello-world');
  });

  test('handles special characters', () => {
    expect(createReadableSlug('100% Qualität!')).toBe('100-prozent-qualitaet');
  });

  test('collapses multiple separators', () => {
    expect(createReadableSlug('Produkt / Kategorie / Name')).toBe('produkt-kategorie-name');
  });

  test('handles empty string', () => {
    expect(createReadableSlug('')).toBe('');
  });

  test('handles string with only special chars', () => {
    expect(createReadableSlug('!!!')).toBe('');
  });

  test('appends hash when appendHash is true', () => {
    const result = createReadableSlug('Schöne Grüße aus Köln!', { appendHash: true });
    expect(result).toMatch(/^schoene-gruesse-aus-koeln-[0-9a-f]{6}$/);
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

  test('Ärger mit Öl', () => {
    expect(createReadableSlug('Ärger mit Öl')).toBe('aerger-mit-oel');
  });

  test('Über uns', () => {
    expect(createReadableSlug('Über uns')).toBe('ueber-uns');
  });

  test('Maß & Mitte default (ss)', () => {
    expect(createReadableSlug('Maß & Mitte')).toBe('mass-und-mitte');
  });
});
