import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Text, Platform, StatusBar } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { vh, vw } from 'react-native-css-vh-vw';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwtDecode from 'jwt-decode';
import MainDrawer  from './screens/MainTab'
import {
  Provider as AntModalProvider,
  Button,
  Modal,
  Toast,
  Progress,
  WingBlank,
} from '@ant-design/react-native';
const Stack = createStackNavigator();
import {
  NavigationContainer,
  DefaultTheme as NavigationDefaultTheme,
  DarkTheme as NavigationDarkTheme,
} from '@react-navigation/native';
import {
  Provider as PaperProvider,
  MD3LightTheme as PaperDefaultTheme,
  MD3DarkTheme as PaperDarkTheme,
} from 'react-native-paper';
import { loginActions, valuesActions, myDispatch, mySelector } from './redux';
import { notificationListener, requestUserPermission } from './utils'


const App = () => {
  const [loading, setLoading] = React.useState(true);
  const dispatch = myDispatch();

  const loginData = mySelector(state => state.Login.value.loginData);
  const devEnv = mySelector(state => state.Login.value.devEnv);
  const noOtp = mySelector(state => state.Login.value.noOtp);
  const baseUrl = mySelector(state => state.Login.value.baseUrl);
  const alert = mySelector(state => state.Values.value.alert);
  const isDarkTheme = true;
  // const isDarkTheme = mySelector(state => state.Values.value.toggleTheme);

  const checkDevEnv = async () => {
    try {
      const devEnvStored = await AsyncStorage.getItem('devEnv');

      if (JSON.parse(devEnvStored) === true && !devEnv)
        dispatch(loginActions.toggleDevEnv());
    } catch (error) {
      console.log('Error in check devEnv ', error);
    }
  };

  const refreshTheToken = async () => {
    try {
      const devEnvStored = await AsyncStorage.getItem('devEnv');
      refreshToken(
        `https://${JSON.parse(devEnvStored) ? 'dev' : ''}api.circle.care/v1`,
        dispatch,
        setLoading,
      );
    } catch (error) {
      console.log('Something went wrong in refresh token', error);
    }
  };

  useEffect(() => {
    checkDevEnv();
    try {
      AsyncStorage.getItem('token').then((token) => {
        if (token) {
          let decoded = jwtDecode(token);
          setLoading(false);
          if (!(decoded.exp < Date.now() / 1000)) {
            console.log("decoded", decoded)
            dispatch(loginActions.setLoginData({
              email: decoded.email,
              type: decoded.type,
              token: token,
              corporateid: parseInt(decoded.corporateid)
            }));
            setLoading(false);
          } else {
            refreshTheToken();
          }
        } else {
          setLoading(false);
        }
      })
    } catch (e) {
      dispatch(
        valuesActions.error({
          error: `Error in Get AsyncStorage Token ${error}`,
        }),
      );
    }
    // push notification
    notificationListener()
    requestUserPermission()
    // push notification

  }, [])

  const CustomDefaultTheme = {
    ...NavigationDefaultTheme,
    ...PaperDefaultTheme,
    colors: {
      ...NavigationDefaultTheme.colors,
      ...PaperDefaultTheme.colors,
      background: '#ffffff',
      text: '#333333',
      backgroundPrimary: '#143c92',
      alpha: '#2563eb',
      beta: '#D6E0F9',
      gama: '#98B2F1',
      subtitle: '#5B626F',
      data: '#1A1F2C',
      backdrop: '#F0F2F4',
      border: '#F2F5F9',
      blue950: '#172554',
      blue900: '#1e3a8a',
      blue800: '#1e40af',
      blue700: '#1d4ed8',
      blue600: '#2563eb',
      blue500: '#3b82f6',
      blue400: '#60a5fa',
      blue300: '#93c5fd',
      blue200: '#bfdbfe',
      blue100: '#dbeafe',
      blue50: '#eff6ff',
      yellow: '#facc15',
      green: '#4ade80',
      sky: '#38bdf8',
      indigo: '#6366f1',
      gray: '#6b7280'
    },
  };

  const CustomDarkTheme = {
    ...NavigationDarkTheme,
    ...PaperDarkTheme,
    colors: {
      ...NavigationDarkTheme.colors,
      ...PaperDarkTheme.colors,
      background: '#1c1917',
      text: '#ffffff',
      backgroundPrimary: '#143c92',
      alpha: '#f97316',
      beta: '#ea580c',
      gama: '#fdba74',
      subtitle: '#fb923c',
      data: 'white',
      backdrop: '#F0F2F4',
      border: '#44403c',
      yellow: '#fef08a',
      green: '#bbf7d0',
      cyan: '#a5f3fc',
      rose: '#fecdd3',
      gray: '#6b7280',
      lite: '#fed7aa',
      purple: '#e9d5ff',
      blue: '#bfdbfe',
      violet:'#a5b4fc'
    },
  };

  const theme = isDarkTheme ? CustomDarkTheme : CustomDefaultTheme;

  const moadlTextColor = {
    primary: '#3701b3',
    warning: '#b00020',
    alert: '#ffdf00',
    secondary: '#0237ff',
  };

  return (
    <PaperProvider theme={theme}>
      <AntModalProvider>
        <NavigationContainer theme={theme}>
          {
            <Stack.Navigator
              initialRouteName={'MainDrawer'}
              screenOptions={{
                headerShown: false,
              }} >
              <Stack.Screen name={'MainDrawer'} component={MainDrawer} />
              {/*<Stack.Screen name="ProfileEdit" component={EditProfile} />*/}
            </Stack.Navigator>
          }
        </NavigationContainer>
        <Modal
          popup
          visible={alert.show}
          animationType="slide-up"
          maskClosable={true}
          onClose={() => {
            dispatch(
              valuesActions.setAlert({
                text: '',
                style: '',
                show: false,
                type: '',
              }),
            );
          }}>
          <View
            style={{
              paddingVertical: 20,
              paddingHorizontal: 0,
              borderRadius: 12,
            }}>
            <Text
              style={{
                textAlign: 'center',
                color: moadlTextColor[alert.style] ?? '#000',
                fontSize: 16,
                fontWeight: '500',
              }}>
              {alert.text}
            </Text>
          </View>
        </Modal>
      </AntModalProvider>
    </PaperProvider>
  );
};

export default App;
