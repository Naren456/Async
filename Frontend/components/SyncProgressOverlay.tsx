import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, Platform } from "react-native";
import { subscribe, getSyncState, SyncState } from "../utils/syncProgress";

export function SyncProgressOverlay() {
  const [state, setState] = useState<SyncState>(getSyncState());

  useEffect(() => subscribe(setState), []);

  if (!state.visible) return null;

  const isError = state.stage === "error";
  const isDone = state.stage === "done";

  return (
    <View
      className="absolute top-0 left-0 right-0 z-50 items-center"
      style={{ paddingTop: Platform.OS === "ios" ? 56 : 12, pointerEvents: "none" } as any}
    >
      <View
        className={`mx-4 w-full max-w-xl rounded-2xl border px-4 py-3 flex-row items-center shadow-xl ${
          isError ? "bg-red-950/90 border-red-800" : isDone ? "bg-emerald-950/90 border-emerald-800" : "bg-[#101216]/95 border-white/10"
        }`}
        style={{ elevation: 8 }}
      >
        {!isDone && !isError && <ActivityIndicator size="small" color="#60A5FA" />}
        {isDone && <Text className="text-emerald-400 text-lg">✓</Text>}
        {isError && <Text className="text-red-400 text-lg">✕</Text>}
        <View className="flex-1 ml-3">
          <Text className={`text-sm font-semibold ${isError ? "text-red-200" : isDone ? "text-emerald-200" : "text-white"}`}>
            {state.message || (isDone ? "Sync complete" : "Syncing...")}
          </Text>
          <View className="h-1.5 bg-white/10 rounded-full mt-2 overflow-hidden">
            <View
              className={`h-full rounded-full ${isError ? "bg-red-500" : isDone ? "bg-emerald-500" : "bg-blue-500"}`}
              style={{ width: `${state.progress}%` }}
            />
          </View>
        </View>
        <Text className={`text-xs font-bold ml-3 ${isError ? "text-red-300" : "text-white/70"}`}>{Math.round(state.progress)}%</Text>
      </View>
    </View>
  );
}
