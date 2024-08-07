import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';

const DetailsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Details Screen</Text>
      {/* <StatusBar style="auto" /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E0E0E0',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default DetailsScreen;
