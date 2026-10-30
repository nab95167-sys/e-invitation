const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding initial data...');

  // Passwords
  const adminPassword = await bcrypt.hash('Admin@123456', 10);
  const couplePassword = await bcrypt.hash('Wedding@2026', 10);
  const organizerPassword = await bcrypt.hash('Organizer@2026', 10);

  // 1. Create Users
  const admin = await prisma.user.upsert({
    where: { email: 'admin@wedding.com' },
    update: {},
    create: {
      email: 'admin@wedding.com',
      name: 'System Administrator',
      passwordHash: adminPassword,
      role: 'SUPERADMIN',
    },
  });

  const couple = await prisma.user.upsert({
    where: { email: 'alex.sophia@wedding.com' },
    update: {},
    create: {
      email: 'alex.sophia@wedding.com',
      name: 'Alex & Sophia',
      passwordHash: couplePassword,
      role: 'COUPLE',
    },
  });

  const organizer = await prisma.user.upsert({
    where: { email: 'organizer@wedding.com' },
    update: {},
    create: {
      email: 'organizer@wedding.com',
      name: 'Claire Wedding Planner',
      passwordHash: organizerPassword,
      role: 'ORGANIZER',
    },
  });

  // 2. Create Event (Raksmey & Pheakdey)
  const raksmeyDate = new Date('2026-11-15T16:00:00+07:00');

  const raksmeyEvent = await prisma.event.upsert({
    where: { slug: 'raksmey-and-pheakdey' },
    update: {
      title: 'សិរីសួស្តីអាពាហ៍ពិពាហ៍ · ផៃ រស្មី & មាស ភក្ដី',
      groomName: 'ផៃ រស្មី',
      groomParents: 'លោក ផៃ សុខន និង អ្នកស្រី យ៉ាន់ ចាន់ណារ៉ា',
      brideName: 'មាស ភក្ដី',
      brideParents: 'លោក ហែម សាវឿន និង អ្នកស្រី សៅ ណឺង',
      quote: '"ជីវិតពីរ បេះដូងពីរ ភ្ជាប់គ្នាដោយមិត្តភាព រួបរួមគ្នាជារៀងរហូតដោយសេចក្តីស្រឡាញ់"',
      story: 'ពីពេលព្រឹក ដល់ពេលល្ងាច ដំណើររឿងនៃស្នេហ៍ក្រោមពន្លឺភ្លើងទៀន និងការបណ្តែតប្រទីបក្ដីប្រាថ្នាជាមួយគ្នា។',
      eventDate: raksmeyDate,
      ceremonyTime: '6:30 ព្រឹក - 12:00 ថ្ងៃត្រង់',
      receptionTime: '4:00 រសៀល - 9:00 យប់',
      venueName: 'គេហដ្ឋានខាងស្រី (The Bride’s House)',
      venueAddress: 'ភូមិព្រែកហូរលិច១ សង្កាត់ព្រែកហូរ ក្រុងតាខ្មៅ ខេត្តកណ្តាល',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=11.45128,104.93335',
      coverImageUrl: '/raksmey-assets/img/hero-2000.webp',
      groomPhotoUrl: '/raksmey-assets/img/cozy-1280.webp',
      bridePhotoUrl: '/raksmey-assets/img/words-1280.webp',
      theme: 'royal_khmer_olive',
      musicUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-piano-112199.mp3',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      dressCode: 'សម្លៀកបំពាក់ប្រពៃណីខ្មែរ ឬ សម្លៀកបំពាក់សមរម្យ (Traditional Khmer / Formal Attire)',
      bankAccountInfo: 'KHQR: 096 7 717 278 (មាស ភក្ដី) | ABA PAY: PHEKEDEY MEAS',
    },
    create: {
      slug: 'raksmey-and-pheakdey',
      title: 'សិរីសួស្តីអាពាហ៍ពិពាហ៍ · ផៃ រស្មី & មាស ភក្ដី',
      groomName: 'ផៃ រស្មី',
      groomParents: 'លោក ផៃ សុខន និង អ្នកស្រី យ៉ាន់ ចាន់ណារ៉ា',
      brideName: 'មាស ភក្ដី',
      brideParents: 'លោក ហែម សាវឿន និង អ្នកស្រី សៅ ណឺង',
      quote: '"ជីវិតពីរ បេះដូងពីរ ភ្ជាប់គ្នាដោយមិត្តភាព រួបរួមគ្នាជារៀងរហូតដោយសេចក្តីស្រឡាញ់"',
      story: 'ពីពេលព្រឹក ដល់ពេលល្ងាច ដំណើររឿងនៃស្នេហ៍ក្រោមពន្លឺភ្លើងទៀន និងការបណ្តែតប្រទីបក្ដីប្រាថ្នាជាមួយគ្នា។',
      eventDate: raksmeyDate,
      ceremonyTime: '6:30 ព្រឹក - 12:00 ថ្ងៃត្រង់',
      receptionTime: '4:00 រសៀល - 9:00 យប់',
      venueName: 'គេហដ្ឋានខាងស្រី (The Bride’s House)',
      venueAddress: 'ភូមិព្រែកហូរលិច១ សង្កាត់ព្រែកហូរ ក្រុងតាខ្មៅ ខេត្តកណ្តាល',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=11.45128,104.93335',
      coverImageUrl: '/raksmey-assets/img/hero-2000.webp',
      groomPhotoUrl: '/raksmey-assets/img/cozy-1280.webp',
      bridePhotoUrl: '/raksmey-assets/img/words-1280.webp',
      theme: 'royal_khmer_olive',
      musicUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-piano-112199.mp3',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      dressCode: 'សម្លៀកបំពាក់ប្រពៃណីខ្មែរ ឬ សម្លៀកបំពាក់សមរម្យ (Traditional Khmer / Formal Attire)',
      bankAccountInfo: 'KHQR: 096 7 717 278 (មាស ភក្ដី) | ABA PAY: PHEKEDEY MEAS',
      userId: couple.id,
    },
  });

  const event = raksmeyEvent;

  // 3. Create Sample Guests with unique invitation tokens
  const guestsData = [
    {
      name: 'Dr. Jonathan & Sarah Hastings',
      phoneNumber: '+1-555-0192',
      email: 'jonathan.h@example.com',
      invitationCode: 'vip-hastings-2026',
      category: 'VIP',
      tableNumber: 'Table 1 - Royal Orchid',
      maxGuests: 2,
      rsvpStatus: 'ATTENDING',
      attendeesCount: 2,
      dietaryRestrictions: 'Vegetarian for Sarah',
      notes: 'Delighted to celebrate with you both!',
    },
    {
      name: 'Marcus & Elena Vance',
      phoneNumber: '+1-555-0144',
      email: 'marcus.v@example.com',
      invitationCode: 'family-vance-771',
      category: 'Family',
      tableNumber: 'Table 3 - Golden Peony',
      maxGuests: 3,
      rsvpStatus: 'ATTENDING',
      attendeesCount: 3,
      dietaryRestrictions: 'No seafood',
      notes: 'Can not wait for the big day!',
    },
    {
      name: 'Jessica Reynolds',
      phoneNumber: '+1-555-0189',
      email: 'jess.reynolds@example.com',
      invitationCode: 'friend-jess-902',
      category: 'Friend',
      tableNumber: 'Table 6 - White Jasmine',
      maxGuests: 1,
      rsvpStatus: 'PENDING',
      attendeesCount: 1,
    },
    {
      name: 'Honorable Senator David Chen',
      phoneNumber: '+1-555-0167',
      email: 'david.chen@example.com',
      invitationCode: 'vip-chen-449',
      category: 'VIP',
      tableNumber: 'Table 1 - Royal Orchid',
      maxGuests: 2,
      rsvpStatus: 'DECLINED',
      attendeesCount: 0,
      notes: 'Hearty congratulations! Sadly sending warm wishes from Geneva summit.',
    },
  ];

  for (const g of guestsData) {
    await prisma.guest.upsert({
      where: { invitationCode: g.invitationCode },
      update: {},
      create: {
        ...g,
        eventId: event.id,
      },
    });
  }

  // 4. Sample Wishes
  const wishesData = [
    {
      senderName: 'Uncle Robert & Aunt Clara',
      relationship: 'Family',
      message: 'Wishing you both a lifetime of deep companionship, immense joy, and unwavering love. May God bless your beautiful marriage!',
    },
    {
      senderName: 'Liam & Olivia (Paris Crew)',
      relationship: 'Close Friends',
      message: 'From that tiny Parisian coffee shop to the altar! We could not be prouder and happier for you two soulmates. Cheers!',
    },
    {
      senderName: 'Grace Miller',
      relationship: 'Bridesmaid',
      message: 'Sophia, you are going to be the most radiant bride on earth! Counting down every second to dance the night away!',
    },
  ];

  for (const w of wishesData) {
    await prisma.wish.create({
      data: {
        ...w,
        eventId: event.id,
      },
    });
  }

  // 5. Sample Gallery Photos & Videos
  const mediaItems = [
    {
      title: 'The Engagement in Florence',
      mediaType: 'PHOTO',
      url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80',
      caption: 'Sunset over Piazzale Michelangelo where we said forever.',
      category: 'STORY',
      sortOrder: 1,
    },
    {
      title: 'Pre-Wedding Coastal Breeze',
      mediaType: 'PHOTO',
      url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80',
      caption: 'Golden hour smiles along the Pacific coast.',
      category: 'GALLERY',
      sortOrder: 2,
    },
    {
      title: 'Romantic Evening Waltz',
      mediaType: 'PHOTO',
      url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
      caption: 'Practicing our first dance under fairy lights.',
      category: 'GALLERY',
      sortOrder: 3,
    },
    {
      title: 'Love Letters & Rings',
      mediaType: 'PHOTO',
      url: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1200&q=80',
      caption: 'Handcrafted rings with custom engraved coordinates.',
      category: 'GALLERY',
      sortOrder: 4,
    },
  ];

  for (const m of mediaItems) {
    await prisma.mediaItem.create({
      data: {
        ...m,
        eventId: event.id,
      },
    });
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
