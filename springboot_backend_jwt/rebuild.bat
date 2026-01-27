@echo off
echo Cleaning and rebuilding project with Lombok annotation processing...
call mvn clean
call mvn compile
echo Done! Lombok getters/setters should now be generated.
pause
