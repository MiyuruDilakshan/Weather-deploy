import React, { useState, useEffect, useCallback } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import WeatherCard from './WeatherCard';
import TemperatureGraph from './TemperatureGraph';
import Loading from '../Layout/Loading';

const WeatherDashboard = () => {
  const [weatherData, setWeatherData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('rank');
  const [filterText, setFilterText] = useState('');
  const { getAccessTokenSilently } = useAuth0();

  const fetchWeatherData = useCallback(async () => {
    try {
      setLoading(true);
      const token = await getAccessTokenSilently();
      
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/weather`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setWeatherData(response.data.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch weather data');
      console.error('Error fetching weather:', err);
    } finally {
      setLoading(false);
    }
  }, [getAccessTokenSilently]);

  useEffect(() => {
    fetchWeatherData();
  }, [fetchWeatherData]);

  const getSortedData = () => {
    let sorted = [...weatherData];

    // Filter
    if (filterText) {
      sorted = sorted.filter(city =>
        city.name.toLowerCase().includes(filterText.toLowerCase()) ||
        city.country.toLowerCase().includes(filterText.toLowerCase())
      );
    }

    // Sort
    switch (sortBy) {
      case 'rank':
        sorted.sort((a, b) => a.rank - b.rank);
        break;
      case 'temperature':
        sorted.sort((a, b) => b.temperature.current - a.temperature.current);
        break;
      case 'name':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    return sorted;
  };

  if (loading) return <Loading />;

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
        <button
          onClick={fetchWeatherData}
          className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  const sortedData = getSortedData();

  // Clear all filters
  const clearFilters = () => {
    setFilterText('');
    setSortBy('rank');
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 pb-12 pt-6 sm:pt-8">
      {/* Left Sidebar - Filters Panel */}
      <aside className="lg:w-72 lg:sticky lg:top-28 lg:self-start">
        <div className="bg-white/90 dark:bg-gray-800/80 backdrop-blur rounded-xl border border-gray-200/60 dark:border-gray-700/60 shadow-sm p-5 sm:p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Filters & Sorting
            </h3>
            {(filterText || sortBy !== 'rank') && (
              <button
                onClick={clearFilters}
                className="text-xs text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-semibold"
              >
                Clear All
              </button>
            )}
          </div>

          <div className="space-y-5">
            {/* Search Cities */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Search Cities
              </label>
              <input
                type="text"
                list="cities-list"
                placeholder="Search..."
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400"
              />
              <datalist id="cities-list">
                {[...weatherData]
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((city) => (
                    <option key={city.cityId} value={city.name}>
                      {city.name}, {city.country}
                    </option>
                  ))}
              </datalist>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white"
              >
                <option value="rank" className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white">Comfort Rank</option>
                <option value="temperature" className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white">Temperature</option>
                <option value="name" className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white">City Name</option>
              </select>
            </div>

            {/* Refresh Button */}
            <div>
              <button
                onClick={fetchWeatherData}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold py-3 px-4 rounded-lg transition duration-200 shadow-md hover:shadow-lg"
              >
                Refresh Data
              </button>
            </div>

            {/* Stats */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <div className="font-semibold text-gray-900 dark:text-white mb-2">Statistics</div>
                <div className="text-gray-700 dark:text-gray-300">Showing {sortedData.length} of {weatherData.length} cities</div>
                {weatherData.some(city => city.fromCache) && (
                  <div className="mt-2 text-green-600 dark:text-green-400 flex items-center gap-1.5 text-sm">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Cached data</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Right Side - Main Content */}
      <main className="flex-1 min-w-0 space-y-10">
        {/* Top 3 Podium */}
        {sortBy === 'rank' && !filterText && sortedData.length >= 3 && (
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              Top 3 Most Comfortable Cities
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
              {/* 2nd Place */}
              <div className="order-2 sm:order-1">
                <div className="bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg p-3 sm:p-4 text-center sm:mt-8">
                  <div className="text-3xl sm:text-4xl mb-2 font-bold text-gray-700">2nd</div>
                  <WeatherCard city={sortedData[1]} highlight />
                </div>
              </div>

              {/* 1st Place */}
              <div className="order-1 sm:order-2">
                <div className="bg-gradient-to-br from-yellow-200 to-yellow-400 rounded-lg p-3 sm:p-4 text-center">
                  <div className="text-4xl sm:text-5xl mb-2 font-bold text-yellow-700">1st</div>
                  <WeatherCard city={sortedData[0]} highlight />
                </div>
              </div>

              {/* 3rd Place */}
              <div className="order-3 sm:order-3">
                <div className="bg-gradient-to-br from-orange-200 to-orange-300 rounded-lg p-3 sm:p-4 text-center sm:mt-16">
                  <div className="text-3xl sm:text-4xl mb-2 font-bold text-orange-700">3rd</div>
                  <WeatherCard city={sortedData[2]} highlight />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Temperature Graph */}
        {sortedData.length > 0 && (
          <div>
            <TemperatureGraph cities={sortedData} />
          </div>
        )}

        {/* Weather Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {sortedData.map((city) => (
            <WeatherCard key={city.cityId} city={city} />
          ))}
        </div>

      {sortedData.length === 0 && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          No cities match your search criteria
        </div>
      )}
      </main>
    </div>
  );
};

export default WeatherDashboard;