import React from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './Login';
import Register from './Register';
import Home from './Home';
import { Button } from 'react-native-paper';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen 
        
        name="Home"
          component={Home}
          options={{
            headerTitle: "Todo", 
            headerRight:()=> <LogoutButton/>
          }}
        
         />

      </Stack.Navigator>
    </NavigationContainer>
  );
};


const LogoutButton = () => {
  const navigation = useNavigation();

  const handleLogout = () => {
    
    navigation.navigate('Login');
  };

  return (
   <Button onPress={handleLogout}>Logout</Button>
  );
};

export default App;
