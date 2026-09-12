import { useEffect, useState } from "react";

const vapidPublicKey = import.meta.env.VITE_PUSH_VAPID_PUBLIC_KEY;
const subscriptionUrl = import.meta.env.VITE_PUSH_SUBSCRIPTION_URL;

const decodeVapidKey = (key) => {
  const padding = "=".repeat((4 - (key.length % 4)) % 4);
  const base64 = `${key}${padding}`.replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((character) => character.charCodeAt(0)));
};

export function usePushNotifications() {
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/service-worker.js").catch(() => {
        setStatus("unsupported");
      });
    }
  }, []);

  const enablePushNotifications = async () => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window) || !("Notification" in window)) {
      setStatus("unsupported");
      return;
    }

    if (!vapidPublicKey || !subscriptionUrl) {
      setStatus("unconfigured");
      setError("Push notifications are not configured for this deployment.");
      return;
    }

    setStatus("loading");
    setError("");

    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setStatus("denied");
        return;
      }

      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: decodeVapidKey(vapidPublicKey),
      });

      const response = await fetch(subscriptionUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ subscription, source: "landing-page" }),
      });

      if (!response.ok) throw new Error("Unable to register this device for notifications.");
      setStatus("enabled");
    } catch (subscriptionError) {
      setStatus("error");
      setError(subscriptionError.message || "Unable to enable notifications.");
    }
  };

  return { enablePushNotifications, status, error };
}