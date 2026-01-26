# College Placement System with AI Analytics

A comprehensive mobile and web-based placement management system designed to streamline college placements with AI-powered analytics, automated job scraping, interview scheduling, and real-time notifications.

## 🌟 Features

### Core Features
- **User Authentication**: Secure login/registration system with role-based access (Student, Admin, TPO, Company)
- **Job Management**: Browse, search, and apply for jobs and internships
- **Automated Job Scraping**: Web scraping to automatically fetch jobs from popular job boards
- **Interview Scheduling**: Automated interview scheduling with location assignment
- **AI Analytics**: 
  - AI-powered job-student matching algorithm
  - Personalized recommendations
  - Placement analytics and reports
  - Student insights and skill gap analysis
- **Notification System**: Real-time notifications for interviews, applications, and announcements
- **Mobile Application**: React Native app for iOS and Android
- **Professional UI/UX**: Clean, modern, and intuitive interface

### AI Analytics & Reporting
- **Smart Job Matching**: AI algorithms analyze student profiles against job requirements
- **Skill Gap Analysis**: Identifies missing skills and provides recommendations
- **Placement Reports**: Comprehensive analytics on placement statistics
- **Student Insights**: Personalized insights for each student
- **Predictive Analytics**: Success prediction based on profile match

### Automation Features
- **Automated Job Scraping**: Periodic scraping of job boards for new opportunities
- **Smart Interview Scheduling**: Automatic scheduling with conflict detection
- **Location Assignment**: Intelligent venue assignment for on-campus interviews
- **Notification Automation**: Auto-generated notifications for all events

## 🏗️ Architecture

### Backend (Node.js + Express)
```
server/
├── config/          # Database and app configuration
├── controllers/     # Route controllers
├── models/          # MongoDB models
├── routes/          # API routes
├── middleware/      # Authentication & authorization
├── services/        # Business logic (AI, scraping, notifications)
└── index.js         # Server entry point
```

### Mobile App (React Native + Expo)
```
mobile/
├── src/
│   ├── screens/      # App screens
│   ├── components/   # Reusable components
│   ├── navigation/   # Navigation setup
│   ├── contexts/     # Context providers (Auth)
│   ├── services/     # API services
│   ├── constants/    # Theme and constants
│   └── utils/        # Utility functions
└── App.js           # App entry point
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn
- Expo CLI (for mobile development)

### Backend Setup

1. **Install Dependencies**
```bash
npm install
```

2. **Configure Environment Variables**
Create a `.env` file in the root directory:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/college_placement_system
JWT_SECRET=your_jwt_secret_key_change_this_in_production
JWT_EXPIRE=7d
SCRAPING_INTERVAL_HOURS=24
```

3. **Start MongoDB**
```bash
# On macOS with Homebrew
brew services start mongodb-community

# On Linux
sudo systemctl start mongodb

# Or use Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

4. **Run the Backend Server**
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The API will be available at `http://localhost:5000`

### Mobile App Setup

1. **Navigate to Mobile Directory**
```bash
cd mobile
```

2. **Install Dependencies**
```bash
npm install
```

3. **Update API URL**
Edit `mobile/src/constants/theme.js` and update the API_BASE_URL:
```javascript
export const API_BASE_URL = 'http://YOUR_SERVER_IP:5000/api';
```

For local development:
- iOS Simulator: `http://localhost:5000/api`
- Android Emulator: `http://10.0.2.2:5000/api`
- Physical Device: Use your computer's IP address

4. **Start the Mobile App**
```bash
npm start
```

Then:
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan QR code with Expo Go app for physical device

## 📱 Mobile App Screens

1. **Authentication**
   - Login Screen
   - Registration Screen

2. **Dashboard**
   - Overview statistics
   - Quick actions
   - AI match score

3. **Jobs**
   - Job listings with filters
   - Search functionality
   - Job details and application

4. **Interviews**
   - Upcoming interviews
   - Interview history
   - Meeting links and details

5. **Notifications**
   - Real-time notifications
   - Mark as read functionality

