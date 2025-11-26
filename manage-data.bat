@echo off
echo SkillMatchAI Data Management
echo ===========================
echo.
echo Choose an option:
echo 1. View current statistics
echo 2. Add more sample data (5 users + 5 jobs)
echo 3. Create custom data (interactive)
echo 4. Reset database (clear all data)
echo 5. Exit
echo.

set /p choice="Enter your choice (1-5): "

if "%choice%"=="1" (
    cd server
    node -e "require('dotenv').config(); const mongoose = require('mongoose'); const User = require('./models/User'); const Job = require('./models/Job'); const Match = require('./models/Match'); mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/skillmatchai').then(async () => { const users = await User.countDocuments({ role: 'user' }); const jobs = await Job.countDocuments({ isActive: true }); const matches = await Match.countDocuments(); console.log('📊 Database Statistics:'); console.log('👥 Users:', users); console.log('💼 Jobs:', jobs); console.log('🎯 Matches:', matches); await mongoose.connection.close(); });"
    pause
) else if "%choice%"=="2" (
    cd server
    npm run add-data
    pause
) else if "%choice%"=="3" (
    cd server
    npm run create-data
    pause
) else if "%choice%"=="4" (
    cd server
    npm run seed
    pause
) else if "%choice%"=="5" (
    echo Goodbye!
) else (
    echo Invalid choice. Please run the script again.
    pause
)
