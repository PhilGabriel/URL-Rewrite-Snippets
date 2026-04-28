<?php

declare(strict_types=1);

/**
 * Normalize accented characters to their plain ASCII base characters.
 *
 * Uses iconv transliteration when available, otherwise falls back to
 * an explicit mapping table for common characters.
 *
 * @param string $input
 * @return string
 *
 * @example
 * normalize_accents('Crème brûlée') // 'Creme brulee'
 * normalize_accents('Ñoño')         // 'Nono'
 */
function normalize_accents(string $input): string
{
    if (function_exists('iconv')) {
        $result = iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $input);
        if ($result !== false) {
            $result = str_replace(['?', "'", '"', '^', '~', '`'], '', $result);
            return $result;
        }
    }

    return _normalize_accents_fallback($input);
}

/**
 * Fallback mapping for common accented characters when iconv is unavailable.
 *
 * @internal
 */
function _normalize_accents_fallback(string $input): string
{
    $map = [
        'À' => 'A', 'Á' => 'A', 'Â' => 'A', 'Ã' => 'A', 'Å' => 'A',
        'à' => 'a', 'á' => 'a', 'â' => 'a', 'ã' => 'a', 'å' => 'a',
        'Æ' => 'AE', 'æ' => 'ae',
        'Ç' => 'C', 'ç' => 'c',
        'È' => 'E', 'É' => 'E', 'Ê' => 'E', 'Ë' => 'E',
        'è' => 'e', 'é' => 'e', 'ê' => 'e', 'ë' => 'e',
        'Ì' => 'I', 'Í' => 'I', 'Î' => 'I', 'Ï' => 'I',
        'ì' => 'i', 'í' => 'i', 'î' => 'i', 'ï' => 'i',
        'Ñ' => 'N', 'ñ' => 'n',
        'Ò' => 'O', 'Ó' => 'O', 'Ô' => 'O', 'Õ' => 'O',
        'ò' => 'o', 'ó' => 'o', 'ô' => 'o', 'õ' => 'o',
        'Œ' => 'OE', 'œ' => 'oe',
        'Ø' => 'O', 'ø' => 'o',
        'Ù' => 'U', 'Ú' => 'U', 'Û' => 'U',
        'ù' => 'u', 'ú' => 'u', 'û' => 'u',
        'Ý' => 'Y', 'ý' => 'y', 'ÿ' => 'y',
        'Ð' => 'D', 'ð' => 'd',
        'Þ' => 'TH', 'þ' => 'th',
        'Ł' => 'L', 'ł' => 'l',
    ];

    return str_replace(array_keys($map), array_values($map), $input);
}
