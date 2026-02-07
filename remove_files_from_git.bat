@echo off
echo ===============================================================================
echo REMOVE UNWANTED FILES FROM GIT
echo ===============================================================================
echo.
echo This will remove the following from Git tracking:
echo   - All .md files EXCEPT README.md
echo   - All test scripts
echo   - All root SQL files
echo   - Helper batch files
echo   - Text documentation files
echo.
echo IMPORTANT: Files will stay in your folder, just removed from Git!
echo.
pause
echo.

echo Starting cleanup...
echo.

REM Remove all .md files from Git
echo [1/6] Removing .md files from Git...
for %%f in (*.md) do (
    if not "%%f"=="README.md" (
        git rm --cached "%%f" 2>nul
        echo   Removed: %%f
    )
)
echo Done.
echo.

REM Remove test scripts
echo [2/6] Removing test scripts from Git...
git rm --cached *_test.js 2>nul
git rm --cached test_*.js 2>nul
git rm --cached debug_*.js 2>nul
git rm --cached check_*.js 2>nul
git rm --cached verify_*.js 2>nul
git rm --cached comprehensive_system_test.js 2>nul
echo Done.
echo.

REM Remove root SQL files
echo [3/6] Removing root SQL files from Git...
for %%f in (*.sql) do (
    git rm --cached "%%f" 2>nul
    echo   Removed: %%f
)
echo Done.
echo.

REM Remove helper batch files
echo [4/6] Removing helper batch files from Git...
git rm --cached cleanup_git_tracking.bat 2>nul
git rm --cached verify_gitignore.bat 2>nul
git rm --cached commit_gitignore_changes.bat 2>nul
git rm --cached remove_files_from_git.bat 2>nul
git rm --cached check_and_fix_users.bat 2>nul
git rm --cached refactor_folders.bat 2>nul
git rm --cached start_app.bat 2>nul
git rm --cached start_project.bat 2>nul
git rm --cached stop_app.bat 2>nul
git rm --cached update_packages.ps1 2>nul
echo Done.
echo.

REM Remove text documentation files
echo [5/6] Removing text documentation files from Git...
git rm --cached GITIGNORE_SETUP.txt 2>nul
git rm --cached QUICK_REFERENCE.txt 2>nul
git rm --cached HOW_TO_COMMIT.txt 2>nul
echo Done.
echo.

REM Add back README.md to make sure it stays
echo [6/6] Ensuring README.md stays in Git...
git add README.md 2>nul
git add frontend/README.md 2>nul
git add springboot_backend_jwt/HELP.md 2>nul
echo Done.
echo.

echo ===============================================================================
echo CLEANUP COMPLETE!
echo ===============================================================================
echo.
echo Files removed from Git tracking:
git status --short | findstr "D "
echo.
echo Files that will stay in Git:
echo   - README.md
echo   - Source code files
echo   - Configuration files
echo   - db/*.sql files
echo.
echo Next steps:
echo   1. Review the changes above
echo   2. Run: git add .gitignore
echo   3. Run: git commit -m "Remove documentation and test files from Git"
echo   4. Run: git push
echo.
echo All files are still in your folder, just not tracked by Git anymore!
echo.
pause
