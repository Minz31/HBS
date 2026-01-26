@echo off
cd /d f:\Big_folder\HB\HBS\springboot_backend_jwt\src\main\java\com
IF EXIST "security" (
    rmdir /s /q security
)
IF EXIST "healthcare" (
    rename healthcare hotel
)
