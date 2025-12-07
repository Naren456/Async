import prisma from './config/db.js';

const createTestAssignment = async () => {
    try {
        console.log("Creating test assignment...");

        // 1. Ensure Cohort Exists
        const cohortNo = 4;
        let cohort = await prisma.cohort.findUnique({
             where: { cohortNo: cohortNo } 
        });

        if (!cohort) {
            console.log(`Cohort ${cohortNo} not found. Creating it...`);
            cohort = await prisma.cohort.create({
                data: {
                    cohortNo: cohortNo,
                    semester: 1,
                    term: 1
                }
            });
        }
        console.log(`Using Cohort: ${cohort.cohortNo}`);


        // 2. Ensure Subject Exists
        const subjectName = "Software Design Principles";
        const subjectCode = "ZC236";

        let subject = await prisma.subject.findUnique({
            where: { code: subjectCode }
        });

        if (!subject) {
            console.log(`Subject '${subjectName}' not found. Creating it...`);
            subject = await prisma.subject.create({
                data: {
                    name: subjectName,
                    code: subjectCode,
                    semester: 1,
                    term: 1
                }
            });
        } else {
             // Update name just in case
             await prisma.subject.update({
                where: { code: subjectCode },
                data: { name: subjectName }
             });
        }
        console.log(`Using Subject: ${subject.name} (${subject.code})`);

        // 3. Create Assignment
        // Due in 38 minutes (Critical window is < 45 mins)
        const dueTime = new Date(new Date().getTime() + 38 * 60 * 1000); 

        // Delete existing identical assignment to avoid unique constraint violation on [title, cohortNo, subjectCode]
        const title = "Test Pattern & Principles";
        try {
             await prisma.assignment.delete({
                 where: {
                     title_cohortNo_subjectCode: {
                         title: title,
                         cohortNo: cohort.cohortNo,
                         subjectCode: subject.code
                     }
                 }
             });
             console.log("Cleaned up existing test assignment.");
        } catch (e) {
            // Ignore if not found
        }

        const assignment = await prisma.assignment.create({
            data: {
                title: title,
                subjectCode: subject.code,
                cohortNo: cohort.cohortNo,
                dueDate: dueTime,
                link: "https://example.com/test-assignment",
            }
        });

        console.log("-----------------------------------------");
        console.log(`✅ Success! Assignment Created:`);
        console.log(`Title: ${assignment.title}`);
        console.log(`Due Date: ${assignment.dueDate.toLocaleString()}`);
        console.log("-----------------------------------------");

    } catch (e) {
        console.error("Error creating test assignment:", e);
    } finally {
        await prisma.$disconnect();
    }
};

createTestAssignment();
