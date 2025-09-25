# HackTheAI Final Round

Welcome to the HackTheAI Final Round project!

## Overview

This repository contains the code and resources for the final round of the GUB Hackathon. The project is **AI Smart University Helpdesk**, an AI-powered assistant designed to help students and others with university-related queries. It supports real-time chat,complaint, notices, FAQs, and department-specific information.

---

## Features

- Real-time chat with AI assistant
- Quick suggestions for common queries
- User authentication with JWT
- Profile management
- Notices and FAQs support
- Automatic Complaint Detect and Provide Admin management
- Complaint Dashboard
- Login/Register
- Email notifications for OTP and other alerts

---

## Technologies Used

- **Frontend:** NextJS, TypeScript, Tailwind CSS
- **Backend:** Node.js, Express, MongoDB
- **SmythOS** Agent API
- **Authentication:** JWT (Access + Refresh Tokens)
- **Email Notifications:** Nodemailer

---

## Getting Started

### Prerequisites

- Node.js v18+
- MongoDB database
- npm 

### Installation

1. Clone the repository:

```bash
git clone https://github.com/takbir-hasan/HackTheAI-Final-Round.git
cd HackTheAI-Final-Round
```
2. Install dependencies for backend:
```
cd backend
npm install
```
3. Install dependencies for frontend:
```
cd frontend
npm install
```

### Environment Variables
create a .env file in the ```backend``` folder and add the follwoing:
```
PORT=
MONGO_URI=

ACCESS_TOKEN_SECRET=
REFRESH_TOKEN_SECRET=
ACCESS_TOKEN_EXPIRES_IN=
REFRESH_TOKEN_EXPIRES_IN=
SMYTH_AGENT_URL=
EMAIL_USER=
EMAIL_PASS=

```
### Variable Description
```

PORT: Backend server port (e.g., 5000)

MONGO_URI: MongoDB connection URI

ACCESS_TOKEN_SECRET / REFRESH_TOKEN_SECRET: JWT secret keys

ACCESS_TOKEN_EXPIRES_IN / REFRESH_TOKEN_EXPIRES_IN: Token expiry times (e.g., 15m, 7d)

SMYTH_AGENT_URL: Endpoint for AI assistant queries

EMAIL_USER / EMAIL_PASS: Email credentials for sending OTPs or notifications
```

### Running the Project
Backend:
```
cd  backend
npm run dev
```
Frontend:
```
cd frontend
npm run dev
```

### Project Structure
```
HackTheAI-Final-Round/
├── backend/          # Node.js backend with Express
├── frontend/         # React frontend
├── README.md
├── LICENSE
└── .gitignore
```

### Usage

1. Register or login as a user.

2. Start chatting with the AI assistant.

3. Use quick suggestion buttons for faster queries.

4. Access your profile for personal information.

5. Admins can manage notices and FAQs.

### Contributing

1. Fork the repository.

2. Create a new branch: git checkout -b feature/my-feature

3. Commit your changes: git commit -m "feat: add my feature"

4. Push the branch: git push origin feature/my-feature

5. Create a Pull Request.