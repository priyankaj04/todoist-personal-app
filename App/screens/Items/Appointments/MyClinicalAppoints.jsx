/* tslint:disable:no-console */
import React, { useEffect, useState, memo } from 'react';
import { ScrollView, Text, TouchableOpacity, View, FlatList, Linking } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import { Tabs } from '@ant-design/react-native';
import { useTheme } from '@react-navigation/native';
import { vh, vw } from 'react-native-css-vh-vw';

import { getService, API_ROUTES, stringInterpolater } from '../../../server';
import { mySelector, myDispatch, valuesActions, } from '../../../redux';
import { getName, getActivity } from '../../../utils';
import LinearGradient from 'react-native-linear-gradient';
import assets from '../../../assets';
import * as Animatable from 'react-native-animatable';

import Swiper from 'react-native-swiper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import Fontisto from 'react-native-vector-icons/Fontisto';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import dayjs from 'dayjs';

import {
  Provider,
  Button,
  List,
  Switch,
  Toast,
  WhiteSpace,
  WingBlank,
} from '@ant-design/react-native';
import { useNavigation } from '@react-navigation/native';
import { Loading, Dropdown, DatePicker } from '../../../components'

import styles from './Styles'
import { pink800 } from 'react-native-paper/lib/typescript/styles/themes/v2/colors';
import { Image } from 'react-native-animatable';

