import React, { useEffect } from 'react';
import { 
  View,
  ActivityIndicator,
  Text
} from 'react-native';

import { createDrawerNavigator } from '@react-navigation/drawer';

import { DrawerContent } from './components/Drawer';

import MainTabScreen from './screens/MainTab';
import EditProfile from './screens/StaffUser/Profile';
// import SettingsScreen from './screens/SettingsScreen';
// import BookmarkScreen from './screens/BookmarkScreen';

import AsyncStorage from '@react-native-community/async-storage';

import jwtDecode from "jwt-decode";

import {
  Provider as AntModalProvider,
  Button,
  Modal,
  Toast,
  WhiteSpace,
  WingBlank,
} from '@ant-design/react-native';

import { postService, API_ROUTES, refreshToken, getCmDetails } from './Server';

import RootStackScreen from './screens/RootStack';

const Drawer = createDrawerNavigator();

import { 
  NavigationContainer, 
  DefaultTheme as NavigationDefaultTheme,
  DarkTheme as NavigationDarkTheme
} from '@react-navigation/native';

import { 
  Provider as PaperProvider, 
  MD3LightTheme as PaperDefaultTheme,
  MD3DarkTheme as PaperDarkTheme 
} from 'react-native-paper';

import { loginActions, valuesActions, myDispatch, mySelector } from './redux';


const App = () => {

  const [loading, setLoading] = React.useState(true);

  const dispatch = myDispatch();

  const loginData = mySelector(state=>state.Login.value.loginData);
  const baseUrl = mySelector(state=>state.Login.value.baseUrl);
  const alert = mySelector(state=>state.Values.value.alert);
  const isDarkTheme = mySelector(state=>state.Values.value.toggleTheme);

  const handleNoOtpAuth = async()=>{

    AsyncStorage.getItem('loginData').then((item)=>{

      const data = JSON.parse(item)

      if(data?.email){

        dispatch(loginActions.setLoginData({
          email: data.email,
          type: data.type,
          token: null
        }));
  
        getCmDetails(baseUrl, dispatch, data.email);
      }
      
      setLoading(false);

    }).catch((error)=>{

      console.log('Error in handle NoOtpAuth ', error)
      setLoading(false);
    })
  }

  const checkDevEnv = async()=>{
    try {

      const devEnv = await AsyncStorage.getItem('devEnv')
      if( JSON.parse(devEnv) === true) dispatch(loginActions.toggleDevEnv())
    }
    catch (error) {

      console.log('Error in check devEnv ', error)
    }
  }


  useEffect(() => {

    checkDevEnv();

    AsyncStorage.getItem('noOtp').then((noOtp) => {

      if(JSON.parse(noOtp) === true){

        dispatch(loginActions.toggleNoOtp())
        handleNoOtpAuth();
      }
      else{

        try {

          AsyncStorage.getItem('token').then((token) => {

            if(token){

              let decoded = jwtDecode(token);
              if(!(decoded.exp < (Date.now() / 1000))){

                dispatch(loginActions.setLoginData({
                    email: decoded.email,
                    type: decoded.type,
                    token: token
                }));

                getCmDetails(baseUrl, dispatch, decoded.email);

                setLoading(false);

              }
              else refreshToken(baseUrl, dispatch, setLoading);
            }
            else setLoading(false);

          })
        } catch(e) {
          dispatch(valuesActions.error({error:`Error in Get AsyncStorage Token ${error}`}));
        }
      }
    }).catch((e)=>{
      console.log('Error in get noOtp', e)
      setLoading(false);
    })
  }, []); 

  if( loading ) {
    return(
      <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
        <ActivityIndicator size="large"/>
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
      primary: '#143c92'
    }
  }
  
  const CustomDarkTheme = {
    ...NavigationDarkTheme,
    ...PaperDarkTheme,
    colors: {
      ...NavigationDarkTheme.colors,
      ...PaperDarkTheme.colors,
      background: '#333333',
      text: '#ffffff',
      primary: '#143c92'
    }
  }

  const theme = isDarkTheme ? CustomDarkTheme : CustomDefaultTheme;

  const moadlTextColor = {
    primary : '#3701b3',
    warning : '#b00020',
    alert : '#ffdf00',
    secondary : '#0237ff',
  }

  return (
    <PaperProvider theme={theme}>
      <AntModalProvider>
        <NavigationContainer theme={theme}>
          { loginData?.email ? (
              <Drawer.Navigator drawerContent={props => <DrawerContent {...props} dispatch={dispatch} />} screenOptions={{headerShown:false}}>
                <Drawer.Screen name="HomeDrawer" component={MainTabScreen} />
                <Drawer.Screen name="ProfileEdit" component={EditProfile} />
                {/* <Drawer.Screen name="SettingsScreen" component={SettingsScreen} />
                <Drawer.Screen name="BookmarkScreen" component={BookmarkScreen} /> */}
              </Drawer.Navigator>
            )
            :
            <RootStackScreen />
          }
        </NavigationContainer>
        <Modal
          popup
          visible={alert.show}
          animationType="slide-up"
          maskClosable={true}
          onClose={()=>{
            dispatch(valuesActions.setAlert({
              text : '',
              style : '',
              show : false,
              type : ''
            }))
          }}>
          <View style={{ paddingVertical: 20, paddingHorizontal: 0, borderRadius:12 }}>
            <Text style={{ textAlign: 'center', color:moadlTextColor[alert.style] ?? '#000', fontSize:16, fontWeight:'500' }}>{alert.text}</Text>
          </View>
        </Modal>
      </AntModalProvider>
    </PaperProvider>
  )
}

export default App;