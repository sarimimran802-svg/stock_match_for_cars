import express from 'express';
import { matchingService } from '../services/matchingService';
import { OrderInput } from '../types/order';

export const matchRouter = express.Router();

// Find matches for an order
matchRouter.post('/find', async (req, res) => {
  try {
    const orderInput: OrderInput = req.body;
    const minScore = parseInt(req.query.minScore as string) || 0;
    const limit = parseInt(req.query.limit as string) || 20;

    // Validate that at least some features or options are provided
    const hasFeatures = orderInput.features && Object.values(orderInput.features).some(val => val);
    const hasOptions = orderInput.options && Object.values(orderInput.options).some(val => val);
    
    if (!hasFeatures && !hasOptions) {
      return res.status(400).json({ error: 'Please provide at least one feature or option' });
    }

    const matches = await matchingService.findMatches(orderInput, minScore, limit);
    res.json(matches);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

