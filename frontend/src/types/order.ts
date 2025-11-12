export interface Order {
  id?: number;
  order_number: string;
  customer_name?: string;
  type?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
  features?: OrderFeature[];
  options?: OrderOption[];
}

export interface OrderFeature {
  id?: number;
  order_id?: number;
  feature_type: 'model' | 'paint' | 'fuel_type' | 'derivative' | 'trim_code';
  feature_value: string;
}

export interface OrderOption {
  id?: number;
  order_id?: number;
  option_name: string;
  option_value: string;
}

export interface OrderInput {
  order_number: string;
  customer_name?: string;
  status?: string;
  features: {
    model?: string;
    paint?: string;
    fuel_type?: string;
    derivative?: string;
    trim_code?: string;
  };
  options?: Record<string, string>;
}

export interface MatchResult {
  order: Order;
  match_score: number;
  matched_features: string[];
  matched_options: string[];
  missing_features: string[];
  missing_options: string[];
}

