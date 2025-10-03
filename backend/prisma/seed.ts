import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: adminPassword,
      role: 'admin'
    }
  });

  // Create staff user
  const staffPassword = await bcrypt.hash('staff123', 10);
  const staff = await prisma.user.upsert({
    where: { username: 'staff' },
    update: {},
    create: {
      username: 'staff',
      password: staffPassword,
      role: 'staff'
    }
  });

  // Create computers
  const computers = await prisma.computer.createMany({
    data: [
      { name: 'PC-01', hourlyRate: 25.0 },
      { name: 'PC-02', hourlyRate: 25.0 },
      { name: 'PC-03', hourlyRate: 30.0 },
      { name: 'PC-04', hourlyRate: 30.0 },
      { name: 'VIP-01', hourlyRate: 50.0 }
    ],
    skipDuplicates: true
  });

  // Create some active sessions
  const currentDate = new Date();
  await prisma.session.createMany({
    data: [
      {
        computerId: 1,
        user: 'Regular Customer',
        startTime: new Date(currentDate.getTime() - 30 * 60 * 1000), // 30 minutes ago
        isPaid: false
      },
      {
        computerId: 3,
        user: 'VIP Customer',
        startTime: new Date(currentDate.getTime() - 15 * 60 * 1000), // 15 minutes ago
        isPaid: false
      }
    ]
  });

  console.log('Seed data created successfully:');
  console.log(`- Admin user: admin / admin123`);
  console.log(`- Staff user: staff / staff123`);
  console.log(`- ${computers.count} computers created`);
  console.log(`- 2 active sessions created`);
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
  
  })
  .finally(async () => {
    await prisma.$disconnect();
  });