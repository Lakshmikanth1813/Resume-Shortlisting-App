# 🗄️ How to View Your Data in MongoDB Compass App

## 📥 **Step 1: Download & Install MongoDB Compass**

### **Download:**
1. Go to: **https://www.mongodb.com/try/download/compass**
2. Click **"Download"** button (it will auto-detect Windows)
3. Run the downloaded installer
4. Follow the installation wizard (just click "Next" → "Next" → "Install")

**Installation is FREE and takes ~2 minutes!**

---

## 🔌 **Step 2: Connect to Your Database**

### **Open MongoDB Compass**
1. Launch MongoDB Compass from your Start menu
2. You'll see a **"New Connection"** screen

### **Enter Your Connection String:**

**For Local MongoDB (Your Current Setup):**
```
mongodb://localhost:27017/skillmatchai
```

**Step-by-step:**
1. Copy this connection string: `mongodb://localhost:27017/skillmatchai`
2. Paste it in the connection field
3. Click **"Connect"**

![Connection Screen](Connection should succeed instantly!)

---

## 👁️ **Step 3: Browse Your Data**

### **After Connecting, You'll See:**

#### **Left Sidebar - Databases:**
- Click on **"skillmatchai"** database
- You'll see 3 collections:
  - 📁 **users** - All user accounts
  - 📁 **jobs** - All job postings
  - 📁 **matches** - All job matches

---

## 👥 **Step 4: View ALL Users**

### **Click on "users" Collection:**

You'll see a screen with:
- **Documents Tab** (default view)
- List of all users with their data

### **What You'll See for Each User:**

```javascript
{
  _id: ObjectId("..."),
  name: "John Doe",
  email: "john@example.com",
  password: "$2a$10$..." (hashed - secure),
  role: "user",
  skills: ["JavaScript", "React", "Node.js", "MongoDB", "Express.js"],
  resumeURL: null,
  preferences: {
    jobTypes: ["full-time", "remote"],
    locations: ["Remote", "San Francisco"],
    salaryRange: { min: 60000, max: 100000 }
  },
  isActive: true,
  createdAt: ISODate("2025-10-14T00:02:05.000Z"),
  lastLogin: null
}
```

### **View Options:**
- **List View** - Expandable list (default)
- **JSON View** - Raw JSON format
- **Table View** - Spreadsheet-like view

---

## 🔍 **Step 5: Search & Filter Users**

### **Find Specific Users:**

At the top of the screen, there's a **Filter** box. You can enter queries:

#### **Find User by Email:**
```javascript
{ email: "john@example.com" }
```

#### **Find All Admin Users:**
```javascript
{ role: "admin" }
```

#### **Find Users with Specific Skill:**
```javascript
{ skills: "React" }
```

#### **Find Users Created Today:**
```javascript
{ createdAt: { $gte: ISODate("2025-10-14") } }
```

Click **"Find"** to apply the filter.

---

## 📊 **Step 6: View All User Emails**

### **Option 1: Scroll Through the List**
- Click on each user document to expand it
- Look for the `email` field

### **Option 2: Use Table View**
1. Click on **"Table"** tab (top right)
2. Select columns to display
3. Check: `name`, `email`, `role`, `skills`, `createdAt`
4. You'll see all emails in a spreadsheet-like table

### **Option 3: Export Data**
1. Click **"Export"** button (top right)
2. Choose format: **CSV** or **JSON**
3. Save to your computer
4. Open in Excel/Notepad to see all emails

---

## 💼 **Step 7: View Jobs**

### **Click on "jobs" Collection:**

You'll see all job postings with:
- Job titles
- Companies
- Required skills
- Salary ranges
- Locations

### **Sample Job Document:**
```javascript
{
  _id: ObjectId("..."),
  title: "Senior React Developer",
  company: "TechCorp Inc.",
  description: "We are looking for...",
  requiredSkills: ["React", "JavaScript", "Node.js", "MongoDB"],
  location: "San Francisco, CA",
  salaryRange: { min: 120000, max: 150000, currency: "USD" },
  employmentType: "full-time",
  remoteWork: "hybrid",
  isActive: true
}
```

---

## 🎯 **Step 8: View Job Matches**

### **Click on "matches" Collection:**

You'll see all job matching results with:
- User ID (linked to users collection)
- Job ID (linked to jobs collection)
- Match score (0-100%)
- Matched skills
- Missing skills
- Recommendations

