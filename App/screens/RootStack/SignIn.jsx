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
    Dimensions,
    ImageBackground,
    Image
} from 'react-native';
import assets from '../../assets';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Feather from 'react-native-vector-icons/Feather';
const { width, height } = Dimensions.get('window');
import { useTheme } from 'react-native-paper';
import { loginActions, valuesActions, myDispatch, mySelector } from '../../redux';
import { postService, API_ROUTES } from '../../server';

const SignInScreen = ({ navigation }) => {

    const dispatch = myDispatch();
    const baseUrl = mySelector(state => state.Login.value.baseUrl);
    const [email, setEmail] = React.useState('');
    const { colors } = useTheme();
    const [loading, setLoading] = useState(false);

    const handleVerifyOTP = () => {
        setLoading(true);
        let req_body = {
            "email": email
        }
        
        postService(baseUrl, API_ROUTES.GET_OTP, req_body).then((response) => {
            if (response.status === 1) {
                dispatch(loginActions.setLoginData({ email: email }));
                navigation.navigate('VerifyOTP');
            } else {
                dispatch(valuesActions.statusNot1(response.msg));
            }
            setLoading(false);
        }).catch((error) => {
            dispatch(valuesActions.error({ error: `Error in Verify User ${error}` }));
        })
    }

    const handlePressOutside = () => {
        Keyboard.dismiss();
    };

    return (
        <TouchableWithoutFeedback onPress={handlePressOutside}>
            <ImageBackground style={{ ...styles.container, display: 'flex', justifyContent: 'flex-end' }} source={assets.ImageBaseUrl('loginbgpi')}>
                <StatusBar translucent backgroundColor="transparent" />
                <KeyboardAvoidingView
                    style={{
                        backgroundColor: colors.background,
                        ...styles.footer,
                        height: 300
                    }}
                >
                    <Text style={{
                        fontSize: 30,
                        color: colors.text,
                        textAlign: 'center',
                        fontFamily: 'Nunito ExtraBold'
                    }}>Welcome to 兀</Text>
                    <Text style={{ color: 'gray', textAlign: 'center', fontFamily: 'Nunito Regular' }}>A window into your team’s health</Text>
                    <View style={{
                        backgroundColor: '#eee',
                        margin: 10,
                        marginTop: 20,
                        borderRadius: 10,
                        height: 50,
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center'
                    }}>
                        <FontAwesome5
                            name="at"
                            color='gray'
                            style={{paddingHorizontal: 10}}
                            size={20}
                        />
                        <TextInput
                            placeholder="Enter your email"
                            placeholderTextColor="#666666"
                            style={{
                                fontFamily: 'Nunito Regular',
                                fontSize: 16,
                                color: colors.data, flex: 1
                            }}
                            underlineColorAndroid="transparent"
                            importantForAutofill="noExcludeDescendants"
                            autoCapitalize="none"
                            onChangeText={(val) => setEmail(val)}
                        />
                    </View>
                    <View style={styles.button}>
                        <TouchableOpacity onPress={() => { handleVerifyOTP()}}>
                            <View
                                style={{ ...styles.signIn, backgroundColor: colors.alpha }}
                            >
                                <Text style={styles.textSign}>Get OTP</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </ImageBackground>
        </TouchableWithoutFeedback>
    );
};

export default SignInScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingBottom: 25
    },
    footer: {
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
        color: '#05375a'
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
    },
    item: {
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        width: width - 40,
        borderRadius: 8
    },
});
