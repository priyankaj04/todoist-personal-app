/* tslint:disable:no-console */
import React, { useEffect, useState, memo } from 'react';
import { ScrollView, Text, TouchableOpacity, View, TextInput, Linking } from 'react-native';
import {useTheme} from '@react-navigation/native';
import Clipboard from '@react-native-clipboard/clipboard';
import { getService, API_ROUTES, stringInterpolater, putTokenService, patchService, deleteService, postTokenService } from '../../../Server';
import { mySelector, myDispatch, valuesActions,  } from '../../../redux';
import { Loading, Dropdown, Datepicker } from '../../../components'
import { getName, getActivity } from '../../../utils';
import LinearGradient from 'react-native-linear-gradient';
import assets from '../../../assets';

import Fontisto from 'react-native-vector-icons/Fontisto'
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';

import styles from '../Styles'
import dayjs from 'dayjs';

import {
  Provider,
  Toast
} from '@ant-design/react-native'

const Appointments = () => {
  const theme = useTheme();
  const dispatch = myDispatch();

  const cmDetails = mySelector(state=>state.Login.value.cmDetails);
  const baseUrl = mySelector(state=>state.Login.value.baseUrl);
  const loginData = mySelector(state=>state.Login.value.loginData);
  const devEnv = mySelector(state=>state.Login.value.devEnv);

  const [loading, setLoading]= useState({
    appointments: false,
  });

  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);

  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedCareManager, setSelectedCareManager] = useState(null);
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [doctors, setDoctors] = useState([]);
  const [careManagers, setCareManagers] = useState([]);

  useEffect(()=>{
    getService(baseUrl, API_ROUTES.GET_CARE_MANAGERS)
    .then((res)=>{
        if(res.status === 1){

          setCareManagers(res.data)
        }else{
          
          dispatch(valuesActions.statusNot1('Get Care Managers List Status != 1'));
        }
    }).catch((error) => {

      dispatch(valuesActions.error({error:`Error in Get Care Managers List ${error}`}));
    })
  },[]);

  const handleFilter = () => {

    let filterArray = appointments;
    
    let email = cmDetails.email

    if(cmDetails.type === 'admin'){
      email = selectedCareManager?.email ?? undefined;
    }

    if (email) {
      filterArray = filterArray.filter(item => item.ccownername === email)
    }

    if (selectedDoctor?.doctorid) {
      filterArray = filterArray.filter(item => item.doctorid === selectedDoctor?.doctorid)
    }

    setFilteredAppointments(filterArray)
  }

  useEffect(()=>{
    handleFilter()
  },[appointments, selectedCareManager, selectedDoctor ])



  useEffect(()=>{

    setLoading((pre)=>({
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
    .then((res)=>{
      if(res.status === 1){

        setLoading((pre)=>({
          ...pre,
          appointments: false
        }))
        setAppointments(res.data)
      }else{
        
        dispatch(valuesActions.statusNot1(res));
      }
    }).catch((error) => {

        dispatch(valuesActions.error({error:`Error in Get Appointments ${error}`}));
    })
  },[toDate, fromDate])

  const getDoctorsLists = (array) => {
    
    const uniqueDoctors = new Set();

    array.forEach(appointment => {
      const { doctorid, doctorname } = appointment;
      uniqueDoctors.add(JSON.stringify({ doctorid, doctorname }));
    });

    const uniqueDoctorsArray = Array.from(uniqueDoctors).map(JSON.parse);

    setDoctors(uniqueDoctorsArray);
  };

  useEffect(()=>{

    if(appointments.length < 1) return;

    getDoctorsLists(appointments)
  },[appointments])

  function showToastNoMask(txt) {
    Toast.info({
      content: txt,
      mask: false,
    })
  }

  const handleCopy = async (title,text) => {
    try {
      await Clipboard.setString(text);
      showToastNoMask(`${title} Copied to clipboard`);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
    }
  };

  //the main card the renders all the jobs
  //all the actions that happens, happens in this card
  const RenderItem = ({item}) => {
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

    const updateAppointment = (type)=> {

      let body

      if(type === 'cancel'){
        body={
          updatetype: "cancelled",
          cancelledby: loginData.email,
          bookingid: pat?.bookingid
        }
      }else if(type === 'undo'){
        body={
          updatetype: "undo",
          bookingid: pat?.bookingid
        }
      }
      else if(type === 'checkedin'){
        body={
          updatetype: "checkedin",
          bookingid: pat?.bookingid
        }
      }
      else if(type === 'checkedout'){
        body={
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
      .then((res)=>{

          if(res.status === 1){

            if(type === 'cancel'){

              setCancelled(true);
            }else if(type === 'undo'){

              setStatus('booked');
              showToast('Status updated to Booked!')
            }
          }else{
            console.log(res)
            dispatch(valuesActions.statusNot1('Update Appointment Status != 1'));
          }
      }).catch((error) => {

        dispatch(valuesActions.error({error:`Error in Update Appointment ${error}`}));
      })
    }

    function formatTime(timeString) {
      const [hours, minutes, secs, ampm] = timeString.split(/:| /);
      const formattedTime = `${hours}:${minutes} ${ampm.toUpperCase()}`;
  
      return formattedTime;
    }

    const copyEmrLink = ()=> {

      if(pat?.selectedprocedure == 'consultation'){

        if(!pat.bookingid){
          showToast("Booking is not created")
          return;
        }

        if (devEnv) {

          const url = "http://doctor.circle.care/emrpage?id="+pat?.patientid+ "&actid=" +pat?.activityid+"&bid="+pat?.bookingid+"&check=1";
          handleCopy('Dev Emr Page Link', url)
        }else {

          const url = "http://devdoctor.circle.care/emrpage?id="+pat?.patientid+ "&actid=" +pat?.activityid+"&bid="+pat?.bookingid+"&check=1";
          handleCopy('Emr Page Link', url)
        }
      }
    }

    const sendAppointmentsReminder = () => {

      const body={
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
      .then((res)=>{
          if(res.status === 1){

            showToast('Reminder sent successfully')
          }else{
            
            dispatch(valuesActions.statusNot1('Send WhatsApp Reminder Status != 1'));
          }
      }).catch((error) => {

        dispatch(valuesActions.error({error:`Error in Send WhatsApp Reminder ${error}`}));
      })
    }

    return (
      <TouchableOpacity>
        <LinearGradient
          colors={
            pat.careplan === 'vip' ? 
            ['#e5ac01','#fdf774','#fdf774','#e5ac01'] 
            : 
            ['#87adff','#cedaff','#cedaff','#87adff']
          }
          style={styles.patientCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}  
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
                      justifyContent:'space-between',
                      alignItems:'flex-start'
                    }}
                  >
                    <Text style={styles.title}>{getName(pat.patientname)}</Text>
                    <Text style={{ ...styles.text, }} >{pat.brandname} - {pat?.careplan}</Text>
                  </View>

                  <View
                    style={{
                      ...styles.row,
                      justifyContent:'space-between',
                      alignItems:'flex-start',
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
                        color={theme.colors.primary}
                      />
                      <Text style={styles.title}>
                        Status - {getName(status)}
                      </Text>
                    </View>

                  </View>

                  <View
                    style={{
                      ...styles.row,
                      justifyContent:'space-between',
                      alignItems:'flex-start',
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
                        color={theme.colors.primary}
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
                      justifyContent:'space-between',
                      alignItems:'flex-start',
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
                        color={theme.colors.primary}
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
                      justifyContent:'space-between',
                      marginTop: 15
                    }}
                  >
                    <Text style={[styles.details, {fontSize: 14, fontWeight:500}]}>{pat?.ccownername} </Text>

                    {/* you can add something here */}
                  </View>

                  <View style={{...styles.row, marginTop:10, justifyContent:'space-between'}}>
                    <Text style={{...styles.title}}>+{pat?.mobile}</Text>

                    <View style={{...styles.row, columnGap:15}}>
                      
                      <TouchableOpacity style={{...styles.minBtn}}>
                        <Text style={{...styles.title}}>Text</Text>
                        <Fontisto
                          name='whatsapp'
                          size={15}
                          color={theme.colors.primary}
                        />
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={{...styles.minBtn}}
                        onLongPress={()=>Linking.openURL(`tel:+${pat?.mobile}`)}
                      >
                        <Text style={{...styles.title}}>Call</Text>
                        <Fontisto
                          name='phone'
                          size={15}
                          color={theme.colors.primary}
                        />
                      </TouchableOpacity>

                    </View>
                  </View>

                  <View
                    style={{
                      ...styles.row,
                      justifyContent:'space-between',
                      alignItems:'flex-start',
                      marginTop:20,
                      columnGap: 10,
                    }}
                  >
                    <TouchableOpacity
                      style={{
                        ...styles.actionBtn, 
                        opacity: status === 'checkedout' ? 1 : 0.5
                      }}
                      onPress={()=>{
                        if(status === 'checkedout') updateAppointment('undo')
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
                        color={theme.colors.primary}
                      />
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={{...styles.actionBtn}}
                      onPress={sendAppointmentsReminder}
                    >
                      <Text style={{...theme.fonts.titleSmall, color: '#000'}}>Send Reminder</Text>
                      <Feather
                        name='send'
                        size={15}
                        color={theme.colors.primary}
                      />
                    </TouchableOpacity>
                  </View>

                  <View
                    style={{
                      ...styles.row,
                      justifyContent:'center',
                      alignItems:'center',
                      marginTop:20,
                      columnGap: 20
                    }}
                  >
                    <TouchableOpacity 
                      style={{...styles.actionBtn, justifyContent:'center'}}
                      onPress={()=>{
                        setCancelInitiated(true);
                      }}
                    >
                      <Text style={{...theme.fonts.titleSmall, color: '#a80000'}}>Cancel Booking</Text>
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
                      justifyContent:'space-between',
                      alignItems:'flex-start',
                      marginTop:20,
                      columnGap: 20
                    }}
                  >
                    <TouchableOpacity
                      style={{...styles.minBtn}}
                      onPress={copyEmrLink}
                    >
                      <Feather
                        name='copy'
                        size={15}
                        color={theme.colors.primary}
                      />
                      <Text style={{...theme.fonts.titleSmall, color: '#000'}}>Copy Emr Link</Text>
                    </TouchableOpacity>

                    {
                      pat?.onlinelink ?
                      <TouchableOpacity
                        style={{...styles.minBtn}}
                        onPress={()=>handleCopy('Video Call link', pat.onlinelink)}
                      >
                        <Feather
                          name='copy'
                          size={15}
                          color={theme.colors.primary}
                        />
                        <Text style={{...theme.fonts.titleSmall, color: '#000'}}>Copy Video Link</Text>
                      </TouchableOpacity>
                      :null
                    }
                  
                  </View>

                  <View
                    style={{
                      ...styles.row,
                      justifyContent:'flex-end',
                      marginTop:25,
                    }}
                  >
                    <TouchableOpacity
                      style={{
                        ...styles.minBtn,
                        backgroundColor:'transparent'
                      }}
                      onPress={()=>setExpanded(false)}
                    >
                      <Text style={{
                          ...styles.details,
                          ...theme.fonts.titleSmall,
                          color:theme.colors.primary,
                        }}>
                        Minimize
                      </Text>
                      <Feather
                        name='minimize'
                        size={15}
                        color={theme.colors.primary}
                      />
                    </TouchableOpacity>
                  </View>

                </>
                :
                <TouchableOpacity
                  onPress={()=>{setExpanded(true)}}
                >

                  <View
                    style={{
                      ...styles.row,
                      justifyContent:'space-between',
                      alignItems:'flex-start'
                    }}
                  >
                    <Text style={styles.title}>{getName(pat.patientname)}</Text>
                    <Text style={{ ...styles.text, }} >{pat.brandname} - {pat?.careplan}</Text>
                  </View>

                  <View
                    style={{
                      ...styles.row,
                      justifyContent:'space-between',
                      alignItems:'flex-start',
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
                        color={theme.colors.primary}
                      />
                      <Text style={styles.title}>
                        Status - {getName(pat.status)}
                      </Text>
                    </View>

                  </View>

                  <View
                    style={{
                      ...styles.row,
                      justifyContent:'space-between',
                      alignItems:'flex-start',
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
                        color={theme.colors.primary}
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
                      justifyContent:'space-between',
                      alignItems:'flex-start',
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
                        color={theme.colors.primary}
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
                      justifyContent:'space-between',
                      marginTop: 15
                    }}
                  >
                    <Text style={[styles.details, {fontSize: 14, fontWeight:500}]}>{pat?.ccownername} </Text>

                    <View
                      style={{...styles.minBtn, backgroundColor: 'transparent', paddingHorizontal:0}}
                    >
                      <Text style={{...theme.fonts.titleSmall, color: theme.colors.primary}}>Expand</Text>
                      <Feather
                        name='maximize'
                        size={15}
                        color={theme.colors.primary}
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
                  <Text style={[styles.title, {marginVertical:10}]}>
                    Are you sure you want to Cancel this Appointment, once cancelled cannot be undone?
                  </Text>

                  <View
                  style={{
                    ...styles.row,
                    justifyContent:'space-between',
                    alignItems:'flex-start',
                    marginTop:5,
                    columnGap: 20
                  }}
                  >
                  <TouchableOpacity 
                    style={{...styles.actionBtn, justifyContent:'center'}}
                    onPress={()=>{
                      setCancelInitiated(false);
                    }}
                  >
                    <Text style={{...theme.fonts.titleSmall, color: '#000'}}>No Dont</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={{...styles.actionBtn, justifyContent:'center'}}
                    onPress={()=>{
                      updateAppointment('cancel');
                    }}
                  >
                    <Text style={{...theme.fonts.titleSmall, color: '#000'}}>Yes Cancel!</Text>
                  </TouchableOpacity>
                  </View>
                </>
                :
                <Text
                  style={[
                    styles.title,
                    {
                      marginTop:15,
                      color:'#044004',
                      width:'100%',
                      textAlign:'center'
                    }
                  ]}
                >
                  Appointment cancelled Successfully!
                </Text>
              }
            </>
          }

        </LinearGradient>
      </TouchableOpacity>
    )
  };

  {/* My Jobs */}
  return (
    <Provider>
      <View style={{flex: 1, marginHorizontal: 10, marginBottom: 20}}>

        {
          cmDetails.type === 'admin' ?
          <Dropdown
            title='Select Care Manager'
            options={careManagers}
            selectedOption={selectedCareManager}
            onSelect={(option)=> setSelectedCareManager(option)}
            value={'email'}
            label={'email'}
            placeholder={'Select Care Manager'}
            style={{
              marginTop: 5
            }}
          />
          : null
        }
        
        <Dropdown
          title='Select Doctor'
          options={doctors}
          selectedOption={selectedDoctor}
          onSelect={(option)=> setSelectedDoctor(option)}
          value={'doctorid'}
          label={'doctorname'}
          placeholder={'Select Doctor'}
          style={{
            marginTop: 10
          }}
        />
        
        <View
          style={{
            ...styles.row,
            justifyContent: 'flex-end',
            marginTop: 10
          }}
        >
          <TouchableOpacity
            style={{
              ...styles.minBtn,
              backgroundColor: '#f2f9ff',
              borderWidth: 1,
              borderColor: '#ccc'
            }}
            onPress={()=>{
              setSelectedDoctor(null)
              setSelectedCareManager(null)
              setFilteredAppointments(appointments)
            }}
          >
            <Feather
              name='copy'
              size={15}
              color={theme.colors.primary}
            />
            <Text style={{...theme.fonts.titleSmall, color: '#000'}}>
              Clear
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            ...styles.row,
          }}
        >
          <Text
            style={{
              ...styles.text,
              flex: 1,
            }}
          >
            From Date
          </Text>
          <Text
            style={{
              ...styles.text,
              flex: 1,
            }}
          >
            To Date
          </Text>
        </View>

        <View
          style={{
            ...styles.row,
          }}
        >
          <Datepicker
            label="Select Date"
            value={fromDate}
            maxDate={toDate}
            onChange={setFromDate}
            placeholder="Select a date"
            style={{
              marginTop: 10,
              flex: 1,
            }}
          />
          <Datepicker
            label="Select Date"
            value={toDate}
            minDate={fromDate}
            onChange={setToDate}
            placeholder="Select a date"
            style={{
              marginTop: 10,
              flex: 1
            }}
          />
        </View>

        
        

        {
          !loading.appointments ?
          <>
            {
              filteredAppointments?.length > 0 ?
              <>
                {
                  filteredAppointments.map((item, i)=>(
                    <RenderItem item={item} key={i}/>
                  ))
                }
              </>
              :
              <View
                style={{
                  marginVertical:15
                }}
              >
                <Text style={styles.text}>
                  No appointments found for the searched day or filter, select different Date, Care Manager or Doctor
                </Text>
              </View>

            }
          </>
          :
          <Loading theme={theme}/>
        }
      </View>
    </Provider>
  );
};

export default Appointments;