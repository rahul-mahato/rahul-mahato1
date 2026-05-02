/**
 * Structured event logger.
 *
 * Logs are EVENTS — never user content. Pass IDs and counts, not text.
 * If you find yourself wanting to log a memory's body, you've made a mistake.
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogPayload {
  [key: string]: string | number | boolean | null | undefined;
}

function emit(level: LogLevel, event: string, payload: LogPayload = {}): void {
  const line = { ts: Date.now(), level, event, ...payload };
  if (level === 'error') console.error(JSON.stringify(line));
  else if (level === 'warn') console.warn(JSON.stringify(line));
  else if (__DEV__) console.log(JSON.stringify(line));
}

export const logger = {
  event: (event: string, payload?: LogPayload) => emit('info', event, payload),
  warn: (event: string, payload?: LogPayload) => emit('warn', event, payload),
  error: (event: string, payload?: LogPayload) => emit('error', event, payload),
  debug: (event: string, payload?: LogPayload) => emit('debug', event, payload),
};
