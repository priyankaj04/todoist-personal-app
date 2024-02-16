import React, { useEffect } from 'react';
import { 
  View,
  ActivityIndicator,
  Text
} from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { DrawerContent } from './components/Drawer';
import { createStackNavigator } from '@react-navigation/stack';
import MainTabScreen from './screens/MainTab';
import EditProfile from './screens/StaffUser/Profile';

//! Items screens import
import PatientIndex from './screens/Items/Patient';
import PdfImageView from './screens/Viewers/PdfImage'

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
import { postService, API_ROUTES, refreshToken, getCmDetails } from './server';
import RootStackScreen from './screens/RootStack';
const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

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
  const devEnv = mySelector(state=>state.Login.value.devEnv);
  const noOtp = mySelector(state=>state.Login.value.noOtp);
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

      const devEnvStored = await AsyncStorage.getItem('devEnv')
      
      if( JSON.parse(devEnvStored) === true && !devEnv) dispatch(loginActions.toggleDevEnv())
    }
    catch (error) {

      console.log('Error in check devEnv ', error)
    }
  }

  const refreshTheToken = async()=>{
    try {

      const devEnvStored = await AsyncStorage.getItem('devEnv')
      refreshToken(`https://${JSON.parse(devEnvStored)?'dev':''}api.circle.care/v1`, dispatch, setLoading);
    }
    catch (error) {

      console.log('Something went wrong in refresh token', error)
    }
  }


  useEffect(() => {

    checkDevEnv();

    AsyncStorage.getItem('noOtp').then((noOtp) => {
      
      if(JSON.parse(noOtp) === true){
        
        !noOtp && dispatch(loginActions.toggleNoOtp())
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
              else refreshTheToken();
              
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
  },[]);



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

  const MainDrawer = ()=>{
    return(
      <Drawer.Navigator drawerContent={props => <DrawerContent {...props} dispatch={dispatch} />} screenOptions={{headerShown:false}}>
        <Drawer.Screen name="HomeDrawer" component={MainTabScreen} />
      </Drawer.Navigator>
    )
  }

  return (
    <PaperProvider theme={theme}>
      <AntModalProvider>
        <NavigationContainer theme={theme}>
          { loginData?.email ? (
              <Stack.Navigator
                initialRouteName={'MainDrawer'}
                screenOptions={{
                  headerShown: false,
                }}
              >
                <Stack.Screen name={'MainDrawer'} component={MainDrawer} />
                <Stack.Screen name="ProfileEdit" component={EditProfile} />
                <Stack.Screen name="PatientDetails" component={PatientIndex} />
                <Stack.Screen name="PdfImageView" component={PdfImageView} />
              </Stack.Navigator>
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