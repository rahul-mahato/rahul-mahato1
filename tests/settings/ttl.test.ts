import { ttlToCutoffMs, TTL_OPTIONS } from '@/settings/ttl';

describe('ttl', () => {
  const now = new Date('2026-04-30T12:00:00Z').getTime();

  it('forever returns null cutoff (no sweep)', () => {
    expect(ttlToCutoffMs('forever', now)).toBeNull();
  });

  it.each(TTL_OPTIONS.filter((o) => o.days !== null))(
    '$id maps to now - $days days',
    ({ id, days }) => {
      const expected = now - days! * 86_400_000;
      expect(ttlToCutoffMs(id, now)).toBe(expected);
    },
  );

  it('unknown ids fall back to forever', () => {
    // @ts-expect-error — testing the runtime fallback
    expect(ttlToCutoffMs('badly-formed', now)).toBeNull();
  });
});
