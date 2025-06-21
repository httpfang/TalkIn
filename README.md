# TalkIn - Real-Time Chat & Video Calling Platform

<div align="center">

![TalkIn Logo](fe/public/i.png)

**A modern, real-time chat and video calling application built with React, Node.js, and Stream Chat API**

[![React](https://img.shields.io/badge/React-19.0.0-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.21.0-black.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.13.2-green.svg)](https://mongodb.com/)
[![Stream Chat](https://img.shields.io/badge/Stream%20Chat-8.60.0-blue.svg)](https://getstream.io/)
[![License](https://img.shields.io/badge/License-ISC-blue.svg)](LICENSE)

[Features](#features) • [Tech Stack](#tech-stack) • [Getting Started](#getting-started) • [API Documentation](#api-documentation) • [Deployment](#deployment) • [Contributing](#contributing)

</div>

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Development](#development)
- [Testing](#testing)
- [Deployment](#deployment)
- [Security](#security)
- [Performance](#performance)
- [Contributing](#contributing)
- [License](#license)

## 🚀 Overview

TalkIn is a full-stack real-time communication platform that enables users to chat, make video calls, and manage their social connections. Built with modern web technologies, it provides a seamless user experience with real-time messaging, video calling capabilities, and a responsive design.

### Key Highlights

- **Real-time Messaging**: Instant message delivery with typing indicators
- **Video Calling**: High-quality video calls powered by Stream Video SDK
- **User Authentication**: Secure JWT-based authentication system
- **Friend Management**: Send and manage friend requests
- **Responsive Design**: Works seamlessly across all devices
- **Dark/Light Theme**: Customizable user interface themes

## ✨ Features

### Core Features
- 🔐 **User Authentication & Authorization**
  - JWT-based authentication
  - Secure password hashing with bcrypt
  - Protected routes and middleware
  - User onboarding flow

- 💬 **Real-time Chat**
  - Instant messaging with Stream Chat API
  - Typing indicators
  - Message history
  - Real-time notifications
  - File sharing capabilities

- 📹 **Video Calling**
  - High-quality video calls
  - Screen sharing
  - Call controls (mute, camera toggle)
  - Call recording (if enabled)

- 👥 **Social Features**
  - Friend request system
  - User profiles
  - Online/offline status
  - Notification system

### Technical Features
- 🎨 **Modern UI/UX**
  - Responsive design with Tailwind CSS
  - Dark/Light theme support
  - DaisyUI components
  - Smooth animations and transitions

- 🔧 **Developer Experience**
  - Hot module replacement (HMR)
  - ESLint configuration
  - Modular component architecture
  - Custom hooks for state management

## 🛠 Tech Stack

### Frontend
- **Framework**: React 19.0.0
- **Build Tool**: Vite 6.3.1
- **Styling**: Tailwind CSS 3.4.17 + DaisyUI 4.12.24
- **State Management**: Zustand 5.0.3
- **Data Fetching**: TanStack React Query 5.74.4
- **Routing**: React Router 7.5.1
- **HTTP Client**: Axios 1.8.4
- **UI Icons**: Lucide React 0.503.0
- **Notifications**: React Hot Toast 2.5.2

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js 4.21.0
- **Database**: MongoDB 8.13.2 with Mongoose
- **Authentication**: JWT 9.0.2 + bcryptjs 3.0.2
- **CORS**: cors 2.8.5
- **Environment**: dotenv 16.5.0

### Third-party Services
- **Chat API**: Stream Chat 8.60.0
- **Video SDK**: Stream Video React SDK 1.14.4
- **Development**: nodemon 3.1.9

## 🏗 Architecture

```
TalkIn/
├── fe/                    # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/        # Route components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── store/        # Zustand state management
│   │   ├── lib/          # Utility functions & API
│   │   └── constants/    # Application constants
│   └── public/           # Static assets
└── be/                   # Backend (Node.js + Express)
    ├── src/
    │   ├── controllers/  # Route handlers
    │   ├── models/       # MongoDB schemas
    │   ├── routes/       # API routes
    │   ├── middleware/   # Custom middleware
    │   └── lib/          # Database & utility functions
    └── server.js         # Entry point
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.0.0 or higher
- **npm** or **yarn** package manager
- **MongoDB** database (local or cloud)
- **Stream Chat** account and API keys

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/talkin.git
   cd talkin
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   cd be
   npm install

   # Install frontend dependencies
   cd ../fe
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Backend (.env file in be/ directory)
   cp be/.env.example be/.env
   
   # Frontend (.env file in fe/ directory)
   cp fe/.env.example fe/.env
   ```

4. **Configure environment variables** (see [Environment Variables](#environment-variables) section)

5. **Start the development servers**
   ```bash
   # Terminal 1: Start backend server
   cd be
   npm run dev

   # Terminal 2: Start frontend server
   cd fe
   npm run dev
   ```

6. **Open your browser**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000

## 🔧 Environment Variables

### Backend (.env)
```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/talkin
# or for MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/talkin

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# Stream Chat Configuration
STREAM_API_KEY=your-stream-api-key
STREAM_API_SECRET=your-stream-api-secret

# CORS Configuration
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3000/api
VITE_STREAM_API_KEY=your-stream-api-key

# Feature Flags
VITE_ENABLE_VIDEO_CALLS=true
VITE_ENABLE_FILE_SHARING=true
```

## 📚 API Documentation

### Authentication Endpoints

#### POST `/api/auth/signup`
Register a new user account.

**Request Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "user_id",
      "username": "john_doe",
      "email": "john@example.com",
      "isOnboarded": false
    },
    "token": "jwt_token_here"
  }
}
```

#### POST `/api/auth/login`
Authenticate user and get access token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

### User Endpoints

#### GET `/api/users/profile`
Get current user profile.

#### PUT `/api/users/profile`
Update user profile.

#### GET `/api/users/friends`
Get user's friends list.

#### POST `/api/users/friends/request`
Send friend request.

### Chat Endpoints

#### GET `/api/chat/channels`
Get user's chat channels.

#### POST `/api/chat/channels`
Create new chat channel.

## 📁 Project Structure

### Frontend Structure
```
fe/src/
├── components/           # Reusable UI components
│   ├── Layout.jsx       # Main layout wrapper
│   ├── Navbar.jsx       # Navigation component
│   ├── Sidebar.jsx      # Sidebar navigation
│   ├── FriendCard.jsx   # Friend display component
│   ├── ChatLoader.jsx   # Chat loading component
│   └── ThemeSelector.jsx # Theme toggle component
├── pages/               # Route components
│   ├── HomePage.jsx     # Main dashboard
│   ├── LoginPage.jsx    # Authentication page
│   ├── SignUpPage.jsx   # Registration page
│   ├── ChatPage.jsx     # Chat interface
│   ├── CallPage.jsx     # Video call interface
│   └── OnboardingPage.jsx # User onboarding
├── hooks/               # Custom React hooks
│   ├── useAuthUser.js   # Authentication hook
│   ├── useLogin.js      # Login functionality
│   └── useSignUp.js     # Registration functionality
├── store/               # State management
│   └── useThemeStore.js # Theme state
├── lib/                 # Utility functions
│   ├── api.js          # API client
│   ├── axios.js        # HTTP client configuration
│   └── utils.js        # Helper functions
└── constants/           # Application constants
    └── index.js        # Global constants
```

### Backend Structure
```
be/src/
├── controllers/         # Route handlers
│   ├── auth.controller.js    # Authentication logic
│   ├── user.controller.js    # User management
│   └── chat.controller.js    # Chat functionality
├── models/             # Database schemas
│   ├── User.js        # User model
│   └── FriendRequest.js # Friend request model
├── routes/             # API routes
│   ├── auth.route.js   # Authentication routes
│   ├── user.route.js   # User routes
│   └── chat.route.js   # Chat routes
├── middleware/         # Custom middleware
│   └── auth.middleware.js # Authentication middleware
├── lib/               # Utility functions
│   ├── db.js         # Database connection
│   └── stream.js     # Stream Chat integration
└── server.js         # Application entry point
```

## 🛠 Development

### Available Scripts

#### Backend
```bash
npm run dev          # Start development server with nodemon
npm start           # Start production server
npm test            # Run tests (to be implemented)
```

#### Frontend
```bash
npm run dev         # Start development server
npm run build       # Build for production
npm run preview     # Preview production build
npm run lint        # Run ESLint
```

### Code Style

This project follows modern JavaScript/React conventions:

- **ES6+** syntax with modules
- **Functional components** with hooks
- **Consistent naming** conventions
- **ESLint** configuration for code quality
- **Prettier** formatting (recommended)

### Git Workflow

1. Create a feature branch from `main`
2. Make your changes with descriptive commits
3. Push your branch and create a pull request
4. Ensure all tests pass and code is reviewed
5. Merge to `main` after approval

## 🧪 Testing

### Testing Strategy

- **Unit Tests**: Test individual components and functions
- **Integration Tests**: Test API endpoints and database operations
- **E2E Tests**: Test complete user workflows (to be implemented)

### Running Tests

```bash
# Backend tests
cd be
npm test

# Frontend tests (to be implemented)
cd fe
npm test
```

## 🚀 Deployment

### Production Build

#### Frontend
```bash
cd fe
npm run build
```

The build output will be in the `dist/` directory, ready for deployment.

#### Backend
```bash
cd be
npm start
```

### Deployment Options

#### Vercel (Frontend)
1. Connect your GitHub repository to Vercel
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Configure environment variables
5. Deploy

#### Railway/Heroku (Backend)
1. Connect your repository
2. Set build command: `npm install`
3. Set start command: `npm start`
4. Configure environment variables
5. Deploy

#### Docker Deployment
```dockerfile
# Frontend Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Environment Configuration

Ensure all production environment variables are properly configured:

- Database connection strings
- JWT secrets
- Stream Chat API keys
- CORS origins
- SSL certificates (if required)

## 🔒 Security

### Security Measures

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for password security
- **CORS Protection**: Configured CORS policies
- **Input Validation**: Request body validation
- **Rate Limiting**: API rate limiting (recommended)
- **HTTPS**: SSL/TLS encryption in production
- **Environment Variables**: Secure configuration management

### Security Best Practices

1. **Never commit sensitive data** to version control
2. **Use strong, unique passwords** for all services
3. **Regularly update dependencies** to patch vulnerabilities
4. **Implement rate limiting** to prevent abuse
5. **Use HTTPS** in production environments
6. **Validate all user inputs** on both client and server
7. **Implement proper error handling** without exposing sensitive information

## ⚡ Performance

### Optimization Strategies

- **Code Splitting**: Lazy loading of components
- **Bundle Optimization**: Vite's built-in optimizations
- **Image Optimization**: Compressed and optimized images
- **Caching**: Browser and CDN caching strategies
- **Database Indexing**: Optimized MongoDB queries
- **CDN**: Content delivery network for static assets

### Performance Monitoring

- **Lighthouse**: Core Web Vitals monitoring
- **Bundle Analyzer**: Bundle size analysis
- **Database Monitoring**: Query performance tracking
- **Error Tracking**: Application error monitoring

## 🤝 Contributing

We welcome contributions from the community! Please follow these guidelines:

### How to Contribute

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** with clear, descriptive commits
4. **Test your changes** thoroughly
5. **Push to your branch**: `git push origin feature/amazing-feature`
6. **Create a Pull Request** with a detailed description

### Contribution Guidelines

- **Code Style**: Follow existing code conventions
- **Documentation**: Update documentation for new features
- **Testing**: Add tests for new functionality
- **Commits**: Use conventional commit messages
- **Issues**: Report bugs and request features via GitHub issues

### Development Setup

1. Follow the [Getting Started](#getting-started) guide
2. Set up your development environment
3. Create a feature branch
4. Make your changes
5. Test thoroughly
6. Submit a pull request

## 📄 License

This project is licensed under the **ISC License** - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Stream Chat** for providing the chat and video calling infrastructure
- **React Team** for the amazing frontend framework
- **Express.js** for the robust backend framework
- **Tailwind CSS** for the utility-first CSS framework
- **Vite** for the fast build tool and development server

## 📞 Support

If you need help or have questions:

- **Documentation**: Check this README and inline code comments
- **Issues**: Create a GitHub issue for bugs or feature requests
- **Discussions**: Use GitHub Discussions for general questions
- **Email**: Contact the maintainers directly

---

<div align="center">

**Made with ❤️ by the TalkIn Team**

[![GitHub stars](https://img.shields.io/github/stars/yourusername/talkin?style=social)](https://github.com/yourusername/talkin)
[![GitHub forks](https://img.shields.io/github/forks/yourusername/talkin?style=social)](https://github.com/yourusername/talkin)
[![GitHub issues](https://img.shields.io/github/issues/yourusername/talkin)](https://github.com/yourusername/talkin/issues)

</div> 