# URL-Rewrite-Snippets

A practical, copy-paste-friendly collection of URL slug generation snippets for **JavaScript**, **TypeScript**, and **PHP**. Each snippet is small, dependency-free, and does exactly one thing well.

---

## What This Repository Does

When you build a web application, you often need to turn arbitrary user text into clean, stable URLs:

```
"Schöne Grüße aus Köln!"  →  "schoene-gruesse-aus-koeln"
"Crème brûlée"             →  "creme-brulee"
"100% Qualität!"           →  "100-prozent-qualitaet"
"Produkt / Kategorie"      →  "produkt-kategorie"
```

This repository gives you modular, well-commented snippets to do that transformation step by step – or all at once with the combined `createReadableSlug` function.

---

## Who Is This For?

Developers building web applications in JavaScript, TypeScript, or PHP who need:

- CMS slug generation
- Blog post permalinks
- E-commerce product URLs
- Job listing URLs
- Any URL that should be human-readable and SEO-friendly

---

## Why Readable URLs Matter

A URL is the first thing a visitor sees in a search result or link preview. Compare:

| Bad | Good |
|-----|------|
| `/p?id=4721` | `/blog/schoene-gruesse-aus-koeln` |
| `/artikel/sch-gre-kln` | `/blog/schoene-gruesse-aus-koeln` |

Readable URLs:
- Build trust with visitors before they click
- Give search engines meaningful keyword signals
- Are easier to share, remember, and type
- Remain meaningful even without context

---

## Example Inputs and Outputs

| Input | Slug |
|-------|------|
| `Schöne Grüße aus Köln` | `schoene-gruesse-aus-koeln` |
| `Maß & Mitte` | `mass-und-mitte` |
| `Über uns` | `ueber-uns` |
| `Crème brûlée` | `creme-brulee` |
| `100% Qualität!` | `100-prozent-qualitaet` |
| `Produkt / Kategorie / Name` | `produkt-kategorie-name` |
| `Ärger mit Öl` | `aerger-mit-oel` |

---

## Snippet Overview

| File | Language | Purpose |
|------|----------|---------|
| `snippets/javascript/replace-german-umlauts.js` | JavaScript | ä → ae, ö → oe, ü → ue, ß → ss/sz |
| `snippets/javascript/normalize-accents.js` | JavaScript | é → e, ç → c, æ → ae, … |
| `snippets/javascript/remove-special-chars.js` | JavaScript | Strip punctuation, apply replacements |
| `snippets/javascript/collapse-dashes.js` | JavaScript | Normalize separators, trim hyphens |
| `snippets/javascript/append-short-hash.js` | JavaScript | Append deterministic short hash |
| `snippets/javascript/create-readable-slug.js` | JavaScript | Full pipeline |
| `snippets/typescript/replaceGermanUmlauts.ts` | TypeScript | Same as JS, strictly typed |
| `snippets/typescript/normalizeAccents.ts` | TypeScript | Same as JS, strictly typed |
| `snippets/typescript/removeSpecialChars.ts` | TypeScript | Same as JS, strictly typed |
| `snippets/typescript/collapseDashes.ts` | TypeScript | Same as JS, strictly typed |
| `snippets/typescript/appendShortHash.ts` | TypeScript | Same as JS, strictly typed |
| `snippets/typescript/createReadableSlug.ts` | TypeScript | Full pipeline |
| `snippets/php/replace_german_umlauts.php` | PHP 8.1+ | ä → ae, ö → oe, ü → ue, ß → ss/sz |
| `snippets/php/normalize_accents.php` | PHP 8.1+ | é → e, ç → c, æ → ae, … |
| `snippets/php/remove_special_chars.php` | PHP 8.1+ | Strip punctuation, apply replacements |
| `snippets/php/collapse_dashes.php` | PHP 8.1+ | Normalize separators, trim hyphens |
| `snippets/php/append_short_hash.php` | PHP 8.1+ | Append deterministic short hash |
| `snippets/php/create_readable_slug.php` | PHP 8.1+ | Full pipeline |

---

## JavaScript Examples

