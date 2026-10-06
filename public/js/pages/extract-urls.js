// Page controller: extract-urls.html
import { extractURLs } from '../services/lineTools.js';
import { saveToHistory } from '../config/firebase.js';
import { showAlert, copyWithFeedback } from '../utils/dom.js';

    document.getElementById('extractBtn').addEventListener('click', () => {
      const text = document.getElementById('inputText').value;
      const dedup = document.getElementById('deduplicate').checked;
      const alertArea = document.getElementById('alertArea');

      if (!text.trim()) {
        showAlert(alertArea, 'error', '❌ Please paste some text first.');
        return;
      }
      alertArea.innerHTML = '';

      let urls = extractURLs(text);
      if (dedup) urls = [...new Set(urls)];

      const resultPanel = document.getElementById('resultPanel');
      const urlList = document.getElementById('urlList');
      document.getElementById('urlCount').textContent = `${urls.length} found`;
      urlList.innerHTML = '';

      if (!urls.length) {
        urlList.innerHTML = '<div class="text-sm text-muted">No URLs found in the text.</div>';
      } else {
        urls.forEach(url => {
          const item = document.createElement('div');
          item.style.cssText = 'display:flex;align-items:center;gap:10px;background:var(--slate-800);border-radius:6px;padding:10px 12px;border:1px solid rgba(255,255,255,0.06);';
          // Built with DOM APIs: the URL comes from user text and must not be parsed as HTML/JS.
          const text = document.createElement('span');
          text.style.cssText = 'font-family:var(--font-mono);font-size:0.8rem;color:var(--emerald);flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;';
          text.textContent = url;
          const open = document.createElement('a');
          open.href = url; open.target = '_blank'; open.rel = 'noopener noreferrer';
          open.style.cssText = 'color:var(--slate-500);text-decoration:none;font-size:0.85rem;flex-shrink:0;';
          open.title = 'Open'; open.setAttribute('aria-label', 'Open URL'); open.textContent = '↗';
          const copy = document.createElement('button');
          copy.type = 'button';
          copy.style.cssText = 'background:none;border:none;cursor:pointer;color:var(--slate-500);font-size:0.85rem;flex-shrink:0;';
          copy.title = 'Copy'; copy.setAttribute('aria-label', 'Copy URL'); copy.textContent = '📋';
          copy.addEventListener('click', () => copyWithFeedback(copy, url, '📋'));
          item.append(text, open, copy);
          urlList.appendChild(item);
        });
      }

      resultPanel.style.display = 'block';
      saveToHistory('extract-urls', { found: urls.length });
    });

    document.getElementById('copyAllBtn')?.addEventListener('click', async () => {
      const urls = Array.from(document.querySelectorAll('#urlList span')).map(s => s.textContent);
      await copyWithFeedback(document.getElementById('copyAllBtn'), urls.join('\n'), 'Copy All');
    });
