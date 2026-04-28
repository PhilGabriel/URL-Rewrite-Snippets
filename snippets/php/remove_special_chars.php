<?php

declare(strict_types=1);

/**
 * Remove or replace special characters, leaving only letters, digits,
 * spaces, and hyphens.
 *
 * Apply optional $replacements before stripping – this lets you turn
 * '&' into 'und' or 'and' before it disappears entirely.
 *
 * @param string $input
 * @param array{replacements?: array<string, string>} $options
 * @return string
 *
 * @example
 * remove_special_chars('Design & Entwicklung', ['replacements' => ['&' => 'und']])
 * // 'Design und Entwicklung'
 *
 * remove_special_chars('100% Qualität!')
 * // '100 Qualitat'  (after upstream accent normalization)
 */
function remove_special_chars(string $input, array $options = []): string
{
    $replacements = $options['replacements'] ?? [];

    $result = $input;

    foreach ($replacements as $from => $to) {
        $result = str_replace($from, ' ' . $to . ' ', $result);
    }

    $result = preg_replace('/[^a-zA-Z0-9\s\-]/u', ' ', $result) ?? $result;

    $result = (string) preg_replace('/\s+/', ' ', $result);
    $result = trim($result);

    return $result;
}
