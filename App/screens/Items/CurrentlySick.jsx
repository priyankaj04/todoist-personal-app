import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {useTheme} from '@react-navigation/native';

import styles from './Styles'

import Swiper from 'react-native-swiper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { loginActions, valuesActions, myDispatch, mySelector } from '../../redux';
import { getName } from '../../utils';

const HomeScreen = ({route, navigation}) => {
  const theme = useTheme();

  const dispatch = myDispatch();
  const cmDetails = mySelector(state=>state.Login.value.cmDetails);

  return (
    <View>
      <View style={{ paddingTop:Platform.OS === 'ios' ? vh(5) : StatusBar.currentHeight, flex:1, backgroundColor:theme.colors.background}}></View>

      <ScrollView style={styles.container}>
        <Text
          style={{
            color:theme.colors.text,
            ...theme.fonts.titleMedium,
            paddingLeft: 15
          }}
        >
          Hi {cmDetails?.name ? getName(cmDetails?.name) : 'Care Manager'}!
        </Text>
      </ScrollView>
    </View>
    
  );
};

export default HomeScreen;
