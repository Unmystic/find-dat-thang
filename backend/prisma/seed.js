const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient();

async function main() {
    console.log("Start seeding ...");

    // Clear existing data to prevent conflicts
    await prisma.score.deleteMany();
    await prisma.target.deleteMany();
    await prisma.game.deleteMany();
    await prisma.user.deleteMany();

    // Create an ADMIN user
    const hashedPassword = await bcrypt.hash("password123", 10);
    const adminUser = await prisma.user.create({
        data: {
            email: "admin@example.com",
            password: hashedPassword,
            name: "Admin User",
            role: "ADMIN",
        },
    });
    console.log(`Created admin user with email: ${adminUser.email}`);

    // Create the first game
    const game1 = await prisma.game.create({
        data: {
            title: "Snowman Party",
            imageUrl: "/images/1_polar-bear2.jpeg",
            target: {
                create: { name: "Polar Bear", x: 25.5, y: 35.5, radius: 7.5 },
            },
            scores: {
                create: [
                    { playerName: "Dudolf", timeInSeconds: 12 },
                    { playerName: "Frosty", timeInSeconds: 25 },
                ],
            },
        },
    });
    console.log(`Created game with id: ${game1.id}`);

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
