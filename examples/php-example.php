<?php

declare(strict_types=1);

/**
 * PHP usage examples for the URL-Rewrite-Snippets library.
 *
 * Copy the individual snippets you need into your project.
 * All functions work without any external dependencies (PHP >= 8.1).
 */

require_once __DIR__ . '/../snippets/php/replace_german_umlauts.php';
require_once __DIR__ . '/../snippets/php/normalize_accents.php';
require_once __DIR__ . '/../snippets/php/remove_special_chars.php';
require_once __DIR__ . '/../snippets/php/collapse_dashes.php';
require_once __DIR__ . '/../snippets/php/append_short_hash.php';
require_once __DIR__ . '/../snippets/php/create_readable_slug.php';

// ── Individual snippets ─────────────────────────────────────────────────────

echo replace_german_umlauts('Schöne Grüße') . PHP_EOL;
// 'schoene gruesse'

echo replace_german_umlauts('Maßstab', ['sharpS' => 'sz']) . PHP_EOL;
// 'maszstab'

echo replace_german_umlauts('Über', ['preserveCase' => true, 'uppercaseMode' => 'preserve']) . PHP_EOL;
// 'UEber'

echo normalize_accents('Crème brûlée') . PHP_EOL;
// 'Creme brulee'

echo normalize_accents('Ñoño') . PHP_EOL;
// 'Nono'

echo remove_special_chars('Design & Entwicklung', ['replacements' => ['&' => 'und']]) . PHP_EOL;
// 'Design und Entwicklung'

echo collapse_dashes('hello   world') . PHP_EOL;
// 'hello-world'

echo collapse_dashes('Produkt / Kategorie / Name') . PHP_EOL;
// 'Produkt-Kategorie-Name'

echo append_short_hash('mein-artikel') . PHP_EOL;
// 'mein-artikel-XXXXXX'

echo append_short_hash('mein-artikel', ['seed' => 'db-id-42', 'length' => 8]) . PHP_EOL;
// 'mein-artikel-XXXXXXXX'

// ── Full slug pipeline ──────────────────────────────────────────────────────

echo create_readable_slug('Schöne Grüße aus Köln!') . PHP_EOL;
// 'schoene-gruesse-aus-koeln'

echo create_readable_slug('Schöne Grüße aus Köln!', ['appendHash' => true]) . PHP_EOL;
// 'schoene-gruesse-aus-koeln-XXXXXX'

echo create_readable_slug('Maß & Mitte', ['sharpS' => 'sz', 'replacements' => ['&' => 'und']]) . PHP_EOL;
// 'masz-und-mitte'

echo create_readable_slug('100% Qualität!') . PHP_EOL;
// '100-prozent-qualitaet'

echo create_readable_slug('Produkt / Kategorie / Name') . PHP_EOL;
// 'produkt-kategorie-name'

echo create_readable_slug('Ärger mit Öl') . PHP_EOL;
// 'aerger-mit-oel'

echo create_readable_slug('Design & Development', ['locale' => 'en']) . PHP_EOL;
// 'design-and-development'

// ── Duplicate prevention ────────────────────────────────────────────────────

$title = 'Mein Artikel';

$slugA = create_readable_slug($title, ['appendHash' => true, 'hashSeed' => 'id-1']);
$slugB = create_readable_slug($title, ['appendHash' => true, 'hashSeed' => 'id-2']);

echo $slugA . PHP_EOL;  // 'mein-artikel-XXXXXX'
echo $slugB . PHP_EOL;  // 'mein-artikel-YYYYYY' (different hash due to seed)

// ── MaxLength ───────────────────────────────────────────────────────────────

echo create_readable_slug('Ein sehr langer Titel der gekürzt werden soll', ['maxLength' => 20]) . PHP_EOL;
// truncated at a word boundary within 20 characters
