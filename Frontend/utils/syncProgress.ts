type Listener = (state: SyncState) => void;
export type SyncState = {
  visible: boolean;
  progress: number; // 0-100
  message: string;
  stage: "idle" | "assignments" | "subjects" | "done" | "error";
};

let state: SyncState = { visible: false, progress: 0, message: "", stage: "idle" };
const listeners = new Set<Listener>();

export function getSyncState() { return state; }
export function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
function emit(next: Partial<SyncState>) {
  state = { ...state, ...next };
  listeners.forEach(l => l(state));
}

export function showSyncProgress(message = "Syncing assignments...", stage: SyncState["stage"] = "assignments") {
  emit({ visible: true, progress: 5, message, stage });
}
export function updateSyncProgress(progress: number, message?: string, stage?: SyncState["stage"]) {
  emit({ progress: Math.max(0, Math.min(100, progress)), ...(message ? { message } : {}), ...(stage ? { stage } : {}) });
}
export function hideSyncProgress(delay = 800) {
  emit({ progress: 100, message: "Sync complete", stage: "done" });
  setTimeout(() => emit({ visible: false, progress: 0, message: "", stage: "idle" }), delay);
}
export function failSyncProgress(message = "Sync failed") {
  emit({ visible: true, progress: 100, message, stage: "error" });
  setTimeout(() => emit({ visible: false, progress: 0, stage: "idle" }), 1500);
}
