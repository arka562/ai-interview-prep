# 🚀 AI Interview Coach

<div align="center">

<img src="https://img.shields.io/badge/MERN-Stack-green?style=for-the-badge" />
<img src="https://img.shields.io/badge/React-Frontend-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
<img src="https://img.shields.io/badge/Node.js-Backend-339933?style=for-the-badge&logo=node.js&logoColor=white" />
<img src="https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb&logoColor=white" />
<img src="https://img.shields.io/badge/Google-Gemini_AI-4285F4?style=for-the-badge&logo=google&logoColor=white" />

![GitHub stars](https://img.shields.io/github/stars/arka562/ai-interview-prep)
![GitHub forks](https://img.shields.io/github/forks/arka562/ai-interview-prep)
![GitHub issues](https://img.shields.io/github/issues/arka562/ai-interview-prep)
![GitHub license](https://img.shields.io/github/license/arka562/ai-interview-prep)

### 🎯 Ace Your Next Interview with AI

Generate personalized interview questions, receive AI-powered evaluations, analyze resumes, track progress, and prepare confidently for technical interviews.

⭐ Star this repository if you find it useful!

</div>

---

# 🌐 Live Demo

Frontend:

https://meek-kheer-3f184f.netlify.app/login

Backend:

https://your-backend-url.onrender.com

---

# 📖 Overview

AI Interview Coach is a full-stack MERN application that helps students, freshers, and professionals prepare for interviews using AI-powered question generation, answer evaluation, resume analysis, and performance tracking.

The platform leverages Google Gemini AI to simulate realistic interview experiences tailored to a candidate’s role, experience level, and skill set.

Whether you're preparing for internships, placements, software engineering roles, or experienced developer positions, AI Interview Coach provides a personalized learning environment.

---

# ✨ Features

## 🤖 AI-Powered Interview Questions

* Generate role-specific interview questions
* Personalized according to experience level
* Covers multiple technical domains
* Dynamic question generation using Gemini AI

## 🎯 Adaptive Follow-Up Questions

* Generates deeper questions based on user answers
* Simulates real interviewer behavior
* Personalized interview flow

## 📝 AI Answer Evaluation

* Evaluate user responses
* Detailed explanations and feedback
* Identify strengths and weaknesses
* Improvement recommendations

## 📄 Resume Analyzer

* Upload Resume PDF
* Resume Parsing
* AI-Powered Resume Analysis
* ATS Score Generation
* Resume Improvement Suggestions

## 📑 PDF Report Generation

* Download complete interview reports
* AI-generated feedback summaries
* Performance insights
* Skill assessment reports

## 📊 Performance Analytics

* Track interview performance
* Topic-wise progress monitoring
* Historical performance analysis
* Improvement trend visualization

## 🔐 Secure Authentication

* JWT-based authentication
* User registration and login
* Protected routes
* Secure session management

## 👤 User Profile Management

* Profile image upload
* User customization
* Account management

## 📂 Session Management

* Create interview sessions
* View interview history
* Resume previous sessions
* Delete sessions

## 📌 Question Pinning

* Save important questions
* Quick revision access

## 📒 Personal Notes

* Add notes to interview questions
* Personalized learning materials

---

# 🎯 Highlights

This project demonstrates:

✅ Full Stack MERN Development

✅ Gemini AI Integration

✅ Authentication & Authorization

✅ RESTful API Design

✅ MongoDB Data Modeling

✅ Resume Analysis

✅ PDF Report Generation

✅ Cloud Deployment

✅ File Upload Handling

✅ Real-World Scalable Architecture

---

# 🛠️ Tech Stack

## Frontend

| Technology   | Purpose           |
| ------------ | ----------------- |
| React.js     | User Interface    |
| Vite         | Build Tool        |
| Axios        | API Communication |
| React Router | Routing           |
| Tailwind CSS | Styling           |
| Context API  | State Management  |

---

## Backend

| Technology | Purpose             |
| ---------- | ------------------- |
| Node.js    | Runtime Environment |
| Express.js | Backend Framework   |
| MongoDB    | Database            |
| Mongoose   | ODM                 |
| JWT        | Authentication      |
| Multer     | File Uploads        |
| Bcrypt     | Password Hashing    |

---

## AI Integration

| Technology        | Purpose             |
| ----------------- | ------------------- |
| Google Gemini API | Question Generation |
| Google Gemini API | Answer Evaluation   |
| Google Gemini API | Resume Analysis     |
| Google Gemini API | ATS Scoring         |

---

## Deployment

| Service       | Purpose          |
| ------------- | ---------------- |
| Netlify       | Frontend Hosting |
| Render        | Backend Hosting  |
| MongoDB Atlas | Cloud Database   |

---

# 📈 Project Scale

* 20+ REST APIs
* JWT Authentication System
* AI Interview Generation
* AI Resume Analysis
* PDF Report Generation
* MongoDB Atlas Integration
* Cloud Deployment
* File Upload Management
* Analytics Dashboard

---

# 📸 Screenshots

## Login Page

(Add Screenshot)

## Dashboard

(Add Screenshot)

## AI Interview Generation

(Add Screenshot)

## Answer Evaluation

(Add Screenshot)

## Resume Analyzer

(Add Screenshot)

## Session History

(Add Screenshot)

## Analytics Dashboard

(Add Screenshot)

---

# 🏗️ System Architecture

```text
                     ┌──────────────────────┐
                     │    React Frontend    │
                     └──────────┬───────────┘
                                │
                                ▼
                     ┌──────────────────────┐
                     │   Express Backend    │
                     └──────────┬───────────┘
                                │
             ┌──────────────────┼──────────────────┐
             ▼                  ▼                  ▼

      MongoDB Atlas       Gemini AI API      PDF Generator

             ▲
             │

      Analytics Engine
```

---

# 🔄 Application Flow

```text
User
 │
 ▼
Login/Register
 │
 ▼
Create Interview Session
 │
 ▼
Gemini AI Generates Questions
 │
 ▼
User Answers Questions
 │
 ▼
AI Evaluates Answers
 │
 ▼
Generate Feedback
 │
 ▼
Store Results in MongoDB
 │
 ▼
Analytics Dashboard
 │
 ▼
PDF Report Export
```

---

# 🗄️ Database Design

```text
Users
│
├── Profile
│
├── Sessions
│   ├── Questions
│   ├── Answers
│   ├── Notes
│   └── Feedback
│
├── Resume Reports
│
├── Skill Profiles
│
└── Analytics
```

---

# 📁 Project Structure

```text
ai-interview-prep/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   └── server.js
│
├── frontend/
│   └── ai_interview_prep/
│       ├── src/
│       │   ├── components/
│       │   ├── pages/
│       │   ├── context/
│       │   ├── services/
│       │   ├── hooks/
│       │   └── assets/
│       │
│       ├── public/
│       └── vite.config.js
│
├── README.md
├── DEPLOYMENT.md
└── LICENSE
```

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/arka562/ai-interview-prep.git

cd ai-interview-prep
```

---

# 🔧 Backend Setup

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create `.env`

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

CLIENT_URL=http://localhost:5173

GEMINI_API_KEY=your_gemini_api_key
```

Run backend:

```bash
npm run dev
```

---

# 🎨 Frontend Setup

```bash
cd frontend/ai_interview_prep
```

Install dependencies:

```bash
npm install
```

Create `.env`

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

Run frontend:

```bash
npm run dev
```

Application:

```text
http://localhost:5173
```

---

# 🌐 API Endpoints

## Authentication

| Method | Endpoint               | Description          |
| ------ | ---------------------- | -------------------- |
| POST   | /api/auth/register     | Register User        |
| POST   | /api/auth/login        | Login User           |
| GET    | /api/auth/profile      | Get User Profile     |
| POST   | /api/auth/upload-image | Upload Profile Image |

---

## Interview Sessions

| Method | Endpoint                  | Description       |
| ------ | ------------------------- | ----------------- |
| POST   | /api/sessions/create      | Create Session    |
| GET    | /api/sessions/my-sessions | Get User Sessions |
| GET    | /api/sessions/:id         | Session Details   |
| DELETE | /api/sessions/:id         | Delete Session    |

---

## Questions

| Method | Endpoint            | Description          |
| ------ | ------------------- | -------------------- |
| POST   | /api/questions/add  | Add Questions        |
| GET    | /api/questions/pin  | Get Pinned Questions |
| PATCH  | /api/questions/note | Update Notes         |

---

## AI Services

| Method | Endpoint                     | Description          |
| ------ | ---------------------------- | -------------------- |
| POST   | /api/ai/generate-questions   | Generate Questions   |
| POST   | /api/ai/generate-explanation | Evaluate Answers     |
| POST   | /api/ai/resume-analysis      | Resume Analysis      |
| POST   | /api/ai/ats-score            | ATS Score Generation |

---

# 🔒 Security Features

* JWT Authentication
* Bcrypt Password Hashing
* Protected Routes
* Input Validation
* Secure File Uploads
* Environment Variable Protection
* MongoDB Atlas Security

---

# 🚀 Deployment

## Backend Deployment (Render)

1. Create Render Web Service
2. Connect GitHub Repository
3. Set Root Directory

```text
backend
```

4. Build Command

```bash
npm install
```

5. Start Command

```bash
npm start
```

6. Add Environment Variables

---

## Frontend Deployment (Netlify)

Base Directory:

```text
frontend/ai_interview_prep
```

Build Command:

```bash
npm run build
```

Publish Directory:

```text
dist
```

Environment Variable:

```env
VITE_API_BASE_URL=https://your-backend-url.onrender.com/api/v1
```

---

# 🚧 Challenges Faced

* Parsing AI-generated responses
* Managing interview session state
* Structuring dynamic AI outputs
* Optimizing Gemini API requests
* Handling resume extraction
* Generating ATS reports
* Maintaining data consistency
* Secure deployment and environment management

---

# 📚 Key Learnings

* Full Stack MERN Development
* REST API Architecture
* MongoDB Data Modeling
* JWT Authentication
* Gemini AI Integration
* File Upload Management
* Cloud Deployment
* State Management
* Resume Processing
* Analytics Development

---

# 🔮 Future Scope

* Real-Time Voice Interviews
* Video Interview Analysis
* AI Career Roadmaps
* Coding Interview Simulator
* System Design Interview Module
* Company-Specific Interview Preparation
* AI Mock HR Interviews
* Multi-Language Support
* OpenAI Integration
* Anthropic Integration
* Mobile App (React Native)
* Dark Mode Support

---

# 🤝 Contributing

Contributions are welcome.

## Steps

```text
1. Fork Repository

2. Clone Repository

3. Create New Branch

4. Make Changes

5. Commit Changes

6. Push Changes

7. Open Pull Request
```

---

# 🐛 Report Issues

Found a bug?

Please create an issue with:

* Description
* Reproduction Steps
* Expected Behavior
* Screenshots

---

# 💡 Why This Project?

Most interview preparation platforms rely on static question banks.

AI Interview Coach provides:

✅ Dynamic AI-generated interviews

✅ Personalized question sets

✅ Resume Analysis

✅ ATS Score Generation

✅ AI-powered answer evaluation

✅ Session history tracking

✅ Performance analytics

✅ Real-time feedback

---

# 👨‍💻 Author

## Arkaprava Ghosh

MERN Stack Developer | Full Stack Developer | AI Enthusiast

GitHub:

https://github.com/arka562

LinkedIn:

(Add LinkedIn URL)

---

# ⭐ Show Your Support

If this project helped you:

```text
⭐ Star the Repository

🍴 Fork the Repository

📢 Share with Others
```

Every star motivates future development.

---

# 📄 License

This project is licensed under the MIT License.

---

<div align="center">

# 🚀 Ready to Crack Your Next Interview?

Practice Smarter.
Learn Faster.
Get Hired Sooner.

Built with ❤️ using React, Node.js, MongoDB, and Gemini AI.

⭐ Star the repository and support the project.

</div>
