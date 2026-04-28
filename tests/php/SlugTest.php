<?php

declare(strict_types=1);

use PHPUnit\Framework\TestCase;

require_once __DIR__ . '/../../snippets/php/replace_german_umlauts.php';
require_once __DIR__ . '/../../snippets/php/normalize_accents.php';
require_once __DIR__ . '/../../snippets/php/remove_special_chars.php';
require_once __DIR__ . '/../../snippets/php/collapse_dashes.php';
require_once __DIR__ . '/../../snippets/php/append_short_hash.php';
require_once __DIR__ . '/../../snippets/php/create_readable_slug.php';

class SlugTest extends TestCase
{
    // ── replace_german_umlauts ────────────────────────────────────────────────

    public function test_replaces_lowercase_umlauts(): void
    {
        $this->assertSame('ae oe ue', replace_german_umlauts('ä ö ü'));
    }

    public function test_replaces_sharp_s_as_ss_by_default(): void
    {
        $this->assertSame('massstab', replace_german_umlauts('Maßstab'));
    }

    public function test_replaces_sharp_s_as_sz(): void
    {
        $this->assertSame('maszstab', replace_german_umlauts('Maßstab', ['sharpS' => 'sz']));
    }

    public function test_lowercases_uppercase_umlauts_by_default(): void
    {
        $this->assertSame('ae oe ue', replace_german_umlauts('Ä Ö Ü'));
    }

    public function test_preserves_uppercase_umlauts(): void
    {
        $this->assertSame(
            'AE OE UE',
            replace_german_umlauts('Ä Ö Ü', ['preserveCase' => true, 'uppercaseMode' => 'preserve'])
        );
    }

    public function test_preserves_case_of_non_umlaut_chars(): void
    {
        $this->assertSame('Schoene', replace_german_umlauts('Schöne', ['preserveCase' => true]));
    }

    public function test_umlaut_empty_string(): void
    {
        $this->assertSame('', replace_german_umlauts(''));
    }

    // ── normalize_accents ─────────────────────────────────────────────────────

    public function test_normalizes_french_accents(): void
    {
        $result = normalize_accents('crème brûlée');
        $this->assertSame('creme brulee', $result);
    }

    public function test_normalizes_tilde(): void
    {
        $this->assertSame('n', normalize_accents('ñ'));
    }

    public function test_normalizes_cedilla(): void
    {
        $this->assertSame('c', normalize_accents('ç'));
    }

    public function test_normalizes_ae_ligature(): void
    {
        $result = normalize_accents('æ');
        $this->assertStringContainsString('ae', strtolower($result));
    }

    public function test_accent_empty_string(): void
    {
        $this->assertSame('', normalize_accents(''));
    }

    // ── remove_special_chars ─────────────────────────────────────────────────

    public function test_removes_punctuation(): void
    {
        $this->assertSame('hello', remove_special_chars('hello!'));
    }

    public function test_replaces_ampersand(): void
    {
        $result = remove_special_chars('Design & Entwicklung', ['replacements' => ['&' => 'und']]);
        $this->assertSame('Design und Entwicklung', $result);
    }

    public function test_collapses_multiple_spaces(): void
    {
        $this->assertSame('hello world', remove_special_chars('hello   world'));
    }

    public function test_special_chars_only_string(): void
    {
        $this->assertSame('', remove_special_chars('!@#'));
    }

    public function test_special_chars_empty_string(): void
    {
        $this->assertSame('', remove_special_chars(''));
    }

    // ── collapse_dashes ───────────────────────────────────────────────────────

    public function test_replaces_spaces_with_hyphens(): void
    {
        $this->assertSame('hello-world', collapse_dashes('hello world'));
    }

    public function test_collapses_slashes(): void
    {
        $this->assertSame('a-b-c', collapse_dashes('a / b / c'));
    }

    public function test_removes_leading_hyphens(): void
    {
        $this->assertSame('hello', collapse_dashes('--hello'));
    }

    public function test_removes_trailing_hyphens(): void
    {
        $this->assertSame('hello', collapse_dashes('hello--'));
    }

    public function test_collapses_consecutive_hyphens(): void
    {
        $this->assertSame('a-b', collapse_dashes('a---b'));
    }

    public function test_dash_empty_string(): void
    {
        $this->assertSame('', collapse_dashes(''));
    }

    // ── append_short_hash ─────────────────────────────────────────────────────

