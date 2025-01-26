# BSBLOG

Personal blog platform built with Next.js, Express.js, and MongoDB.

## Features

- Public and private blog posts
- User authentication system
- Category-based blog posts
- Comment system
- Like/Dislike functionality
- Writer application system
- Admin dashboard for content management

## Tech Stack

- Frontend: Next.js, React, TailwindCSS
- Backend: Node.js, Express.js
- Database: MongoDB
- Authentication: JWT
- Email: Nodemailer

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory with the following variables:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email
EMAIL_PASS=your_email_app_password
```

3. Run the development server:
```bash
npm run dev
```

## Project Structure

- `/pages` - Next.js pages and API routes
- `/components` - Reusable React components
- `/models` - MongoDB models
- `/styles` - CSS and TailwindCSS styles
- `/utils` - Utility functions and helpers
- `/middleware` - Authentication and other middleware

## Author

Batuhan Salkım 