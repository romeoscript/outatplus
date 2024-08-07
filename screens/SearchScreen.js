import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, TouchableOpacity, Text, StyleSheet, Animated, Alert, Image } from 'react-native';

const SearchScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const animatedValue = new Animated.Value(0);

  useEffect(() => {
    const handleSearch = async () => {
      if (searchQuery.trim() === '') {
        setResults([]);
        return;
      }
      try {
        const response = await fetch('https://c.streamhoster.com/feed/WGsdtX/qkBbga8sOu9/dnLjYgF2saD?format=rokujson');
        const data = await response.json();

        const filteredResults = [
          ...data.liveFeeds,
          ...data.tvSpecials
        ].filter(item => item.title && item.title.toLowerCase().includes(searchQuery.toLowerCase()));

        setResults(filteredResults);

        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
      } catch (error) {
        Alert.alert('Error', 'Something went wrong while searching. Please try again.');
      }
    };

    handleSearch();
  }, [searchQuery]);

  const handleItemPress = (item) => {
    navigation.navigate('MovieDetail', { item });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.item} onPress={() => handleItemPress(item)}>
      <Image source={{ uri: item.thumbnail }} style={styles.poster} />
      {/* <Text style={styles.debugText}>{item.title}</Text>  */}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholderTextColor="#888"
      />
      <Animated.FlatList
        data={results}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        numColumns={3}
        columnWrapperStyle={styles.row}
        style={{ opacity: animatedValue }}
        contentContainerStyle={styles.contentContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 80,
    backgroundColor: '#1c1c1c',
  },
  searchInput: {
    height: 50,
    backgroundColor: '#333',
    borderRadius: 25,
    paddingHorizontal: 20,
    marginBottom: 20,
    color: '#fff',
    fontSize: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  contentContainer: {
    paddingBottom: 10,
  },
  row: {
    flex: 1,
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  item: {
    flex: 1,
    margin: 5,
    backgroundColor: '#2c2c2c',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
  },
  poster: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  debugText: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 5,
  },
});

export default SearchScreen;
