import { GoogleGenAI, Type } from "@google/genai";
import { WeatherData, WeatherAlert } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const fetchWeatherData = async (location: string, days: number = 5): Promise<WeatherData> => {
  const weatherSchema = {
    type: Type.OBJECT,
    properties: {
      location: { type: Type.STRING, description: "The city and country, e.g., 'New York, US'" },
      date: { type: Type.STRING, description: "Current date and time in a readable format, e.g., '9 October 2025 | 06:47 PM'" },
      current: {
        type: Type.OBJECT,
        properties: {
          temp: { type: Type.NUMBER, description: "Current temperature in Celsius." },
          feelsLike: { type: Type.NUMBER, description: "The 'feels like' temperature in Celsius, accounting for wind chill and humidity." },
          condition: { type: Type.STRING, description: "A brief weather condition, e.g., 'Heavy Rain', 'Sunny', 'Partly Cloudy'." },
          wind: {
            type: Type.OBJECT,
            properties: {
              speed: { type: Type.NUMBER, description: "Wind speed in km/h." },
              direction: { type: Type.STRING, description: "Wind direction, e.g., 'Northwest'." },
              gust: { type: Type.NUMBER, description: "Wind gust speed in km/h. This is optional." }
            },
            required: ["speed", "direction"]
          },
          humidity: { type: Type.NUMBER, description: "Humidity percentage, e.g., 78." },
          pressure: { type: Type.NUMBER, description: "Atmospheric pressure in hPa, e.g., 1013." },
          visibility: { type: Type.NUMBER, description: "Visibility in km, e.g., 10." },
          uvIndex: {
            type: Type.OBJECT,
            properties: {
              value: { type: Type.NUMBER, description: "UV index value, e.g., 3." },
              description: { type: Type.STRING, description: "UV index description, e.g., 'Moderate'." }
            },
            required: ["value", "description"]
          },
          sunrise: { type: Type.STRING, description: "Sunrise time in HH:MM AM/PM format, e.g., '06:15 AM'." },
          sunset: { type: Type.STRING, description: "Sunset time in HH:MM AM/PM format, e.g., '07:30 PM'." },
          aqi: {
            type: Type.OBJECT,
            properties: {
              value: { type: Type.NUMBER, description: "Air Quality Index value." },
              description: { type: Type.STRING, description: "AQI description, e.g., 'Good', 'Moderate', 'Unhealthy'." }
            },
            required: ["value", "description"]
          }
        },
        required: ["temp", "feelsLike", "condition", "wind", "humidity", "pressure", "visibility", "uvIndex", "sunrise", "sunset", "aqi"]
      },
      hourly: {
        type: Type.ARRAY,
        description: "A 10-hour forecast starting from the next rounded hour.",
        items: {
          type: Type.OBJECT,
          properties: {
            time: { type: Type.STRING, description: "Time for the forecast, e.g., '09:00'." },
            temp: { type: Type.NUMBER, description: "Temperature in Celsius." },
            condition: { type: Type.STRING, description: "Brief weather condition for that hour." }
          },
          required: ["time", "temp", "condition"]
        }
      },
      daily: {
        type: Type.ARRAY,
        description: `A ${days}-day forecast starting from tomorrow.`,
        items: {
          type: Type.OBJECT,
          properties: {
            day: { type: Type.STRING, description: "Day and date, e.g., 'Friday, April 21'." },
            condition: { type: Type.STRING, description: "Brief weather condition for that day." },
            low: { type: Type.NUMBER, description: "Lowest temperature in Celsius." },
            high: { type: Type.NUMBER, description: "Highest temperature in Celsius." }
          },
          required: ["day", "condition", "low", "high"]
        }
      }
    },
    required: ["location", "date", "current", "hourly", "daily"]
  };

  const prompt = `Generate a realistic and current weather forecast for ${location}. Provide the current weather (including wind gusts if applicable, 'feels like' temperature, sunrise/sunset times, and Air Quality Index), a 10-hour hourly forecast starting from the next rounded hour, and a ${days}-day daily forecast. The output must be in JSON format matching the provided schema. Use Celsius for temperature and km/h for wind speed. The current date and time should be based on the location's timezone.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: weatherSchema,
      },
    });

    const jsonString = response.text;
    const data = JSON.parse(jsonString);
    return data as WeatherData;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    let errorMessage = "Failed to fetch weather data due to an unknown error.";

    if (error instanceof Error) {
      const lowerCaseMessage = error.message.toLowerCase();
      if (lowerCaseMessage.includes('api key') || lowerCaseMessage.includes('permission denied')) {
        errorMessage = "Invalid Gemini API Key. Please ensure your API key is configured correctly.";
      } else if (lowerCaseMessage.includes('fetch') || lowerCaseMessage.includes('network')) {
        errorMessage = "Network Error: Could not fetch weather data. Please check your internet connection.";
      } else if (error instanceof SyntaxError || lowerCaseMessage.includes('400')) {
        errorMessage = "Invalid Location: Could not retrieve data for the specified location. Please try a different one.";
      } else {
        errorMessage = error.message;
      }
    }
    throw new Error(errorMessage);
  }
};

export const fetchWeatherAlerts = async (location: string): Promise<WeatherAlert[]> => {
  const alertsSchema = {
    type: Type.ARRAY,
    description: "A list of current weather alerts for the specified location. If there are no alerts, return an empty array.",
    items: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING, description: "The title of the alert, e.g., 'Severe Thunderstorm Warning'." },
        description: { type: Type.STRING, description: "A detailed description of the alert." },
        severity: { type: Type.STRING, description: "The severity level of the alert. Can be 'Low', 'Moderate', 'High', or 'Extreme'." },
        source: { type: Type.STRING, description: "The source of the alert, e.g., 'National Weather Service'." },
      },
      required: ["title", "description", "severity", "source"]
    }
  };

  const prompt = `Generate a list of current, realistic weather alerts for ${location}. If there are no active alerts, return an empty array. The output must be in JSON format matching the provided schema.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: alertsSchema,
      },
    });

    const jsonString = response.text;
    const data = JSON.parse(jsonString);
    return data as WeatherAlert[];
  } catch (error) {
    console.error("Error fetching weather alerts:", error);
    let errorMessage = "Failed to fetch weather alerts due to an unknown error.";
    if (error instanceof Error) {
      const lowerCaseMessage = error.message.toLowerCase();
      if (lowerCaseMessage.includes('api key') || lowerCaseMessage.includes('permission denied')) {
        errorMessage = "Invalid Gemini API Key. Please ensure your API key is configured correctly.";
      } else if (lowerCaseMessage.includes('fetch') || lowerCaseMessage.includes('network')) {
        errorMessage = "Network Error: Could not fetch alerts. Please check your internet connection.";
      } else if (error instanceof SyntaxError || lowerCaseMessage.includes('400')) {
         errorMessage = "Invalid Location: Could not retrieve alerts for the specified location.";
      } else {
        errorMessage = error.message;
      }
    }
    throw new Error(errorMessage);
  }
};

export const askGeminiAboutWeather = async (question: string, weatherData: WeatherData): Promise<string> => {
  const prompt = `Based on the following weather data, answer the user's question.
  Weather Data: ${JSON.stringify(weatherData, null, 2)}
  Question: "${question}"

  Provide a friendly, conversational, and helpful response in a single paragraph. Be concise and focus on the most relevant information from the data to answer the question.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error asking Gemini about weather:", error);
    let errorMessage = "Failed to get a response from Gemini due to an unknown error.";
    if (error instanceof Error) {
      const lowerCaseMessage = error.message.toLowerCase();
      if (lowerCaseMessage.includes('api key') || lowerCaseMessage.includes('permission denied')) {
        errorMessage = "Invalid Gemini API Key. Please ensure your API key is configured correctly.";
      } else if (lowerCaseMessage.includes('fetch') || lowerCaseMessage.includes('network')) {
        errorMessage = "Network Error: Could not contact Gemini. Please check your internet connection.";
      } else {
        errorMessage = error.message;
      }
    }
    throw new Error(errorMessage);
  }
};