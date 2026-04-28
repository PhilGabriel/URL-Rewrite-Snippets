# Duplicate Slug Handling

Slugs are derived from human-readable text, which means two different pieces of content can easily produce the same slug. This document explains why that happens and what you can do about it.

---

## Why Slugs Can Collide

A slug is a lossy transformation. Information is discarded:

- Case is normalized: `Mein Artikel` and `mein artikel` both become `mein-artikel`.
- Special characters are removed or replaced: `Mein-Artikel!` and `Mein Artikel` both become `mein-artikel`.
- Umlauts are expanded: `Möller` and `Moeller` both become `moeller`.

In a CMS, blog, or e-commerce catalog it is entirely normal to have:

- Two blog posts with the title "Online Marketing Manager"
- Two products called "Schwarze Tasse"
- Two job listings for "Marketing Manager – Köln"

Without a disambiguation strategy, the second entry would silently overwrite the first URL or cause a database constraint error.

---

## Why a Short Hash Helps

Appending a short hash to the slug solves the collision problem without breaking human-readability.

```
/blog/mein-artikel-a1b2c3
/blog/mein-artikel-9f4e2a
```

Both slugs are unique, still readable, and the reader can see they refer to different articles.

### Properties of the hash used in this library

- **Deterministic:** The same input (slug + seed) always produces the same hash. You can regenerate it without storing it separately.
- **Non-cryptographic:** Speed matters here, not security. FNV-1a (JS/TS) and crc32 (PHP) are perfect fits.
- **URL-safe:** Only lowercase hexadecimal characters (`0-9`, `a-f`).
- **Short:** 6 characters by default – 16 million possible values, which is more than enough for typical content collections.
- **Seedable:** Pass a database ID, UUID, or any other unique value as a seed to differentiate records with identical slugs.

---

## Comparison: Database ID vs. Hash vs. UUID

| Approach | Example URL | Pros | Cons |
|----------|-------------|------|------|
| Readable slug only | `/blog/mein-artikel` | Clean, SEO-friendly | Collisions possible |
| ID in path | `/blog/12345` | Guaranteed unique | Not human-readable |
| Readable slug + ID | `/blog/mein-artikel-12345` | Readable + unique | ID exposed |
| Readable slug + hash | `/blog/mein-artikel-a1b2c3` | Readable + unique | Hash not meaningful |
| UUID | `/blog/550e8400-e29b-41d4-a716-446655440000` | Globally unique | Very long, ugly |

For most web applications, **readable slug + short hash** is the best balance between usability and uniqueness.

---

## When to Append a Hash

Append a hash when:

- Your content model allows multiple records with the same or similar title.
- You cannot guarantee uniqueness at the application level before slug generation.
- You want to avoid database lookups to check for collisions.
- You want slugs that remain stable even if the title changes (because the hash is based on the seed, not the title).

---

## When a Readable Slug + Database ID Is Better

Use a readable slug with a plain database ID when:

- The ID is short (e.g. auto-increment integer): `/produkt/schoene-tasse-12345`
- You want the URL to be memorable and the ID to serve as a lookup key.
- Users or customers share URLs and the ID in the URL is acceptable.

---

## Real-World Examples

```
/blog/mein-artikel-a1b2c3
/produkt/schoene-tasse-12345
/jobs/online-marketing-manager-koeln-f9d2aa
/docs/installation-guide-de3f1b
```

### JavaScript

```js
import { createReadableSlug } from './snippets/javascript/create-readable-slug.js';

// Use the database record ID as seed
const slug = createReadableSlug('Mein Artikel', {
  appendHash: true,
  hashSeed: record.id,   // e.g. 42, or 'uuid-abc-123'
});
// -> 'mein-artikel-6cd56d'
```

### PHP

```php
$slug = create_readable_slug('Mein Artikel', [
    'appendHash' => true,
    'hashSeed'   => $record->id,
]);
// -> 'mein-artikel-XXXXXX'
```

---

## Storing Slugs in the Database

Regardless of the strategy you choose:

1. Store the final slug in the database (don't regenerate it from the title on every request).
2. Add a unique index on the slug column.
3. If a collision occurs at insert time, append or change the seed and retry.
4. Never change the slug of a published record without setting up a redirect.
