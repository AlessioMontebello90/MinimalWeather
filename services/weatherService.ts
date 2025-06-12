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

export async function getForecastByCity(city: string) {
  try {
    const response = await axios.get(`${BASE_URL}/forecast`, {
      params: {
        q: city,
        appid: OPENWEATHER_API_KEY,
        units: "metric",
        lang: "it",
      },
    });

    const rawList = response.data.list;

    const grouped: Record<string, any[]> = {};
    for (const item of rawList) {
      const date = item.dt_txt.split(" ")[0];
      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(item);
    }

    const forecast = Object.entries(grouped).map(([date, entries]) => {
      const temps = entries.map((e: any) => e.main.temp);
      const avgTemp = Math.round(temps.reduce((a, b) => a + b) / temps.length);
      const icon = entries[0].weather[0].icon;
      const description = entries[0].weather[0].description;
      return { date, temp: avgTemp, icon, description };
    });

    return forecast.slice(1, 6); // Escludi oggi, mostra 5 giorni successivi
  } catch (error) {
    console.error("Errore fetch forecast:", error);
    throw error;
  }
}
