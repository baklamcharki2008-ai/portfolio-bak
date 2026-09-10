@echo off
setlocal
title Vertex Web Platform - Flask App

echo ==================================================
echo    VERTEX WEB PLATFORM - Flask Launcher
echo ==================================================
echo.
echo   Serving:
echo     /                          - landing page
echo     /bakrelamcharki-portfolio/ - portfolio
echo     /vertex-corp/              - vertex corp
echo.
echo   Close this window to stop the server.
echo ==================================================
echo.

cd /d "%~dp0"

where python >nul 2>&1
if %errorlevel%==0 goto :check_flask

echo   ERROR: Python is not installed.
echo   Install it from https://www.python.org/downloads/
pause
exit /b 1

:check_flask
python -c "import flask" >nul 2>&1
if %errorlevel%==0 goto :run

echo   Installing Flask...
python -m pip install -r requirements.txt

:run
echo   Starting server on http://localhost:5000
start http://localhost:5000
python app.py

endlocal