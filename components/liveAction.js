import React from 'react';
import {
  StatusBar,
  Text,
  View,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
  Animated,
  Platform,
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
const { width, height } = Dimensions.get('window');

const SPACING = 7;
const ITEM_SIZE = width * 0.92;
const EMPTY_ITEM_SIZE = (width - ITEM_SIZE) / 2;
const BACKDROP_HEIGHT = height * 0.65;

const Loading = () => (
  <View style={styles.loadingContainer}>
    <Text style={styles.paragraph}>Loading...</Text>
  </View>
);

const Backdrop = ({ movies, scrollX }) => {
  return (
    <View style={{ height: BACKDROP_HEIGHT, width, position: 'absolute' }}>
      <FlatList
        data={movies.reverse()}
        keyExtractor={(item) => item.id?.toString() || item.key}
        removeClippedSubviews={false}
        contentContainerStyle={{ width, height: BACKDROP_HEIGHT }}
        renderItem={({ item, index }) => {
          if (!item.backdrop) {
            return null;
          }
          const translateX = scrollX.interpolate({
            inputRange: [(index - 1) * ITEM_SIZE, (index - 1) * ITEM_SIZE],
            outputRange: [0, width],
          });
          return (
            <Animated.View
              removeClippedSubviews={false}
              style={{
                position: 'absolute',
                width: translateX,
                height,
                overflow: 'hidden',
              }}
            >
              <Image
                source={{ uri: item.backdrop }}
                style={{
                  width,
                  height: BACKDROP_HEIGHT,
                  position: 'absolute',
                }}
              />
            </Animated.View>
          );
        }}
      />

    </View>
  );
};

const LiveAction = ({ trending, onPlayVideo }) => {
  const scrollX = React.useRef(new Animated.Value(0)).current;

  const renderItem = ({ item, index }) => {
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
      outputRange: [20, 70, 20],
      extrapolate: 'clamp',
    });

    return (
      <View style={{ width: ITEM_SIZE, height: BACKDROP_HEIGHT }}>
        <TouchableOpacity onPress={() => onPlayVideo(item.videoUrl)}>
          <Animated.View
            style={{
              marginHorizontal: SPACING,
              padding: SPACING * 2,
              alignItems: 'center',
              transform: [{ translateY }],
              backgroundColor: 'white',
              borderRadius: 34,
            }}
          >
            <Image
              source={{ uri: item.poster }}
              style={styles.posterImage}
            />
            <Text style={{ fontSize: 24 }} numberOfLines={1}>
              {item.title}
            </Text>
            <Text style={{ fontSize: 12 }} numberOfLines={3}>
              {item.description}
            </Text>
          </Animated.View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Live Feeds</Text>
      <Backdrop movies={trending} scrollX={scrollX} />
      <Animated.FlatList
        showsHorizontalScrollIndicator={false}
        data={[...trending, { key: 'empty-right' }]}
        keyExtractor={(item) => `${item.id}-backdrop`}
        horizontal
        bounces={false}
        decelerationRate={Platform.OS === 'ios' ? 0 : 0.98}
        renderToHardwareTextureAndroid
        contentContainerStyle={{
          alignItems: 'center',
          paddingHorizontal: EMPTY_ITEM_SIZE,
        }}
        snapToInterval={ITEM_SIZE}
        snapToAlignment='start'
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={1}
        renderItem={renderItem}

      />
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
  },
  heading: {
    color: 'white',
    fontSize: 20,
    marginHorizontal: 16,
    marginBottom: 20,
  },
  text: {
    color: 'white',
    fontSize: 25,
    marginHorizontal: 16,
    marginBottom: 20,
    fontWeight: 'bold'
  },
  paragraph: {
    margin: 10,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  posterImage: {
    width: '100%',
    height: ITEM_SIZE * 1.2,
    resizeMode: 'cover',
    borderRadius: 24,
    margin: 0,
    marginBottom: 10,
  },
});

export default LiveAction;
