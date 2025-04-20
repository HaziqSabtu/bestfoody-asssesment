# bestfoody-asssesment

## 📦 Installation

```bash
$ npm install
$ npm run setup
$ npm run start:dev
```
## 📦 Technologies

- **NestJS** – Scalable Node.js framework
- **Prisma** – Modern ORM
- **SQLite** – Database
- **Zod** – Schema validation
- **TypeScript** – Type safety
- **SOLID Principles** – Clean architecture

---

## 🧪 Features
### 🍽️ Restaurants
- View a list of restaurants with their name, category, picture, average rating, and reviews
- Search or filter restaurants by name and/or category
- Add a new restaurant with a name, category, and image
- View individual restaurant details including their rating and all reviews

### 📝 Reviews & Ratings
- Add a new rating and text review to any restaurant
- Each user can only review a restaurant once
- Restaurant's overall rating is calculated as the average of all its reviews
- Ratings are precomputed and retrieved from the RestaurantRating table

## 📡 API Endpoints

### 🔐 Authentication

| Method | Endpoint               | Description      |
|--------|------------------------|------------------|
| POST   | `/auth/sign-in`        | Sign in user     |

---

### 🍽️ Restaurants

| Method | Endpoint                              | Description                          |
|--------|---------------------------------------|--------------------------------------|
| GET    | `/restaurants`                        | Get all restaurants (optional filters: `name`, `category`, `cursor`) |
| GET    | `/restaurants/:restaurantId`          | Get restaurant by ID                 |
| POST   | `/restaurants`                        | Create new restaurant                |
| PUT    | `/restaurants/:restaurantId`          | Update restaurant by ID              |
| DELETE | `/restaurants/:restaurantId`          | Delete restaurant by ID              |

---

### 🖼️ Image

| Method | Endpoint                              | Description          |
|--------|---------------------------------------|----------------------|
| POST   | `/restaurants/upload-image`           | Upload restaurant image (returns `imageId`) |

---

### ✍️ Reviews

| Method | Endpoint                                                   | Description                      |
|--------|------------------------------------------------------------|----------------------------------|
| POST   | `/restaurants/:restaurantId/reviews`                       | Create a review for a restaurant |
| GET    | `/restaurants/:restaurantId/reviews`                       | Get all reviews for a restaurant |
| PUT    | `/restaurants/:restaurantId/reviews/:reviewId`             | Update a review by ID            |
| DELETE | `/restaurants/:restaurantId/reviews/:reviewId`             | Delete a review by ID            |

### 🧪 Postman
A ready-to-use Postman collection is available to simplify testing and interacting with the API.

**To import:**

1. Open Postman.

2. Click the "Import" button.

3. Select the "File" option.

4. Select the Postman collection JSON file located at:
`postman/Best-Foody.postman_collection.json`

5. Click "Import".

Once imported, you’ll see all the endpoints organized under the Restaurant App collection in your workspace.

This collection includes pre-filled requests for authentication, restaurant operations, image uploads, and reviews. 


## 🚀 Future Improvements

- ✅ **Move rating computation to an event-driven architecture**  
  Instead of calculating the average rating on the fly, trigger events when reviews are created or updated to recompute and store the restaurant's rating efficiently.

- 🔍 **Integrate with a search engine (e.g., Elasticsearch or Typesense)**  
  Improve restaurant discoverability and performance for search queries by integrating with a full-text search engine.

- ☁️ **Cloud storage support (e.g., Amazon S3, GCP Storage)**  
  Store images and media files securely in a cloud storage provider rather than keeping them locally.

- 🧪 **Add integration & end-to-end tests**  
  Ensure full system reliability with comprehensive test coverage, especially around user flows and critical paths.

- 🔐 **Add user roles and permissions**  
  Introduce roles such as admin, owner, and customer to enforce access control over different operations.

- ⏱ **Caching**  
  Use Redis or similar tools to cache frequent queries like top restaurants or filtered results.

- 🌐 **Multi-language/i18n support**  
  Enable internationalization for supporting multiple languages in the platform.

- 🧩 **Modular microservices structure**  
  Break down services into independently scalable units (e.g., auth, reviews, restaurant management).
