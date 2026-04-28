/**
 * JavaScript usage examples for the URL-Rewrite-Snippets library.
 *
 * Copy the individual snippets you need into your project.
 * No build step required – import directly from the snippet files.
 */

import { replaceGermanUmlauts } from '../snippets/javascript/replace-german-umlauts.js';
import { normalizeAccents } from '../snippets/javascript/normalize-accents.js';
import { removeSpecialChars } from '../snippets/javascript/remove-special-chars.js';
import { collapseDashes } from '../snippets/javascript/collapse-dashes.js';
import { appendShortHash } from '../snippets/javascript/append-short-hash.js';
import { createReadableSlug } from '../snippets/javascript/create-readable-slug.js';

// ── Individual snippets ─────────────────────────────────────────────────────

console.log(replaceGermanUmlauts('Schöne Grüße'));
// 'schoene gruesse'

console.log(replaceGermanUmlauts('Maßstab', { sharpS: 'sz' }));
// 'maszstab'

console.log(replaceGermanUmlauts('Über', { preserveCase: true, uppercaseMode: 'preserve' }));
// 'UEber'

console.log(normalizeAccents('Crème brûlée'));
// 'Creme brulee'

console.log(normalizeAccents('Ñoño'));
// 'Nono'

console.log(removeSpecialChars('Design & Entwicklung', { replacements: { '&': 'und' } }));
// 'Design und Entwicklung'

console.log(removeSpecialChars('100% Qualität!'));
// '100 Qualitat'

console.log(collapseDashes('hello   world'));
// 'hello-world'

console.log(collapseDashes('Produkt / Kategorie / Name'));
// 'Produkt-Kategorie-Name'

console.log(appendShortHash('mein-artikel'));
// 'mein-artikel-XXXXXX'  (deterministic hash)

console.log(appendShortHash('mein-artikel', { seed: 'article-42', length: 8 }));
// 'mein-artikel-XXXXXXXX'

// ── Full slug pipeline ──────────────────────────────────────────────────────

console.log(createReadableSlug('Schöne Grüße aus Köln!'));
// 'schoene-gruesse-aus-koeln'

console.log(createReadableSlug('Schöne Grüße aus Köln!', { appendHash: true }));
// 'schoene-gruesse-aus-koeln-XXXXXX'

console.log(createReadableSlug('Maß & Mitte', { sharpS: 'sz', replacements: { '&': 'und' } }));
// 'masz-und-mitte'

console.log(createReadableSlug('100% Qualität!'));
// '100-prozent-qualitaet'

console.log(createReadableSlug('Produkt / Kategorie / Name'));
// 'produkt-kategorie-name'

console.log(createReadableSlug('Ärger mit Öl'));
// 'aerger-mit-oel'

console.log(createReadableSlug('Design & Development', { locale: 'en' }));
// 'design-and-development'

// ── Duplicate prevention ────────────────────────────────────────────────────

const title = 'Mein Artikel';

// Two articles with the same title but different database IDs:
const slugA = createReadableSlug(title, { appendHash: true, hashSeed: 'id-1' });
const slugB = createReadableSlug(title, { appendHash: true, hashSeed: 'id-2' });

console.log(slugA);  // 'mein-artikel-XXXXXX'
console.log(slugB);  // 'mein-artikel-YYYYYY'  (different hash)

// ── MaxLength ───────────────────────────────────────────────────────────────

console.log(createReadableSlug('Ein sehr langer Titel der gekürzt werden soll', { maxLength: 20 }));
// truncated at a word boundary within 20 characters
