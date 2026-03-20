// findReplace.js

export function findReplace(text, find, replace = '', options = {}) {
  const { caseSensitive = false, useRegex = false, wholeWord = false, countOnly = false } = options;

  let pattern;
  if (useRegex) {
    const flags = caseSensitive ? 'g' : 'gi';
    pattern = new RegExp(find, flags); // throws on invalid regex
  } else {
    let escaped = find.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    if (wholeWord) escaped = `\\b${escaped}\\b`;
    const flags = caseSensitive ? 'g' : 'gi';
    pattern = new RegExp(escaped, flags);
  }

  let count = 0;
  const result = text.replace(pattern, (match) => {
    count++;
    return countOnly ? match : replace;
  });

  return { result, count };
}
