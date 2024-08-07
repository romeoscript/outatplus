import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions, ScrollView, ActivityIndicator, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import profiles from '../assets/profile';
import { useNavigation } from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;

const getOrAssignProfileImage = async (userId) => {
    try {
        const storedImage = await AsyncStorage.getItem(`profile_image_${userId}`);
        if (storedImage) {
            return storedImage;
        } else {
            const newImage = profiles[Math.floor(Math.random() * profiles.length)];
            await AsyncStorage.setItem(`profile_image_${userId}`, newImage.toString());
            return newImage;
        }
    } catch (error) {
        console.error('Error getting or assigning profile image:', error);
    }
};

const ProfileScreen = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [profileImage, setProfileImage] = useState(null);
    const navigation = useNavigation();

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            try {
                const token = await AsyncStorage.getItem('bearer_token');
                if (!token) {
                    Alert.alert('Error', 'No token found');
                    return;
                }

                const response = await axios.get('https://outat.pythonanywhere.com/accounts/profile/', {
                    headers: {
                        'X-API-KEY': 'fVAXFVEG.u1AMHjUs6x4WdAWP1ZE9bzWYMvwSmAHT',
                        'Authorization': `Token ${token}`
                    }
                });
                const profileData = response.data
                console.log(profileData)
                setProfile(profileData);
                const image = await getOrAssignProfileImage(profileData.id);
                setProfileImage(image);
            } catch (error) {
                // Alert.alert('Error', 'Failed to fetch profile details');
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleLogout = async () => {
        try {
          await AsyncStorage.removeItem('bearer_token');
          navigation.replace('Login'); 
        } catch (error) {
          console.error('Error during logout:', error);
          Alert.alert('Error', 'Failed to logout');
        }
      };

      const confirmLogout = () => {
        Alert.alert(
          'Confirm Logout',
          'Are you sure you want to logout?',
          [
            {
              text: 'Cancel',
              onPress: () => console.log('Logout cancelled'),
              style: 'cancel'
            },
            {
              text: 'Logout',
              onPress: handleLogout,
              style: 'destructive'
            }
          ],
          { cancelable: true }
        );
      };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#EB5BE4" />
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.container}>
                {profile && (
                    <View style={styles.headerContainer}>
                        <Image
                            source={profileImage} // Replace with your profile picture URL
                            style={styles.profileImage}
                        />
                        <Text style={styles.name}>{profile.first_name} {profile.last_name}</Text>
                        <Text style={styles.email}>{profile.email}</Text>
                    </View>
                )}
                <View style={styles.bodyContainer}>
                    <TouchableOpacity style={styles.option}>
                        <Icon name="edit" size={20} color="#EB5BE4" style={styles.icon} />
                        <Text style={styles.optionText}>Edit Profile</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.option}>
                        <Icon name="cog" size={20} color="#EB5BE4" style={styles.icon} />
                        <Text style={styles.optionText}>Settings</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.option}>
                        <Icon name="question-circle" size={20} color="#EB5BE4" style={styles.icon} />
                        <Text style={styles.optionText}>Help & Support</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.option} onPress={confirmLogout}>
                        <Icon name="sign-out" size={20} color="#EB5BE4" style={styles.icon} />
                        <Text style={styles.optionText}>Logout</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
        padding: 20,
    },
    container: {
        alignItems: 'center',
    },
    headerContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    profileImage: {
        width: 150,
        height: 150,
        borderRadius: 75,
        marginBottom: 20,
    },
    name: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    email: {
        color: '#aaa',
        fontSize: 16,
        marginBottom: 20,
    },
    bodyContainer: {
        width: screenWidth * 0.9,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#333',
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
    },
    icon: {
        marginRight: 15,
    },
    optionText: {
        color: '#fff',
        fontSize: 18,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
    },
});

export default ProfileScreen;
