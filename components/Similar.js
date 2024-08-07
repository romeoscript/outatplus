import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_EXPIRY_TIME = 3600 * 1000; // 1 hour in milliseconds

const SimilarMovies = ({ movieId, stopCurrent }) => {
    const navigation = useNavigation();
    const [similarMovies, setSimilarMovies] = useState([]);

    useEffect(() => {
        fetchSimilarMovies();
    }, [movieId]);

    const fetchSimilarMovies = async () => {
        try {
            // Try to get data from AsyncStorage
            const cachedData = await AsyncStorage.getItem('similar_movies_data');
            const cachedTimestamp = await AsyncStorage.getItem('similar_movies_cache_timestamp');
            
            const isCacheValid = cachedTimestamp && (Date.now() - parseInt(cachedTimestamp) < CACHE_EXPIRY_TIME);

            if (cachedData && isCacheValid) {
                setSimilarMovies(JSON.parse(cachedData));
                return;
            }

            // If no cached data or cache expired, fetch from API
            const response = await fetch(`https://c.streamhoster.com/feed/WGsdtX/qkBbga8sOu9/dnLjYgF2saD?format=rokujson`);
            const data = await response.json();

            // Cache the fetched data in AsyncStorage
            await AsyncStorage.setItem('similar_movies_data', JSON.stringify(data.tvSpecials));
            await AsyncStorage.setItem('similar_movies_cache_timestamp', Date.now().toString());

            setSimilarMovies(data.tvSpecials);
        } catch (error) {
            console.error('Error fetching similar movies:', error);
        }
    };

    const truncateTitle = (title) => {
        return title.length > 15 ? `${title.slice(0, 15)}...` : title;
    };

    const renderMovieItem = ({ item }) => (
        <TouchableOpacity
            onPress={async () => {
                await stopCurrent();
                navigation.push('movie', {
                    id: item.id,
                    title: item.title,
                    genre: item.genre,
                    description: item.shortDescription,
                    poster: item.thumbnail,
                    videoUrl: item.content.videos[0].url,
                    releaseDate: item.releaseDate,
                    rating: item.rating,
                });
            }}
            style={styles.movieItem}
        >
            <Image source={{ uri: item.thumbnail }} style={styles.moviePoster} />
            <Text style={styles.movieTitle}>{truncateTitle(item.title)}</Text>
        </TouchableOpacity>
    );

    return (
        <View>
            <FlatList
                data={similarMovies?.slice(0, 9)}
                renderItem={renderMovieItem}
                keyExtractor={(item) => item.id.toString()}
                numColumns={3}
                contentContainerStyle={styles.gridContainer}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    sectionTitle: {
        fontSize: 20,
        color: '#fff',
        padding: 10,
    },
    gridContainer: {
        paddingHorizontal: 20,
    },
    movieItem: {
        flex: 1,
        margin: 5,
        alignItems: 'center',
        backgroundColor: '#222',
        padding: 10,
        borderRadius: 5,
    },
    moviePoster: {
        width: 100,
        height: 150,
        borderRadius: 5,
        marginBottom: 5,
    },
    movieTitle: {
        color: '#fff',
        fontSize: 14,
        textAlign: 'center',
    },
    movieGenre: {
        color: '#aaa',
        fontSize: 12,
        textAlign: 'center',
    },
    movieReleaseDate: {
        color: '#aaa',
        fontSize: 12,
        textAlign: 'center',
    },
    movieRating: {
        color: '#aaa',
        fontSize: 12,
        textAlign: 'center',
    },
    movieDescription: {
        color: '#ddd',
        fontSize: 12,
        textAlign: 'center',
    },
});

export default SimilarMovies;
