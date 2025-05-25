# Portfolio Backend API

A powerful and scalable backend API for your personal portfolio website, built with Node.js, Express, TypeScript, and MongoDB.

## Description

This backend API provides all the necessary endpoints to manage your portfolio website content including projects, skills, blogs, and contact messages. It features authentication, file uploads, email functionality, and a comprehensive dashboard for analytics.

## Features

- **Full CRUD Operations** for projects, skills, blogs, and contact messages
- **Authentication & Authorization** with JWT
- **File Upload** using Multer and Cloudinary
- **Email Sending** with Nodemailer
- **Data Filtering & Pagination** for all collection endpoints
- **Dashboard Analytics** for portfolio statistics

## Tech Stack

- **Node.js & Express**: For building the RESTful API
- **TypeScript**: For type-safe code development
- **MongoDB & Mongoose**: For data storage and modeling
- **JWT**: For authentication
- **Bcrypt**: For password hashing
- **Multer & Cloudinary**: For file uploads
- **Zod**: For request validation
- **Nodemailer**: For email functionality

## Installation

1. Clone the repository

```bash
git clone https://github.com/RanokRaihan/portfolio-backend.git
cd portfolio-backend
```

2. Install dependencies

```bash
npm install
```

3. Create .env file with the following variables

```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017
DB_NAME=portfolio
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_ACCESS_EXPIRES_IN=1d
JWT_REFRESH_EXPIRES_IN=30d
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-app-password
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

4. Start the development server

```bash
npm run dev
```

## API Documentation

### Authentication Routes

| Method | Endpoint                     | Description          | Access    |
| ------ | ---------------------------- | -------------------- | --------- |
| POST   | /api/v1/auth/login           | Log in user          | Public    |
| POST   | /api/v1/auth/logout          | Log out user         | Public    |
| POST   | /api/v1/auth/refresh-token   | Refresh access token | Public    |
| PUT    | /api/v1/auth/change-password | Change password      | Protected |

### User Routes

| Method | Endpoint              | Description   | Access     |
| ------ | --------------------- | ------------- | ---------- |
| POST   | /api/v1/user/register | Register user | Admin only |

### Skill Routes

| Method | Endpoint                         | Description            | Access     |
| ------ | -------------------------------- | ---------------------- | ---------- |
| GET    | /api/v1/skill                    | Get all skills         | Public     |
| GET    | /api/v1/skill/paginate           | Get paginated skills   | Public     |
| GET    | /api/v1/skill/featured           | Get featured skills    | Public     |
| GET    | /api/v1/skill/category/:category | Get skills by category | Public     |
| GET    | /api/v1/skill/:id                | Get single skill       | Public     |
| POST   | /api/v1/skill                    | Create skill           | Admin only |
| PATCH  | /api/v1/skill/:id                | Update skill           | Admin only |
| DELETE | /api/v1/skill/:id                | Delete skill           | Admin only |

### Project Routes

| Method | Endpoint                 | Description           | Access     |
| ------ | ------------------------ | --------------------- | ---------- |
| GET    | /api/v1/project          | Get all projects      | Public     |
| GET    | /api/v1/project/featured | Get featured projects | Public     |
| GET    | /api/v1/project/:id      | Get single project    | Public     |
| POST   | /api/v1/project          | Create project        | Admin only |
| PATCH  | /api/v1/project/:id      | Update project        | Admin only |
| DELETE | /api/v1/project/:id      | Delete project        | Admin only |

### Blog Routes

| Method | Endpoint                        | Description           | Access     |
| ------ | ------------------------------- | --------------------- | ---------- |
| GET    | /api/v1/blog                    | Get all blogs         | Public     |
| GET    | /api/v1/blog/featured           | Get featured blogs    | Public     |
| GET    | /api/v1/blog/category/:category | Get blogs by category | Public     |
| GET    | /api/v1/blog/tag/:tag           | Get blogs by tag      | Public     |
| GET    | /api/v1/blog/:id                | Get single blog       | Public     |
| POST   | /api/v1/blog                    | Create blog           | Admin only |
| PATCH  | /api/v1/blog/:id                | Update blog           | Admin only |
| DELETE | /api/v1/blog/:id                | Delete blog           | Admin only |

### Dashboard Routes

| Method | Endpoint                  | Description            | Access     |
| ------ | ------------------------- | ---------------------- | ---------- |
| GET    | /api/v1/dashboard/insight | Get dashboard insights | Admin only |

## Project Structure

```
├── src/
│   ├── config/           # Environment variables & configuration
│   ├── errors/           # Custom error handling
│   ├── interface/        # Global TypeScript interfaces
│   ├── middleware/       # Express middleware
│   ├── modules/          # Feature modules
│   │   ├── auth/         # Authentication
│   │   ├── blog/         # Blog management
│   │   ├── dashboard/    # Dashboard analytics
│   │   ├── email/        # Email functionality
│   │   ├── project/      # Project management
│   │   ├── skill/        # Skill management
│   │   └── user/         # User management
│   ├── routes/           # API routes
│   ├── utils/            # Utility functions
│   ├── app.ts            # Express app
│   └── index.ts          # Entry point
├── uploads/              # Temporary uploads directory
├── .env                  # Environment variables
├── package.json
└── tsconfig.json
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Author

Ranok Raihan - [GitHub](https://github.com/ranokraihan)
