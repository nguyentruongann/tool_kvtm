@echo off
cd /d %~dp0
setlocal ENABLEDELAYEDEXPANSION

call cls
REM Kiểm tra thư mục hiện tại
echo [INFO] Đang chạy từ thư mục: %CD%

REM Kiểm tra tệp .env
if not exist ".env" (
    echo [ERROR] Tệp .env không tồn tại trong thư mục: %CD%
    pause
    exit /b
)

REM Đọc và thiết lập biến môi trường từ tệp .env
for /f "usebackq tokens=*" %%l in (".env") do (
    set %%l
)

REM Kiểm tra biến IS_BUILDED
if "!IS_BUILDED!"=="" (
    echo [ERROR] Biến IS_BUILDED không được tìm thấy trong tệp .env.
    pause
    exit /b
)

REM Kiểm tra và build nếu cần
if not "!IS_BUILDED!"=="TRUE" (
    echo [INFO] Dự án chưa được build, bắt đầu quá trình build...
    
    REM Quay lại thư mục cha và kiểm tra tệp package.json
    cd ..
    if not exist "package.json" (
        echo [ERROR] Không tìm thấy tệp package.json trong thư mục: %CD%.
        pause
        exit /b
    )

    REM Cài đặt các gói npm
    call npm ci
    if errorlevel 1 (
        echo [ERROR] Lỗi trong quá trình npm ci.
        pause
        exit /b
    )

    REM Chạy npm run release
    call npm run release
    if errorlevel 1 (
        echo [ERROR] Lỗi trong quá trình npm run release.
        pause
        exit /b
    )

    call cls
    echo [INFO] Build thành công.

    REM Quay lại thư mục exec
    cd exec

    REM Cập nhật biến IS_BUILDED trong tệp .env
    set TEMP_FILE=.temp
    for /f "usebackq tokens=*" %%l in (".env") do (
        echo %%l | findstr /b "IS_BUILDED=" >nul
        if !errorlevel! == 0 (
            echo IS_BUILDED=TRUE>>!TEMP_FILE!
        ) else (
            echo %%l>>!TEMP_FILE!
        )
    )
    move /y !TEMP_FILE! .env >nul
) else (
    echo [INFO] Dự án đã được build trước đó.
)

REM Quay lại thư mục cha và chạy npm run all
cd ..
if not exist "package.json" (
    echo [ERROR] Không tìm thấy tệp package.json trong thư mục: %CD%.
    pause
    exit /b
)

call npm run all
if errorlevel 1 (
    echo [ERROR] Lỗi trong quá trình chạy npm run all.
    pause
    exit /b
)

pause
