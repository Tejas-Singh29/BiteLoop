# BiteLoop

**BiteLoop** is a full-stack MERN application that reimagines food discovery as a vertical, swipeable video feed — similar to Instagram Reels or TikTok, but scoped entirely to food. The platform has two distinct user types:

- **Users** — browse the video feed, like and save dishes, and view a food partner's public profile and menu.
- **Food Partners** (restaurants/vendors) — register a business account, upload short video "reels" of their dishes, and build a public profile showcasing their menu.

Videos are stored and streamed via **ImageKit**, authentication is handled with **JWT stored in HTTP-only cookies**, and the backend exposes a clean REST API consumed by a **React + Vite** single-page frontend.

## Features

- 🎥 **Vertical video feed** with scroll-based autoplay (dish plays when ≥60% visible in the viewport, pauses otherwise, via `IntersectionObserver`)
- ❤️ **Like** and 🔖 **Save** any food video, with live count updates
- 👤 **Dual authentication system** — separate registration/login flows for regular Users and Food Partners
- 🏪 **Food partner public profiles** listing all dishes posted by that partner
- 📤 **Video upload pipeline** for food partners, streamed in-memory (via Multer) and pushed to ImageKit CDN storage
- 📌 **Saved feed** — a personal collection of every dish a user has bookmarked
- 🔐 **Cookie-based JWT sessions** with route-level middleware protection
- 📱 Mobile-first UI with a bottom navigation bar and top navigation bar

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, Vite 7, React Router 7, Axios |
| **Backend** | Node.js, Express 5 |
| **Database** | MongoDB with Mongoose ODM |
| **Auth** | JSON Web Tokens (JWT) + HTTP-only cookies, bcryptjs for password hashing |
| **File Uploads** | Multer (in-memory buffer) → ImageKit (video/media CDN) |
| **Tooling** | Nodemon, ESLint |

## Installation

Clone the repository and install dependencies for both the backend and frontend:

```bash
git clone https://github.com/<your-username>/BiteLoop.git
cd BiteLoop

# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

## Environment Variables

Create a `.env` file inside the **`backend/`** directory with the following variables:

```env
# MongoDB
MONGODB_URI=your_mongodb_connection_string

# JWT
JWT_SECRET=your_jwt_secret_key

# ImageKit (video storage & CDN)
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
```

> **Note:** The backend currently runs on a fixed port (`3000`) and CORS is configured for a frontend running at `http://localhost:5173` (the Vite default). Update `backend/src/app.js` if you change either.

## Running the App

Start the backend (from `backend/`):

```bash
npm run dev
```

This runs `nodemon server.js`, connecting to MongoDB and starting the Express server on **http://localhost:3000**.

Start the frontend (from `frontend/`):

```bash
npm run dev
```

This starts the Vite dev server, typically on **http://localhost:5173**.

Open the frontend URL in your browser — you should land on the food feed (or be redirected to login if not authenticated).

## API Reference

Base URL: `http://localhost:3000/api`

All protected routes require a valid `token` cookie (set automatically on login/register) and requests must be made with `credentials: 'include'` / `withCredentials: true`.

### Auth — `/api/auth`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/user/register` | — | Register a new user (`fullName`, `email`, `password`) |
| `POST` | `/user/login` | — | Log in a user (`email`, `password`) |
| `GET` | `/user/logout` | — | Log out the current user |
| `POST` | `/food-partner/register` | — | Register a food partner (`name`, `email`, `password`, `phone`, `address`, `contactName`) |
| `POST` | `/food-partner/login` | — | Log in a food partner (`email`, `password`) |
| `GET` | `/food-partner/logout` | — | Log out the current food partner |

### Food — `/api/food`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/` | Food Partner | Upload a new food video (`multipart/form-data`: `name`, `description`, video file) |
| `GET` | `/` | User | Get all food items in the feed |
| `POST` | `/like` | User | Like/unlike a food item (`foodId`) — toggles based on current state |
| `POST` | `/save` | User | Save/unsave a food item (`foodId`) — toggles based on current state |
| `GET` | `/save` | User | Get all food items saved by the current user |

### Food Partner — `/api/food-partner`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/:id` | User | Get a food partner's public profile plus all their food items |

## Data Models

| Model | Key Fields |
|---|---|
| **User** | `fullName`, `email` (unique), `password` (hashed) |
| **FoodPartner** | `name`, `contactName`, `phone`, `address`, `email` (unique), `password` (hashed) |
| **Food** | `name`, `video` (ImageKit URL), `description`, `foodPartner` (ref), `likeCount`, `savesCount` |
| **Like** | `user` (ref), `food` (ref), timestamps |
| **Save** | `user` (ref), `food` (ref), timestamps |

## Authentication & Authorization

- Passwords are hashed with **bcryptjs** before being stored.
- On successful register/login, a **JWT** signed with `JWT_SECRET` (payload: `{ id }`) is issued and set as an **HTTP-only cookie** named `token`.
- Two dedicated middlewares protect routes based on who is allowed to access them:
  - `authUserMiddleware` — verifies the token and attaches `req.user`
  - `authFoodPartnerMiddleware` — verifies the token and attaches `req.foodPartner`
- Logging out simply clears the `token` cookie.
