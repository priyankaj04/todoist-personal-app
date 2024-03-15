import React, { useState,useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    StyleSheet,
    StatusBar,
    Image,
    TextInput,
    Platform,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import assets from '../../assets';
import { vh as CssVh, vw as CssVw } from 'react-native-css-vh-vw';
import { Provider } from 'react-native-paper';
import { loginActions, valuesActions, myDispatch, mySelector } from '../../redux';
import { postService, API_ROUTES } from '../../server';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SplashScreen = ({ navigation }) => {
    const { colors } = useTheme();
    const dispatch = myDispatch();
    const [email, setEmail] = useState('');
    const cpVersion = mySelector(state => state.Login.value.cpVersion);
    const baseUrl = mySelector(state => state.Login.value.baseUrl);
    const [fmctoken, setFMCToken] = useState('');

    useEffect(() => {
        AsyncStorage.getItem('fcmToken').then((res) => setFMCToken(res));
    }, [])

    const handleVerifyOTP = () => {
        let req_body = {
            "email": email,
            "devicetoken": fmctoken,
            "device": Platform.OS
        }

        postService(baseUrl, API_ROUTES.GET_OTP, req_body).then((response) => {
            if (response.status === 1) {
                dispatch(loginActions.setLoginData({ email: email }));
                navigation.navigate('VerifyOTP');
            } else {
                dispatch(valuesActions.statusNot1(response.msg));
            }
        }).catch((error) => {
            dispatch(valuesActions.error({ error: `Error in Verify User ${error}` }));
        })
    }

    return (
        <Provider>
            <StatusBar translucent backgroundColor="transparent" />
            <View
                style={{
                    backgroundColor: colors.background,
                    marginTop: 50, height: CssVh(100)
                }}
            >
                {/*<View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <TouchableOpacity onPress={() => { navigation.navigate(-1); }} style={{ padding: 5, backgroundColor: 'rgba(0,0,0,0.025)', borderRadius: 25, marginLeft: 10 }}>
                        <Feather
                            name="arrow-left"
                            color="#000"
                            size={36}
                        />
                    </TouchableOpacity>
            </View>*/}
                <Text style={{
                    fontSize: 30,
                    color: colors.text,
                    textAlign: 'center',
                    fontFamily: 'Nunito ExtraBold'
                }}>Welcome to <Text style={{ fontSize: 40, fontFamily: 'Nunito Bold' }}>π</Text></Text>
                <Text style={{ ...styles.text, textAlign: 'center', fontFamily: 'Nunito Regular', fontSize: 18 }}>A window into your team’s health</Text>
                <View style={{ alignItems: 'center', marginTop: 35 }}>
                    <TextInput
                        placeholder="Enter your email"
                        placeholderTextColor="#555555"
                        style={styles.textField}
                        underlineColorAndroid="transparent"
                        importantForAutofill="noExcludeDescendants"
                        autoCapitalize="none"
                        onChangeText={(val) => setEmail(val)}
                    />
                    <TouchableOpacity onPress={() => { handleVerifyOTP() }}>
                        <View
                            style={{ ...styles.signIn, marginTop: 30 }} >
                            <Text style={styles.textSign}>Get OTP</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{ margin: 24, alignItems: 'center', height: 20 }}>
                    <View style={{ width: '100%', height: 1, borderTopColor: '#eee', borderTopWidth: 1, marginTop: 15 }}></View>
                    <Text style={{ color: 'gray', textAlign: 'center', fontFamily: 'Nunito Regular', position: 'absolute', fontSize: 18, backgroundColor: 'white', paddingHorizontal: 10 }}>or</Text>
                </View>
                <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 15 }}>
                    <TouchableOpacity onPress={() => { navigation.navigate('SignInScreen'); }}>
                        <View
                            style={styles.borderButton} >
                            <Image source={assets.ImageBaseUrl('google')} height={20} width={20} style={{ marginRight: 20 }} /><Text style={styles.textSignBorder}>Continue with Google</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { navigation.navigate('SignInScreen'); }}>
                        <View
                            style={styles.borderButton} >
                            <Image source={assets.ImageBaseUrl('microsoft')} height={20} width={20} style={{ marginRight: 20 }} /><Text style={styles.textSignBorder}>Continue with Microsoft</Text>
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
        </Provider>
    );
};

export default SplashScreen;

const { height, width } = Dimensions.get("screen");
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

