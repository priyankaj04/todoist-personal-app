import React from 'react';
import {View, StatusBar, StyleSheet}from 'react-native';
import { createStackNavigator } from "@react-navigation/stack";
import {useNavigation, useTheme} from '@react-navigation/native';
import {vh, vw} from'react-native-css-vh-vw';

const Stack = createStackNavigator();

import MyClinicalAppointments from './MyClinicalAppoints';
import PatientsAppointments from './MyPatAppoints';

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
        initialRouteName={'Appointments_MyAppointments'}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen 
          name={'Appointments_MyClinicalAppointments'}
          component={MyClinicalAppointments}
          initialParams={{appointments: appointments}}
        />
        <Stack.Screen 
          name={'Appointments_MyPatientAppointments'}
          component={PatientsAppointments}
          initialParams={{appointments: appointments}}
        />
      </Stack.Navigator>
    </View>
   
  )
}

export default Index