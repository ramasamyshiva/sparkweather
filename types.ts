
export interface HourlyForecast {
  time: string;
  temp: number;
  condition: string;
}

export interface DailyForecast {
  day: string;
  condition: string;
  low: number;
  high: number;
}

export interface WeatherAlert {
  title: string;
  description: string;
  severity: 'Low' | 'Moderate' | 'High' | 'Extreme';
  source: string;
}

export interface WeatherData {
  location: string;
  date: string;
  current: {
    temp: number;
    feelsLike: number;
    condition: string;
    wind: {
      speed: number;
      direction: string;
      gust?: number;
    };
    humidity: number;
    pressure: number;
    visibility: number;
    uvIndex: {
      value: number;
      description: string;
    };
    sunrise: string;
    sunset: string;
    aqi: {
      value: number;
      description: string;
    };
  };
  hourly: HourlyForecast[];
  daily: DailyForecast[];
}