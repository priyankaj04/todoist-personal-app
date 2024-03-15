import React from 'react';
import { 
    View, 
    Text, 
    Button, 
    TouchableOpacity, 
    Dimensions,
    TextInput,
    Platform,
    StyleSheet,
    ScrollView,
    StatusBar
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';

const SignInScreen = ({navigation}) => {

    const [data, setData] = React.useState({
        username: '',
        password: '',
        confirm_password: '',
        check_textInputChange: false,
        secureTextEntry: true,
        confirm_secureTextEntry: true,
    });

    const textInputChange = (val) => {
        if( val.length !== 0 ) {
            setData({
                ...data,
                username: val,
                check_textInputChange: true
            });
        } else {
            setData({
                ...data,
                username: val,
                check_textInputChange: false
            });
        }
    }

    const handlePasswordChange = (val) => {
        setData({
            ...data,
            password: val
        });
    }

    const handleConfirmPasswordChange = (val) => {
        setData({
            ...data,
            confirm_password: val
        });
    }

    const updateSecureTextEntry = () => {
        setData({
            ...data,
            secureTextEntry: !data.secureTextEntry
        });
    }

    const updateConfirmSecureTextEntry = () => {
        setData({
            ...data,
            confirm_secureTextEntry: !data.confirm_secureTextEntry
        });
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
        </View>
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
        paddingBottom: 50
    },
    footer: {
        flex: Platform.OS === 'ios' ? 3 : 5,
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
        color: '#05375a',
        fontSize: 18
    },
    action: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 5
    },
    textInput: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        paddingLeft: 10,
        color: '#05375a',
    },
    button: {
        alignItems: 'center',
        marginTop: 50
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
    textPrivate: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 20
    },
    color_textPrivate: {
        color: 'grey'
    }
  });
