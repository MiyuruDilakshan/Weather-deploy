import React from 'react';

const TemperatureGraph = ({ cities }) => {
  // Find the highest and lowest temperatures to scale the graph
  const temps = cities.map(city => city.temperature.current);
  const maxTemp = Math.max(...temps);
  const minTemp = Math.min(...temps);
  const tempRange = maxTemp - minTemp;

  const formatTemp = (temp) => Math.round(Number(temp));

  // Calculate how tall each bar should be (as percentage)
  const getBarHeight = (temp) => {
    if (tempRange === 0) return 50; // If all temps are same, show 50%
    return ((temp - minTemp) / tempRange) * 100;
  };

  // Get color based on temperature
  const getBarColor = (temp) => {
    if (temp > 30) return 'bg-red-500'; // Hot
    if (temp > 20) return 'bg-orange-400'; // Warm
    if (temp > 10) return 'bg-yellow-400'; // Mild
    if (temp > 0) return 'bg-blue-400'; // Cool
    return 'bg-blue-600'; // Cold
  };

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-lg shadow-lg p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white mb-2 sm:mb-0">
          Temperature Comparison
        </h2>
        <div className="flex gap-3 text-xs sm:text-sm">
          <div className="text-center">
            <div className="text-red-500 font-bold">{formatTemp(maxTemp)}°C</div>
            <div className="text-gray-500 dark:text-gray-400">Highest</div>
          </div>
          <div className="text-center">
            <div className="text-blue-500 font-bold">{formatTemp(minTemp)}°C</div>
            <div className="text-gray-500 dark:text-gray-400">Lowest</div>
          </div>
          <div className="text-center">
            <div className="text-purple-500 font-bold">{formatTemp((maxTemp + minTemp) / 2)}°C</div>
            <div className="text-gray-500 dark:text-gray-400">Average</div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-4 mb-4">
        <div className="flex items-end justify-between gap-1 sm:gap-2 h-52 sm:h-72">
          {cities.map((city) => {
            const height = getBarHeight(city.temperature.current);
            const colorClass = getBarColor(city.temperature.current);

            return (
              <div key={city.cityId} className="flex-1 flex flex-col items-center min-w-0 group">
                {/* Temperature value on top of bar */}
                <div className="text-[10px] sm:text-xs font-bold text-gray-700 dark:text-gray-300 mb-1 group-hover:scale-110 transition-transform">
                  {formatTemp(city.temperature.current)}°
                </div>

                {/* Temperature bar */}
                <div
                  className={`w-full ${colorClass} rounded-t-lg shadow-md transition-all duration-300 hover:shadow-xl hover:brightness-110 cursor-pointer`}
                  style={{ height: `${height}%`, minHeight: '20px' }}
                  title={`${city.name}: ${formatTemp(city.temperature.current)}°C`}
                ></div>

                {/* City name below bar */}
                <div className="text-[9px] sm:text-xs font-medium text-gray-600 dark:text-gray-400 mt-1 sm:mt-2 text-center break-words overflow-hidden w-full group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {city.name.length > 7 ? city.name.substring(0, 6) + '.' : city.name}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 sm:p-4">
        <div className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 text-center">Temperature Ranges</div>
        <div className="flex flex-wrap justify-center gap-2 sm:gap-4 text-[10px] sm:text-xs text-gray-600 dark:text-gray-400">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-red-500 rounded"></div>
          <span>&gt;30°C Hot</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-orange-400 rounded"></div>
          <span>20-30°C Warm</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-yellow-400 rounded"></div>
          <span>10-20°C Mild</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-blue-400 rounded"></div>
          <span>0-10°C Cool</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-blue-600 rounded"></div>
          <span>&lt;0°C Cold</span>
        </div>
        </div>
      </div>
    </div>
  );
};

export default TemperatureGraph;
