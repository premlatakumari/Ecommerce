# E-Commerce Web Application

A full-stack e-commerce web application built with modern technologies, featuring user authentication, role-based access control, admin dashboard, and comprehensive user management system.

##  Features

### Authentication & Authorization
- **User Registration**: Secure signup with email verification
- **Login/Logout**: JWT-based authentication with HTTP-only cookies
- **OTP Verification**: Email-based account verification
- **Password Recovery**: Forgot password with email reset links
- **Role-Based Access**: Admin and User roles with protected routes

### User Management
- **Profile Management**: Update personal information and avatar
- **Account Settings**: Change password and account preferences
- **Avatar Upload**: Cloudinary integration for profile pictures

### Admin Dashboard
- **User Statistics**: Real-time metrics (total, active, inactive, verified users)
- **User Management**: View, filter, and update user statuses
- **Pagination**: Efficient handling of large user datasets
- **Search & Filter**: Find users by name, email, or status

### User Dashboard
- **Account Overview**: Personal account status and information
- **Profile Display**: Comprehensive user profile view
- **Account Status**: Visual indicators for active/inactive accounts

## 🛠️ Technology Stack

### Frontend
- **React 19** - Modern React with hooks and concurrent features
- **Vite** - Fast build tool and development server
- **Tailwind CSS 4** - Utility-first CSS framework
- **React Router DOM** - Client-side routing
- **Lucide React** - Beautiful icon library
- **React Hot Toast** - Notification system
- **Axios** - HTTP client for API calls

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing
- **Cloudinary** - Cloud-based image storage
- **Nodemailer** - Email sending service
- **Multer** - File upload handling

## 📁 Project Structure

```
E-Com-Web-Application/
├── client/                          # Frontend React application
│   ├── public/                      # Static assets
│   ├── src/
│   │   ├── components/              # Reusable React components
│   │   │   ├── ProtectedRoute.jsx   # Route protection component
│   │   │   └── UserTable.jsx        # User data table component
│   │   ├── context/
│   │   │   └── AuthContext.jsx      # Authentication context
│   │   ├── lib/                     # Utility libraries
│   │   │   ├── apiClient.js         # Axios configuration
│   │   │   ├── authApi.js           # Authentication API calls
│   │   │   ├── dashboardApi.js      # Dashboard API calls
│   │   │   └── index.js             # Library exports
│   │   ├── pages/                   # Page components
│   │   │   ├── AdminDashboard.jsx   # Admin control panel
│   │   │   ├── UserDashboard.jsx    # User dashboard
│   │   │   ├── LoginPage.jsx        # Login page
│   │   │   ├── RegisterPage.jsx     # Registration page
│   │   │   ├── ProfilePage.jsx      # User profile page
│   │   │   └── ...                  # Other pages
│   │   ├── services/                # Service layer
│   │   ├── utils/                   # Utility functions
│   │   ├── App.jsx                  # Main app component
│   │   └── main.jsx                 # App entry point
│   ├── package.json
│   ├── vite.config.js
│   └── .env                         # Environment variables
├── server/                          # Backend Node.js application
│   ├── config/                      # Configuration files
│   │   ├── cloudinary.js            # Cloudinary setup
│   │   └── db.js                    # Database connection
│   ├── controllers/                 # Route controllers
│   │   ├── auth.controller.js       # Authentication logic
│   │   └── dashboard.controller.js  # Dashboard logic
│   ├── middlewares/                 # Express middlewares
│   │   ├── auth.middleware.js       # Authentication middleware
│   │   └── validate.middleware.js   # Validation middleware
│   ├── models/                      # Database models
│   │   └── user.model.js            # User schema
│   ├── routes/                      # API routes
│   │   ├── auth.routes.js           # Authentication routes
│   │   └── dashboard.routes.js      # Dashboard routes
│   ├── utils/                       # Utility functions
│   │   ├── emailTemplates.js        # Email templates
│   │   ├── sendEmail.js             # Email service
│   │   ├── sendToken.js             # JWT token utilities
│   │   └── validation.js            # Input validation
│   ├── app.js                       # Express app setup
│   ├── server.js                    # Server entry point
│   ├── package.json
│   └── .env.example                 # Environment variables template
└── README.md                        # Project documentation
```

##  Installation & Setup

### Prerequisites
- **Node.js** (v16 or higher)
- **MongoDB** (local or cloud instance)
- **npm** or **yarn** package manager

### Backend Setup

