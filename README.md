# Remote Classroom for Rural Colleges — GyaanSetu

> A comprehensive remote learning platform designed for rural colleges, enabling quality education despite connectivity challenges.

**Institution:** Swami Keshvanand Institute of Technology, Management & Gramothan (SKIT), Jaipur  
**Department:** Computer Science & Engineering  
**Batch:** 2023–2027  
**Group ID:** 39  
**Branch & Section:** Computer Science & Engineering (CSE) — Section C  
**Mentor:** Swati  
**Team Members:**  
- **Kunal Saukhiya** (Team Lead — Backend & APIs)
- **Manish Regar** (Member 1 — Database & AI Services)
- **Rishabh Jain** (Member 2 — Testing & Deployment)
- **Manish Kumar** (Member 3 — Frontend & UI/UX)

---

## 🎯 Problem Statement

Students in rural colleges face significant barriers to quality education:
- Poor internet connectivity (2G/3G regions)
- Limited access to learning resources
- Lack of real-time interaction with teachers
- Manual attendance tracking and delayed feedback

**GyaanSetu** addresses these challenges by providing a low-bandwidth optimized remote classroom platform with live video classes, assignment management, AI-powered study assistance, and automated attendance tracking.

---

## ✨ Features

### Core Features
| Feature | Description |
|---------|-------------|
| 🔐 **Authentication** | Student/Teacher/Admin roles with JWT + OTP (Firebase) |
| 🎥 **Live Video Classes** | ZegoCloud-powered video conferencing with screen sharing |
| 📝 **Assignment Management** | Create, submit, grade assignments with file uploads (Cloudinary) |
| 📚 **Resource Portal** | Upload/download study materials (PDFs, videos, documents) |
| 📋 **Attendance Tracking** | Mark and view attendance with percentage analytics |
| 🔔 **Notifications** | Real-time notifications for assignments, grades, announcements |
| 🤖 **AI Study Assistant** | Gemini AI-powered educational chatbot with multilingual support |
| 📊 **Admin Dashboard** | Platform analytics, user management, performance metrics |
| 👤 **Profile Management** | Student/Teacher profile editing with image upload |

### Rural-Optimized
- Mobile-responsive design (works on any device)
- Lightweight UI with lazy-loaded routes
- Error boundaries with retry mechanisms
- Works on low-bandwidth connections

---

## 🏗️ Architecture

```
┌──────────────────────┐     ┌──────────────────────┐
│   Frontend (React)   │◄───►│   Backend (Express)  │
│   Vite + Tailwind    │     │   Node.js REST API   │
│   Redux Toolkit      │     │   JWT Auth + Cookies  │
│   Port: 5173         │     │   Port: 4000          │
└──────────────────────┘     └──────────┬───────────┘
                                        │
                   ┌────────────────────┼────────────────────┐
                   │                    │                    │
           ┌───────▼──────┐    ┌───────▼──────┐    ┌───────▼──────┐
           │   MongoDB    │    │  Cloudinary   │    │  Gemini AI   │
           │  (Database)  │    │ (File Upload) │    │  (Chatbot)   │
           └──────────────┘    └──────────────┘    └──────────────┘
```

### Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite 7, Tailwind CSS 4, Redux Toolkit |
| Backend | Node.js, Express 5 |
| Database | MongoDB (Mongoose 8) |
| Auth | JWT + Firebase OTP |
| Video | ZegoCloud UIKit |
| File Storage | Cloudinary |
| AI | Google Gemini API |

---

## 📁 Project Structure

