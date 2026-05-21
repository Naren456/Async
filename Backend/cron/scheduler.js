import cron from 'node-cron';
import prisma from '../config/db.js';
import { sendPushNotification } from '../utils/notification.js';

// Logic to check deadlines - Exported for manual triggering
export const checkDeadlines = async () => {
    console.log('Running deadline notification check...');
    try {
      const now = new Date();
      
      // Helper to fetch users who haven't completed the assignment
      const getUsersPendingForAssignment = async (assignment) => {
          return await prisma.user.findMany({
              where: {
                  cohortNo: assignment.cohortNo,
                  pushToken: { not: null },
                  assignments: {
                      none: {
                          assignmentId: assignment.id,
                          completed: true
                      }
                  }
              },
              select: {
                  id: true, 
                  pushToken: true,
                  name: true,
                  notificationTone: true,
                  cohortNo: true
              }
          });
      };

      // --- 0. Critical 30-Minute Reminder ---
      const fortyFiveMinutesFromNow = new Date(now.getTime() + 45 * 60 * 1000);
      const criticalAssignments = await prisma.assignment.findMany({
        where: {
          dueDate: { gte: now, lt: fortyFiveMinutesFromNow }
        },
        include: { cohort: true, subject: true }
      });

      for (const assignment of criticalAssignments) {
          const lastSent = assignment.notificationSentAt ? new Date(assignment.notificationSentAt).getTime() : 0;
          const minsSinceLast = (now.getTime() - lastSent) / (1000 * 60);

          if (minsSinceLast > 20) {
             const users = await getUsersPendingForAssignment(assignment);
             await sendReminder(assignment, "CRITICAL", users);
          }
      }
      
      // --- 1. Urgent 5-Hour Reminder ---
      const fiveHoursFromNow = new Date(now.getTime() + 5 * 60 * 60 * 1000);
      const sixHoursFromNow = new Date(now.getTime() + 6 * 60 * 60 * 1000);

      const urgentAssignments = await prisma.assignment.findMany({
        where: {
          dueDate: { gte: fiveHoursFromNow, lt: sixHoursFromNow }
        },
        include: { cohort: true, subject: true }
      });

      for (const assignment of urgentAssignments) {
        const lastSent = assignment.notificationSentAt ? new Date(assignment.notificationSentAt).getTime() : 0;
        const hoursSinceLast = (now.getTime() - lastSent) / (1000 * 60 * 60);

        if (hoursSinceLast > 4) {
           const users = await getUsersPendingForAssignment(assignment);
           await sendReminder(assignment, "URGENT", users);
        }
      }

      // --- 2. Standard 24-Hour Reminder ---
      const twentyFourHoursFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      
      const newAssignments = await prisma.assignment.findMany({
        where: {
          dueDate: { lte: twentyFourHoursFromNow, gt: now },
          notificationSentAt: null
        },
        include: { cohort: true, subject: true }
      });

      for (const assignment of newAssignments) {
        const timeDiff = new Date(assignment.dueDate).getTime() - now.getTime();
        const hoursRemaining = timeDiff / (1000 * 60 * 60);
        
        const urgency = hoursRemaining < 12 ? "TODAY" : "TOMORROW";
        const users = await getUsersPendingForAssignment(assignment);
        await sendReminder(assignment, urgency, users);
      }

    } catch (error) {
      console.error('Error in deadline notification cron:', error);
    }
};

