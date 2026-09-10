@echo off
setlocal
title Vertex Static Sites Launcher

echo ==================================================
echo    VERTEX WEB PLATFORM - Static Sites Launcher
echo ==================================================
echo.
echo   [1] bakrelamcharki-portfolio   - http://localhost:8080
echo   [2] vertex-corp                - http://localhost:8081
echo.

rem ------ Detect available server tool ------
set "SITE1=%~dp0website\bakrelamcharki-portfolio"
set "SITE2=%~dp0website\vertex-corp"
set "PORT1=8080"
set "PORT2=8081"

set "TOOL="
where python >nul 2>&1
if %errorlevel%==0 goto :use_python
where npx >nul 2>&1
if %errorlevel%==0 goto :use_node
goto :no_tool

:use_python
echo   Using Python - http.server
set "SERV_1=python -m http.server %PORT1%"
set "SERV_2=python -m http.server %PORT2%"
goto :check_sites

:use_node
echo   Using Node.js - npx http-server
set "SERV_1=npx --yes http-server -p %PORT1% -a 127.0.0.1 -c-1"
set "SERV_2=npx --yes http-server -p %PORT2% -a 127.0.0.1 -c-1"
goto :check_sites

:no_tool
echo   ERROR: Neither Python nor Node.js is installed.
echo   Install Python from https://www.python.org/downloads/
echo   or Node.js from https://nodejs.org/
pause
exit /b 1

:check_sites
if exist "%SITE1%" goto :site1_ok
echo   WARN: Folder "%SITE1%" not found - skipping.
goto :site2_check

:site1_ok
echo   Starting bakrelamcharki-portfolio on port %PORT1% ...
start "vertex-site-1" cmd /k "cd /d "%SITE1%" && %SERV_1%"

:site2_check
if exist "%SITE2%" goto :site2_ok
echo   WARN: Folder "%SITE2%" not found - skipping.
goto :open_browsers

:site2_ok
echo   Starting vertex-corp on port %PORT2% ...
start "vertex-site-2" cmd /k "cd /d "%SITE2%" && %SERV_2%"

:open_browsers
echo.
echo   Opening browser tabs...
timeout /t 2 >nul
start http://localhost:%PORT1%
start http://localhost:%PORT2%

echo.
echo   ==================================================
echo   Both sites are running. Press any key to STOP.
echo   ==================================================
pause >nul

taskkill /FI "WINDOWTITLE eq vertex-site-*" /F >nul 2>&1
echo   All servers stopped.
timeout /t 2 >nul
endlocal