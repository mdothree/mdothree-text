// caseConverter.js — Unicode-aware (\p{L}) so accented / non-Latin letters convert correctly.

export function convertCase(text, type) {
  switch (type) {
    case 'upper':     return text.toUpperCase();
    case 'lower':     return text.toLowerCase();
    case 'title':     return text.replace(/[\p{L}\p{N}_][^\s]*/gu, cap);
    case 'sentence':  return text.toLowerCase().replace(/(^\s*\p{L}|[.!?]\s+\p{L})/gu, c => c.toUpperCase());
    case 'camel':     return toWords(text).map((w, i) => i === 0 ? w.toLowerCase() : cap(w)).join('');
    case 'pascal':    return toWords(text).map(cap).join('');
    case 'snake':     return toWords(text).map(w => w.toLowerCase()).join('_');
    case 'kebab':     return toWords(text).map(w => w.toLowerCase()).join('-');
    case 'constant':  return toWords(text).map(w => w.toUpperCase()).join('_');
    case 'dot':       return toWords(text).map(w => w.toLowerCase()).join('.');
    case 'alternating': return Array.from(text).map((c, i) => i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()).join('');
    case 'inverse':   return Array.from(text).map(c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join('');
    default:          return text;
  }
}

function cap(w) {
  const [first = '', ...rest] = Array.from(w);
  return first.toUpperCase() + rest.join('').toLowerCase();
}

function toWords(text) {
  // Split on any non-letter/number, plus camelCase and acronym boundaries
  // ("XMLHttpRequest" -> XML Http Request). Apostrophes are dropped so the
  // result is a valid identifier ("don't stop" -> dont_stop).
  return text
    .replace(/['’]/g, '')
    .replace(/([\p{Ll}\p{N}])(\p{Lu})/gu, '$1 $2')
    .replace(/(\p{Lu})(\p{Lu}\p{Ll})/gu, '$1 $2')
    .replace(/[^\p{L}\p{M}\p{N}]+/gu, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}
