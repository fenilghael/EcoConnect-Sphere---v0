# EcoConnect Sphere

A comprehensive platform for community sustainability initiatives, connecting citizens, organizers, and agencies to create positive environmental impact.

## 🌱 Features

### For Citizens
- **Discover Events**: Find and join local sustainability events
- **Track Impact**: Monitor your environmental contributions and earn badges
- **Build Community**: Connect with like-minded individuals
- **Gamification**: Earn badges and track your sustainability journey

### For Event Organizers
- **Event Management**: Create, manage, and promote sustainability events
- **Participant Tracking**: Monitor registrations, check-ins, and feedback
- **Impact Reporting**: Submit and track event outcomes
- **Communication Tools**: Engage with participants and manage inquiries

### For Agencies
- **Verification System**: Verify and approve event organizers
- **Analytics Dashboard**: Monitor community engagement and impact metrics
- **Event Oversight**: Review and approve community events
- **Compliance Tracking**: Ensure events meet safety and environmental standards

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB Atlas account (or local MongoDB)
- Git

### Option 1: Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ecoconnect-sphere
   ```

2. **Start with Docker Compose**
   ```bash
   docker-compose up -d
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - MongoDB: localhost:27017

### Option 2: Manual Setup

1. **Clone and install dependencies**
   ```bash
   git clone <repository-url>
   cd ecoconnect-sphere
   npm run fullstack:install
   ```

2. **Set up environment variables**
   ```bash
   # Copy backend environment template
   cp backend/env.example backend/.env
   
   # Copy frontend environment template  
   cp env.example .env
   
   # Edit the files with your configuration
   ```

3. **Configure MongoDB Atlas**
   - Create a MongoDB Atlas cluster
   - Get your connection string
   - Update `MONGODB_URI` in `backend/.env`

4. **Start the development servers**
   ```bash
   npm run fullstack:dev
   ```

## 🔧 Configuration

### Backend Environment Variables (`backend/.env`)

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# MongoDB Atlas Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecoconnect-sphere?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30

# Cloudinary Configuration (optional)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email Configuration (optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

### Frontend Environment Variables (`.env`)

```env
VITE_API_URL=http://localhost:5000/api
```

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Event Endpoints
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get single event
- `POST /api/events` - Create event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event
- `POST /api/events/:id/register` - Register for event

### User Endpoints
- `GET /api/users` - Get all users (admin)
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile
- `GET /api/users/leaderboard` - Get leaderboard

### Badge Endpoints
- `GET /api/badges` - Get all badges
- `GET /api/badges/:id` - Get single badge
- `GET /api/badges/progress/:userId` - Get user badge progress

### Agency Endpoints
- `GET /api/agencies` - Get all agencies
- `POST /api/agencies` - Create agency
- `PUT /api/agencies/:id` - Update agency

## 🗄️ Database Schema

### Users
- Personal information and preferences
- Role-based permissions (citizen, organizer, moderator, admin)
- Statistics and impact tracking
- Badge collection

### Events
- Event details and scheduling
- Location and accessibility information
- Capacity and registration management
- Impact metrics and verification status

### Badges
- Achievement definitions and criteria
- Rarity and point systems
- Category-based organization
- Progress tracking

### Agencies
- Organization information and verification
- Administrator management
- Event oversight capabilities
- Analytics and reporting

## 🚀 Deployment

### Azure App Service (Recommended)

1. **Prepare for deployment**
   ```bash
   # Build frontend
   npm run build
   
   # Copy frontend build to backend
   cp -r dist backend/
   ```

2. **Deploy to Azure**
   - Create Azure App Service
   - Configure environment variables
   - Deploy backend directory
   - Configure MongoDB Atlas connection

### Other Platforms

The application can be deployed to any platform supporting Node.js:
- Heroku
- DigitalOcean App Platform
- AWS Elastic Beanstalk
- Google Cloud Run

## 🧪 Development

### Running Tests
```bash
# Backend tests
cd backend && npm test

# Frontend tests (when implemented)
npm test
```

### Database Seeding
```bash
cd backend && node -e "require('./utils/seedData').seedAll()"
```

### Code Style
- ESLint for JavaScript/TypeScript
- Prettier for code formatting
- Follow existing patterns in the codebase

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review existing issues and discussions

## 🗺️ Roadmap

- [ ] Mobile app development
- [ ] Advanced analytics and reporting
- [ ] Integration with external sustainability APIs
- [ ] Multi-language support
- [ ] Advanced notification system
- [ ] Community forums and discussions
- [ ] Corporate partnership features
- [ ] Advanced impact measurement tools

---

Built with ❤️ for a sustainable future