import cron from "node-cron";
import { main as syncAssignments } from "../utils/SyncCoursera.js";

// Schedule to run every hour at minute 0
cron.schedule("0 * * * *", async () => {
  console.log("⏰ Running hourly Coursera sync...");
  await syncAssignments({ exitAfterSync: false });
});
