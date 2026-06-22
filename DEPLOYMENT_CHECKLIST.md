## ✅ Pre-Deployment Checklist for Render

### Backend (Spring Boot)

- [ ] Verify `application.properties` uses environment variables
- [ ] Check `pom.xml` has Maven build configured
- [ ] Test locally: `mvn clean package`
- [ ] Ensure no hardcoded credentials in code
- [ ] Git push all changes to GitHub

### Frontend (React)

- [ ] Verify `.env.production` has correct API URL
- [ ] Test build locally: `npm run build`
- [ ] Remove any localStorage/sessionStorage that persists dev settings
- [ ] Check `package.json` has all required scripts
- [ ] Git push all changes to GitHub

### Render Setup

- [ ] Create Render account at https://render.com
- [ ] Connect GitHub repository to Render
- [ ] Create Web Service for backend
- [ ] Create Static Site for frontend
- [ ] Set environment variables:
  - [ ] `DATABASE_URL` = Your MySQL connection string
  - [ ] `DATABASE_USER` = Your database username
  - [ ] `DATABASE_PASSWORD` = Your database password
  - [ ] `SPRING_JPA_HIBERNATE_DDL_AUTO` = update (or validate)

### Database Setup

- [ ] Create MySQL database on external provider:
  - [ ] Render Database (recommended)
  - [ ] AWS RDS
  - [ ] DigitalOcean
  - [ ] Azure Database
  - [ ] Or any managed MySQL service

- [ ] Note connection details:
  - [ ] Host: `_________________`
  - [ ] Port: `_________________`
  - [ ] Database name: `_________________`
  - [ ] Username: `_________________`
  - [ ] Password: `_________________`

### Format DATABASE_URL

```
mysql://username:password@hostname:3306/database_name
```

Example:
```
mysql://admin:mypassword@mysql.render.com:3306/policy_db
```

### Deployment

- [ ] Push code to GitHub
- [ ] Render auto-detects render.yaml and deploys
- [ ] Monitor logs: Dashboard → Service → Logs
- [ ] Test API: `https://your-backend-service.onrender.com/api/health`
- [ ] Test Frontend: `https://your-frontend-service.onrender.com`

### Post-Deployment Testing

- [ ] [ ] Backend responds at deployed URL
- [ ] [ ] Frontend loads without errors
- [ ] [ ] Login functionality works
- [ ] [ ] API calls succeed
- [ ] [ ] Database operations work
- [ ] [ ] File uploads function (if applicable)

### Troubleshooting

**Build Fails:**
- Check logs in Render dashboard
- Verify Maven/Node versions match project requirements
- Ensure all environment variables are set

**Database Connection Fails:**
- Verify DATABASE_URL format
- Check username/password
- Ensure database is running
- Check firewall rules allow connection

**Frontend Can't Connect to API:**
- Verify backend service is running
- Check CORS settings in backend
- Ensure API proxy is configured in render.yaml
- Check browser console for errors

**Java Version Issues:**
- Project uses Java 17
- Render needs Java 17 runtime specified
- Check runtimeVersion in render.yaml

---

### Useful Commands

**Test backend locally:**
```bash
cd policy-sphere-backend-springboot
mvn clean package
java -jar target/insurance-policy-management-0.0.1-SNAPSHOT.jar
```

**Test frontend locally:**
```bash
cd policy-sphere-frontend-react
npm install
npm start
```

**View Render logs:**
```
1. Go to render.com dashboard
2. Click on your service
3. View "Logs" tab
```

---

**Documentation:** See [RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md) for detailed instructions
