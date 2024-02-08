import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import styles from '../Styles'
import {useTheme} from '@react-navigation/native';

import Swiper from 'react-native-swiper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import StarRating from '../../../components/StarRating';

import { loginActions, valuesActions, myDispatch, mySelector } from '../../../redux';
import { getName } from '../../../utils';
import { Accordion, Dropdown } from '../../../components';
import { getService, API_ROUTES, stringInterpolater } from '../../../Server';

import MyJobs from './MyJobs'
import Appointment from './Appointment'
import dayjs from 'dayjs';


const MyJobsIndex = ({navigation}) => {

  const theme = useTheme();

  const dispatch = myDispatch();
  const baseUrl = mySelector(state=>state.Login.value.baseUrl);
  const cmDetails = mySelector(state=>state.Login.value.cmDetails);

  const[componentText, setComponentText] = useState({
    0: ''
  })
 
  useEffect(()=>{
    if(cmDetails.type === 'admin') return;

    getService(baseUrl, stringInterpolater(API_ROUTES.GET_CM_JOBS, {email: cmDetails.email, date: dayjs().format('YYYY-MM-DD') }))
    .then((res)=>{
        if(res.status === 1){
          
          if(res.data.length > 0 ){
            setComponentText((prev)=>({
              ...prev,
              0: `${res.data.length} Jobs found for the day ${dayjs().format('DD MMM YYYY')}`
            }))
          }
        }else{
          
          dispatch(valuesActions.statusNot1('Get CM Jobs List Status != 1'));
        }
    }).catch((error) => {

        dispatch(valuesActions.error({error:`Error in CM Jobs List ${error}`}));
    })


  },[])

  const CardContent = ()=>{
    return(
      <View style={{padding:10, borderRadius:8, backgroundColor:'blue'}}>
        <Text style={{color:'#000', fontSize:20}}>kjgjkasgd</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
         style={styles.header}>
          <View
            style={{
              display:'flex',
              flexDirection:'row',
              columnGap:10,
              alignItems:'center'
            }}
          >
            <Text
              style={{
                color:theme.colors.text,
                ...theme.fonts.titleMedium,
                paddingLeft: 15,
                paddingVertical:10,
              }}
            >{cmDetails?.name ? getName(cmDetails?.name) : 'Care Manager'} Jobs!</Text>
          </View>
        </TouchableOpacity>

        <Accordion
          components={[
            MyJobs,
            Appointment,
            CardContent,
            CardContent,
            CardContent,
            CardContent,
          ]}
          componentText={componentText}
          titles={[
            'My Jobs List',
            'Appointments',
            'C Sick Ip',
            'C Sick Op',
            'Pending Health Plan',
            'Health Plan Reminders',
          ]}
        />

      </ScrollView>

    </View>
  );
};

export default MyJobsIndex;

