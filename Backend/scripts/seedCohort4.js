import prisma from '../config/db.js';

const subjects = [
  { code: 'ZC224', name: 'Graphs and Networks', semester: 4, term: 2 },
  { code: 'ZC312', name: 'Introduction to Data Analytics', semester: 4, term: 2 },
  { code: 'ZC217', name: 'Data Visualization', semester: 4, term: 2 },
  { code: 'ZC234', name: 'Programming Mobile Devices', semester: 4, term: 2 },
  { code: 'ZC222', name: 'Formal Languages and Applications', semester: 4, term: 2 }
];

async function seed() {
  for (const s of subjects) {
    await prisma.subject.upsert({
      where: { code: s.code },
      update: { name: s.name },
      create: s
    });
  }
  console.log('✅ Seeded Cohort 4 subjects');
  process.exit(0);
}

seed().catch(console.error);
