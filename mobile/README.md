# Mobile App - Placement Portal

React Native mobile application for the Placement & Internship Portal.

## Prerequisites

- Node.js 16 or higher
- React Native CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)
- Flask backend running on http://localhost:5000

## Setup

1. **Install dependencies:**
   ```bash
   cd mobile
   npm install
   ```

2. **For iOS (macOS only):**
   ```bash
   cd ios
   pod install
   cd ..
   ```

3. **Configure Backend URL:**
   
   Edit `src/services/api.js` and update the `API_BASE_URL`:
   - For Android emulator: `http://10.0.2.2:5000`
   - For iOS simulator: `http://localhost:5000`
   - For physical device: `http://YOUR_COMPUTER_IP:5000`

## Running the App

### Start Flask Backend First

```bash
cd ..
python app.py
```

The Flask server should be running on http://127.0.0.1:5000

### Run Mobile App

**Android:**
```bash
npm run android
```

**iOS (macOS only):**
```bash
npm run ios
```

## Development

### Start Metro Bundler
```bash
npm start
```

### Open in VS Code

Open the workspace file:
```bash
code ../placement-portal.code-workspace
```

## Features

- 🏠 **Home Tab**: Dashboard with statistics and recent opportunities
- 💼 **Placements Tab**: Browse full-time job opportunities
- 🎯 **Internships Tab**: Browse internship opportunities
- 🔍 **Scrape Tab**: Trigger job scraping from mobile

## Troubleshooting

### Backend Connection Issues

**Android Emulator:**
- Use `http://10.0.2.2:5000` instead of `localhost`

**Physical Device:**
- Ensure your phone and computer are on the same network
- Use your computer's IP address: `http://192.168.x.x:5000`
- Make sure Flask is running with `host='0.0.0.0'`

### Metro Bundler Issues

```bash
# Clear cache
npm start -- --reset-cache
```

### Android Build Issues

```bash
cd android
./gradlew clean
cd ..
npm run android
```

## Project Structure

```
mobile/
├── App.js                    # Main app component
├── index.js                  # Entry point
├── package.json             # Dependencies
├── src/
│   ├── screens/             # Screen components
│   │   ├── HomeScreen.js
│   │   ├── PlacementsScreen.js
│   │   ├── InternshipsScreen.js
│   │   └── ScrapeScreen.js
│   └── services/
│       └── api.js           # API service for backend communication
└── android/                 # Android native code
└── ios/                     # iOS native code
```

## API Integration

The mobile app connects to the Flask backend via REST API:

- `GET /api/jobs` - Get all jobs
- `GET /api/jobs?type=placement` - Get placements
- `GET /api/jobs?type=internship` - Get internships
- `POST /scrape` - Trigger job scraping

## Screenshots

*(Screenshots will be added after running the app)*

## Support

For issues or questions, see the main README.md in the root directory.
