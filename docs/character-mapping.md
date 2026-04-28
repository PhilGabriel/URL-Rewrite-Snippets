# Character Mapping Reference

This document lists all character substitutions applied by the snippet pipeline.

---

## German Characters

| Input | Output | Notes |
|-------|--------|-------|
| `ä`   | `ae`   | Always lowercase |
| `ö`   | `oe`   | Always lowercase |
| `ü`   | `ue`   | Always lowercase |
| `Ä`   | `ae` / `AE` | `ae` by default; `AE` with `uppercaseMode: 'preserve'` |
| `Ö`   | `oe` / `OE` | `oe` by default; `OE` with `uppercaseMode: 'preserve'` |
| `Ü`   | `ue` / `UE` | `ue` by default; `UE` with `uppercaseMode: 'preserve'` |
| `ß`   | `ss` / `sz` | `ss` by default; configure with `sharpS` option |

---

## Western European Accents

| Input | Output | Language/Region |
|-------|--------|-----------------|
| `à`   | `a`    | French, Italian, Portuguese |
| `á`   | `a`    | Spanish, Portuguese, Czech |
| `â`   | `a`    | French, Romanian |
| `ã`   | `a`    | Portuguese |
| `å`   | `a`    | Scandinavian |
| `è`   | `e`    | French, Italian |
| `é`   | `e`    | French, Spanish, Portuguese |
| `ê`   | `e`    | French, Portuguese |
| `ë`   | `e`    | French, Dutch |
| `ì`   | `i`    | Italian |
| `í`   | `i`    | Spanish, Portuguese |
| `î`   | `i`    | French, Romanian |
| `ï`   | `i`    | French, Dutch |
| `ò`   | `o`    | Italian |
| `ó`   | `o`    | Spanish, Portuguese |
| `ô`   | `o`    | French, Portuguese |
| `õ`   | `o`    | Portuguese |
| `ù`   | `u`    | French, Italian |
| `ú`   | `u`    | Spanish, Portuguese |
| `û`   | `u`    | French |
| `ý`   | `y`    | Czech, Slovak |
| `ÿ`   | `y`    | French |
| `ç`   | `c`    | French, Portuguese, Turkish |
| `ñ`   | `n`    | Spanish |

---

## Ligatures and Special Letters

| Input | Output | Notes |
|-------|--------|-------|
| `æ` / `Æ` | `ae` / `AE` | Scandinavian, Icelandic, Old English |
| `œ` / `Œ` | `oe` / `OE` | French |
| `ø` / `Ø` | `o` / `O`   | Scandinavian |
| `ð` / `Ð` | `d` / `D`   | Icelandic |
| `þ` / `Þ` | `th` / `TH` | Icelandic |
| `ł` / `Ł` | `l` / `L`   | Polish |

---

## Special Characters and Symbols

These are replaced with descriptive words before stripping. The replacement words depend on the configured locale.

| Symbol | German (`locale: 'de'`) | English (`locale: 'en'`) |
|--------|------------------------|--------------------------|
| `&`    | `und`                  | `and`                    |
| `+`    | `plus`                 | `plus`                   |
| `@`    | `at`                   | `at`                     |
| `%`    | `prozent`              | `percent`                |

All other symbols not listed (punctuation, brackets, currency signs, etc.) are removed.

---

## Separator Normalization

| Input sequence | Output |
|----------------|--------|
| Space(s)       | `-`    |
| Underscore(s)  | `-`    |
| Slash(es)      | `-`    |
| Backslash(es)  | `-`    |
| Multiple `-`   | `-`    |
| Leading `-`    | *(removed)* |
| Trailing `-`   | *(removed)* |

---

## Recommended URL Replacements

These additional replacements can be added via the `replacements` option:

| Symbol | Suggested replacement | Use case |
|--------|----------------------|----------|
| `©`    | Remove               | Copyright symbol |
| `®`    | Remove               | Registered trademark |
| `™`    | Remove               | Trademark |
| `€`    | `euro`               | Currency |
| `$`    | `dollar`             | Currency |
| `£`    | `pfund` / `pound`    | Currency |
| `#`    | Remove or `nr`       | Hash / number sign |
| `/`    | `-`                  | Path separator (handled automatically) |
| `\`    | `-`                  | Backslash (handled automatically) |
