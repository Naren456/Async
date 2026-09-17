import webpush from "web-push";

const publicKey = process.env.WEB_PUSH_VAPID_PUBLIC_KEY;
const privateKey = process.env.WEB_PUSH_VAPID_PRIVATE_KEY;

if (!publicKey || !privateKey) {
  console.warn("WARNING: WEB_PUSH VAPID keys not configured - web push will fail");
} else {
  webpush.setVapidDetails(
    process.env.WEB_PUSH_CONTACT || "mailto:admin@async.app",
    publicKey,
    privateKey,
  );
}

export const sendWebPushNotification = async (subscription, payload) => {
  if (!publicKey || !privateKey) {
    throw new Error("Web Push VAPID keys are not configured");
  }

  return webpush.sendNotification(subscription, JSON.stringify(payload));
};