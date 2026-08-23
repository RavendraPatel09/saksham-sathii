import { faker } from '@faker-js/faker';

export const generateTestData = {
  user: () => ({
    email: faker.internet.email().toLowerCase(),
    password: 'sakshamUser2026',
    name: faker.person.fullName(),
    disabilityType: faker.helpers.arrayElement(['visual', 'mobility', 'hearing', 'neurodivergent']),
  }),

  job: () => ({
    title: faker.job.title(),
    description: faker.lorem.paragraphs(2),
    accommodations: faker.helpers.multiple(
      () => faker.helpers.arrayElement(['remote', 'flexible_hours', 'accessible_parking', 'quiet_room']),
      { count: 2 }
    ),
    salary: faker.number.int({ min: 300000, max: 2000000 }),
    skills: faker.helpers.multiple(
      () => faker.helpers.arrayElement(['Python', 'JavaScript', 'SQL', 'React', 'Node.js']),
      { count: 3 }
    ),
  }),

  assessment: () => ({
    skillsAssessed: ['Python', 'React', 'SQL'],
    duration: 10,
  }),
};
