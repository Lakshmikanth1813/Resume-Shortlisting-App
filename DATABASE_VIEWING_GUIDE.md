# 🗄️ Database Viewing Guide - SkillMatchAI

## ✅ **Complete Database Analysis Tools Created!**

You now have multiple ways to view and analyze your MongoDB database:

---

## 🚀 **Quick Commands:**

### **1. View All Users (Detailed Analysis)**
```bash
cd server
npm run view-users
```
**Shows:**
- Complete user table with names, emails, skills count
- Detailed info for first 5 users
- Admin users
- Skill statistics and top skills
- Database overview with totals

### **2. Search Users**
```bash
cd server
npm run search-users -- <search-term>
```
**Examples:**
```bash
npm run search-users -- john          # Search by name
npm run search-users -- @example.com  # Search by email domain
npm run search-users -- react         # Search by skill
npm run search-users -- admin         # Search by role
```

### **3. Interactive Database Browser**
```bash
cd server
npm run browse-db
```
**Features:**
- View all users
- Search users
- View user details by email
- View jobs and matches
- Database statistics
- Export user data to CSV

### **4. Windows Batch File (Easy Access)**
```bash
browse-database.bat
```
Double-click to run the interactive database browser.

---

## 📊 **Current Database Status:**

### **Users: 57**
- **Regular Users**: 57
- **Admin Users**: 1
- **Users with Skills**: 57
- **Average Skills per User**: 5.1

### **Jobs: 35**
- **Active Jobs**: 35
- **Diverse Job Types**: Software Engineer, Full Stack Developer, etc.

### **Matches: 1,995**
- **Total Job Matches**: 1,995
- **Match Scores**: 0-100%
- **Recommendations**: High/Medium/Low

---

## 🔍 **What You Can View:**

### **User Information:**
- ✅ **Name and Email** - All user details
- ✅ **Skills** - Complete skill lists
- ✅ **Creation Date** - When users joined
- ✅ **Last Login** - Login activity
- ✅ **Preferences** - Job types, locations, salary ranges
- ✅ **Role** - User vs Admin

### **Job Information:**
- ✅ **Job Titles** - All available positions
- ✅ **Companies** - Company names and details
- ✅ **Locations** - Job locations
- ✅ **Salary Ranges** - Min/max salaries
- ✅ **Required Skills** - Job requirements
- ✅ **Posting Dates** - When jobs were posted

### **Match Information:**
- ✅ **Match Scores** - Compatibility percentages
- ✅ **Matched Skills** - Skills that match
- ✅ **Missing Skills** - Skills user needs to learn
- ✅ **Recommendations** - High/Medium/Low priority
- ✅ **User-Job Pairs** - Who matches with what

---

## 📈 **Database Statistics Available:**

### **Overview:**
- Total users, jobs, matches
- Recent activity (last 7 days)
- Users with resumes
- Database size

### **Skill Analysis:**
- Top 10 most common skills
- Skill distribution percentages
- Average skills per user
- Unique skill count

### **User Activity:**
- Creation dates
- Last login times
- User preferences
- Skill gaps

---

## 🎯 **Search Capabilities:**

### **Search by Name:**
```bash
npm run search-users -- john
# Finds: John Doe, Alice Johnson
```

### **Search by Email:**
```bash
npm run search-users -- @example.com
# Finds all users with @example.com emails
```

### **Search by Skill:**
```bash
npm run search-users -- react
# Finds all users with React skills
```

### **Search by Role:**
```bash
npm run search-users -- admin
# Finds all admin users
```

---

## 📤 **Export Features:**

### **CSV Export:**
- User names and emails
- Skills and skill counts
- Creation and login dates
- Job preferences
- Salary ranges
- Ready for Excel/Google Sheets

---

## 🔧 **Advanced Features:**

### **Interactive Browser:**
- Menu-driven interface
- Real-time database queries
- Detailed user profiles
- Job and match viewing
- Statistics dashboard

### **Batch Processing:**
- Handles large datasets
- Progress indicators
- Memory efficient
- Error handling

---

## 🚀 **Quick Start:**

### **1. View All Users:**
```bash
cd server
npm run view-users
```

### **2. Search for Specific User:**
```bash
cd server
npm run search-users -- john@example.com
```

### **3. Interactive Database Browser:**
```bash
cd server
npm run browse-db
```

### **4. Windows Easy Access:**
```bash
browse-database.bat
```

---

## 📋 **Sample Output:**

```
👥 User Database Analysis - SkillMatchAI
========================================

📊 DATABASE OVERVIEW:
====================
👥 Regular Users: 57
👑 Admin Users: 1
💼 Active Jobs: 35
🎯 Total Matches: 1,995
📈 Total Records: 2,088

👤 USER DETAILS:
================
Found 57 users:

┌─────┬─────────────────────┬─────────────────────────────────┬─────────────┬─────────────────┬─────────────┐
│ No. │ Name                │ Email                           │ Skills      │ Created         │ Last Login   │
├─────┼─────────────────────┼─────────────────────────────────┼─────────────┼─────────────────┼─────────────┤
│   1 │ John Doe             │ john@example.com               │ 5           │ 14/10/2025      │ Never       │
│   2 │ Jane Smith           │ jane@example.com               │ 5           │ 14/10/2025      │ Never       │
│   3 │ Alice Johnson        │ alice@example.com              │ 6           │ 14/10/2025      │ Never       │
└─────┴─────────────────────┴─────────────────────────────────┴─────────────┴─────────────────┴─────────────┘
```

---

## 🎉 **You're All Set!**

**Your SkillMatchAI database is fully viewable and searchable!** 

You can now:
- ✅ View all user details and emails
- ✅ Search users by any criteria
- ✅ Analyze skill statistics
- ✅ Export data for analysis
- ✅ Browse jobs and matches
- ✅ Monitor database activity

**Start exploring your data now!** 🚀✨
