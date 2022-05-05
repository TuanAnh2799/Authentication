import { Alert, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../Screen/Home/Home';
import LoginScreen from '../Screen/Login/Login';
import auth from '@react-native-firebase/auth';
import navigation from './rootNavigation';


const Stack = createNativeStackNavigator();

const AuthStackScreen = ():JSX.Element => {

  const sigout = () => {
    Alert.alert('Are you sure you want to logout?', '', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
      },
      {
        text: 'OK',
        onPress: async () => {
          await auth()
          .signOut()
          .then(() => {
            navigation.navigate('Login', {screen: 'Login'});
            console.log('User signed out!')
          });
        }
      }
    ]);
 
  }

  return (
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} options={{
          headerRight: () => (<Text style={{backgroundColor: '#d1d1d1', fontSize: 18}} onPress={sigout}>Logout</Text>)
        }} />
      </Stack.Navigator>
  )
}

export default AuthStackScreen

const styles = StyleSheet.create({})