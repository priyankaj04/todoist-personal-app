import { 
  View,
  Platform,
  StatusBar,
  Dimensions
} from 'react-native';
const { width, height } = Dimensions.get('window');

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import Icon from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import Entypo from 'react-native-vector-icons/Entypo';


import { useTheme } from 'react-native-paper';

import Home from './Home';
import Messages from './Messages';
import MyJobs from './MyJobs';
import MyPatients from './Patients';

const Tab = createBottomTabNavigator();


const MainTabScreen = () => {

  const { colors } = useTheme();

  return(
    <View style={{ paddingTop:Platform.OS === 'ios' ? vh(5) : StatusBar.currentHeight, flex:1, backgroundColor:colors.background}}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content"/>
      <Tab.Navigator
        initialRouteName="Home"
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
            tabBarIcon: ({color}) => (
              <Feather name="home" color={color} size={22} />
            ),
          }}
          
        />
        <Tab.Screen
          name="TabMessages"
          component={Messages}
          options={{
            tabBarLabel: 'Messages',
            tabBarIcon: ({color}) => (
              <Feather name="message-square" color={color} size={25} />
            ),
          }}
        />
        <Tab.Screen
          name="TabMyJobs"
          component={MyJobs}
          options={{
            tabBarLabel: 'My Jobs',
            tabBarIcon: ({color}) => (
              <Feather name="folder" color={color} size={22} />
            ),
          }}
        />
        <Tab.Screen
          name="TabPatients"
          component={MyPatients}
          options={{
            tabBarLabel: 'Patients',
            tabBarIcon: ({color}) => (
              <Feather name="users" color={color} size={22} />
            ),
          }}
        />
      </Tab.Navigator>
    </View>
  )
  
};

export default MainTabScreen;
