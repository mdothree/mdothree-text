// textDiff.js — Simple diff without external deps

export function diffTexts(a, b, mode = 'chars') {
  let tokens_a, tokens_b;

  if (mode === 'chars') {
    tokens_a = a.split('');
    tokens_b = b.split('');
  } else if (mode === 'words') {
    tokens_a = tokenizeWords(a);
    tokens_b = tokenizeWords(b);
  } else {
    tokens_a = a.split('\n');
    tokens_b = b.split('\n');
  }

  const ops = lcs_diff(tokens_a, tokens_b);
  let html = '';
  let added = 0, removed = 0;

  ops.forEach(op => {
    const escaped = escapeHtml(op.text);
    if (op.type === 'equal') {
      html += `<span class="diff-equal">${escaped}</span>`;
    } else if (op.type === 'insert') {
      html += `<span class="diff-added">${escaped}</span>`;
      added += op.text.length;
    } else if (op.type === 'delete') {
      html += `<span class="diff-removed">${escaped}</span>`;
      removed += op.text.length;
    }
  });

  return { html, added, removed };
}

function tokenizeWords(text) {
  // Split keeping whitespace as tokens
  return text.split(/(\s+)/);
}

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '↵\n');
}

// Simple LCS-based diff (Wagner-Fischer DP)
function lcs_diff(a, b) {
  const m = a.length, n = b.length;

  // For large inputs, fall back to simple line-by-line
  if (m * n > 200000) {
    return simpleDiff(a, b);
  }

  // Build LCS table
  const dp = Array.from({ length: m + 1 }, () => new Int32Array(n + 1));
  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      if (a[i] === b[j]) {
        dp[i][j] = dp[i + 1][j + 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i + 1][j], dp[i][j + 1]);
      }
    }
  }

  // Trace back
  const ops = [];
  let i = 0, j = 0;
  while (i < m || j < n) {
    if (i < m && j < n && a[i] === b[j]) {
      ops.push({ type: 'equal', text: a[i] }); i++; j++;
    } else if (j < n && (i >= m || dp[i][j + 1] >= dp[i + 1][j])) {
      ops.push({ type: 'insert', text: b[j] }); j++;
    } else {
      ops.push({ type: 'delete', text: a[i] }); i++;
    }
  }

  // Merge consecutive same-type ops
  return mergeOps(ops);
}

function simpleDiff(a, b) {
  const ops = [];
  const setA = new Set(a), setB = new Set(b);
  let i = 0, j = 0;
  while (i < a.length || j < b.length) {
    if (i < a.length && j < b.length && a[i] === b[j]) {
      ops.push({ type: 'equal', text: a[i] }); i++; j++;
    } else if (j < b.length) {
      ops.push({ type: 'insert', text: b[j] }); j++;
      if (i < a.length && !setB.has(a[i])) { ops.push({ type: 'delete', text: a[i] }); i++; }
    } else {
      ops.push({ type: 'delete', text: a[i] }); i++;
    }
  }
  return mergeOps(ops);
}

function mergeOps(ops) {
  const merged = [];
  for (const op of ops) {
    if (merged.length && merged[merged.length - 1].type === op.type) {
      merged[merged.length - 1].text += op.text;
    } else {
      merged.push({ ...op });
    }
  }
  return merged;
}
