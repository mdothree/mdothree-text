// caseConverter.js

export function convertCase(text, type) {
  switch (type) {
    case 'upper':     return text.toUpperCase();
    case 'lower':     return text.toLowerCase();
    case 'title':     return text.replace(/\w\S*/g, w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
    case 'sentence':  return text.toLowerCase().replace(/(^\s*\w|[.!?]\s+\w)/g, c => c.toUpperCase());
    case 'camel':     return toWords(text).map((w, i) => i === 0 ? w.toLowerCase() : cap(w)).join('');
    case 'pascal':    return toWords(text).map(cap).join('');
    case 'snake':     return toWords(text).map(w => w.toLowerCase()).join('_');
    case 'kebab':     return toWords(text).map(w => w.toLowerCase()).join('-');
    case 'constant':  return toWords(text).map(w => w.toUpperCase()).join('_');
    case 'dot':       return toWords(text).map(w => w.toLowerCase()).join('.');
    case 'alternating': return text.split('').map((c, i) => i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()).join('');
    case 'inverse':   return text.split('').map(c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join('');
    default:          return text;
  }
}

function cap(w) { return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase(); }

function toWords(text) {
  // Split on whitespace, underscores, hyphens, dots, and camelCase boundaries
  return text
    .replace(/([a-z])([A-Z])/g, '$1 $2')  // camelCase split
    .replace(/[_\-\.]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}
