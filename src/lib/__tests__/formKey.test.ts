// © Konectr 2026. All rights reserved.
import { describe, it, expect } from 'vitest';
import { formKeyOk } from '../formKey';

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
});
