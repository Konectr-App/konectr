// © Konectr 2026. All rights reserved.
// Tests for POST /api/venue-interview: the form key gate and where it sits (Konectr-App/konectr-mvp#257).
// Notion is mocked; nothing leaves the machine.

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const { mockCreate, mockUpdate } = vi.hoisted(() => ({
  mockCreate: vi.fn(),
  mockUpdate: vi.fn(),
}));

vi.mock('@notionhq/client', () => ({
  Client: class {
    databases = { update: mockUpdate };
    pages = { create: mockCreate };
  },
}));

const KEY = 'kunci ☕ rahsia';

/** The route reads its env vars when the module loads, so each test loads a fresh copy. */
async function loadRoute(env: { key?: string; database?: string }) {
  vi.resetModules();
  if (env.key === undefined) delete process.env.INTERVIEW_FORM_KEY;
  else process.env.INTERVIEW_FORM_KEY = env.key;
  if (env.database === undefined) delete process.env.NOTION_INTERVIEW_DATABASE_ID;
  else process.env.NOTION_INTERVIEW_DATABASE_ID = env.database;
  return (await import('../route')).POST;
}

function makeRequest(headers: Record<string, string> = {}, ip = '203.0.113.7') {
  return new Request('http://localhost/api/venue-interview', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-forwarded-for': ip, ...headers },
    body: JSON.stringify({ venueName: 'Test Cafe' }),
  }) as unknown as Parameters<Awaited<ReturnType<typeof loadRoute>>>[0];
}

const withKey = (key: string) => ({ 'x-interview-form-key': encodeURIComponent(key) });

describe('POST /api/venue-interview, the form key', () => {
  const saved = { ...process.env };

  beforeEach(() => {
    mockCreate.mockReset().mockResolvedValue({ id: 'page-1' });
    mockUpdate.mockReset().mockResolvedValue({});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    process.env = { ...saved };
    vi.restoreAllMocks();
  });

  it('with no key configured, a request without a key is saved, as before the key existed', async () => {
    const POST = await loadRoute({ database: 'db-1' });
    const res = await POST(makeRequest());
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ success: true, id: 'page-1' });
    expect(mockCreate).toHaveBeenCalledTimes(1);
  });

  it('a key that is only whitespace counts as no key, the same reading the page uses', async () => {
    const POST = await loadRoute({ key: ' \n', database: 'db-1' });
    const res = await POST(makeRequest());
    expect(res.status).toBe(200);
    expect(mockCreate).toHaveBeenCalledTimes(1);
  });

  it('with a key configured, a request without one is refused and nothing reaches Notion', async () => {
    const POST = await loadRoute({ key: KEY, database: 'db-1' });
    const res = await POST(makeRequest());
    expect(res.status).toBe(401);
    expect((await res.json()).error).toMatch(/needs its key/);
    expect(mockCreate).not.toHaveBeenCalled();
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  it('a wrong key is refused the same way', async () => {
    const POST = await loadRoute({ key: KEY, database: 'db-1' });
    for (const wrong of ['kunci', KEY + '!', KEY.toUpperCase(), '   ']) {
      const res = await POST(makeRequest(withKey(wrong)));
      expect(res.status).toBe(401);
    }
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it('the right key gets through, sent the way the form sends it (percent-encoded)', async () => {
    const POST = await loadRoute({ key: KEY + '\n', database: 'db-1' }); // env saved with a newline
    const res = await POST(makeRequest(withKey(`  ${KEY} `)));
    expect(res.status).toBe(200);
    expect(mockCreate).toHaveBeenCalledTimes(1);
  });

  it('the key is checked before the database setting, so a stranger learns nothing about the setup', async () => {
    const POST = await loadRoute({ key: KEY });
    expect((await POST(makeRequest())).status).toBe(401);
    expect((await POST(makeRequest(withKey(KEY)))).status).toBe(500);
  });

  it('the rate limit comes first, so guesses at the key are throttled too', async () => {
    const POST = await loadRoute({ key: KEY, database: 'db-1' });
    for (let i = 0; i < 20; i++) {
      expect((await POST(makeRequest(withKey('guess ' + i), '198.51.100.9'))).status).toBe(401);
    }
    // The 21st from that address is turned away before the key is read, even with the right key.
    expect((await POST(makeRequest(withKey(KEY), '198.51.100.9'))).status).toBe(429);
    // Another address is not affected.
    expect((await POST(makeRequest(withKey(KEY), '198.51.100.10'))).status).toBe(200);
  });

  it('a Notion failure answers with a generic message, never the upstream text', async () => {
    mockCreate.mockRejectedValue(new Error('notion says: database 1018decf is restricted'));
    const POST = await loadRoute({ key: KEY, database: 'db-1' });
    const res = await POST(makeRequest(withKey(KEY)));
    expect(res.status).toBe(500);
    expect(JSON.stringify(await res.json())).not.toMatch(/notion says|1018decf/);
  });
});
