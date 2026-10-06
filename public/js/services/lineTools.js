// lineTools.js

export function processLines(lines, operation) {
  switch (operation) {
    case 'sort-az':
      return [...lines].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
    case 'sort-za':
      return [...lines].sort((a, b) => b.localeCompare(a, undefined, { numeric: true }));
    case 'sort-length-asc':
      return [...lines].sort((a, b) => a.length - b.length);
    case 'sort-length-desc':
      return [...lines].sort((a, b) => b.length - a.length);
    case 'reverse':
      return [...lines].reverse();
    case 'shuffle':
      return shuffle([...lines]);
    case 'dedup':
      return [...new Set(lines)];
    case 'dedup-ci':
      const seen = new Set();
      return lines.filter(l => {
        const key = l.toLowerCase();
        if (seen.has(key)) return false;
        seen.add(key); return true;
      });
    case 'trim':
      return lines.map(l => l.trim());
    case 'remove-empty':
      return lines.filter(l => l.trim().length > 0);
    case 'number':
      const pad = String(lines.length).length;
      return lines.map((l, i) => `${String(i + 1).padStart(pad, '0')}. ${l}`);
    case 'remove-numbers':
      return lines.map(l => l.replace(/^\s*\d+[\.\)]\s*/, ''));
    case 'upper':
      return lines.map(l => l.toUpperCase());
    case 'lower':
      return lines.map(l => l.toLowerCase());
    default:
      return lines;
  }
}

export function extractURLs(text) {
  const urlRegex = /(?:https?|ftp):\/\/[^\s<>"{}|\\^`\[\]]+|(?<![a-zA-Z0-9@])(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+(?:com|org|net|edu|gov|io|co|app|dev|ai|uk|de|fr|ca|au)\b[^\s<>"{}|\\^`\[\]]*/gi;
  const matches = text.match(urlRegex) || [];
  return matches.map(url => {
    // Ensure protocol prefix
    if (!/^https?:\/\//i.test(url) && !/^ftp:\/\//i.test(url)) {
      return 'https://' + url;
    }
    return url;
  }).map(trimTrailingPunctuation).filter(url => url.length > 5);
}

// Prose punctuation after a URL ("see https://x.io/a." or "(https://x.io/b),") is not part of it.
function trimTrailingPunctuation(url) {
  let u = url;
  for (;;) {
    const last = u.slice(-1);
    if (/[.,;:!?'"*]/.test(last)) { u = u.slice(0, -1); continue; }
    if (last === ')') {
      const open = (u.match(/\(/g) || []).length;
      const close = (u.match(/\)/g) || []).length;
      if (close > open) { u = u.slice(0, -1); continue; }
    }
    return u;
  }
}

// Unbiased Fisher–Yates (sort(() => Math.random() - 0.5) is not uniform).
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
