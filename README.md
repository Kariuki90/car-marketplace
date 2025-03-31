# Car Marketplace

A full-stack web application for buying and selling vehicles.

![CI/CD Status](https://github.com/Kariuki90/car-marketplace/actions/workflows/ci.yml/badge.svg)

## Features

- User authentication (Dealer and Car Owner roles)
- Vehicle listing management
- Advanced search and filtering
- Image upload functionality
- Real-time updates

## Tech Stack

- Frontend: React.js, Material-UI
- Backend: Node.js, Express.js
- Database: MongoDB
- Authentication: JWT

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/Kariuki90/car-marketplace.git
cd car-marketplace
```

2. Install dependencies
```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
```

3. Set up environment variables
```bash
# Copy .env.example to .env and update the values
cp .env.example .env
```

4. Start the development servers
```bash
# Start backend server (from root directory)
npm run dev

# Start frontend server (from client directory)
cd client
npm start
```

## Testing

```bash
# Run backend tests
npm test

# Run frontend tests
cd client
npm test
```

## Deployment

The application is configured for deployment on:
- Backend: Render
- Frontend: Netlify
- Database: MongoDB Atlas

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Project Structure

```
car-marketplace/
├── client/                 # React frontend
├── server/                 # Node.js backend
│   ├── config/            # Configuration files
│   ├── controllers/       # Route controllers
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   └── middleware/       # Custom middleware
└── uploads/              # Vehicle images storage
``` 