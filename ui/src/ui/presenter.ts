import { formatAgo, formatDurationMs, formatMs } from "./format";
import type { CronJob, GatewaySessionRow, PresenceEntry } from "./types";

export function formatPresenceSummary(entry: PresenceEntry): string {
  const host = entry.host ?? "unknown";
  const ip = entry.ip ? `(${entry.ip})` : "";
  const mode = entry.mode ?? "";
  const version = entry.version ?? "";
  return `${host} ${ip} ${mode} ${version}`.trim();
}

export function formatPresenceAge(entry: PresenceEntry): string {
  const ts = entry.ts ?? null;
  return ts ? formatAgo(ts) : "n/a";
}

export function formatNextRun(ms?: number | null) {
  if (!ms) return "n/a";
  return `${formatMs(ms)} (${formatAgo(ms)})`;
}

export function formatSessionTokens(row: GatewaySessionRow) {
  if (row.totalTokens == null) return "n/a";
  const total = row.totalTokens ?? 0;
  const ctx = row.contextTokens ?? 0;
  return ctx ? `${total} / ${ctx}` : String(total);
}

export function formatSessionDisplayName(row: GatewaySessionRow): string {
  if (row.displayName && row.displayName !== row.key) {
    return row.displayName;
  }

  const key = row.key;
  // agent:main:whatsapp:dm:+1555... -> whatsapp:dm:+1555...
  const parts = key.split(":");
  if (parts[0] === "agent" && parts.length >= 3) {
    const rest = parts.slice(2).join(":");
    // Prettify common platforms
    if (rest.startsWith("whatsapp:")) return rest.replace("whatsapp:", "WhatsApp:");
    if (rest.startsWith("telegram:")) return rest.replace("telegram:", "Telegram:");
    if (rest.startsWith("discord:")) return rest.replace("discord:", "Discord:");
    if (rest.startsWith("slack:")) return rest.replace("slack:", "Slack:");
    return rest;
  }

  return row.displayName ?? key;
}

export function formatEventPayload(payload: unknown): string {
  if (payload == null) return "";
  try {
    return JSON.stringify(payload, null, 2);
  } catch {
    return String(payload);
  }
}

export function formatCronState(job: CronJob) {
  const state = job.state ?? {};
  const next = state.nextRunAtMs ? formatMs(state.nextRunAtMs) : "n/a";
  const last = state.lastRunAtMs ? formatMs(state.lastRunAtMs) : "n/a";
  const status = state.lastStatus ?? "n/a";
  return `${status} · next ${next} · last ${last}`;
}

export function formatCronSchedule(job: CronJob) {
  const s = job.schedule;
  if (s.kind === "at") return `At ${formatMs(s.atMs)}`;
  if (s.kind === "every") return `Every ${formatDurationMs(s.everyMs)}`;
  return `Cron ${s.expr}${s.tz ? ` (${s.tz})` : ""}`;
}

export function formatCronPayload(job: CronJob) {
  const p = job.payload;
  if (p.kind === "systemEvent") return `System: ${p.text}`;
  return `Agent: ${p.message}`;
}
