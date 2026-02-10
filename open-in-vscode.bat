@echo off
REM Script to open Placement Portal in VS Code (Windows)

echo ================================================================
echo        Opening Placement Portal in VS Code
echo ================================================================
echo.

REM Check if VS Code is installed
where code >nul 2>nul
if %errorlevel% neq 0 (
    echo X VS Code (code command) not found!
    echo.
    echo Please install VS Code and ensure 'code' command is in PATH:
    echo   - Install VS Code: https://code.visualstudio.com/
    echo   - Restart terminal after installation
    echo.
    pause
    exit /b 1
)

echo [OK] VS Code found
echo.
echo Opening workspace: placement-portal.code-workspace
echo.

REM Open the workspace
code placement-portal.code-workspace

echo [OK] VS Code workspace opened!
echo.
echo Next steps:
echo   1. Install recommended extensions when prompted
echo   2. Open terminal (Ctrl+`)
echo   3. Start Flask backend: python app.py
echo   4. Open new terminal and run mobile: cd mobile && npm install && npm run android
echo.
echo For detailed instructions, see VSCODE_SETUP.md
echo.
pause