```
├── client/                    # Frontend (React + Vite)
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home/          # Landing page
│   │   │   ├── auth/          # Login/Signup (Student, Teacher)
│   │   │   ├── dashboard/     # Student & Teacher dashboards
│   │   │   ├── admin/         # Admin login & dashboard
│   │   │   ├── resourses/     # Assignments & Resources
│   │   │   ├── attendance/    # Attendance pages
│   │   │   ├── notifications/ # Notification center
│   │   │   ├── profile/       # Profile management
│   │   │   ├── AIChatBot/     # AI Study Assistant
│   │   │   └── Classroom.jsx  # Video meeting room
│   │   ├── components/        # Shared UI components
│   │   ├── store/             # Redux slices
│   │   └── context/           # React context
│   └── .env.example           # Environment variables template
│
├── server/                    # Backend (Express)
│   ├── models/                # Mongoose schemas
│   │   ├── student.model.js
│   │   ├── teacher.model.js
│   │   ├── admin.model.js
│   │   ├── class.model.js
│   │   ├── assignment.model.js
│   │   ├── submission.model.js
│   │   ├── resource.model.js
│   │   ├── attendance.model.js
│   │   └── notification.model.js
│   ├── contollers/            # Route handlers
│   ├── routes/                # API routes
│   ├── middleware/             # Auth middleware
│   ├── DB/                    # Database connection
│   └── .env.example           # Environment variables template
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)
- Cloudinary account (for file uploads)
- Firebase project (for OTP)
- ZegoCloud account (for video)
- Gemini API key (for AI chatbot, optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Remote-Classroom-for-Rural-Collages-main
   ```

2. **Setup Server**
   ```bash
   cd server
   cp .env.example .env
   # Edit .env with your credentials
   npm install
   ```

3. **Setup Client**
   ```bash
   cd client
   cp .env.example .env
   # Edit .env with your credentials
   npm install
   ```

4. **Run the project**
   ```bash
   # Terminal 1 — Backend
   cd server
   node app.js

   # Terminal 2 — Frontend
   cd client
   npm run dev
   ```

5. **Open in browser:** http://localhost:5173

### Environment Variables

**Server (.env):**
| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 4000) |
| `MONGO_URI` | MongoDB connection string |
| `SECRET_KEY` | JWT secret key |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `GEMINI_API_KEY` | Google Gemini API key (optional) |
| `FRONTEND_URL` | Frontend URL for CORS |

**Client (.env):**
| Variable | Description |
|----------|-------------|
| `VITE_BASE_URL` | Backend API URL |
| `VITE_ZEGOCLOUD_APP_ID` | ZegoCloud App ID |
| `VITE_ZEGOCLOUD_SERVER_SECRET` | ZegoCloud Server Secret |
| `VITE_API_KEY` | Firebase API key |
| `VITE_AUTH_DOMAIN` | Firebase Auth domain |
| `VITE_PROJECT_ID` | Firebase Project ID |

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/student/signup` | Student registration |
| POST | `/api/student/login` | Student login |
| POST | `/api/teacher/signup` | Teacher registration |
| POST | `/api/teacher/login` | Teacher login |
| POST | `/api/admin/login` | Admin login |

### Classes
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/class/create` | Teacher | Create new class |
| GET | `/api/class/all-classes` | Public | List all classes |
| POST | `/api/class/join/:classId` | Student | Join a class |

### Assignments
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/assignment/create` | Teacher | Create assignment |
| GET | `/api/assignment/list` | Any | List assignments |
| POST | `/api/assignment/submit` | Student | Submit assignment |
| PUT | `/api/assignment/grade/:id` | Teacher | Grade submission |

### Resources
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/resource/upload` | Teacher | Upload resource |
| GET | `/api/resource/list` | Any | List resources |

### Attendance
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/attendance/mark` | Teacher | Mark attendance |
| GET | `/api/attendance/student` | Student | Student's attendance |

### Notifications & AI
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notification/list` | Get notifications |
| POST | `/api/ai/chat` | AI chatbot |

---

## 🔒 Security

- JWT-based authentication with httpOnly cookies
- bcrypt password hashing (salt rounds: 10)
- Role-based access control (Student / Teacher / Admin)
- Auth middleware on all protected routes
- Environment variables for all secrets
- Input validation on all API endpoints

---

## 👥 Roles & Responsibilities of Team Members (Form - 2)

**Project ID:** SKIT/CSE/2023-2027/39  
**Branch & Section:** Computer Science & Engg. (CSE), Section C  
**Mentor:** Swati (Verified & Approved)

### 1. Kunal Saukhiya (Team Lead)
**Sprint(s):** Authentication & User Management, Classroom & Meeting Management, Admin Dashboard

