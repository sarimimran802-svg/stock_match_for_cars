# Quick Setup Guide

## Step 1: Install Dependencies

Run this command from the root directory to install all dependencies:

```bash
npm run install:all
```

Or install manually:

```bash
# Root dependencies
npm install

# Backend dependencies
cd backend
npm install

# Frontend dependencies
cd ../frontend
npm install
```

## Step 2: Initialize Database

Initialize the database with sample data:

```bash
cd backend
npm run init-db
```

This will:
- Create the SQLite database
- Set up all tables
- Add 5 sample orders for testing

## Step 3: Start the Application

### Option A: Run Both Servers Together

From the root directory:

```bash
npm run dev
```

This starts both the backend (port 3001) and frontend (port 3000) simultaneously.

### Option B: Run Servers Separately

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

## Step 4: Access the Application

Open your browser and navigate to:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001/api/health

## Testing the Application

1. Go to http://localhost:3000
2. Enter order details:
   - Order Number: `ORD-SEARCH-001`
   - Paint: `Metallic Black`
   - Fuel Type: `Petrol`
   - Derivative: `SUV`
   - Trim Code: `LUX-2024`
   - Options: Select any options you want
3. Click "Find Matching Orders"
4. You should see matching orders from the sample data

## Troubleshooting

### Database Issues
If you encounter database errors, delete the database file and reinitialize:
```bash
rm backend/data/orders.db
cd backend
npm run init-db
```

### Port Already in Use
If port 3000 or 3001 is already in use:
- Backend: Set `PORT` environment variable (e.g., `PORT=3002 npm run dev`)
- Frontend: React will automatically suggest an alternative port

### Module Not Found Errors
Make sure you've run `npm install` in all directories (root, backend, frontend).

