import { StyleSheet, Text, View, Button } from 'react-native'
import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SignUp from './SignUp';
import SignIn from './SignIn';
import { emailKey, pinKey } from '../../Constants/Constants';

const LoginScreen = ({navigation}:any): JSX.Element => {

    const [isSignUp, setIsSignUp] = React.useState<boolean>(true);

    React.useEffect(() => {
        //AsyncStorage.clear();
        retrieveData();
    },[]);
    
    const retrieveData = async () => {
        try {
            const values = await AsyncStorage.multiGet([emailKey, pinKey]);
            if (values[0][1] !== null && values[1][1]!== null) {
                setIsSignUp(false);
            }
        } catch (error) {
            console.log(JSON.stringify(error));
        }
    }
  return (
    <>{isSignUp ? <SignUp navigation={navigation}/> : <SignIn navigation={navigation} />}</>
  )
}

export default LoginScreen

const styles = StyleSheet.create({})