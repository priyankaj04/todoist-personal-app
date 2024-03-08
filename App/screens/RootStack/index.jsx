import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import SplashScreen from './Splash';
import SignInScreen from './SignIn';
import VerifyOTP from './VerifyOTP';

const RootStack = createStackNavigator();

const RootStackScreen = ({navigation}) => (
    <RootStack.Navigator  screenOptions={{
        headerShown: false
      }} >
        <RootStack.Screen name="SplashScreen" component={SplashScreen}/>
        <RootStack.Screen name="SignInScreen" component={SignInScreen}/>
        <RootStack.Screen name="VerifyOTP" component={VerifyOTP}/>
    </RootStack.Navigator>
);

export default RootStackScreen;