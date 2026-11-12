// © Konectr 2026. All rights reserved.
// Proprietary and confidential.
//
// Banned public copy for konectr.app, checked by `npm run check:copy` (and before
// every `npm run build`). Each rule is a decision by Dev; the source is named beside it.
// Only text a visitor can read is checked: string literals that contain a space,
// template literals, JSX text, JSON values and plain-text files. Identifiers, one-word
// strings (routes, anchors such as "#waitlist") and comments are not copy.
// To allow one line on purpose, put `copy-check-ignore` in a comment on that line or
// the line above, with the reason.

// Retired 2026-10-12 (Marketing/brand/MESSAGING_FRAMEWORK.md), plus the website's own
// old lines found by the congruency log (CW-web-retired-taglines). The only brand line
// is "Your plan. New people. Nearby."
export const RETIRED_LINES = [
  "let's make it real",
  'say it. do it.',
  'say it. make it real.',
  'make plans, meet people',
  'say yes to spontaneous connections',
  'say yes to plans',
  'meet people. do things.',
  'meet. connect. make it real.',
  'real plans with people nearby',
  'real adventures with real people',
  'join the movement',
  'the offline first app',
];

const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const RULES = [
  ...RETIRED_LINES.map((line) => ({
    id: 'retired-line',
    re: new RegExp(escape(line), 'i'),
    why: `retired tagline "${line}"; use "Your plan. New people. Nearby."`,
  })),
  { id: 'testflight', re: /\btestflight\b/i, why: 'the app is live on both stores' },
  {
    id: 'beta',
    re: /\b(public|closed|open) beta\b|\bjoin the beta\b|\bin beta\b|\bbeta (tester|access|version|launch|invite)s?\b/i,
    why: 'the app is live on both stores; no beta',
  },
  { id: 'waitlist', re: /\bwait[- ]?list(ed|s)?\b|you're on the list/i, why: 'no waitlist; the app is live' },
  { id: 'early-access', re: /\bearly access\b/i, why: 'no early access; the app is live' },
  { id: 'coming-soon', re: /\bcoming soon\b/i, why: 'never pre-announce: a feature is described only when it is live' },
  {
    id: 'venue-partner',
    re: /\bpartner(ed|ing|s)? (with )?venues?\b|\bvenue partner(s|ships?)?\b/i,
    why: 'Konectr has no venue partnerships (Dev, 2026-11-09)',
  },
  { id: 'old-handle', re: /@konectrapp\b|(x|twitter)\.com\/konectrapp/i, why: 'not an official account; use @konectr.app' },
  { id: 'host', re: /\bhost(s|ed|ing)?\b/i, why: 'never "host": say "start a plan"' },
  {
    id: 'ai-claim',
    re: /\bAI[- ](matching|powered|match)\b/i,
    why: 'Pulse is a weighted score, not an AI model (Dev, 2026-11-12): say "Pulse, our one-tap match"',
  },
];

// Paths (relative to the repo root, forward slashes) that are never checked.
export const EXCLUDE = [
  /^src\/app\/api\//, // server routes: identifiers and logs, not copy
  /(^|\/)(privacy|terms|cookies)\//, // legal pages: Dev and a lawyer only
  /\.test\.[cm]?[jt]sx?$/,
  /(^|\/)CLAUDE\.md$/,
  /^src\/app\/venue-interview\//, // Dev's own interview form for venue owners: noindex, never shown to members
];

/** Replace comments with spaces, keeping every offset and newline in place. */
export function blankComments(src) {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '))
    .replace(/(^|[^:\\])\/\/[^\n]*/g, (m, pre) => pre + ' '.repeat(m.length - pre.length));
}

/** Text a visitor can read, as [offset, text] pairs. */
export function copySegments(path, src) {
  if (path.endsWith('.json')) {
    const out = [];
    const re = /"((?:[^"\\\n]|\\.)*)"/g; // every JSON string, in order
    let m;
    while ((m = re.exec(src))) {
      const isKey = /^\s*:/.test(src.slice(re.lastIndex));
      if (!isKey) out.push([m.index, m[1]]);
    }
    return out;
  }
  if (path.endsWith('.txt') || path.endsWith('.md')) return [[0, src]];
  const code = blankComments(src);
  const out = [];
  const strings = /'((?:[^'\\\n]|\\.)*)'|"((?:[^"\\\n]|\\.)*)"|`((?:[^`\\]|\\.)*)`/g;
  let m;
  while ((m = strings.exec(code))) {
    const isTemplate = m[3] !== undefined;
    // In a template literal only the literal text is copy; `${...}` is code.
    const text = isTemplate ? m[3].replace(/\$\{[^}]*\}/g, ' ') : (m[1] ?? m[2] ?? '');
    if (isTemplate || /\s/.test(text)) out.push([m.index, text]);
  }
  if (!path.endsWith('.tsx')) return out; // only .tsx files hold JSX text
  // JSX text: between a tag or an expression and the next tag or expression.
  const jsx = /[>}]([^<>{}]*[A-Za-z][^<>{}]*)[<{]/g;
  while ((m = jsx.exec(code))) out.push([m.index + 1, m[1]]);
  return out;
}

const lineOf = (src, offset) => src.slice(0, offset).split('\n').length;

/** All rule hits in one file, de-duplicated by line and rule. */
export function findViolations(path, src) {
  if (EXCLUDE.some((re) => re.test(path))) return [];
  const lines = src.split('\n');
  const ignored = (line) =>
    /copy-check-ignore/.test(lines[line - 1] ?? '') || /copy-check-ignore/.test(lines[line - 2] ?? '');
  const seen = new Set();
  const hits = [];
  for (const [offset, raw] of copySegments(path, src)) {
    const text = raw
      .replace(/&apos;|&#39;|&rsquo;|&lsquo;/g, "'")
      .replace(/&quot;|&ldquo;|&rdquo;/g, '"')
      .replace(/&amp;/g, '&')
      .replace(/&nbsp;/g, ' ')
      .replace(/[\u2018\u2019]/g, "'");
    for (const rule of RULES) {
      const m = rule.re.exec(text);
      if (!m) continue;
      const line = lineOf(src, offset + Math.max(0, raw.indexOf(m[0])));
      const key = `${line}:${rule.id}`;
      if (seen.has(key) || ignored(line)) continue;
      seen.add(key);
      hits.push({ path, line, rule: rule.id, match: m[0], why: rule.why });
    }
  }
  return hits.sort((a, b) => a.line - b.line);
}
