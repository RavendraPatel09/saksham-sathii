import { PrismaClient } from '@prisma/client';
import argon2 from 'argon2';
import { FallbackStore } from './services/fallbackStore';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Initialize the mock store too for fallback stability
  await FallbackStore.initialize();

  // Create demo credentials
  const demoUserEmail = 'demo.user@saksham.ai';
  const demoUserPass = 'sakshamUser2026';
  
  const demoAdminEmail = 'demo.admin@saksham.ai';
  const demoAdminPass = 'sakshamAdmin2026';

  const demoEmployerEmail = 'demo.employer@saksham.ai';
  const demoEmployerPass = 'sakshamEmployer2026';

  // Argon2 hashes
  const hashedUser = await argon2.hash(demoUserPass);
  const hashedAdmin = await argon2.hash(demoAdminPass);
  const hashedEmployer = await argon2.hash(demoEmployerPass);

  // Clear existing
  try {
    await prisma.user.deleteMany();
    await prisma.job.deleteMany();
    await prisma.course.deleteMany();
    await prisma.mentor.deleteMany();
    console.log('🧹 Cleaned existing tables.');
  } catch (e) {
    console.log('⚠️ Could not clear DB (tables might not exist yet or connection failed). Skipping cleanup.');
  }

  try {
    // 1. Seed Users
    const uUser = await prisma.user.create({
      data: {
        email: demoUserEmail,
        passwordHash: hashedUser,
        role: 'user',
      },
    });

    const uAdmin = await prisma.user.create({
      data: {
        email: demoAdminEmail,
        passwordHash: hashedAdmin,
        role: 'admin',
      },
    });

    const uEmployer = await prisma.user.create({
      data: {
        email: demoEmployerEmail,
        passwordHash: hashedEmployer,
        role: 'employer',
      },
    });

    console.log('✅ Seeded demo users.');

    // 2. Seed profile for user
    await prisma.profile.create({
      data: {
        userId: uUser.id,
        name: 'Rahul Desai',
        age: '26',
        gender: 'Male',
        city: 'Mumbai',
        state: 'Maharashtra',
        phone: '+91 98765 43210',
        disabilityType: 'Mobility impairment',
        severity: 'Severe',
        assistiveDevices: 'Wheelchair',
        communicationMode: 'Spoken English',
        educationLevel: 'Graduation Degree',
        degree: 'B.Sc. Computer Science',
        college: 'Mumbai University',
        certifications: 'React Certification',
        skills: ['React', 'CSS', 'JavaScript', 'Accounting', 'Data entry'],
        workMode: 'Remote',
        accessibilityNeeds: ['Ramp', 'Elevator', 'Accessible Parking', 'Flexible work hours'],
        aiSummary: 'Based on your profile, you possess strong potential in technical and communication fields.',
      },
    });

    console.log('✅ Seeded candidate user profile.');

    // 3. Seed Jobs
    for (const job of FallbackStore.jobs) {
      await prisma.job.create({
        data: {
          title: job.title,
          company: job.company,
          salary: job.salary,
          location: job.location,
          workMode: job.workMode,
          requiredSkills: job.requiredSkills,
          accessibility: job.accessibility,
          demand: job.demand,
          description: job.description,
          isReserved: job.isReserved,
          department: job.department,
          category: job.category,
          state: job.state,
          deadline: job.deadline,
          docs: job.docs,
        },
      });
    }
    console.log('✅ Seeded jobs database.');

    // 4. Seed Courses
    for (const course of FallbackStore.courses) {
      await prisma.course.create({
        data: {
          title: course.title,
          duration: course.duration,
          difficulty: course.difficulty,
          thumbnail: course.thumbnail,
        },
      });
    }
    console.log('✅ Seeded learning courses.');

    // 5. Seed Mentors
    for (const mentor of FallbackStore.mentors) {
      await prisma.mentor.create({
        data: {
          name: mentor.name,
          title: mentor.title,
          disability: mentor.disability,
          careerPath: mentor.careerPath,
          experience: mentor.experience,
          company: mentor.company,
          bio: mentor.bio,
          available: mentor.available,
          rating: mentor.rating,
          sessions: mentor.sessions,
          emoji: mentor.emoji,
        },
      });
    }
    console.log('✅ Seeded inclusive mentors list.');

  } catch (err: any) {
    console.error('❌ Prisma Seeding Error (Is database running?):', err.message);
  } finally {
    await prisma.$disconnect();
  }

  // Mandatory Single Print out of Credentials
  console.log('\n======================================================');
  console.log('🔑 DEMO CREDENTIALS (STORE SECURELY):');
  console.log(`👤 Role: user      | Email: ${demoUserEmail}   | Password: ${demoUserPass}`);
  console.log(`👤 Role: admin     | Email: ${demoAdminEmail}  | Password: ${demoAdminPass}`);
  console.log(`👤 Role: employer  | Email: ${demoEmployerEmail} | Password: ${demoEmployerPass}`);
  console.log('======================================================\n');
}

main()
  .catch((e) => {
    console.error('Fatal Seeding Failure:', e);
    process.exit(1);
  });
