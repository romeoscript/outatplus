import React from 'react';
import { View, Text, Image, Animated, StyleSheet, Dimensions } from 'react-native';
import MaskedView from '@react-native-community/masked-view';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');
const ITEM_SIZE = width * 0.72;
const SPACING = 10;

const MovieCard = ({ item, scrollX, index }) => {
  if (!item.poster) {
    return <View style={{ width: EMPTY_ITEM_SIZE }} />;
  }

  const inputRange = [
    (index - 2) * ITEM_SIZE,
    (index - 1) * ITEM_SIZE,
    index * ITEM_SIZE,
  ];

  const translateY = scrollX.interpolate({
    inputRange,
    outputRange: [50, 10, 50],
    extrapolate: 'clamp',
  });

  return (
    <View style={{ width: ITEM_SIZE }}>
      <Animated.View
        style={[
          styles.movieCard,
          { transform: [{ translateY }] },
        ]}
      >
        <MaskedView
          style={styles.maskedView}
          maskElement={
            <LinearGradient
              colors={['transparent', 'black', 'black', 'transparent']}
              style={{ flex: 1 }}
            />
          }
        >
          <Image
            source={{ uri: item.poster }}
            style={styles.posterImage}
          />
        </MaskedView>
        <Text style={styles.title} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.description} numberOfLines={3}>
          {item.description}
        </Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  movieCard: {
    marginHorizontal: SPACING,
    padding: SPACING * 2,
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 34,
  },
  maskedView: {
    flex: 1,
    height: ITEM_SIZE * 1.2,
    borderRadius: 24,
    overflow: 'hidden',
  },
  posterImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  title: {
    fontSize: 24,
    marginTop: 10,
  },
  description: {
    fontSize: 12,
  },
});

export default MovieCard;
