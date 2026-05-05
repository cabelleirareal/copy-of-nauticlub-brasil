import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create test broker user
  const hashedPassword = await bcrypt.hash('Test123!', 10);

  const testBroker = await prisma.user.upsert({
    where: { email: 'broker@test.local' },
    update: {},
    create: {
      id: 'user-broker-test',
      email: 'broker@test.local',
      password: hashedPassword,
      name: 'João Corretor',
      phone: '+5511999999999',
      role: 'BROKER',
      subscriptionTier: 'PRO',
      brokerProfile: {
        create: {
          cnpj: '12.345.678/0001-90',
          licenseNumber: 'CRECI-SP-12345',
          bio: 'Corretor experiente em embarcações de luxo',
          cityRegion: 'São Paulo, SP',
        },
      },
    },
    include: { brokerProfile: true },
  });

  console.log('Test broker created:', testBroker);

  // Create test owner user
  const testOwner = await prisma.user.upsert({
    where: { email: 'owner@test.local' },
    update: {},
    create: {
      id: 'user-owner-test',
      email: 'owner@test.local',
      password: hashedPassword,
      name: 'Maria Proprietária',
      phone: '+5511988888888',
      role: 'OWNER',
      subscriptionTier: 'FREE',
    },
  });

  console.log('Test owner created:', testOwner);

  // Create test boat
  const testBoat = await prisma.boat.upsert({
    where: { id: 'boat-focker-333' },
    update: {},
    create: {
      id: 'boat-focker-333',
      name: 'Focker 333',
      brand: 'Focker',
      year: 2022,
      size: 33,
      price: 250000,
      type: 'Yacht',
      status: 'AVAILABLE',
      description: 'Iate de luxo com acabamentos premium',
      location: 'Santos, SP',
      marina: 'Marina do Gonzaga',
      specs: {
        pax: 6,
        engine: 'Twin 400 HP',
        cruising_speed: 25,
        max_speed: 35,
        fuel_capacity: 1000,
        year: 2022,
      },
      ownerId: testOwner.id,
      listingBrokerId: testBroker.id,
      openToPartnerships: true,
      defaultCommission: 5,
      featured: true,
      viewCount: 0,
    },
  });

  console.log('Test boat created:', testBoat);

  // Create test lead
  const testLead = await prisma.lead.create({
    data: {
      id: 'lead-test-001',
      boatId: testBoat.id,
      name: 'Carlos Interessado',
      email: 'carlos@example.com',
      phone: '+5511987654321',
      message: 'Tenho interesse em conhecer este iate',
      type: 'INTEREST',
      status: 'NEW',
      assignedBrokerId: testBroker.id,
      source: 'LISTING_BROKER',
    },
  });

  console.log('Test lead created:', testLead);

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
