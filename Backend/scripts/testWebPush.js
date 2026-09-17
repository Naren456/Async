import prisma from "../config/db.js";
import { sendWebPushNotification } from "../utils/webPush.js";

async function main() {
  const subs = await prisma.webPushSubscription.findMany({ take: 5 });
  console.log(`Found ${subs.length} web push subscriptions`);
  if (subs.length === 0) {
    console.log("No subscriptions yet. Open http://localhost:8081 on web, login, and allow notifications.");
    process.exit(0);
  }
  for (const s of subs) {
    const subscription = {
      endpoint: s.endpoint,
      keys: { p256dh: s.p256dh, auth: s.auth },
    };
    try {
      await sendWebPushNotification(subscription, {
        title: "ASync Test Web Push",
        body: `Hello! Web push works ✓ (${new Date().toLocaleTimeString()})`,
        url: "/user/home",
      });
      console.log(`✓ Sent to ${s.endpoint.slice(0,60)}...`);
    } catch (e) {
      console.error(`✗ Failed ${s.endpoint.slice(0,40)}:`, e.message);
      if (e.statusCode === 410) {
        console.log("  → Subscription expired, deleting");
        await prisma.webPushSubscription.delete({ where: { endpoint: s.endpoint } });
      }
    }
  }
  process.exit(0);
}
main();
