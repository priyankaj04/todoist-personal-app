import React, { useEffect } from 'react';
import { 
  View,
  ActivityIndicator,
  Text,
} from 'react-native';

import { createDrawerNavigator } from '@react-navigation/drawer';

import { DrawerContent } from './components/Drawer';

import MainTabScreen from './screens/MainTab';
// import SupportScreen from './screens/SupportScreen';
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

import { postService, API_ROUTES, refreshToken } from './Server';

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

  const [isDarkTheme, setIsDarkTheme] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  const dispatch = myDispatch();

  const loginData = mySelector(state=>state.Login.value.loginData);

  const alert = mySelector(state=>state.Values.value.alert);


  useEffect(() => {

    setTimeout(async() => {

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

              setLoading(false);

            }
            else refreshToken(dispatch, setLoading);
          }
          else setLoading(false);

        })
      } catch(e) {
        dispatch(valuesActions.error(error));
      }
    },0);
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
      text: '#333333'
    }
  }
  
  const CustomDarkTheme = {
    ...NavigationDarkTheme,
    ...PaperDarkTheme,
    colors: {
      ...NavigationDarkTheme.colors,
      ...PaperDarkTheme.colors,
      background: '#333333',
      text: '#ffffff'
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
    <AntModalProvider>
      <NavigationContainer theme={theme}>
        { loginData?.email ? (
            <Drawer.Navigator drawerContent={props => <DrawerContent {...props} />} screenOptions={{headerShown:false}}>
              <Drawer.Screen name="HomeDrawer" component={MainTabScreen} />
              {/* <Drawer.Screen name="SupportScreen" component={SupportScreen} />
              <Drawer.Screen name="SettingsScreen" component={SettingsScreen} />
              <Drawer.Screen name="BookmarkScreen" component={BookmarkScreen} /> */}
            </Drawer.Navigator>
          )
          :
          <RootStackScreen/>
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
  )
}

export default App