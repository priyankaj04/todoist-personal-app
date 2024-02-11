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

import styles from '../Styles'

import Swiper from 'react-native-swiper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import StarRating from '../../../components/StarRating';

import { loginActions, valuesActions, myDispatch, mySelector } from '../../../redux';
import { getName } from '../../../utils';

const HomeScreen = ({route, navigation}) => {
  const theme = useTheme();
  
  const dispatch = myDispatch();
  const cmDetails = mySelector(state=>state.Login.value.cmDetails);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Ionicons
          name="menu"
          size={27}
          color={theme.colors.text}
          onPress={() => navigation.openDrawer()}
        />
        <Text
          style={{
            color:theme.colors.text,
            ...theme.fonts.titleMedium,
            paddingLeft: 15
          }}
        >
          Hi {cmDetails?.name ? getName(cmDetails?.name) : 'Care Manager'}!
        </Text>
        <Ionicons
          style={{
            textAlign:'right',
            flex:1,
          }}
          name="notifications"
          size={25}
          color={theme.colors.text}
          // onPress={() => navigation.openDrawer()}
        />
      </View>

    </ScrollView>
  );
};

export default HomeScreen;
