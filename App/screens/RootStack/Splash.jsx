import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    StyleSheet,
    StatusBar,
    Image,
    TextInput,
    Platform
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
    const [visible, setVisible] = useState(false);
    const [authorised, setAuthorised] = useState(false);

    const dispatch = myDispatch();
    const devEnv = mySelector(state => state.Login.value.devEnv);
    const noOtp = mySelector(state => state.Login.value.noOtp);
    const cpVersion = mySelector(state => state.Login.value.cpVersion);

    const showModal = () => setVisible(true);
    const hideModal = () => {
        setVisible(false);
        setAuthorised(false);
    }

    const containerStyle = {
        backgroundColor: 'white',
        margin: 20,
        borderRadius: 8,
        minHeight: 150,
        padding: 20,
        justifyContent: 'center',
    };

    const toggleNoOtp = async () => {

        await AsyncStorage.setItem('noOtp', JSON.stringify(!noOtp));
        dispatch(loginActions.toggleNoOtp());
    }

    const toggleDevEnv = async () => {

        await AsyncStorage.setItem('devEnv', JSON.stringify(!devEnv));
        dispatch(loginActions.toggleDevEnv());
    }

    return (
        <Provider>
            <View style={styles.container}>
                <StatusBar translucent backgroundColor="transparent" />
                <TouchableOpacity style={styles.header} onLongPress={showModal}>
                    <Animatable.Image
                        animation="bounceIn"
                        duraton="3500"
                        source={assets.ImageBaseUrl('ch-logo-white')}
                        style={styles.logo}
                        resizeMode="stretch"
                    />
                    <Text style={{ color: '#fff', fontSize: 18, fontWeight: '600' }}>
                        {devEnv ? 'Dev ' : ''}
                        {noOtp ? ' No Otp ' : ''}
                    </Text>
                </TouchableOpacity>
                <Animatable.View
                    style={[styles.footer, {
                        backgroundColor: colors.background
                    }]}
                    animation="fadeInUpBig"
                >
                    <Text style={[styles.title, {
                        color: colors.text
                    }]}>Hi, Circle Pi! Let's get started with our app!</Text>
                    <Text style={styles.text}>Sign in with your account</Text>
                    <View style={styles.button}>
                        <TouchableOpacity onPress={() => { navigation.navigate('SignInScreen'); }}>
                            <LinearGradient
                                colors={['#3c68c7', '#143c92']}
                                style={styles.signIn}
                            >
                                <Text style={styles.textSign}>Get Started</Text>
                                <MaterialIcons
                                    name="navigate-next"
                                    color="#fff"
                                    size={20}
                                />
                            </LinearGradient>
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
                        <Text style={styles.text}>CodePush version- {cpVersion ?? 0},  AppVersion- 1</Text>
                    </View>
                </Animatable.View>
            </View>
            <Portal>
                <Modal visible={visible} onDismiss={hideModal}>
                    <View style={containerStyle} >
                        {
                            !authorised ?
                                <>
                                    <Text style={{ color: '#000' }}>Enter the password</Text>
                                    <TextInput
                                        style={{
                                            color: '#000',
                                            padding: 5,
                                            borderWidth: 1,
                                            borderRadius: 5,
                                            marginTop: 10
                                        }}
                                        onChangeText={(val) => {
                                            if (val === 'circlehealthadmin') setAuthorised(true);
                                        }}
                                    />
                                </>
                                :
                                <>
                                    <View
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            justifyContent: 'space-between'
                                        }}
                                    >
                                        <Text style={{ color: '#000', fontWeight: '600' }}>Environment -</Text>

                                        <View
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'row',
                                                columnGap: 10
                                            }}
                                        >
                                            <Text style={{ color: '#000' }}>Dev</Text>
                                            <TouchableOpacity
                                                style={{
                                                    borderRadius: 10,
                                                    height: 20,
                                                    width: 20,
                                                    borderWidth: 2,
                                                    backgroundColor: devEnv ? '#628ae1' : '#fff'
                                                }}
                                                onPress={toggleDevEnv}
                                            />
                                        </View>

                                        <View
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'row',
                                                columnGap: 10,
                                                marginRight: 5
                                            }}
                                        >
                                            <Text style={{ color: '#000' }}>Production</Text>
                                            <TouchableOpacity
                                                style={{
                                                    borderRadius: 10,
                                                    height: 20,
                                                    width: 20,
                                                    borderWidth: 2,
                                                    backgroundColor: !devEnv ? '#628ae1' : '#fff'
                                                }}
                                                onPress={toggleDevEnv}
                                            />
                                        </View>
                                    </View>
                                    <View
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            marginTop: 20
                                        }}
                                    >
                                        <Text style={{ color: '#000', fontWeight: '600' }}>Login type -</Text>

                                        <View
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'row',
                                                columnGap: 10
                                            }}
                                        >
                                            <Text style={{ color: '#000' }}>No Otp</Text>
                                            <TouchableOpacity
                                                style={{
                                                    borderRadius: 10,
                                                    height: 20,
                                                    width: 20,
                                                    borderWidth: 2,
                                                    backgroundColor: noOtp ? '#628ae1' : '#fff'
                                                }}
                                                onPress={toggleNoOtp}
                                            />
                                        </View>

                                        <View
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'row',
                                                columnGap: 10,
                                                marginRight: 5
                                            }}
                                        >
                                            <Text style={{ color: '#000' }}>Otp</Text>
                                            <TouchableOpacity
                                                style={{
                                                    borderRadius: 10,
                                                    height: 20,
                                                    width: 20,
                                                    borderWidth: 2,
                                                    backgroundColor: !noOtp ? '#628ae1' : '#fff'
                                                }}
                                                onPress={toggleNoOtp}
                                            />
                                        </View>
                                    </View>
                                </>

                        }

                    </View>
                </Modal>
            </Portal>
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
        paddingVertical: 50,
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
        marginTop: 5
    },
    button: {
        alignItems: 'flex-end',
        marginTop: 30
    },
    signIn: {
        width: 170,
        height: 45,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
        flexDirection: 'row'
    },
    textSign: {
        color: 'white',
        fontWeight: 'bold'
    }
});

