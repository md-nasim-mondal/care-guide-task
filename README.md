# Care Guide Task - Secure Note-Taking Application

A robust MERN stack application featuring role-based access control, secure authentication, and a community post system.

## 🌍 Deployment

- **Backend:** [https://care-guide-note-app-server.vercel.app](https://care-guide-note-app-server.vercel.app)
- **Frontend:** [https://care-guide-note-app.vercel.app](https://care-guide-note-app.vercel.app)

## 🚀 Features

### Core Functionality

- **Authentication**: Secure JWT-based auth (Access/Refresh Tokens) with Bcrypt password hashing.
  - _Note: 2-Step Verification is currently **DISABLED** for easier testing purposes._
- **Role-Based Access Control (RBAC)**:
  - **User**: Manage own notes, create posts, view community feed.
  - **Admin**: Manage all users, all notes, and all community posts.
- **Note Management**: CRUD operations for personal notes.
- **Community System**:
  - **Feed**: View and create posts visible to everyone.
  - **User Profile**: View specific user details and their aggregated posts (using `$lookup`).
  - **Post Editing**: Edit own posts (or any post as Admin).

### Technical Highlights

- **Pagination**: Implemented for Users, Notes, and Posts lists.
- **optimized Indexing**: Strategically indexed fields (`email`, `author`) to support queries while avoiding unnecessary overhead.
- **Aggregations**:
  - **Scenario 1**: Group users by interest (`$unwind`, `$group`).
  - **Scenario 2**: Fetch user posts (`$lookup`).
- **Responsive UI**: Built with React, TailwindCSS, and reusable components.

## 🛠 Tech Stack

- **Frontend**: React, Vite, TypeScript, TailwindCSS, React Router, React Hot Toast.
- **Backend**: Node.js, Express, MongoDB (Mongoose), TypeScript, Zod (Validation).

## 🏁 Getting Started

### Prerequisites

- Node.js (v18+)
- pnpm (recommended) or npm
- MongoDB (Local or Atlas)

### 1. Setup Backend

```bash
cd server
pnpm install

# Create .env file
cp .env.example .env # (Or copy the config below)

# Seed Database (Creates Demo Admin & User)
pnpm run seed
# Output:
# Admin: admin@example.com / 123456
# User: user@example.com / 123456

# Start Dev Server
pnpm run dev
```

**Backend `.env` Configuration:**

```env
# Development
PORT=5000
DB_URL=mongodb://localhost:27017/care-guide-task
NODE_ENV=development
BCRYPT_SALT_ROUND=12
JWT_ACCESS_SECRET=your_access_secret_here
JWT_ACCESS_EXPIRES=1d
JWT_REFRESH_SECRET=your_refresh_secret_here
JWT_REFRESH_EXPIRES=365d
FRONTEND_URL=http://localhost:5173

# Production
PORT=5000
DB_URL=your_production_mongo_url
NODE_ENV=production
BCRYPT_SALT_ROUND=12
JWT_ACCESS_SECRET=your_access_secret_here
JWT_ACCESS_EXPIRES=1d
JWT_REFRESH_SECRET=your_refresh_secret_here
JWT_REFRESH_EXPIRES=365d
FRONTEND_URL=https://care-guide-note-app.vercel.app
```

### 2. Setup Frontend

```bash
cd client
pnpm install

# Start Dev Server
pnpm run dev
```

**Frontend `.env` Configuration:**

```env
# Development
VITE_API_DIR=http://localhost:5000/api/v1

# Production
VITE_API_DIR=https://care-guide-note-app-server.vercel.app/api/v1
```

## 🧪 Demo Credentials

The login page includes a **"Use Demo Credentials"** feature. Click the button to instantly autofill:

| Role      | Email               | Password |
| :-------- | :------------------ | :------- |
| **Admin** | `admin@example.com` | `123456` |
| **User**  | `user@example.com`  | `123456` |

## 📂 Project Structure

```
├── client/              # React Frontend
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page views (Admin/User)
│   │   ├── hooks/       # Custom hooks (useAuth)
│   │   └── api/         # Axios setup
├── server/              # Express Backend
│   ├── src/
│   │   ├── app/
│   │   │   ├── modules/ # Feature modules (User, Note, Post)
│   │   │   └── utils/   # Helpers (QueryBuilder, AppError)
│   │   └── scripts/     # Utility scripts (seed.ts)
```

## 📜 License

MIT
