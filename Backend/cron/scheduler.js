import cron from 'node-cron';
import prisma from '../config/db.js';
import { sendPushNotification } from '../utils/notification.js';

// Run every hour
const scheduleDeadlineNotifications = () => {
  cron.schedule('0 * * * *', async () => {
    console.log('Running deadline notification check...');
    try {
      const now = new Date();
      
      // --- 1. Urgent 5-Hour Reminder ---
      // Priority: Check this first.
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
           await sendReminder(assignment, `Urgent: Assignment "${assignment.title}" for ${assignment.subject.name} is due in 5 hours!`);
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
        
        let message = `Reminder: Assignment "${assignment.title}" for ${assignment.subject.name} is due tomorrow!`;
        
        if (hoursRemaining < 12) {
             message = `Reminder: Assignment "${assignment.title}" for ${assignment.subject.name} is due today!`;
        }
        
        await sendReminder(assignment, message);
      }

    } catch (error) {
      console.error('Error in deadline notification cron:', error);
    }
  });

  // Helper function to send notifications
  const sendReminder = async (assignment, message) => {
      const users = await prisma.user.findMany({
        where: {
          cohortNo: assignment.cohortNo,
          pushToken: { not: null }
        }
      });

      for (const user of users) {
        if (user.pushToken) {
          await sendPushNotification(user.pushToken, message);
        }
      }

      // Mark assignment as notified
      await prisma.assignment.update({
        where: { id: assignment.id },
        data: { notificationSentAt: new Date() }
      });
      
      console.log(`Sent notifications for assignment: ${assignment.title}`);
  };
};

export default scheduleDeadlineNotifications;
