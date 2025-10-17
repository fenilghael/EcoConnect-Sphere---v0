# Troubleshooting Guide - EcoConnect Sphere

## Common Issues and Solutions

### 🔧 CORS Errors

**Problem**: `Access to fetch at 'http://localhost:5000/api/...' from origin 'http://localhost:3000' has been blocked by CORS policy`

**Solution**: 
1. Make sure your backend is running on port 5000
2. The CORS configuration has been updated to allow both localhost:3000 and localhost:5173
3. If you're still getting CORS errors, restart the backend server:
   ```bash
   cd backend
   npm run dev
   ```

### 🔧 React forwardRef Warnings

**Problem**: `Warning: Function components cannot be given refs. Attempts to access this ref will fail. Did you mean to use React.forwardRef()?`

**Solution**: 
✅ **FIXED** - The Button, Input, and Textarea components have been updated to use `React.forwardRef()`

### 🔧 Dialog Accessibility Warning

**Problem**: `Warning: Missing Description or aria-describedby={undefined} for {DialogContent}`

**Solution**: 
✅ **FIXED** - Added description text to the AuthModal dialog

### 🔧 Backend Connection Issues

**Problem**: `API request failed: TypeError: Failed to fetch`

**Solutions**:
1. **Check if backend is running**:
   ```bash
   cd backend
   npm run dev
   ```
   You should see: `🚀 Server running on port 5000`

2. **Check MongoDB connection**:
   - Make sure you have a valid MongoDB Atlas connection string in `backend/.env`
   - The connection string should look like:
     ```
     MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecoconnect-sphere?retryWrites=true&w=majority
     ```

3. **Check environment variables**:
   ```bash
   # Make sure these files exist:
   backend/.env
   .env
   ```

### 🔧 Frontend Not Loading

**Problem**: Frontend shows loading spinner or errors

**Solutions**:
1. **Check if frontend server is running**:
   ```bash
   npm run dev
   ```
   You should see: `Local: http://localhost:3000/`

2. **Clear browser cache**:
   - Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
   - Or open in incognito/private mode

3. **Check console for errors**:
   - Open browser Developer Tools (F12)
   - Look for errors in the Console tab

### 🔧 Database Connection Issues

**Problem**: `❌ MongoDB connection error`

**Solutions**:
1. **Check MongoDB Atlas cluster**:
   - Make sure your cluster is running
   - Check if your IP address is whitelisted
   - Verify your database user has proper permissions

2. **Test connection string**:
   ```bash
   # In backend directory
   node -e "console.log('Testing MongoDB connection...'); require('mongoose').connect(process.env.MONGODB_URI).then(() => console.log('✅ Connected')).catch(err => console.log('❌ Error:', err.message))"
   ```

### 🔧 Authentication Issues

**Problem**: Login/Register not working

**Solutions**:
1. **Check backend logs** for detailed error messages
2. **Verify JWT_SECRET** is set in `backend/.env`
3. **Check if user registration is successful** in MongoDB Atlas

### 🔧 Port Conflicts

**Problem**: Port already in use

**Solutions**:
1. **Find and kill process using port**:
   ```bash
   # Windows
   netstat -ano | findstr :5000
   taskkill /PID <PID_NUMBER> /F
   
   # Mac/Linux
   lsof -ti:5000 | xargs kill -9
   ```

2. **Use different ports**:
   ```bash
   # Backend on different port
   PORT=5001 npm run dev
   
   # Frontend on different port
   npm run dev -- --port 3001
   ```

### 🔧 Missing Dependencies

**Problem**: Module not found errors

**Solutions**:
1. **Reinstall dependencies**:
   ```bash
   # Frontend
   rm -rf node_modules package-lock.json
   npm install
   
   # Backend
   cd backend
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Check Node.js version**:
   ```bash
   node --version  # Should be 18+
   npm --version
   ```

## 🚀 Quick Start Commands

### Windows Users
```cmd
# Use the batch file
start-dev.bat

# Or manually:
npm run fullstack:install
npm run fullstack:dev
```

### Mac/Linux Users
```bash
# Use the shell script
./start-dev.sh

# Or manually:
npm run fullstack:install
npm run fullstack:dev
```

## 📊 Health Checks

### Backend Health
```bash
curl http://localhost:5000/api/health
```
Should return:
```json
{
  "status": "success",
  "message": "EcoConnect Sphere API is running",
  "timestamp": "...",
  "environment": "development"
}
```

### Frontend Health
```bash
curl http://localhost:3000/health
```
Should return: `healthy`

## 🔍 Debugging Tips

1. **Enable detailed logging**:
   ```bash
   # Backend
   DEBUG=* npm run dev
   
   # Frontend
   npm run dev -- --debug
   ```

2. **Check network tab** in browser DevTools to see API requests

3. **Use browser DevTools** to inspect React components and state

4. **Check MongoDB Atlas logs** for database-related issues

## 📞 Getting Help

If you're still having issues:

1. **Check the logs** for specific error messages
2. **Search existing issues** in the repository
3. **Create a new issue** with:
   - Your operating system
   - Node.js version
   - Error messages
   - Steps to reproduce

## 🎯 Common Development Workflow

1. **Start MongoDB Atlas** (should always be running)
2. **Start backend**: `cd backend && npm run dev`
3. **Start frontend**: `npm run dev`
4. **Open browser**: http://localhost:3000
5. **Test registration/login** functionality

---

**Remember**: Always check both frontend and backend console logs for detailed error information!
