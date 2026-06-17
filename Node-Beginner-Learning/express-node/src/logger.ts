import { randomUUID } from "crypto";
import { AsyncLocalStorage } from "async_hooks";

export const requestContext = new AsyncLocalStorage<{ traceId: string }>();

function getTraceId(): string | undefined {
  return requestContext.getStore()?.traceId;
}

function write(level: string, fields: Record<string, any>) {
  const log = {
    "@timestamp": new Date().toISOString(),
    level,
    trace_id: getTraceId(),
    ...fields,
  };
  console.log(JSON.stringify(log));
}

export const logger = {
  info: (fields: Record<string, any>) => write("INFO", fields),
  error: (fields: Record<string, any>) => write("ERROR", fields),
  warn: (fields: Record<string, any>) => write("WARN", fields),
};
