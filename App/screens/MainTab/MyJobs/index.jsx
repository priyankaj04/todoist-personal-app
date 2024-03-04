import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Animated
} from 'react-native';

import styles from '../Styles'
import { useTheme } from '@react-navigation/native';

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
import { getService, API_ROUTES, stringInterpolater } from '../../../server';

import MyJobs from './MyJobs'
import Appointment from './Appointment'
import CurrentlySick from './CurrentlySick'
import HealthPlanRemi from './HealthPlanRemi'
import dayjs from 'dayjs';


const MyJobsIndex = () => {

  const theme = useTheme();

  const dispatch = myDispatch();
  const baseUrl = mySelector(state => state.Login.value.baseUrl);
  const devEnv = mySelector(state => state.Login.value.devEnv);
  const cmDetails = mySelector(state => state.Login.value.corporateDetails);

  const [componentText, setComponentText] = useState({});
  const [expanded, setExpanded] = useState(-1);

  useEffect(() => {

    getService(baseUrl, stringInterpolater(API_ROUTES.GET_APPOINTMENTS, { fromdate: dayjs().format('YYYY-MM-DD'), todate: dayjs().format('YYYY-MM-DD') }))
      .then((res) => {
        if (res.status === 1) {

          if (res.data.length > 0) {

            if (cmDetails.type === 'admin') {

              setComponentText((prev) => ({
                ...prev,
                1: `${res.data.length} Appointments found for the day ${dayjs().format('DD MMM YYYY')}`
              }))

            } else handleFilter(res.data)

          }


        } else {

          dispatch(valuesActions.statusNot1('Get Appointments List Status != 1'));
        }
      }).catch((error) => {

        dispatch(valuesActions.error({ error: `Error in get Appointments List ${error}` }));
      })

    getService(baseUrl, stringInterpolater(API_ROUTES.MY_SICK_PATIENTS, { email: cmDetails.email }))
      .then((res) => {
        if (res.status === 1) {

          setComponentText((prev) => ({
            ...prev,
            2: `${res.data.length} Currently Sick Patient${res.data.length > 1 ? 's' : ''} found`
          }))
        }
      }).catch((error) => {

        dispatch(valuesActions.error({ error: `Error in My Sick Patients ${error}` }));
      })

    getService(baseUrl, stringInterpolater(API_ROUTES.HEALTH_PLAN_REMINDERS, { email: cmDetails.email }))
      .then((res) => {
        if (res?.data?.length > 0) {
          setComponentText((prev) => ({
            ...prev,
            4: `${res.data.length} Health Plan Reminders for the Day ${dayjs().format('DD MMM YYYY')}`
          }))
        }
      }).catch((error) => {

        dispatch(valuesActions.error({ error: `Error in Health Plan Reminders ${error}` }));
      })

    if (cmDetails.type === 'admin') return;

    getService(baseUrl, stringInterpolater(API_ROUTES.GET_CM_JOBS, { email: cmDetails.email, date: dayjs().format('YYYY-MM-DD') }))
      .then((res) => {
        if (res.status === 1) {

          if (res.data.length > 0) {
            setComponentText((prev) => ({
              ...prev,
              0: `${res.data.length} Jobs found for the day ${dayjs().format('DD MMM YYYY')}`
            }))
          }
        } else {

          dispatch(valuesActions.statusNot1('Get CM Jobs List Status != 1'));
        }
      }).catch((error) => {

        dispatch(valuesActions.error({ error: `Error in CM Jobs List ${error}` }));
      })

  }, [])

  const handleFilter = (appointments) => {

    let filterArray = appointments;

    let email = cmDetails.email;

    if (email) {
      filterArray = filterArray.filter(item => item.ccownername === email)
    }

    if (filterArray.length > 0) {

      setComponentText((prev) => ({
        ...prev,
        1: `${filterArray.length} Appointment${filterArray.length > 1 ? 's' : ''} found for the day ${dayjs().format('DD MMM YYYY')}`
      }))
    }

  }

  const CardContent = () => {
    return (
      <View
        style={{
          padding: 10,
          borderRadius: 8,
          backgroundColor: '#f2f2ff',
          alignItems: 'center',
          justifyContent: 'center',
          margin: 10,
          flex: 1
        }}>
        <Text
          style={{
            color: '#000',
            fontSize: 14,
            textAlign: 'center'
          }}
        >
          Coming soon, Yet to be implemented
        </Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>

      {
        expanded === -1 &&
        <TouchableOpacity
          style={styles.header}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              columnGap: 10,
              alignItems: 'center'
            }}
          >
            <Text
              style={{
                color: theme.colors.text,
                ...theme.fonts.titleMedium,
                paddingVertical: 10,
              }}
            >
              {cmDetails?.name ? getName(cmDetails?.name) : 'Circle Pi'} Jobs!
            </Text>
            <Text style={{ color: 'green', ...theme.fonts.titleMedium, }}>{devEnv && 'Dev'}</Text>
          </View>
        </TouchableOpacity>
      }

      <Accordion
        components={[
          MyJobs,
          Appointment,
          CurrentlySick,
          CardContent,
          HealthPlanRemi,
        ]}
        setExpanded={setExpanded}
        expanded={expanded}
        componentText={componentText}
        titles={[
          'My Jobs List',
          'Appointments',
          'Currently Sick',
          'Pending Health Plan',
          'Health Plan Reminders',
        ]}
      />

    </View>
  );
};

export default MyJobsIndex;

