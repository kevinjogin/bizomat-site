// The AI chat's Markdown: readable replies, and never any HTML from the model.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderMarkdown } from '../../opensketch/static/js/md.js';

test('bold, code, lists and headings render', () => {
  const html = renderMarkdown('I built it.\n\n- **How:** a boss and a cut\n- holes `length - 2*edge` apart\n\n1. first\n2. second\n### Next');
  assert.equal(html, '<p>I built it.</p><ul><li><b>How:</b> a boss and a cut</li><li>holes <code>length - 2*edge</code> apart</li></ul>'
    + '<ol><li>first</li><li>second</li></ol><p class="md-h">Next</p>');
});

test('model text cannot add HTML or script links', () => {
  const html = renderMarkdown('<img src=x onerror=alert(1)> [x](javascript:alert(1)) [ok](https://example.com/a?b=1&c="2")');
  assert.ok(!html.includes('<img') && !html.includes('href="javascript'));
  assert.ok(html.includes('&lt;img src=x onerror=alert(1)&gt;'));
  assert.ok(html.includes('<a href="https://example.com/a?b=1&amp;c=&quot;2&quot;" target="_blank" rel="noopener noreferrer">ok</a>'));
});

test('multiplication stays plain, emphasis needs word edges', () => {
  assert.equal(renderMarkdown('2*3*4 and a *word*'), '<p>2*3*4 and a <i>word</i></p>');
});
