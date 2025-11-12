import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';

const DATA_DIR = path.join(__dirname, '../../data');
const DB_PATH = path.join(DATA_DIR, 'orders.db');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

export const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database');
  }
});

export const initDatabase = () => {
  return new Promise<void>((resolve, reject) => {
    db.serialize(() => {
      // Orders/Stock table (can be either an unfulfilled order or available stock vehicle)
      db.run(`
        CREATE TABLE IF NOT EXISTS orders (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          order_number TEXT UNIQUE NOT NULL,
          customer_name TEXT,
          type TEXT DEFAULT 'order',
          status TEXT DEFAULT 'unfulfilled',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Features table (paint, fuel_type, derivative, trim_code)
      db.run(`
        CREATE TABLE IF NOT EXISTS order_features (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          order_id INTEGER NOT NULL,
          feature_type TEXT NOT NULL,
          feature_value TEXT NOT NULL,
          FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
          UNIQUE(order_id, feature_type)
        )
      `);

      // Options table (pano_roof, heated_seats, etc.)
      db.run(`
        CREATE TABLE IF NOT EXISTS order_options (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          order_id INTEGER NOT NULL,
          option_name TEXT NOT NULL,
          option_value TEXT NOT NULL,
          FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
          UNIQUE(order_id, option_name)
        )
      `);

      // Create indexes for better query performance
      db.run(`CREATE INDEX IF NOT EXISTS idx_order_features_type ON order_features(feature_type, feature_value)`);
      db.run(`CREATE INDEX IF NOT EXISTS idx_order_options_name ON order_options(option_name, option_value)`);
      
      // Add type column if it doesn't exist (migration for existing databases)
      db.run(`
        ALTER TABLE orders ADD COLUMN type TEXT DEFAULT 'order'
      `, (err) => {
        // Ignore error if column already exists
        if (err && !err.message.includes('duplicate column')) {
          console.warn('Migration warning:', err.message);
        }
      });
      
      resolve();
    });
  });
};

