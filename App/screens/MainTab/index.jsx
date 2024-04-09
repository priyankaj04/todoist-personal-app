import {
  View,
  Platform,
  StatusBar,
  Dimensions
} from 'react-native';
const { width, height } = Dimensions.get('window');
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider } from 'react-native-paper';
import { vh, vw } from 'react-native-css-vh-vw';
import Icon from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from 'react-native-paper';
import Home from './Home';
import Policies from './Policies';
import Settings from './Settings';

const Tab = createBottomTabNavigator();

const MainTabScreen = ({ route, navigation }) => {

  const { colors } = useTheme();

  return (
    <Provider>
      <View style={{ paddingTop: Platform.OS === 'ios' ? vh(6) : StatusBar.currentHeight, flex: 1, backgroundColor: colors.background }}>
        <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
        <Tab.Navigator
          initialRouteName="TabHome"
          screenOptions={{
            tabBarLabelStyle: { paddingBottom: 5, fontWeight: '500' },
            tabBarActiveTintColor: '#254E93',
            headerShown: false
          }}
        >
          <Tab.Screen
            name="TabHome"
            component={Home}
            options={{
              tabBarLabel: 'Home',
              tabBarIcon: ({ color }) => (
                <Feather name="home" color={color} size={22} />
              ),
            }}
          // initialParams={{mainNavigation: navigation}}
          />
          <Tab.Screen
            name="TabPolicy"
            component={Policies}
            options={{
              tabBarLabel: 'Policy',
              tabBarIcon: ({ color }) => (
                <Feather name="shield" color={color} size={22} />
              ),
            }}
          // initialParams={{mainNavigation}}
          />
          {/*<Tab.Screen
            name="TabClaim"
            component={Claim}
            options={{
              tabBarLabel: 'Claims',
              tabBarIcon: ({color}) => (
                <Feather name="clipboard" color={color} size={22} />
              ),
            }}
            // initialParams={{mainNavigation}}
          />
          <Tab.Screen
            name="TabStories"
            component={Stories}
            options={{
              tabBarLabel: 'Stories',
              tabBarIcon: ({color}) => (
                <Feather name="book-open" color={color} size={22} />
              ),
            }}
            // initialParams={{mainNavigation}}
          />*/}
          <Tab.Screen
            name="TabSettings"
            component={Settings}
            options={{
              tabBarLabel: 'Users',
              tabBarIcon: ({ color }) => (
                <Ionicons name="person-outline" color={color} size={22} />
              ),
            }}
          // initialParams={{mainNavigation}}
          />
        </Tab.Navigator>
      </View>
    </Provider>
  )

};

export default MainTabScreen;