6. **Profile**
   - User information
   - Skills and qualifications
   - Settings

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Jobs
- `GET /api/jobs` - Get all jobs (with filters)
- `GET /api/jobs/:id` - Get job details
- `POST /api/jobs` - Create job (Admin/TPO only)
- `PUT /api/jobs/:id` - Update job (Admin/TPO only)
- `DELETE /api/jobs/:id` - Delete job (Admin/TPO only)
- `POST /api/jobs/:id/apply` - Apply for job (Student only)

### Interviews
- `GET /api/interviews` - Get interviews
- `GET /api/interviews/:id` - Get interview details
- `POST /api/interviews` - Schedule interview (Admin/TPO only)
- `PUT /api/interviews/:id` - Update interview (Admin/TPO only)
- `PUT /api/interviews/:id/result` - Update interview result (Admin/TPO only)

### Notifications
- `GET /api/notifications` - Get notifications
- `PUT /api/notifications/:id/read` - Mark as read
- `PUT /api/notifications/read-all` - Mark all as read
- `DELETE /api/notifications/:id` - Delete notification

### Analytics
- `GET /api/analytics/dashboard` - Get dashboard stats
- `GET /api/analytics/report` - Generate placement report (Admin/TPO only)
- `GET /api/analytics/student/:id` - Get student insights
- `GET /api/analytics/match/:jobId` - Analyze job match (Student only)

### Scraper
- `POST /api/scraper/run` - Trigger job scraping (Admin/TPO only)
- `GET /api/scraper/stats` - Get scraping statistics (Admin/TPO only)

## 🤖 AI Analytics System

### Job-Student Matching Algorithm
The system uses a weighted scoring algorithm to match students with jobs:

1. **Skills Match (50%)**: Compares student skills with job requirements
2. **Qualification Match (30%)**: Evaluates CGPA and educational background
3. **Experience Match (20%)**: Assesses relevant experience

### Recommendations Engine
Provides personalized recommendations based on:
- Skill gaps
- Application success rate
- Market trends
- Career path analysis

## 🕷️ Web Scraping System

The automated job scraping service:
- Runs periodically (configurable interval)
- Scrapes multiple job boards
- Deduplicates job listings
- Extracts job details automatically
- Stores jobs in database

**Note**: The current implementation uses mock data for demonstration. In production, implement proper web scraping with respect to robots.txt and rate limiting.

## 🎨 UI/UX Design

### Design System
- **Color Palette**: Modern indigo and pink accent colors
- **Typography**: System fonts with proper hierarchy
- **Spacing**: Consistent 4px-based spacing system
- **Components**: Reusable, accessible components
- **Responsive**: Adapts to different screen sizes

### Design Principles
- Clean and minimal interface
- Intuitive navigation
- Consistent visual language
- Accessibility-first approach
- Performance-optimized

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Input validation
- SQL injection prevention (using Mongoose)
- XSS protection

## 📊 Database Schema

### Collections
- **users**: User profiles and authentication
- **jobs**: Job listings
- **applications**: Job applications
- **interviews**: Interview schedules
- **notifications**: User notifications

## 🧪 Testing

```bash
# Run backend tests (when implemented)
npm test

# Run mobile tests
cd mobile && npm test
```

## 🚢 Deployment

### Backend Deployment
1. Set environment variables
2. Use a process manager (PM2)
3. Set up reverse proxy (Nginx)
4. Enable HTTPS
5. Configure MongoDB Atlas for production

### Mobile App Deployment
1. Build for iOS: `expo build:ios`
2. Build for Android: `expo build:android`
3. Submit to App Store / Play Store

## 📈 Future Enhancements

- [ ] Resume parsing with AI
- [ ] Video interview integration
- [ ] Advanced analytics dashboards
- [ ] Company portal
- [ ] Email notifications
- [ ] Push notifications (Firebase)
- [ ] Document management
- [ ] Calendar integration
- [ ] Chat system for queries
- [ ] Advanced reporting with charts

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 📄 License

This project is licensed under the MIT License.

## 👥 Support

For support, email your-email@example.com or create an issue in the repository.

## 🙏 Acknowledgments

- React Native and Expo teams
- MongoDB community
- Node.js and Express.js communities
- All open-source contributors

---

**Built with ❤️ for better college placements**