import React,{ useEffect, useRef, useState } from 'react';
import { Pressable, TextInput, View, StyleSheet, Text, Alert, ActivityIndicator } from 'react-native';
import { emailKey, pinKey, pinReg } from './../../Constants/Constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';


const SignIn = ({navigation}:any):JSX.Element => {

  const inputRef = useRef<TextInput>(null);
  const [code, setCode] = useState<string>('');
  const [isError,setIsError] = useState<boolean>(false);
  const [isLoading,setIsLoading] = useState<boolean>(false);

  const CODE_LENGTH = 6;

  const _focus = () => inputRef.current?.focus && inputRef.current?.focus();

  useEffect(() => {
    if (pinReg.test(code) && code.length === CODE_LENGTH) {
        verifyPin();
    }
  }), [code];

  console.log('code: ' , code);

  const verifyPin = async (bypassPin = false) => {
    try {
        const values = await AsyncStorage.multiGet([emailKey, pinKey]);
        if (values[0][1] !== null && values[1][1] !== null) {
            if (bypassPin) {
                console.log(values[0][1]);
                console.log(values[1][1]);
                signIn(values[0][1], values[1][1]);
            } else if (values[1][1] === code) {
                console.log(values[0][1]);
                console.log(values[1][1]);
                setIsError(false);
                signIn(values[0][1], values[1][1]);
            }
              else if (values[1][1] !== code) {
                setIsError(true);
            }

        }
    } catch (error) {
        console.log(JSON.stringify(error));
    }
}

const signIn = async (email: string, pin: string) => {
  try {
    setIsLoading(true);
    await auth().signInWithEmailAndPassword(email, pin).then(() => {
      setCode('');
      setIsError(false);
      setIsLoading(false);
      Alert.alert('Login successfully!');
      navigation.navigate('Home',{email: email});
    }).catch((error) => {
      console.log(JSON.stringify(error));
    });
    
  } catch (error) {
    setIsLoading(false);
  }
}
  return (
    <View style={styles.container}>
      {isLoading == true ? <ActivityIndicator size={35} color='green'/> : 
      (<View  style={styles.container}>
        <Text style={styles.text}>Sign in with your pin</Text>
        <Pressable onPress={() => _focus()}>
          <View style={styles.row}>
            {[
              ...new Array(CODE_LENGTH).fill(null).map((_, i) => (
                <View key={i} style={{ ...styles.pinElement, ...(code && i < code.length && styles.activePinElement) }} />
                )),
            ]}
              <TextInput autoFocus style={styles.invisible} keyboardType='number-pad' maxLength={6} ref={inputRef} value={code} onChangeText={setCode} />
            </View>
        </Pressable>
        {isError == true && code.length === CODE_LENGTH && <Text style={{fontSize: 16, color: 'red'}}>Code is not correct, please try again!</Text>}
      </View>
      )
      }
        
    </View>
  )
}

export default SignIn

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
  },
  text: {
      fontSize: 16,
      marginBottom: 15,
  },
  pinElement: {
      marginRight: 5,
      borderRadius: 20,
      width: 30,
      height: 30,
      backgroundColor: '#5AA469',
      borderWidth: 1,
      borderColor: '#D35D6E',
      fontSize: 16,
      color: 'black',
      textAlign: 'center',
      marginBottom: 15,
  },
  activePinElement: {
      backgroundColor: '#D35D6E',
  },
  row: {
      flexDirection: 'row',
  },
  invisible: {
      width: 0,
      height: 0,
  }
});