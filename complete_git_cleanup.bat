@echo off
echo ===============================================================================
echo COMPLETE GIT CLEANUP - All-in-One Script
echo ===============================================================================
echo.
echo This script will:
echo   1. Show you what will be removed
echo   2. Remove unwanted files from Git
echo   3. Update .gitignore
echo   4. Commit the changes
echo.
echo Files will stay in your folder, just removed from Git tracking.
echo.
echo Press Ctrl+C to cancel, or
pause
echo.

REM ===== STEP 1: Preview =====
echo.
echo ===============================================================================
echo STEP 1: Preview - Files to be removed from Git
echo ===============================================================================
echo.

echo [.MD Files (except README.md)]
for %%f in (*.md) do (
    if not "%%f"=="README.md" (
        echo   - %%f
    )
)

echo.
echo [Test Scripts]
if exist *_test.js echo   - *_test.js files
if exist test_*.js echo   - test_*.js files
if exist debug_*.js echo   - debug_*.js files
if exist check_*.js echo   - check_*.js files
if exist verify_*.js echo   - verify_*.js files

echo.
echo [Root SQL Files]
for %%f in (*.sql) do (
    echo   - %%f
)

echo.
echo [Batch Files]
for %%f in (*.bat) do (
    echo   - %%f
)

echo.
echo [Text Files]
for %%f in (*.txt) do (
    echo   - %%f
)

echo.
echo Press Ctrl+C to cancel, or
pause
echo.

REM ===== STEP 2: Remove from Git =====
echo.
echo ===============================================================================
echo STEP 2: Removing files from Git tracking
echo ===============================================================================
echo.

echo Removing .md files...
for %%f in (*.md) do (
    if not "%%f"=="README.md" (
        git rm --cached "%%f" 2>nul
    )
)

echo Removing test scripts...
git rm --cached *_test.js 2>nul
git rm --cached test_*.js 2>nul
git rm --cached debug_*.js 2>nul
git rm --cached check_*.js 2>nul
git rm --cached verify_*.js 2>nul
git rm --cached comprehensive_system_test.js 2>nul

echo Removing root SQL files...
for %%f in (*.sql) do (
    git rm --cached "%%f" 2>nul
)

echo Removing batch files...
for %%f in (*.bat) do (
    git rm --cached "%%f" 2>nul
)

echo Removing text files...
for %%f in (*.txt) do (
    git rm --cached "%%f" 2>nul
)

echo.
echo Adding back essential files...
git add README.md 2>nul
git add frontend/README.md 2>nul
git add springboot_backend_jwt/HELP.md 2>nul
git add db/*.sql 2>nul

echo Done!
echo.

REM ===== STEP 3: Update .gitignore =====
echo.
echo ===============================================================================
echo STEP 3: Adding .gitignore changes
echo ===============================================================================
echo.

git add .gitignore
echo .gitignore updated!
echo.

REM ===== STEP 4: Commit =====
echo.
echo ===============================================================================
echo STEP 4: Committing changes
echo ===============================================================================
echo.

git commit -m "Remove documentation and test files from Git, update .gitignore"

echo.
echo ===============================================================================
echo CLEANUP COMPLETE!
echo ===============================================================================
echo.
echo Summary:
echo   ✓ Unwanted files removed from Git
echo   ✓ Files still in your folder
echo   ✓ .gitignore updated
echo   ✓ Changes committed
echo.
echo Next step: Run 'git push' to push changes to remote repository
echo.
echo Current status:
git status --short
echo.
pause
