@echo off
cd /d "%~dp0"
if not exist node_modules call npm ci
start "" http://127.0.0.1:5191/
call npm run dev
