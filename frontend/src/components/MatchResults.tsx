import React from 'react';
import './MatchResults.css';
import { MatchResult } from '../types/order';

interface MatchResultsProps {
  matches: MatchResult[];
}

const MatchResults: React.FC<MatchResultsProps> = ({ matches }) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return '#4caf50';
    if (score >= 60) return '#ff9800';
    return '#f44336';
  };

  const getFeatureLabel = (featureType: string) => {
    const labels: Record<string, string> = {
      model: 'Model',
      paint: 'Paint',
      fuel_type: 'Fuel',
      derivative: 'Derivative',
      trim_code: 'Trim'
    };
    return labels[featureType] || featureType;
  };

  const formatOptionName = (name: string) => {
    return name.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  // Calculate match statistics
  const stats = {
    total: matches.length,
    exact: matches.filter(m => m.match_score >= 90).length,
    high: matches.filter(m => m.match_score >= 70 && m.match_score < 90).length,
    medium: matches.filter(m => m.match_score >= 50 && m.match_score < 70).length,
    low: matches.filter(m => m.match_score < 50).length
  };

  return (
    <div className="match-results">
      <div className="results-header">
        <h2>Available Stock Vehicles</h2>
        <div className="match-stats">
          <div className="stat-item">
            <span className="stat-label">Total Matches:</span>
            <span className="stat-value">{stats.total}</span>
          </div>
          <div className="stat-item exact">
            <span className="stat-label">Exact (90%+):</span>
            <span className="stat-value">{stats.exact}</span>
          </div>
          <div className="stat-item high">
            <span className="stat-label">High (70-89%):</span>
            <span className="stat-value">{stats.high}</span>
          </div>
          <div className="stat-item medium">
            <span className="stat-label">Medium (50-69%):</span>
            <span className="stat-value">{stats.medium}</span>
          </div>
          <div className="stat-item low">
            <span className="stat-label">Low (&lt;50%):</span>
            <span className="stat-value">{stats.low}</span>
          </div>
        </div>
      </div>
      
      <div className="matches-grid">
        {matches.map((match, index) => {
          const stockVehicle = match.order;
          const matchedFeaturesSet = new Set(match.matched_features);
          const matchedOptionsSet = new Set(match.matched_options);

          // Get unique features by type to avoid duplicates
          const uniqueFeatures = new Map();
          stockVehicle.features?.forEach(feature => {
            if (!uniqueFeatures.has(feature.feature_type)) {
              uniqueFeatures.set(feature.feature_type, feature);
            }
          });
          const featuresArray = Array.from(uniqueFeatures.values());

          return (
            <div key={stockVehicle.id || index} className="match-card">
              <div className="card-header">
                <div className="stock-id">{stockVehicle.order_number}</div>
                <div 
                  className="match-score-badge"
                  style={{ backgroundColor: getScoreColor(match.match_score) }}
                >
                  {match.match_score}%
                </div>
              </div>

              <div className="card-body">
                <div className="quick-stats">
                  <span className="stat-badge positive">
                    {match.matched_features.length} Features
                  </span>
                  <span className="stat-badge positive">
                    {match.matched_options.length} Options
                  </span>
                  {match.missing_features.length > 0 && (
                    <span className="stat-badge negative">
                      -{match.missing_features.length} Missing
                    </span>
                  )}
                </div>

                <div className="features-section">
                  <div className="section-title">Features</div>
                  <div className="features-grid">
                    {featuresArray.map(feature => {
                      const isMatched = matchedFeaturesSet.has(feature.feature_type);
                      return (
                        <div key={feature.id || feature.feature_type} className={`feature-item ${isMatched ? 'matched' : ''}`}>
                          <span className="feature-label">{getFeatureLabel(feature.feature_type)}</span>
                          <span className="feature-value">{feature.feature_value}</span>
                          {isMatched && <span className="check-icon">✓</span>}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {stockVehicle.options && stockVehicle.options.length > 0 && (
                  <div className="options-section">
                    <div className="section-title">Options</div>
                    <div className="options-tags">
                      {stockVehicle.options.map(option => {
                        const isMatched = matchedOptionsSet.has(option.option_name);
                        return (
                          <span 
                            key={option.id || option.option_name} 
                            className={`option-tag ${isMatched ? 'matched' : ''}`}
                          >
                            {formatOptionName(option.option_name)}
                            {isMatched && <span className="check-small">✓</span>}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MatchResults;
