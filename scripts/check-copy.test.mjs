// © Konectr 2026. All rights reserved.
// Proprietary and confidential.

import { describe, expect, it } from 'vitest';
import { findViolations } from './copy-rules.mjs';

const ids = (path, src) => findViolations(path, src).map((h) => h.rule);

describe('check:copy rules', () => {
  it('flags a retired tagline in a string, case-insensitive', () => {
    expect(ids('src/a.tsx', `const t = "Real adventures with real people, right now.";`)).toEqual(['retired-line']);
  });

  it('flags JSX text', () => {
    expect(ids('src/a.tsx', `<p>Join the beta today</p>`)).toEqual(['beta']);
  });

  it('flags JSON values but not keys', () => {
    expect(ids('src/messages/en/x.json', `{ "joinWaitlist": "Get the app", "b": "Coming Soon" }`)).toEqual(['coming-soon']);
  });

  it('ignores identifiers, one-word strings and comments', () => {
    const src = [
      `const comingSoon = true; // coming soon`,
      `const href = '#waitlist';`,
      `/* TestFlight was retired */`,
      `fetch('/api/android-waitlist');`,
      `const host = window.location.host;`,
      'const label = `${host}/${seg}`;',
    ].join('\n');
    expect(ids('src/a.tsx', src)).toEqual([]);
  });

  it('does not treat a URL in a string as a comment', () => {
    expect(ids('src/a.ts', `const u = "see https://x.com/konectrapp now";`)).toEqual(['old-handle']);
  });

  it('skips legal pages and API routes', () => {
    expect(ids('src/app/[locale]/privacy/PrivacyContent.tsx', `"approved venue partners only"`)).toEqual([]);
    expect(ids('src/app/api/android-waitlist/route.ts', `"Android waitlist error"`)).toEqual([]);
  });

  it('honours copy-check-ignore on the line or the line above', () => {
    expect(ids('src/a.tsx', `// copy-check-ignore: quoting the old line on purpose\nconst t = "Let's make it real";`)).toEqual([]);
  });

  it('decodes HTML entities in JSX text', () => {
    expect(ids('src/a.tsx', `<span>Let&apos;s make it real</span>`)).toEqual(['retired-line']);
  });

  it('flags host wording and venue partner wording', () => {
    expect(ids('src/a.tsx', `"Hosted by a local"`)).toEqual(['host']);
    expect(ids('src/a.tsx', `"We pick partner venues carefully"`)).toEqual(['venue-partner']);
    expect(ids('src/a.tsx', `"Pulse, our AI-powered matching"`)).toEqual(['ai-claim']);
  });

  it('checks plain-text files whole', () => {
    expect(ids('public/llms.txt', `Konectr: the offline first app`)).toEqual(['retired-line']);
  });

  it('reports the line of the hit', () => {
    const hits = findViolations('src/a.tsx', `const a = 1;\nconst b = "on the waitlist now";`);
    expect(hits[0].line).toBe(2);
  });
});
