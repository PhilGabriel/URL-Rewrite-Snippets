/**
 * TypeScript usage examples for the URL-Rewrite-Snippets library.
 *
 * Copy the individual snippets you need into your project.
 * All functions are strictly typed with no external dependencies.
 */

import { replaceGermanUmlauts } from '../snippets/typescript/replaceGermanUmlauts.js';
import { normalizeAccents } from '../snippets/typescript/normalizeAccents.js';
import { removeSpecialChars } from '../snippets/typescript/removeSpecialChars.js';
import { collapseDashes } from '../snippets/typescript/collapseDashes.js';
import { appendShortHash } from '../snippets/typescript/appendShortHash.js';
import { createReadableSlug, SlugOptions } from '../snippets/typescript/createReadableSlug.js';

// ── Individual snippets ─────────────────────────────────────────────────────

const umlautResult: string = replaceGermanUmlauts('Schöne Grüße');
console.log(umlautResult);
// 'schoene gruesse'

console.log(replaceGermanUmlauts('Maßstab', { sharpS: 'sz' }));
// 'maszstab'

console.log(replaceGermanUmlauts('Über', { preserveCase: true, uppercaseMode: 'preserve' }));
// 'UEber'

console.log(normalizeAccents('Crème brûlée'));
// 'Creme brulee'

console.log(removeSpecialChars('Design & Entwicklung', { replacements: { '&': 'und' } }));
// 'Design und Entwicklung'

console.log(collapseDashes('Produkt / Kategorie / Name'));
// 'Produkt-Kategorie-Name'

console.log(appendShortHash('mein-artikel'));
// 'mein-artikel-XXXXXX'

// ── Full slug pipeline ──────────────────────────────────────────────────────

console.log(createReadableSlug('Schöne Grüße aus Köln!'));
// 'schoene-gruesse-aus-koeln'

console.log(createReadableSlug('Schöne Grüße aus Köln!', { appendHash: true }));
// 'schoene-gruesse-aus-koeln-XXXXXX'

console.log(createReadableSlug('Maß & Mitte', { sharpS: 'sz', replacements: { '&': 'und' } }));
// 'masz-und-mitte'

const options: SlugOptions = {
  locale: 'en',
  appendHash: false,
  lowercase: true,
  separator: '-',
};

console.log(createReadableSlug('Design & Development', options));
// 'design-and-development'

// ── Duplicate prevention ────────────────────────────────────────────────────

const title = 'Mein Artikel';

const slugA: string = createReadableSlug(title, { appendHash: true, hashSeed: 'id-1' });
const slugB: string = createReadableSlug(title, { appendHash: true, hashSeed: 'id-2' });

console.log(slugA);  // 'mein-artikel-XXXXXX'
console.log(slugB);  // 'mein-artikel-YYYYYY'

// ── MaxLength ───────────────────────────────────────────────────────────────

console.log(createReadableSlug('Ein sehr langer Titel der gekürzt werden soll', { maxLength: 20 }));
