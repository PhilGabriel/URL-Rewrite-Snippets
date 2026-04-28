# Design Decisions

This document explains the key choices made when building this snippet collection, and why alternatives were deliberately rejected.

---

## Why Snippets Instead of a Full Framework Library

A library requires you to install a package, understand its API, keep it updated, and accept its design choices wholesale. A snippet is a small piece of code you copy into your project and own completely.

This collection is built around that philosophy:

- Each function does exactly one thing and can be used independently.
- There are no external dependencies, no npm packages to install, no Composer packages to require.
- You can read every function in under a minute and understand what it does.
- Copying a snippet is faster than reading library documentation.
- If you need a slightly different behavior, you modify the snippet directly. You are not locked into a plugin architecture.

A large library optimized for every possible language and every possible character set would be impressive engineering. But most developers need to solve one specific problem: turn a German product title into a clean URL. This collection solves that problem directly, without ceremony.

---

## Why Readability Matters More Than Pure ASCII Compression

The purpose of a URL slug is to help human beings understand what a page is about before they click the link. Compare:

```
/blog/p?id=4721
/blog/schoene-gruesse-aus-koeln
/blog/sch-ne-gr-e-aus-k-ln
```

The second URL is maximally readable. The third URL is what you get when you strip umlauts without replacing them – it is shorter but incomprehensible.

Expanding German umlauts (`ä` → `ae`, `ö` → `oe`, `ü` → `ue`) follows a well-established convention used by German speakers when writing without special characters. The resulting slugs are recognizable and can be read aloud correctly:

- `schoene-gruesse-aus-koeln` → "schöne Grüße aus Köln" ✓
- `schne-gre-aus-kln` → ??? ✗

The same principle applies to accents: `é` → `e`, `ç` → `c`. The replacement loses some precision but preserves meaning.

---

## Why ß Is Configurable

The letter ß (the German sharp s) has two accepted ASCII equivalents:

- `ss` – Used in most everyday contexts. "Straße" → "strasse". This is the default.
- `sz` – Historically preferred in some typographic traditions and used by some publishers. "Straße" → "strasze".

Neither form is universally correct. The choice affects slug stability: once you decide on a convention for a project, changing it breaks all existing URLs. Making the option explicit forces developers to make a deliberate choice and document it.

The default is `ss` because it is more widely recognized by non-specialist readers.

---

## Why Hashing Is Not a Security Feature

The short hash appended to slugs is derived from a fast, non-cryptographic algorithm (FNV-1a in JavaScript/TypeScript, crc32 in PHP). It has two properties:

1. **Determinism:** The same input always produces the same output.
2. **Speed:** No significant computation overhead.

It does not have any security properties:

- It is not resistant to collision attacks.
- It does not hide the original slug.
- It cannot be used as a token, secret, or authentication mechanism.

The hash exists solely to allow two records with identical titles to have different URLs. It must not be presented to users as a security guarantee, used to protect private content, or used as a substitute for proper authentication.

If you need cryptographic properties, use `crypto.randomUUID()` (JavaScript) or `random_bytes()` (PHP) instead.

---

## Why URL Rewrites Should Remain Stable

A URL is a contract. When you publish a URL, people bookmark it, share it, link to it, and search engines index it. Changing a URL without a redirect breaks that contract:

- Inbound links from other websites produce 404 errors.
- Search engine rankings are lost until the page is re-crawled and the redirect is processed.
- Users who bookmarked the old URL are left with a broken bookmark.

This is why the snippet collection includes a hash-based deduplication mechanism that is **deterministic**. Given the same content ID, the slug will always be the same. Regenerating a slug from the same data will never silently produce a different result.

Practical implications:

- Always store the generated slug in the database. Never regenerate it on every request.
- Treat the slug as immutable once a page is published.
- If you must change a slug (e.g. after a URL policy change), set up a permanent (301) redirect from the old URL to the new one.
- Consider including the content ID or a hash seed in the slug generation, so even if the title changes, you can detect the change and warn the developer rather than silently generating a different slug.

---

## Why There Are No External API Calls

Slug generation is a pure text transformation. It should work offline, in serverless environments, during build time, in unit tests, and anywhere else without network access. External API calls would introduce:

- Latency
- Rate limits
- Potential downtime
- Privacy concerns (sending user content to a third-party service)

All character normalization is done locally using Unicode standard algorithms (NFD normalization) or explicit mapping tables.
