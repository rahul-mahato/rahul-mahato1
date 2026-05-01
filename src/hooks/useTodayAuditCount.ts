import { useEffect, useState } from 'react';
import { Q } from '@nozbe/watermelondb';
import { database, PrivacyLogEntry } from '@db/index';

/**
 * Returns the count of outbound audit-log entries today. Polls cheaply on
 * mount; the privacy strip only needs a "0 today" affordance, not a live
 * counter.
 */
export function useTodayAuditCount(): number {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    let active = true;
    void database
      .get<PrivacyLogEntry>('privacy_log')
      .query(Q.where('occurred_at', Q.gte(start.getTime())))
      .fetchCount()
      .then((n) => {
        if (active) setCount(n);
      })
      .catch(() => {
        if (active) setCount(0);
      });
    return () => {
      active = false;
    };
  }, []);

  return count;
}
