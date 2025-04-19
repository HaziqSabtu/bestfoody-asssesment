import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clean current database
  await prisma.review.deleteMany({});
  await prisma.restaurant.deleteMany({});
  await prisma.restaurantRating.deleteMany({});
  await prisma.restaurantImage.deleteMany({});
  await prisma.user.deleteMany({});

  // Create Users
  const alice = await prisma.user.create({
    data: {
      email: 'alice@example.com',
      name: 'Alice',
    },
  });

  const bob = await prisma.user.create({
    data: {
      email: 'bob@example.com',
      name: 'Bob',
    },
  });

  // Create Restaurants
  const pizzaPlace = await prisma.restaurant.create({
    data: {
      name: 'Pizza Palace',
      category: 'ITALIAN',
    },
  });

  const sushiSpot = await prisma.restaurant.create({
    data: {
      name: 'Sushi Central',
      category: 'JAPANESE',
    },
  });

  // Add Reviews
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const reviews = await prisma.review.createMany({
    data: [
      {
        userId: alice.id,
        restaurantId: pizzaPlace.id,
        rating: 4,
        reviewText: 'Delicious crust!',
      },
      {
        userId: bob.id,
        restaurantId: pizzaPlace.id,
        rating: 5,
        reviewText: 'Best pizza in town!',
      },
      {
        userId: alice.id,
        restaurantId: sushiSpot.id,
        rating: 3,
        reviewText: 'Good but pricey.',
      },
    ],
  });

  // Compute and insert average ratings manually
  const restaurants = [pizzaPlace.id, sushiSpot.id];

  for (const restaurantId of restaurants) {
    const ratings = await prisma.review.findMany({
      where: { restaurantId, deletedAt: null },
      select: { rating: true },
    });

    const reviewCount = ratings.length;
    const averageRating = reviewCount
      ? parseFloat(
          (ratings.reduce((sum, r) => sum + r.rating, 0) / reviewCount).toFixed(
            1,
          ),
        )
      : 0;

    await prisma.restaurantRating.upsert({
      where: { restaurantId },
      update: {
        averageRating,
        reviewCount,
        lastUpdated: new Date(),
      },
      create: {
        restaurantId,
        averageRating,
        reviewCount,
      },
    });
  }

  await prisma.restaurantImage.createMany({
    data: [
      {
        url: 'https://cdn.example.com/pizza.jpg',
        userId: alice.id,
      },
      {
        url: 'https://cdn.example.com/sushi.jpg',
        userId: bob.id,
      },
    ],
  });
}

main()
  .then(() => {
    console.log('🌱 Seeding complete.');
    return prisma.$disconnect();
  })
  .catch((e) => {
    console.error(e);
    return prisma.$disconnect().finally(() => process.exit(1));
  });
