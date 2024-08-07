import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, TouchableWithoutFeedback, Keyboard, Image, Alert, ActivityIndicator } from 'react-native';
import { Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';

const screenWidth = Dimensions.get('window').width;
const LoginScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    const apiKey = 'fVAXFVEG.u1AMHjUs6x4WdAWP1ZE9bzWYMvwSmAHT';
    const payload = {
      email,
      password,
    };
    try {
      const response = await fetch('https://outat.pythonanywhere.com/accounts/login/', {
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
        console.log(errorData.non_field_errors, 'fucked')
        Alert.alert('Error', errorData.non_field_errors[0] || 'Something went wrong');
        setLoading(false);
        return;
      }

      const data = await response.json();
      await AsyncStorage.setItem('bearer_token', data.token);
      await AsyncStorage.setItem('token_expiry', data.expiry);
      Alert.alert('Success', 'Login successful');
      navigation.navigate('Main');
    } catch (error) {
      Alert.alert('Error', error.non_field_errors[0] || 'Something went wrong');
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
        <Text style={styles.title}>Login</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#aaa"
          value={email}
          onChangeText={setEmail}
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
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          {loading ? <ActivityIndicator size="large" color="white" /> : <Text style={styles.buttonText}>Login</Text> }
        
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.signUpText}>Don't have an account? Register</Text>
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
    borderRadius: 100,
    padding: 10,
    marginBottom: 20,
    color: '#fff',
  },
  passwordContainer: {
    width: '100%',
    height: 50,
    backgroundColor: '#333',
    borderRadius: 100,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  passwordInput: {
    flex: 1,
    color: '#fff',
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#EB5BE4',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  signUpText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default LoginScreen;
