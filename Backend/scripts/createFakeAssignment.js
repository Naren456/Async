import prisma from '../config/db.js';

async function main() {
  // Find any subject
  const subject = await prisma.subject.findFirst();

  if (!subject) {
    console.error("No subject found for cohort 4. Cannot create assignment.");
    process.exit(1);
  }

  const now = new Date();
  const dueDate = new Date(now.getTime() + 3 * 60 * 60 * 1000); // 3 hours from now

  const assignment = await prisma.assignment.create({
    data: {
      title: "Fake Notification Test (Due in 3 hours)",
      dueDate: dueDate,
      openingDate: now,
      cohortNo: 4,
      subjectCode: subject.code,
      link: "https://example.com/fake-assignment"
    }
  });

  console.log("Successfully created fake assignment!");
  console.log("Title:", assignment.title);
  console.log("Due Date:", assignment.dueDate);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
