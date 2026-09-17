import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export type Assignment = {
    id: string;
    title: string;
    subject: string;
    isoDate: string;
    displayDate: string;
    link: string;
};

// Identifier for our specific notification group
const NOTIFICATION_GROUP_ID = 'assignment_reminder';

// Notification handler is set in hooks/usePushNotifications.ts to avoid duplicate registration - do not set here
// If no hook is used, fallback handler:
if (Platform.OS !== "web") {
  try {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: false,
          shouldShowBanner: true,
          shouldShowList: true,
      }),
    });
  } catch {}
}

/**
 * Cancels all pending notifications that were scheduled by this scheduler.
 * We use a specific identifier logic or just cancel all if we can't tag them easily.
 * For simplicity in this version, we will cancel ALL pending notifications to avoid duplicates,
 * assuming this app's primary local notifications are these reminders.
 * 
 * If you have other local notifications, you might want to store notification IDs 
 * in AsyncStorage or filter by content/category if Expo supports it.
 */
export const cancelAllAssignmentNotifications = async () => {
    if (Platform.OS === "web") return;
    try {
        await Notifications.cancelAllScheduledNotificationsAsync();
        console.log('Cancelled all previous local notifications.');
    } catch (error) {
        console.error('Error cancelling notifications:', error);
    }
};

/**
 * Schedules reminders for a list of assignments.
 * Reminders:
 * 1. 24 hours before deadline
 * 2. 30 minutes before deadline
 */
export const scheduleAssignmentNotifications = async (assignments: Assignment[]) => {
    if (Platform.OS === "web") return;
    // 1. Request permissions first (redundant if already asked, but good practice)
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') {
        const { status: newStatus } = await Notifications.requestPermissionsAsync();
        if (newStatus !== 'granted') return;
    }

    // 2. Clear old ones to prevent duplicates
    await cancelAllAssignmentNotifications();

    const now = new Date();

    // List of reminders in hours
    const intervals = [
        { hours: 24, label: "Due Tomorrow", emoji: "⏰" },
        { hours: 12, label: "Due in 12 Hours", emoji: "⏳" },
        { hours: 5, label: "Due in 5 Hours", emoji: "🏃" },
        { hours: 2, label: "Due in 2 Hours", emoji: "⚠️" },
        { hours: 1, label: "Due in 1 Hour", emoji: "🔥" },
        { hours: 0.5, label: "Due Soon", emoji: "🚨" }, // 30 minutes
    ];

    const tenDaysFromNow = new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000);

    const toSchedule: Array<{ assignment: Assignment; triggerDate: Date; title: string; body: string }> = [];
    for (const assignment of assignments) {
        if (!assignment.isoDate) continue;
        const dueDate = new Date(assignment.isoDate);
        if (dueDate > tenDaysFromNow) continue;
        const subjectName = typeof assignment.subject === 'string' ? assignment.subject : (assignment.subject as any).name || 'Subject';
        for (const interval of intervals) {
            const reminderTime = new Date(dueDate.getTime() - interval.hours * 60 * 60 * 1000);
            if (reminderTime > now) {
                // Android limit: DATE trigger fails >7 days, skip those
                const daysAhead = (reminderTime.getTime() - now.getTime()) / (24*60*60*1000);
                if (Platform.OS === 'android' && daysAhead > 7) continue;
                const timeText = interval.hours === 0.5 ? "30 minutes" : `${interval.hours} hour${interval.hours > 1 ? 's' : ''}`;
                toSchedule.push({
                  assignment,
                  triggerDate: reminderTime,
                  title: `${interval.emoji} ${interval.label}: ${assignment.title}`,
                  body: `Your assignment for ${subjectName} is due in ${timeText}.`
                });
            }
        }
    }
    // Batch schedule without sequential await blocking UI
    await Promise.allSettled(toSchedule.map(t => scheduleNotification(t.assignment, t.triggerDate, t.title, t.body)));
};

const scheduleNotification = async (
    assignment: Assignment, 
    triggerDate: Date, 
    title: string, 
    body: string
) => {
    if (Platform.OS === "web") return;
    try {
        await Notifications.scheduleNotificationAsync({
            content: {
                title,
                body,
                data: { assignmentId: assignment.id, url: assignment.link },
                sound: true,
            },
            trigger: { 
                type: Notifications.SchedulableTriggerInputTypes.DATE, 
                channelId: 'default',
                date: triggerDate 
            },
        });
        console.log(`Scheduled notification for "${assignment.title}" at ${triggerDate.toLocaleString()}`);
    } catch (error) {
        console.error(`Failed to schedule notification for ${assignment.title}`, error);
    }
};