| User Story | Start Date | End Date | Details of Task Completed Under the User Story |
|---|---|---|---|
| Backend setup & authentication APIs | 10/08/2026 | 31/08/2026 | Setup backend project structure, create authentication APIs |
| OTP Login and JWT sessions | 01/09/2026 | 25/09/2026 | Implement Firebase OTP authentication and JWT session handling |
| Classroom APIs and WebRTC | 26/09/2026 | 31/10/2026 | Develop create/join APIs and WebRTC signaling support |
| Notification and admin APIs | 01/11/2026 | 30/11/2026 | Develop notification APIs and backend services for administration |
| Reports and analytics APIs | 01/12/2026 | 31/12/2026 | Implement reports, analytics & required backend queries for admin dashboard |
| Backend integration and optimization | 01/01/2027 | 15/02/2027 | Integrate backend modules, improve API performance, validate data flow and resolve integration issues |
| Final backend testing and deployment | 16/02/2027 | 15/03/2027 | Perform final backend bug fixing, security checks and product support |

### 2. Manish Regar (Member 1)
**Sprint(s):** Classroom & Meeting Management, Learning Management and Admin Dashboard

| User Story | Start Date | End Date | Details of Task Completed Under the User Story |
|---|---|---|---|
| Database schema design | 10/08/2026 | 31/08/2026 | Design MongoDB schemas for users, classrooms, meetings, attendance and other project modules |
| User and authentication models | 01/09/2026 | 25/09/2026 | Develop user, role and authentication related database models and integrate with backend APIs |
| Classroom and meeting module | 26/09/2026 | 31/10/2026 | Develop classroom and meeting database operations including create, join and participant management |
| Notes, assignment and attendance APIs | 01/11/2026 | 30/11/2026 | Develop APIs and database operations for notes, assignments & attendance |
| Gemini chatbot integration | 01/12/2026 | 31/12/2026 | Integrate Gemini API and develop AI services for doubt solving and learning assistance |
| Analytics and database optimization | 01/01/2027 | 15/02/2027 | Develop analytical queries, optimize database operations and improve indexing & data retrieval performance |
| Database testing and deployment support | 16/02/2027 | 15/03/2027 | Perform database validation and provide backend/database support during final deployment |

### 3. Rishabh Jain (Member 2)
**Sprint(s):** Testing & Deployment

| User Story | Start Date | End Date | Details of Task Completed Under the User Story |
|---|---|---|---|
| Git setup and test planning | 10/08/2026 | 31/08/2026 | Configure Git workflow, prepare testing approach and define test cases for project modules |
| Authentication and user module testing | 01/09/2026 | 30/09/2026 | Test OTP login, JWT sessions, role management and authentication workflow |
| Classroom and live class testing | 01/10/2026 | 31/10/2026 | Test classroom create/join, participant management and WebRTC live class functionality |
| Learning module testing | 01/11/2026 | 30/11/2026 | Test notes, assignments, notifications, file uploads & learning management features |
| Admin dashboard and integration testing | 01/12/2026 | 31/12/2026 | Test admin dashboard, reports, analytics and integration between frontend and backend modules |
| Security, performance & regression testing | 01/01/2027 | 15/02/2027 | Perform security checks, performance testing and verify previously reported bugs |
| Final system testing & deployment verification | 16/02/2027 | 15/03/2027 | Conduct end-to-end testing, verify bug fixes & performance optimization |

### 4. Manish Kumar (Member 3)
**Sprint(s):** Authentication & User Management, Classroom and Meeting Management & Admin Dashboard

| User Story | Start Date | End Date | Details of Task Completed Under the User Story |
|---|---|---|---|
| React setup & authentication UI | 10/08/2026 | 31/08/2026 | Setup React frontend structure and develop login, registration and authentication interfaces |
| Profile and user management UI | 01/09/2026 | 25/09/2026 | Develop profile management, role based interfaces and user-related frontend components |
| Classroom and meeting UI | 26/09/2026 | 31/10/2026 | Create classroom create/join interface and classroom management UI |
| Live class & participant UI | 01/11/2026 | 30/11/2026 | Develop live-class interface, participant screens and responsive meeting components |
| Notification and notes UI | 01/12/2026 | 31/12/2026 | Develop UI for notes, notifications and learning related features |
| Admin dashboard & frontend integration | 01/01/2027 | 15/02/2027 | Develop admin dashboard UI and integrate frontend components with backend APIs & database services |
| Responsive UI, bug fixing & final deployment | 16/02/2027 | 15/03/2027 | Fix frontend issues, improve responsive design, perform final UI testing and support deployment |

---

## 📄 License

This project is developed for academic purposes as part of the B.Tech Final Year curriculum.

---