### **Sample Match Document:**
```javascript
{
  _id: ObjectId("..."),
  userId: ObjectId("..."),
  jobId: ObjectId("..."),
  matchScore: 85,
  matchedSkills: ["JavaScript", "React", "Node.js"],
  missingSkills: ["Docker", "AWS"],
  recommendation: "high"
}
```

---

## 🛠️ **Step 9: Useful Features in Compass**

### **1. Schema Tab:**
- Shows data structure
- Field types
- Missing fields

### **2. Explain Plan:**
- Query performance
- Index usage

### **3. Aggregation Builder:**
- Build complex queries visually
- Export as code

### **4. Validation:**
- Data validation rules
- Schema enforcement

### **5. Indexes:**
- View database indexes
- Create new indexes
- Performance optimization

---

## 📤 **Step 10: Export User Data**

### **Export All Users with Emails:**

1. Click on **"users"** collection
2. Click **"Export"** button (top right)
3. Choose format:
   - **JSON** - For developer use
   - **CSV** - For Excel/Spreadsheet

4. Select fields to export:
   - ✅ name
   - ✅ email
   - ✅ role
   - ✅ skills
   - ✅ createdAt
   - ✅ lastLogin

5. Click **"Export"**
6. Save file to your computer

Now you have a complete list of all users and emails!

---

## 🎯 **Your Current Database Info:**

### **Connection Details:**
- **Database**: skillmatchai
- **Connection**: mongodb://localhost:27017/skillmatchai
- **Collections**: 3 (users, jobs, matches)

### **Current Data:**
- **👥 Users**: 57 regular users + 1 admin = **58 total**
- **💼 Jobs**: **35 active jobs**
- **🎯 Matches**: **1,995 job matches**

### **Admin Login:**
- **Email**: admin@skillmatchai.com
- **Password**: admin123
- **Role**: admin

### **Sample User Emails:**
- john@example.com
- jane@example.com
- alice@example.com
- bob@example.com
- carol@example.com
- david@example.com
- emma@example.com
- user1@example.com through user50@example.com

---

## 🔒 **Security Reminder:**

### **This is for YOU ONLY (Creator/Admin):**
✅ MongoDB Compass runs locally on your computer
✅ Only YOU can access this data
✅ Regular users CANNOT see MongoDB Compass
✅ Regular users CANNOT access this connection
✅ Data is secure and private

### **Regular Users Can Only:**
- See their own profile in the React app
- See their own job matches
- View public job listings
- ❌ CANNOT see other users' data
- ❌ CANNOT access MongoDB

---

## 🚀 **Quick Start Checklist:**

- [ ] Download MongoDB Compass from https://www.mongodb.com/try/download/compass
- [ ] Install MongoDB Compass
- [ ] Open MongoDB Compass
- [ ] Paste connection string: `mongodb://localhost:27017/skillmatchai`
- [ ] Click "Connect"
- [ ] Click on "users" collection
- [ ] Browse all users and emails
- [ ] Export data if needed

---

## 🆘 **Troubleshooting:**

### **Can't Connect?**
1. Make sure MongoDB is running (check if you can run `npm run admin-view`)
2. Try connection string: `mongodb://127.0.0.1:27017/skillmatchai`
3. Check if port 27017 is available

### **Can't See Data?**
1. Make sure you're connected to "skillmatchai" database
2. Click on the collections on the left sidebar
3. Try refreshing (F5)

### **Need Help?**
Run this command to verify MongoDB is working:
```bash
cd server
npm run admin-view
```

---

## 📚 **Additional Resources:**

### **MongoDB Compass Documentation:**
- https://www.mongodb.com/docs/compass/current/

### **Video Tutorials:**
- Search YouTube: "MongoDB Compass Tutorial"

### **Your Project Tools:**
```bash
# Command line tools (alternative to Compass)
cd server
npm run admin-view          # View all users with emails
npm run view-users          # Detailed user analysis
npm run browse-db           # Interactive browser
npm run search-users -- john # Search specific user
```

---

## ✅ **Summary:**

**MongoDB Compass = Your Visual Database Browser**

1. **Download** → Install Compass
2. **Connect** → Use: `mongodb://localhost:27017/skillmatchai`
3. **Browse** → Click on "users" collection
4. **View** → See all users, emails, and data
5. **Export** → Save to CSV/JSON if needed

**You can now see ALL your database data visually!** 🎉
