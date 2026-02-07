@echo off
echo ===============================================================================
echo PREVIEW: Files That Will Be Removed From Git
echo ===============================================================================
echo.
echo This shows what will be removed from Git (but kept in your folder)
echo.

echo === .MD FILES (except README.md) ===
git ls-files *.md | findstr /V "README.md"
echo.

echo === TEST SCRIPTS ===
git ls-files *_test.js test_*.js debug_*.js check_*.js verify_*.js comprehensive_system_test.js 2>nul
echo.

echo === ROOT SQL FILES ===
git ls-files *.sql | findstr /V "db/"
echo.

echo === BATCH FILES ===
git ls-files *.bat
echo.

echo === TEXT FILES ===
git ls-files *.txt
echo.

echo ===============================================================================
echo.
echo These files will be REMOVED from Git but KEPT in your folder.
echo.
echo To proceed with removal, run: remove_files_from_git.bat
echo.
pause
