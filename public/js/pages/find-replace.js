// Page controller: find-replace.html
import { findReplace } from '../services/findReplace.js';
import { saveToHistory } from '../config/firebase.js';
import { showAlert, copyWithFeedback } from '../utils/dom.js';

    const textInput = document.getElementById('textInput');
    const findInput = document.getElementById('findInput');
    const replaceInput = document.getElementById('replaceInput');
    const matchCount = document.getElementById('matchCount');
    const alertArea = document.getElementById('alertArea');

    function getOptions() {
      return {
        caseSensitive: document.getElementById('caseSensitive').checked,
        useRegex: document.getElementById('useRegex').checked,
        wholeWord: document.getElementById('wholeWord').checked,
      };
    }

    document.getElementById('findBtn').addEventListener('click', () => {
      const text = textInput.value;
      const term = findInput.value;
      if (!term) return;
      alertArea.innerHTML = '';
      try {
        const { count } = findReplace(text, term, '', { ...getOptions(), countOnly: true });
        matchCount.textContent = `${count} match${count !== 1 ? 'es' : ''} found`;
        matchCount.style.color = count > 0 ? 'var(--emerald)' : 'var(--slate-500)';
      } catch (e) {
        showAlert(alertArea, 'error', `❌ Invalid regex: ${e.message}`);
      }
    });

    document.getElementById('replaceBtn').addEventListener('click', async () => {
      const text = textInput.value;
      const term = findInput.value;
      const replacement = replaceInput.value;
      if (!term) return;
      alertArea.innerHTML = '';
      const opts = getOptions();
      let result, count;
      try {
        ({ result, count } = findReplace(text, term, replacement, opts));
      } catch (e) {
        showAlert(alertArea, 'error', `❌ Invalid regex: ${e.message}`);
        return;
      }
      textInput.value = result;
      matchCount.textContent = `Replaced ${count} match${count !== 1 ? 'es' : ''}`;
      matchCount.style.color = 'var(--emerald)';
      // History is best-effort and must never surface as an "Invalid regex" error.
      saveToHistory('find-replace', { count, useRegex: opts.useRegex }).catch(() => {});
    });

    document.getElementById('copyOutputBtn').addEventListener('click', async () => {
      await copyWithFeedback(document.getElementById('copyOutputBtn'), textInput.value, 'Copy');
    });

    document.getElementById('clearBtn').addEventListener('click', () => {
      textInput.value = ''; matchCount.textContent = '';
    });
