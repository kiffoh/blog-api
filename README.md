# Blog API

This project, developed as part of the [Odin Project](https://www.theodinproject.com/lessons/nodejs-messaging-app), is a full-stack blog platform featuring a React frontend and a RESTful API. Users can create, read, update, and delete blog posts and comments with secure JWT authentication.

## 📚 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Demo](#demo)
- [Project Structure](#project-structure)
- [Technologies](#technologies)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Setup](#environment-setup)
  - [Database Schema](#database-schema)
- [API Documentation](#api-documentation)
  - [Authentication](#authentication)
  - [Users](#users)
  - [Posts](#posts)
  - [Comments](#comments)
- [Authorisation](#authorisation)
- [Error Handling](#error-handling)
- [Contributing](#contributing)

## Overview

A modern blog platform built with React and Express.js, featuring:
- Clean, responsive UI built with React and Vite
- Secure REST API with JWT authentication
- CRUD operations for posts and comments
- Role-based authorisation
- PostgreSQL database with Prisma ORM

## Features

- 🔐 Secure user authentication
- ✍️ Create and manage blog posts
- 💬 Engage through comments
- 👤 User profiles
- 🛡️ Role-based access control
- 📱 Responsive design

## Demo
[The website is live](https://blog-api-kipper.netlify.app/). Log in with the demo credentials to explore the features of the full-stack application:
- **username**: guest
- **password**: iamaguest

## Project Structure

```
blog-api/
├── client/             # React frontend
    ├── public/           # Static assets (e.g., icons, images)
    ├── src/
        ├── components/    # React components
        ├── pages/        # Page components
        └── services/     # API service calls
    ├── .env files        # Environment configuration
    ├── .gitignore        # Git ignore file
    ├── eslint.config.js  # ESLint configuration
    ├── index.html        # HTML entry point
    ├── package-lock.json # Dependency lock file
    ├── package.json      # Node.js project manifest
    └── vite.config.js    # Vite configuration
├── server/                # Express backend
    ├── config/             # Custom middleware
    ├── controllers/        # Route controllers
    ├── bin/                # Server entry point
    ├── routes/             # API routes
    ├── prisma/             # Database schema and migrations
    ├── .env files          # Environment configuration
    ├── .gitignore          # Git ignore file
    ├── app.js              # Server entry point
    ├── package-lock.json   # Dependency lock file
    └── package.json        # Node.js project manifest
```

## Technologies

### Frontend
- React 18
- Vite
- React Router

### Backend
- Express.js
- Prisma (ORM)
- Passport JWT
- Node.js

### Database
- PostgreSQL

## Getting Started

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL database

## Installation

1. Clone the repository:
   ```bash
   git clone git@github.com:kiffoh/blog-api.git
   cd blog-api
   ```

2. Install dependencies:
   ```bash
   # Install backend dependencies
   cd server
   npm install
   
   # Install frontend dependencies
   cd ../client
   npm install
   ```

## **Environment Setup**
To set up your environment, create a `.env` file in the root folders of your project (e.g. in the client and server folder). These files should contain the following required environment variables, along with descriptions for each:

### **Frontend Configuration**
- **VITE_ENV**: Set to `development` or `production` to specify the environment.
- **VITE_SERVER_URL**: URL for your backend application

### **Backend Configuration**
#### Server Configuration
- **NODE_ENV**: Set to `development` or `production` to specify the environment.
- **JWT_SECRET**: Secret key for signing tokens
- **FRONTEND_URL**: URL for your frontend application

#### Database Configuration
- **DATABASE_URL**: Connection string for your database

If you want to have separate environment files for production and development, you can create `.env.production` and `.env.development`. You will also need to set the `NODE_ENV` variable in the command line or use the `cross-env` package (already a dependency) for Windows users. 

### Example `.env.development` File for Backend
```bash
NODE_ENV=development
DATABASE_URL=database-url
FRONTEND_URL=api-url
JWT_SECRET='your-secret-key'
```

### Notes
- Ensure that you replace the placeholder values with your actual configuration.
- Keep your `.env` file out of version control by adding it to your `.gitignore`.

## **Database Schema**
The schema is implemented using Prisma with PostgreSQL as the database provider.

To apply the database schema migrations, run the following command:
```bash
npx prisma migrate dev
```

Alternatively, you can use the commands defined in the package.json, which allow specifying the development or production database:
```bash
"migrate:dev": "cross-env DATABASE_URL=development-url npx prisma migrate dev",
"migrate:prod": "cross-env DATABASE_URL=production-url npx prisma migrate dev",
```

### Notes
- **Environment-specific migrations**: Ensure that you set the `NODE_ENV` to either `development` or `production` before running the migration commands.
- **Windows users**: You must use `cross-env` to set environment variables, as shown in the `package.json` commands.
- **macOS/Linux users**: You can remove `cross-env` from the commands, as environment variables can be set directly in the terminal.

## Development

Run the backend:
```bash
npm run dev
```

Run the frontend:
```bash
cd ../client
npm run dev
```

## API Documentation

### Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

### Users

| Endpoint | Method | Auth Required | Description |
|----------|--------|---------------|-------------|
| `/users` | GET | Yes | Get all users |
| `/users/sign-up` | POST | No | Create new user account |
| `/users/log-in` | POST | No | Authenticate user and get token |
| `/users/:userId` | GET | Yes | Get specific user details |
| `/users/:userId` | PUT | Yes | Update user details (user can only update their own profile) |
| `/users/:userId` | DELETE | Yes | Delete user account (user can only delete their own account) |

### Posts

| Endpoint | Method | Auth Required | Description |
|----------|--------|---------------|-------------|
| `/posts` | GET | No | Get all blog posts |
| `/posts` | POST | Yes | Create new blog post |
| `/posts/:postId` | GET | No | Get specific post |
| `/posts/:postId` | PUT | Yes | Update post (author only) |
| `/posts/:postId` | DELETE | Yes | Delete post (author only) |

### Comments

| Endpoint | Method | Auth Required | Description |
|----------|--------|---------------|-------------|
| `/posts/:postId/comments` | POST | Yes | Add comment to post |
| `/posts/:postId/comments/:commentId` | GET | Yes | Get specific comment |
| `/posts/:postId/comments/:commentId` | PUT | Yes | Update comment (author only) |
| `/posts/:postId/comments/:commentId` | DELETE | Yes | Delete comment (author only) |

Example API usage:
```javascript
// Sign up a new user
fetch('http://localhost:3000/users/sign-up', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    username: 'newuser',
    password: 'password123',
    email: 'user@example.com'
  })
});

// Create a new blog post (authenticated)
fetch('http://localhost:3000/posts', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    title: 'My First Post',
    content: 'Hello, world!'
  })
});
```

## Authorisation

The API implements three levels of authorisation middleware:

1. `ofUser`: Ensures users can only modify their own profiles
   ```javascript
   // Required for:
   - PUT /users/:userId
   - DELETE /users/:userId
   ```

2. `ofPost`: Ensures users can only modify their own posts
   ```javascript
   // Required for:
   - PUT /posts/:postId
   - DELETE /posts/:postId
   ```

3. `ofComment`: Ensures users can only modify their own comments
   ```javascript
   // Required for:
   - PUT /posts/:postId/comments/:commentId
   - DELETE /posts/:postId/comments/:commentId
   ```

## Error Handling

The API returns standard HTTP status codes:

- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
