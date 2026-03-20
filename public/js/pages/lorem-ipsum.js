// Page controller: lorem-ipsum.html
import { generateLorem } from '../services/loremGenerator.js';
import { saveToHistory } from '../config/firebase.js';

    let currentUnit = 'paragraphs';
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentUnit = btn.dataset.unit;
      });
    });

    function generate() {
      const amount = parseInt(document.getElementById('amount').value) || 3;
      const startLorem = document.getElementById('startLorem').checked;
      const htmlWrapped = document.getElementById('htmlWrapped').checked;
      const text = generateLorem(currentUnit, amount, { startLorem, htmlWrapped });
      document.getElementById('output').textContent = text;
    }

    document.getElementById('generateBtn').addEventListener('click', generate);

    document.getElementById('copyBtn').addEventListener('click', async () => {
      const text = document.getElementById('output').textContent;
      if (!text) return;
      await navigator.clipboard.writeText(text);
      document.getElementById('copyBtn').textContent = '✅ Copied!';
      saveToHistory('lorem-ipsum', { unit: currentUnit });
      setTimeout(() => { document.getElementById('copyBtn').textContent = '📋 Copy'; }, 2000);
    });

    generate();
