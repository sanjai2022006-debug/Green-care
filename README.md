# 🌿 GreenCare – Smart Plant Care Platform

![MERN](https://img.shields.io/badge/MERN-Stack-green)
![React](https://img.shields.io/badge/Frontend-React-blue)
![Node](https://img.shields.io/badge/Backend-Node.js-green)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-darkgreen)
![TensorFlow](https://img.shields.io/badge/AI-TensorFlow-orange)
![License](https://img.shields.io/badge/Project-Educational-blue)

<img width="647" height="559" alt="image" src="https://github.com/user-attachments/assets/541299cc-d374-466c-b87e-2f2b49f0e09d" />

<img width="1907" height="879" alt="image" src="https://github.com/user-attachments/assets/6a7b6551-3b5b-4fd7-b9a9-3565165d2d5f" />

GreenCare is a **full-stack MERN web application** designed to help plant lovers manage plant health and connect with a plant care community.

The platform allows users to **share plant posts, set reminders for plant care, and detect plant diseases using AI**.

Users can upload images of plant leaves and the system predicts possible diseases using a trained machine learning model.

GreenCare combines **social interaction, plant care management, and intelligent disease detection** in a single platform.

The goal of the application is to **make plant care easier and more accessible** while helping users maintain healthy plants through community learning.

---

# 🌍 Live Demo

*(Add this later if deployed)*

Demo Link:
`Coming Soon`

---

# 📸 Screenshots

*(You can upload images later inside GitHub repo and link them here)*

Example:

```
/screenshots/feed.png
/screenshots/profile.png
/screenshots/reminder.png
/screenshots/disease-detection.png
```

Then show them like:

```
![Feed](screenshots/feed.png)
![Profile](screenshots/profile.png)
![Reminder](screenshots/reminder.png)
![Disease Detection](screenshots/disease.png)
```

---

# 🚀 Key Features

### 📰 Community Feed

Users can create posts and share plant images with the community. Other users can like and comment on posts to interact and exchange plant care knowledge.

### 🔐 User Authentication

Secure login and registration system using **JWT authentication** that protects private routes and user data.

### 👤 User Profile

Users have a personal profile where they can update their **name, bio, interests, and profile picture**.

### ⏰ Plant Care Reminder System

Users can create reminders for plant care activities such as **watering, fertilizing, and pruning** with **daily, weekly, or monthly schedules**.

### 🍃 AI Leaf Disease Detection

Users can upload a plant leaf image and the system predicts plant diseases using an **image classification machine learning model**.

---
## 🧪 API Testing

All backend APIs were tested using **Thunder Client** in Visual Studio Code.

The tool was used to verify endpoints for **authentication, posts, reminders, and user profile management**. Requests were tested with **JSON bodies, JWT tokens, and image uploads** to ensure proper API functionality.

-------

# 🌿 Supported Plant Diseases

The AI model currently detects:

* Mosaic Virus
* Leaf Spot
* Early Blight
* Late Blight
* Bacterial Spot

---

# 🛠 Technology Stack

| Category       | Technologies                                |
| -------------- | ------------------------------------------- |
| Frontend       | React.js, React Router, Axios, Tailwind CSS |
| Backend        | Node.js, Express.js                         |
| Database       | MongoDB, Mongoose                           |
| Authentication | JSON Web Token (JWT)                        |
| Image Upload   | Multer                                      |
| AI Model       | TensorFlow, Teachable Machine               |

---

# 🤖 Machine Learning

GreenCare integrates an **image classification model** trained using **Google Teachable Machine** and TensorFlow.

The model analyzes uploaded plant leaf images and predicts diseases with a **confidence score**.

This helps users quickly identify plant health issues.

---

# 📂 Project Structure

```
Green-care
│
├── client                         # Frontend (React Application)
│   ├── public
│   │
│   ├── src
│   │   ├── api                    # Axios API configuration
│   │   │   └── api.js
│   │   │
│   │   ├── components             # Reusable UI components
│   │   │   └── Navbar.jsx
│   │   │
│   │   ├── pages                  # Main application pages
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Feed.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Reminders.jsx
│   │   │   └── Welcome.jsx
│   │   │
│   │   ├── App.jsx                # React Router configuration
│   │   ├── main.jsx               # React entry point
│   │   └── index.css
│   │
│   ├── package.json
│   └── vite.config.js
│
│
├── server                         # Backend (Node + Express API)
│   │
│   ├── models                     # MongoDB Schemas
│   │   ├── User.js
│   │   ├── Post.js
│   │   └── Reminder.js
│   │
│   ├── routes                     # Express API routes
│   │   ├── authRoutes.js
│   │   ├── postRoutes.js
│   │   ├── reminderRoutes.js
│   │   └── userRoutes.js
│   │
│   ├── middleware                 # Authentication Middleware
│   │   └── authMiddleware.js
│   │
│   ├── uploads                    # Uploaded images (posts/profile)
│   │
│   ├── index.js                   # Main Express server
│   ├── package.json
│   └── .env
│
│
├── ai-model                       # Machine Learning Model
│   ├── model.json
│   ├── metadata.json
│   └── weights.bin
│
│
├── screenshots                    # Project screenshots (for README)
│
├── README.md
└── package.json
```


---

# ⚙️ Installation

## 1️⃣ Clone the Repository

```
git clone https://github.com/sanjai2022006-debug/Green-care.git
```

---

## 2️⃣ Install Backend Dependencies

```
cd server
npm install
```

---

## 3️⃣ Install Frontend Dependencies

```
cd client
npm install
```

---

## 4️⃣ Run Backend Server

```
npm start
```

---

## 5️⃣ Run Frontend

```
npm run dev
```

---

# 🚀 Future Enhancements

GreenCare will continue to evolve with new features.

### 📱 Mobile Application

Develop an Android and iOS mobile app for better accessibility.

### 👥 Follow / Followers System

Users will be able to follow other plant lovers and see posts from followed users.

### 💬 Real-Time Messaging

Enable users to chat and share plant care advice directly.

### 🔔 Real-Time Notifications

Users will receive notifications when someone likes, comments, or follows them.

### 🌿 More Disease Detection Models

Expand AI support to detect more plant diseases and plant species.

### 📊 Plant Health Analytics

Provide statistics and insights about plant care and disease detection history.

### 🧠 AI Plant Care Suggestions

AI-based recommendations for watering, fertilizing, and treating plant diseases.

### 📷 Camera Integration

Allow direct image capture from device cameras for faster disease detection.

### 🌍 Community Knowledge Base

Create a plant care learning section with guides and tutorials.

---

# 🌱 Contribution

Contributions are welcome!

Steps to contribute:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push the branch
5. Open a Pull Request

---


