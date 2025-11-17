# Stock Match Solution for Car Orders

A web application that helps retailers find matching orders for unfulfilled car orders. This solution is designed for orders that are having difficulty being fulfilled due to part delays, modifications, or other issues.

## Features

- **Feature Matching**: Match orders based on paint color, fuel type, derivative, and trim code
- **Option Matching**: Match orders based on various options like panoramic roof, heated seats, navigation, leather seats, etc.
- **Smart Scoring**: Orders are scored based on how closely they match, with features weighted more heavily than options
- **Visual Results**: Beautiful, modern UI that displays match scores and detailed comparison

## Tech Stack

- **Frontend**: React with TypeScript
- **Backend**: Node.js with Express and TypeScript
- **Database**: SQLite (can be easily upgraded to PostgreSQL)

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install all dependencies:
```bash
npm run install:all
```

2. Initialize the database with sample data:
```bash
cd backend
npm run init-db
```

3. Start the development servers:
```bash
npm run dev
```

This will start:
- Backend API server on `http://localhost:3001`
- Frontend React app on `http://localhost:3000`

### Manual Setup

If you prefer to run them separately:

**Backend:**
```bash
cd backend
npm install
npm run init-db
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
npm start
```

## Usage

1. Open the web application in your browser (usually `http://localhost:3000`)
2. Enter the order details you're looking to match:
   - Order number (required)
   - Customer name (optional)
   - Features: Paint, Fuel Type, Derivative, Trim Code
   - Options: Panoramic Roof, Heated Seats, Navigation, Leather Seats
3. Click "Find Matching Orders"
4. Review the results sorted by match score (highest first)

## API Endpoints

### Orders
- `GET /api/orders` - Get all orders
- `GET /api/orders/:orderNumber` - Get order by number
- `POST /api/orders` - Create a new order

### Matches
- `POST /api/matches/find` - Find matching orders
  - Query parameters:
    - `minScore` (default: 50) - Minimum match score
    - `limit` (default: 20) - Maximum number of results
  - Body: OrderInput object with order details

## Matching Algorithm

The matching algorithm scores orders based on:

- **Features** (weighted 20-30 points each):
  - Paint: 25 points
  - Fuel Type: 30 points
  - Derivative: 25 points
  - Trim Code: 20 points

- **Options** (weighted up to 20 points total):
  - Each matching option contributes proportionally
  - Maximum 20 points for all options combined

Orders are sorted by match score (highest first) and only results above the minimum score threshold are returned.

## Project Structure

```
stock_match_for_cars/
├── backend/
│   ├── src/
│   │   ├── database/      # Database setup and connection
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic (matching, orders)
│   │   ├── types/          # TypeScript type definitions
│   │   └── scripts/        # Database initialization script
│   └── data/               # SQLite database files
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── types/          # TypeScript type definitions
│   │   └── App.tsx         # Main app component
│   └── public/             # Static files
└── README.md
```

## License

ISC
