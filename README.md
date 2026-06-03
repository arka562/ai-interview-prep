# 🚀 AI Interview Coach

<div align="center">

<img src="https://img.shields.io/badge/MERN-Stack-green?style=for-the-badge" />
<img src="https://img.shields.io/badge/React-Frontend-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
<img src="https://img.shields.io/badge/Node.js-Backend-339933?style=for-the-badge&logo=node.js&logoColor=white" />
<img src="https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb&logoColor=white" />
<img src="https://img.shields.io/badge/Google-Gemini_AI-4285F4?style=for-the-badge&logo=google&logoColor=white" />

### 🎯 Ace Your Next Interview with AI

Generate personalized interview questions, get AI-powered evaluations, track your progress, and prepare confidently for technical interviews.

---

⭐ Star this repository if you find it useful!

</div>

---

## 📖 Overview

AI Interview Prep is a full-stack MERN application that helps users prepare for interviews using AI-powered question generation and answer evaluation.

Users can create interview sessions based on their target role, experience level, and preferred topics. The application generates tailored interview questions using Google Gemini AI and provides intelligent feedback on submitted answers.

Whether you're preparing for your first internship or your next senior engineering role, AI Interview Prep helps you practice effectively.

---

## ✨ Features

### 🤖 AI-Powered Interview Questions

* Generate role-specific interview questions
* Personalized according to experience level
* Covers multiple technical domains

### 📝 AI Answer Evaluation

* Evaluate user responses
* Detailed explanations and feedback
* Identify strengths and improvement areas

### 🔐 Secure Authentication

* JWT-based authentication
* User registration and login
* Protected routes

### 👤 User Profile Management

* Profile image upload
* User profile customization
* Account management

### 📂 Session Management

* Create interview sessions
* View previous sessions
* Track interview history

### 📌 Question Pinning

* Save important questions
* Quick access for revision

### 📒 Personal Notes

* Add custom notes to questions
* Maintain personalized learning material

### 📊 Progress Tracking

* Review past interviews
* Monitor improvement over time

---

## 🛠️ Tech Stack

### Frontend

| Technology   | Purpose                     |
| ------------ | --------------------------- |
| React.js     | User Interface              |
| Vite         | Fast Development Build Tool |
| Axios        | API Communication           |
| CSS/Tailwind | Styling                     |

### Backend

| Technology | Purpose             |
| ---------- | ------------------- |
| Node.js    | Runtime Environment |
| Express.js | Backend Framework   |
| MongoDB    | Database            |
| Mongoose   | ODM                 |
| JWT        | Authentication      |
| Multer     | Image Uploads       |

### AI Integration

| Technology        | Purpose                          |
| ----------------- | -------------------------------- |
| Google Gemini API | Question Generation & Evaluation |

### Deployment

| Service       | Purpose          |
| ------------- | ---------------- |
| Netlify       | Frontend Hosting |
| Render        | Backend Hosting  |
| MongoDB Atlas | Cloud Database   |

---

## 📸 Screenshots

### Home Page

(Add Screenshot Later)

### AI Interview Generation

(Add Screenshot Later)

### Answer Evaluation

(Add Screenshot Later)

### Session History

(Add Screenshot Later)

### User Dashboard

(Add Screenshot Later)

---

## 🏗️ System Architecture

```text
┌────────────────────┐
│    React Frontend   │
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│   Express Backend   │
└─────────┬──────────┘
          │
    ┌─────┴─────┐
    ▼           ▼

MongoDB      Gemini AI
 Atlas        API
```

---

## 📁 Project Structure

```text
ai-interview-prep/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── server.js
│
├── frontend/
│   └── ai_interview_prep/
│       ├── src/
│       │   ├── components/
│       │   ├── pages/
│       │   ├── context/
│       │   └── assets/
│       ├── public/
│       └── vite.config.js
│
├── DEPLOYMENT.md
└── README.md
```

---

## ⚙️ Installation

### Clone the Repository

```bash
git clone https://github.com/arka562/ai-interview-prep.git

cd ai-interview-prep
```

---

## 🔧 Backend Setup

Navigate to backend:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

CLIENT_URL=http://localhost:5173

