import React, { useState } from 'react';
import './OrderSearchForm.css';
import { OrderInput } from '../types/order';

interface OrderSearchFormProps {
  onSearch: (data: OrderInput) => void;
  loading: boolean;
}

const RANGE_ROVER_MODELS = [
  'Range Rover',
  'Range Rover Sport',
  'Range Rover Evoque',
  'Range Rover Velar',
  'Range Rover Discovery',
  'Range Rover Discovery Sport'
];

const PAINT_OPTIONS = [
  'Santorini Black',
  'Fuji White',
  'Byron Blue',
  'Firenze Red',
  'Lantau Bronze',
  'Carpathian Grey',
  'Aurora Borealis',
  'Namib Orange'
];

const FUEL_TYPES = ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'PHEV'];
const DERIVATIVES = ['HSE', 'Autobiography', 'SV', 'S', 'Dynamic'];
const TRIM_CODES = ['LUX-2024', 'PRE-2024', 'STD-2024', 'SV-2024'];

const OrderSearchForm: React.FC<OrderSearchFormProps> = ({ onSearch, loading }) => {
  const [formData, setFormData] = useState<OrderInput>({
    order_number: '', // Keep for API but not shown
    features: {
      model: '',
      paint: '',
      fuel_type: '',
      derivative: '',
      trim_code: ''
    },
    options: {}
  });

  const handleFeatureChange = (featureType: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      features: {
        ...prev.features,
        [featureType]: value
      }
    }));
  };

  const handleOptionChange = (optionName: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      options: {
        ...prev.options,
        [optionName]: checked ? 'Yes' : ''
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if at least one feature is selected
    const hasFeatures = Object.values(formData.features).some(val => val !== '');
    const hasOptions = Object.values(formData.options || {}).some(val => val !== '');
    
    if (!hasFeatures && !hasOptions) {
      alert('Please select at least one feature or option');
      return;
    }
    
    // Generate a temporary order number for the API
    const searchData = {
      ...formData,
      order_number: `SEARCH-${Date.now()}`
    };
    
    onSearch(searchData);
  };

  return (
    <div className="search-form-container">
      <form onSubmit={handleSubmit} className="search-form">
        <h2>Find Available Range Rover Stock</h2>
        <p className="form-description">Enter the Range Rover specifications you're looking for, and we'll find matching available stock vehicles.</p>
        
        <div className="form-section">
          <h3>Required Features</h3>
          <p className="section-description">Select the features you need:</p>
          
          <div className="feature-group">
            <label className="feature-label">Range Rover Model</label>
            <div className="radio-group">
              {RANGE_ROVER_MODELS.map(model => (
                <label key={model} className="radio-option">
                  <input
                    type="radio"
                    name="model"
                    value={model}
                    checked={formData.features.model === model}
                    onChange={(e) => handleFeatureChange('model', e.target.value)}
                  />
                  <span>{model}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="feature-group">
            <label className="feature-label">Paint Color</label>
            <div className="radio-group">
              {PAINT_OPTIONS.map(paint => (
                <label key={paint} className="radio-option">
                  <input
                    type="radio"
                    name="paint"
                    value={paint}
                    checked={formData.features.paint === paint}
                    onChange={(e) => handleFeatureChange('paint', e.target.value)}
                  />
                  <span>{paint}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="feature-group">
            <label className="feature-label">Fuel Type</label>
            <div className="radio-group">
              {FUEL_TYPES.map(fuel => (
                <label key={fuel} className="radio-option">
                  <input
                    type="radio"
                    name="fuel_type"
                    value={fuel}
                    checked={formData.features.fuel_type === fuel}
                    onChange={(e) => handleFeatureChange('fuel_type', e.target.value)}
                  />
                  <span>{fuel}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="feature-group">
            <label className="feature-label">Derivative</label>
            <div className="radio-group">
              {DERIVATIVES.map(derivative => (
                <label key={derivative} className="radio-option">
                  <input
                    type="radio"
                    name="derivative"
                    value={derivative}
                    checked={formData.features.derivative === derivative}
                    onChange={(e) => handleFeatureChange('derivative', e.target.value)}
                  />
                  <span>{derivative}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="feature-group">
            <label className="feature-label">Trim Code</label>
            <div className="radio-group">
              {TRIM_CODES.map(trim => (
                <label key={trim} className="radio-option">
                  <input
                    type="radio"
                    name="trim_code"
                    value={trim}
                    checked={formData.features.trim_code === trim}
                    onChange={(e) => handleFeatureChange('trim_code', e.target.value)}
                  />
                  <span>{trim}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Desired Options</h3>
          <p className="section-description">Check the options that are required:</p>
          <div className="options-grid">
            <label className="checkbox-option">
              <input
                type="checkbox"
                checked={formData.options?.pano_roof === 'Yes'}
                onChange={(e) => handleOptionChange('pano_roof', e.target.checked)}
              />
              <span>Panoramic Roof</span>
            </label>
            <label className="checkbox-option">
              <input
                type="checkbox"
                checked={formData.options?.heated_seats === 'Yes'}
                onChange={(e) => handleOptionChange('heated_seats', e.target.checked)}
              />
              <span>Heated Seats</span>
            </label>
            <label className="checkbox-option">
              <input
                type="checkbox"
                checked={formData.options?.navigation === 'Yes'}
                onChange={(e) => handleOptionChange('navigation', e.target.checked)}
              />
              <span>Navigation System</span>
            </label>
            <label className="checkbox-option">
              <input
                type="checkbox"
                checked={formData.options?.leather_seats === 'Yes'}
                onChange={(e) => handleOptionChange('leather_seats', e.target.checked)}
              />
              <span>Premium Leather Seats</span>
            </label>
            <label className="checkbox-option">
              <input
                type="checkbox"
                checked={formData.options?.air_suspension === 'Yes'}
                onChange={(e) => handleOptionChange('air_suspension', e.target.checked)}
              />
              <span>Air Suspension</span>
            </label>
            <label className="checkbox-option">
              <input
                type="checkbox"
                checked={formData.options?.parking_sensors === 'Yes'}
                onChange={(e) => handleOptionChange('parking_sensors', e.target.checked)}
              />
              <span>Parking Sensors</span>
            </label>
            <label className="checkbox-option">
              <input
                type="checkbox"
                checked={formData.options?.adaptive_cruise === 'Yes'}
                onChange={(e) => handleOptionChange('adaptive_cruise', e.target.checked)}
              />
              <span>Adaptive Cruise Control</span>
            </label>
            <label className="checkbox-option">
              <input
                type="checkbox"
                checked={formData.options?.meridian_sound === 'Yes'}
                onChange={(e) => handleOptionChange('meridian_sound', e.target.checked)}
              />
              <span>Meridian Sound System</span>
            </label>
            <label className="checkbox-option">
              <input
                type="checkbox"
                checked={formData.options?.terrain_response === 'Yes'}
                onChange={(e) => handleOptionChange('terrain_response', e.target.checked)}
              />
              <span>Terrain Response</span>
            </label>
            <label className="checkbox-option">
              <input
                type="checkbox"
                checked={formData.options?.tow_pack === 'Yes'}
                onChange={(e) => handleOptionChange('tow_pack', e.target.checked)}
              />
              <span>Towing Package</span>
            </label>
          </div>
        </div>

        <button type="submit" className="search-button" disabled={loading}>
          {loading ? 'Searching Stock...' : 'Find Available Stock Vehicles'}
        </button>
      </form>
    </div>
  );
};

export default OrderSearchForm;
