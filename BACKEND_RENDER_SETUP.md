# Policy Sphere Backend - Render Deployment Guide

## Quick Start

### Step 1: Create Render Account
- Go to [render.com](https://render.com)
- Sign up and log in
- Connect your GitHub repository

### Step 2: Deploy Backend

#### Option A: Using render.yaml (Recommended)
1. Push your code to GitHub
2. Go to Render Dashboard
3. Click "New" → "Web Service"
4. Select your GitHub repository
5. Render will auto-detect `render.yaml` and deploy
6. Backend + Database will be created automatically

#### Option B: Manual Setup
If render.yaml doesn't work:
1. Create Web Service:
   - Name: `policysphere-backend`
   - Runtime: Java 17
   - Build Command: `cd policy-sphere-backend-springboot && mvn clean package -DskipTests`
   - Start Command: `java -jar policy-sphere-backend-springboot/target/insurance-policy-management-0.0.1-SNAPSHOT.jar`

2. Create MySQL Database:
   - Click "New" → "MySQL"
   - Name: `policysphere-db`
   - Plan: Free

3. Set Environment Variables in Backend Service:
   ```
   DATABASE_URL = (auto-populated from DB connection string)
   DATABASE_USER = (auto-populated from DB)
   DATABASE_PASSWORD = (auto-populated from DB)
   JPA_HIBERNATE_DDL_AUTO = update
   PORT = 10000
   ```

### Step 3: Verify Deployment

After deployment completes:
1. Check service logs for errors
2. Visit: `https://your-service.onrender.com/actuator/health`
3. Should return: `{"status":"UP"}`

### Step 4: Get Backend URL

Your backend API will be available at:
```
https://policysphere-backend.onrender.com
```

Use this URL to configure your frontend.

---

## Environment Variables (Required)

| Variable | Source | Example |
|----------|--------|---------|
| `DATABASE_URL` | Render MySQL | `mysql://user:pass@db.host:3306/dbname` |
| `DATABASE_USER` | Render MySQL | `policysphere_user` |
| `DATABASE_PASSWORD` | Render MySQL | `your_secure_password` |
| `JPA_HIBERNATE_DDL_AUTO` | Set to | `update` |
| `PORT` | Set to | `10000` |

---

## Common Issues & Solutions

### Build Fails
```
ERROR: Maven build command failed
```
**Solution:**
- Check Java version is 17
- Verify pom.xml has all dependencies
- Check buildCommand syntax in render.yaml

### Database Connection Error
```
Communications link failure
```
**Solution:**
- Verify DATABASE_URL format
- Check DATABASE_USER and DATABASE_PASSWORD
- Ensure MySQL database is running
- Wait 2-3 minutes for database to initialize

### Port Binding Error
```
Port 8183 already in use
```
**Solution:**
- Set `PORT=10000` environment variable
- Render automatically assigns a port; don't hardcode

---

## Next Steps

1. ✅ Deploy backend
2. ⏭️ Configure frontend to connect to backend
3. ⏭️ Deploy frontend React app
4. ⏭️ Set up custom domain (optional)

---

## Useful Render URLs

- Dashboard: https://dashboard.render.com
- Docs: https://docs.render.com
- MySQL Docs: https://docs.render.com/mysql
