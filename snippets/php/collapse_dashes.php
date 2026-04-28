<?php

declare(strict_types=1);

/**
 * Normalize separators:
 *   - Spaces, underscores, forward-slashes, and back-slashes become hyphens.
 *   - Consecutive hyphens collapse into one.
 *   - Leading and trailing hyphens are removed.
 *
 * @param string $input
 * @return string
 *
 * @example
 * collapse_dashes('hello   world')            // 'hello-world'
 * collapse_dashes('Produkt / Kategorie')       // 'Produkt-Kategorie'
 * collapse_dashes('--leading-and-trailing--')  // 'leading-and-trailing'
 */
function collapse_dashes(string $input): string
{
    $result = (string) preg_replace('/[\s_\/\\\\]+/', '-', $input);
    $result = (string) preg_replace('/-{2,}/', '-', $result);
    $result = trim($result, '-');

    return $result;
}
