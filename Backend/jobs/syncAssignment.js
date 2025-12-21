import cron from "node-cron";
import { main as syncAssignments } from "../utils/SyncCoursera.js";

// Schedule to run daily at 12:00 AM
cron.schedule("0 * * * *", async () => {
  console.log("🌙 Running daily Coursera sync...");
  await syncAssignments();
});
