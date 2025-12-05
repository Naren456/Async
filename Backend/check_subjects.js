
import { PrismaClient } from './generated/prisma/index.js';
const prisma = new PrismaClient();

async function main() {
    const subjects = await prisma.subject.findMany();
    console.log('Subjects in DB:', subjects);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
