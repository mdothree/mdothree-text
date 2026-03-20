// Page controller: extract-urls.html
import { extractURLs } from '../services/lineTools.js';
import { saveToHistory } from '../config/firebase.js';

    document.getElementById('extractBtn').addEventListener('click', () => {
      const text = document.getElementById('inputText').value;
      const dedup = document.getElementById('deduplicate').checked;
      const alertArea = document.getElementById('alertArea');

      if (!text.trim()) {
        alertArea.innerHTML = '<div class="alert alert-error">❌ Please paste some text first.</div>';
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
          item.innerHTML = `
            <span style="font-family:var(--font-mono);font-size:0.8rem;color:var(--emerald);flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${url}</span>
            <a href="${url}" target="_blank" rel="noopener" style="color:var(--slate-500);text-decoration:none;font-size:0.85rem;flex-shrink:0;" title="Open">↗</a>
            <button onclick="navigator.clipboard.writeText('${url.replace(/'/g, "\\'")}');this.textContent='✅';setTimeout(()=>this.textContent='📋',1500);" style="background:none;border:none;cursor:pointer;color:var(--slate-500);font-size:0.85rem;flex-shrink:0;">📋</button>
          `;
          urlList.appendChild(item);
        });
      }

      resultPanel.style.display = 'block';
      saveToHistory('extract-urls', { found: urls.length });
    });

    document.getElementById('copyAllBtn')?.addEventListener('click', async () => {
      const urls = Array.from(document.querySelectorAll('#urlList span')).map(s => s.textContent);
      await navigator.clipboard.writeText(urls.join('\n'));
      document.getElementById('copyAllBtn').textContent = '✅ Copied!';
      setTimeout(() => { document.getElementById('copyAllBtn').textContent = 'Copy All'; }, 2000);
    });
