import { useState, useEffect } from 'react';
import apiService from '../services/api';

const ConnectionTest = () => {
  const [status, setStatus] = useState('testing');
  const [hotels, setHotels] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      setStatus('testing');
      
      // Test basic connection
      const isConnected = await apiService.testConnection();
      
      if (isConnected) {
        // Try to fetch hotels
        const hotelsData = await apiService.getHotels();
        setHotels(hotelsData);
        setStatus('connected');
      } else {
        setStatus('failed');
        setError('Cannot connect to backend');
      }
    } catch (err) {
      setStatus('failed');
      setError(err.message);
    }
  };

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-bold mb-2">Backend Connection Status</h3>
      
      {status === 'testing' && (
        <div className="text-blue-600">🔄 Testing connection...</div>
      )}
      
      {status === 'connected' && (
        <div className="text-green-600">
          ✅ Connected to backend!
          <div className="mt-2">
            <p>Found {hotels.length} hotels in database</p>
            {hotels.slice(0, 2).map(hotel => (
              <div key={hotel.id} className="text-sm text-gray-600">
                • {hotel.name} - {hotel.city}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {status === 'failed' && (
        <div className="text-red-600">
          ❌ Connection failed: {error}
          <div className="text-sm mt-1">
            Make sure backend is running on http://localhost:8080
          </div>
        </div>
      )}
      
      <button 
        onClick={testConnection}
        className="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-sm"
      >
        Test Again
      </button>
    </div>
  );
};

export default ConnectionTest;