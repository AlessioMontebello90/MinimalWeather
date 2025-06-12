import axios from "axios";
import { BASE_URL, OPENWEATHER_API_KEY } from "../config/api";

export async function getCurrentWeather(lat: number, lon: number) {
  return fetchWeather({ lat, lon });
}

export async function getWeatherByCity(city: string) {
  return fetchWeather({ q: city });
}

async function fetchWeather(params: Record<string, string | number>) {
  try {
    const response = await axios.get(`${BASE_URL}/weather`, {
      params: {
        ...params,
        appid: OPENWEATHER_API_KEY,
        units: "metric",
        lang: "it",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Errore fetch meteo:", error);
    throw error;
  }
}
