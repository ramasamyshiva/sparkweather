import React, { useState, useEffect, useCallback } from 'react';
import { WeatherData } from './types';
import { fetchWeatherData } from './services/geminiService';

// Repurposing component files to fit the new design due to platform constraints
import LeftSidebar from './components/Header';       // Was Header.tsx
import Dashboard from './components/CurrentWeather';   // Was CurrentWeather.tsx
import RightSidebar from './components/TodaysHighlights'; // Was TodaysHighlights.tsx
import ApiModal from './components/ApiModal';
import ErrorModal from './components/ErrorModal';

const App: React.FC = () => {
  const [location, setLocation] = useState<string>('London');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isApiModalOpen, setIsApiModalOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    // Set initial theme based on saved preference, or system preference, defaulting to dark.
    setTheme(savedTheme || (prefersDark ? 'dark' : 'light'));
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'dark' ? 'light' : 'dark'));
  };
  
  const getWeatherData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Hardcoding 7 days forecast as the new UI doesn't have a selector.
      const data = await fetchWeatherData(location, 7);
      setWeatherData(data);
    } catch (err) {
      setError((err as Error).message || 'An unknown error occurred.');
      setWeatherData(null);
    } finally {
      setIsLoading(false);
    }
  }, [location]);

  useEffect(() => {
    getWeatherData();
  }, [getWeatherData]);
  
  const handleRetry = () => {
    setError(null);
    getWeatherData();
  };

  return (
    <>
      <div className="bg-gray-100 dark:bg-[#181818] text-gray-900 dark:text-gray-300 min-h-screen flex font-sans">
        <LeftSidebar theme={theme} onToggleTheme={toggleTheme} />
        <main className="flex-1 p-6 overflow-y-auto">
          {isLoading && (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-orange-500"></div>
            </div>
          )}
          
          {weatherData && !isLoading && !error && (
              <Dashboard 
                weatherData={weatherData} 
                onOpenApiModal={() => setIsApiModalOpen(true)}
                onLocationChange={setLocation}
              />
          )}
        </main>
        <RightSidebar />
      </div>

      {error && <ErrorModal message={error} onRetry={handleRetry} />}

      <ApiModal 
        isOpen={isApiModalOpen} 
        onClose={() => setIsApiModalOpen(false)} 
        data={weatherData} 
      />
    </>
  );
};

export default App;