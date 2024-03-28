import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Text, Platform, StatusBar } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { DrawerContent } from './components/Drawer';
import { createStackNavigator } from '@react-navigation/stack';
import MainTabScreen from './screens/MainTab';
import EditProfile from './screens/StaffUser/Profile';
import { vh, vw } from 'react-native-css-vh-vw';

//! Items screens import
import PatientIndex from './screens/Items/Patient';
import Appointments from './screens/Items/Appointments';

import AsyncStorage from '@react-native-async-storage/async-storage';
import jwtDecode from 'jwt-decode';
import {
  Provider as AntModalProvider,
  Button,
  Modal,
  Toast,
  Progress,
  WingBlank,
} from '@ant-design/react-native';
import { postService, API_ROUTES, refreshToken, getCmDetails } from './server';
import RootStackScreen from './screens/RootStack';
import codePush from 'react-native-code-push';
const Drawer = createDrawerNavigator();
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
import Lives from './screens/Lives';
import Claim from './screens/Claim';
import Cdbalance from './screens/Cdbalance';

const App = () => {
  const [loading, setLoading] = React.useState(true);
  const dispatch = myDispatch();

  const loginData = mySelector(state => state.Login.value.loginData);
  const devEnv = mySelector(state => state.Login.value.devEnv);
  const noOtp = mySelector(state => state.Login.value.noOtp);
  const baseUrl = mySelector(state => state.Login.value.baseUrl);
  const alert = mySelector(state => state.Values.value.alert);
  const isDarkTheme = mySelector(state => state.Values.value.toggleTheme);

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

  //! codePush updates

  const [cpUpdate, setCpUpdate] = useState(false);
  const [progress, setProgress] = useState(0);

  //useEffect to handel only codePush
  useEffect(() => {
    codePush
      .getUpdateMetadata()
      .then(metadata => {
        dispatch(loginActions.setCpVersion(metadata?.label ?? ''));
      })
      .catch(error => {
        console.log('codePush error', error);
      });
  }, []);

  let codePushOptions = {
    checkFrequency: codePush.CheckFrequency.ON_APP_START,
    installMode: codePush.InstallMode.IMMEDIATE,
  };

  codePush.sync(
    codePushOptions,
    status => {
      switch (status) {
        case codePush.SyncStatus.DOWNLOADING_PACKAGE:
          console.log('CODE PUSH DOWNLOADING');
          setCpUpdate(true);
          break;
        case codePush.SyncStatus.INSTALLING_UPDATE:
          console.log('CODE PUSH INSTALLING');
          break;
        case codePush.SyncStatus.UPDATE_INSTALLED:
          console.log('CODE PUSH INSTALLED');
          setCpUpdate(false);
          break;
      }
    },
    ({ receivedBytes, totalBytes }) => {
      setProgress(Math.round((receivedBytes / totalBytes) * 100))
    },
  );

  //! codePush updates

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

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
      background: '#333333',
      text: '#ffffff',
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

  const theme = isDarkTheme ? CustomDarkTheme : CustomDefaultTheme;

  const moadlTextColor = {
    primary: '#3701b3',
    warning: '#b00020',
    alert: '#ffdf00',
    secondary: '#0237ff',
  };

  const MainDrawer = () => {
    return (
      <Drawer.Navigator
        drawerContent={props => (
          <DrawerContent {...props} dispatch={dispatch} />
        )}
        screenOptions={{ headerShown: false }}>
        <Drawer.Screen name="HomeDrawer" component={MainTabScreen} />
      </Drawer.Navigator>
    );
  };

  return (
    <PaperProvider theme={theme}>
      <AntModalProvider>
        <NavigationContainer theme={theme}>
          {loginData?.token ? (
            <Stack.Navigator
              initialRouteName={'MainDrawer'}
              screenOptions={{
                headerShown: false,
              }}>
              <Stack.Screen name={'MainDrawer'} component={MainDrawer} >
              </Stack.Screen>
              <Stack.Screen name="ProfileEdit" component={EditProfile} />
              <Stack.Screen name="PatientDetails" component={PatientIndex} />
              <Stack.Screen name="Appointments" component={Appointments} />
              <Stack.Screen name="Lives" component={Lives} />
              <Stack.Screen name="Claims" component={Claim} />
              <Stack.Screen name="Cdbalance" component={Cdbalance} />
            </Stack.Navigator>
          ) : (
            <RootStackScreen />
          )}
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
        <Modal
          popup
          visible={cpUpdate}
          maskClosable={false}
        >
          <View
            style={{
              marginTop: Platform.OS === 'ios' ? vh(6) : StatusBar.currentHeight,
              paddingBottom: 20,
              paddingHorizontal: 0,
              borderRadius: 12,
            }}>
            <Progress
              percent={progress}
            />
            <Text
              style={{
                textAlign: 'center',
                color: moadlTextColor[alert.style] ?? '#000',
                fontSize: 14,
                fontWeight: '500',
                marginTop: 10,
              }}>
              Downloading a App Update please wait {progress}%
            </Text>
          </View>
        </Modal>
      </AntModalProvider>
    </PaperProvider>
  );
};

export default App;
