import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Share, ActivityIndicator } from 'react-native';
import { Video } from 'expo-av';
import { useNavigation } from '@react-navigation/native';
import { AntDesign, Feather, FontAwesome } from '@expo/vector-icons';
import moment from 'moment';
import SimilarMovies from '../components/Similar';
import SameArtisteMovies from '../components/Sameartiste';

const MovieScreen = ({ route }) => {
    let { id, title, genre, description, poster, videoUrl, releaseDate, rating } = route.params;

    // If any of the extracted values are missing, fall back to route.params.item
    if (!id || !title || !genre || !description || !poster || !videoUrl || !releaseDate || !rating) {
        const item = route.params.item;
        if (item) {
            id = item.id;
            title = item.title;
            genre = item.genre;
            description = item.description;
            poster = item.poster;
            videoUrl = item.videoUrl;
            releaseDate = item.releaseDate;
            rating = item.rating;
        }
    }

    const navigation = useNavigation();
    const [isPlaying, setIsPlaying] = useState(false);
    const [activeTab, setActiveTab] = useState('similarMovies');
    const videoRef = React.useRef(null);
    const [isVideoLoading, setIsVideoLoading] = useState(true);

    const handleShare = async () => {
        try {
            await Share.share({
                message: `${videoUrl}`,
            });
        } catch (error) {
            console.error('Error sharing movie:', error);
        }
    };

    const handlePlay = () => {
        setIsPlaying(true);
    };
    const stopCurrent = () => {
        if (videoRef.current) {
            videoRef.current.stopAsync();
        }
    }
    const handleBack = () => {
        console.log(videoRef)
        if (videoRef.current) {
            videoRef.current.stopAsync();
        }
        navigation.goBack();
    };

    return (
        <ScrollView style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                <AntDesign name="close" size={24} color="white" />
            </TouchableOpacity>
            {!isPlaying ? (
                <TouchableOpacity onPress={handlePlay}>
                    <Image source={{ uri: poster }} style={styles.poster} />
                    <View style={styles.playIconContainer}>
                        <AntDesign name="playcircleo" size={64} color="white" />
                    </View>
                </TouchableOpacity>
            ) : (
                <View>
                    {isVideoLoading && (
                        <ActivityIndicator size="large" color="#fff" style={styles.videoLoadingIndicator} />
                    )}
                    <Video
                        source={{ uri: videoUrl }}
                        rate={1.0}
                        ref={videoRef}
                        volume={1.0}
                        isMuted={false}
                        resizeMode="cover"
                        shouldPlay
                        useNativeControls
                        onLoadStart={() => setIsVideoLoading(true)}
                        onLoad={() => setIsVideoLoading(false)}
                        style={styles.video}
                    />
                </View>
            )}
            <View style={styles.infoContainer}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.genre}>{genre}</Text>
                <Text style={styles.releaseDate}>Release Date: {moment(releaseDate).format('MMMM D, YYYY')}</Text>
                <Text style={styles.rating}>Rating: {rating}</Text>
                <Text style={styles.description}>{description}</Text>
                <View style={styles.actionButtons}>
                    <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
                        <Feather name="share" size={24} color="white" />
                        <Text style={styles.actionButtonText}>Share</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton}>
                        <FontAwesome name="plus" size={24} color="white" />
                        <Text style={styles.actionButtonText}>Add to List</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.tabsContainer}>
                <TouchableOpacity
                    style={[styles.tabButton, activeTab === 'similarMovies' && styles.activeTabButton]}
                    onPress={() => setActiveTab('similarMovies')}>
                    <Text style={styles.tabButtonText}>Similar Videos</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tabButton, activeTab === 'sameArtiste' && styles.activeTabButton]}
                    onPress={() => setActiveTab('sameArtiste')}>
                    <Text style={styles.tabButtonText}>Same Artiste</Text>
                </TouchableOpacity>
            </View>
            {activeTab === 'similarMovies' && <SimilarMovies stopCurrent={stopCurrent} movieId={id} />}
            {activeTab === 'sameArtiste' && <SameArtisteMovies stopCurrent={stopCurrent} movieId={id} />}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#111',
    },
    backButton: {
        position: 'absolute',
        top: 40,
        right: 20,
        zIndex: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 10,
        borderRadius: 50,
    },
    poster: {
        width: '100%',
        height: 300,
    },
    playIconContainer: {
        position: 'absolute',
        top: '40%',
        left: '40%',
        zIndex: 10,
    },
    infoContainer: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#fff',
    },
    genre: {
        fontSize: 20,
        marginBottom: 10,
        color: '#aaa',
    },
    releaseDate: {
        fontSize: 18,
        marginBottom: 10,
        color: '#aaa',
    },
    rating: {
        fontSize: 18,
        marginBottom: 10,
        color: '#aaa',
    },
    description: {
        fontSize: 16,
        color: '#ddd',
        marginBottom: 20,
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#333',
        padding: 10,
        borderRadius: 5,
    },
    actionButtonText: {
        marginLeft: 10,
        color: 'white',
        fontSize: 16,
    },
    video: {
        width: '100%',
        height: 300,
        marginVertical: 20,
    },
    tabsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    tabButton: {
        paddingVertical: 10,
    },
    activeTabButton: {
        borderBottomWidth: 2,
        borderBottomColor: '#fff',
    },
    tabButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    videoLoadingIndicator: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -25 }, { translateY: -25 }],
        zIndex: 20,
    },
});

export default MovieScreen;