const MyAppointments = ({ route }) => {

  const theme = useTheme();
  const dispatch = myDispatch();
  const navigation = useNavigation();


  const cmDetails = mySelector(state => state.Login.value.corporateDetails);
  const baseUrl = mySelector(state => state.Login.value.baseUrl);
  const loginData = mySelector(state => state.Login.value.loginData);
  const devEnv = mySelector(state => state.Login.value.devEnv);

  const [loading, setLoading] = useState({
    appointments: false,
  });

  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([...route.params.appointments]);
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());

  const handleFilter = () => {
    let filterArray = appointments;

    filterArray = filterArray.filter(item => item.doctorid === cmDetails.mydocid)

    setFilteredAppointments(filterArray);
  }

  useEffect(() => {
    handleFilter()
  }, [appointments])

  useEffect(() => {
    if (!fromDate || !toDate) return;

    setLoading((pre) => ({
      ...pre,
      appointments: true
    }))

    getService(baseUrl, stringInterpolater(
      API_ROUTES.GET_APPOINTMENTS,
      {
        fromdate: fromDate ? dayjs(fromDate).format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'),
        todate: toDate ? dayjs(toDate).format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'),
      }
    ))
      .then((res) => {
        if (res.status === 1) {

          setLoading((pre) => ({
            ...pre,
            appointments: false
          }))
          setAppointments(res.data)
        } else {

          dispatch(valuesActions.statusNot1(res));
        }
      }).catch((error) => {

        dispatch(valuesActions.error({ error: `Error in Get Appointments ${error}` }));
      })
  }, [toDate, fromDate])


  function showToastNoMask(txt) {
    Toast.info({
      content: txt,
      mask: false,
    })
  }

  const handleCopy = async (title, text) => {
    try {
      await Clipboard.setString(text);
      showToastNoMask(`${title} Copied to clipboard`);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
    }
  };

  //the main card the renders all the jobs
  //all the actions that happens, happens in this card
  const RenderItem = ({ item }) => {
    const pat = item;

    const [status, setStatus] = useState(pat.status);
    const [cancelInitiated, setCancelInitiated] = useState(false);
    const [cancelled, setCancelled] = useState(false);
    const [expanded, setExpanded] = useState(false);

    function showToast(txt) {
      Toast.info({
        content: txt,
        mask: false,
      })
    }

    const updateAppointment = (type) => {

      let body

      if (type === 'cancel') {
        body = {
          updatetype: "cancelled",
          cancelledby: loginData.email,
          bookingid: pat?.bookingid
        }
      } else if (type === 'undo') {
        body = {
          updatetype: "undo",
          bookingid: pat?.bookingid
        }
      }
      else if (type === 'checkedin') {
        body = {
          updatetype: "checkedin",
          bookingid: pat?.bookingid
        }
      }
      else if (type === 'checkedout') {
        body = {
          updatetype: "checkedout",
          bookingid: pat?.bookingid
        }
      }

      postTokenService(
        baseUrl,
        API_ROUTES.UPDATE_BOOKING,
        body,
        loginData.token
      )
        .then((res) => {

          if (res.status === 1) {

            if (type === 'cancel') {

              setCancelled(true);
            } else if (type === 'undo') {

              setStatus('booked');
              showToast('Status updated to Booked!')
            }
          } else {
            console.log(res)
            dispatch(valuesActions.statusNot1('Update Appointment Status != 1'));
          }
        }).catch((error) => {

          dispatch(valuesActions.error({ error: `Error in Update Appointment ${error}` }));
        })
    }

    function formatTime(timeString) {
      const [hours, minutes, secs, ampm] = timeString.split(/:| /);
      const formattedTime = `${hours}:${minutes} ${ampm.toUpperCase()}`;

      return formattedTime;
    }

    const copyEmrLink = () => {

      if (pat?.selectedprocedure == 'consultation') {

        if (!pat.bookingid) {
          showToast("Booking is not created")
          return;
        }

        if (devEnv) {

          const url = "http://doctor.circle.care/emrpage?id=" + pat?.patientid + "&actid=" + pat?.activityid + "&bid=" + pat?.bookingid + "&check=1";
          handleCopy('Dev Emr Page Link', url)
        } else {

          const url = "http://devdoctor.circle.care/emrpage?id=" + pat?.patientid + "&actid=" + pat?.activityid + "&bid=" + pat?.bookingid + "&check=1";
          handleCopy('Emr Page Link', url)
        }
      }
    }

    const sendAppointmentsReminder = () => {

      const body = {
        mobile: pat?.mobile,
        campaignName: 'ams_reminder_k',
        patientid: pat?.patientid,
        templateParams: [
          pat?.patientname,
          getActivity(pat?.activityname),
          pat?.doctorname,
          dayjs(pat.appointmentdate).format('DD MMM YYYY'),
          formatTime(pat.startime),
          pat?.onlinelink
        ]
      }

      postTokenService(
        baseUrl,
        API_ROUTES.SEND_WHATSAPP_V2,
        body,
        loginData.token
      )
        .then((res) => {
          if (res.status === 1) {

            showToast('Reminder sent successfully')
          } else {

            dispatch(valuesActions.statusNot1('Send WhatsApp Reminder Status != 1'));
          }
        }).catch((error) => {

          dispatch(valuesActions.error({ error: `Error in Send WhatsApp Reminder ${error}` }));
        })
    }

    return (
      <Animatable.View
        animation="fadeIn"
        duration={700}
      >
        <LinearGradient
          colors={
            pat.careplan === 'vip' ?
              ['#e5ac01', '#fdf774', '#fdf774', '#e5ac01']
              :
              ['#87adff', '#cedaff', '#cedaff', '#87adff']
          }
          style={styles.patientCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View
            style={{
              margin: 2.5,
              backgroundColor: '#fff',
              padding: 8,
              borderRadius: 4
            }}
          >
            {
              !cancelInitiated ?
                <>
                  {
                    expanded ?
                      <>

                        <View
                          style={{
                            ...styles.row,
                            justifyContent: 'space-between',
                            alignItems: 'flex-start'
                          }}
                        >
                          <Text style={styles.title}>{getName(pat.patientname)}</Text>
                          <Text style={{ ...styles.text, }} >{pat.brandname} - {pat?.careplan}</Text>
                        </View>

                        <View
                          style={{
                            ...styles.row,
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            marginTop: 15
                          }}
                        >
                          <View
                            style={{
                              ...styles.row
                            }}
                          >
                            <FontAwesome6
                              name='compass'
                              size={13}
                              color={theme.colors.backgroundPrimary}
                            />
                            <Text style={styles.title}>
                              Status - {getName(status)}
                            </Text>
                          </View>

                        </View>

                        <View
                          style={{
                            ...styles.row,
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            marginTop: 15
                          }}
                        >
                          <View
                            style={{
                              ...styles.row
                            }}
                          >
                            <FontAwesome6
                              name='box-archive'
                              size={13}
                              color={theme.colors.backgroundPrimary}
                            />
                            <Text style={styles.title}>
                              {getActivity(pat.activityname)}
                            </Text>
                          </View>


                          <Text style={styles.title}>
                            {dayjs(pat.appointmentdate).format('DD MMM YYYY')}
                          </Text>
                        </View>

                        <View
                          style={{
                            ...styles.row,
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            marginTop: 15
                          }}
                        >
                          <View
                            style={{
                              ...styles.row
                            }}
                          >
                            <FontAwesome6
                              name='user-doctor'
                              size={16}
                              color={theme.colors.backgroundPrimary}
                            />
                            <Text style={styles.title}>
                              {getName(pat.doctorname)}
                            </Text>
                          </View>


                          <Text style={styles.title}>
                            {formatTime(pat.startime)}
                          </Text>
                        </View>

                        <View
                          style={{
                            ...styles.row,
                            justifyContent: 'space-between',
                            marginTop: 15
                          }}
                        >
                          <Text style={[styles.details, { fontSize: 14, fontWeight: 500 }]}>{pat?.ccownername} </Text>

                          {/* you can add something here */}
                        </View>

                        <View style={{ ...styles.row, marginTop: 10, justifyContent: 'space-between' }}>
                          <Text style={{ ...styles.title }}>+{pat?.mobile}</Text>

                          <View style={{ ...styles.row, columnGap: 15 }}>

                            <TouchableOpacity style={{ ...styles.minBtn }}>
                              <Text style={{ ...styles.title }}>Text</Text>
                              <Fontisto
                                name='whatsapp'
                                size={15}
                                color={theme.colors.backgroundPrimary}
                              />
                            </TouchableOpacity>

                            <TouchableOpacity
                              style={{ ...styles.minBtn }}
                              onLongPress={() => Linking.openURL(`tel:+${pat?.mobile}`)}
                            >
                              <Text style={{ ...styles.title }}>Call</Text>
                              <Fontisto
                                name='phone'
                                size={15}
                                color={theme.colors.backgroundPrimary}
                              />
                            </TouchableOpacity>

                          </View>
                        </View>

                        <View
                          style={{
                            ...styles.row,
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            marginTop: 20,
                            columnGap: 10,
                          }}
                        >
                          <TouchableOpacity
                            style={{
                              ...styles.actionBtn,
                              opacity: status === 'checkedout' ? 1 : 0.5
                            }}
                            onPress={() => {
                              if (status === 'checkedout') updateAppointment('undo')
                            }}
                          >
                            <Text
                              style={{
                                ...theme.fonts.titleSmall,
                                color: '#000'
                              }}>
                              {status === 'checkedout' ? 'Undo' : ''} CheckedOut
                            </Text>
                            <Feather
                              name='repeat'
                              size={15}
                              color={theme.colors.backgroundPrimary}
                            />
                          </TouchableOpacity>

                          <TouchableOpacity
                            style={{ ...styles.actionBtn }}
                            onPress={sendAppointmentsReminder}
                          >
                            <Text style={{ ...theme.fonts.titleSmall, color: '#000' }}>Send Reminder</Text>
                            <Feather
                              name='send'
                              size={15}
                              color={theme.colors.backgroundPrimary}
                            />
                          </TouchableOpacity>
                        </View>

                        <View
                          style={{
                            ...styles.row,
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginTop: 20,
                            columnGap: 20
                          }}
                        >
                          <TouchableOpacity
                            style={{ ...styles.actionBtn, justifyContent: 'center' }}
                            onPress={() => {
                              setCancelInitiated(true);
                            }}
                          >
                            <Text style={{ ...theme.fonts.titleSmall, color: '#a80000' }}>Cancel Booking</Text>
                            <Feather
                              name='x-square'
                              size={15}
                              color={'#a80000'}
                            />
                          </TouchableOpacity>
                        </View>

                        <View
                          style={{
                            ...styles.row,
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            marginTop: 20,
                            columnGap: 20
                          }}
                        >
                          <TouchableOpacity
                            style={{ ...styles.minBtn }}
                            onPress={copyEmrLink}
                          >
                            <Feather
                              name='copy'
                              size={15}
                              color={theme.colors.backgroundPrimary}
                            />
                            <Text style={{ ...theme.fonts.titleSmall, color: '#000' }}>Copy Emr Link</Text>
                          </TouchableOpacity>

                          {
                            pat?.onlinelink ?
                              <TouchableOpacity
                                style={{ ...styles.minBtn }}
                                onPress={() => handleCopy('Video Call link', pat.onlinelink)}
                              >
                                <Feather
                                  name='copy'
                                  size={15}
                                  color={theme.colors.backgroundPrimary}
                                />
                                <Text style={{ ...theme.fonts.titleSmall, color: '#000' }}>Copy Video Link</Text>
                              </TouchableOpacity>
                              : null
                          }

                        </View>

                        <View
                          style={{
                            ...styles.row,
                            justifyContent: 'flex-end',
                            marginTop: 25,
                          }}
                        >
                          <TouchableOpacity
                            style={{
                              ...styles.minBtn,
                              backgroundColor: 'transparent'
                            }}
                            onPress={() => setExpanded(false)}
                          >
                            <Text style={{
                              ...styles.details,
                              ...theme.fonts.titleSmall,
                              color: theme.colors.backgroundPrimary,
                            }}>
                              Minimize
                            </Text>
                            <Feather
                              name='minimize'
                              size={15}
                              color={theme.colors.backgroundPrimary}
                            />
                          </TouchableOpacity>
                        </View>

                      </>
                      :
                      <TouchableOpacity
                        onPress={() => { setExpanded(true) }}
                      >

                        <View
                          style={{
                            ...styles.row,
                            justifyContent: 'space-between',
                            alignItems: 'flex-start'
                          }}
                        >
                          <Text style={styles.title}>{getName(pat.patientname)}</Text>
                          <Text style={{ ...styles.text, }} >{pat.brandname} - {pat?.careplan}</Text>
                        </View>

                        <View
                          style={{
                            ...styles.row,
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            marginTop: 15
                          }}
                        >
                          <View
                            style={{
                              ...styles.row
                            }}
                          >
                            <FontAwesome6
                              name='compass'
                              size={13}
                              color={theme.colors.backgroundPrimary}
                            />
                            <Text style={styles.title}>
                              Status - {getName(pat.status)}
                            </Text>
                          </View>

                        </View>

                        <View
                          style={{
                            ...styles.row,
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            marginTop: 15
                          }}
                        >
                          <View
                            style={{
                              ...styles.row
                            }}
                          >
                            <FontAwesome6
                              name='box-archive'
                              size={13}
                              color={theme.colors.backgroundPrimary}
                            />
                            <Text style={styles.title}>
                              {getActivity(pat.activityname)}
                            </Text>
                          </View>


                          <Text style={styles.title}>
                            {dayjs(pat.appointmentdate).format('DD MMM YYYY')}
                          </Text>
                        </View>

                        <View
                          style={{
                            ...styles.row,
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            marginTop: 15
                          }}
                        >
                          <View
                            style={{
                              ...styles.row
                            }}
                          >
                            <FontAwesome6
                              name='user-doctor'
                              size={16}
                              color={theme.colors.backgroundPrimary}
                            />
                            <Text style={styles.title}>
                              {getName(pat.doctorname)}
                            </Text>
                          </View>


                          <Text style={styles.title}>
                            {formatTime(pat.startime)}
                          </Text>
                        </View>

                        <View
                          style={{
                            ...styles.row,
                            justifyContent: 'space-between',
                            marginTop: 15
                          }}
                        >
                          <Text style={[styles.details, { fontSize: 14, fontWeight: 500 }]}>{pat?.ccownername} </Text>

                          <View
                            style={{ ...styles.minBtn, backgroundColor: 'transparent', paddingHorizontal: 0 }}
                          >
                            <Text style={{ ...theme.fonts.titleSmall, color: theme.colors.backgroundPrimary }}>Expand</Text>
                            <Feather
                              name='maximize'
                              size={15}
                              color={theme.colors.backgroundPrimary}
                            />
                          </View>
                        </View>

                      </TouchableOpacity>
                  }
                </>
                :
                <>
                  {
                    !cancelled ?
                      <>
                        <Text style={[styles.title, { marginVertical: 10 }]}>
                          Are you sure you want to Cancel this Appointment, once cancelled cannot be undone?
                        </Text>

                        <View
                          style={{
                            ...styles.row,
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            marginTop: 5,
                            columnGap: 20
                          }}
                        >
                          <TouchableOpacity
                            style={{ ...styles.actionBtn, justifyContent: 'center' }}
                            onPress={() => {
                              setCancelInitiated(false);
                            }}
                          >
                            <Text style={{ ...theme.fonts.titleSmall, color: '#000' }}>No Dont</Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            style={{ ...styles.actionBtn, justifyContent: 'center' }}
                            onPress={() => {
                              updateAppointment('cancel');
                            }}
                          >
                            <Text style={{ ...theme.fonts.titleSmall, color: '#000' }}>Yes Cancel!</Text>
                          </TouchableOpacity>
                        </View>
                      </>
                      :
                      <Text
                        style={[
                          styles.title,
                          {
                            marginTop: 15,
                            color: '#044004',
                            width: '100%',
                            textAlign: 'center'
                          }
                        ]}
                      >
                        Appointment cancelled Successfully!
                      </Text>
                  }
                </>
            }
          </View>
        </LinearGradient>
      </Animatable.View>
    )
  };

  return (
    <View
      style={{
        marginHorizontal: 10,
        flex: 1,
      }}
    >

      <TouchableOpacity
        onPress={navigation.goBack}
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          paddingBottom: 5,
        }}>
        <Feather name="chevron-left" size={23} color={'#676767'} />
        <Text
          style={{
            color: theme.colors.text,
            ...theme.fonts.titleMedium,
            paddingVertical: 6,
          }}>
          My Clinical Appointments
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
          marginTop: 5
        }}
      >
        <Text
          style={{
            ...styles.text,
            flex: 1,
            marginLeft: 7
          }}
        >
          From Date
        </Text>
        <Text
          style={{
            ...styles.text,
            flex: 1,
            marginLeft: 7
          }}
        >
          To Date
        </Text>
      </View>

      <View
        style={{
          ...styles.row,
          columnGap: 10
        }}
      >
        <DatePicker
          label="Select Date"
          value={fromDate}
          maxDate={toDate}
          onChange={setFromDate}
          placeholder="Select a date"
          style={{
            marginTop: 10,
            flex: 1,
            marginBottom: 10
          }}
        />
        <DatePicker
          label="Select Date"
          value={toDate}
          minDate={fromDate}
          onChange={setToDate}
          placeholder="Select a date"
          style={{
            marginTop: 10,
            flex: 1,
            marginBottom: 10
          }}
        />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        scrollEnabled={true}
        style={{
          paddingTop: 10
        }}
      >

        {
          !loading.appointments ?
            <>
              {
                filteredAppointments?.length > 0 ?
                  <>
                    {
                      filteredAppointments.map((item, i) => (
                        <RenderItem item={item} key={i} />
                      ))
                    }
                  </>
                  :
                  <View
                    style={{
                      marginVertical: 15
                    }}
                  >
                    <Text style={{ ...styles.text, textAlign: 'center' }}>
                      No appointments found for the searched day or filter, select different Date, Circle Pi or Doctor
                    </Text>
                  </View>

              }
            </>
            :
            <Loading theme={theme} />
        }

      </ScrollView>

    </View>
  );
};

export default MyAppointments;