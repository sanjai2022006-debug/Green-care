🌿 GreenCare – Smart Plant Care Platform

GreenCare is a full-stack MERN web application designed to help plant lovers manage plant health and connect with a plant care community.
The platform allows users to share plant posts, set reminders for plant care, and detect plant diseases using AI.
Users can upload images of plant leaves and the system predicts possible diseases using a trained machine learning model.
GreenCare combines social interaction, plant care management, and intelligent disease detection in a single platform.
The goal of the application is to make plant care easier and more accessible.
It helps users maintain healthy plants while learning from a community of other plant enthusiasts.

🚀 Features

GreenCare provides multiple features that support both community interaction and plant care management.
Users can share posts about their plants, interact with other users, and maintain their plant care schedules.
The application integrates a feed system, reminder system, and AI-based disease detection.
Each feature is designed to simplify plant care tasks and provide useful plant health insights.
The platform also ensures secure access through authentication and protected routes.
All these tools are integrated into a single user-friendly web application.

🔐 User Authentication

GreenCare includes a secure authentication system to manage user accounts.
Users can register with their details and log in using their credentials.
The system uses JWT authentication to protect private routes within the application.
Only authenticated users can create posts, interact with content, or manage reminders.
User information is stored securely in the database and handled through backend validation.
This authentication system ensures safe and reliable access to the platform features.

📰 Community Feed

The community feed allows users to share plant-related content with others.
Users can create posts and upload images of their plants.
Other users can interact with these posts by liking or commenting on them.
Users can also edit or delete their own posts when necessary.
The feed encourages interaction and knowledge sharing among plant lovers.
It helps users learn about plant care through community discussions and experiences.

👤 User Profile

Each user has a dedicated profile page within the platform.
The profile page displays user information and the posts created by the user.
Users can update their name, bio, and personal interests.
A profile picture can also be uploaded to personalize the account.
The profile helps other users understand the interests of each member.
It also acts as a personal space where users can manage their content.

⏰ Plant Care Reminder System

GreenCare includes a reminder system to help users stay consistent with plant care tasks.
Users can create reminders for activities such as watering, fertilizing, and pruning plants.
Each reminder can be scheduled based on different frequencies.
Supported reminder schedules include daily, weekly, and monthly options.
Users can edit or delete reminders whenever required.
This system helps ensure that plants receive regular care and attention.

🍃 AI Leaf Disease Detection

GreenCare integrates an AI-based plant disease detection system.
Users can upload an image of a plant leaf through the application interface.
The uploaded image is analyzed using a trained image classification model.
The model predicts the disease and displays the most likely result.
The prediction also includes a confidence percentage for accuracy.
This feature helps users quickly identify plant health problems.

🌿 Supported Plant Diseases

The current AI model can detect the following plant diseases:

Mosaic Virus

Leaf Spot

Early Blight

Late Blight

Bacterial Spot

🛠 Technology Stack

GreenCare is built using modern full-stack web development technologies.
The application follows the MERN stack architecture for scalability and performance.
React is used for building a dynamic user interface.
Node.js and Express manage backend server logic and API endpoints.
MongoDB is used for storing user data, posts, and reminders.
The AI detection feature is implemented using TensorFlow-based image classification.

🎨 Frontend Technologies

The frontend handles user interface design and user interactions.

React.js

React Router

Axios

Tailwind CSS

Moment.js

⚙️ Backend Technologies

The backend manages application logic, database communication, and APIs.

Node.js

Express.js

MongoDB

Mongoose

JSON Web Token (JWT) Authentication

Multer (Image Upload Handling)

🤖 Machine Learning

The disease detection system uses machine learning technologies.

TensorFlow

Teachable Machine

Image Classification Model for Leaf Disease Detection

📂 Project Structure
Green-care
│
├── client
│   ├── components
│   ├── pages
│   ├── api
│   └── App.jsx
│
├── server
│   ├── models
│   ├── routes
│   ├── middleware
│   ├── uploads
│   └── index.js
│
└── README.md
⚙️ Installation
1️⃣ Clone the Repository
git clone https://github.com/sanjai2022006-debug/Green-care.git
2️⃣ Install Backend Dependencies
cd server
npm install
3️⃣ Install Frontend Dependencies
cd client
npm install
4️⃣ Run Backend Server
npm start
5️⃣ Run Frontend
npm run dev
