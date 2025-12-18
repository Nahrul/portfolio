@echo off
REM ==========================================
REM Portfolio Database Installation (Windows)
REM ==========================================

setlocal enabledelayedexpansion

echo =========================================
echo Portfolio Database Installation
echo =========================================
echo.

REM Check if MySQL is available
where mysql >nul 2>nul
if %errorlevel% neq 0 (
    echo MySQL tidak ditemukan. Silakan install MySQL terlebih dahulu.
    pause
    exit /b 1
)

REM Prompt for database credentials
set /p DB_USER="MySQL Username (default: root): "
if "!DB_USER!"=="" set DB_USER=root

set /p DB_PASS="MySQL Password: "

set /p DB_HOST="MySQL Host (default: localhost): "
if "!DB_HOST!"=="" set DB_HOST=localhost

REM Create database and import SQL
echo.
echo Membuat database dan mengimport data...

if "!DB_PASS!"=="" (
    mysql -h !DB_HOST! -u !DB_USER! < database.sql
) else (
    mysql -h !DB_HOST! -u !DB_USER! -p!DB_PASS! < database.sql
)

if %errorlevel% equ 0 (
    echo.
    echo [OK] Database berhasil dibuat!
    echo.
    echo Credentials yang digunakan:
    echo   Host: !DB_HOST!
    echo   User: !DB_USER!
    echo.
    echo Demo Account:
    echo   Username: admin
    echo   Password: admin123
    echo.
    echo Akses aplikasi:
    echo   Public: http://localhost/portfolio/
    echo   Admin: http://localhost/portfolio/admin/login.php
) else (
    echo.
    echo [ERROR] Gagal membuat database. Periksa credentials Anda.
    pause
    exit /b 1
)

pause
