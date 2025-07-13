import React, { useState, useEffect } from 'react';

const ApiStatus = () => {
  const [apiUrl, setApiUrl] = useState('Checking...');
  const [status, setStatus] = useState('checking');

  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        // Get the current API URL from localStorage
        const currentUrl = localStorage.getItem('currentApiUrl');
        
        // If no URL is set yet, wait a bit and try again
        if (!currentUrl) {
          setTimeout(checkApiStatus, 1000);
          return;
        }
        
        setApiUrl(currentUrl);
        
        // Check health based on environment configuration
        const useRailway = import.meta.env.VITE_USE_RAILWAY === 'true';
        
        if (useRailway) {
          // For Railway, assume connected (no health check needed)
          setStatus('connected');
        } else {
          // For localhost, check health
          const response = await fetch(`${currentUrl}/api/health`);
          if (response.ok) {
            setStatus('connected');
          } else {
            setStatus('error');
          }
        }
      } catch (error) {
        const useRailway = import.meta.env.VITE_USE_RAILWAY === 'true';
        if (!useRailway) {
          setStatus('error');
        }
      }
    };

    // Initial check
    checkApiStatus();
    
    // Check every 30 seconds, but only if using localhost
    const interval = setInterval(() => {
      const useRailway = import.meta.env.VITE_USE_RAILWAY === 'true';
      if (!useRailway) {
        checkApiStatus();
      }
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // Don't show anything if using Railway
  const useRailway = import.meta.env.VITE_USE_RAILWAY === 'true';
  if (useRailway) {
    return null;
  }

  // Only show in development
  if (import.meta.env.PROD) {
    return null;
  }

  const getStatusColor = () => {
    switch (status) {
      case 'connected':
        return 'text-green-600 bg-green-100';
      case 'error':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-yellow-600 bg-yellow-100';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'connected':
        return 'Connected';
      case 'error':
        return 'Error';
      default:
        return 'Checking...';
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className={`px-3 py-2 rounded-lg text-xs font-mono shadow-lg ${getStatusColor()}`}>
        <div className="font-semibold">API: {getStatusText()}</div>
        <div className="text-xs opacity-75 truncate max-w-xs">
          {apiUrl.replace(/^https?:\/\//, '')}
        </div>
      </div>
    </div>
  );
};

export default ApiStatus; 