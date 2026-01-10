import axios from 'axios';

class WeatherService {
  constructor() {
    this.baseURL = 'https://api.openweathermap.org/data/2.5/weather';
  }

  // Get API key when needed (not in constructor)
  getApiKey() {
    return process.env.WEATHER_API_KEY;
  }

  async getWeather(cityId) {
    try {
      const response = await axios.get(this.baseURL, {
        params: {
          id: cityId,
          appid: this.getApiKey(),
          units: 'metric',
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Weather API Error for cityId ${cityId}:`, error.message);
      // Return null or throw - returning null allows Promise.all to continue for other cities if handled
      return null;
    }
  }

  async getWeatherByCoords(lat, lon) {
    try {
      const response = await axios.get(this.baseURL, {
        params: {
          lat,
          lon,
          appid: this.getApiKey(),
          units: 'metric',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Weather API Error:', error.message);
      throw new Error('Failed to fetch weather data');
    }
  }
}

export default new WeatherService();
