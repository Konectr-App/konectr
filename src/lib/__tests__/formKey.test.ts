// © Konectr 2026. All rights reserved.
import { describe, it, expect } from 'vitest';
import { formKeyOk, formKeyRequired, readFormKey } from '../formKey';

describe('formKeyOk (Konectr-App/konectr-mvp#257)', () => {
  it('is off when no key is configured, so a deploy without the env var is unchanged', () => {
    expect(formKeyOk(undefined, null)).toBe(true);
    expect(formKeyOk('', null)).toBe(true);
    expect(formKeyOk(undefined, 'anything')).toBe(true);
  });

  it('refuses a missing key once one is configured', () => {
    expect(formKeyOk('s3cret-key', null)).toBe(false);
    expect(formKeyOk('s3cret-key', undefined)).toBe(false);
    expect(formKeyOk('s3cret-key', '')).toBe(false);
  });

  it('refuses a wrong key, including one of a different length', () => {
    expect(formKeyOk('s3cret-key', 's3cret-kez')).toBe(false);
    expect(formKeyOk('s3cret-key', 's3cret')).toBe(false);
    expect(formKeyOk('s3cret-key', 's3cret-key-and-more')).toBe(false);
  });

  it('accepts the exact key, and is case-sensitive', () => {
    expect(formKeyOk('s3cret-key', 's3cret-key')).toBe(true);
    expect(formKeyOk('s3cret-key', 'S3CRET-KEY')).toBe(false);
  });

  it('handles non-ASCII keys by bytes', () => {
    expect(formKeyOk('kópi-ais', 'kópi-ais')).toBe(true);
    expect(formKeyOk('kópi-ais', 'kopi-ais')).toBe(false);
  });

  it('ignores whitespace around either side, so an env var saved with a newline still works', () => {
    expect(formKeyOk('s3cret-key\n', 's3cret-key')).toBe(true);
    expect(formKeyOk('  s3cret-key ', 's3cret-key')).toBe(true);
    expect(formKeyOk('s3cret-key', ' s3cret-key ')).toBe(true);
    expect(formKeyOk(' \n', null)).toBe(true); // whitespace only = not configured
    expect(formKeyOk('s3cret-key', '   ')).toBe(false);
  });
});

describe('formKeyRequired (what the page shows)', () => {
  it('is false with no key, an empty key or a whitespace-only key', () => {
    expect(formKeyRequired(undefined)).toBe(false);
    expect(formKeyRequired('')).toBe(false);
    expect(formKeyRequired('   ')).toBe(false);
    expect(formKeyRequired(' \n')).toBe(false);
    expect(formKeyRequired('\t')).toBe(false);
  });

  it('is true once a real key is set, with or without a trailing newline', () => {
    expect(formKeyRequired('s3cret-key')).toBe(true);
    expect(formKeyRequired('s3cret-key\n')).toBe(true);
    expect(formKeyRequired(' k ')).toBe(true);
  });

  it('agrees with the API check: the field shows exactly when a request with no key is refused', () => {
    for (const env of [undefined, '', ' ', ' \n', '\t\r\n', 's3cret-key', 's3cret-key\n', '  k  ', '0', 'false']) {
      expect(formKeyRequired(env)).toBe(!formKeyOk(env, null));
    }
  });
});

describe('readFormKey', () => {
  it('returns null for a missing header', () => {
    expect(readFormKey(null)).toBeNull();
    expect(readFormKey(undefined)).toBeNull();
    expect(readFormKey('')).toBeNull();
  });

  it('decodes what the form percent-encoded, including characters a header cannot carry', () => {
    for (const key of ['s3cret-key', 'kópi – ais', 'kunci ☕ rahsia', "it's 100% mine"]) {
      const header = encodeURIComponent(key);
      expect(/^[\x00-\xff]*$/.test(header)).toBe(true); // safe to send
      expect(readFormKey(header)).toBe(key);
      expect(formKeyOk(key, readFormKey(header))).toBe(true);
    }
  });

  it('takes a value that is not valid percent-encoding as typed', () => {
    expect(readFormKey('100%')).toBe('100%');
  });
});
