// findReplace.js

export function findReplace(text, find, replace = '', options = {}) {
  const { caseSensitive = false, useRegex = false, wholeWord = false, countOnly = false } = options;
  const flags = caseSensitive ? 'g' : 'gi';

  let pattern;
  if (useRegex) {
    pattern = new RegExp(find, flags); // throws on invalid regex
  } else {
    let escaped = find.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // Unicode-aware word boundary (\b is ASCII-only, so whole-word "café" never matched).
    if (wholeWord) escaped = `(?<![\\p{L}\\p{M}\\p{N}_])${escaped}(?![\\p{L}\\p{M}\\p{N}_])`;
    pattern = new RegExp(escaped, flags + 'u');
  }

  const count = Array.from(text.matchAll(pattern)).length;
  if (countOnly) return { result: text, count };

  // Regex mode: native replacement string so $1, $2, $<name>, $& work.
  // Plain mode: a function so a literal "$" in the replacement stays literal.
  const result = useRegex ? text.replace(pattern, replace) : text.replace(pattern, () => replace);
  return { result, count };
}
