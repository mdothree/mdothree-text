// Page controller: word-counter.html
import { analyzeText } from '../services/wordCounter.js';
import { saveToHistory } from '../config/firebase.js';
import { copyWithFeedback } from '../utils/dom.js';

    const textInput = document.getElementById('textInput');

    function update() {
      const text = textInput.value;
      const stats = analyzeText(text);
      document.getElementById('wordCount').textContent = stats.words.toLocaleString();
      document.getElementById('charCount').textContent = stats.chars.toLocaleString();
      document.getElementById('charNoSpaces').textContent = stats.charsNoSpaces.toLocaleString();
      document.getElementById('sentenceCount').textContent = stats.sentences.toLocaleString();
      document.getElementById('paragraphCount').textContent = stats.paragraphs.toLocaleString();
      document.getElementById('lineCount').textContent = stats.lines.toLocaleString();
      document.getElementById('readingTime').textContent = formatTime(stats.readingTimeSec);
      document.getElementById('speakingTime').textContent = formatTime(stats.speakingTimeSec);

      const topWordsEl = document.getElementById('topWords');
      topWordsEl.innerHTML = '';
      stats.topWords.forEach(([word, count]) => {
        const row = document.createElement('div');
        row.style.cssText = 'display:flex;justify-content:space-between;align-items:center;font-size:0.82rem;';
        const w = document.createElement('span');
        w.className = 'text-mono'; w.style.color = 'var(--slate-300)'; w.textContent = word;
        const c = document.createElement('span');
        c.className = 'text-mono'; c.style.color = 'var(--emerald)'; c.textContent = count;
        row.append(w, c);
        topWordsEl.appendChild(row);
      });
    }

    function formatTime(sec) {
      if (sec < 60) return `${sec} sec`;
      const m = Math.floor(sec / 60), s = sec % 60;
      return `${m}m ${s}s`;
    }

    textInput.addEventListener('input', update);
    document.getElementById('clearBtn').addEventListener('click', () => { textInput.value = ''; update(); });
    document.getElementById('copyBtn').addEventListener('click', async () => {
      await copyWithFeedback(document.getElementById('copyBtn'), textInput.value, '📋 Copy text');
    });

    update();
