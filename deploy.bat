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

:: Check if this is a Next.js project
if exist "next.config.js" (
    echo Next.js project detected. 
    echo This will trigger the GitHub Actions workflow for deployment.
    echo.
    echo NOTE: Your website will be built from the 'out' directory by GitHub Actions.
    echo The actual website files are built on GitHub's servers, not from your local files.
    echo.
)

:: Check for index.html in root directory or public directory
if not exist "index.html" (
    if not exist "public\index.html" (
        echo Warning: No index.html found in root or public directory.
        echo GitHub Pages might display README instead of your website.
        echo Make sure your build process generates the proper files.
    )
)

:: Create .nojekyll file to prevent GitHub Pages from ignoring files starting with underscore
echo Creating .nojekyll file for proper GitHub Pages rendering...
echo. > .nojekyll

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
echo Your changes have been pushed and GitHub Actions workflow is now running.
echo The deployment process may take a few minutes to complete.
echo.
echo IMPORTANT GITHUB PAGES NOTES:
echo 1. GitHub Actions builds your Next.js site in the cloud
echo 2. The .nojekyll file should be automatically created in your output directory
echo 3. Your CNAME file will be copied to the deployment automatically
echo 4. If your site still doesn't appear, check the Actions tab in your GitHub repository
echo.
echo Your website should be updated soon at: 
echo https://www.gowthamsridhar.com
echo ===========================================

echo.
echo Press any key to exit...
pause >nul

:eof
endlocal 