GEMINI_API_KEY=your_gemini_api_key
```

Start backend:

```bash
npm run dev
```

---

## 🎨 Frontend Setup

Navigate to frontend:

```bash
cd frontend/ai_interview_prep
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

Start frontend:

```bash
npm run dev
```

Application runs at:

```text
http://localhost:5173
```

---

## 🌐 API Endpoints

### Authentication

| Method | Endpoint               | Description          |
| ------ | ---------------------- | -------------------- |
| POST   | /api/auth/register     | Register User        |
| POST   | /api/auth/login        | Login User           |
| GET    | /api/auth/profile      | Get Profile          |
| POST   | /api/auth/upload-image | Upload Profile Image |

---

### Interview Sessions

| Method | Endpoint                  | Description         |
| ------ | ------------------------- | ------------------- |
| POST   | /api/sessions/create      | Create Session      |
| GET    | /api/sessions/my-sessions | Get User Sessions   |
| GET    | /api/sessions/:id         | Get Session Details |
| DELETE | /api/sessions/:id         | Delete Session      |

---

### Questions

| Method | Endpoint            | Description          |
| ------ | ------------------- | -------------------- |
| POST   | /api/questions/add  | Add Questions        |
| GET    | /api/questions/pin  | Get Pinned Questions |
| PATCH  | /api/questions/note | Update Notes         |

---

### AI Services

| Method | Endpoint                     | Description        |
| ------ | ---------------------------- | ------------------ |
| POST   | /api/ai/generate-questions   | Generate Questions |
| POST   | /api/ai/generate-explanation | Evaluate Answers   |

---

## 🎯 How It Works

### Step 1

Create an interview session by selecting:

* Job Role
* Experience Level
* Topics

### Step 2

Gemini AI generates personalized interview questions.

### Step 3

Answer the generated questions.

### Step 4

Receive AI-generated evaluation and feedback.

### Step 5

Save the session and review it later.

---

## 🚀 Deployment

### Backend Deployment (Render)

1. Create a Render Web Service.
2. Connect GitHub repository.
3. Set Root Directory:

```text
backend
```

4. Build Command:

```bash
npm install
```

5. Start Command:

```bash
npm start
```

6. Add environment variables.

---

### Frontend Deployment (Netlify)

Build Settings:

```bash
Base Directory:
frontend/ai_interview_prep

Build Command:
npm run build

Publish Directory:
dist
```

Environment Variable:

```env
VITE_API_BASE_URL=https://your-backend-url.onrender.com/api/v1
```

---

## 🔮 Future Enhancements

* Voice-Based Mock Interviews
* Coding Interview Simulator
* Resume Analyzer
* ATS Resume Scoring
* Leaderboard System
* Interview Performance Analytics
* Multi-AI Provider Support
* OpenAI Integration
* Anthropic Integration
* Dark Mode
* Mobile Application

---

## 🤝 Contributing

Contributions are welcome.

### Steps

```bash
Fork Repository

Clone Repository

Create New Branch

Make Changes

Commit Changes

Push Changes

Open Pull Request
```

---

## 🐛 Report Issues

Found a bug?

Create an issue and provide:

* Description
* Steps to Reproduce
* Expected Behavior
* Screenshots

---

## 💡 Why This Project?

Most interview preparation platforms provide static question banks.

AI Interview Prep provides:

✅ Dynamic AI-generated interviews

✅ Personalized question sets

✅ AI-powered answer evaluation

✅ Session history tracking

✅ User-friendly interface

✅ Full-stack scalable architecture

---

## 👨‍💻 Author

### Arkaprava

MERN Stack Developer | Full Stack Developer | AI Enthusiast

GitHub:
https://github.com/arka562

---

## ⭐ Show Your Support

If this project helped you:

```text
⭐ Star the Repository

🍴 Fork the Repository

📢 Share with Others
```

Every star motivates further development.

---

## 📄 License

This project is licensed under the MIT License.

---

<div align="center">

# 🚀 Ready to Crack Your Next Interview?

Practice smarter.
Learn faster.
Get hired sooner.

Built with ❤️ using React, Node.js, MongoDB, and Gemini AI.

⭐ Star the repository and support the project!

</div>
