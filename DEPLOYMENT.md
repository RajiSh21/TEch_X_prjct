# Deployment Checklist

This checklist will help you deploy the College Placement System to production.

## Pre-Deployment Checklist

### 1. Environment Configuration
- [ ] Create production `.env` file
- [ ] Update `MONGODB_URI` with production database URL (e.g., MongoDB Atlas)
- [ ] Generate strong `JWT_SECRET` (use: `openssl rand -base64 32`)
- [ ] Set `NODE_ENV=production`
- [ ] Configure email settings for notifications
- [ ] Update CORS origins for production domains

### 2. Database Setup
- [ ] Create MongoDB Atlas account (or similar cloud database)
- [ ] Create new cluster
- [ ] Whitelist application IP addresses
- [ ] Create database user with appropriate permissions
- [ ] Get connection string
- [ ] Test database connection

### 3. Backend Preparation
- [ ] Review and update API rate limiting
- [ ] Configure production logging (Winston/Morgan)
- [ ] Set up error tracking (Sentry/Rollbar)
- [ ] Enable HTTPS/SSL
- [ ] Configure reverse proxy (Nginx)
- [ ] Set up process manager (PM2)
- [ ] Configure automatic restart on failure

### 4. Mobile App Preparation
- [ ] Update API_BASE_URL to production backend URL
- [ ] Configure app icons and splash screens
- [ ] Update app.json with correct app name and bundle identifier
- [ ] Set up analytics (Google Analytics/Mixpanel)
- [ ] Configure push notifications (Firebase)
- [ ] Test on real devices

### 5. Security Review
- [ ] Change all default passwords
- [ ] Enable HTTPS everywhere
- [ ] Review CORS settings
- [ ] Check JWT expiration settings
- [ ] Review rate limiting rules
- [ ] Scan for vulnerabilities
- [ ] Update all dependencies to latest stable versions

## Backend Deployment

### Option 1: Deploy to Heroku

1. **Install Heroku CLI**
```bash
# macOS
brew tap heroku/brew && brew install heroku

# Other OS
# Download from https://devcenter.heroku.com/articles/heroku-cli
```

2. **Login to Heroku**
```bash
heroku login
```

3. **Create Heroku App**
```bash
heroku create your-app-name
```

4. **Add MongoDB Add-on** (or use MongoDB Atlas)
```bash
heroku addons:create mongolab:sandbox
# Or set custom MongoDB URI
heroku config:set MONGODB_URI="your_mongodb_atlas_uri"
```

5. **Set Environment Variables**
```bash
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET="your_generated_secret"
heroku config:set JWT_EXPIRE=7d
```

6. **Deploy**
```bash
git push heroku main
```

7. **Open App**
```bash
heroku open
```

### Option 2: Deploy to DigitalOcean/AWS/GCP

1. **Create a Droplet/Instance**
   - Ubuntu 20.04 LTS recommended
   - Minimum 1GB RAM

2. **SSH into Server**
```bash
ssh root@your_server_ip
```

3. **Install Node.js**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

