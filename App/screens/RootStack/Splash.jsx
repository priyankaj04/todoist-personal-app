import React, { useEffect } from 'react';
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
    ImageBackground
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '@react-navigation/native';
import assets from '../../assets';
import { vh as CssVh, vw as CssVw } from 'react-native-css-vh-vw';
import { Modal, Portal, Button, Provider } from 'react-native-paper';
import { loginActions, valuesActions, myDispatch, mySelector } from '../../redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SplashScreen = ({ navigation }) => {
    const { colors } = useTheme();
    const cpVersion = mySelector(state => state.Login.value.cpVersion);
    const logindata = mySelector(state => state.Login.value.loginData);

    useEffect(() => {
        console.log("logindata remote", logindata);
    },[])

    return (
        <Provider>
            <ImageBackground style={styles.container} source={assets.ImageBaseUrl('sidebarbackgroundpi')}>
                <StatusBar translucent backgroundColor="transparent" />
                <Image
                    style={{width: '100%'}}
                    source={assets.ImageBaseUrl('loginpagepi')}
                    height={600}
                />
                <View
                    style={[styles.footer, {
                        backgroundColor: colors.background
                    }]}
                >
                    <Text style={{
                        fontSize: 30,
                        color: colors.text,
                        textAlign:'center',
                        fontFamily:'Nunito ExtraBold'
                    }}>Welcome to 兀</Text>
                    <Text style={{ ...styles.text, textAlign: 'center', fontFamily: 'Nunito Regular' }}>A window into your team’s health</Text>
                    <View style={styles.button}>
                        <TouchableOpacity onPress={() => { navigation.navigate('SignInScreen'); }}>
                            <View
                                style={{ ...styles.signIn, backgroundColor: colors.alpha}}
                            >
                                <Text style={styles.textSign}>Login with Email</Text>
                                <MaterialIcons
                                    name="navigate-next"
                                    color="#fff"
                                    size={20}
                                />
                            </View>
                        </TouchableOpacity>
                    </View>
                    <Text style={{ color: 'gray', textAlign: 'center', marginTop: 4, fontFamily: 'Nunito Regular' }}>or</Text>
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems:'center', justifyContent: 'center', flex: 1 }}>
                        <TouchableOpacity>
                            <Image source={assets.ImageBaseUrl('google')} height={30} width={30} />
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Image source={assets.ImageBaseUrl('microsoft')} height={25} width={25} style={{ marginLeft: 30 }} />
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
            </ImageBackground>
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
        marginTop: 5,
        fontFamily: 'Nunito Regular'
    },
    button: {
        alignItems: 'center',
        marginTop: 20
    },
    signIn: {
        width: 200,
        height: 45,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        flexDirection: 'row'
    },
    textSign: {
        color: 'white',
        fontFamily: 'Nunito Bold',
        fontSize: 16
    }
});

