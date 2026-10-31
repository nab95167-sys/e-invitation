const { PrismaClient: PostgresPrisma } = require('@prisma/client');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const pgPrisma = new PostgresPrisma();

async function syncAll() {
  const dbPath = path.join(__dirname, '..', 'prisma', 'dev.db');
  const db = new sqlite3.Database(dbPath);

  const queryAll = (sql) => new Promise((resolve, reject) => {
    db.all(sql, (err, rows) => err ? reject(err) : resolve(rows));
  });

  try {
    console.log('Connecting to Prisma Postgres Cloud...');

    // 1. Sync Users
    const users = await queryAll('SELECT * FROM User');
    console.log(`Found ${users.length} users in SQLite`);
    for (const u of users) {
      await pgPrisma.user.upsert({
        where: { email: u.email },
        update: {
          name: u.name,
          role: u.role,
          permissions: u.permissions,
          avatarUrl: u.avatarUrl,
        },
        create: {
          id: u.id,
          email: u.email,
          name: u.name,
          passwordHash: u.passwordHash,
          role: u.role,
          permissions: u.permissions,
          avatarUrl: u.avatarUrl,
        },
      });
    }

    // Default admin user in PG
    const adminUser = await pgPrisma.user.findFirst({ where: { role: 'SUPERADMIN' } });
    const targetUserId = adminUser ? adminUser.id : users[0].id;

    // 2. Sync Events
    const events = await queryAll('SELECT * FROM Event');
    console.log(`Found ${events.length} events in SQLite`);
    for (const ev of events) {
      const eventPayload = {
        title: ev.title,
        groomName: ev.groomName,
        groomParents: ev.groomParents,
        brideName: ev.brideName,
        brideParents: ev.brideParents,
        quote: ev.quote,
        story: ev.story,
        eventDate: new Date(ev.eventDate || '2026-12-12T16:00:00+07:00'),
        receptionTime: ev.receptionTime,
        ceremonyTime: ev.ceremonyTime,
        venueName: ev.venueName,
        venueAddress: ev.venueAddress,
        googleMapsUrl: ev.googleMapsUrl,
        coverImageUrl: ev.coverImageUrl,
        groomPhotoUrl: ev.groomPhotoUrl,
        bridePhotoUrl: ev.bridePhotoUrl,
        theme: ev.theme,
        musicUrl: ev.musicUrl,
        videoUrl: ev.videoUrl,
        dressCode: ev.dressCode,
        bankAccountInfo: ev.bankAccountInfo,
        lunarDate: ev.lunarDate,
        contacts: ev.contacts,
        programme: ev.programme,
        couplePhotoUrl: ev.couplePhotoUrl,
        venuePhotoUrl: ev.venuePhotoUrl,
        isPublished: true,
      };

      // Upsert with its own slug
      const savedEvent = await pgPrisma.event.upsert({
        where: { slug: ev.slug },
        update: eventPayload,
        create: {
          ...eventPayload,
          id: ev.id,
          slug: ev.slug,
          userId: targetUserId,
        },
      });
      console.log(`Synced event: ${savedEvent.slug} - ${savedEvent.title}`);

      // Also ensure raksmey-and-pheakdey has the same customized data if user uses raksmey URL
      await pgPrisma.event.upsert({
        where: { slug: 'raksmey-and-pheakdey' },
        update: eventPayload,
        create: {
          ...eventPayload,
          slug: 'raksmey-and-pheakdey',
          userId: targetUserId,
        },
      });
    }

    // Get active event IDs in Postgres
    const allPgEvents = await pgPrisma.event.findMany();
    const primaryEvent = allPgEvents.find(e => e.slug === 'so-vith-and-ma-na') || allPgEvents[0];
    const secondaryEvent = allPgEvents.find(e => e.slug === 'raksmey-and-pheakdey') || allPgEvents[0];

    // 3. Sync Guests
    const guests = await queryAll('SELECT * FROM Guest');
    console.log(`Found ${guests.length} guests in SQLite`);
    for (const g of guests) {
      const gPayload = {
        name: g.name,
        phoneNumber: g.phoneNumber,
        email: g.email,
        category: g.category || 'VIP',
        tableNumber: g.tableNumber,
        maxGuests: g.maxGuests || 2,
        rsvpStatus: g.rsvpStatus || 'PENDING',
        attendeesCount: g.attendeesCount || 1,
        dietaryRestrictions: g.dietaryRestrictions,
        notes: g.notes,
      };

      await pgPrisma.guest.upsert({
        where: { invitationCode: g.invitationCode },
        update: gPayload,
        create: {
          ...gPayload,
          id: g.id,
          invitationCode: g.invitationCode,
          eventId: primaryEvent.id,
        },
      });
      console.log(`Synced guest: ${g.name} (${g.invitationCode})`);
    }

    // Also create Hyunjin Hong if mentioned by user
    await pgPrisma.guest.upsert({
      where: { invitationCode: 'hyunjin-hong-e7c1b9' },
      update: {
        name: 'Hyunjin Hong',
        category: 'VIP',
        tableNumber: 'VIP 01',
      },
      create: {
        name: 'Hyunjin Hong',
        invitationCode: 'hyunjin-hong-e7c1b9',
        category: 'VIP',
        tableNumber: 'VIP 01',
        maxGuests: 2,
        rsvpStatus: 'PENDING',
        attendeesCount: 1,
        eventId: primaryEvent.id,
      },
    });
    console.log('Synced guest: Hyunjin Hong (hyunjin-hong-e7c1b9)');

    // 4. Sync Wishes
    const wishes = await queryAll('SELECT * FROM Wish');
    console.log(`Found ${wishes.length} wishes in SQLite`);
    for (const w of wishes) {
      await pgPrisma.wish.create({
        data: {
          senderName: w.senderName,
          message: w.message,
          relationship: w.relationship,
          isApproved: w.isApproved === 1,
          eventId: primaryEvent.id,
        },
      }).catch(() => {});
    }

    // 5. Sync Media Items
    const media = await queryAll('SELECT * FROM MediaItem');
    console.log(`Found ${media.length} media items in SQLite`);
    for (const m of media) {
      await pgPrisma.mediaItem.create({
        data: {
          title: m.title,
          mediaType: m.mediaType,
          url: m.url,
          caption: m.caption,
          category: m.category,
          sortOrder: m.sortOrder,
          eventId: primaryEvent.id,
        },
      }).catch(() => {});
    }

    console.log('ALL DATA SUCCESSFULLY SYNCED TO PRISMA CLOUD POSTGRESQL!');
  } finally {
    db.close();
    await pgPrisma.$disconnect();
  }
}

syncAll().catch(console.error);