1. **Navigate to server directory:**
   ```bash
   cd server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Configuration:**
   ```bash
   cp .env.example .env
   ```

   Update the `.env` file with your configuration:
   ```env
   NODE_ENV=development
   PORT=5000
   CLIENT_URL=http://localhost:5173
   MONGO_URI=mongodb://localhost:27017/ecom-web-app
   JWT_SECRET_KEY=your-super-secret-jwt-key-here-change-in-production
   COOKIE_EXPIRE=24
   MAIL_HOST=smtp.gmail.com
   MAIL_PORT=587
   MAIL_USER=your-email@gmail.com
   MAIL_PASS=your-app-password
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ```

4. **Start MongoDB:**
   Make sure MongoDB is running on your system or update `MONGO_URI` for cloud database.

5. **Start the server:**
   ```bash
   npm run dev  # Development mode with nodemon
   # or
   npm start    # Production mode
   ```

### Frontend Setup

1. **Navigate to client directory:**
   ```bash
   cd client
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Configuration:**
   The client `.env` file should contain:
   ```env
   VITE_API_URL=http://localhost:5000/api/v1
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Build for production:**
   ```bash
   npm run build
   npm run preview
   ```

##  Usage

### User Registration Flow
1. Visit the registration page
2. Fill in required information (name, email, phone, password, date of birth)
3. Upload an optional avatar image
4. Verify email with OTP sent to your email
5. Complete registration and login

### Admin Features
- Access admin dashboard at `/admin/dashboard`
- View user statistics and manage user accounts
- Update user statuses (active/inactive)
- Search and filter users

### User Features
- Access user dashboard at `/user/dashboard`
- View account status and profile information
- Update profile and settings

## 🔐 API Endpoints

### Authentication Routes (`/api/v1/auth`)
- `POST /register` - User registration
- `POST /verify-otp` - OTP verification
- `POST /login` - User login
- `POST /logout` - User logout
- `GET /me` - Get current user info
- `POST /password/forgot` - Request password reset
- `PUT /password/reset/:token` - Reset password
- `PUT /password/update` - Update password

### Dashboard Routes (`/api/v1/dashboard`)
- `GET /admin/stats` - Get dashboard statistics (Admin only)
- `GET /admin/users` - Get all users with pagination (Admin only)
- `PUT /admin/users/:id/status` - Update user status (Admin only)
- `GET /user/profile` - Get user profile (User only)

## 🔒 Security Features

- **Password Hashing**: bcrypt for secure password storage
- **JWT Authentication**: Stateless authentication with HTTP-only cookies
- **CORS Protection**: Configured for cross-origin requests
- **Input Validation**: Comprehensive validation for all inputs
- **Rate Limiting**: Protection against brute force attacks
- **File Upload Security**: Image validation and size limits

## mail Configuration

The application uses Nodemailer for email services. Configure your email settings in the `.env` file:

- **Gmail**: Use app passwords for Gmail accounts
- **Other Providers**: Update MAIL_HOST, MAIL_PORT accordingly

##  Cloudinary Setup

For image uploads, configure Cloudinary in your `.env` file:
1. Sign up at [Cloudinary](https://cloudinary.com)
2. Get your cloud name, API key, and API secret
3. Configure the environment variables

## Database Schema

### User Model
```javascript
{
  name: String (required, min: 3 chars),
  email: String (required, unique, lowercase),
  password: String (required, min: 8 chars, hashed),
  phone: String (10-15 digits),
  address: String,
  role: String (enum: ['Admin', 'User'], default: 'User'),
  accountVerified: Boolean (default: false),
  lastLogin: Date,
  avatar: {
    public_id: String,
    url: String
  },
  dateOfBirth: Date,
  status: String (enum: ['active', 'inactive'], default: 'active'),
  // Additional fields for password reset
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  verificationCode: String,
  verificationCodeExpire: Date
}
```

##  Deployment

### Backend Deployment (Vercel)
1. Set up environment variables in your hosting platform
2. Ensure MongoDB connection string is configured
3. Deploy the server code

### Frontend Deployment (Vercel)
1. Build the project: `npm run build`
2. Update `VITE_API_URL` to production backend URL
3. Deploy the `dist` folder

### Environment Variables for Production
```env
NODE_ENV=production
CLIENT_URL=https://your-frontend-domain.com
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/production-db
JWT_SECRET_KEY=your-production-jwt-secret
# ... other production configs
```


## Authors

- **Premlata Kumari** - *Initial work* - [premlatakumari](https://github.com/premlatakumari)
