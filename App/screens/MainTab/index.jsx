import { 
  View,
  Platform,
  StatusBar
} from 'react-native';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import Icon from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';


import { useTheme } from 'react-native-paper';

import Home from './Home';
import Messages from './Messages';
import MyJobs from './MyJobs';
import MyPatients from './MyPatients';

const Tab = createBottomTabNavigator();


const MainTabScreen = () => {

  const { colors } = useTheme();

  return(
    <View style={{ paddingTop:Platform.OS === 'ios' ? vh(5) : StatusBar.currentHeight, flex:1, backgroundColor:colors.background}}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content"/>
      <Tab.Navigator
        initialRouteName="TabHome"
        screenOptions={{
          tabBarLabelStyle: {paddingBottom:5, fontWeight:'500'},
          tabBarActiveTintColor:"#05375a",
          headerShown:false
        }}
      >
        <Tab.Screen
          name="TabHome"
          component={Home}
          options={{
            tabBarLabel: 'Home',
            tabBarColor: '#143c92',
            tabBarIcon: ({color}) => (
              <Icon name="home" color={color} size={22} />
            ),
          }}
          
        />
        <Tab.Screen
          name="TabMessages"
          component={Messages}
          options={{
            tabBarLabel: 'Messages',
            tabBarColor: '#1f65ff',
            tabBarIcon: ({color}) => (
              <Entypo name="message" color={color} size={25} />
            ),
          }}
        />
        <Tab.Screen
          name="TabMyJobs"
          component={MyJobs}
          options={{
            tabBarLabel: 'My Jobs',
            tabBarColor: '#694fad',
            tabBarIcon: ({color}) => (
              <Icon name="browsers" color={color} size={22} />
            ),
          }}
        />
        <Tab.Screen
          name="TabMyPatients"
          component={MyPatients}
          options={{
            tabBarLabel: 'My Patients',
            tabBarColor: '#d02860',
            tabBarIcon: ({color}) => (
              <Icon name="person" color={color} size={22} />
            ),
          }}
        />
      </Tab.Navigator>
    </View>
  )
  
};

export default MainTabScreen;
