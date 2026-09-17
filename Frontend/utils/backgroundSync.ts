import * as TaskManager from "expo-task-manager";
import * as BackgroundFetch from "expo-background-fetch";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "./secureStore";

export const BACKGROUND_SYNC_TASK = "background-sync-assignments";
export const LAST_SYNC_KEY = "last_background_sync";
export const BACKGROUND_USER_KEY = "background_user"; // { cohortNo, userId }
const TWO_DAYS_MS = 2 * 24 * 60 * 60 * 1000;

// Called on login/logout to keep background user in sync
export async function setBackgroundUser(user: any) {
  try {
    if (!user) {
      await AsyncStorage.removeItem(BACKGROUND_USER_KEY);
      return;
    }
    const cohortNo = user.cohortNo ? String(user.cohortNo) : null;
    const userId = user.id || user._id || null;
    if (cohortNo && userId) {
      await AsyncStorage.setItem(BACKGROUND_USER_KEY, JSON.stringify({ cohortNo, userId }));
    }
  } catch {}
}
export async function clearBackgroundUser() {
  try { await AsyncStorage.removeItem(BACKGROUND_USER_KEY); } catch {}
}

export async function getIsDueForSync(): Promise<boolean> {
  try {
    const last = await AsyncStorage.getItem(LAST_SYNC_KEY);
    if (!last) return true;
    const elapsed = Date.now() - Number(last);
    return elapsed >= TWO_DAYS_MS;
  } catch { return true; }
}

async function doSync(): Promise<boolean> {
  try {
    const raw = await AsyncStorage.getItem(BACKGROUND_USER_KEY);
    if (!raw) {
      console.log("[BackgroundSync] No background user, skipping");
      return false;
    }
    const { cohortNo, userId } = JSON.parse(raw);
    if (!cohortNo || !userId) return false;

    // Check token still exists (user not logged out)
    const token = await SecureStore.getItemAsync("authToken");
    if (!token) {
      console.log("[BackgroundSync] No token, skipping");
      return false;
    }

    if (!(await getIsDueForSync())) {
      console.log("[BackgroundSync] Not due yet (<2 days)");
      return false;
    }

    console.log("[BackgroundSync] Syncing assignments for cohort", cohortNo, "user", userId);
    try {
      const { showSystemSyncStart, updateSystemSyncProgress, hideSystemSyncProgress, showSystemSyncError } = await import("./syncNotification");
      await showSystemSyncStart();
      await updateSystemSyncProgress(10, "Background sync started");
      // Lazy import to avoid circular deps
      const { DataManager } = await import("./DataManager");
      // Sync both assignments and subjects in parallel
      const results = await Promise.allSettled([
        DataManager.syncAssignments(String(cohortNo)),
        DataManager.syncSubjects(String(userId)),
      ]);
      const ok = results.some(r => r.status === "fulfilled" && r.value);
      if (ok) {
        await AsyncStorage.setItem(LAST_SYNC_KEY, String(Date.now()));
        await hideSystemSyncProgress("Background sync: assignments updated ✓");
        console.log("[BackgroundSync] Sync completed, updated last sync");
      } else {
        await showSystemSyncError("Background sync failed");
      }
      return ok;
    } catch (e) {
      try { const { showSystemSyncError } = await import("./syncNotification"); await showSystemSyncError("Background sync error"); } catch {}
      throw e;
    }
  } catch (e) {
    console.error("[BackgroundSync] doSync error", e);
    return false;
  }
}

// Define task once (must be at top level, not inside component)
if (Platform.OS !== "web") {
  TaskManager.defineTask(BACKGROUND_SYNC_TASK, async () => {
    try {
      const success = await doSync();
      return success ? BackgroundFetch.BackgroundFetchResult.NewData : BackgroundFetch.BackgroundFetchResult.NoData;
    } catch {
      return BackgroundFetch.BackgroundFetchResult.Failed;
    }
  });
}

export async function registerBackgroundSync() {
  if (Platform.OS === "web") {
    console.log("[BackgroundSync] Skipped on web");
    return;
  }
  try {
    const status = await BackgroundFetch.getStatusAsync();
    if (status === BackgroundFetch.BackgroundFetchStatus.Restricted) {
      console.log("[BackgroundSync] Restricted");
      return;
    }

    const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_SYNC_TASK);
    if (!isRegistered) {
      await BackgroundFetch.registerTaskAsync(BACKGROUND_SYNC_TASK, {
        minimumInterval: 2 * 24 * 60, // 2 days in minutes (4320). OS may wake earlier, we gate with 2-day check inside.
        stopOnTerminate: false,
        startOnBoot: true,
      });
      console.log("[BackgroundSync] Registered with 2-day interval");
    } else {
      console.log("[BackgroundSync] Already registered");
    }

    // For testing: allow manual trigger via BackgroundFetch
    const last = await AsyncStorage.getItem(LAST_SYNC_KEY);
    console.log("[BackgroundSync] Last sync:", last ? new Date(Number(last)).toISOString() : "never");
  } catch (e) {
    console.error("[BackgroundSync] register error", e);
  }
}

export async function unregisterBackgroundSync() {
  if (Platform.OS === "web") return;
  try {
    const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_SYNC_TASK);
    if (isRegistered) {
      await BackgroundFetch.unregisterTaskAsync(BACKGROUND_SYNC_TASK);
      console.log("[BackgroundSync] Unregistered");
    }
  } catch {}
}

export async function triggerManualSync(): Promise<boolean> {
  return doSync();
}
