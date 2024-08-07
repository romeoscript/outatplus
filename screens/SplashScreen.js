import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SplashScreen = ({ navigation }) => {
    const fadeAnim = new Animated.Value(0);

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
        }).start(async () => {
            // Check login status after the animation
            const token = await AsyncStorage.getItem('bearer_token');
            const tokenExpiry = await AsyncStorage.getItem('token_expiry');
            const now = new Date();
            setTimeout(() => {
                if (token && tokenExpiry && new Date(tokenExpiry) > now) {
                    navigation.replace('Main');
                } else {
                    navigation.replace('Login');
                }
            }, 1000);
        });
    }, [navigation]);

    return (
        <View style={styles.container}>
            <Animated.Image
                source={require('../assets/logo.png')} 
                style={[styles.logo, { opacity: fadeAnim }]}
            />
            <Animated.Text style={[styles.text, { opacity: fadeAnim }]}>
                Welcome to OutAt INC.
            </Animated.Text>
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
    logo: {
        width: 150,
        height: 150,
    },
    text: {
        fontSize: 24,
        color: '#fff',
        marginTop: 20,
    },
});

export default SplashScreen;
