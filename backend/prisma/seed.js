const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding ...");

  // Create the first game: Snowman Party
  const game1 = await prisma.game.create({
    data: {
      title: "Snowman Party",
      // In a real app, you'd upload this to a CDN/storage and use that URL.
      // For now, we assume the frontend serves it from its public folder.
      imageUrl: "/images/1_polar-bear2.jpeg",
      target: {
        create: {
          name: "Polar Bear",
          x: 25.5,
          y: 35.5,
          radius: 7.5, // The user must click within this % radius of the center
        },
      },
      scores: {
        create: [
          { playerName: "Dudolf", timeInSeconds: 12 },
          { playerName: "Frosty", timeInSeconds: 25 },
          { playerName: "Olaf", timeInSeconds: 48 },
        ],
      },
    },
  });

  console.log(`Created game with id: ${game1.id}`);

  // You can add more games here for testing
  const game2 = await prisma.game.create({
    data: {
      title: "Ghost Story",
      // In a real app, you'd upload this to a CDN/storage and use that URL.
      // For now, we assume the frontend serves it from its public folder.
      imageUrl: "/images/1_ghost.jpeg",
      target: {
        create: {
          name: "Ghost",
          x: 55.5,
          y: 75.5,
          radius: 7.5, // The user must click within this % radius of the center
        },
      },
      scores: {
        create: [
          { playerName: "Dudolf", timeInSeconds: 12 },
          { playerName: "Frosty", timeInSeconds: 25 },
          { playerName: "Olaf", timeInSeconds: 48 },
        ],
      },
    },
  });
  console.log(`Created game with id: ${game2.id}`);

  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
