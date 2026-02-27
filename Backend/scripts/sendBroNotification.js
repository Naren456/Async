
import prisma from '../config/db.js';
import { sendPushNotification } from '../utils/notification.js';

const sendTestNotification = async () => {
    try {
        console.log('Finding user Narendra...');
        // Find user with name containing 'Smit'
        const user = await prisma.user.findFirst({
            where: {
                name: { contains: 'Soham', mode: 'insensitive' },
                pushToken: { not: null }
            }
        });

        if (!user) {
            console.error('User "Smit" with push token not found.');
            return;
        }

        console.log(`Found user: ${user.name} (${user.id})`);

        // Find an assignment due tomorrow (approx 24 hours from now) or just any future assignment
        const now = new Date();
        const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        
        let assignment = await prisma.assignment.findFirst({
            where: {
                dueDate: { gt: now } // Any future assignment
            },
            include: {
                subject: true
            },
            orderBy: {
                dueDate: 'asc' // Closest deadline
            }
        });

        if (!assignment) {
             console.log('No future assignment found. Creating a dummy one (in memory) for test.');
             assignment = {
                 title: "Test Assignment",
                 subject: { name: "Test Subject" },
                 link: "https://example.com"
             };
        } else {
             console.log(`Found assignment: ${assignment.title} for ${assignment.subject.name}`);
        }

        const safeName = user.name.split(' ')[0];
        const assignmentTitle = assignment.title;
        const subjectName = assignment.subject.name;

        // Specific 'Danger Bro' message requested (CRITICAL urgency)
        const message = `🤯 ${safeName}, scene serious hai! ${subjectName} ka "${assignmentTitle}" ke liye bas 45 mins bache hain. Jaldi kar le bhai!`;
        
        console.log(`Sending message: ${message}`);

        await sendPushNotification(user.pushToken, "Assignment Deadline", message, { url: assignment.link || '#' });
        console.log('Notification sent successfully.');

    } catch (error) {
        console.error('Error sending test notification:', error);
    } finally {
        await prisma.$disconnect();
    }
};

sendTestNotification();
