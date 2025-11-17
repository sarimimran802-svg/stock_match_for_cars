import express from 'express';
import { orderService } from '../services/orderService';
import { OrderInput } from '../types/order';

export const orderRouter = express.Router();

// Get all orders
orderRouter.get('/', async (req, res) => {
  try {
    const orders = await orderService.getAllOrders();
    res.json(orders);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get order by number
orderRouter.get('/:orderNumber', async (req, res) => {
  try {
    const order = await orderService.getOrderByNumber(req.params.orderNumber);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create new order
orderRouter.post('/', async (req, res) => {
  try {
    const orderInput: OrderInput = req.body;
    
    // Validate required fields
    if (!orderInput.order_number) {
      return res.status(400).json({ error: 'order_number is required' });
    }

    if (!orderInput.features) {
      return res.status(400).json({ error: 'features are required' });
    }

    const order = await orderService.createOrder(orderInput);
    res.status(201).json(order);
  } catch (error: any) {
    if (error.message.includes('UNIQUE constraint')) {
      return res.status(409).json({ error: 'Order number already exists' });
    }
    res.status(500).json({ error: error.message });
  }
});

