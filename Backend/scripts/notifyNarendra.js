import prisma from '../config/db.js';
import { sendPushNotification } from '../utils/notification.js';

const sendNarendraNotification = async () => {
    try {
        console.log("🔍 Searching for user 'narendra'...");
        
        // Find user by name (case-insensitive) or email
        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { name: { contains: 'narendra', mode: 'insensitive' } },
                    { email: { contains: 'narendra', mode: 'insensitive' } }
                ]
            }
        });

        if (!user) {
            console.log("❌ User 'narendra' not found in database.");
            process.exit(1);
        }

        console.log(`✅ Found user: ${user.name} (${user.email})`);

        if (!user.pushToken) {
            console.log("❌ User does not have a registered push token.");
            process.exit(1);
        }

        console.log(`📱 Push token found: ${user.pushToken}`);
        console.log("🚀 Sending test notification...");

        const tickets = await sendPushNotification(
            user.pushToken,
            "Hello Narendra! 👋",
            "This is a test notification from your backend script."
        );

        console.log("📨 Notification sent successfully! Tickets:", tickets);
        process.exit(0);

    } catch (error) {
        console.error("❌ Error sending notification:", error);
        process.exit(1);
    }
};

// Execute
sendNarendraNotification();
