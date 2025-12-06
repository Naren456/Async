
import prisma from './config/db.js';
// Remove direct PrismaClient instantiation to avoid conflicts or just use the one from config
// const prismaClient = new PrismaClient(); -> We will use 'prisma' imported above

const createTestAssignment = async () => {
    try {
        console.log("Checking for subject 'Software Design Principle'...");
        // 1. Find or Create Subject
        let subject = await prisma.subject.findFirst({
            where: { name: { contains: "Software Design Principles", mode: 'insensitive' } }
        });

        if (!subject) {
            console.log("Subject not found. Creating 'Software Design Principle'...");
            subject = await prisma.subject.create({
                data: {
                    name: "Software Design Principle",
                    code: "SDP101", // Arbitrary code
                    semester: 1,
                    term: 1
                }
            });
        }
        console.log(`Using Subject: ${subject.name} (${subject.code})`);

        // 2. Calculate Due Date (5 hours from now to trigger urgent reminder)
        const now = new Date();
        const dueDate = new Date(now.getTime() + 5.5 * 60 * 60 * 1000); // 5.5 hours from now

        // 3. Create Assignment
        console.log("Creating Assignment...");
        const assignment = await prisma.assignment.create({
            data: {
                title: "Test Assignment: SOLID Principles",
                cohortNo: 6, // Assuming cohort 6 for testing
                subjectCode: subject.code,
                dueDate: dueDate,
                link: "https://example.com/assignment",
            }
        });

        console.log(`✅ Assignment Created!`);
        console.log(`Title: ${assignment.title}`);
        console.log(`Due Date: ${assignment.dueDate.toLocaleString()}`);
        console.log(`Cohort: ${assignment.cohortNo}`);
        console.log(`ID: ${assignment.id}`);
        console.log("\nNOTE: The cron job runs every hour. To test immediately, you might need to manually trigger the scheduler logic or wait for the next hour.");

    } catch (e) {
        console.error("Error creating assignment:", e);
    } finally {
        await prisma.$disconnect();
    }
};

createTestAssignment();
