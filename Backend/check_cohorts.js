
import { PrismaClient } from './generated/prisma/index.js';
const prisma = new PrismaClient();

async function main() {
    const cohorts = await prisma.cohort.findMany();
    console.log('Cohorts in DB:', cohorts);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
