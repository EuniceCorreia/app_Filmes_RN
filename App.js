import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  TextInput,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

function HomeScreen({ navigation }) {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState(""); // texto digitado
  const [filteredMovies, setFilteredMovies] = useState([]); // lista filtrada

  useEffect(() => {
    fetch("https://api.tvmaze.com/shows")
      .then((res) => res.json())
      .then((data) => {
        setMovies(data);
        setFilteredMovies(data);
      })
      .catch((err) => console.error(err));
  }, []);

  // função de filtro
  const handleSearch = (text) => {
    setSearch(text);
    const filtered = movies.filter((movie) =>
      movie.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredMovies(filtered);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Campo de busca */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar filme..."
          value={search}
          onChangeText={handleSearch}
        />
      </View>

      {/* Lista de filmes */}
      <ScrollView>
        {filteredMovies.slice(0, 30).map((movie) => (
          <TouchableOpacity
            key={movie.id}
            style={styles.card}
            onPress={() => navigation.navigate("Details", { movie })}
          >
            <Image source={{ uri: movie.image?.medium }} style={styles.poster} />
            <Text style={styles.title}>{movie.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}


function DetailsScreen({ route }) {
  const { movie } = route.params;

  return (
    <View style={styles.detailsContainer}>
      <Image source={{ uri: movie.image?.original }} style={styles.detailsImage} />
      <Text style={styles.detailsTitle}>{movie.name}</Text>
      <Text style={styles.detailsText}>
        {movie.summary?.replace(/<[^>]+>/g, "")}
      </Text>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: "Filmes" }} />
        <Stack.Screen name="Details" component={DetailsScreen} options={{ title: "Detalhes" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
    marginHorizontal: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    padding: 10,
  },
  poster: {
    width: 80,
    height: 100,
    borderRadius: 5,
    marginRight: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  detailsContainer: {
    flex: 1,
    padding: 20,
    alignItems: "center",
  },
  detailsImage: {
    width: 250,
    height: 350,
    borderRadius: 10,
    marginBottom: 20,
  },
  detailsTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  detailsText: {
    fontSize: 16,
    textAlign: "justify",
  },
    searchContainer: {
    padding: 10,
    backgroundColor: "#fafafa",
  },
  searchInput: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
  },

});
