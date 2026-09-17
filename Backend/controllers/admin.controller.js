import * as adminService from "../services/admin.service.js";

export const getAdminStats = async (req, res) => {
  try {
    const stats = await adminService.getStats();
    res.json(stats);
  } catch (error) {
    if (process.env.NODE_ENV !== "production") console.error("Error fetching admin stats:", error);
    res.status(500).json({ message: "Server error fetching admin stats" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await adminService.getAllUsers();
    // Don't leak password hashes
    const safe = users.map(u => {
      const { password, ...rest } = u;
      return rest;
    });
    res.status(200).json(safe);
  } catch (error) {
    if (process.env.NODE_ENV !== "production") console.error("Error fetching admin stats:", error);
    res.status(500).json({ message: "Server error fetching all users" });
  }
};

export const sendNotification = async (req, res) => {
  try {
    const { cohort, title, body } = req.body;
    
    if (!cohort || !title || !body) {
      return res.status(400).json({ message: "Cohort, title, and body are required" });
    }
    if (typeof title !== 'string' || title.length > 100) return res.status(400).json({ message: "Invalid title (max 100 chars)" });
    if (typeof body !== 'string' || body.length > 500) return res.status(400).json({ message: "Invalid body (max 500 chars)" });

    const tokens = await adminService.sendNotificationToCohort(cohort, title, body);
    
    if (tokens.length > 0) {
      const { sendPushNotification } = await import("../utils/notification.js");
      // Chunk to avoid Expo rate limits (100 per chunk is built-in, but we also throttle Promises)
      const chunkSize = 50;
      for (let i = 0; i < tokens.length; i += chunkSize) {
        const chunk = tokens.slice(i, i + chunkSize);
        const notifications = chunk.map(token => sendPushNotification(token, title, body));
        const results = await Promise.allSettled(notifications);
        results.forEach((r, idx) => {
          if (r.status === 'rejected' && process.env.NODE_ENV !== "production") console.error(`Failed token ${chunk[idx]}:`, r.reason);
        });
      }
    }

    res.status(200).json({ message: `Notification sent to ${tokens.length} users` });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") console.error("Error sending notification:", error);
    res.status(500).json({ message: "Server error sending notification" });
  }
};

export const triggerDeadlineCheck = async (req, res) => {
  try {
    const { checkDeadlines } = await import("../cron/scheduler.js");
    await checkDeadlines();
    res.status(200).json({ message: "Deadline check triggered successfully" });
  } catch (error) {
    console.error("Error triggering deadline check:", error);
    res.status(500).json({ message: "Server error triggering deadline check" });
  }
};