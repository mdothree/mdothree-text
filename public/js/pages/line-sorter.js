// Page controller: line-sorter.html
import { processLines } from '../services/lineTools.js';
import { saveToHistory } from '../config/firebase.js';

    const inputText = document.getElementById('inputText');
    const outputText = document.getElementById('outputText');
    const outputPanel = document.getElementById('outputPanel');
    const lineInfo = document.getElementById('lineInfo');
    const outputInfo = document.getElementById('outputInfo');

    inputText.addEventListener('input', () => {
      const lines = inputText.value.split('\n');
      lineInfo.textContent = `${lines.length} lines`;
    });

    document.querySelectorAll('[data-op]').forEach(btn => {
      btn.addEventListener('click', () => {
        const lines = inputText.value.split('\n');
        const result = processLines(lines, btn.dataset.op);
        outputText.value = result.join('\n');
        outputPanel.style.display = 'block';
        saveToHistory('line-tools', { op: btn.dataset.op, lineCount: result.length });
        const nonEmpty = result.filter(l => l.trim()).length;
        outputInfo.textContent = `${result.length} lines (${nonEmpty} non-empty) · was ${lines.length}`;
        document.querySelectorAll('[data-op]').forEach(b => b.classList.remove('btn-secondary'));
        btn.classList.add('btn-secondary');
      });
    });

    document.getElementById('copyOutputBtn').addEventListener('click', async () => {
      await navigator.clipboard.writeText(outputText.value);
      document.getElementById('copyOutputBtn').textContent = '✅ Copied!';
      setTimeout(() => { document.getElementById('copyOutputBtn').textContent = 'Copy'; }, 2000);
    });

    document.getElementById('useAsInputBtn').addEventListener('click', () => {
      inputText.value = outputText.value;
      const lines = inputText.value.split('\n');
      lineInfo.textContent = `${lines.length} lines`;
      outputPanel.style.display = 'none';
    });
