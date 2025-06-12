import LottieView from "lottie-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  getForecastByCity,
  getWeatherByCity,
} from "../../services/weatherService";
import SearchBar from "./SearchBar";

const { width, height } = Dimensions.get("window");

const DAY_COLOR = "#87CEEB";
const NIGHT_COLOR = "#1a237e";

export default function Index() {
  const [weather, setWeather] = useState<any>(null);
  const [forecast, setForecast] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [bgColor, setBgColor] = useState(DAY_COLOR);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  const weatherAnimations: Record<string, any> = {
    Clear: require("../../assets/animations/sole.json"),
    Clouds: require("../../assets/animations/nuvola.json"),
    Rain: require("../../assets/animations/pioggia.json"),
    Drizzle: require("../../assets/animations/pioggia.json"),
    Thunderstorm: require("../../assets/animations/vento.json"),
    Snow: require("../../assets/animations/vento.json"),
    Mist: require("../../assets/animations/vento.json"),
  };

  const animateIn = () => {
    slideAnim.setValue(1);
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const animateOut = (): Promise<void> => {
    return new Promise((resolve) => {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => resolve());
    });
  };

  const searchCity = async (city: string) => {
    setLoading(true);
    setErrorMsg("");
    try {
      if (weather) await animateOut();
      const data = await getWeatherByCity(city);
      const forecastData = await getForecastByCity(city);
      setWeather(data);
      setForecast(forecastData);
      updateBackground(data);
      animateIn();
    } catch {
      setErrorMsg("Errore nel recupero meteo per la città");
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    searchCity("Roma");
  }, []);

  const updateBackground = (data: any) => {
    const current = Date.now() / 1000;
    if (data.sys && data.sys.sunrise && data.sys.sunset) {
      if (current > data.sys.sunrise && current < data.sys.sunset) {
        setBgColor(DAY_COLOR);
      } else {
        setBgColor(NIGHT_COLOR);
      }
    }
  };

  const slideInterpolation = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 300],
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      {weather?.weather[0].main &&
        weatherAnimations[weather.weather[0].main] && (
          <LottieView
            source={weatherAnimations[weather.weather[0].main]}
            autoPlay
            loop
            style={StyleSheet.absoluteFill}
          />
        )}

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.overlay}
      >
        <ScrollView contentContainerStyle={styles.scroll}>
          <Text style={styles.title}>Meteo App</Text>
          <SearchBar onSearch={searchCity} />

          {loading && <ActivityIndicator size="large" color="#fff" />}

          {errorMsg ? (
            <Text style={styles.error}>{errorMsg}</Text>
          ) : weather ? (
            <Animated.View
              style={[
                styles.card,
                {
                  opacity: fadeAnim,
                  transform: [{ translateX: slideInterpolation }],
                },
              ]}
            >
              <Text style={styles.city}>
                {weather.name}, {weather.sys.country}
              </Text>
              <Text style={styles.temp}>{Math.round(weather.main.temp)}°C</Text>
              <Text style={styles.desc}>{weather.weather[0].description}</Text>

              <View style={styles.extra}>
                <Text style={styles.extraItem}>
                  🌬 Vento: {weather.wind.speed} m/s
                </Text>
                <Text style={styles.extraItem}>
                  💧 Umidità: {weather.main.humidity}%
                </Text>
                <Text style={styles.extraItem}>
                  🔵 Pressione: {weather.main.pressure} hPa
                </Text>
              </View>

              {forecast.length > 0 && (
                <View style={{ marginTop: 20 }}>
                  <Text style={styles.forecastTitle}>Prossimi giorni:</Text>
                  {forecast.map((item, idx) => (
                    <Text key={idx} style={styles.extraItem}>
                      📅 {item.date}: {item.temp}°C - {item.desc}
                    </Text>
                  ))}
                </View>
              )}
            </Animated.View>
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.2)" },
  scroll: { padding: 20, paddingTop: 40, flexGrow: 1 },
  title: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
    alignSelf: "center",
  },
  error: {
    color: "#ff6666",
    fontWeight: "600",
    marginTop: 20,
    alignSelf: "center",
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 20,
    padding: 25,
    marginTop: 20,
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 10,
    alignItems: "center",
  },
  city: { fontSize: 28, fontWeight: "bold", color: "#fff" },
  temp: { fontSize: 64, fontWeight: "bold", color: "#fff", marginVertical: 10 },
  desc: {
    fontSize: 22,
    fontStyle: "italic",
    color: "#eee",
    marginBottom: 15,
    textTransform: "capitalize",
  },
  extra: {
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 15,
    width: "100%",
  },
  extraItem: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 8,
    textAlign: "center",
  },
  lottie: { width: 120, height: 120 },
  forecastTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 10,
    textAlign: "center",
  },
});
