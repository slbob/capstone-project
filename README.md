# Walk30 Mobile Application

## Project Overview
The **Walk30 Mobile App** is a cross-platform mobile application designed to support participants in the WALK30 Challenge—a community-based initiative encouraging people to walk at least 30 minutes a day for 30 days. The app enables participants to easily log their walking minutes, track progress, engage with teams and communities, and stay motivated throughout the challenge. It also provides organizers with reliable participation data and tools to manage the challenge effectively.

The application is built with scalability, accessibility, and user engagement in mind, making it suitable for individuals, schools, workplaces, and municipalities participating in the Walk30 program.

---

## Features

### Participant Features
- User registration and secure authentication
- Join a Walk30 challenge, community, and optional team
- Daily logging of walking minutes
- Personal progress tracking (total minutes, streaks, completion status)
- Team and community leaderboards
- Push notifications and daily reminders
- View challenge announcements and updates
- Offline logging with automatic sync when online

### Organizer/Admin Features
- Challenge and season management
- Team, organization, and participant management
- Leaderboard configuration
- Announcement and notification broadcasting
- Exportable reports and participation analytics

---

## Installation Instructions

### Prerequisites
- Node.js (v18 or later)
- npm or yarn
- Expo CLI
- Git
- PostgreSQL

### Clone the Repository
```bash
git clone https://github.com/your-org/walk30-app.git
cd walk30-app
```

### Install Dependencies

#### Mobile App
```bash
cd mobile
npm install
```

#### Backend API
```bash
cd backend
npm install
```

### Environment Variables
Create a `.env` file in the backend directory:
```env
DATABASE_URL=postgresql://username:password@localhost:5432/walk30
JWT_SECRET=your_jwt_secret
PORT=5000
```

### Run the Application

#### Start Backend
```bash
cd backend
npm run dev
```

#### Start Mobile App
```bash
cd mobile
npx expo start
```

---

## Usage
1. Open the Walk30 app.
2. Create an account or log in.
3. Select your challenge, community, and team.
4. Log walking minutes daily.
5. Track progress and streaks.
6. View leaderboards.
7. Receive reminders and announcements.

Organizers can use the admin dashboard to manage challenges, users, and reports.

---

## Technologies Used

### Mobile
- React Native
- Expo
- TypeScript / JavaScript
- React Navigation
- Axios

### Backend
- Node.js
- Express.js
- PostgreSQL
- JWT Authentication

### Admin & Infrastructure
- React (Admin Dashboard)
- Cloud Hosting (AWS / GCP / Azure)
- Firebase Cloud Messaging
- Git & GitHub

---

## Future Improvements
- Apple Health & Google Fit integration
- Wearable device support
- Interactive walking routes
- In-app prize draws
- Multi-language support
- Advanced analytics and reporting
- Social sharing and achievements
- Enhanced accessibility features

---

Walk30 helps communities build healthier habits—one walk at a time.
