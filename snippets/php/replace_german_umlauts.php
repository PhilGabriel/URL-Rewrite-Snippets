<?php

declare(strict_types=1);

/**
 * Replace German umlauts and the sharp s (ß) with ASCII equivalents.
 *
 * @param string $input   The string to process.
 * @param array{
 *   preserveCase?: bool,
 *   sharpS?: 'ss'|'sz',
 *   uppercaseMode?: 'preserve'|'lower'
 * } $options
 * @return string
 *
 * @example
 * replace_german_umlauts('Schöne Grüße')            // 'schoene gruesse'
 * replace_german_umlauts('Maßstab', ['sharpS' => 'sz']) // 'maszstab'
 * replace_german_umlauts('Über', ['preserveCase' => true, 'uppercaseMode' => 'preserve'])
 * // 'UEber'
 */
function replace_german_umlauts(string $input, array $options = []): string
{
    $preserveCase  = $options['preserveCase']  ?? false;
    $sharpS        = $options['sharpS']        ?? 'ss';
    $uppercaseMode = $options['uppercaseMode'] ?? 'lower';

    $lower = [
        'ä' => 'ae',
        'ö' => 'oe',
        'ü' => 'ue',
        'ß' => $sharpS,
    ];

    $upper = [
        'Ä' => $uppercaseMode === 'lower' ? 'ae' : 'AE',
        'Ö' => $uppercaseMode === 'lower' ? 'oe' : 'OE',
        'Ü' => $uppercaseMode === 'lower' ? 'ue' : 'UE',
    ];

    $map = array_merge($lower, $upper);

    $result = str_replace(array_keys($map), array_values($map), $input);

    if (!$preserveCase) {
        $result = mb_strtolower($result, 'UTF-8');
    }

    return $result;
}
