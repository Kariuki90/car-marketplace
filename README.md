# Car Marketplace

A professional marketplace platform where car dealers and owners can post their vehicles for sale.

## Features

- User authentication (Dealers and Car Owners)
- Vehicle listing management
- Advanced search and filtering
- Image upload for vehicles
- Responsive design
- Real-time updates

## Tech Stack

- Frontend: React.js, Material-UI
- Backend: Node.js, Express.js
- Database: MongoDB
- Authentication: JWT

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   cd client
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```
4. Start the development server:
   ```bash
   npm run dev:full
   ```

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