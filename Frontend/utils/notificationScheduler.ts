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

/**
 * Configure standard notification behavior if not already done in _layout or hook
 */
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

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

    for (const assignment of assignments) {
        if (!assignment.isoDate) continue;

        const dueDate = new Date(assignment.isoDate);
        const subjectName = typeof assignment.subject === 'string' ? assignment.subject : (assignment.subject as any).name || 'Subject';

        for (const interval of intervals) {
            const reminderTime = new Date(dueDate.getTime() - interval.hours * 60 * 60 * 1000);
            
            // Only schedule if the reminder time is in the future
            if (reminderTime > now) {
                const timeText = interval.hours === 0.5 ? "30 minutes" : `${interval.hours} hour${interval.hours > 1 ? 's' : ''}`;
                
                await scheduleNotification(
                    assignment, 
                    reminderTime, 
                    `${interval.emoji} ${interval.label}: ${assignment.title}`, 
                    `Your assignment for ${subjectName} is due in ${timeText}.`
                );
            }
        }
    }
};

const scheduleNotification = async (
    assignment: Assignment, 
    triggerDate: Date, 
    title: string, 
    body: string
) => {
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
