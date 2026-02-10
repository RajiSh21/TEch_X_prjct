#!/bin/bash
# Script to open Placement Portal in VS Code

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║        Opening Placement Portal in VS Code                   ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

# Check if VS Code is installed
if ! command -v code &> /dev/null; then
    echo "❌ VS Code (code command) not found!"
    echo ""
    echo "Please install VS Code and ensure 'code' command is in PATH:"
    echo "  - Install VS Code: https://code.visualstudio.com/"
    echo "  - Enable 'code' command: Open VS Code → Command Palette → 'Shell Command: Install code command in PATH'"
    echo ""
    exit 1
fi

echo "✓ VS Code found"
echo ""
echo "Opening workspace: placement-portal.code-workspace"
echo ""

# Open the workspace
code placement-portal.code-workspace

echo "✓ VS Code workspace opened!"
echo ""
echo "Next steps:"
echo "  1. Install recommended extensions when prompted"
echo "  2. Open terminal (Ctrl+\` or Cmd+\`)"
echo "  3. Start Flask backend: python app.py"
echo "  4. Open new terminal and run mobile: cd mobile && npm install && npm run android"
echo ""
echo "For detailed instructions, see VSCODE_SETUP.md"
echo ""
