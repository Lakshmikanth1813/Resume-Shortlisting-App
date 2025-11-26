@echo off
echo ========================================
echo   SkillMatchAI Database Browser
echo ========================================
echo.
echo This tool allows you to:
echo - View all users and their details
echo - Search users by name, email, or skills
echo - View jobs and matches
echo - Export user data to CSV
echo - View database statistics
echo.
pause

cd server
npm run browse-db

pause
