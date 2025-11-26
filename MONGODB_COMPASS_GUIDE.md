# 🔐 MongoDB Compass - Secure Database Access Guide

## 🎯 **For App Creator/Admin ONLY**

This guide shows YOU (the creator) how to securely view and manage your MongoDB database without exposing it to regular users.

---

## 📥 **Step 1: Install MongoDB Compass**

### **Download:**
1. Go to: https://www.mongodb.com/try/download/compass
2. Download MongoDB Compass (GUI tool)
3. Install it on your computer

### **Why MongoDB Compass?**
- ✅ Official MongoDB GUI
- ✅ Secure, local access only
- ✅ Visual database browser
- ✅ Query builder
- ✅ Data editing and export
- ✅ Real-time performance monitoring

---

## 🔌 **Step 2: Connect to Your Database**

### **Local MongoDB (Default):**
```
mongodb://localhost:27017/skillmatchai
```

### **MongoDB Atlas (Cloud):**
```

```

### **Connection Steps:**
1. Open MongoDB Compass
2. Click "New Connection"
3. Paste your connection string
4. Click "Connect"

---

## 👁️ **Step 3: View Your Data**

### **Collections You'll See:**
- **users** - All user accounts
- **jobs** - All job postings
- **matches** - All job matches

### **What You Can Do:**
✅ **View all users and their emails**
✅ **Search and filter data**
✅ **Edit user information**
✅ **Delete users or jobs**
✅ **Export data to CSV/JSON**
✅ **Run custom queries**
✅ **Monitor database performance**

---

## 🔍 **Viewing User Data in Compass:**

### **1. Click on "users" collection**
You'll see all users with:
- Name
- Email
- Role
- Skills
- Passwords (hashed - secure)
- Creation dates
- All other data

### **2. Search/Filter Users:**
```javascript
// Find user by email
{ email: "john@example.com" }

// Find all admin users
{ role: "admin" }

// Find users with specific skill
{ skills: "React" }

// Find users created today
{ createdAt: { $gte: new Date("2025-10-14") } }
```

### **3. Export Data:**
- Click "Export Collection"
- Choose CSV or JSON
- Save to your computer

---

## 🔒 **Security: Why Regular Users CAN'T Access This**

### **Your App is Already Secure:**

1. **Backend Protection:**
   - MongoDB connection string is in `.env` (not shared)
   - Only backend server can access database
   - Frontend makes API requests, never direct DB access

2. **API Security:**
   - Users can only access their own data via API
   - JWT tokens verify user identity
   - Admin-only endpoints require admin role

3. **Database Security:**
   - MongoDB runs locally or on secure cloud
   - No public access to database port
   - Firewall protection

### **What Users CAN See (via Frontend):**
- ✅ Their own profile
- ✅ Their own job matches
- ✅ Public job listings
- ❌ Other users' data
- ❌ Other users' emails
- ❌ Database access

### **What YOU CAN See (as Creator):**
- ✅ All users and emails
- ✅ All jobs
- ✅ All matches
- ✅ Complete database
- ✅ System statistics

---

## 🛠️ **Alternative Ways to View Data (Creator Only):**

### **1. MongoDB Shell (mongosh):**
```bash
mongosh mongodb://localhost:27017/skillmatchai

# View all users
db.users.find().pretty()

# Count users
db.users.countDocuments()

# Find specific user
db.users.findOne({ email: "john@example.com" })

# Get all emails
db.users.find({}, { email: 1, name: 1 })
```

### **2. Our Custom Scripts (Already Created):**
```bash
# View all users with details
npm run view-users

# Search users
npm run search-users -- john

# Interactive browser
npm run browse-db
```

### **3. Admin Dashboard (In Your React App):**
Your React app has an Admin page at `/admin` that shows:
- User statistics
- Job analytics
- System overview
- User management

**Login as admin:**
- Email: `admin@skillmatchai.com`
- Password: `admin123`

---

## 📊 **Recommended: MongoDB Compass Features**

### **1. Users Collection View:**
- See all users in a table
- Sort by any field (name, email, date)
- Filter by criteria
- Export to CSV

### **2. Aggregation Pipeline:**
Build complex queries visually:
```javascript
// Count users by skill
[
  { $unwind: "$skills" },
  { $group: { _id: "$skills", count: { $sum: 1 } } },
  { $sort: { count: -1 } }
]
```

### **3. Schema Analysis:**
- See data structure
- Field types
- Missing fields
- Data validation

### **4. Performance Monitoring:**
- Query performance
- Index usage
- Database size
- Collection stats

---

## 🔐 **Security Best Practices:**

### **DO:**
✅ Keep `.env` file secure (never share)
✅ Use strong admin passwords
✅ Access MongoDB locally or via VPN
✅ Enable MongoDB authentication
✅ Use MongoDB Atlas with IP whitelist
✅ Backup database regularly

### **DON'T:**
❌ Share MongoDB connection string
❌ Expose database port publicly
❌ Allow unauthenticated access
❌ Store credentials in frontend code
❌ Commit `.env` to git

---

## 🎯 **Quick Access for You:**

### **Method 1: MongoDB Compass (Recommended)**
1. Install MongoDB Compass
2. Connect: `mongodb://localhost:27017/skillmatchai`
3. Browse all collections
4. View all users, emails, data

### **Method 2: Command Line**
```bash
cd server
npm run view-users
```

### **Method 3: Admin Dashboard**
1. Start app: `npm start` (in client folder)
2. Go to: `http://localhost:3000/admin`
3. Login: `admin@skillmatchai.com` / `admin123`
4. View all users and stats

---

## 📝 **Summary:**

- ✅ **You (creator)** can see ALL user data via MongoDB Compass, CLI tools, or admin dashboard
- ✅ **Regular users** can ONLY see their own data via the app
- ✅ **Database** is secure and not accessible to regular users
- ✅ **No user data** is exposed in frontend code
- ✅ **API enforces** user isolation and admin privileges

**Your data is private and secure!** 🔒✨
