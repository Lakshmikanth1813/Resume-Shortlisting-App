# MongoDB Setup Guide for SkillMatchAI

This guide will help you set up MongoDB for your SkillMatchAI project. You have two options: MongoDB Atlas (cloud) or local MongoDB.

## Option 1: MongoDB Atlas (Recommended for Development)

### Step 1: Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Sign up for a free account
3. Create a new cluster (choose the free tier)

### Step 2: Configure Database Access
1. Go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Create a username and password
4. Set privileges to "Read and write to any database"
5. Click "Add User"

### Step 3: Configure Network Access
1. Go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. Choose "Allow access from anywhere" (0.0.0.0/0) for development
4. Click "Confirm"

### Step 4: Get Connection String
1. Go to "Clusters" in the left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your database user password
6. Replace `<dbname>` with `skillmatchai`

### Step 5: Update Environment Variables
Update your `.env` file with the connection string:
```
```

## Option 2: Local MongoDB

### Step 1: Install MongoDB
**Windows:**
1. Download MongoDB Community Server from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Run the installer
3. Choose "Complete" installation
4. Install MongoDB Compass (optional GUI tool)

**macOS:**
```bash
# Using Homebrew
brew tap mongodb/brew
brew install mongodb-community
```

**Linux (Ubuntu):**
```bash
# Import MongoDB public key
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# Add MongoDB repository
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Install MongoDB
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

### Step 2: Start MongoDB
**Windows:**
- MongoDB should start automatically as a service
- Or run: `net start MongoDB`

**macOS:**
```bash
brew services start mongodb/brew/mongodb-community
```

**Linux:**
```bash
sudo systemctl start mongod
```

### Step 3: Update Environment Variables
Update your `.env` file:
```env
MONGODB_URI=mongodb://localhost:27017/skillmatchai
```

## Database Seeding

After setting up MongoDB, seed the database with sample data:

```bash
cd server
npm run seed
```

This will create:
- 3 sample users (including 1 admin)
- 5 sample jobs
- Job matches for all users

## Verification

1. Start your backend server:
   ```bash
   cd server
   npm run dev
   ```

2. Check the console for:
   ```
   ✅ MongoDB Connected: [hostname]
   📊 Mongoose connected to MongoDB
   ```

3. Test the API:
   ```bash
   curl http://localhost:5000/api/health
   ```

## Troubleshooting

### Connection Issues
- Check if MongoDB is running
- Verify connection string format
- Ensure network access is configured (for Atlas)
- Check firewall settings

### Authentication Issues
- Verify username and password
- Check database user permissions
- Ensure IP address is whitelisted (for Atlas)

### Common Error Messages
- `MongoNetworkError`: Network connectivity issue
- `MongoAuthenticationError`: Wrong credentials
- `MongoServerError`: Server-side error

## Database Schema

The application uses these collections:
- `users`: User profiles and authentication
- `jobs`: Job postings and requirements
- `matches`: Job matching results and scores

## Next Steps

1. Set up Cloudinary for file uploads
2. Configure the AI service
3. Deploy to production

For production deployment, use MongoDB Atlas with proper security configurations.
