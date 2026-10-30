const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function decodeHtmlEntities(input) {
  if (!input) return "";
  let decoded = String(input);
  for (let i = 0; i < 6; i++) {
    const next = decoded
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#x27;/g, "'")
      .replace(/&#39;/g, "'")
      .replace(/&apos;/g, "'");
    if (next === decoded) break;
    decoded = next;
  }
  return decoded;
}

async function clean() {
  console.log("Cleaning database entities...");

  // Clean events
  const events = await prisma.event.findMany();
  for (const ev of events) {
    const updateData = {};
    if (ev.title) updateData.title = decodeHtmlEntities(ev.title);
    if (ev.groomName) updateData.groomName = decodeHtmlEntities(ev.groomName);
    if (ev.groomParents) updateData.groomParents = decodeHtmlEntities(ev.groomParents);
    if (ev.brideName) updateData.brideName = decodeHtmlEntities(ev.brideName);
    if (ev.brideParents) updateData.brideParents = decodeHtmlEntities(ev.brideParents);
    if (ev.quote) updateData.quote = decodeHtmlEntities(ev.quote);
    if (ev.story) updateData.story = decodeHtmlEntities(ev.story);
    if (ev.venueName) updateData.venueName = decodeHtmlEntities(ev.venueName);
    if (ev.venueAddress) updateData.venueAddress = decodeHtmlEntities(ev.venueAddress);
    if (ev.dressCode) updateData.dressCode = decodeHtmlEntities(ev.dressCode);

    await prisma.event.update({
      where: { id: ev.id },
      data: updateData,
    });
    console.log(`Cleaned Event: ${ev.slug} -> title: ${updateData.title}`);
  }

  // Clean guests
  const guests = await prisma.guest.findMany();
  for (const g of guests) {
    const updateData = {};
    if (g.name) updateData.name = decodeHtmlEntities(g.name);
    if (g.category) updateData.category = decodeHtmlEntities(g.category);
    if (g.tableNumber) updateData.tableNumber = decodeHtmlEntities(g.tableNumber);
    if (g.notes) updateData.notes = decodeHtmlEntities(g.notes);

    await prisma.guest.update({
      where: { id: g.id },
      data: updateData,
    });
    console.log(`Cleaned Guest: ${g.invitationCode} -> name: ${updateData.name}`);
  }

  console.log("All records cleaned successfully!");
}

clean()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
