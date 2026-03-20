// Page controller: text-diff.html
import { diffTexts } from '../services/textDiff.js';
    import { initPaywall, isPremium, requirePremium, FREE_LIMITS } from '../stripe-paywall.js';
    import { saveToHistory } from '../config/firebase.js';
    initPaywall();

    let diffMode = 'chars';
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        diffMode = btn.dataset.mode;
      });
    });

    let _diffWorker = null;

  function runDiff() {
    const a = document.getElementById('textA').value;
    const b = document.getElementById('textB').value;
    if (a.length > FREE_LIMITS.textDiffChars && !isPremium()) {
      requirePremium(`Diffing texts over ${FREE_LIMITS.textDiffChars.toLocaleString()} characters requires Pro`, 'text-diff-size');
      return;
    }
    if (!a || !b) {
      document.getElementById('alertArea').innerHTML = '<div class="alert alert-error">❌ Both text fields are required.</div>';
      return;
    }
    document.getElementById('alertArea').innerHTML = '';
    document.getElementById('diffBtn').disabled = true;
    document.getElementById('diffBtn').textContent = '⟺ Comparing…';

    // Terminate any in-flight worker
    if (_diffWorker) { _diffWorker.terminate(); _diffWorker = null; }

    _diffWorker = new Worker('js/workers/diff-worker.js');
    _diffWorker.onmessage = async (e) => {
      _diffWorker = null;
      document.getElementById('diffBtn').disabled = false;
      document.getElementById('diffBtn').textContent = '⟺ Compare';
      if (!e.data.ok) {
        document.getElementById('alertArea').innerHTML = `<div class="alert alert-error">❌ ${e.data.error}</div>`;
        return;
      }
      const { html, added, removed } = e.data;
      document.getElementById('diffOutput').innerHTML = html;
      document.getElementById('addedCount').textContent = added;
      document.getElementById('removedCount').textContent = removed;
      document.getElementById('resultPanel').style.display = 'block';
      await saveToHistory('text-diff', { charsA: a.length, charsB: b.length, mode: diffMode });
    };
    _diffWorker.onerror = (err) => {
      _diffWorker = null;
      document.getElementById('diffBtn').disabled = false;
      document.getElementById('diffBtn').textContent = '⟺ Compare';
      // Fallback to synchronous diff if worker fails
      try {
        const { html, added, removed } = diffTexts(a, b, diffMode);
        document.getElementById('diffOutput').innerHTML = html;
        document.getElementById('addedCount').textContent = added;
        document.getElementById('removedCount').textContent = removed;
        document.getElementById('resultPanel').style.display = 'block';
      } catch (_) {}
    };
    _diffWorker.postMessage({ a, b, mode: diffMode });
  }

  document.getElementById('diffBtn').addEventListener('click', runDiff);

    // Live diff on input
    ['textA', 'textB'].forEach(id => {
      document.getElementById(id).addEventListener('input', () => {
        if (document.getElementById('resultPanel').style.display !== 'none') {
          runDiff();
        }
      });
    });
