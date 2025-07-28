# 📚 Book Club Library Management System

<div align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
</div>

<div align="center">
  <h3>🌟 A Modern Full-Stack Library Management Solution for Book Club Library, Colombo, Sri Lanka</h3>
  <p>Efficiently manage books, readers, and lending processes with a robust digital platform</p>
</div>

---

## 🎯 Overview

Book Club Library is a comprehensive web application designed specifically for the newly established Book Club Library in Colombo, Sri Lanka. This full-stack solution streamlines library operations by providing digital tools for managing books, readers, and lending processes with modern web technologies.

## ✨ Key Features

### 📖 **Core Management Systems**
- **Reader Management**: Complete CRUD operations for library members
- **Book Catalog**: Comprehensive book inventory management
- **Lending System**: Track book loans and returns with due date calculations
- **Overdue Management**: Monitor and manage overdue books with notifications

### 🔐 **Security & Authentication**
- JWT-based authentication and authorization
- Secure password management with bcrypt
- Role-based access control for library staff

### 📧 **Notification System**
- Email notifications for overdue books using Nodemailer
- Automated reminder system for library members

### 📊 **Additional Features**
- **Audit Logging**: Track all system activities for accountability
- **Search & Filter**: Advanced search capabilities for books and readers
- **Responsive Design**: Mobile-friendly interface built with Tailwind CSS
- **Dashboard Analytics**: Overview of library statistics and activities

## 🛠️ Technology Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18, TypeScript, Tailwind CSS |
| **Backend** | Node.js, Express.js, TypeScript |
| **Database** | MongoDB with Mongoose ODM |
| **Authentication** | JWT (JSON Web Tokens) |
| **Email Service** | Nodemailer |
| **Development** | Nodemon, Vite |
| **Security** | bcrypt for password hashing |

## 📁 Project Structure

```
Book-Club-Library/
├── client/                    # Frontend (React + TypeScript)
│   ├── public/
│   ├── src/
│   │   ├── assets/           # Static assets
│   │   ├── components/       # Reusable React components
│   │   ├── context/          # React context providers
│   │   ├── pages/            # Page components
│   │   ├── services/         # API service functions
│   │   ├── types/            # TypeScript type definitions
│   │   ├── App.tsx           # Main App component
│   │   ├── App.css           # Global styles
│   │   ├── index.css         # Tailwind CSS imports
│   │   ├── main.tsx          # React entry point
│   │   └── router.tsx        # Application routing
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── README.md
│   ├── tsconfig.app.json
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   └── vite.config.ts        # Vite configuration
│
├── server/                   # Backend (Node.js + TypeScript)
│   ├── node_modules/
│   ├── src/
│   │   ├── controllers/      # Route controllers
│   │   ├── db/              # Database configuration
│   │   ├── errors/          # Error handling
│   │   ├── middlewares/     # Express middlewares
│   │   ├── models/          # MongoDB models
│   │   ├── routes/          # API routes
│   │   ├── utils/           # Utility functions
│   │   └── index.ts         # Server entry point
│   ├── .env                 # Environment variables
│   ├── nodemon.json         # Nodemon configuration
│   ├── package.json
│   ├── package-lock.json
│   └── tsconfig.json
│
└── postman/                 # API Documentation
    └── Book-Club-API.json   # Postman collection
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/book-club-library.git
   cd book-club-library
   ```

2. **Backend Setup**
   ```bash
   cd server
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the server directory:
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/book-club-library
   
   # JWT
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRES_IN=7d
   
   # Email Configuration (Nodemailer)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   
   # Server Configuration
   PORT=3000
   NODE_ENV=development
   ```

4. **Frontend Setup**
   ```bash
   cd ../client
   npm install
   ```

5. **Start Development Servers**
   
   **Backend** (Port 3000):
   ```bash
   cd server
   npm run dev
   ```
   
   **Frontend** (Port 5173):
   ```bash
   cd client
   npm run dev
   ```

## 📡 API Documentation

### 🔗 Postman Collection
Import the Postman collection for complete API documentation:
- **File**: [`postman/Book-Club-API.json`](https://github.com/Kaif-Zakey/RAD-Final-Coursework/blob/main/MERN%20WEB/server/Book_Club_Library.postman_collection.json)
- **Base URL**: `http://localhost:3000/api`

### 🛣️ Main API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| **Authentication** |
| `POST` | `/auth/login` | User login |
| `POST` | `/auth/register` | User registration |
| `POST` | `/auth/forgot-password` | Request password reset |
| **Readers** |
| `GET` | `/readers` | Get all readers |
| `POST` | `/readers` | Add new reader |
| `PUT` | `/readers/:id` | Update reader |
| `DELETE` | `/readers/:id` | Delete reader |
| **Books** |
| `GET` | `/books` | Get all books |
| `POST` | `/books` | Add new book |
| `PUT` | `/books/:id` | Update book |
| `DELETE` | `/books/:id` | Delete book |
| **Lending** |
| `GET` | `/lending` | Get lending records |
| `POST` | `/lending` | Create lending record |
| `PUT` | `/lending/:id/return` | Mark book as returned |
| `GET` | `/lending/overdue` | Get overdue books |
| `POST` | `/notifications/overdue` | Send overdue notifications |

## 🎨 Features Overview

### 👥 Reader Management
- View complete list of registered library members
- Add new readers with detailed information
- Edit existing reader profiles
- Remove readers from the system
- Search and filter functionality

### 📚 Book Management
- Comprehensive book catalog display
- Add new books to the library collection
- Edit book information and details
- Remove books from inventory
- Category-based organization

### 🔄 Lending Management
- Issue books to registered readers
- Track all lending transactions
- View complete lending history
- Process book returns
- Calculate and display due dates automatically

### ⏰ Overdue Management
- Identify readers with overdue books
- Display detailed overdue information
- Send automated email notifications
- Track overdue duration and penalties

### 🔒 Security Features
- JWT-based authentication system
- Secure password hashing with bcrypt
- Role-based access control
- Session management and token refresh

## 🎯 Core Functionalities

### Authentication Flow
1. Staff login with secure credentials
2. JWT token generation and validation
3. Protected routes and middleware
4. Session management

### Book Lending Process
1. Select reader and available book
2. Automatic due date calculation
3. Create lending record
4. Track lending status
5. Process returns and update records

### Notification System
1. Identify overdue books automatically
2. Generate email notifications
3. Send reminders to readers
4. Track notification history

## 🔧 Development

### Available Scripts

**Backend:**
```bash
npm run dev        # Start development server with nodemon
npm run build      # Build TypeScript to JavaScript
npm start          # Start production server
```

**Frontend:**
```bash
npm run dev        # Start Vite development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

### Code Style
- TypeScript for type safety
- ESLint for code linting
- Consistent naming conventions
- Modular architecture

## 🌐 Deployment

### Environment Variables
Ensure all environment variables are properly configured:
- Database connection strings
- JWT secrets
- Email service credentials
- API endpoints

### Production Build
```bash
# Backend
cd server
npm run build
npm start

# Frontend
cd client
npm run build
# Serve the dist folder with your preferred web server
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**
- GitHub: [@Kaif-Zakey](https://github.com/Kaif-Zakey)
- Email:kaifzakey22@gmail.com

## 🙏 Acknowledgments

- Book Club Library, Colombo, Sri Lanka for the project requirements
- Open source community for the amazing tools and libraries
- Contributors and testers who helped improve this application

---

<div align="center">
  <p>Made with ❤️ for Book Club Library Management</p>
  <p>© 2025 Book Club Library System. All rights reserved.</p>
</div>
