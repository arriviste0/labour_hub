# Labour Marketplace - Open Marketplace Web App

A comprehensive labour marketplace platform built with React.js, Express.js, Node.js, and MongoDB to connect skilled workers with reliable employers across India.

## 🚀 Features

### Phase 1 - MVP (Current)
- **Authentication & Accounts**: Phone OTP verification, role-based auth (Worker/Employer/Admin)
- **Profiles**: Complete worker and employer profiles with document uploads
- **Job Management**: Post, search, and apply for jobs with advanced filtering
- **Applications**: Apply, shortlist, and manage job applications
- **Admin Console**: User management, document verification, and platform moderation
- **Marketplace**: Advanced job search, worker discovery, and company profiles
- **Attendance & Payout**: QR check-ins, face recognition, automated wage calculations
- **Trust & Safety**: KYC verification, skill badges, insurance management, dispute resolution

### Dashboard Components
- **Employer Dashboard**: Workforce snapshot, hiring pipeline, cost & payroll, risk & compliance
- **Worker Dashboard**: Job opportunities, my jobs, wage ledger, ratings & reviews, profile strength
- **Admin Dashboard**: Platform overview, verifications, fraud monitoring, revenue analytics, user management

### Phase 2 - Trust & Operations (Planned)
- **KYC Verification**: Aadhaar/DigiLocker integration with manual review
- **Attendance System**: QR check-in/out with GPS tracking
- **Reviews & Ratings**: Worker-employer feedback system
- **Subscription Plans**: Employer subscription management
- **Support System**: Ticketing and dispute resolution

### Phase 3 - Payroll & Compliance (Planned)
- **Wage Management**: Automated payroll with UPI payouts
- **Salary Advances**: Worker advance request system
- **Matching Engine**: AI-powered job-worker matching
- **Insurance**: Group accident coverage
- **Compliance**: PF/ESIC integration and wage slips

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with refresh tokens
- **File Upload**: Multer with S3/MinIO support
- **Validation**: Express-validator
- **Security**: Helmet, CORS, Rate limiting

### Frontend
- **Framework**: React.js 18
- **Routing**: React Router DOM
- **State Management**: React Context + Zustand
- **Styling**: Tailwind CSS
- **UI Components**: Lucide React Icons
- **Forms**: React Hook Form
- **HTTP Client**: Axios with interceptors
- **Animations**: Framer Motion

### Infrastructure
- **Development**: Concurrent development servers
- **Environment**: Environment variable management
- **API**: RESTful API with comprehensive endpoints
- **Security**: JWT authentication, role-based access control

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (v5 or higher)
- npm or yarn package manager

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd labour_issue
```

### 2. Install Dependencies
```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..
```

### 3. Environment Setup
```bash
# Copy environment template
cp env.example .env

# Edit .env file with your configuration
# Update MongoDB URI, JWT secret, and other required values
```

### 4. Start Development Servers
```bash
# Start both backend and frontend in development mode
npm run dev

# Or start them separately:
npm run server    # Backend only (port 5000)
npm run client    # Frontend only (port 3000)
```

### 5. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/health

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/labour_marketplace

# JWT Secret
JWT_SECRET=your_jwt_secret_key_here_change_in_production

# AWS S3 Configuration (for file uploads)
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=ap-south-1
AWS_S3_BUCKET=labour-marketplace-docs

# Twilio Configuration (for OTP)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### MongoDB Setup

1. Install MongoDB locally or use MongoDB Atlas
2. Create a database named `labour_marketplace`
3. Update the `MONGODB_URI` in your `.env` file

## 📁 Project Structure

```
labour_issue/
├── server/                 # Backend code
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   ├── config/            # Configuration files
│   └── index.js           # Main server file
├── client/                # Frontend React app
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── contexts/      # React contexts
│   │   ├── services/      # API services
│   │   ├── hooks/         # Custom hooks
│   │   └── utils/         # Utility functions
│   └── package.json
├── package.json           # Backend dependencies
├── env.example            # Environment template
└── README.md
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/otp/send` - Send OTP
- `POST /api/auth/otp/verify` - Verify OTP and login
- `POST /api/auth/login` - Password login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout

### Workers
- `GET /api/workers/profile` - Get worker profile
- `PUT /api/workers/profile` - Update worker profile
- `POST /api/workers/documents/upload` - Upload documents

### Employers
- `GET /api/employers/profile` - Get employer profile
- `PUT /api/employers/profile` - Update employer profile
- `POST /api/employers/documents/upload` - Upload documents

### Jobs
- `GET /api/jobs` - List all jobs (with filters)
- `POST /api/jobs` - Create new job
- `GET /api/jobs/:id` - Get job details
- `PUT /api/jobs/:id` - Update job
- `DELETE /api/jobs/:id` - Delete job

### Applications
- `POST /api/applications` - Apply for job
- `GET /api/applications` - List applications
- `PUT /api/applications/:id` - Update application status

## 🧪 Testing

### Backend Testing
```bash
# Run backend tests
npm test

# Run tests with coverage
npm run test:coverage
```

### Frontend Testing
```bash
cd client
npm test
```

## 🚀 Deployment

### Production Build
```bash
# Build frontend
cd client
npm run build

# Start production server
npm start
```

### Environment Variables for Production
- Set `NODE_ENV=production`
- Use production MongoDB URI
- Configure production S3 bucket
- Set up proper JWT secrets
- Configure production Twilio credentials

### Deployment Platforms
- **Frontend**: Vercel, Netlify, or AWS S3
- **Backend**: Railway, Render, or AWS EC2
- **Database**: MongoDB Atlas
- **File Storage**: AWS S3 or MinIO

## 📊 Database Schema

### Core Collections
- **users**: User accounts and authentication
- **workers**: Worker profiles and skills
- **employers**: Employer profiles and company info
- **jobs**: Job postings and requirements
- **applications**: Job applications and status
- **documents**: User document storage
- **audit_logs**: System activity tracking

## 🔒 Security Features

- JWT authentication with refresh tokens
- Role-based access control (RBAC)
- Rate limiting on API endpoints
- Input validation and sanitization
- CORS configuration
- Helmet security headers
- Password hashing with bcrypt

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check this README and code comments
- **Issues**: Create an issue on GitHub
- **Email**: support@labourmarketplace.com

## 🎯 Roadmap

### Phase 1 (Weeks 0-6) - MVP ✅
- [x] User authentication and profiles
- [x] Job posting and applications
- [x] Basic admin console
- [x] Document upload system

### Phase 2 (Weeks 7-12) - Trust & Operations
- [ ] KYC verification system
- [ ] Attendance tracking
- [ ] Reviews and ratings
- [ ] Subscription management

### Phase 3 (Weeks 13-22) - Payroll & Compliance
- [ ] Wage management and payouts
- [ ] AI-powered matching engine
- [ ] Insurance integration
- [ ] Compliance features

### Phase 4 (Weeks 23-32) - Integrations
- [ ] ERP/HRMS connectors
- [ ] Bulk operations
- [ ] Advanced analytics

### Phase 5 (Weeks 33-48) - Mobile & Growth
- [ ] React Native worker app
- [ ] Referral programs
- [ ] Partnership integrations

## 📈 Performance Metrics

- **Target Fill Rate**: ≥ 40%
- **Response Time**: < 2 seconds
- **Uptime**: ≥ 99.9%
- **User Growth**: 3,000 workers, 150 employers in 90 days

---

**Built with ❤️ for India's labour market**
