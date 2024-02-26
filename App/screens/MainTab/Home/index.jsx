import React, {useState, useEffect} from 'react';
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
import dayjs from 'dayjs';
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';

import { loginActions, valuesActions, myDispatch, mySelector } from '../../../redux';
import { getName } from '../../../utils';
import assets from '../../../assets';
import { getService, API_ROUTES, stringInterpolater, putTokenService, patchService, deleteService, postTokenService } from '../../../server';

const HomeScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  
  const dispatch = myDispatch();
  const cmDetails = mySelector(state=>state.Login.value.cmDetails);
  const baseUrl = mySelector(state=>state.Login.value.baseUrl);

  const [appointments, setAppointments] = useState([]);
  const [careManagersAppointments, setCareManagersAppointments] = useState([]);
  const [myAppointments, setMyAppointments] = useState([]);
  

  useEffect(()=>{
    //to get all appointments
    getService(baseUrl, stringInterpolater(
      API_ROUTES.GET_APPOINTMENTS,
      { 
        fromdate: dayjs().format('YYYY-MM-DD'),
        todate: dayjs().format('YYYY-MM-DD'),
      }
    ))
    .then((res)=>{
      if(res.status === 1){

        setAppointments(res.data)
      }else{
        
        dispatch(valuesActions.statusNot1(res));
      }
    }).catch((error) => {

        dispatch(valuesActions.error({error:`Error in Get Appointments ${error}`}));
    })

  },[])

  const careManagersFilter = () => {

    let filterArray = appointments;
    
    let email = cmDetails.email
    filterArray = filterArray.filter(item => item.ccownername === email)

    setCareManagersAppointments(filterArray);
  }

  const myAppointmentsFilter = () => {
    let filterArray = appointments;

    let doctorId = cmDetails.mydocid
    filterArray = filterArray.filter(item => item.doctorid === doctorId)

    setMyAppointments(filterArray);
  }

  useEffect(()=>{
    if(appointments.length > 0){
      careManagersFilter()
      myAppointmentsFilter()
    }
  },[appointments, cmDetails])

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
          Hi {cmDetails?.name ? getName(cmDetails?.name) : 'Circle Pi'}!
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
      
      {/* my patients appointments card */}
      {
        careManagersAppointments.length > 0 &&
        <Animatable.View
          animation="fadeIn"
          duration={400}
        >
          <TouchableOpacity
            onPress={()=>navigation.navigate('Appointments', {
                screen: 'Appointments_MyPatientAppointments',
                params: { appointments: careManagersAppointments },
              })
            }
            style={{
              borderColor: theme.colors.border,
              ...styles.card
            }}
          >
            <View
              style={{
                ...styles.row,
                justifyContent:'space-between'
              }}
            >
              <View
                style={{
                  flex:1
                }}
              >
                <Text
                  style={{
                    color: theme.colors.subtitle,
                    ...theme.fonts.titleSmall,
                  }}
                >
                  My Patients Appointments
                </Text>
                <Text
                  style={{
                    color: 'green',
                    ...theme.fonts.labelLarge,
                  }}
                >
                  {`${careManagersAppointments.length} Appointment${careManagersAppointments.length > 1 ? 's' : ''} found for the day ${dayjs().format('DD MMM YYYY')}`}
                </Text>
                
              </View>
              
              <Image
                source={assets.ImageBaseUrl('consultation')}
                style={{
                  height:100,
                  width:100
                }}
              />
            </View>
          </TouchableOpacity>
        </Animatable.View>
      }

      {/* my clinical appointments card */}
      {
        myAppointments.length > 0 &&
        <Animatable.View
          animation="fadeIn"
          duration={400}
        >
          <TouchableOpacity
            style={{
              borderColor: theme.colors.border,
              ...styles.card
            }}
            onPress={()=>navigation.navigate('Appointments', {
                screen: 'Appointments_MyClinicalAppointments',
                params: { appointments: myAppointments },
              })
            }
          >
            <View
              style={{
                ...styles.row,
                justifyContent:'space-between'
              }}
            >
              <View
                style={{
                  flex:1
                }}
              >
                <Text
                  style={{
                    color: theme.colors.subtitle,
                    ...theme.fonts.titleSmall,
                  }}
                >
                  My Clinical Appointments
                </Text>
                <Text
                  style={{
                    color: 'green',
                    ...theme.fonts.labelLarge,
                  }}
                >
                  {`${myAppointments.length} Appointment${myAppointments.length > 1 ? 's' : ''} found for the day ${dayjs().format('DD MMM YYYY')}`}
                </Text>
                
              </View>
              
              <Image
                source={assets.ImageBaseUrl('gpconsultation')}
                style={{
                  height:110,
                  width:110
                }}
              />
            </View>

          </TouchableOpacity>
        </Animatable.View>
      }
      

    </ScrollView>
  );
};

export default HomeScreen;
