import { StyleSheet, Text, View, Pressable, TextInput, Alert } from 'react-native'
import React, {useEffect, useRef, useState} from 'react'
import { emailKey,pinKey, emailReg, pinReg } from '../../Constants/Constants';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SignUp = ({navigation}: any):JSX.Element => {

const [email, setEmail] = useState<string>('');
const [isDisabled, setIsDisabled] = useState<boolean>(true);
const [secondStep, setSecondStep] = useState<boolean>(false);
const [thirdStep, setThirdStep] = useState<boolean>(false);
const inputRef = useRef<TextInput>(null);
const [code, setCode] = useState<string>('');
const [confirmedCode, setConfirmedCode] = useState<string>('');
const CODE_LENGTH: number = 6;


const _focus =() => inputRef.current?.focus && inputRef.current?.focus();

useEffect(() => {
    if(emailReg.test(email)){
        setIsDisabled(false);
    }
    else setIsDisabled(true);
},[email]);

useEffect(() => {
    if (pinReg.test(code) && code.length === CODE_LENGTH) {
        setThirdStep(true);
    }
    else setThirdStep(false);
}), [code];

useEffect(() => {
    if (pinReg.test(confirmedCode) && confirmedCode.length === CODE_LENGTH && confirmedCode === code) {
        createUserEmail();
    }
}), [confirmedCode];


const moveNext = () => { setSecondStep(true); setIsDisabled(true); };

const storeData =async ()=> {
    try {
        await AsyncStorage.multiSet([[emailKey, email],[pinKey, code]]);
        navigation.navigate('Home', {email: email});
        console.log('stored!');
    } catch (e) {
        console.log(e);
    }
}
const createUserEmail = async () => {
   try {
    await auth()
    .createUserWithEmailAndPassword(email, code)
    .then(() => {
        storeData();
        Alert.alert('Successfully created user!');
        console.log('User account created & signed in!');
    })
    .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
            
            Alert.alert('Email already in use');
            setConfirmedCode('');
            setCode('');
            setSecondStep(false);
            setThirdStep(false);
            console.log('That email address is already in use!');
            
        }

        if (error.code === 'auth/invalid-email') {
            
            Alert.alert('Invalid email');
            setConfirmedCode('');
            setCode('');
            setThirdStep(false);
            setSecondStep(false);
            console.log('That email address is invalid!');
            
        }

        
    });
   } catch (error) {
    console.error(error);
   }
    
}
  return (
    <View style={styles.container}>
        {
            secondStep == false ? (
                <>
                    <Text>Enter your email</Text>
                    <TextInput style={styles.textInput} value={email} onChangeText={setEmail} />
                    <Pressable disabled={isDisabled} onPress={moveNext} style={isDisabled ? styles.disButton : styles.button}>
                        <Text style={{textAlign: 'center'}}>Next</Text>
                    </Pressable>
                </>
                
            ) : (
                <>
                    {
                        thirdStep == true && (
                            <Pressable onPress={()=>{
                                console.log('Quay lại bước trước.');
                                setSecondStep(true);
                                setCode('');
                                setConfirmedCode('');
                            }} style={{justifyContent:'center', alignItems:'center', marginBottom: 20}}>
                                <View style={{width: 120, height: 35, backgroundColor:'#86efac', justifyContent:'center', alignItems:'center', borderRadius: 20}}>
                                    <Text>{'<- Prev step'}</Text>
                                </View>
                            </Pressable>
                            
                        )
                    }
                    <Text style={styles.text}>{thirdStep == false ? 'Choose a pin code' : 'Confirm your pin code'}</Text>
                    <Pressable onPress={()=> _focus()}>
                        <View style={{flexDirection: 'row'}}>
                            {[
                                ...new Array(CODE_LENGTH).fill(null).map((_, i) => (
                                    <View key={i} style={thirdStep == false ? { ...styles.pinElement, ...(code && i < code.length && styles.activePinElement) }
                                    : { ...styles.pinElement, ...(confirmedCode && i < confirmedCode.length && styles.activePinElement) }}/>
                                ))
                            ]}
                            <TextInput autoFocus style={styles.invisible}
                            keyboardType="number-pad"
                            maxLength={6}
                            ref={inputRef}
                            value={thirdStep == false ? code : confirmedCode}
                            onChangeText={thirdStep == false ? setCode : setConfirmedCode}
                            />
                        </View>
                    </Pressable>
                    {
                        thirdStep == true && confirmedCode.length === CODE_LENGTH &&(
                        <View>
                            {
                                confirmedCode !== code ? 
                                (<Text style={{fontSize: 14, color: 'red'}}>Confirm code not correct!</Text>) 
                                :
                                (<Text style={{fontSize: 14, color: 'green'}}>Confirm code correct!</Text>)
                            }
                        </View>)
                    }
                </>
            )
        }
      
    </View>
  )
}

export default SignUp

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
    textInput: {
        borderWidth: 1,
        width: '80%',
        borderRadius: 10,
        backgroundColor: '#5AA469',
        height: 40,
        borderColor: '#D35D6E',
        marginBottom: 20,
        textAlign: 'center',
        color: '#fff',
    },
    disButton: {
        width: '20%',
        borderRadius: 10,
        padding: 5,
        backgroundColor: '#D3D3D3',
        textAlign: 'center',
        height: 40,
        justifyContent:'center'
    },
    button: {
        width: '20%',
        height: 40,
        borderRadius: 10,
        padding: 5,
        backgroundColor: '#5AA469',
        textAlign: 'center',
        justifyContent:'center'
    },
    pinElement: {
        marginRight: 5,
        borderRadius: 12,
        width: 30,
        height: 35,
        backgroundColor: '#fff',
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
    invisible: {
        width: 0,
        height: 0,
    }
})