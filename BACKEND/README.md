# DTube

A full-stack video streaming platform inspired by YouTube.

---

## Features

- JWT Authentication
- Refresh Tokens
- Role-based Authentication (Admin/User)
- Forgot Password ,reset password functionality
- Otp generation to mail and verification for reset password 
- Google reCAPTCHA
- Video Uploads
- AWS S3 Storage
- Like / Comment System
- Channel Subscriptions
- Infinite Scroll
- Admin Dashboard
- Report & Moderation System (yet to complete)

---

## Tech Stack

### Frontend

- React
- React Router
- Axios
- Bootstrap

### Backend

- Node.js
- Express
- MongoDB
- Mongoose
- JWT
- Multer

### Cloud

- MongoDB Atlas
- Amazon S3

---

## Installation

Clone the repository

```bash
git clone <repository-url>
```

Install frontend dependencies

```bash
cd frontend
npm install
```

Install backend dependencies

```bash
cd ../backend
npm install
```

---

## Environment Variables

### Backend

Create

```
backend/.env
```

using

```
backend/.env.example
```

Required variables

```env

MONGO_URI=

ACCESS_TOKEN_SECRET=

REFRESH_TOKEN_SECRET=

AWS_ACCESS_KEY_ID=

AWS_SECRET_ACCESS_KEY=

AWS_REGION=

AWS_BUCKET_NAME=

EMAIL=

EMAIL_PASSWORD=

RECAPTCHA_SECRET_KEY=

FRONTEND_URL=
```

---

### Frontend

Create

```
frontend/.env
```

using

```
frontend/.env.example
```

```env
VITE_API_URL=

VITE_RECAPTCHA_SITE_KEY=
```

---

## Running the project

Backend

```bash
npm run dev
```

Frontend

```bash
npm run dev
```

---

## Deployment

Frontend

- Vercel

Backend

- Render

Database

- MongoDB Atlas

Media Storage

- Amazon S3

---

## Author

Varun Sivanesan
