import { StyleSheet, Text, View, Button } from 'react-native';
import React from 'react';

const HomeScreen = ({navigation, route}:any): JSX.Element => {

  const email = route.params.email;
  console.log('email: ' , email);

  return (
    <View>
      <Text>HomeScreen</Text>
      <Text>Email: {email}</Text>
      <Button title='Login' onPress={()=>navigation.navigate('Login')} />
    </View>
  )
}

export default HomeScreen

const styles = StyleSheet.create({})