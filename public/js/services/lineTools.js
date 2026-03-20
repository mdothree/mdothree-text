// lineTools.js

export function processLines(lines, operation) {
  switch (operation) {
    case 'sort-az':
      return [...lines].sort((a, b) => a.localeCompare(b));
    case 'sort-za':
      return [...lines].sort((a, b) => b.localeCompare(a));
    case 'sort-length-asc':
      return [...lines].sort((a, b) => a.length - b.length);
    case 'sort-length-desc':
      return [...lines].sort((a, b) => b.length - a.length);
    case 'reverse':
      return [...lines].reverse();
    case 'shuffle':
      return [...lines].sort(() => Math.random() - 0.5);
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
  }).filter(url => url.length > 5);
}
