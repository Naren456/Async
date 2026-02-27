import cron from "node-cron";
import prisma from "../config/db.js"; // adjust path if needed

// Run every minute (for testing). Change to "*/10 * * * *" for every 10 min in production
cron.schedule("0 0 * * *", async () => {
  /* Commented out to allow persistence of past assignments for Coursera sync
  try {
    const now = new Date();

    // Delete assignments whose dueDate + 2 hours < current time
    const deleted = await prisma.assignment.deleteMany({
      where: {
        dueDate: {
          not: null,
          lte: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2 hours after deadline
        },
      },
    });

    if (deleted.count > 0) {
      console.log(`🗑️ Deleted ${deleted.count} expired assignments`);
    }
  } catch (err) {
    console.error("❌ Error auto-deleting expired assignments:", err);
  }
  */
});
