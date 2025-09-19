# 🌍 Travel Management System

A full-stack travel management system built with **ASP.NET Core** backend API and **React TypeScript** frontend. This system allows users to browse travel packages, make bookings, and provides admin functionality for managing packages and bookings.

![Travel Management System](https://img.shields.io/badge/ASP.NET%20Core-9.0-blue) ![React](https://img.shields.io/badge/React-18.2-61dafb) ![TypeScript](https://img.shields.io/badge/TypeScript-4.9-blue) ![Material-UI](https://img.shields.io/badge/Material--UI-5.15-0081cb)

## 🚀 Features

### 🎯 User Features
- **User Authentication**: Register, login, and role-based access control
- **Browse Packages**: View available travel packages with search and filter
- **Package Details**: Detailed view with booking functionality
- **Booking Management**: Create, view, and cancel bookings
- **Responsive Design**: Mobile-friendly interface

### 👨‍💼 Admin Features
- **Package Management**: Create, edit, and delete travel packages
- **Booking Oversight**: View and manage all bookings
- **User Management**: View registered users
- **Dashboard**: Analytics and statistics

### 🛠️ Technical Features
- **RESTful API**: Clean API architecture with Swagger documentation
- **JWT Authentication**: Secure token-based authentication
- **Entity Framework Core**: Code-first database approach
- **Material-UI**: Modern and responsive UI components
- **Real-time Updates**: Dynamic data updates
- **Error Handling**: Comprehensive error handling and user feedback

## 🏗️ Architecture

```
TravelManagement/
├── src/
│   ├── TravelManagement.API/          # Backend API (.NET 9)
│   │   ├── Controllers/               # API Controllers
│   │   ├── Services/                  # Business Logic Services
│   │   ├── Models/                    # DTOs and Entities
│   │   ├── Data/                      # Database Context
│   │   └── Configuration/             # AutoMapper & Config
│   └── TravelManagement.Web/          # MVC Frontend (Optional)
├── travel-frontend/                   # React Frontend
│   ├── src/
│   │   ├── components/                # Reusable Components
│   │   ├── pages/                     # Page Components
│   │   ├── services/                  # API Services
│   │   ├── types/                     # TypeScript Types
│   │   ├── hooks/                     # Custom React Hooks
│   │   └── context/                   # React Context
└── README.md
```

## 🛠️ Tech Stack

### Backend
- **Framework**: ASP.NET Core 9.0
- **Database**: SQL Server LocalDB
- **ORM**: Entity Framework Core 9.0
- **Authentication**: JWT Bearer Token
- **Documentation**: Swagger/OpenAPI
- **Mapping**: AutoMapper
- **Security**: BCrypt password hashing

### Frontend
- **Framework**: React 18.2 with TypeScript
- **UI Library**: Material-UI (MUI) 5.15
- **Routing**: React Router DOM 6.x
- **HTTP Client**: Axios
- **State Management**: React Context + Hooks
- **Form Handling**: React Hook Form
- **Notifications**: React Toastify
- **Date Handling**: date-fns

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- [.NET 9 SDK](https://dotnet.microsoft.com/download/dotnet/9.0)
- [Node.js](https://nodejs.org/) (v16 or higher)
- [SQL Server](https://www.microsoft.com/en-us/sql-server/sql-server-downloads) or SQL Server LocalDB
- [Visual Studio 2022](https://visualstudio.microsoft.com/) (recommended) or [VS Code](https://code.visualstudio.com/)
- [Git](https://git-scm.com/)

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/travel-management-system.git
cd travel-management-system
```

### 2. Backend Setup (.NET API)

```bash
# Navigate to API project
cd src/TravelManagement.API

# Restore NuGet packages
dotnet restore

# Update database connection string in appsettings.json if needed
# Default: "Server=(localdb)\\mssqllocaldb;Database=TravelManagementDB;Trusted_Connection=true"

# Create and run database migrations
dotnet ef migrations add InitialCreate
dotnet ef database update

# Run the API
dotnet run
```

The API will be available at: `https://localhost:7001`
Swagger documentation: `https://localhost:7001/swagger`

### 3. Frontend Setup (React)

```bash
# Navigate to frontend directory
cd travel-frontend

# Install dependencies
npm install

# Create environment file
echo "REACT_APP_API_BASE_URL=https://localhost:7001" > .env

# Start the development server
npm start
```

The React app will be available at: `http://localhost:3000`

## 🔧 Configuration

### Backend Configuration (appsettings.json)
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=TravelManagementDB;Trusted_Connection=true"
  },
  "JwtSettings": {
    "SecretKey": "your-super-secret-key-that-should-be-at-least-256-bits-long",
    "Issuer": "TravelManagementAPI",
    "Audience": "TravelManagementWeb",
    "ExpiryInHours": 24
  }
}
```

### Frontend Configuration (.env)
```env
REACT_APP_API_BASE_URL=https://localhost:7001
REACT_APP_API_TIMEOUT=10000
```

## 🎮 Usage

### Default Admin Account
- **Email**: admin@travel.com
- **Password**: admin123

### User Journey
1. **Register**: Create a new customer account
2. **Browse**: Explore available travel packages
3. **Search**: Filter packages by destination, price range
4. **Book**: Select a package and create a booking
5. **Manage**: View and cancel bookings from dashboard

### Admin Journey
1. **Login**: Use admin credentials
2. **Dashboard**: View system statistics
3. **Manage Packages**: Create, edit, delete travel packages
4. **Monitor Bookings**: View and update booking statuses

## 📊 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Travel Packages
- `GET /api/travelpackages` - Get all packages
- `GET /api/travelpackages/active` - Get active packages
- `GET /api/travelpackages/{id}` - Get package by ID
- `POST /api/travelpackages` - Create package (Admin)
- `PUT /api/travelpackages/{id}` - Update package (Admin)
- `DELETE /api/travelpackages/{id}` - Delete package (Admin)
- `GET /api/travelpackages/search` - Search packages

### Bookings
- `GET /api/bookings/my-bookings` - Get user bookings
- `GET /api/bookings/{id}` - Get booking by ID
- `POST /api/bookings` - Create booking
- `PUT /api/bookings/{id}/cancel` - Cancel booking
- `GET /api/bookings` - Get all bookings (Admin)

## 🗄️ Database Schema

### Tables
- **Users**: User accounts and authentication
- **TravelPackages**: Travel package information
- **Bookings**: Booking records with relationships

### Sample Data
The system includes seed data:
- Admin user account
- Sample travel packages (Paris, Tokyo)

## 📱 Screenshots

### Home Page
- Hero section with featured packages
- Search functionality
- Responsive design

### Package Details
- Detailed package information
- Booking interface
- Image gallery

### Admin Dashboard
- Statistics overview
- Package management
- Booking oversight

## 🧪 Testing

### Backend Tests
```bash
cd src/TravelManagement.API
dotnet test
```

### Frontend Tests
```bash
cd travel-frontend
npm test
```

## 📦 Deployment

### Backend Deployment
1. Publish the API project
2. Configure production database
3. Update JWT settings
4. Deploy to hosting service (Azure, AWS, etc.)

### Frontend Deployment
1. Build the React app: `npm run build`
2. Deploy build folder to static hosting (Netlify, Vercel, etc.)
3. Update API base URL for production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

## 🙏 Acknowledgments

- Material-UI for the beautiful components
- ASP.NET Core team for the excellent framework
- React team for the powerful library
- Entity Framework team for the ORM

## 📚 Additional Resources

- [ASP.NET Core Documentation](https://docs.microsoft.com/en-us/aspnet/core/)
- [React Documentation](https://reactjs.org/docs/)
- [Material-UI Documentation](https://mui.com/)
- [Entity Framework Core Documentation](https://docs.microsoft.com/en-us/ef/core/)

---

⭐ If you found this project helpful, please consider giving it a star!

## 🐛 Known Issues

- [ ] Image upload functionality needs implementation
- [ ] Email notifications not yet implemented
- [ ] Payment gateway integration pending
- [ ] Advanced reporting features in development

## 🔮 Future Enhancements

- [ ] Real-time notifications
- [ ] Multiple language support
- [ ] Mobile app version
- [ ] Advanced search filters
- [ ] Integration with payment gateways
- [ ] Email notification system
- [ ] Advanced analytics dashboard
- [ ] User reviews and ratings
- [ ] Wishlist functionality
- [ ] Social media integration