```js
import { createReadableSlug } from './snippets/javascript/create-readable-slug.js';

createReadableSlug('Schöne Grüße aus Köln!');
// 'schoene-gruesse-aus-koeln'

createReadableSlug('Schöne Grüße aus Köln!', { appendHash: true });
// 'schoene-gruesse-aus-koeln-6cd56d'

createReadableSlug('Maß & Mitte', { sharpS: 'sz', replacements: { '&': 'und' } });
// 'masz-und-mitte'

createReadableSlug('100% Qualität!');
// '100-prozent-qualitaet'

createReadableSlug('Design & Development', { locale: 'en' });
// 'design-and-development'
```

Individual snippets:

```js
import { replaceGermanUmlauts } from './snippets/javascript/replace-german-umlauts.js';
import { normalizeAccents } from './snippets/javascript/normalize-accents.js';
import { appendShortHash } from './snippets/javascript/append-short-hash.js';

replaceGermanUmlauts('Schöne Grüße', { preserveCase: true });
// 'Schoene Gruesse'

normalizeAccents('Crème brûlée');
// 'Creme brulee'

appendShortHash('mein-artikel', { seed: 'db-id-42' });
// 'mein-artikel-9bd717'
```

---

## TypeScript Examples

```ts
import { createReadableSlug, SlugOptions } from './snippets/typescript/createReadableSlug.js';

const options: SlugOptions = {
  locale: 'de',
  sharpS: 'sz',
  appendHash: true,
  hashSeed: record.id,
};

createReadableSlug('Schöne Grüße aus Köln!', options);
// 'schoene-gruesse-aus-koeln-XXXXXX'
```

---

## PHP Examples

```php
require_once 'snippets/php/create_readable_slug.php';

create_readable_slug('Schöne Grüße aus Köln!');
// 'schoene-gruesse-aus-koeln'

create_readable_slug('Schöne Grüße aus Köln!', ['appendHash' => true]);
// 'schoene-gruesse-aus-koeln-XXXXXX'

create_readable_slug('Maß & Mitte', [
    'sharpS'       => 'sz',
    'replacements' => ['&' => 'und'],
]);
// 'masz-und-mitte'

create_readable_slug('100% Qualität!');
// '100-prozent-qualitaet'
```

---

## Duplicate Slug Prevention

Two records with the same title produce the same slug. Use the `appendHash` option with a unique seed (e.g. database ID) to differentiate them:

```js
// JavaScript
const slug = createReadableSlug('Mein Artikel', {
  appendHash: true,
  hashSeed: record.id,  // e.g. 42 or 'uuid-abc-123'
});
// 'mein-artikel-6cd56d'
```

```php
// PHP
$slug = create_readable_slug('Mein Artikel', [
    'appendHash' => true,
    'hashSeed'   => $record->id,
]);
// 'mein-artikel-XXXXXX'
```

The hash is deterministic: the same slug + seed always produces the same result. Store the final slug in your database. See [`docs/duplicate-handling.md`](docs/duplicate-handling.md) for a full discussion.

---

## SEO, Stability, and Internationalization

**SEO:** Keep slugs lowercase, use hyphens as separators, and include meaningful keywords. Avoid changing slugs after publication – use 301 redirects if you must.

**Stability:** The hash function is deterministic and does not rely on random values. The same title and seed always produce the same slug.

**Internationalization:** German umlauts, French accents, Spanish tildes, Scandinavian ligatures, and Polish letters are all handled. See [`docs/character-mapping.md`](docs/character-mapping.md) for the full character table.

---

## Why Small, Copyable Snippets?

A library adds a dependency. A snippet adds understanding.

Every function here is short enough to read in one minute. You can copy it into your project, read it once, and then own it. You can adapt it without reading library documentation or waiting for a maintainer to merge a pull request.

See [`docs/design-decisions.md`](docs/design-decisions.md) for a longer discussion.

---

## Running Tests

**JavaScript:**
```sh
npm install
npm run test:js
```

**TypeScript:**
```sh
npm install
npm run test:ts
```

**PHP:**
```sh
composer install
composer test
```

---

## Contributing

Contributions are welcome. Please:

1. Keep each function small and focused on one transformation.
2. Add or update tests for any changed behavior.
3. Follow the existing code style – no external dependencies, no framework coupling.
4. If you add a new language (e.g. Spanish-specific replacements), add it as a new snippet rather than modifying existing ones.

Open an issue first for larger changes so we can discuss the approach before you invest time in a pull request.

---

## License

[MIT](LICENSE) – Philipp Gabriel
