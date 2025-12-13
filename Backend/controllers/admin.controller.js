import * as adminService from "../services/admin.service.js";

export const getAdminStats = async (req, res) => {
  try {
    const stats = await adminService.getStats();
    res.json(stats);
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    res.status(500).json({ message: "Server error fetching admin stats" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await adminService.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    res.status(500).json({ message: "Server error fetching all users" });
  }
};

export const sendNotification = async (req, res) => {
  try {
    const { cohort, title, body } = req.body;
    
    if (!cohort || !title || !body) {
      return res.status(400).json({ message: "Cohort, title, and body are required" });
    }

    const tokens = await adminService.sendNotificationToCohort(cohort, title, body);
    
    if (tokens.length > 0) {
      // Send notifications in batches or individually using the utility
      // Assuming sendPushNotification handles a single token, we might need to loop or update it to handle multiple
      // Let's check utils/notification.js content first. 
      // If it only takes one token, we loop. If it takes an array, we pass the array.
      // For now, I'll assume I need to import it.
      
      // Wait, I need to import sendPushNotification here or in the service. 
      // Better to do it in the service, but the service is returning tokens.
      // Let's import it here for now as the controller handles the response.
      // Actually, looking at auth.controller.js, it imports sendPushNotification.
      
      // Let's loop for now as a simple implementation, or use Promise.all
      const { sendPushNotification } = await import("../utils/notification.js");
      
      // Send to all tokens
      const notifications = tokens.map(token => sendPushNotification(token, title, body));
      await Promise.all(notifications);
    }

    res.status(200).json({ message: `Notification sent to ${tokens.length} users` });
  } catch (error) {
    console.error("Error sending notification:", error);
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