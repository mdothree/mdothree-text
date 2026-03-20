// Page controller: find-replace.html
import { findReplace } from '../services/findReplace.js';
import { saveToHistory } from '../config/firebase.js';

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
        alertArea.innerHTML = `<div class="alert alert-error">❌ Invalid regex: ${e.message}</div>`;
      }
    });

    document.getElementById('replaceBtn').addEventListener('click', () => {
      const text = textInput.value;
      const term = findInput.value;
      const replacement = replaceInput.value;
      if (!term) return;
      alertArea.innerHTML = '';
      try {
        const { result, count } = findReplace(text, term, replacement, getOptions());
        textInput.value = result;
        matchCount.textContent = `Replaced ${count} match${count !== 1 ? 'es' : ''}`;
        matchCount.style.color = 'var(--emerald)';
      await saveToHistory('find-replace', { count, useRegex });
      } catch (e) {
        alertArea.innerHTML = `<div class="alert alert-error">❌ Invalid regex: ${e.message}</div>`;
      }
    });

    document.getElementById('copyOutputBtn').addEventListener('click', async () => {
      await navigator.clipboard.writeText(textInput.value);
      document.getElementById('copyOutputBtn').textContent = '✅ Copied!';
      setTimeout(() => { document.getElementById('copyOutputBtn').textContent = 'Copy'; }, 2000);
    });

    document.getElementById('clearBtn').addEventListener('click', () => {
      textInput.value = ''; matchCount.textContent = '';
    });
