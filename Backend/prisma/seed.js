import { PrismaClient } from '../generated/prisma/index.js';

const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding ...');

    // Create Cohorts
    const cohort1 = await prisma.cohort.upsert({
        where: { cohortNo: 1 },
        update: {},
        create: {
            cohortNo: 1,
            semester: 1,
            term: 1,
        },
    });
    console.log(`Created cohort with id: ${cohort1.cohortNo}`);

    const cohort2 = await prisma.cohort.upsert({
        where: { cohortNo: 2 },
        update: {},
        create: {
            cohortNo: 2,
            semester: 2,
            term: 1,
        },
    });
    console.log(`Created cohort with id: ${cohort2.cohortNo}`);

    const cohort4 = await prisma.cohort.upsert({
        where: { cohortNo: 4 },
        update: {},
        create: { cohortNo: 4, semester: 1, term: 1 },
    });
    console.log(`Created cohort with id: ${cohort4.cohortNo}`);

    const cohort5 = await prisma.cohort.upsert({
        where: { cohortNo: 5 },
        update: {},
        create: { cohortNo: 5, semester: 1, term: 1 },
    });
    console.log(`Created cohort with id: ${cohort5.cohortNo}`);

    const cohort6 = await prisma.cohort.upsert({
        where: { cohortNo: 6 },
        update: {},
        create: { cohortNo: 6, semester: 1, term: 1 },
    });
    console.log(`Created cohort with id: ${cohort6.cohortNo}`);

    // Create Subjects (Optional but good for testing)
    // Create Subjects
    const subjects = [
        // Sem 1 Term 1
        { code: 'ZC313', name: 'Introduction to Programming', semester: 1, term: 1 },
        { code: 'ZC219', name: 'Discrete Mathematics', semester: 1, term: 1 },
        { code: 'ZC239', name: 'Writing Practice', semester: 1, term: 1 },
        // Sem 1 Term 2
        { code: 'ZC230', name: 'Linear Algebra and Optimization', semester: 1, term: 2 },
        { code: 'ZC228', name: 'Introduction to Computing Systems', semester: 1, term: 2 },
        { code: 'ZC111', name: 'Basic Electronics', semester: 1, term: 2 },
        // Sem 2 Term 1
        { code: 'ZC311', name: 'Data Structures and Algorithms', semester: 2, term: 1 },
        { code: 'ZC233', name: 'Probability and Statistics', semester: 2, term: 1 },
        { code: 'ZC112', name: 'Introduction to Logic', semester: 2, term: 1 },
        // Sem 2 Term 2
        { code: 'ZC316', name: 'Object Oriented Programming', semester: 2, term: 2 },
        { code: 'ZC215', name: 'Command Line Interfaces and Scripting', semester: 2, term: 2 },
        { code: 'ZC223', name: 'General Biology', semester: 2, term: 2 },
        { code: 'ZC240', name: 'General Physics', semester: 2, term: 2 },
        // Sem 3 Term 1
        { code: 'ZC212', name: 'Algorithm Design', semester: 3, term: 1 },
        { code: 'ZC238', name: 'Web Programming', semester: 3, term: 1 },
        { code: 'ZC216', name: 'Computer Systems and Performance', semester: 3, term: 1 },
        // Sem 3 Term 2
        { code: 'ZC317', name: 'Relational Databases', semester: 3, term: 2 },
        { code: 'ZC236', name: 'Software Design Principles', semester: 3, term: 2 },
        { code: 'ZC113', name: 'Online Social Media', semester: 3, term: 2 },
        { code: 'ZC114', name: 'Video Games - Technology and Social Impacts', semester: 3, term: 2 },
    ];

    for (const subject of subjects) {
        const s = await prisma.subject.upsert({
            where: { code: subject.code },
            update: {},
            create: subject,
        });
        console.log(`Created subject with code: ${s.code}`);
    }

    console.log('Seeding finished.');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
