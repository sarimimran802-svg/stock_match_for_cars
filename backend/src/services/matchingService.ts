import { Order, OrderInput, MatchResult } from '../types/order';
import { db } from '../database/db';

export class MatchingService {
  /**
   * Calculate match score between two orders
   * Features are weighted more heavily than options
   */
  private calculateMatchScore(
    targetOrder: OrderInput,
    candidateOrder: Order,
    featureWeights: Record<string, number> = {
      model: 35,
      paint: 20,
      fuel_type: 25,
      derivative: 20,
      trim_code: 15
    }
  ): MatchResult {
    let score = 0;
    const matchedFeatures: string[] = [];
    const missingFeatures: string[] = [];
    const matchedOptions: string[] = [];
    const missingOptions: string[] = [];

    // Match features (higher weight)
    const targetFeatures = targetOrder.features || {};
    const candidateFeatures = candidateOrder.features || [];
    
    // Count total features selected and calculate max possible score for selected features
    const selectedFeatures = Object.entries(targetFeatures).filter(([_, val]) => val);
    const totalFeaturesSelected = selectedFeatures.length;
    const maxFeatureScore = selectedFeatures.reduce((sum, [featureType, _]) => {
      return sum + (featureWeights[featureType] || 20);
    }, 0);
    let rawFeatureScore = 0;

    for (const [featureType, targetValue] of Object.entries(targetFeatures)) {
      if (!targetValue) continue;

      const candidateFeature = candidateFeatures.find(
        f => f.feature_type === featureType
      );

      if (candidateFeature && candidateFeature.feature_value === targetValue) {
        const weight = featureWeights[featureType] || 20;
        rawFeatureScore += weight;
        matchedFeatures.push(featureType);
      } else if (candidateFeature) {
        // Feature exists but doesn't match
        missingFeatures.push(featureType);
      } else {
        // Feature not found in candidate
        missingFeatures.push(featureType);
      }
    }
    
    // Match options
    const targetOptions = targetOrder.options || {};
    const candidateOptions = candidateOrder.options || [];
    const optionMap = new Map(
      candidateOptions.map(opt => [opt.option_name, opt.option_value])
    );

    let optionMatches = 0;
    let totalOptions = 0;

    for (const [optionName, targetValue] of Object.entries(targetOptions)) {
      if (!targetValue) continue;
      totalOptions++;

      const candidateValue = optionMap.get(optionName);
      if (candidateValue === targetValue) {
        optionMatches++;
        matchedOptions.push(optionName);
      } else {
        missingOptions.push(optionName);
      }
    }

    // Calculate scores
    let featureScore = 0;
    let optionScore = 0;
    
    if (totalFeaturesSelected > 0) {
      // Features are worth up to 80 points
      const featureScoreRatio = maxFeatureScore > 0 ? rawFeatureScore / maxFeatureScore : 0;
      featureScore = featureScoreRatio * 80;
    }
    
    if (totalOptions > 0) {
      // Options are worth up to 20 points
      optionScore = (optionMatches / totalOptions) * 20;
    }
    
    // If no features selected, base score entirely on options (max 100)
    if (totalFeaturesSelected === 0 && totalOptions > 0) {
      score = (optionMatches / totalOptions) * 100;
    } else {
      // Combine feature and option scores
      score = featureScore + optionScore;
    }

    return {
      order: candidateOrder,
      match_score: Math.round(score),
      matched_features: matchedFeatures,
      matched_options: matchedOptions,
      missing_features: missingFeatures,
      missing_options: missingOptions
    };
  }

  /**
   * Find available stock vehicles that match a given unfulfilled order
   */
  async findMatches(
    targetOrder: OrderInput,
    minScore: number = 50,
    limit: number = 20
  ): Promise<MatchResult[]> {
    return new Promise((resolve, reject) => {
      // Get only available stock vehicles (not orders)
      const query = `
        SELECT 
          o.*,
          GROUP_CONCAT(
            CASE 
              WHEN of.feature_type IS NOT NULL 
              THEN of.feature_type || ':' || of.feature_value 
              ELSE NULL 
            END, '|'
          ) as features,
          GROUP_CONCAT(
            CASE 
              WHEN oo.option_name IS NOT NULL 
              THEN oo.option_name || ':' || oo.option_value 
              ELSE NULL 
            END, '|'
          ) as options
        FROM orders o
        LEFT JOIN order_features of ON o.id = of.order_id
        LEFT JOIN order_options oo ON o.id = oo.order_id
        WHERE o.type = 'stock' AND o.status = 'available'
        GROUP BY o.id
      `;

      db.all(query, [], (err, rows: any[]) => {
        if (err) {
          console.error('Database query error:', err);
          reject(err);
          return;
        }
        
        console.log(`Query returned ${rows.length} stock vehicles`);

        // Parse and structure the data
        const orders: Order[] = rows.map(row => {
          const order: Order = {
            id: row.id,
            order_number: row.order_number,
            customer_name: row.customer_name,
            status: row.status,
            type: row.type,
            created_at: row.created_at,
            updated_at: row.updated_at,
            features: [],
            options: []
          };

          // Parse features
          if (row.features) {
            const featureStrings = row.features.split('|').filter(Boolean);
            order.features = featureStrings.map((fs: string) => {
              const [type, value] = fs.split(':');
              return {
                feature_type: type as any,
                feature_value: value
              };
            });
          }

          // Parse options
          if (row.options) {
            const optionStrings = row.options.split('|').filter(Boolean);
            order.options = optionStrings.map((os: string) => {
              const [name, value] = os.split(':');
              return {
                option_name: name,
                option_value: value
              };
            });
          }

          return order;
        });

        // Calculate match scores
        const matches = orders
          .map(order => this.calculateMatchScore(targetOrder, order))
          .filter(match => match.match_score >= minScore)
          .sort((a, b) => b.match_score - a.match_score)
          .slice(0, limit);

        console.log(`Found ${orders.length} stock vehicles, ${matches.length} matches above score ${minScore}`);
        resolve(matches);
      });
    });
  }
}

export const matchingService = new MatchingService();

