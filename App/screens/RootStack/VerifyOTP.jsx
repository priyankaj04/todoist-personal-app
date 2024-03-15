import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Platform,
    StyleSheet,
    StatusBar,
    Dimensions
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { vh as CssVh, vw as CssVw } from 'react-native-css-vh-vw';
const { width, height } = Dimensions.get('window');
import { useTheme } from 'react-native-paper';
import { loginActions, valuesActions, myDispatch, mySelector } from '../../redux';
import { postService, API_ROUTES } from '../../server';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SignInScreen = ({ navigation }) => {

    const dispatch = myDispatch();
    const baseUrl = mySelector(state => state.Login.value.baseUrl);
    const email = mySelector(state => state.Login.value.loginData?.email);
    const cpVersion = mySelector(state => state.Login.value.cpVersion);
    const [loading, setLoading] = useState(false);
    const [otp, setOtp] = useState('')
    const { colors } = useTheme();
    const [fmctoken, setFMCToken] = useState('');

    useEffect(() => {
        AsyncStorage.getItem('fcmToken').then((res) => setFMCToken(res));
    }, [])

    const updateUserData = async (userData) => {
        try {

            await AsyncStorage.setItem('email', email);
            await AsyncStorage.setItem('refreshToken', userData.token);
            await AsyncStorage.setItem('token', userData.token);
            await AsyncStorage.setItem('corporateid', userData.data)

            dispatch(loginActions.setLoginData({
                email: email,
                token: userData.token,
                corporateid: parseInt(userData.data)
            }))
        } catch (e) {
            console.log(e);
        }
    }

    const handleVerifyOTP = () => {
        setLoading(true);
        let req_body = {
            "email": email,
            "otp": otp,
            
        }
        postService(baseUrl, API_ROUTES.VERIFY_OTP, req_body).then((response) => {
            if (response.status === 1) {
                updateUserData(response);
            } else {
                dispatch(valuesActions.statusNot1(response.msg));
            }
            setLoading(false);
        }).catch((error) => {
            dispatch(valuesActions.error({ error: `Error in Verify User ${error}` }));
        })
    }

    return (
        <View>
            <StatusBar translucent backgroundColor="transparent" />
            <View
                style={{
                    backgroundColor: colors.background,
                    marginTop: 50, height: CssVh(100)
                }}
            >
                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <TouchableOpacity onPress={() => { navigation.goBack(); }} style={{ padding: 5, backgroundColor: 'rgba(0,0,0,0.025)', borderRadius: 25, marginLeft: 10 }}>
                        <Feather
                            name="arrow-left"
                            color="#000"
                            size={36}
                        />
                    </TouchableOpacity>
                </View>
                <Text style={{
                    fontSize: 30,
                    color: colors.text,
                    textAlign: 'center',
                    fontFamily: 'Nunito ExtraBold'
                }}>Check you email</Text>
                <Text style={{ ...styles.text, textAlign: 'center', fontFamily: 'Nunito Regular', fontSize: 18 }}>
                    To continue, enter the OTP we just sent to {email}
                </Text>
                <View style={{ alignItems: 'center', marginTop: 35 }}>
                    <TextInput
                        placeholder="Enter OTP"
                        placeholderTextColor="#555555"
                        style={styles.textField}
                        underlineColorAndroid="transparent"
                        importantForAutofill="noExcludeDescendants"
                        autoCapitalize="none"
                        onChangeText={(val) => setOtp(val)}
                    />
                    <TouchableOpacity onPress={() => { handleVerifyOTP() }}>
                        <View
                            style={{ ...styles.signIn, marginTop: 30 }} >
                            <Text style={styles.textSign}>Verify OTP</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View
                    style={{
                        position: 'absolute',
                        bottom: Platform.OS === 'ios' ? 25 : 15,
                        flexDirection: 'row',
                        justifyContent: 'center',
                        width: CssVw(100)
                    }}
                >
                    <Text style={{ ...styles.text, fontSize: 12 }}>CodePush version- {cpVersion ?? 0},  AppVersion- 1</Text>
                </View>
            </View>
        </View>
    );
};

export default SignInScreen;

const vh = height;
const vw = width;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#143c92',
    },
    header: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center'
    },
    footer: {
        flex: 1,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingVertical: 30,
        paddingHorizontal: 30
    },
    logo: {
        width: vw * 0.8,
        height: vw * .125
    },
    title: {
        color: '#05375a',
        fontSize: 25,
        fontWeight: 'bold'
    },
    text: {
        color: 'grey',
        marginTop: 0,
        fontFamily: 'Nunito Regular'
    },
    button: {
        alignItems: 'center',
        marginTop: 20
    },
    signIn: {
        width: 358,
        height: 54,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        flexDirection: 'row',
        marginTop: 20,
        backgroundColor: '#4576DC'
    },
    textSign: {
        color: 'white',
        fontFamily: 'Nunito ExtraBold',
        fontSize: 18
    },
    textField: {
        fontFamily: 'Nunito Regular',
        fontSize: 18,
        color: 'black',
        backgroundColor: '#F0F1F4',
        borderRadius: 5,
        width: 358,
        padding: 16,
        height: 54
    },
    borderButton: {
        width: 358,
        height: 54,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        flexDirection: 'row',
        marginTop: 20,
        borderColor: '#eee',
        borderWidth: 1
    },
    textSignBorder: {
        color: '#555555',
        fontFamily: 'Nunito Bold',
        fontSize: 18
    },
});
