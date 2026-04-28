<?php

declare(strict_types=1);

require_once __DIR__ . '/replace_german_umlauts.php';
require_once __DIR__ . '/normalize_accents.php';
require_once __DIR__ . '/remove_special_chars.php';
require_once __DIR__ . '/collapse_dashes.php';
require_once __DIR__ . '/append_short_hash.php';

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
 *
 * @param string $input
 * @param array{
 *   locale?: 'de'|'en'|'auto',
 *   separator?: string,
 *   lowercase?: bool,
 *   appendHash?: bool,
 *   hashLength?: int,
 *   hashSeed?: string|int,
 *   sharpS?: 'ss'|'sz',
 *   replacements?: array<string, string>,
 *   maxLength?: int
 * } $options
 * @return string
 *
 * @example
 * create_readable_slug('Schöne Grüße aus Köln!')
 * // 'schoene-gruesse-aus-koeln'
 *
 * create_readable_slug('Schöne Grüße aus Köln!', ['appendHash' => true])
 * // 'schoene-gruesse-aus-koeln-a1b2c3'
 *
 * create_readable_slug('Maß & Mitte', ['sharpS' => 'sz', 'replacements' => ['&' => 'und']])
 * // 'masz-und-mitte'
 */
function create_readable_slug(string $input, array $options = []): string
{
    $locale      = $options['locale']      ?? 'de';
    $separator   = $options['separator']   ?? '-';
    $lowercase   = $options['lowercase']   ?? true;
    $appendHash  = $options['appendHash']  ?? false;
    $hashLength  = $options['hashLength']  ?? 6;
    $hashSeed    = $options['hashSeed']    ?? '';
    $sharpS      = $options['sharpS']      ?? 'ss';
    $maxLength   = $options['maxLength']   ?? null;

    $defaultReplacements = $locale === 'en'
        ? ['&' => 'and',  '+' => 'plus', '@' => 'at', '%' => 'percent']
        : ['&' => 'und',  '+' => 'plus', '@' => 'at', '%' => 'prozent'];

    $userReplacements  = $options['replacements'] ?? [];
    $mergedReplacements = array_merge($defaultReplacements, $userReplacements);

    $slug = $input;

    $slug = replace_german_umlauts($slug, ['preserveCase' => true, 'sharpS' => $sharpS]);
    $slug = normalize_accents($slug);
    $slug = remove_special_chars($slug, ['replacements' => $mergedReplacements]);

    if ($lowercase) {
        $slug = mb_strtolower($slug, 'UTF-8');
    }

    $slug = collapse_dashes($slug);

    if ($separator !== '-') {
        $slug = str_replace('-', $separator, $slug);
    }

    if ($maxLength !== null && mb_strlen($slug) > $maxLength) {
        $truncated = (string) preg_replace('/-[^-]*$/', '', mb_substr($slug, 0, $maxLength));
        $slug = $truncated !== '' ? $truncated : preg_replace('/[^a-z0-9]/i', '', mb_substr($slug, 0, $maxLength));
    }

    if ($appendHash) {
        $slug = append_short_hash($slug, ['length' => $hashLength, 'seed' => $hashSeed]);
    }

    return $slug;
}
