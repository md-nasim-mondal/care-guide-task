# Care Guide Task - Monorepo

This repository contains the source code for the "Care Guide Task" application, structured as a monorepo with separate `client` and `server` directories.

## Project Structure

- **client/**: Contains the React frontend application built with Vite and TailwindCSS.
- **server/**: Contains the Node.js/Express backend application with MongoDB (Mongoose).

## Tech Stack

### Frontend (Client)

- React
- Vite
- TailwindCSS
- TypeScript
- React Router
- Axios for API requests

### Backend (Server)

- Node.js
- Express.js
- MongoDB with Mongoose
- TypeScript
- JWT Authentication

## Prerequisites

Before running the project, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [pnpm](https://pnpm.io/) (recommended package manager)
- [MongoDB](https://www.mongodb.com/) (local instance or Atlas URI)

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd care-guide-task
```

### 2. server Setup

Navigate to the `server` directory and install dependencies:

```bash
cd server
pnpm install
```

Create a `.env` file in the `server` directory with the following variables (example):

```env
PORT=5000
DB_URL=mongodb://localhost:27017/care-guide-db
BCRYPT_SALT_ROUNDS=12
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_ACCESS_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

Start the server:

```bash
pnpm run dev
```

The server should be running on `http://localhost:5000`.

### 3. Client Setup

Open a new terminal, navigate to the `client` directory, and install dependencies:

```bash
cd client
pnpm install
```

Create a `.env` file in the `client` directory (optional, if defaults are used):

```env
VITE_API_DIR=http://localhost:5000/api/v1
```

Start the client development server:

```bash
pnpm run dev
```

The client should be running on `http://localhost:5173`.

## Scripts

### Root specific scripts (if package.json exists in root)

Currently, scripts are managed within `client` and `server` directories respectively.

### Client Scripts

- `pnpm run dev`: Start development server
- `pnpm run build`: Build for production
- `pnpm run lint`: Run ESLint

### Server Scripts

- `pnpm run dev`: Start development server with hot-reload (nodemon/ts-node)
- `pnpm run build`: Compile TypeScript
- `pnpm start`: Run compiled server

## License

[MIT](LICENSE)
