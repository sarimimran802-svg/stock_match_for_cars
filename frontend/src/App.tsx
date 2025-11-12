import React, { useState } from 'react';
import './App.css';
import OrderSearchForm from './components/OrderSearchForm';
import MatchResults from './components/MatchResults';
import { MatchResult } from './types/order';

function App() {
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (searchData: any) => {
    setLoading(true);
    setError(null);
    setMatches([]);

    try {
      const response = await fetch('http://localhost:3001/api/matches/find?minScore=0&limit=50', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to find matches');
      }

      const data = await response.json();
      setMatches(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Range Rover Stock Match</h1>
        <p>Find available Range Rover stock vehicles matching your specifications</p>
      </header>
      
      <main className="App-main">
        <div className="container">
          <OrderSearchForm onSearch={handleSearch} loading={loading} />
          
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          
          {matches.length > 0 && (
            <MatchResults matches={matches} />
          )}
          
          {!loading && matches.length === 0 && !error && (
            <div className="empty-state">
              <p>No matching stock vehicles found. Try adjusting your search criteria.</p>
              <p style={{marginTop: '0.5rem', fontSize: '0.9rem', color: '#999'}}>Make sure you've selected at least one feature or option above.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;

