import { describe, it, expect } from 'vitest';
import { parseHashQuery, buildHashQuery, queryFromHash } from '../shell/urlHash';

describe('parseHashQuery', () => {
  it('parses key=value pairs', () => {
    expect(parseHashQuery('a=1&b=2')).toEqual({ a: '1', b: '2' });
  });

  it('strips a leading ?', () => {
    expect(parseHashQuery('?a=1')).toEqual({ a: '1' });
  });

  it('returns {} for empty input', () => {
    expect(parseHashQuery('')).toEqual({});
    expect(parseHashQuery('?')).toEqual({});
  });

  it('handles a valueless key', () => {
    expect(parseHashQuery('flag')).toEqual({ flag: '' });
  });
});

describe('buildHashQuery', () => {
  it('joins params in insertion order', () => {
    expect(buildHashQuery({ a: 1, b: 'x' })).toBe('a=1&b=x');
  });

  it('omits undefined/null values', () => {
    expect(buildHashQuery({ a: 1, b: undefined, c: null, d: 2 })).toBe('a=1&d=2');
  });

  it('round-trips through parseHashQuery', () => {
    const built = buildHashQuery({ seed: 42, drive: 0.8 });
    expect(parseHashQuery(built)).toEqual({ seed: '42', drive: '0.8' });
  });
});

describe('queryFromHash', () => {
  it('extracts the query portion of a full hash', () => {
    expect(queryFromHash('#/models/nl-cross-correlogram?seed=1&lag=2')).toBe('?seed=1&lag=2');
  });

  it('returns empty string when there is no query', () => {
    expect(queryFromHash('#/models/nl-cross-correlogram')).toBe('');
  });
});