// Generate personalized message
const getMessage = (tone, urgency, userName, assignmentTitle, subjectName) => {
    const safeName = userName ? userName.split(' ')[0] : 'there';
    
    // STRICT MODE
    if (tone === 'strict') {
        if (urgency === 'CRITICAL') return `🚨 URGENT: ${safeName}, submit "${assignmentTitle}" for ${subjectName} NOW. Times up.`;
        if (urgency === 'URGENT') return `⚠️ Warning: ${safeName}, "${assignmentTitle}" for ${subjectName} is due in 5 hours. Do not delay.`;
        if (urgency === 'TODAY') return `⏰ ${safeName}, deadline today for "${assignmentTitle}" (${subjectName}). Get it done.`;
        return `📅 ${safeName}, assignment "${assignmentTitle}" in ${subjectName} is due tomorrow. Plan accordingly.`;
    }
    
    // FUNNY MODE
    if (tone === 'funny') {
        if (urgency === 'CRITICAL') return `😱 RUN FOREST RUN! "${assignmentTitle}" (${subjectName}) is due in < 45 mins!`;
        if (urgency === 'URGENT') return `👀 ${safeName}, your ${subjectName} assignment is staring at you... 5 hours left!`;
        if (urgency === 'TODAY') return `💣 Tick tock ${safeName}! "${assignmentTitle}" for ${subjectName} explodes (is due) today!`;
        return `🔮 I see a deadline in your future... "${assignmentTitle}" (${subjectName}) is due tomorrow!`;
    }

    // FRIENDLY ROMANTIC MODE
    if (tone === 'friendly_romantic') {
        if (urgency === 'CRITICAL') return `✨ Hey dear, gentle nudge: "${assignmentTitle}" for ${subjectName} is due in 45 mins!`;
        if (urgency === 'URGENT') return `💖 Don't stress, but "${assignmentTitle}" in ${subjectName} needs attention in 5 hours.`;
        if (urgency === 'TODAY') return `🌟 Hope you're having a good day! Remember "${assignmentTitle}" (${subjectName}) is due today.`;
        return `💌 Just checking in! "${assignmentTitle}" for ${subjectName} is due tomorrow.`;
    }
    
    // BRO MODE (Hinglish)
    if (tone === 'bro') {
        if (urgency === 'CRITICAL') return `🤯 ${safeName}, scene serious hai! ${subjectName} ka "${assignmentTitle}" ke liye bas 45 mins bache hain. Jaldi kar le bhai!`;
        if (urgency === 'URGENT') return `⚠️ ${safeName} Bhai sun, 5 ghante hain bas. ${subjectName} wala assignment khatam kar de fir chill marenge.`;
        if (urgency === 'TODAY') return `🤛 ${safeName} Aur bhai, aaj deadline hai "${assignmentTitle}" (${subjectName}) ki. Bhool mat jaiyo!`;
        return `📅 Bhai kal submission hai "${assignmentTitle}" (${subjectName}) ka. Dekh le apne hisaab se.`;
    }

    // FRIENDLY (Default)
    if (urgency === 'CRITICAL') return `🚨 Almost due! You have less than 45 mins for "${assignmentTitle}" in ${subjectName}. You got this!`;
    if (urgency === 'URGENT') return `👋 Hey ${safeName}, just a heads up: "${assignmentTitle}" for ${subjectName} is due in 5 hours.`;
    if (urgency === 'TODAY') return `☀️ Hi ${safeName}, reminder that "${assignmentTitle}" (${subjectName}) is due today. Good luck!`;
    return `📅 Hi ${safeName}, you have an assignment "${assignmentTitle}" in ${subjectName} due tomorrow.`;
};

// Helper function to send notifications
const sendReminder = async (assignment, urgency, users) => {
     if (!users || users.length === 0) {
         console.log(`No pending users to notify for ${assignment.title}`);
     } else {
         for (const user of users) {
          if (user.pushToken) {
            const message = getMessage(user.notificationTone || 'friendly', urgency, user.name, assignment.title, assignment.subject.name);
            await sendPushNotification(user.pushToken, "Assignment Deadline", message, { url: assignment.link });
          }
        }
        console.log(`Sent personalized notifications to ${users.length} users for assignment: ${assignment.title}`);
     }

    // Mark assignment as notified
    await prisma.assignment.update({
      where: { id: assignment.id },
      data: { notificationSentAt: new Date() }
    });
};

// Run every 30 minutes
export const scheduleDeadlineNotifications = () => {
  console.log('Scheduler initialized...');
  // Run once immediately on server startup
  checkDeadlines();
  
  cron.schedule('*/30 * * * *', async () => {
    await checkDeadlines();
  });
};

export default scheduleDeadlineNotifications;