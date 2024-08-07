import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Keyboard, TouchableWithoutFeedback, Image, Dimensions, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { ActivityIndicator } from 'react-native';

const screenWidth = Dimensions.get('window').width;
const SignupScreen = () => {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [isInputFocused, setIsInputFocused] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSignup = async () => {
        setLoading(true);
        const apiKey = 'fVAXFVEG.u1AMHjUs6x4WdAWP1ZE9bzWYMvwSmAHT';
        const payload = {
            email,
            password,
            first_name: firstName,
        };
        try {
            const response = await fetch('https://outat.pythonanywhere.com/accounts/signup/', {
                method: 'POST',
                headers: {
                    'x-api-key': apiKey,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.log(errorData)
                Alert.alert('Error', errorData.email || 'Something went wrong');
                setLoading(false);
                return;
            }

            const data = await response.json();
            Alert.alert('Success', 'Account created successfully');
            navigation.navigate('Login');
        } catch (error) {
            Alert.alert('Error', error.message || 'Something went wrong');
            setLoading(false);
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                {!isInputFocused && (
                    <View style={styles.headerContainer}>
                        <Text style={styles.appName}>OutArt Inc</Text>
                        <View style={styles.imageBox}>
                            <Image
                                source={{ uri: 'https://via.placeholder.com/150' }} // Replace with your image URL
                                style={styles.image}
                            />
                        </View>
                    </View>
                )}
                <Text style={styles.title}>Register</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Full Name"
                    placeholderTextColor="#aaa"
                    value={firstName}
                    onChangeText={setFirstName}
                    onFocus={() => setIsInputFocused(true)}
                    onBlur={() => setIsInputFocused(false)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="#aaa"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    onFocus={() => setIsInputFocused(true)}
                    onBlur={() => setIsInputFocused(false)}
                />
                <View style={styles.passwordContainer}>
                    <TextInput
                        style={styles.passwordInput}
                        placeholder="Password"
                        placeholderTextColor="#aaa"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!passwordVisible}
                        autoCapitalize="none"
                        onFocus={() => setIsInputFocused(true)}
                        onBlur={() => setIsInputFocused(false)}
                    />
                    <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
                        <Icon name={passwordVisible ? "eye-slash" : "eye"} size={20} color="#aaa" />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.button} onPress={handleSignup}>
                    {loading ? <ActivityIndicator size="large" color="white" /> : <Text style={styles.buttonText}>Register</Text>}
                    {/* <Text style={styles.buttonText}>{loading ? <ActivityIndicator size="large" color="#0000ff" /> : 'Register'}</Text> */}
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.signInText}>Already have an account? Login</Text>
                </TouchableOpacity>
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        color: '#fff',
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        height: 50,
        backgroundColor: '#333',
        borderRadius: 10,
        paddingHorizontal: 20,
        marginBottom: 20,
        color: '#fff',
        fontSize: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
    },
    passwordContainer: {
        width: '100%',
        height: 50,
        backgroundColor: '#333',
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
    },
    passwordInput: {
        flex: 1,
        color: '#fff',
        fontSize: 16,
    },
    headerContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    appName: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    imageBox: {
        width: screenWidth * 0.9,
        height: 250,
        backgroundColor: '#333',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
    },
    image: {
        width: "100%",
        height: "100%",
        borderRadius: 10,
    },
    button: {
        width: '100%',
        height: 50,
        backgroundColor: '#EB5BE4',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    signInText: {
        color: '#fff',
        fontSize: 16,

    },
});

export default SignupScreen;
