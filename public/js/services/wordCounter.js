// wordCounter.js
const STOP_WORDS = new Set(['the','a','an','and','or','but','in','on','at','to','for','of','with','by','from','is','was','are','were','be','been','being','have','has','had','do','does','did','will','would','could','should','may','might','shall','it','its','this','that','these','those','i','you','he','she','we','they','me','him','her','us','them','my','your','his','our','their']);

const _graphemes = (typeof Intl !== 'undefined' && typeof Intl.Segmenter === 'function')
  ? new Intl.Segmenter(undefined, { granularity: 'grapheme' })
  : null;

/** User-perceived characters: 👍🏽 and 👨‍👩‍👧 count as 1, "é" as 1 (falls back to code points). */
export function countGraphemes(str) {
  if (!str) return 0;
  if (_graphemes) {
    let n = 0;
    for (const _ of _graphemes.segment(str)) n++; // eslint-disable-line no-unused-vars
    return n;
  }
  return Array.from(str).length;
}

export function analyzeText(text) {
  const trimmed = text.trim();
  const words = trimmed ? trimmed.split(/\s+/).filter(Boolean) : [];
  // Split on terminal punctuation followed by whitespace/end, so "3.14" or "v1.2" don't end a sentence.
  const sentences = trimmed ? trimmed.split(/[.!?]+(?=\s|$)/).filter(s => s.trim().length > 0) : [];
  const paragraphs = trimmed ? text.split(/\n\s*\n/).filter(p => p.trim().length > 0) : [];
  const lines = text.length ? text.split('\n').length : 0;

  // Word frequency (excluding stop words, short words). Unicode-aware: keeps é, ü, ß, CJK, etc.
  const freq = {};
  words.forEach(w => {
    const clean = w.toLowerCase().replace(/[^\p{L}\p{M}\p{N}'’]/gu, '').replace(/^['’]+|['’]+$/g, '');
    if (Array.from(clean).length > 2 && !STOP_WORDS.has(clean)) {
      freq[clean] = (freq[clean] || 0) + 1;
    }
  });
  const topWords = Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  const wordCount = words.length;
  const readingTimeSec = wordCount ? Math.max(1, Math.round(wordCount / 238 * 60)) : 0; // 238 wpm avg
  const speakingTimeSec = wordCount ? Math.max(1, Math.round(wordCount / 150 * 60)) : 0; // 150 wpm avg speaking

  return {
    words: wordCount,
    chars: countGraphemes(text),
    charsNoSpaces: countGraphemes(text.replace(/\s/g, '')),
    sentences: sentences.length,
    paragraphs: paragraphs.length,
    lines,
    readingTimeSec,
    speakingTimeSec,
    topWords,
  };
}
