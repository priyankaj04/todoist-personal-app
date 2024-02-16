import React from 'react';
import {View, StatusBar, StyleSheet}from 'react-native';
import { createStackNavigator } from "@react-navigation/stack";
import {useNavigation, useTheme} from '@react-navigation/native';
import {vh, vw} from'react-native-css-vh-vw';

const Stack = createStackNavigator();

import Landing from './Landing';
import PatientDetails from './PatientDetails';
import CarePlan from './CarePlan';
import Reports from './Reports';
import PatientFiles from './PatientFiles';

function Index({route}) {

  const navigation = useNavigation();
  const {patient} = route.params;
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
        initialRouteName={'Patient_Landing'}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen 
          name={'Patient_Landing'}
          component={Landing}
          initialParams={{patient: patient}}
        />
        <Stack.Screen 
          name={'Patient_Details'}
          component={PatientDetails}
        />
        <Stack.Screen 
          name={'Patient_CarePlan'}
          component={CarePlan}
        />
        <Stack.Screen 
          name={'Patient_Reports'}
          component={Reports}
        />
        <Stack.Screen 
          name={'Patient_Files'}
          component={PatientFiles}
        />
      </Stack.Navigator>
    </View>
   
  )
}

export default Index