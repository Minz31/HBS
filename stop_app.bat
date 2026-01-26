@echo off
echo Stopping Hotel Booking System Services...

echo Closing Backend...
taskkill /FI "WINDOWTITLE eq Spring Boot Backend" /F
taskkill /F /IM java.exe

echo Closing Invoice Service...
taskkill /FI "WINDOWTITLE eq .NET Invoice Service" /F
taskkill /F /IM dotnet.exe

echo Closing Frontend...
taskkill /FI "WINDOWTITLE eq Frontend" /F
taskkill /F /IM node.exe

echo Done.
pause
