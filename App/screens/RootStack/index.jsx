import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import SplashScreen from './Splash';
import SignInScreen from './SignIn';
import SignUpScreen from './SignUp';

const RootStack = createStackNavigator();

const RootStackScreen = ({navigation}) => (
    <RootStack.Navigator  screenOptions={{
        headerShown: false
      }} >
        <RootStack.Screen name="SplashScreen" component={SplashScreen}/>
        <RootStack.Screen name="SignInScreen" component={SignInScreen}/>
        <RootStack.Screen name="SignUpScreen" component={SignUpScreen}/>
    </RootStack.Navigator>
);

export default RootStackScreen;