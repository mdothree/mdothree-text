import test from 'node:test';
import assert from 'node:assert/strict';
import { diffTexts } from '../public/js/services/textDiff.js';

test('removed blank line is reported and visible', () => {
  const r = diffTexts('a\n\nb', 'a\nb', 'lines');
  assert.equal(r.removed, 1);
  assert.equal(r.added, 0);
  assert.match(r.html, /diff-removed">↵\n</);
});
test('added blank line is reported', () => {
  const r = diffTexts('a\nb', 'a\n\nb', 'lines');
  assert.equal(r.added, 1);
});
test('equal lines keep their delimiters', () => {
  const r = diffTexts('a\nb\n', 'a\nb\n', 'lines');
  assert.equal(r.added + r.removed, 0);
  assert.equal(r.html.replace(/<[^>]+>/g, '').replace(/↵/g, ''), 'a\nb\n');
});
test('trailing newline change is detected', () => {
  const r = diffTexts('a\nb', 'a\nb\n', 'lines');
  assert.ok(r.added + r.removed > 0);
});
