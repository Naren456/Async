import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

const SYNC_CHANNEL_ID = "sync-progress";
const SYNC_NOTIFICATION_ID = "sync-progress";

export async function ensureSyncChannel() {
  if (Platform.OS !== "android") return;
  await Notifications.setNotificationChannelAsync(SYNC_CHANNEL_ID, {
    name: "Sync Progress",
    importance: Notifications.AndroidImportance.LOW,
    vibrationPattern: [0],
    sound: undefined,
    enableVibrate: false,
    lockscreenVisibility: Notifications.AndroidNotificationVisibility.PRIVATE,
  });
}

export async function showSystemSyncStart() {
  if (Platform.OS === "web") return;
  await ensureSyncChannel();
  await Notifications.scheduleNotificationAsync({
    identifier: SYNC_NOTIFICATION_ID,
    content: {
      title: "Syncing assignments...",
      body: "0% • Fetching your latest assignments",
      sticky: true,
      autoDismiss: false,
      ...(Platform.OS === "android" ? { channelId: SYNC_CHANNEL_ID } : {}),
    } as any,
    trigger: null,
  });
}

export async function updateSystemSyncProgress(progress: number, body: string) {
  if (Platform.OS === "web") return;
  try {
    await Notifications.dismissNotificationAsync(SYNC_NOTIFICATION_ID);
  } catch {}
  await Notifications.scheduleNotificationAsync({
    identifier: SYNC_NOTIFICATION_ID,
    content: {
      title: progress >= 100 ? "Sync complete" : "Syncing assignments...",
      body: `${Math.round(progress)}% • ${body}`,
      sticky: progress < 100,
      autoDismiss: progress >= 100,
      ...(Platform.OS === "android" ? { channelId: SYNC_CHANNEL_ID } : {}),
    } as any,
    trigger: null,
  });
}

export async function hideSystemSyncProgress(finalBody = "All caught up ✓") {
  if (Platform.OS === "web") return;
  try { await Notifications.dismissNotificationAsync(SYNC_NOTIFICATION_ID); } catch {}
  await Notifications.scheduleNotificationAsync({
    identifier: `sync-done-${Date.now()}`,
    content: {
      title: "Sync complete",
      body: finalBody,
      ...(Platform.OS === "android" ? { channelId: SYNC_CHANNEL_ID } : {}),
    } as any,
    trigger: null,
  });
  // Auto-dismiss done notification after 3s is handled by system
}

export async function showSystemSyncError(message: string) {
  if (Platform.OS === "web") return;
  try { await Notifications.dismissNotificationAsync(SYNC_NOTIFICATION_ID); } catch {}
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Sync failed",
      body: message,
      ...(Platform.OS === "android" ? { channelId: SYNC_CHANNEL_ID } : {}),
    } as any,
    trigger: null,
  });
}
