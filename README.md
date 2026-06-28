# Wanderlust – Airbnb-Inspired Property Listing Platform

A full-stack property listing web application inspired by Airbnb, built with **Node.js**, **Express**, **MongoDB**, and **EJS**. Users can browse listings, create and manage their own properties, leave reviews, and sign in with Google OAuth — all with a clean, responsive Bootstrap UI.

---

## Features

- User authentication (register/login with Passport.js + session management)
- Google OAuth 2.0 login for one-click sign-in
- Create, edit, and delete property listings with image uploads
- Cloud image storage via Cloudinary (auto-deleted on listing update/removal)
- Leave and delete reviews with star ratings
- Authorization — only listing owners and review authors can modify their content
- Flash messages for real-time success and error feedback
- Custom error handling with descriptive messages and proper HTTP status codes
- Session persistence with MongoDB Atlas (MongoStore)
- Fully responsive design with Bootstrap 5

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML5, CSS3, EJS, Bootstrap 5, ejs-mate |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Authentication | Passport.js, passport-local, passport-local-mongoose |
| OAuth | passport-google-oauth20, Google Cloud Console |
| Image Uploads | Multer, Cloudinary |
| Session Store | connect-mongo (MongoDB Atlas) |
| Validation | Joi |
| Deployment | Render |

---

## Live Demo

[https://wanderlust-e8eo.onrender.com](https://wanderlust-e8eo.onrender.com)

---

## How to Use

1. Register an account or sign in with Google.
2. Browse all available property listings on the home page.
3. Click any listing to view its details, location, and reviews.
4. Create your own listing with a title, description, price, location, and image.
5. Edit or delete your listings and manage your reviews from the listing page.

---

## Local Setup

1. Clone the repository and install dependencies:
   ```bash
   git clone https://github.com/ektasinghyadav/wanderlust.git
   cd wanderlust
   npm install
   ```

2. Create a `.env` file in the root directory and fill in your values:
   ```env
   ATLASDB_URL=your_mongodb_atlas_connection_string
   SECRET=your_session_secret
   CLOUD_NAME=your_cloudinary_cloud_name
   CLOUD_API_KEY=your_cloudinary_api_key
   CLOUD_API_SECRET=your_cloudinary_api_secret
   GOOGLE_CLIENT_ID=your_google_oauth_client_id
   GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
   ```

3. Start the server:
   ```bash
   node app.js
   ```

4. Open [http://localhost:8080](http://localhost:8080) in your browser.

---

## Project Structure

```
wanderlust/
├── controllers/       # Route handler logic (MVC controllers)
├── models/            # Mongoose schemas (User, Listing, Review)
├── routes/            # Express routers
├── views/             # EJS templates
│   ├── layouts/       # ejs-mate boilerplate layout
│   ├── listings/      # Listing pages (index, show, new, edit)
│   └── users/         # Login and register pages
├── public/            # Static assets (CSS, JS)
├── utils/             # ExpressError class, wrapAsync helper
├── middleware.js      # isLoggedIn, isOwner, isReviewAuthor
├── app.js             # Express app entry point
└── .env               # Environment variables (not committed)
```

---

## Author

**Ekta Singh Yadav**
GitHub: [@ektasinghyadav](https://github.com/ektasinghyadav)
