// wordCounter.js
const STOP_WORDS = new Set(['the','a','an','and','or','but','in','on','at','to','for','of','with','by','from','is','was','are','were','be','been','being','have','has','had','do','does','did','will','would','could','should','may','might','shall','it','its','this','that','these','those','i','you','he','she','we','they','me','him','her','us','them','my','your','his','our','their']);

export function analyzeText(text) {
  const words = text.trim() ? text.trim().split(/\s+/).filter(Boolean) : [];
  const sentences = text.trim() ? text.split(/[.!?]+/).filter(s => s.trim().length > 0) : [];
  const paragraphs = text.trim() ? text.split(/\n\s*\n/).filter(p => p.trim().length > 0) : [];
  const lines = text.split('\n');

  // Word frequency (excluding stop words, short words)
  const freq = {};
  words.forEach(w => {
    const clean = w.toLowerCase().replace(/[^a-z0-9']/g, '');
    if (clean.length > 2 && !STOP_WORDS.has(clean)) {
      freq[clean] = (freq[clean] || 0) + 1;
    }
  });
  const topWords = Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  const wordCount = words.length;
  const readingTimeSec = Math.max(1, Math.round(wordCount / 238 * 60)); // 238 wpm avg
  const speakingTimeSec = Math.max(1, Math.round(wordCount / 150 * 60)); // 150 wpm avg speaking

  return {
    words: wordCount,
    chars: text.length,
    charsNoSpaces: text.replace(/\s/g, '').length,
    sentences: sentences.length,
    paragraphs: paragraphs.length,
    lines: lines.length,
    readingTimeSec,
    speakingTimeSec,
    topWords,
  };
}
