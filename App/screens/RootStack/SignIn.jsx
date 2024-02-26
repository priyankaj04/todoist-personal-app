import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Platform,
    StyleSheet,
    StatusBar,
    ActivityIndicator,
    KeyboardAvoidingView,
    Keyboard,
    TouchableWithoutFeedback,
    ScrollView,
    Dimensions
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
const { width, height } = Dimensions.get('window');

import { useTheme } from 'react-native-paper';

import { loginActions, valuesActions, myDispatch, mySelector } from '../../redux';

import Users from '../../utils';

import { postService, API_ROUTES, getCmDetails } from '../../server';

import AsyncStorage from '@react-native-async-storage/async-storage';

const SignInScreen = ({ navigation }) => {

    const dispatch = myDispatch();
    const baseUrl = mySelector(state => state.Login.value.baseUrl);
    const noOtp = mySelector(state => state.Login.value.noOtp);

    const [loading, setLoading] = useState(false)

    const [data, setData] = React.useState({
        email: '',
        password: '',
        check_textInputChange: false,
        secureTextEntry: true,
        isValidUser: true,
        isValidPassword: true,
        loginType: null,
    });

    const [openPicker, setOpenPicker] = React.useState(false);
    const [allEntered, setAllEntered] = useState(false);

    const loginTypes = [
        'admin',
        'carecoordinator',
        'ccsupport',
        'ccsupport1',
        'ccsupport2',
        'crmsupport',
    ]

    const { colors } = useTheme();

    // const { signIn } = React.useContext(AuthContext);

    const textInputChange = (val) => {
        const emailRegex = /\S+@\S+\.\S+/;

        if (emailRegex.test(val)) {
            setData({
                ...data,
                email: val,
                check_textInputChange: true,
                isValidUser: true
            });
        } else {
            setData({
                ...data,
                email: val,
                check_textInputChange: false,
                isValidUser: true
            });
        }
    }

    const handlePasswordChange = (val) => {
        if (val.trim().length >= 4) {
            setData({
                ...data,
                password: val,
                isValidPassword: true
            });
        } else {
            setData({
                ...data,
                password: val,
                isValidPassword: false
            });
        }
    }

    const updateSecureTextEntry = () => {
        setData({
            ...data,
            secureTextEntry: !data.secureTextEntry
        });
    }

    const handleValidEmail = (val) => {
        const emailRegex = /\S+@\S+\.\S+/;

        if (emailRegex.test(val)) {
            setData({
                ...data,
                isValidUser: true
            });
        } else {
            setData({
                ...data,
                isValidUser: false
            });
        }
    }

    const updateUserData = async (userData) => {
        try {
            await AsyncStorage.setItem('email', userData.email);
            await AsyncStorage.setItem('refreshToken', userData.rt);
            await AsyncStorage.setItem('token', userData.token);
            await AsyncStorage.setItem('type', userData.type);
            await AsyncStorage.setItem('noOtp', JSON.stringify(false));

            dispatch(loginActions.setLoginData({
                email: userData.email,
                type: userData.type,
                token: userData.token
            }))

            getCmDetails(baseUrl, dispatch, userData.email);

        } catch (e) {
            console.log(e);
        }
    }

    const noOtpLogin = async (email, loginType) => {

        try {
            await AsyncStorage.setItem('loginData', JSON.stringify({ email: email, type: loginType }));

            dispatch(loginActions.setLoginData({
                email: email,
                type: loginType,
                token: null
            }))

            getCmDetails(baseUrl, dispatch, email);

        } catch (e) {
            console.log(e);
        }
    }

    const loginHandle = (email, password, loginType) => {

        if (noOtp) { noOtpLogin(email, loginType); return; }

        setLoading(true);

        let req_body = {
            "email": email,
            "password": password,
            "type": loginType
        }

        postService(baseUrl, API_ROUTES.VERIFY_USER, req_body).then((response) => {
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

    useEffect(() => {
        if (Object.values(data).every(value => value && value !== '')) setAllEntered(true);
        else setAllEntered(false);
    }, [data])

    const handlePressOutside = () => {
        Keyboard.dismiss();
    };

    const renderItem = (item, i) => {
        return (
            <TouchableOpacity
                style={[
                    styles.item,
                    { backgroundColor: data.loginType == item ? '#143c92' : '#f6f6f6' }
                ]}
                key={i}
                onPress={() => {
                    setData({ ...data, loginType: item });
                    setOpenPicker(false)
                }}
            >
                <Text style={{ fontSize: 15, color: data.loginType == item ? '#fff' : '#000' }}>  {item}</Text>
            </TouchableOpacity>
        );
    };

    return (
        <TouchableWithoutFeedback onPress={handlePressOutside}>
            <View style={styles.container}>
                <StatusBar translucent backgroundColor="transparent" />
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }} >
                    <View style={styles.header}>
                        <Text style={styles.text_header}>Welcome!</Text>
                    </View>
                    <Animatable.View
                        animation="fadeInUpBig"
                        style={[styles.footer, {
                            backgroundColor: colors.background
                        }]}
                    >
                        <Text style={[styles.text_footer, {
                            color: colors.text
                        }]}>Registered Email</Text>
                        <View style={styles.action}>
                            <FontAwesome
                                name="user-o"
                                color={colors.text}
                                size={20}
                            />
                            <TextInput
                                placeholder="Your ch email"
                                placeholderTextColor="#666666"
                                style={[styles.textInput, {
                                    color: colors.text
                                }]}
                                underlineColorAndroid="transparent"
                                importantForAutofill="noExcludeDescendants"
                                autoCapitalize="none"
                                onChangeText={(val) => textInputChange(val)}
                                onEndEditing={(e) => handleValidEmail(e.nativeEvent.text)}
                            />
                            {data.check_textInputChange ?
                                <Animatable.View
                                    animation="bounceIn"
                                >
                                    <Feather
                                        name="check-circle"
                                        color="green"
                                        size={20}
                                    />
                                </Animatable.View>
                                : null}
                        </View>
                        {data.isValidUser ? null :
                            <Animatable.View animation="fadeInLeft" duration={500}>
                                <Text style={styles.errorMsg}>Please enter a valid email.</Text>
                            </Animatable.View>
                        }


                        <Text style={[styles.text_footer, {
                            color: colors.text,
                            marginTop: 20
                        }]}>Password</Text>
                        <View style={styles.action}>
                            <Feather
                                name="lock"
                                color={colors.text}
                                size={20}
                            />
                            <TextInput
                                placeholder="Your Password"
                                placeholderTextColor="#666666"
                                secureTextEntry={data.secureTextEntry ? true : false}
                                style={[styles.textInput, {
                                    color: colors.text
                                }]}
                                underlineColorAndroid="transparent"
                                importantForAutofill="noExcludeDescendants"
                                autoCapitalize="none"
                                onChangeText={(val) => handlePasswordChange(val)}
                            />
                            <TouchableOpacity
                                onPress={updateSecureTextEntry}
                            >
                                {data.secureTextEntry ?
                                    <Feather
                                        name="eye"
                                        color="grey"
                                        size={20}
                                    />
                                    :
                                    <Feather
                                        name="eye-off"
                                        color="grey"
                                        size={20}
                                    />
                                }
                            </TouchableOpacity>
                        </View>
                        {data.isValidPassword ? null :
                            <Animatable.View animation="fadeInLeft" duration={500}>
                                <Text style={styles.errorMsg}>Password must be min 4 characters long.</Text>
                            </Animatable.View>
                        }

                        <Text style={[styles.text_footer, {
                            color: colors.text,
                            marginTop: 20
                        }]}>Login Type</Text>
                        <TouchableOpacity
                            style={styles.action}
                            onPress={() => setOpenPicker(!openPicker)}
                        >
                            <Feather
                                name="at-sign"
                                color={colors.text}
                                size={20}
                            />
                            <Text
                                style={{
                                    color: data?.loginType ? colors.text : "#666666",
                                    marginLeft: 10,
                                    flex: 1,
                                    marginBottom: 15
                                }}
                            >
                                {data?.loginType ?? 'Select a login type'}
                            </Text>

                            {data.loginType ?
                                <Animatable.View
                                    animation="bounceIn"
                                >
                                    <Feather
                                        name="check-circle"
                                        color="green"
                                        size={20}
                                    />
                                </Animatable.View>
                                : null}
                        </TouchableOpacity>

                        {
                            openPicker &&
                            <View
                                style={{
                                    borderRadius: 8,
                                    height: 250,
                                }}>
                                <ScrollView
                                    showsVerticalScrollIndicator={false}
                                >
                                    <View
                                        style={{
                                            backgroundColor: '#f5f5f5',
                                            borderRadius: 8
                                        }}
                                    >
                                        {loginTypes.map((item, i) => renderItem(item, i))}
                                    </View>
                                    <View
                                        style={{
                                            paddingBottom: 80
                                        }}
                                    />
                                </ScrollView>
                            </View>
                        }


                        <View style={styles.buttonView}>
                            <View style={styles.button}>
                                <TouchableOpacity
                                    style={styles.signIn}
                                    onPress={() => { allEntered && loginHandle(data.email, data.password, data.loginType) }}
                                >
                                    <LinearGradient
                                        colors={
                                            allEntered ?
                                                ['#3c68c7', '#143c92']
                                                :
                                                ['#bbc0ca', '#767676']
                                        }
                                        style={styles.signIn}
                                    >
                                        {
                                            !loading ?
                                                <Text style={[styles.textSign, { color: '#fff' }]}>Sign In</Text>
                                                :
                                                <ActivityIndicator size="small" color={'#fff'} />
                                        }
                                    </LinearGradient>
                                </TouchableOpacity>

                                {/* sign up button commented */}
                                {/* <TouchableOpacity
                                onPress={() => navigation.navigate('SignUpScreen')}
                                style={[styles.signIn, {
                                    borderColor: '#143c92',
                                    borderWidth: 1,
                                    marginTop: 15
                                }]}
                            >
                                <Text style={[styles.textSign, {
                                    color: '#143c92'
                                }]}>Sign Up</Text>
                            </TouchableOpacity> */}
                            </View>
                        </View>
                    </Animatable.View>
                </KeyboardAvoidingView>
            </View>
        </TouchableWithoutFeedback>
    );
};

export default SignInScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#143c92'
    },
    header: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingBottom: 25
    },
    footer: {
        flex: 4,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 30
    },
    text_header: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 30
    },
    text_footer: {
        color: '#001f35',
        fontSize: 18,
        fontWeight: 'semibold',
    },
    action: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
    },
    textInput: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        paddingLeft: 10,
        color: '#05375a',
    },
    errorMsg: {
        color: '#FF0000',
        fontSize: 14,
        paddingTop: 5
    },
    buttonView: {
        flex: 1,
    },
    button: {
        alignItems: 'center',
        marginTop: 50,
        width: '100%',
        position: 'absolute',
        bottom: 0
    },
    signIn: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    textSign: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    item: {
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        width: width - 40,
        borderRadius: 8
    },
});
