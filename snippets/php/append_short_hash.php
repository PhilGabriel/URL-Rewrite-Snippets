<?php

declare(strict_types=1);

/**
 * Append a short, deterministic hash to a slug to prevent duplicate URLs.
 *
 * Uses crc32() for a fast, non-cryptographic, stable hash.
 * The result contains only lowercase hex characters (URL-safe).
 * Pass a seed (e.g. database ID) to differentiate entries with identical slugs.
 *
 * @param string $slug  The base slug (already processed), e.g. 'mein-artikel'.
 * @param array{length?: int, seed?: string|int} $options
 * @return string
 *
 * @example
 * append_short_hash('mein-artikel')                        // 'mein-artikel-a1b2c3'
 * append_short_hash('mein-artikel', ['seed' => 'db-42'])   // 'mein-artikel-9f4e2a'
 * append_short_hash('mein-artikel', ['length' => 8])       // 'mein-artikel-a1b2c3d4'
 */
function append_short_hash(string $slug, array $options = []): string
{
    $length = $options['length'] ?? 6;
    $seed   = $options['seed']   ?? '';

    $input = $slug . '::' . $seed;

    $raw  = crc32($input);
    $hash = str_pad(dechex($raw < 0 ? $raw + 0x100000000 : $raw), 8, '0', STR_PAD_LEFT);
    $shortHash = substr($hash, 0, $length);

    return $slug . '-' . $shortHash;
}
