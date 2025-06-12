import { FontAwesome5 } from "@expo/vector-icons";
import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

interface ForecastProps {
  data: any[];
}

export default function Forecast({ data }: ForecastProps) {
  const renderItem = ({ item }: any) => {
    const date = new Date(item.dt * 1000);
    const hours = date.getHours();
    const icon = getIcon(item.weather[0].main);

    return (
      <View style={styles.item}>
        <Text style={styles.time}>{hours}:00</Text>
        <FontAwesome5 name={icon} size={24} color="#fff" />
        <Text style={styles.temp}>{Math.round(item.main.temp)}°C</Text>
      </View>
    );
  };

  const getIcon = (condition: string) => {
    switch (condition) {
      case "Clear":
        return "sun";
      case "Clouds":
        return "cloud";
      case "Rain":
        return "cloud-showers-heavy";
      case "Snow":
        return "snowflake";
      default:
        return "smog";
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Prossime ore</Text>
      <FlatList
        data={data.slice(0, 6)}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={renderItem}
        keyExtractor={(item) => item.dt.toString()}
        contentContainerStyle={{ gap: 15 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 30 },
  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 10,
    marginLeft: 5,
  },
  item: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 10,
    borderRadius: 15,
    width: 80,
  },
  time: {
    color: "#fff",
    fontSize: 14,
    marginBottom: 5,
  },
  temp: {
    color: "#fff",
    fontSize: 16,
    marginTop: 5,
  },
});
