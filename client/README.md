# GyaanSetu — Frontend (Client)

This is the frontend application for **GyaanSetu**, a low-bandwidth optimized remote classroom platform tailored for rural colleges. It provides dedicated interfaces for Students, Teachers, and Admins to manage classes, resources, attendance, and live video sessions.

## Tech Stack

- **Framework:** React 19 + Vite 7
- **Styling:** Tailwind CSS 4
- **State Management:** Redux Toolkit
- **Authentication:** Firebase (OTP-based)
- **Video Conferencing:** ZegoCloud UIKit
- **Routing:** React Router

## Folder Structure

```text
client/
├── public/                 # Static assets (images, logos)
├── src/
│   ├── components/         # Reusable UI components (Header, Footer, Error Boundaries)
│   ├── context/            # React Context API providers
│   ├── pages/              # Application views (Home, Auth, Dashboard, Profile, Classroom, etc.)
│   ├── store/              # Redux slices and store configuration
│   ├── App.jsx             # Root application component and routing
│   └── main.jsx            # Application entry point
├── .env.example            # Template for environment variables
├── package.json            # Dependencies and scripts
└── vite.config.js          # Vite bundler configuration
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager

### Installation

1. **Navigate to the client directory:**
   ```bash
   cd client
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env` file in the root of the `client` directory based on the `.env.example` file:
   ```bash
   cp .env.example .env
   ```
   *Note: Populate the `.env` file with your Firebase, ZegoCloud, and Backend API credentials (see Environment Variables section below).*

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open in Browser:** 
   Navigate to [http://localhost:5173](http://localhost:5173) to view the app.

## Environment Variables

Ensure the following variables are defined in your `.env` file for the application to function correctly:

| Variable | Description |
|----------|-------------|
| `VITE_BASE_URL` | Your Backend Express API URL |
| `VITE_ZEGOCLOUD_APP_ID` | ZegoCloud App ID for Video Calls |
| `VITE_ZEGOCLOUD_SERVER_SECRET` | ZegoCloud Server Secret |
| `VITE_API_KEY` | Firebase API key for OTP Login |
| `VITE_AUTH_DOMAIN` | Firebase Authentication Domain |
| `VITE_PROJECT_ID` | Firebase Project ID |

## Features Developed

- Role-based Routing (Student/Teacher/Admin)
- Mobile-responsive dashboards using Tailwind CSS
- Secure JWT token handling and Firebase OTP integration
- Centralized state management for user profiles via Redux
