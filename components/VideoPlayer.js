import React, { useRef } from 'react';
import { StyleSheet, View, Dimensions, TouchableOpacity, Text } from 'react-native';
import { Video, AVPlaybackStatus } from 'expo-av';

const { width } = Dimensions.get('window');

const videoPlayer = ({ onClose }) => {
  const video = useRef(null);

  return (
    <View style={styles.container}>
      <Video
        ref={video}
        source={{ uri: 'https://c.streamhoster.com/link/hls/WGsdtX/qkBbga8sOu9/OLnLtTsuy2B_1/playlist.m3u8' }}
        style={styles.video}
        useNativeControls
        resizeMode="contain"
        isLooping
      />
      <TouchableOpacity onPress={onClose} style={styles.closeButton}>
        <Text style={styles.closeButtonText}>Close</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  video: {
    width: width,
    height: width * (9 / 16), // 16:9 aspect ratio
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default videoPlayer;
