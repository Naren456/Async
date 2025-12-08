import cron from 'node-cron';
import prisma from '../config/db.js';
import { sendPushNotification } from '../utils/notification.js';

// Logic to check deadlines - Exported for manual triggering
export const checkDeadlines = async () => {
    console.log('Running deadline notification check...');
    try {
      const now = new Date();
      const cohortUsersCache = {};

      // Helper to fetch users with caching within this execution cycle
      const getUsersForCohort = async (cohortNo) => {
          if (!cohortUsersCache[cohortNo]) {
              cohortUsersCache[cohortNo] = await prisma.user.findMany({
                  where: {
                      cohortNo,
                      pushToken: { not: null }
                  }
              });
          }
          return cohortUsersCache[cohortNo];
      };

      // --- 0. Critical 30-Minute Reminder ---
      // Priority: HIGHEST. Due in less than 45 mins.
      const fortyFiveMinutesFromNow = new Date(now.getTime() + 45 * 60 * 1000);

      const criticalAssignments = await prisma.assignment.findMany({
        where: {
          dueDate: {
            gte: now,
            lt: fortyFiveMinutesFromNow
          }
        },
        include: { cohort: true, subject: true }
      });

      for (const assignment of criticalAssignments) {
          const lastSent = assignment.notificationSentAt ? new Date(assignment.notificationSentAt).getTime() : 0;
          const minsSinceLast = (now.getTime() - lastSent) / (1000 * 60);

          // If we haven't sent a notification in the last 20 mins, send one now.
          if (minsSinceLast > 20) {
             const users = await getUsersForCohort(assignment.cohortNo);
             await sendReminder(assignment, `🚨🔥 CRITICAL: Assignment "${assignment.title}" for ${assignment.subject.name} is due in less than 45 minutes! Submit NOW!`, users);
          }
      }
      
      // --- 1. Urgent 5-Hour Reminder ---
      // Priority: Check this second.
      // Logic: Due between 5 and 6 hours from now.
      const fiveHoursFromNow = new Date(now.getTime() + 5 * 60 * 60 * 1000);
      const sixHoursFromNow = new Date(now.getTime() + 6 * 60 * 60 * 1000);

      const urgentAssignments = await prisma.assignment.findMany({
        where: {
          dueDate: {
            gte: fiveHoursFromNow,
            lt: sixHoursFromNow
          }
        },
        include: { cohort: true, subject: true }
      });

      for (const assignment of urgentAssignments) {
        // Check if already notified recently (avoid double send if cron overlaps or re-runs)
        const lastSent = assignment.notificationSentAt ? new Date(assignment.notificationSentAt).getTime() : 0;
        const hoursSinceLast = (now.getTime() - lastSent) / (1000 * 60 * 60);

        if (hoursSinceLast > 4) {
           const users = await getUsersForCohort(assignment.cohortNo);
           await sendReminder(assignment, `⏳⚠️ Urgent: Assignment "${assignment.title}" for ${assignment.subject.name} is due in 5 hours!`, users);
        }
      }

      // --- 2. Standard 24-Hour Reminder ---
      // Logic: Due within 24 hours and NEVER notified.
      const twentyFourHoursFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      
      const newAssignments = await prisma.assignment.findMany({
        where: {
          dueDate: {
            lte: twentyFourHoursFromNow,
            gt: now
          },
          notificationSentAt: null
        },
        include: { cohort: true, subject: true }
      });

      for (const assignment of newAssignments) {
        const timeDiff = new Date(assignment.dueDate).getTime() - now.getTime();
        const hoursRemaining = timeDiff / (1000 * 60 * 60);
        
        let message = `📅 Reminder: Assignment "${assignment.title}" for ${assignment.subject.name} is due tomorrow!`;
        
        if (hoursRemaining < 12) {
             message = `⏰ Reminder: Assignment "${assignment.title}" for ${assignment.subject.name} is due today!`;
        }
        
        const users = await getUsersForCohort(assignment.cohortNo);
        await sendReminder(assignment, message, users);
      }

    } catch (error) {
      console.error('Error in deadline notification cron:', error);
    }
};

// Helper function to send notifications
const sendReminder = async (assignment, message, users) => {
     for (const user of users) {
      if (user.pushToken) {
        await sendPushNotification(user.pushToken, "Assignment Deadline", message, { url: assignment.link });
      }
    }

    // Mark assignment as notified
    await prisma.assignment.update({
      where: { id: assignment.id },
      data: { notificationSentAt: new Date() }
    });
    
    console.log(`Sent notifications for assignment: ${assignment.title}`);
};

// Run every 30 minutes
const scheduleDeadlineNotifications = () => {
  // Run once immediately on server startup
  checkDeadlines();
  
  cron.schedule('*/30 * * * *', async () => {
    await checkDeadlines();
  });
};

export default scheduleDeadlineNotifications;