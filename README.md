Internet Cafe Management System
A modern, full-stack web application for managing internet cafe operations with real-time monitoring, billing, and customer management.

🚀 Features
Core Functionality
Computer Management - Monitor PC status, usage, and availability in real-time

Customer Management - Track active sessions and customer history

Billing & Payments - Automated billing with multiple payment methods

Reporting & Analytics - Generate detailed usage and revenue reports

User Authentication - Secure role-based access control

Technical Features
Responsive Design - Works seamlessly on desktop and mobile devices

Real-time Updates - Live status monitoring and notifications

Modern UI/UX - Clean, intuitive interface with dark/light themes

Secure Authentication - JWT-based secure login system

🛠 Tech Stack
Frontend
React 18 - Modern React with hooks

TypeScript - Type-safe development

Tailwind CSS - Utility-first styling

React Router - Client-side routing

Context API - State management

Backend
Node.js & Express - Server runtime and framework

JWT - Authentication tokens

SQL Database - Data persistence

WebSocket - Real-time features

📦 Installation
Clone the repository

git clone https://github.com/alextaweke/internet-cafe-management.git
cd internet-cafe-management

Install dependencies
# Frontend
cd client
npm install

# Backend
cd ../server
npm install

Environment Setup
# Create .env files in both client and server directories
# See .env.example for required variables
Run the application 
# Development mode (runs both frontend and backend)
npm run dev

# Or run separately
# Frontend
cd client
npm start

# Backend
cd server
npm run dev
🏗 Project Structure
internet-cafe-management/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/        # Route components
│   │   ├── contexts/     # React contexts
│   │   ├── hooks/        # Custom hooks
│   │   └── utils/        # Helper functions
│   └── public/           # Static assets
├── server/               # Express backend
│   ├── controllers/      # Route controllers
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── middleware/      # Custom middleware
│   └── config/          # Database & app config
└── docs/                # Documentation
🎯 Usage
Login - Use admin credentials to access the dashboard

Manage Computers - View and manage PC stations

Start Sessions - Begin customer sessions with time tracking

Process Payments - Handle customer billing and payments

Generate Reports - View business analytics and reports

👥 Roles & Permissions
Admin - Full system access and user management

Manager - Operational management and reporting

Staff - Daily operations and customer service

🔧 Configuration
Environment Variables
env
# Frontend
REACT_APP_API_URL=http://localhost:5000
REACT_APP_APP_NAME="Internet Cafe Management"

# Backend
PORT=5000
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
📱 Screenshots
(Add your application screenshots here)

🤝 Contributing
Fork the project

Create your feature branch (git checkout -b feature/AmazingFeature)

Commit your changes (git commit -m 'Add some AmazingFeature')

Push to the branch (git push origin feature/AmazingFeature)

Open a Pull Request

📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

🐛 Bug Reports
If you discover any bugs, please create an issue on GitHub and include:

Steps to reproduce

Expected behavior

Actual behavior

Screenshots (if applicable)

💡 Future Enhancements
Mobile app for customers

Inventory management

Membership system

API documentation

Docker deployment

Multi-language support

📞 Support
For support, email your-email@example.com or create an issue in the repository.

Note: This is a demonstration project for portfolio purposes. Some features may be simulated.

🔗 Live Demo
(Add your live demo link here when deployed)

📊 Project Status
🚧 Active Development - Currently in development phase


