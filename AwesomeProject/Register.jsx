// Register.js
import axios from 'axios'
import React, { useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { TextInput, Button } from 'react-native-paper'

const Register = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleRegister = async () => {
    try {
      const response = await axios.post(
        'https://13.234.238.94:3000/api/user/v1/register',
        {
          email: email,
          password: password,
        },
      )
      // console.log(response);
    } catch (error) {
      console.error(
        'Registration failed:',
        error.response ? error.response.data : error.message,
      )
    }
  }

  return (
    <View style={styles.container}>
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
      <Button mode="contained" onPress={handleRegister} style={styles.button}>
        Register
      </Button>
    </View>
  )
}

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
})

export default Register