4. **Install MongoDB** (or use Atlas)
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
```

5. **Clone Repository**
```bash
git clone https://github.com/RajiSh21/TEch_X_prjct.git
cd TEch_X_prjct
```

6. **Install Dependencies**
```bash
npm install
```

7. **Configure Environment**
```bash
cp .env.example .env
nano .env  # Edit configuration
```

8. **Install PM2**
```bash
sudo npm install -g pm2
```

9. **Start Application**
```bash
pm2 start server/index.js --name college-placement
pm2 save
pm2 startup
```

10. **Configure Nginx** (Optional, for reverse proxy)
```bash
sudo apt-get install nginx
sudo nano /etc/nginx/sites-available/college-placement
```

Add configuration:
```nginx
server {
    listen 80;
    server_name your_domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/college-placement /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

11. **Set up SSL with Let's Encrypt**
```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d your_domain.com
```

## Mobile App Deployment

### iOS Deployment

1. **Prerequisites**
   - Apple Developer Account ($99/year)
   - macOS with Xcode

2. **Configure App**
```bash
cd mobile
```

Edit `app.json`:
```json
{
  "expo": {
    "name": "College Placement",
    "slug": "college-placement",
    "version": "1.0.0",
    "ios": {
      "bundleIdentifier": "com.yourcompany.collegeplacement",
      "buildNumber": "1.0.0"
    }
  }
}
```

3. **Build**
```bash
expo build:ios
```

4. **Submit to App Store**
   - Download IPA from Expo
   - Use Xcode or Transporter to upload
   - Submit for review via App Store Connect

### Android Deployment

1. **Prerequisites**
   - Google Play Developer Account ($25 one-time)

2. **Configure App**
Edit `app.json`:
```json
{
  "expo": {
    "android": {
      "package": "com.yourcompany.collegeplacement",
      "versionCode": 1
    }
  }
}
```

3. **Build**
```bash
expo build:android
```

4. **Submit to Play Store**
   - Download APK/AAB from Expo
   - Upload to Google Play Console
   - Complete store listing
   - Submit for review

### Alternative: Use EAS Build (Recommended)

1. **Install EAS CLI**
```bash
npm install -g eas-cli
```

2. **Configure EAS**
```bash
eas build:configure
```

3. **Build for Both Platforms**
```bash
eas build --platform all
```

4. **Submit to Stores**
```bash
eas submit --platform ios
eas submit --platform android
```

## Post-Deployment

### Monitoring
- [ ] Set up application monitoring (New Relic, Datadog)
- [ ] Configure error tracking
- [ ] Set up uptime monitoring (UptimeRobot)
- [ ] Enable logging aggregation
- [ ] Set up alerts for errors and downtime

### Performance
- [ ] Enable database indexing
- [ ] Configure CDN for static assets
- [ ] Enable gzip compression
- [ ] Implement caching strategies
- [ ] Optimize API response times

### Backups
- [ ] Configure automated database backups
- [ ] Test backup restoration
- [ ] Set up backup retention policy
- [ ] Document backup procedures

### Testing
- [ ] Perform end-to-end testing
- [ ] Load testing
- [ ] Security testing
- [ ] User acceptance testing
- [ ] Mobile app testing on various devices

### Documentation
- [ ] Update deployment documentation
- [ ] Document environment variables
- [ ] Create runbook for common issues
- [ ] Document backup/restore procedures
- [ ] Create user guides

## Maintenance

### Regular Tasks
- [ ] Monitor application performance
- [ ] Review error logs
- [ ] Update dependencies monthly
- [ ] Security patches as needed
- [ ] Database optimization
- [ ] Backup verification

### Scaling Considerations
- [ ] Monitor resource usage
- [ ] Plan for horizontal scaling
- [ ] Implement load balancing
- [ ] Consider microservices architecture
- [ ] Database sharding if needed

## Rollback Plan

If deployment fails:

1. **Backend Rollback**
```bash
# Using PM2
pm2 stop college-placement
git checkout previous_version_tag
npm install
pm2 restart college-placement

# Using Heroku
heroku rollback
```

2. **Database Rollback**
```bash
# Restore from backup
mongorestore --uri="mongodb_uri" backup_directory
```

3. **Mobile App**
   - Cannot rollback installed apps
   - Push hotfix as new version
   - Use feature flags to disable problematic features

## Support Contacts

- Technical Lead: _____________
- DevOps: _____________
- Database Admin: _____________
- Emergency Contact: _____________

## Resources

- MongoDB Atlas: https://www.mongodb.com/cloud/atlas
- Heroku: https://www.heroku.com/
- Expo Documentation: https://docs.expo.dev/
- PM2 Documentation: https://pm2.keymetrics.io/
- Nginx Documentation: https://nginx.org/en/docs/

---

**Note**: Always test deployment procedures in a staging environment before deploying to production.