    public function test_appends_six_char_hash_by_default(): void
    {
        $result = append_short_hash('mein-artikel');
        $this->assertMatchesRegularExpression('/^mein-artikel-[0-9a-f]{6}$/', $result);
    }

    public function test_hash_is_deterministic(): void
    {
        $a = append_short_hash('mein-artikel');
        $b = append_short_hash('mein-artikel');
        $this->assertSame($a, $b);
    }

    public function test_different_seeds_produce_different_hashes(): void
    {
        $a = append_short_hash('mein-artikel', ['seed' => 'id-1']);
        $b = append_short_hash('mein-artikel', ['seed' => 'id-2']);
        $this->assertNotSame($a, $b);
    }

    public function test_respects_length_option(): void
    {
        $result = append_short_hash('mein-artikel', ['length' => 8]);
        $this->assertMatchesRegularExpression('/^mein-artikel-[0-9a-f]{8}$/', $result);
    }

    public function test_hash_contains_only_url_safe_chars(): void
    {
        $result = append_short_hash('test-slug', ['seed' => 'abc']);
        $this->assertMatchesRegularExpression('/^[a-z0-9-]+$/', $result);
    }

    // ── create_readable_slug ─────────────────────────────────────────────────

    public function test_converts_german_umlauts(): void
    {
        $this->assertSame('schoene-gruesse-aus-koeln', create_readable_slug('Schöne Grüße aus Köln'));
    }

    public function test_converts_sharp_s_to_ss(): void
    {
        $this->assertSame('massstab', create_readable_slug('Maßstab'));
    }

    public function test_converts_sharp_s_to_sz(): void
    {
        $this->assertSame('maszstab', create_readable_slug('Maßstab', ['sharpS' => 'sz']));
    }

    public function test_handles_accents(): void
    {
        $this->assertSame('creme-brulee', create_readable_slug('Crème brûlée'));
    }

    public function test_handles_spaces(): void
    {
        $this->assertSame('hello-world', create_readable_slug('hello world'));
    }

    public function test_handles_special_characters(): void
    {
        $this->assertSame('100-prozent-qualitaet', create_readable_slug('100% Qualität!'));
    }

    public function test_collapses_multiple_separators(): void
    {
        $this->assertSame('produkt-kategorie-name', create_readable_slug('Produkt / Kategorie / Name'));
    }

    public function test_empty_string(): void
    {
        $this->assertSame('', create_readable_slug(''));
    }

    public function test_only_special_chars(): void
    {
        $this->assertSame('', create_readable_slug('!!!'));
    }

    public function test_appends_hash(): void
    {
        $result = create_readable_slug('Schöne Grüße aus Köln!', ['appendHash' => true]);
        $this->assertMatchesRegularExpression('/^schoene-gruesse-aus-koeln-[0-9a-f]{6}$/', $result);
    }

    public function test_hash_is_stable(): void
    {
        $a = create_readable_slug('Mein Artikel', ['appendHash' => true, 'hashSeed' => 'id-1']);
        $b = create_readable_slug('Mein Artikel', ['appendHash' => true, 'hashSeed' => 'id-1']);
        $this->assertSame($a, $b);
    }

    public function test_different_hash_seeds(): void
    {
        $a = create_readable_slug('Mein Artikel', ['appendHash' => true, 'hashSeed' => 'id-1']);
        $b = create_readable_slug('Mein Artikel', ['appendHash' => true, 'hashSeed' => 'id-2']);
        $this->assertNotSame($a, $b);
    }

    public function test_respects_max_length(): void
    {
        $result = create_readable_slug('Schöne Grüße aus Köln!', ['maxLength' => 15]);
        $this->assertLessThanOrEqual(15, strlen($result));
    }

    public function test_custom_replacements(): void
    {
        $this->assertSame(
            'masz-und-mitte',
            create_readable_slug('Maß & Mitte', ['sharpS' => 'sz', 'replacements' => ['&' => 'und']])
        );
    }

    public function test_english_locale(): void
    {
        $this->assertSame('design-and-development', create_readable_slug('Design & Development', ['locale' => 'en']));
    }

    public function test_ueber_uns(): void
    {
        $this->assertSame('ueber-uns', create_readable_slug('Über uns'));
    }

    public function test_aerger_mit_oel(): void
    {
        $this->assertSame('aerger-mit-oel', create_readable_slug('Ärger mit Öl'));
    }

    public function test_mass_und_mitte_default(): void
    {
        $this->assertSame('mass-und-mitte', create_readable_slug('Maß & Mitte'));
    }
}
