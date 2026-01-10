class ComfortIndexService {
  calculateComfortIndex(temperature, humidity, windSpeed) {
    // Ideal Conditions
    const IDEAL_TEMP = 22; // Celsius
    const IDEAL_HUMIDITY = 50; // Percentage
    
    // Penalties
    // 2.5 points per degree deviation from ideal temp
    const tempPenalty = Math.abs(temperature - IDEAL_TEMP) * 2.5;
    
    // 0.5 points per % deviation from ideal humidity
    const humidityPenalty = Math.abs(humidity - IDEAL_HUMIDITY) * 0.5;
    
    // 1.5 points per m/s of wind speed
    const windPenalty = windSpeed * 1.5;

    // Calculate initial score
    let score = 100 - tempPenalty - humidityPenalty - windPenalty;

    // Normalize score to be between 0 and 100
    score = Math.max(0, Math.min(100, score));

    // Determine category
    let text = 'Poor';
    let color = 'red';
    
    if (score >= 80) {
      text = 'Excellent';
      color = 'green';
    } else if (score >= 60) {
      text = 'Good';
      color = 'blue';
    } else if (score >= 40) {
      text = 'Moderate';
      color = 'yellow';
    }

    return {
      score: Math.round(score),
      text,
      color,
      breakdown: {
        temperature: Math.round(Math.max(0, 33 - tempPenalty/3)), // Distributed weight approx
        humidity: Math.round(Math.max(0, 33 - humidityPenalty/3)),
        wind: Math.round(Math.max(0, 33 - windPenalty/3)),
        visibility: 0 // Not using visibility in calculation
      }
    };
  }
}

export default new ComfortIndexService();
