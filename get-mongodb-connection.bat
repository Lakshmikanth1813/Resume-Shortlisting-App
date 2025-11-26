@echo off
echo ========================================
echo   MongoDB Connection Details
echo ========================================
echo.
echo To view your data in MongoDB Compass:
echo.
echo 1. Download MongoDB Compass:
echo    https://www.mongodb.com/try/download/compass
echo.
echo 2. Install MongoDB Compass
echo.
echo 3. Open MongoDB Compass
echo.
echo 4. Use this connection string:
echo.
echo    mongodb://localhost:27017/skillmatchai
echo.
echo 5. Click "Connect"
echo.
echo 6. Browse your collections:
echo    - users   (all user accounts and emails)
echo    - jobs    (all job postings)
echo    - matches (all job matches)
echo.
echo ========================================
echo   Your Database Statistics:
echo ========================================
echo.

cd server
node -e "require('dotenv').config(); const mongoose = require('mongoose'); const User = require('./models/User'); const Job = require('./models/Job'); const Match = require('./models/Match'); mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/skillmatchai').then(async () => { const users = await User.countDocuments(); const jobs = await Job.countDocuments(); const matches = await Match.countDocuments(); console.log('Total Users:', users); console.log('Total Jobs:', jobs); console.log('Total Matches:', matches); console.log(''); console.log('Connection String:'); console.log('mongodb://localhost:27017/skillmatchai'); await mongoose.connection.close(); }).catch(err => console.error('Error:', err.message));"

echo.
echo ========================================
echo.
pause
