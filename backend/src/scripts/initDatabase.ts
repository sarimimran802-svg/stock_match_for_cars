import { initDatabase, db } from '../database/db';
import { orderService } from '../services/orderService';

async function initializeDatabase() {
  try {
    await initDatabase();
    console.log('Database initialized successfully');

    // Add sample unfulfilled orders
    const sampleOrders = [
      {
        order_number: 'ORD-001',
        customer_name: 'John Smith',
        type: 'order',
        status: 'unfulfilled',
        features: {
          model: 'Range Rover',
          paint: 'Santorini Black',
          fuel_type: 'Petrol',
          derivative: 'HSE',
          trim_code: 'LUX-2024'
        },
        options: {
          pano_roof: 'Yes',
          heated_seats: 'Yes',
          navigation: 'Yes',
          leather_seats: 'Yes'
        }
      },
      {
        order_number: 'ORD-002',
        customer_name: 'Sarah Johnson',
        type: 'order',
        status: 'unfulfilled',
        features: {
          model: 'Range Rover Sport',
          paint: 'Fuji White',
          fuel_type: 'Electric',
          derivative: 'Autobiography',
          trim_code: 'PRE-2024'
        },
        options: {
          pano_roof: 'No',
          heated_seats: 'Yes',
          navigation: 'Yes',
          leather_seats: 'No'
        }
      }
    ];

    console.log('Adding sample orders...');
    for (const order of sampleOrders) {
      try {
        await orderService.createOrder(order);
        console.log(`Created order: ${order.order_number}`);
      } catch (error: any) {
        if (error.message.includes('UNIQUE constraint')) {
          console.log(`Order ${order.order_number} already exists, skipping...`);
        } else {
          throw error;
        }
      }
    }

    // Add sample available Range Rover stock vehicles
    const sampleStock = [
      {
        order_number: 'STOCK-001',
        customer_name: null,
        type: 'stock',
        status: 'available',
        features: {
          model: 'Range Rover',
          paint: 'Santorini Black',
          fuel_type: 'Petrol',
          derivative: 'HSE',
          trim_code: 'LUX-2024'
        },
        options: {
          pano_roof: 'Yes',
          heated_seats: 'Yes',
          navigation: 'Yes',
          leather_seats: 'Yes',
          air_suspension: 'Yes',
          parking_sensors: 'Yes'
        }
      },
      {
        order_number: 'STOCK-002',
        customer_name: null,
        type: 'stock',
        status: 'available',
        features: {
          model: 'Range Rover',
          paint: 'Santorini Black',
          fuel_type: 'Petrol',
          derivative: 'HSE',
          trim_code: 'LUX-2024'
        },
        options: {
          pano_roof: 'Yes',
          heated_seats: 'Yes',
          navigation: 'No',
          leather_seats: 'Yes',
          air_suspension: 'Yes'
        }
      },
      {
        order_number: 'STOCK-003',
        customer_name: null,
        type: 'stock',
        status: 'available',
        features: {
          model: 'Range Rover Sport',
          paint: 'Fuji White',
          fuel_type: 'Electric',
          derivative: 'Autobiography',
          trim_code: 'PRE-2024'
        },
        options: {
          pano_roof: 'No',
          heated_seats: 'Yes',
          navigation: 'Yes',
          leather_seats: 'No',
          meridian_sound: 'Yes'
        }
      },
      {
        order_number: 'STOCK-004',
        customer_name: null,
        type: 'stock',
        status: 'available',
        features: {
          model: 'Range Rover Evoque',
          paint: 'Byron Blue',
          fuel_type: 'Hybrid',
          derivative: 'Dynamic',
          trim_code: 'STD-2024'
        },
        options: {
          pano_roof: 'No',
          heated_seats: 'No',
          navigation: 'Yes',
          leather_seats: 'No',
          parking_sensors: 'Yes'
        }
      },
      {
        order_number: 'STOCK-005',
        customer_name: null,
        type: 'stock',
        status: 'available',
        features: {
          model: 'Range Rover',
          paint: 'Santorini Black',
          fuel_type: 'Petrol',
          derivative: 'HSE',
          trim_code: 'LUX-2024'
        },
        options: {
          pano_roof: 'Yes',
          heated_seats: 'Yes',
          navigation: 'Yes',
          leather_seats: 'No',
          adaptive_cruise: 'Yes',
          terrain_response: 'Yes'
        }
      },
      {
        order_number: 'STOCK-006',
        customer_name: null,
        type: 'stock',
        status: 'available',
        features: {
          model: 'Range Rover Velar',
          paint: 'Firenze Red',
          fuel_type: 'PHEV',
          derivative: 'SV',
          trim_code: 'SV-2024'
        },
        options: {
          pano_roof: 'Yes',
          heated_seats: 'Yes',
          navigation: 'Yes',
          leather_seats: 'Yes',
          meridian_sound: 'Yes',
          air_suspension: 'Yes'
        }
      },
      {
        order_number: 'STOCK-007',
        customer_name: null,
        type: 'stock',
        status: 'available',
        features: {
          model: 'Range Rover Discovery',
          paint: 'Carpathian Grey',
          fuel_type: 'Diesel',
          derivative: 'HSE',
          trim_code: 'STD-2024'
        },
        options: {
          pano_roof: 'No',
          heated_seats: 'Yes',
          navigation: 'Yes',
          leather_seats: 'Yes',
          tow_pack: 'Yes',
          terrain_response: 'Yes'
        }
      },
      {
        order_number: 'STOCK-008',
        customer_name: null,
        type: 'stock',
        status: 'available',
        features: {
          model: 'Range Rover Sport',
          paint: 'Lantau Bronze',
          fuel_type: 'Petrol',
          derivative: 'S',
          trim_code: 'PRE-2024'
        },
        options: {
          pano_roof: 'Yes',
          heated_seats: 'Yes',
          navigation: 'Yes',
          leather_seats: 'Yes',
          adaptive_cruise: 'Yes',
          meridian_sound: 'Yes'
        }
      },
      {
        order_number: 'STOCK-009',
        customer_name: null,
        type: 'stock',
        status: 'available',
        features: {
          model: 'Range Rover',
          paint: 'Aurora Borealis',
          fuel_type: 'Hybrid',
          derivative: 'Autobiography',
          trim_code: 'LUX-2024'
        },
        options: {
          pano_roof: 'Yes',
          heated_seats: 'Yes',
          navigation: 'Yes',
          leather_seats: 'Yes',
          air_suspension: 'Yes',
          meridian_sound: 'Yes',
          terrain_response: 'Yes'
        }
      },
      {
        order_number: 'STOCK-010',
        customer_name: null,
        type: 'stock',
        status: 'available',
        features: {
          model: 'Range Rover Discovery Sport',
          paint: 'Namib Orange',
          fuel_type: 'Diesel',
          derivative: 'HSE',
          trim_code: 'STD-2024'
        },
        options: {
          pano_roof: 'No',
          heated_seats: 'Yes',
          navigation: 'Yes',
          leather_seats: 'No',
          parking_sensors: 'Yes'
        }
      }
    ];

    console.log('Adding sample Range Rover stock vehicles...');
    for (const stock of sampleStock) {
      try {
        await orderService.createOrder(stock);
        console.log(`Created stock: ${stock.order_number}`);
      } catch (error: any) {
        if (error.message.includes('UNIQUE constraint')) {
          console.log(`Stock ${stock.order_number} already exists, skipping...`);
        } else {
          throw error;
        }
      }
    }

    console.log('Database initialization complete!');
    db.close();
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

initializeDatabase();
