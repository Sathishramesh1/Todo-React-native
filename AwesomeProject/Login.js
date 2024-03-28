// Login.js
import axios from 'axios';
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import * as SecureStore from 'expo-secure-store';


const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async() => {
    try {
      const response = await axios.post("https://todo-backend-b1ar.onrender.com/api/user/v1/login", {
        email: email,
        password: password
      });
      // console.log(response);
      const token = response.data.jwttoken;
      setEmail("");
      setPassword("")
      await SecureStore.setItemAsync('userToken', token);
      navigation.navigate("Home");
     
    } catch (error) {
      console.error("Login failed:", error.response ? error.response.data : error.message);
      
    }
   
   
  };

  return (
    <View style={styles.container}>
    <Text style={styles.heading}>Todo</Text>
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <Button mode="contained" onPress={handleLogin} style={styles.button}>
        Login
      </Button>
      <Button onPress={() => navigation.navigate('Register')} style={styles.button}>
        Go to Register
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    marginBottom: 10,
  },
  button: {
    marginTop: 10,
  },
  heading:{
    fontWeight:'bold',
    fontSize:32,
    textAlign:'center',
    marginBottom:10
  }
});

export default Login;
