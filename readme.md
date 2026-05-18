# VideoHive Backend

A simple Node.js + Express + TypeScript backend project with MongoDB connection and starter auth/contact routes.

## Tech Stack

- Node.js
- TypeScript
- Express
- MongoDB / Mongoose
- dotenv
- ts-node-dev

## Prerequisites

- Node.js (v18+ recommended)
- npm
- A MongoDB connection string (MongoDB Atlas or local MongoDB)

## Environment Variables

Create a `.env` file in the project root:

```env
MONGO_URL=your_mongodb_connection_string
JWT_SECRET_KEY=your_jwt_secret_key
CLOUDINARY_API_SECRET=cloudinary_api_secret_here
CLOUDINARY_API_KEY=cloudinary_api_key_here
CLOUDINARY_CLOUD_NAME=cloudinary_cloud_name_here
```

### Variable Details

- `MONGO_URL`: MongoDB connection URI used by `config/db.ts`.
- `JWT_SECRET_KEY`: Secret key for signing JWT tokens.

## Setup

1. Clone the repository.
2. Open a terminal in the project root.
3. Install dependencies:

```bash
npm install
```

4. Create and update `.env` with your environment variables.

## Run the Project

Start the development server:

```bash
npm start
```

The server runs on:

- `http://localhost:5555`

## Available Endpoints

- `GET /` -> health/welcome response
- `GET /about` -> basic about response
- `POST /contact` -> contact form validation route
- `POST /login` -> starter login route

## Example Test Requests

### Login

```bash
curl -X POST http://localhost:5555/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"123456"}'
```

### Contact

```bash
curl -X POST http://localhost:5555/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com","password":"123456","message":"Hello"}'
```

## Notes

- The app currently listens on a fixed port `5555`.
- Database connection is optional at startup, but most real features will require a valid `MONGO_URL`.
