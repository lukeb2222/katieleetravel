// Heartbeat/cron is not used in this project
export type HeartbeatJob = { name: string; cron: string; path: string; };
export async function createHeartbeatJob(_job: HeartbeatJob, _session: string) {
  throw new Error("Heartbeat is not available");
}
export async function updateHeartbeatJob(_uid: string, _patch: any, _session: string) {
  throw new Error("Heartbeat is not available");
}
export async function deleteHeartbeatJob(_uid: string, _session: string) {
  throw new Error("Heartbeat is not available");
}
export async function listHeartbeatJobs(_session: string) {
  return { total: 0, actorUserId: "", jobs: [] };
}
