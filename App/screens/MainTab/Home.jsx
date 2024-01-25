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
import StarRating from '../../components/StarRating';

const HomeScreen = ({navigation}) => {
  const theme = useTheme();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Ionicons
          name="menu"
          size={27}
          color={'#000'}
          onPress={() => navigation.openDrawer()}
        />
        <Text
          style={{
            color:theme.colors.text,
            ...theme.fonts.titleMedium,
            paddingLeft: 15
          }}
        >
          Hi CareManager
        </Text>
        <Ionicons
          style={{
            textAlign:'right',
            flex:1,
          }}
          name="notifications"
          size={25}
          color={'#000'}
          onPress={() => navigation.openDrawer()}
        />
      </View>

    </ScrollView>
  );
};

export default HomeScreen;
