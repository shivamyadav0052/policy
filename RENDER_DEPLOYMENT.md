# Policy Sphere - Render Deployment Guide

## Deployment Steps

### 1. Prepare Your Project

Your project has been configured for Render deployment with the following files:
- `render.yaml` - Main deployment configuration
- `.renderignore` - Files to ignore during deployment
- `Dockerfile` (optional) - Alternative Docker-based deployment

### 2. Set Up on Render

1. Go to [render.com](https://render.com) and sign up/log in
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Choose the repository

### 3. Configure Environment Variables

On Render, set these environment variables in the dashboard:

**Database Configuration:**
```
DATABASE_URL = mysql://user:password@host:port/database_name
DATABASE_USER = your_database_user
DATABASE_PASSWORD = your_database_password
```

**Example for MySQL on Render (if using Render MySQL):**
```
DATABASE_URL = mysql://your-db-host:3306/your_db_name
DATABASE_USER = your_user
DATABASE_PASSWORD = your_password
```

### 4. Service Mapping

- **Backend API**: http://policy-sphere-backend:10000/api
- **Frontend**: Served from policy-sphere-frontend-react/build
- **API Proxy**: Routes /api calls to backend service

### 5. Build & Deploy

#### Option A: Using render.yaml (Recommended)
Simply push to GitHub, and Render will automatically:
1. Build the Spring Boot backend
2. Build the React frontend
3. Deploy both services

#### Option B: Deploy Services Separately
1. **Backend:**
   - Service Type: Web Service
   - Runtime: Java
   - Build Command: `mvn clean package -DskipTests`
   - Start Command: `java -jar target/insurance-policy-management-0.0.1-SNAPSHOT.jar`

2. **Frontend:**
   - Service Type: Static Site
   - Build Command: `npm install && npm run build`
   - Publish Directory: `build`

### 6. First Time Setup Issues

If you encounter database connection errors:
1. Ensure DATABASE_URL is correctly formatted
2. Check database credentials
3. Verify MySQL/PostgreSQL service is running
4. Check firewall/network rules

### 7. Monitoring

- View logs: Dashboard → Your service → Logs tab
- Monitor API: Dashboard → Metrics tab
- Check service status: Dashboard → Health tab

### 8. Custom Domain (Optional)

1. Go to service settings
2. Add custom domain
3. Update DNS records as shown

---

**Next Steps:**
1. Create Render account at render.com
2. Connect GitHub repository
3. Set environment variables
4. Deploy!

For more help: [Render Docs](https://docs.render.com)
