import React from 'react';
import {View, StatusBar, StyleSheet}from 'react-native';
import { createStackNavigator } from "@react-navigation/stack";
import {useNavigation, useTheme} from '@react-navigation/native';
import {vh, vw} from'react-native-css-vh-vw';

const Stack = createStackNavigator();

import Landing from './Landing';

function Index({route}) {

  const {appointments} = route.params;
  const theme = useTheme();

  return (
    <View 
      style={{
        flex:1,
        paddingTop: Platform.OS === 'ios' ? vh(6) : StatusBar.currentHeight,
        backgroundColor: theme.colors.background,
      }}
    >
      <Stack.Navigator
        initialRouteName={'Appointments_Landing'}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen 
          name={'Appointments_Landing'}
          component={Landing}
          initialParams={{appointments: appointments}}
        />
      </Stack.Navigator>
    </View>
   
  )
}

export default Index