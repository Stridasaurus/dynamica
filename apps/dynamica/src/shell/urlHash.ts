// ── Model Shell: URL-hash query primitives ──────────────────────────────────
// Generic parse/build for the query portion of a HashRouter route
// (e.g. "#/quantviz?t=SPY:10&range=2Y" — everything after the `?`). Every
// model's URL-state codec (S6: "decode(encode(state)) === state") builds its
// typed encode/decode on top of these two functions instead of re-parsing
// query strings by hand. Domain-specific validation (which keys are required,
// which values are legal) stays in the model's own urlState module — this
// file only owns string<->record parsing, never a model's semantics.

/** Parse a query string (with or without a leading `?`) into a flat record.
 *  Returns `{}` for an empty/missing search — never null, so callers don't
 *  need a null-check before looking up individual keys. */
export function parseHashQuery(search: string): Record<string, string> {
  const raw = search.startsWith('?') ? search.slice(1) : search;
  const params: Record<string, string> = {};
  if (!raw) return params;
  for (const segment of raw.split('&')) {
    if (!segment) continue;
    const eq = segment.indexOf('=');
    if (eq === -1) {
      params[segment] = '';
    } else {
      params[segment.slice(0, eq)] = segment.slice(eq + 1);
    }
  }
  return params;
}

/** Build a query string (no leading `?`) from a flat record, preserving
 *  insertion order. `undefined`/`null` values are omitted. */
export function buildHashQuery(params: Record<string, string | number | undefined | null>): string {
  const parts: string[] = [];
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue;
    parts.push(`${key}=${value}`);
  }
  return parts.join('&');
}

/** Extract the query portion (everything after `?`) from a full hash string
 *  like `#/models/nl-cross-correlogram?seed=42&lag=5`. Returns '' if there is
 *  no `?` in the hash. */
export function queryFromHash(hash: string): string {
  const qIdx = hash.indexOf('?');
  return qIdx >= 0 ? hash.slice(qIdx) : '';
}
