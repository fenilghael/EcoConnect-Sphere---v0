# Deployment Guide - EcoConnect Sphere

This guide covers various deployment options for the EcoConnect Sphere platform.

## 🚀 Azure App Service Deployment (Recommended)

### Prerequisites
- Azure account with App Service access
- MongoDB Atlas cluster
- GitHub repository (for continuous deployment)

### Step 1: Prepare the Application

1. **Build the frontend**
   ```bash
   npm run build
   ```

2. **Copy frontend to backend directory**
   ```bash
   # Create a deployment-ready structure
   cp -r dist backend/frontend
   ```

3. **Update backend to serve frontend**
   The backend is already configured to serve static files from the `frontend` directory in production.

### Step 2: Configure MongoDB Atlas

1. **Create a MongoDB Atlas cluster**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create a new cluster
   - Configure network access (allow Azure IP ranges)
   - Create a database user

2. **Get connection string**
   ```
   mongodb+srv://username:password@cluster.mongodb.net/ecoconnect-sphere?retryWrites=true&w=majority
   ```

### Step 3: Deploy to Azure App Service

1. **Create App Service**
   ```bash
   # Using Azure CLI
   az webapp create \
     --resource-group myResourceGroup \
     --plan myAppServicePlan \
     --name ecoconnect-sphere \
     --runtime "NODE|18-lts"
   ```

2. **Configure Application Settings**
   ```bash
   az webapp config appsettings set \
     --resource-group myResourceGroup \
     --name ecoconnect-sphere \
     --settings \
       NODE_ENV=production \
       PORT=8080 \
       MONGODB_URI="your-mongodb-connection-string" \
       JWT_SECRET="your-jwt-secret" \
       JWT_EXPIRE=30d \
       FRONTEND_URL="https://ecoconnect-sphere.azurewebsites.net"
   ```

3. **Deploy the application**
   ```bash
   # Deploy using Azure CLI
   az webapp deployment source config-zip \
     --resource-group myResourceGroup \
     --name ecoconnect-sphere \
     --src backend.zip
   ```

### Step 4: Configure Custom Domain (Optional)

1. **Add custom domain in Azure portal**
2. **Configure DNS records**
3. **Update SSL certificate**

## 🐳 Docker Deployment

### Using Docker Compose (Local/Server)

1. **Clone and configure**
   ```bash
   git clone <repository-url>
   cd ecoconnect-sphere
   cp backend/env.example backend/.env
   # Edit backend/.env with your configuration
   ```

2. **Start services**
   ```bash
   docker-compose up -d
   ```

3. **Verify deployment**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000
   - MongoDB: localhost:27017

### Using Docker Swarm

1. **Initialize swarm**
   ```bash
   docker swarm init
   ```

2. **Deploy stack**
   ```bash
   docker stack deploy -c docker-compose.yml ecoconnect
   ```

## ☁️ Cloud Platform Deployments

### Heroku

1. **Create Heroku app**
   ```bash
   heroku create ecoconnect-sphere
   ```

2. **Configure environment variables**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set MONGODB_URI="your-mongodb-connection-string"
   heroku config:set JWT_SECRET="your-jwt-secret"
   ```

3. **Deploy**
   ```bash
   git subtree push --prefix backend heroku main
   ```

### DigitalOcean App Platform

1. **Create app specification**
   ```yaml
   name: ecoconnect-sphere
   services:
   - name: backend
     source_dir: /backend
     github:
       repo: your-username/ecoconnect-sphere
       branch: main
     run_command: npm start
     environment_slug: node-js
     instance_count: 1
     instance_size_slug: basic-xxs
     envs:
     - key: NODE_ENV
       value: production
     - key: MONGODB_URI
       value: ${MONGODB_URI}
   ```

2. **Deploy via DigitalOcean dashboard**

### AWS Elastic Beanstalk

1. **Install EB CLI**
   ```bash
   pip install awsebcli
   ```

2. **Initialize EB application**
   ```bash
   cd backend
   eb init
   eb create production
   ```

3. **Configure environment variables**
   ```bash
   eb setenv NODE_ENV=production MONGODB_URI="your-mongodb-connection-string"
   ```

4. **Deploy**
   ```bash
   eb deploy
   ```

## 🔧 Environment Configuration

### Production Environment Variables

```env
# Server
NODE_ENV=production
PORT=8080

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecoconnect-sphere?retryWrites=true&w=majority

# Security
JWT_SECRET=your-super-secure-jwt-secret-key
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30

# CORS
FRONTEND_URL=https://your-domain.com

# File Upload (Optional)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 📊 Monitoring and Logging

### Application Insights (Azure)

1. **Enable Application Insights**
   ```bash
   az monitor app-insights component create \
     --app ecoconnect-sphere \
     --location eastus \
     --resource-group myResourceGroup
   ```

2. **Configure logging**
   - Application logs
   - Performance metrics
   - Error tracking

### Health Checks

The application includes health check endpoints:
- Backend: `GET /api/health`
- Frontend: `GET /health`

## 🔒 Security Considerations

