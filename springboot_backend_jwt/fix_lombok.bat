@echo off
echo ========================================
echo Fixing Lombok Compilation Errors
echo ========================================
echo.

REM Check if Maven wrapper exists
if exist mvnw.cmd (
    echo Using Maven wrapper...
    call mvnw.cmd clean compile -DskipTests
) else if exist ..\mvnw.cmd (
    echo Using parent Maven wrapper...
    call ..\mvnw.cmd clean compile -DskipTests
) else (
    echo Maven not found. Please run ONE of these commands manually:
    echo.
    echo Option 1 - If Maven is installed:
    echo   mvn clean compile -DskipTests
    echo.
    echo Option 2 - Using Maven wrapper:
    echo   mvnw.cmd clean compile -DskipTests
    echo.
    echo Option 3 - From IDE:
    echo   Right-click project ^> Maven ^> Reload Project
    echo   Then: Right-click project ^> Maven ^> Generate Sources
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo Compilation complete!
echo Lombok getters/setters generated.
echo Please reload your IDE window.
echo ========================================
pause
