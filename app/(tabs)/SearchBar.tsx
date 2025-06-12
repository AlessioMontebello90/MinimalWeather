import React, { useState } from "react";
import { Button, StyleSheet, TextInput, View } from "react-native";

interface SearchBarProps {
  onSearch: (city: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [city, setCity] = useState("");

  const handlePress = () => {
    if (city.trim()) {
      onSearch(city.trim());
      setCity("");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Cerca città..."
        style={styles.input}
        value={city}
        onChangeText={setCity}
        returnKeyType="search"
        onSubmitEditing={handlePress}
      />
      <Button title="Cerca" onPress={handlePress} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
});