### SSL/TLS
- Always use HTTPS in production
- Configure proper SSL certificates
- Enable HSTS headers

### Environment Variables
- Never commit `.env` files
- Use secure secret management
- Rotate secrets regularly

### Database Security
- Use MongoDB Atlas security features
- Enable IP whitelisting
- Use strong authentication

### CORS Configuration
```javascript
// Configure CORS for production
const corsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials: true,
  optionsSuccessStatus: 200
};
```

## 🚨 Troubleshooting

### Common Issues

1. **MongoDB Connection Issues**
   - Check connection string format
   - Verify network access settings
   - Ensure database user permissions

2. **CORS Errors**
   - Verify FRONTEND_URL configuration
   - Check browser developer tools
   - Test API endpoints directly

3. **File Upload Issues**
   - Check Cloudinary configuration
   - Verify file size limits
   - Test with small files first

4. **Authentication Problems**
   - Verify JWT_SECRET is set
   - Check token expiration settings
   - Test login/logout flow

### Log Analysis

```bash
# View application logs
az webapp log tail --resource-group myResourceGroup --name ecoconnect-sphere

# View specific log streams
az webapp log download --resource-group myResourceGroup --name ecoconnect-sphere
```

## 📈 Performance Optimization

### Backend Optimization
- Enable compression middleware
- Implement caching strategies
- Optimize database queries
- Use connection pooling

### Frontend Optimization
- Enable gzip compression
- Implement service workers
- Optimize bundle size
- Use CDN for static assets

### Database Optimization
- Create proper indexes
- Monitor query performance
- Implement data archiving
- Use read replicas for scaling

## 🔄 CI/CD Pipeline

### GitHub Actions Example

```yaml
name: Deploy to Azure
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
    - name: Install dependencies
      run: |
        cd backend
        npm ci
    - name: Build frontend
      run: |
        npm ci
        npm run build
        cp -r dist backend/frontend
    - name: Deploy to Azure
      uses: azure/webapps-deploy@v2
      with:
        app-name: 'ecoconnect-sphere'
        publish-profile: ${{ secrets.AZURE_WEBAPP_PUBLISH_PROFILE }}
        package: './backend'
```

## 📞 Support

For deployment issues:
1. Check the troubleshooting section
2. Review application logs
3. Create an issue in the repository
4. Contact the development team

---

Remember to always test deployments in a staging environment before promoting to production!

## 🐧 DigitalOcean Droplet (recommended for simple controlled deployments)

This section explains how to provision a Droplet, configure SSH and firewall, and deploy the project using the included scripts `scripts/deploy.sh` (Linux) and `scripts/deploy.ps1` (PowerShell).

Prerequisites
- A DigitalOcean account and API token (optional if using the control panel)
- `ssh` and `git` installed locally
- An SSH key added to your DigitalOcean account
- (Optional) `doctl` CLI installed: https://docs.digitalocean.com/reference/doctl/

Create a Droplet (one-liner with `doctl`):

```bash
# replace <name> and <region> as needed
doctl compute droplet create ecoconnect-1 --size s-1vcpu-1gb --image ubuntu-24-04-x64 --region nyc3 --ssh-keys <your-ssh-key-id> --wait
```

Or create a Droplet from the web UI and add your SSH key.

Open required ports (simplest: allow HTTP/HTTPS and SSH)

```bash
# Example UFW rules on the droplet
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

Environment variables
- Copy `backend/env.example` to `backend/.env` and set values for production. Important variables:
   - `MONGODB_URI` (use MongoDB Atlas or a managed MongoDB service)
   - `JWT_SECRET`
   - `FRONTEND_URL`

Using the provided scripts

- From your machine (macOS / Linux):

```bash
# Clone repo on your machine (optional) and run deploy script
# If you want the droplet to git clone the repo directly, pass the repo URL
./scripts/deploy.sh user@DROPLET_IP --repo https://github.com/your/repo.git --private-key /path/to/key
```

- From Windows PowerShell (pwsh)

```powershell
# Example: use your SSH user and droplet IP
# pwsh.exe ./scripts/deploy.ps1 -Target user@DROPLET_IP -Repo https://github.com/your/repo.git -KeyPath C:\Users\you\.ssh\id_rsa
```

What the scripts do
- Install Docker and the docker compose plugin on the droplet (Ubuntu/Debian based)
- Clone the repository (if `--repo`/`-Repo` is provided)
- Run `docker compose pull` and `docker compose up -d --build`

Notes and troubleshooting
- If you use MongoDB Atlas, ensure your droplet's public IP is allowed in the Atlas network access list (or set 0.0.0.0/0 for testing only).
- If the deploy script fails at Docker install, SSH into the droplet and run the install steps manually. Check `/var/log/syslog` for system errors.
- To view Docker compose logs on the droplet:

```bash
ssh user@DROPLET_IP 'sudo docker compose logs -f'
```

Cleaning up
- Remove old images and dangling volumes with `sudo docker system prune -af` on the droplet.

Security
- Use a managed database where possible.
- Use a secrets manager or environment variables via `docker compose` override files. Do not commit `.env`.

