import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import weatherService from '../services/weatherService.js';
import comfortIndexService from '../services/comfortIndexService.js';
import cache from '../config/cache.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const citiesPath = path.join(__dirname, '../../data/cities.json');

class WeatherController {
  async getWeatherDashboard(req, res) {
    try {
      // Check cache for processed data
      const cachedData = cache.get('weather_dashboard');
      if (cachedData) {
        return res.json({ 
          data: cachedData, 
          source: 'cache', 
          timestamp: new Date().toISOString() 
        });
      }

      // Read cities
      const citiesData = JSON.parse(fs.readFileSync(citiesPath, 'utf8'));
      const cities = citiesData.List;

      // Fetch weather for all cities
      // We process in parallel
      const weatherPromises = cities.map(async (city) => {
        // Check raw cache first (optional, per requirement 5)
        const cacheKey = `raw_${city.CityCode}`;
        let weather = cache.get(cacheKey);

        if (!weather) {
          weather = await weatherService.getWeather(city.CityCode);
          if (weather) {
             cache.set(cacheKey, weather); // Cache raw response
          }
        }

        if (!weather) return null;

        // Calculate Comfort Index
        const metrics = comfortIndexService.calculateComfortIndex(
          weather.main.temp,
          weather.main.humidity,
          weather.wind.speed
        );

        return {
          cityId: city.CityCode,
          name: city.CityName, // Use name from JSON or API? API is safer usually, but JSON is reliable source
          country: weather.sys.country,
          weather: {
            main: weather.weather[0].main,
            description: weather.weather[0].description,
            icon: weather.weather[0].icon
          },
          temperature: {
            current: weather.main.temp,
            feelsLike: weather.main.feels_like,
            min: weather.main.temp_min,
            max: weather.main.temp_max
          },
          humidity: weather.main.humidity,
          wind: {
             speed: weather.wind.speed,
             deg: weather.wind.deg
          },
          visibility: weather.visibility,
          comfortIndex: metrics.score,
          comfortLevel: metrics.text,
          comfortColor: metrics.color,
          comfortBreakdown: metrics.breakdown
        };
      });

      const results = await Promise.all(weatherPromises);
      
      // Filter out failed requests
      const validResults = results.filter(r => r !== null);

      // Sort by Comfort Index (Descending - Most Comfortable first)
      validResults.sort((a, b) => b.comfortIndex - a.comfortIndex);

      // Add Rank
      const rankedResults = validResults.map((item, index) => ({
        rank: index + 1,
        ...item
      }));

      // Cache the final processed result
      cache.set('weather_dashboard', rankedResults);

      res.json({ 
        data: rankedResults, 
        source: 'api',
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Controller Error:', error);
      res.status(500).json({ error: error.message });
    }
  }
}

export default new WeatherController();
