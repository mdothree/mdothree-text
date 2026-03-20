// Page controller: case-converter.html
import { convertCase } from '../services/caseConverter.js';
import { saveToHistory } from '../config/firebase.js';

    const inputText = document.getElementById('inputText');
    const outputText = document.getElementById('outputText');
    const copyBtn = document.getElementById('copyBtn');
    const activeCase = document.getElementById('activeCase');
    let currentCase = null;

    document.querySelectorAll('.case-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.case-btn').forEach(b => b.classList.remove('btn-secondary'));
        btn.classList.add('btn-secondary');
        currentCase = btn.dataset.case;
        activeCase.textContent = `Active: ${btn.dataset.case}`;
        convert();
      });
    });

    function convert() {
      if (!currentCase) return;
      const result = convertCase(inputText.value, currentCase);
      outputText.value = result;
      document.getElementById('activeCase').textContent =
        `Active: ${currentCase} · ${result.length.toLocaleString()} chars`;
    }

    inputText.addEventListener('input', convert);

    copyBtn.addEventListener('click', async () => {
      if (!outputText.value) return;
      await navigator.clipboard.writeText(outputText.value);
      copyBtn.textContent = '✅ Copied!';
      saveToHistory('case-converter', { caseType: currentCase, charCount: outputText.value.length });
      setTimeout(() => { copyBtn.textContent = 'Copy'; }, 2000);
    });
