# 🌿 Green-care – Full Stack MERN Plant Care Social Platform

## 📌 Project Overview

Green-care is a full-stack MERN (MongoDB, Express.js, React, Node.js) social media web application designed around plant care and gardening. The platform allows multiple users to create accounts, share plant-related posts, interact through likes and comments, manage personal profiles, and set plant-care reminders.

The application follows a production-ready architecture including JWT authentication, protected REST APIs, image upload functionality, MongoDB relational references, and real-time UI updates without page reloads.

This project demonstrates strong full-stack development skills, REST API design, authentication handling, file management, and frontend state management.

---

## 🏗️ Architecture Overview

Green-care follows a client-server architecture:

### 🔹 Frontend (Client Side)
- Built using React with Vite
- Tailwind CSS for styling
- Axios for API communication
- React Router DOM for routing
- Moment.js for timestamps
- LocalStorage for JWT & user persistence

### 🔹 Backend (Server Side)
- Node.js with Express.js
- RESTful API architecture
- MongoDB database
- Mongoose ODM for schema modeling
- JWT authentication middleware
- Multer for file uploads

### 🔹 Database
MongoDB is used to store users, posts, comments, and reminders. Relationships are handled using ObjectId references.

---

## 🔐 Authentication System

- User Registration
- User Login
- Password hashing using bcryptjs
- JWT token generation
- Token stored in LocalStorage
- Axios interceptor attaches token automatically
- Protected backend routes using auth middleware
- Logout functionality
- Multi-user support

---

## 👤 User Profile System

Each user includes:

- Name
- Email
- Hashed password
- Bio
- Interests (array)
- Profile picture
- Followers (User references)
- Following (User references)
- Saved posts
- Automatic timestamps

### Profile Features

- Edit profile (name, bio, interests)
- Upload profile picture
- Grid layout of personal posts
- Total post count
- Total likes count
- Total comments count

---

## 📝 Post System

Each post contains:

- Caption
- Image
- User reference
- Likes (array of user IDs)
- Comments (array of objects)
- Timestamps

### Post Features

- Create post with image upload
- Edit post (owner only)
- Delete post (owner only)
- Like / Unlike functionality
- Comment system
- Instant UI updates
- Conditional owner controls
- Multi-user interaction

---

## 🌿 Reminder System

Reminder Model Includes:

- Title
- Plant name
- Type (watering, fertilizing, pruning)
- Date
- Repeat option (none, daily, weekly, monthly)
- Completed status
- User reference

### Reminder Features

- Create reminder
- View reminders
- Toggle complete
- Delete reminder
- Overdue highlighting
- User-based protection

---

## 📸 Image Upload System

- Implemented using Multer
- Disk storage configuration
- Uploads folder management
- Express static serving
- Used for profile pictures and post images

---

## 🛠️ Technology Stack

### Frontend
- React (Vite)
- React Router DOM
- Axios
- Tailwind CSS
- Moment.js

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- Multer
- dotenv
- nodemon

---

## 📁 Project Structure

```

Green-care/
│
├── client/
│   ├── src/
│   │   ├── api/api.js
│   │   ├── components/Navbar.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Welcome.jsx
│   │   │   ├── Feed.jsx
│   │   │   ├── Profile.jsx
│   │   │   └── Reminders.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│
├── server/
│   ├── models/
│   │   ├── User.js
│   │   ├── Post.js
│   │   └── Reminder.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── postRoutes.js
│   │   ├── reminderRoutes.js
│   │   ├── userRoutes.js
│   │   └── notificationRoutes.js
│   ├── middleware/authMiddleware.js
│   ├── uploads/
│   ├── index.js
│   └── .env

````

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/sanjai2022006-debug/Green-care.git
cd Green-care
````

---

### 2️⃣ Backend Setup

```bash
cd server
npm install
```

Create a `.env` file inside `server/` and add:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Start backend:

```bash
npm run dev
```

Backend runs on:
`http://localhost:5000`

---

### 3️⃣ Frontend Setup

Open a new terminal:

```bash
cd client
npm install
npm run dev
```

Frontend runs on:
`http://localhost:5173`

---

## 🚀 Future Enhancements

* Follow / Unfollow system
* Real-time notifications (Socket.io)
* Search users
* Dark mode toggle
* Cloudinary image storage
* Deployment to Render & Vercel
* Real-time activity feed

