import { Stack, SplashScreen } from "expo-router";
import "./global.css";
import { Provider } from 'react-redux';
import { store } from '../store/store';
import * as SecureStore from "../utils/secureStore"
import { useDispatch } from "react-redux";
import { SyncProgressOverlay } from "../components/SyncProgressOverlay";


import { usePushNotifications } from "../hooks/usePushNotifications";
import { useSelector } from "react-redux";
import { UpdatePushToken } from "../api/apiCall";


import { useEffect } from "react";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { Platform } from "react-native";
import { registerBackgroundSync, setBackgroundUser } from "../utils/backgroundSync";

SplashScreen.preventAutoHideAsync();

function AppLayout() {

  const { expoPushToken, requestWebPushPermission } = usePushNotifications();
  const user = useSelector((state: any) => state.user);

  useEffect(() => {
    // Hide the splash screen once the layout is mounted
    SplashScreen.hideAsync();

    // Register service worker and inject manifest for PWA on web
    if (Platform.OS === "web") {
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker
          .register("/service-worker.js")
          .then((registration) => {
            console.log("Service Worker registered with scope:", registration.scope);
          })
          .catch((error) => {
            console.error("Service Worker registration failed:", error);
          });
      }

      // Add manifest link if not exists
      if (!document.querySelector('link[rel="manifest"]')) {
        const manifestLink = document.createElement('link');
        manifestLink.rel = 'manifest';
        manifestLink.href = '/manifest.json';
        document.head.appendChild(manifestLink);
      }
    }
  }, []);

  useEffect(() => {
    if (user?.id && user?.token && expoPushToken) {
      UpdatePushToken(expoPushToken).catch(err => console.error("Failed to sync push token", err));
    }
  }, [user?.id, user?.token, expoPushToken]);

  // Web Push: request permission and save subscription for persistent web notifications
  useEffect(() => {
    if (Platform.OS !== "web") return;
    if (!user?.id) return;
    const vapid = process.env.EXPO_PUBLIC_WEB_PUSH_VAPID_PUBLIC_KEY;
    if (!vapid) return;
    // Don't auto-prompt on every load - only if permission is default
    if (typeof window !== "undefined" && window.Notification && Notification.permission === "default") {
      // Defer to avoid blocking splash
      const t = setTimeout(async () => {
        const sub = await requestWebPushPermission(vapid);
        if (sub) {
          try {
            const { default: client } = await import("../api/client");
            await client.post("/api/public/push-subscriptions", { subscription: JSON.parse(sub), source: "web-dashboard" });
            console.log("Web push subscription saved");
          } catch (e) { console.log("Web push save failed", e); }
        }
      }, 2500);
      return () => clearTimeout(t);
    } else if (Notification.permission === "granted") {
      requestWebPushPermission(vapid).then(async (sub) => {
        if (sub) {
          try {
            const { default: client } = await import("../api/client");
            await client.post("/api/public/push-subscriptions", { subscription: JSON.parse(sub), source: "web-dashboard" });
          } catch {}
        }
      });
    }
  }, [user?.id]);

  // Background sync every 2 days - keep assignments fresh even when app closed
  useEffect(() => {
    if (Platform.OS === "web") return;
    registerBackgroundSync();
  }, []);

  // Keep background user in sync for background task
  useEffect(() => {
    if (Platform.OS === "web") return;
    if (user?.id && user?.cohortNo) {
      setBackgroundUser(user);
    } else if (!user?.id) {
      // Don't clear immediately on splash - only if explicitly logged out handled elsewhere
    }
  }, [user?.id, user?.cohortNo]);

  useEffect(() => {
    if (Platform.OS === "web") return; // Web uses expo-auth-session, not native GoogleSignin
    try {
      const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
      const iosClientId = process.env.EXPO_PUBLIC_IOS_CLIENT_ID;
      if (!webClientId) {
        console.warn("EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID not set - Google Sign-In will fail");
        return;
      }
      const config: any = {
        webClientId,
        offlineAccess: false,
      };
      if (iosClientId) config.iosClientId = iosClientId;
      GoogleSignin.configure(config);
    } catch (error) {
      console.error("Google Sign-In configuration failed:", error);
    }
  }, []);




  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="welcome" />
        <Stack.Screen name="user" />
        <Stack.Screen name="admin" options={{ presentation: 'modal' }} />
        <Stack.Screen name="note/[id]" />
        <Stack.Screen name="pdf/[id]" />
      </Stack>
      <SyncProgressOverlay />
    </>
  )
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <AppLayout />
    </Provider>
  )
}