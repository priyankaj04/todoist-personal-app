import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  BackHandler,
} from 'react-native';

import styles from './Styles';
import {useTheme} from '@react-navigation/native';
import {useNavigation, useRoute} from '@react-navigation/native';

import Swiper from 'react-native-swiper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import StarRating from '../../../components/StarRating';
import * as Animatable from 'react-native-animatable';
import dayjs from 'dayjs';

import {
  loginActions,
  valuesActions,
  myDispatch,
  mySelector,
} from '../../../redux';
import {getName} from '../../../utils';
import {Accordion, TitleText} from '../../../components';
import Assets from '../../../assets';
import {getService, API_ROUTES, stringInterpolater} from '../../../Server';


const PatientIndex = ({route}) => {

  const navigation = useNavigation();
  const theme = useTheme();
  const {patient} = route.params;
  const pat = patient.item;

  const dispatch = myDispatch();
  const baseUrl = mySelector(state => state.Login.value.baseUrl);
  const devEnv = mySelector(state => state.Login.value.devEnv);
  const cmDetails = mySelector(state => state.Login.value.cmDetails);

  const components = [
    {
      title: 'Patient Details',
      navigateTo: 'Patient_Details'
    },
    {
      title: 'Care Plan',
      navigateTo: 'Patient_CarePlan'
    },
    {
      title: 'Patient Reports',
      navigateTo: 'Patient_Reports'
    },
    {
      title: 'Patient Files',
      navigateTo: 'Patient_Files'
    },
  ]

  return (
    <Animatable.View
      style={{
        marginHorizontal:10,
        flex:1,
      }}
      animation="fadeInUp"
      duration={700}
    >

      <TouchableOpacity
        onPress={navigation.goBack}
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          paddingBottom:5
        }}>
        <Feather name="chevron-left" size={23} color={'#676767'} />
        <Text
          style={{
            color: theme.colors.text,
            ...theme.fonts.titleMedium,
            paddingVertical: 10,
          }}>
          Patient Details!
        </Text>
        <Text style={{
            color: 'green', 
            ...theme.fonts.titleMedium,
            marginLeft: 15
          }}
        >
          {devEnv && 'Dev'}
        </Text>
      </TouchableOpacity>

      <View 
        style={{
          ...styles.row,
          justifyContent: 'center',
          columnGap:20,
          marginBottom:15
        }}
      > 
        <View
          style={{
            ...styles.column,
          }}
        >
          <Image
            source={
              pat.profilepic
                ? {uri: pat.profilepic}
                : Assets.getProfileIcon(pat.gender, pat.age)
            }
            style={{...styles.profilePic}}
          />
          <Text
            style={{
              marginTop: 12,
              ...styles.textWrapper,
              fontSize: 12,
              backgroundColor: pat?.cmenabled ? '#cdffcd' : '#ededed'
            }}
          >{pat?.cmenabled ? 'Care Management' : 'No Care Mana...'}</Text>
        </View>
        <View
          style={{
            flex: 1,
          }}
        >
          <TitleText
            title='First Name'
            text={pat.firstname}
            theme={theme}
          />

          <TitleText
            title='Last Name'
            text={pat.lastname}
            theme={theme}
            style={{
              marginTop: 15
            }}
          />
        </View>
      </View>

      {
        components.map((comp,i)=>{
          return(
            <View
              style={styles.accordionItem}
              key={i}
            >
              <TouchableOpacity onPress={()=>{navigation.navigate(comp.navigateTo, {patient})}}>
                <View style={styles.header}>
                  <Text style={{...styles.title, fontSize: 16 }}>{comp.title}</Text>
                  <Feather name="chevron-down" color={'#000'} size={18} />
                </View>
              </TouchableOpacity>
            </View>
          )
        })
      }
      
    </Animatable.View>
  );
};

export default PatientIndex;
