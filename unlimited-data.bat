@echo off
echo ========================================
echo   SkillMatchAI UNLIMITED Data Creator
echo ========================================
echo.
echo This script allows you to create:
echo - UNLIMITED users (any number you want)
echo - UNLIMITED jobs (any number you want)  
echo - UNLIMITED job matches (automatically)
echo.
echo Examples:
echo - 1,000 users + 500 jobs = 500,000 matches
echo - 5,000 users + 1,000 jobs = 5,000,000 matches
echo - 10,000 users + 2,000 jobs = 20,000,000 matches
echo.
echo WARNING: Large numbers will take time and use disk space!
echo.
pause

cd server
npm run unlimited

pause
