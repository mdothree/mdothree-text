/**
 * diff-worker.js — Web Worker for non-blocking text diff
 * Receives: { a, b, mode }
 * Posts back: { ok, html, added, removed } or { ok: false, error }
 */
'use strict';

self.onmessage = function(e) {
  const { a, b, mode } = e.data;
  try {
    const result = diffTexts(a, b, mode);
    self.postMessage({ ok: true, ...result });
  } catch (err) {
    self.postMessage({ ok: false, error: err.message });
  }
};

function diffTexts(a, b, mode) {
  let ta, tb;
  if (mode === 'chars')      { ta = a.split('');  tb = b.split(''); }
  else if (mode === 'words') { ta = a.split(/(\s+)/); tb = b.split(/(\s+)/); }
  else                       { ta = a.split('\n'); tb = b.split('\n'); }

  const ops = lcs_diff(ta, tb);
  let html = '', added = 0, removed = 0;
  ops.forEach(op => {
    const esc = op.text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\n/g,'↵\n');
    if (op.type === 'equal')  html += `<span class="diff-equal">${esc}</span>`;
    else if (op.type === 'insert') { html += `<span class="diff-added">${esc}</span>`;   added   += op.text.length; }
    else if (op.type === 'delete') { html += `<span class="diff-removed">${esc}</span>`; removed += op.text.length; }
  });
  return { html, added, removed };
}

function lcs_diff(a, b) {
  const m = a.length, n = b.length;
  if (m * n > 200000) return simpleDiff(a, b);
  const dp = Array.from({ length: m + 1 }, () => new Int32Array(n + 1));
  for (let i = m-1; i >= 0; i--)
    for (let j = n-1; j >= 0; j--)
      dp[i][j] = a[i] === b[j] ? dp[i+1][j+1]+1 : Math.max(dp[i+1][j], dp[i][j+1]);
  const ops = []; let i=0, j=0;
  while (i < m || j < n) {
    if (i<m && j<n && a[i]===b[j])                    { ops.push({type:'equal',  text:a[i]}); i++; j++; }
    else if (j<n && (i>=m || dp[i][j+1]>=dp[i+1][j])) { ops.push({type:'insert', text:b[j]}); j++; }
    else                                               { ops.push({type:'delete', text:a[i]}); i++; }
  }
  return merge(ops);
}

function simpleDiff(a, b) {
  const ops=[], setB=new Set(b); let i=0,j=0;
  while (i<a.length||j<b.length) {
    if (i<a.length&&j<b.length&&a[i]===b[j]) { ops.push({type:'equal',text:a[i]}); i++;j++; }
    else if (j<b.length) { ops.push({type:'insert',text:b[j]}); j++; if(i<a.length&&!setB.has(a[i])){ops.push({type:'delete',text:a[i]});i++;} }
    else { ops.push({type:'delete',text:a[i]}); i++; }
  }
  return merge(ops);
}

function merge(ops) {
  const r=[];
  for (const op of ops) {
    if (r.length && r[r.length-1].type===op.type) r[r.length-1].text+=op.text;
    else r.push({...op});
  }
  return r;
}
