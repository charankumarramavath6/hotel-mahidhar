# Hotel Mahi Management System

A comprehensive hotel management system with user authentication, booking management, and real-time data storage.

## Features

- **User Authentication**: Register and login with customer ID generation
- **Room Management**: Browse and book available rooms
- **Service Booking**: Add additional services to bookings
- **Staff Assignment**: Assign preferred staff to bookings
- **Payment Processing**: Secure payment handling
- **Membership System**: Join membership plans for benefits
- **Real-time Data**: Live data updates from database
- **Responsive Design**: Works on desktop and mobile devices

## Database Schema

The system includes the following main entities:

- **Hotels**: Hotel information and contact details
- **Rooms**: Room details, pricing, and availability
- **Customers**: User profiles with customer IDs
- **Staff**: Hotel staff with roles and skills
- **Bookings**: Reservation management
- **Payments**: Payment processing and tracking
- **Services**: Additional services and amenities
- **Membership**: Customer membership plans
- **Vehicles**: Customer vehicle information
- **Parking**: Parking spot management

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Backend Setup

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

For development with auto-restart:
```bash
npm run dev
```

The server will start on `http://localhost:3000`

### Database

The system uses SQLite database (`hotel_mahi.db`) which is automatically created and initialized with sample data when the server starts.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new customer
- `POST /api/auth/login` - Customer login
- `GET /api/customer/profile` - Get customer profile
- `PUT /api/customer/profile` - Update customer profile

### Rooms
- `GET /api/rooms` - Get all rooms
- `GET /api/rooms/available` - Get available rooms

### Services
- `GET /api/services` - Get all services

### Staff
- `GET /api/staff` - Get all staff

### Bookings
- `POST /api/bookings` - Create new booking
- `GET /api/bookings` - Get customer bookings

### Payments
- `POST /api/payments` - Process payment

### Membership
- `GET /api/membership/plans` - Get membership plans
- `POST /api/membership` - Create membership

## Usage

1. **Registration**: Click "Login" button to register a new account
2. **Browse Rooms**: View available rooms and their details
3. **Make Booking**: Select room, dates, and additional services
4. **Payment**: Complete payment to confirm booking
5. **Profile**: View and update your profile information

## Customer ID System

Each customer gets a unique Customer ID in the format: `CUST-{timestamp}-{random}`
- Example: `CUST-123456-789`

This ID is used for:
- Booking references
- Profile identification
- Customer support
- Membership tracking

## Technology Stack

### Backend
- Node.js with Express.js
- SQLite database
- JWT authentication
- bcryptjs for password hashing
- CORS enabled for frontend integration

### Frontend
- Vanilla JavaScript (ES6+)
- CSS Grid and Flexbox
- Single Page Application (SPA) routing
- Responsive design
- Local storage for session management

## Development

### Project Structure
```
hotel-mahi/
├── server.js              # Main server file
├── package.json           # Dependencies
├── index.html             # Frontend application
├── assets/               # Static assets
│   ├── js/
│   └── staff/
├── hotel_mahi.db         # SQLite database (auto-created)
└── README.md             # This file
```

### Adding New Features

1. **Backend**: Add new routes in `server.js`
2. **Database**: Add new tables in the `initDatabase()` function
3. **Frontend**: Add new pages in the router system
4. **API Integration**: Use the `apiCall()` helper function

## Security Features

- Password hashing with bcryptjs
- JWT token authentication
- Input validation
- SQL injection prevention
- CORS configuration

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support and questions, contact the development team at hotelmahi@hotelmahi.in

