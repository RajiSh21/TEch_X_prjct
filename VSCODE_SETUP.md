# Quick Setup Guide - VS Code & Mobile App

This guide will help you set up the complete Placement Portal project in VS Code, including the mobile app.

## Prerequisites

- **Python 3.7+** (for Flask backend)
- **Node.js 16+** (for React Native)
- **VS Code** (with recommended extensions)
- **Android Studio** (for Android development)
- **Xcode** (for iOS development, macOS only)

## Step 1: Open Project in VS Code

### Option A: Open Workspace (Recommended)

```bash
cd TEch_X_prjct
code placement-portal.code-workspace
```

This opens a multi-folder workspace with:
- Root folder (backend)
- Mobile app folder
- Organized view of both parts

### Option B: Open Root Folder

```bash
cd TEch_X_prjct
code .
```

## Step 2: Install Extensions

VS Code will prompt you to install recommended extensions:

**Essential:**
- Python (ms-python.python)
- Pylance (ms-python.vscode-pylance)
- React Native Tools (msjsdiag.vscode-react-native)
- ESLint (dbaeumer.vscode-eslint)
- Prettier (esbenp.prettier-vscode)

Click "Install All" when prompted, or install manually from Extensions tab.

## Step 3: Setup Backend

1. **Open terminal in VS Code** (`` Ctrl+` ``)

2. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Initialize database:**
   ```bash
   python app.py
   ```
   (Press Ctrl+C after it starts)

## Step 4: Setup Mobile App

1. **Open new terminal** (Click + in terminal panel)

2. **Navigate to mobile folder:**
   ```bash
   cd mobile
   ```

3. **Install npm dependencies:**
   ```bash
   npm install
   ```

4. **For iOS only (macOS):**
   ```bash
   cd ios
   pod install
   cd ..
   ```

## Step 5: Configure API URL

1. **Open** `mobile/src/services/api.js`

2. **Update API_BASE_URL:**
   - **Android Emulator:** `http://10.0.2.2:5000`
   - **iOS Simulator:** `http://localhost:5000`
   - **Physical Device:** `http://YOUR_COMPUTER_IP:5000`

   To find your computer's IP:
   - **Windows:** `ipconfig` (look for IPv4)
   - **macOS/Linux:** `ifconfig` or `ip addr` (look for inet)

## Step 6: Run the Application

### Start Backend

**Method 1: From Terminal**
```bash
python app.py
```

**Method 2: From VS Code Debug Panel**
1. Click Debug icon (left sidebar)
2. Select "Flask: App"
3. Press F5 or click green play button

Backend will run on http://127.0.0.1:5000

### Start Mobile App

**In a new terminal:**

**For Android:**
```bash
cd mobile
npm run android
```

**For iOS (macOS only):**
```bash
cd mobile
npm run ios
```

## Step 7: Verify Setup

### Check Backend
- Open browser: http://127.0.0.1:5000
- You should see the Placement Portal web interface

### Check Mobile App
- Mobile app should launch on emulator/simulator
- You should see 4 tabs: Home, Placements, Internships, Scrape
- Try navigating between tabs

## Troubleshooting

### Backend Not Connecting from Mobile

**For Android Emulator:**
```javascript
// In mobile/src/services/api.js
const API_BASE_URL = 'http://10.0.2.2:5000';
```

**For Physical Device:**
1. Find your computer's IP address
2. Make sure Flask is running with `host='0.0.0.0'` (default in app.py)
3. Update API_BASE_URL: `http://YOUR_IP:5000`
4. Ensure phone and computer are on same WiFi network

### Metro Bundler Issues

```bash
cd mobile
npm start -- --reset-cache
```

### Android Build Errors

```bash
cd mobile/android
./gradlew clean
cd ..
npm run android
```

### iOS Build Errors (macOS)

```bash
cd mobile/ios
pod deintegrate
pod install
cd ..
npm run ios
```

## VS Code Tips

### Multiple Terminals

- **Split Terminal:** Click split icon in terminal
- **New Terminal:** Click + icon
- **Switch Terminal:** Use dropdown menu

Keep one terminal for backend, one for mobile.

### Debugging

**Flask Backend:**
- Set breakpoints in Python files
- Press F5 to start debugging
- Use "Flask: App" configuration

**React Native:**
- Use "React Native: Android" or "React Native: iOS" configuration
- Set breakpoints in .js files
- Press F5 to attach debugger

### Keyboard Shortcuts

- **Open Command Palette:** `Ctrl+Shift+P` (or `Cmd+Shift+P` on macOS)
- **Quick Open File:** `Ctrl+P`
- **Toggle Terminal:** `` Ctrl+` ``
- **Split Editor:** `Ctrl+\`
- **Go to Definition:** `F12`
- **Format Document:** `Shift+Alt+F`

## Project Structure in VS Code

```
placement-portal.code-workspace
├── 🎓 Root (Backend)
│   ├── app.py              <- Flask application
│   ├── job_scraper_selenium.py
│   ├── templates/
│   └── ...
└── 📱 Mobile App
    ├── App.js              <- React Native app
    ├── src/
    │   ├── screens/
    │   └── services/
    └── package.json
```

## Next Steps

1. **Test the web interface** at http://127.0.0.1:5000
2. **Test the mobile app** - Navigate through all tabs
3. **Try scraping** - Go to Scrape tab and add some jobs
4. **View results** - Check Placements and Internships tabs

## Common Workflows

### Running Both (Backend + Mobile)

**Terminal 1:**
```bash
python app.py
```

**Terminal 2:**
```bash
cd mobile
npm run android  # or npm run ios
```

### Development Mode

**Backend:**
```bash
export FLASK_DEBUG=true  # or set FLASK_DEBUG=true on Windows
python app.py
```

**Mobile:**
```bash
cd mobile
npm start  # Start Metro bundler separately
```

Then in another terminal:
```bash
npm run android  # or npm run ios
```

## Getting Help

- **Backend Issues:** See `PLACEMENT_APP_GUIDE.md`
- **Mobile Issues:** See `mobile/README.md`
- **Scraper Issues:** See `QUICK_START.md`

## Summary

You now have:
✅ VS Code workspace configured
✅ Flask backend running
✅ React Native mobile app running
✅ Both connected and working together

Happy coding! 🚀
