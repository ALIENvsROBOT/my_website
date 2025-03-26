@echo off
setlocal enabledelayedexpansion

echo ===================================
echo  Website Deployment Script
echo  www.gowthamsridhar.com
echo ===================================
echo.

:: Check if Git is installed
where git >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Error: Git is not installed or not in PATH
    goto :eof
)

:: Get the current branch name
for /f "tokens=*" %%a in ('git rev-parse --abbrev-ref HEAD') do set BRANCH=%%a

:: Ask for commit message
set /p COMMIT_MSG="Enter commit message (or press Enter for default): "

:: Use default message if none provided
if "!COMMIT_MSG!"=="" (
    set COMMIT_MSG=Update website content
)

echo.
echo Working Directory: %CD%
echo Current Branch: %BRANCH%
echo.

echo Step 1: Adding all changes to Git...
git add .
if %ERRORLEVEL% NEQ 0 (
    echo Error: Failed to add files to Git
    goto :eof
)
echo Done.

echo.
echo Step 2: Committing changes with message: "!COMMIT_MSG!"
git commit -m "!COMMIT_MSG!"
if %ERRORLEVEL% NEQ 0 (
    echo Warning: Commit failed. There might be no changes to commit.
    set /p CONTINUE="Continue anyway? (y/n): "
    if /i "!CONTINUE!" NEQ "y" goto :eof
)
echo Done.

echo.
echo Step 3: Pushing to remote repository (branch: %BRANCH%)...
git push origin %BRANCH%
if %ERRORLEVEL% NEQ 0 (
    echo Error: Failed to push to remote repository
    goto :eof
)
echo Done.

echo.
echo ===========================================
echo ✅ Successfully pushed to GitHub!
echo.
echo GitHub Pages deployment has been triggered.
echo Your website should be updated in a few minutes.
echo Visit: https://www.gowthamsridhar.com
echo ===========================================

echo.
echo Press any key to exit...
pause >nul

:eof
endlocal 