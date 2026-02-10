# 🚀 Quick Start - Open in VS Code

## Three Ways to Open the Project

### Method 1: Using Script (Easiest) ⭐

**Linux/macOS:**
```bash
./open-in-vscode.sh
```

**Windows:**
```cmd
open-in-vscode.bat
```

### Method 2: Command Line

```bash
code placement-portal.code-workspace
```

### Method 3: From VS Code

1. Open VS Code
2. File → Open Workspace from File...
3. Navigate to `placement-portal.code-workspace`
4. Click "Open"

---

## What You'll See

When you open the workspace, VS Code will display:

```
📁 PLACEMENT PORTAL
├── 🎓 Placement Portal - Root
│   ├── app.py (Flask backend)
│   ├── job_scraper_selenium.py
│   ├── templates/
│   └── ...
│
├── 📱 Mobile App
│   ├── App.js
│   ├── src/
│   │   ├── screens/
│   │   └── services/
│   └── package.json
│
└── 🌐 Flask Backend
    (Same as Root, for easy access)
```

---

## Install Extensions (First Time)

VS Code will show a popup:
```
"This workspace has extension recommendations"
[Show Recommendations] [Install All]
```

Click **"Install All"** to install:
- ✅ Python
- ✅ Pylance
- ✅ React Native Tools
- ✅ ESLint
- ✅ Prettier

---

## Running the Project

### Terminal Layout (Recommended)

Split your terminal into 2 panels:

**Terminal 1 - Flask Backend:**
```bash
# In root directory
python app.py
```

**Terminal 2 - Mobile App:**
```bash
# Navigate to mobile
cd mobile

# Install dependencies (first time only)
npm install

# Run on Android
npm run android

# OR run on iOS (macOS only)
npm run ios
```

### Using VS Code Debugger

1. **Click Debug icon** (left sidebar, bug icon)
2. **Select configuration:**
   - "Flask: App" - for backend debugging
   - "React Native: Android" - for Android app
   - "React Native: iOS" - for iOS app
3. **Press F5** or click green play button

---

## Folder Navigation

### Quick Folder Switching

At bottom of Explorer panel, you'll see:
```
▼ 🎓 Placement Portal - Root
▼ 📱 Mobile App
▼ 🌐 Flask Backend
```

Click to expand/collapse folders.

### Quick File Open

Press **Ctrl+P** (Cmd+P on Mac) and type:
- `app.py` - Open Flask app
- `HomeScreen.js` - Open mobile home screen
- `api.js` - Open API service

---

## Common Tasks

### Edit Backend Code
1. Click "🎓 Placement Portal - Root"
2. Open `app.py`
3. Make changes
4. Save (Ctrl+S)
5. Restart Flask server

### Edit Mobile Code
1. Click "📱 Mobile App"
2. Navigate to `src/screens/`
3. Open any screen
4. Make changes
5. Save (Ctrl+S)
6. Hot reload happens automatically!

### Add New Mobile Screen
1. Right-click `src/screens/`
2. New File
3. Name it (e.g., `NewScreen.js`)
4. Copy template from existing screen
5. Update `App.js` to include new screen

---

## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Open Command Palette | `Ctrl+Shift+P` |
| Quick Open File | `Ctrl+P` |
| Toggle Terminal | `` Ctrl+` `` |
| Split Terminal | `Ctrl+Shift+5` |
| Toggle Sidebar | `Ctrl+B` |
| Format Document | `Shift+Alt+F` |
| Go to Definition | `F12` |
| Find in Files | `Ctrl+Shift+F` |

---

## Debugging Tips

### Debug Flask Backend

1. Set breakpoint (click left of line number)
2. Press F5 → Select "Flask: App"
3. Make request to your app
4. Debugger will pause at breakpoint
5. Inspect variables in Debug panel

### Debug Mobile App

1. Set breakpoint in .js file
2. Press F5 → Select "React Native: Android"
3. App will launch with debugger attached
4. Navigate to trigger your breakpoint
5. Inspect variables and step through code

---

## Project Structure in Sidebar

```
🎓 PLACEMENT PORTAL - ROOT
├── 📄 app.py                    ← Flask main app
├── 📄 job_scraper_selenium.py   ← Selenium scraper
├── 📄 job_scraper_integration.py ← Scraper-DB bridge
├── 📁 templates/                ← HTML templates
│   ├── base.html
│   ├── index.html
│   ├── placements.html
│   ├── internships.html
│   └── scrape.html
├── 📄 requirements.txt          ← Python dependencies
└── 📚 Documentation files

📱 MOBILE APP
├── 📄 App.js                    ← Main app component
├── 📁 src/
│   ├── 📁 screens/              ← Screen components
│   │   ├── HomeScreen.js
│   │   ├── PlacementsScreen.js
│   │   ├── InternshipsScreen.js
│   │   └── ScrapeScreen.js
│   └── 📁 services/
│       └── api.js               ← Backend API calls
├── 📄 package.json              ← npm dependencies
└── 📄 README.md                 ← Mobile docs
```

---

## Troubleshooting

### "Command 'code' not found"

**Fix:**
1. Open VS Code
2. Press `Ctrl+Shift+P`
3. Type: "Shell Command: Install 'code' command in PATH"
4. Press Enter
5. Restart terminal

### Can't Find Workspace File

Make sure you're in the project directory:
```bash
cd TEch_X_prjct
ls placement-portal.code-workspace  # Should exist
```

### Extensions Not Installing

1. Open Extensions panel (Ctrl+Shift+X)
2. Manually search and install:
   - Python
   - React Native Tools
   - ESLint
   - Prettier

---

## Next Steps

Once VS Code is open:

1. ✅ **Install Extensions** (if prompted)
2. ✅ **Open Terminal** (`` Ctrl+` ``)
3. ✅ **Start Flask**: `python app.py`
4. ✅ **Start Mobile**: In new terminal, `cd mobile && npm install && npm run android`
5. ✅ **Start Coding!**

For detailed setup, see: **VSCODE_SETUP.md**

---

Happy coding! 🎉
