import { PrismaClient } from '@prisma/client';

//mockData
import { restaurants as restaurantsMock } from './mockData/restaurants';
import { users as usersMock } from './mockData/users';
import { reviews as reviewsMock } from './mockData/reviews';
import { RestaurantCategoryType } from 'src/modules/restaurant/entities/restaurant.entity';

const prisma = new PrismaClient();

async function main() {
  // Clean current database
  await prisma.review.deleteMany({});
  await prisma.restaurantRating.deleteMany({});
  await prisma.restaurantImage.deleteMany({});
  await prisma.restaurant.deleteMany({});
  await prisma.user.deleteMany({});

  // Create Users
  const users = await prisma.user.createManyAndReturn({
    data: usersMock,
  });

  const firstTenUsers = users.slice(0, 10);

  const restaurants = await prisma.restaurant.createManyAndReturn({
    data: restaurantsMock.map((restaurant) => {
      const randomUser = firstTenUsers[Math.floor(Math.random() * 10)];
      return {
        ...restaurant,
        category: restaurant.category as RestaurantCategoryType,
        userId: randomUser.id,
      };
    }),
  });

  // Add Reviews
  for (const restaurant of restaurants) {
    // get random length from total reviews
    const randomReviewsLength = Math.floor(Math.random() * reviewsMock.length);

    const shuffledReviews = [...reviewsMock]
      .sort(() => Math.random() - 0.5)
      .splice(0, randomReviewsLength);

    const shuffledUsers = [...users]
      .sort(() => Math.random() - 0.5)
      .splice(0, randomReviewsLength);

    await prisma.review.createMany({
      data: shuffledReviews.map((review, index) => {
        return {
          ...review,
          restaurantId: restaurant.id,
          userId: shuffledUsers[index].id,
        };
      }),
    });
  }

  for (const { id: restaurantId, userId } of restaurants) {
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

    // 80 - 20 percent chance of having image
    const shouldHaveImage = Math.random() < 0.8;

    if (shouldHaveImage) {
      const imageId = restaurantId.replaceAll('-', '');
      const mockCdnUrl = 'https://cdn.example.com/' + imageId + '.jpg';
      const image = await prisma.restaurantImage.create({
        data: {
          url: mockCdnUrl,
          userId: userId,
        },
      });

      await prisma.restaurant.update({
        where: { id: restaurantId },
        data: {
          imageId: image.id,
        },
      });
    }
  }
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
