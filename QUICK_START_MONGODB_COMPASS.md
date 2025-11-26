# 🚀 Quick Start: View Your Data in MongoDB Compass

## ⚡ **3-Minute Setup**

### **Step 1: Download (1 minute)**
Go to: **https://www.mongodb.com/try/download/compass**

Click the big **"Download"** button

### **Step 2: Install (1 minute)**
Run the downloaded file and click through the installer

### **Step 3: Connect (30 seconds)**
Open MongoDB Compass and paste this connection string:

```
mongodb://localhost:27017/skillmatchai
```

Click **"Connect"**

### **Step 4: Browse Your Data (30 seconds)**
Click on **"users"** collection → See all 58 users with emails!

---

## 📊 **What You'll See:**

### **Users Collection (58 users):**
```
Name: John Doe
Email: john@example.com
Skills: JavaScript, React, Node.js, MongoDB, Express.js
Created: 14/10/2025
```

### **Jobs Collection (35 jobs):**
```
Title: Senior React Developer
Company: TechCorp Inc.
Salary: $120,000 - $150,000
Location: San Francisco, CA
```

### **Matches Collection (1,995 matches):**
```
User: John Doe
Job: Senior React Developer
Match Score: 85%
Recommendation: High
```

---

## 🎯 **Common Tasks:**

### **View All User Emails:**
1. Click "users" collection
2. Scroll through the list
3. Or click "Export" → CSV → Open in Excel

### **Find Specific User:**
Enter in filter box:
```javascript
{ email: "john@example.com" }
```

### **Export All Data:**
Click "Export" button → Choose CSV → Save

---

## 🔒 **Privacy:**
- ✅ Only YOU can see this data
- ✅ Local access only
- ✅ Users cannot access MongoDB Compass
- ✅ Secure and private

---

## ✅ **Done!**
You now have visual access to ALL your database data including all user emails!

**Connection String:**
```
mongodb://localhost:27017/skillmatchai
```

**Database Name:** skillmatchai

**Collections:**
- users (58 records)
- jobs (35 records)
- matches (1,995 records)

🎉 **Happy browsing!**
