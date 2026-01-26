# Quick Start Guide

## For Developers

### Step 1: Clone the Repository
```bash
git clone https://github.com/RajiSh21/TEch_X_prjct.git
cd TEch_X_prjct
```

### Step 2: Install All Dependencies
```bash
# Install backend dependencies
npm install

# Install mobile dependencies
cd mobile && npm install && cd ..
```

### Step 3: Set Up Environment Variables
```bash
# Copy the example environment file
cp .env.example .env

# Edit .env and update the values
# Important: Change JWT_SECRET for production!
```

### Step 4: Start MongoDB
```bash
# Using Docker (recommended)
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Or use local MongoDB installation
# macOS: brew services start mongodb-community
# Linux: sudo systemctl start mongodb
```

### Step 5: Start the Backend Server
```bash
# Development mode with auto-reload
npm run dev
```

The API will be running at `http://localhost:5000`

### Step 6: Start the Mobile App
```bash
# In a new terminal window
cd mobile
npm start
```

Then:
- For iOS: Press `i` (requires macOS)
- For Android: Press `a` (requires Android Studio)
- For web: Press `w`
- For physical device: Scan QR code with Expo Go app

## Default Test Users

After running the backend, you can create test users by registering through the mobile app or using the API directly.

### Example Registration (Admin/TPO)
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@college.edu",
    "password": "admin123",
    "role": "admin"
  }'
```

### Example Registration (Student)
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@student.edu",
    "password": "student123",
    "role": "student",
    "profile": {
      "department": "Computer Science",
      "yearOfStudy": 4,
      "cgpa": 8.5,
      "skills": ["JavaScript", "React", "Node.js", "Python"]
    }
  }'
```

## Testing the System

### 1. Test Authentication
- Open the mobile app
- Register a new account or login
- Verify that you're redirected to the dashboard

### 2. Test Job Scraping (Admin/TPO only)
```bash
# Login as admin first to get the token
TOKEN="your_jwt_token_here"

# Trigger job scraping
curl -X POST http://localhost:5000/api/scraper/run \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"

# Check scraping stats
curl http://localhost:5000/api/scraper/stats \
  -H "Authorization: Bearer $TOKEN"
```

### 3. Test Job Listings
- Navigate to the Jobs tab in the mobile app
- Browse available jobs
- Search for specific positions
- Apply filters

### 4. Test AI Analytics
- As a student, view your dashboard to see AI match scores
- Click on any job to see the match analysis
- Check your profile insights

### 5. Test Interview Scheduling (Admin/TPO)
```bash
# Schedule an interview
curl -X POST http://localhost:5000/api/interviews \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "job": "job_id_here",
    "student": "student_id_here",
    "scheduledDate": "2026-02-01T10:00:00Z",
    "type": "technical",
    "location": "online",
    "meetingLink": "https://meet.google.com/xxx-xxxx-xxx"
  }'
```

### 6. Test Notifications
- Check the notifications tab
- Mark notifications as read
- Verify real-time updates

## Common Issues & Solutions

### Issue: MongoDB Connection Error
**Solution**: Make sure MongoDB is running
```bash
# Check if MongoDB is running
docker ps | grep mongo
# Or
brew services list | grep mongodb
```

### Issue: Can't connect to backend from mobile app
**Solution**: Update the API_BASE_URL in `mobile/src/constants/theme.js`
- For Android Emulator: Use `http://10.0.2.2:5000/api`
- For iOS Simulator: Use `http://localhost:5000/api`
- For Physical Device: Use your computer's IP address (e.g., `http://192.168.1.100:5000/api`)

### Issue: Expo/React Native errors
**Solution**: Clear cache and reinstall
```bash
cd mobile
rm -rf node_modules
npm install
npx expo start --clear
```

### Issue: Port already in use
**Solution**: Change the port in `.env` or kill the process using the port
```bash
# Find process using port 5000
lsof -i :5000
# Kill the process
kill -9 <PID>
```

## Next Steps

1. **Customize the UI**: Modify colors and theme in `mobile/src/constants/theme.js`
2. **Add More Features**: Extend the controllers and models as needed
3. **Configure Email Notifications**: Set up SMTP credentials in `.env`
4. **Deploy to Production**: Follow the deployment guide in README.md

## Need Help?

- Check the main README.md for detailed documentation
- Review the API endpoints section
- Look at the code examples in the controllers
- Create an issue on GitHub

Happy coding! 🚀
