# 🔧 Troubleshooting Guide

## 🚨 Server Stability Issues

### Problem: Server crashes after several requests
**Symptoms:**
- "Login failed" after multiple attempts
- "Skill analysis failed" 
- Server becomes unresponsive
- Need to restart with Ctrl+C

**Solutions:**

#### 1. **Quick Server Restart**
```bash
# Use the restart scripts:
./restart-server.bat    # Windows
./restart-server.ps1    # PowerShell
```

#### 2. **Manual Restart**
```bash
# Stop server (Ctrl+C)
cd server
npm run dev
```

#### 3. **Check Server Logs**
Look for these error patterns:
- Memory leaks
- Database connection issues
- Rate limiting
- Unhandled promises

---

## 🐛 Frontend Rendering Issues

### Problem: JavaScript runtime errors
**Symptoms:**
- "Cannot read properties of undefined (reading 'map')"
- Page crashes or shows blank
- Inconsistent UI updates

**Solutions:**

#### 1. **Clear Browser Cache**
- Press `Ctrl+Shift+R` (hard refresh)
- Or clear browser cache manually

#### 2. **Check Browser Console**
- Open Developer Tools (F12)
- Look for error messages
- Check Network tab for failed requests

#### 3. **Restart Frontend**
```bash
cd client
npm start
```

---

## 🔄 Performance Optimizations

### Server Improvements Made:
- ✅ **Rate Limiting**: Increased limits for development
- ✅ **Request Timeouts**: 10-15 second timeouts on API calls
- ✅ **Database Pooling**: Optimized MongoDB connections
- ✅ **Error Handling**: Better error recovery and logging
- ✅ **Memory Management**: Graceful shutdown handling

### Frontend Improvements Made:
- ✅ **Loading States**: Prevent multiple simultaneous requests
- ✅ **Error Boundaries**: Better error handling and recovery
- ✅ **Timeout Handling**: Request timeouts with user feedback
- ✅ **State Management**: Prevent undefined array access
- ✅ **Retry Mechanisms**: Auto-retry on connection errors

---

## 🚀 Quick Fixes

### If Everything Stops Working:

1. **Restart Everything:**
   ```bash
   # Stop all processes (Ctrl+C in each terminal)
   # Then restart:
   cd server && npm run dev
   cd client && npm start
   ```

2. **Check Database:**
   ```bash
   # Make sure MongoDB is running
   # Check connection in server logs
   ```

3. **Clear All Data:**
   ```bash
   # If needed, reset database:
   cd server
   npm run seed:reset
   ```

### If Skills Don't Save:

1. **Check Authentication:**
   - Make sure you're logged in
   - Check browser console for auth errors

2. **Check API Endpoints:**
   - Verify `/api/users/profile` is working
   - Check network tab for 500 errors

3. **Manual Test:**
   ```bash
   # Test profile endpoint:
   curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:5000/api/users/profile
   ```

---

## 📊 Monitoring

### Server Health Check:
- Visit: `http://localhost:5000/api/health`
- Should return: `{"status":"success","message":"SkillMatchAI API is running"}`

### Memory Usage:
- Server logs now show memory usage on startup
- Watch for memory leaks in server console

### Database Status:
- Connection status shown in server logs
- Auto-reconnection enabled for dropped connections

---

## 🆘 Emergency Recovery

### If Server Won't Start:
1. Check if port 5000 is in use
2. Kill all Node.js processes: `taskkill /f /im node.exe`
3. Restart with: `npm run dev`

### If Frontend Won't Load:
1. Check if port 3000/3001 is available
2. Clear node_modules: `rm -rf node_modules && npm install`
3. Restart with: `npm start`

### If Database Issues:
1. Check MongoDB is running
2. Verify connection string in `.env`
3. Check database permissions

---

## 📞 Debug Information

When reporting issues, include:
- Server console logs
- Browser console errors
- Network tab requests
- Steps to reproduce
- Error messages (exact text)

The system is now much more stable with better error handling and recovery mechanisms!
