/* tslint:disable:no-console */
import React, { useEffect, useState, memo } from 'react';
import { ScrollView, Text, TouchableOpacity, View, TextInput, Linking } from 'react-native';
import {useTheme} from '@react-navigation/native';
import Clipboard from '@react-native-clipboard/clipboard';
import { getService, API_ROUTES, stringInterpolater, postTokenService, patchService, deleteService } from '../../../server';
import { mySelector, myDispatch, valuesActions,  } from '../../../redux';
import { Loading, Dropdown, DatePicker } from '../../../components'
import { getName } from '../../../utils';
import LinearGradient from 'react-native-linear-gradient';
import assets from '../../../assets';

import Fontisto from 'react-native-vector-icons/Fontisto'
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import styles from '../Styles'
import dayjs from 'dayjs';

import {
  Toast
} from '@ant-design/react-native'

const HealthPlanReminder = () => {
  const theme = useTheme();
  const dispatch = myDispatch();

  const cmDetails = mySelector(state=>state.Login.value.cmDetails);
  const baseUrl = mySelector(state=>state.Login.value.baseUrl);
  const loginData = mySelector(state=>state.Login.value.loginData);
  const [selectedOption, setSelectedOption] = useState(null);

  const [loading, setLoading]= useState({
    reminders:false,
  });

  const [reminders, setReminders] = useState([]);

  useEffect(()=>{
    if(cmDetails.type === 'admin' && !selectedOption?.email) return;

    setLoading((pre)=>({
      ...pre,
      reminders: true
    }))

    getService(baseUrl, stringInterpolater(API_ROUTES.HEALTH_PLAN_REMINDERS, {email: 
      selectedOption?.email ?? cmDetails.email
    }))
    .then((res)=>{
        if(res.status === 1){

          setLoading((pre)=>({
            ...pre,
            reminders: false
          }))

          setReminders(res.data);
        }else{

          setLoading((pre)=>({
            ...pre,
            reminders: false
          }))

          setReminders([])
        }
    }).catch((error) => {

        dispatch(valuesActions.error({error:`Error in Health Plan Reminders ${error}`}));
    })
  },[selectedOption?.email])

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
  },[])

  const handleSelect = (option) => {
    setSelectedOption(option);
  };

  function showToastNoMask(txt) {
    Toast.info({
      content: txt,
      mask: false,
    })
  }


  //the main card the renders all the jobs
  //all the actions that happens, happens in this card
  const RenderItem = ({item}) => {
    const pat = item;
    const [expanded, setExpanded] = useState(false);

    const sendAppointmentsReminder = () => {
      
      getService(
        baseUrl,
        stringInterpolater(API_ROUTES.SEND_H_PLAN_REMINDER, {patientid: pat.patientid })
      )
      .then((res)=>{
          if(res.status === 1){

            showToastNoMask('Reminder sent successfully')
          }else{
            
            dispatch(valuesActions.statusNot1('Send Health Plan Reminder Status != 1'));
          }
      }).catch((error) => {

        dispatch(valuesActions.error({error:`Error in Send Health Plan Reminder ${error}`}));
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
          <View
            style={{
              margin:2.5,
              backgroundColor:'#fff',
              padding:8,
              borderRadius:4
            }}
          >
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
                  <Text style={styles.title}>{getName(pat.firstname, pat.lastname)}</Text>
                  <Text 
                    style={{
                      ...styles.title,
                      marginRight:7
                    }}
                  >{getName(pat.careplan)}</Text>
                </View>

                <View
                  style={{
                    ...styles.row,
                    justifyContent:'space-between',
                    alignItems:'flex-start',
                    marginTop: 15
                  }}
                >
                  <Text style={styles.title}>
                    <Text style={[styles.details, {fontSize: 14, fontWeight:500}]}>+91</Text> {pat.mobile}
                  </Text>

                  <Text style={styles.title}>
                    {dayjs(pat.duedate).format('DD MMM YYYY')}
                  </Text>
                </View>
                
                {
                  pat?.healthplan?.remarks &&
                  <View>
                  <Text style={[theme.fonts.titleSmall, {color:'#000', marginTop:15}]}>
                    Remarks
                  </Text>

                  <TextInput
                    style={[
                      theme.fonts.titleSmall,
                      { 
                        marginTop:10,
                        color:'#666666',
                        borderWidth:1,
                        borderRadius: 5,
                        borderColor: '#a4a4a4',
                        paddingHorizontal:10,
                        paddingVertical:5,
                        backgroundColor: '#fff',
                      }
                    ]}
                    multiline={true}
                    value={pat?.healthplan?.remarks}
                    editable={false}
                  />
                </View>
                }

                {
                  Object.keys(pat?.healthplan).map((item, i)=>{
                    const array = ['labplanofaction', 'dietplanofaction', 'mediplanofaction', 'mentalplanofaction', 'fitnessplanofaction', 'followupplanofaction']
                    const realname = {
                      mediplanofaction: 'Medication',
                      labplanofaction: 'Labs',
                      dietplanofaction: 'Diet',
                      mentalplanofaction: 'Mental',
                      fitnessplanofaction: 'Fitness',
                      followupplanofaction: 'Followup'
                    }
                    if(!array.includes(item)) return;

                    const object = pat?.healthplan
                    if(!object?.[item]?.enabled) return;

                    return(
                      <View
                        key={i}
                        style={{
                          marginTop: 20,
                          padding:7,
                          backgroundColor:'#ffffff',
                          borderRadius:5,
                          paddingHorizontal:10,
                          borderWidth: 1,
                          flex: 1
                        }}
                      >
                        <View
                          style={{
                            ...styles.row,
                            justifyContent:'space-between',
                            alignItems:'flex-start',
                            flex: 1
                          }}
                        >
                          <Text style={styles.title}>
                            {realname?.[item]}
                          </Text>

                          <Text style={styles.text}>
                            {object?.[item].frequency}
                          </Text>
                        </View>
                        <View
                          style={{
                            ...styles.row,
                            justifyContent:'space-between',
                            alignItems:'flex-start',
                            flex: 1,
                            marginTop: 10
                          }}
                        >
                          <Text style={styles.text}>
                            Start- {dayjs(object?.[item]?.startdate).format('DD MMM YYYY')}
                          </Text>

                          <Text style={styles.text}>
                            End- {dayjs(object?.[item]?.enddate).format('DD MMM YYYY')}
                          </Text>
                        </View>
                      </View>
                    )
                  })
                }
                
                

                {
                  pat?.messages.length > 0 &&
                  <>
                  {
                    pat?.messages.map((item,i)=>(
                      <View key={i}>
                        <Text style={[theme.fonts.titleSmall, {color:'#000', marginTop:15}]}>
                          {getName(item.type)} Message
                        </Text>

                        <TextInput
                          style={[
                            theme.fonts.titleSmall,
                            { 
                              marginTop:10,
                              color:'#666666',
                              borderWidth:1,
                              borderRadius: 5,
                              borderColor: '#a4a4a4',
                              paddingHorizontal:10,
                              paddingVertical:5,
                              backgroundColor: '#fff',
                            }
                          ]}
                          multiline={true}
                          value={item.remarks}
                          editable={false}
                        />
                      </View>
                    ))
                  }
                  </>
                  
                }

                <View
                  style={{
                    ...styles.row,
                    justifyContent:'space-between',
                    alignItems:'flex-start',
                    marginTop:25,
                    columnGap: 20
                  }}
                >
                  <TouchableOpacity
                    style={{...styles.actionBtn}}
                    onPress={()=>{sendAppointmentsReminder()}}
                  >
                    <Text style={{...theme.fonts.titleSmall, color: '#000'}}>Send Reminder</Text>
                    <Feather
                      name='navigation'
                      size={15}
                      color={theme.colors.primary}
                    />
                  </TouchableOpacity>
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
                  <Text style={styles.title}>{getName(pat.firstname, pat.lastname)}</Text>
                  <Text 
                    style={{
                      ...styles.title,
                      marginRight:7
                    }}
                  >{getName(pat.careplan)}</Text>
                </View>

                <View
                  style={{
                    ...styles.row,
                    justifyContent:'space-between',
                    alignItems:'flex-start',
                    marginTop: 15
                  }}
                >
                  <Text style={styles.title}>
                    <Text style={[styles.details, {fontSize: 14, fontWeight:500}]}>+91</Text> {pat.mobile}
                  </Text>

                  <Text style={styles.title}>
                    {dayjs(pat.duedate).format('DD MMM YYYY')}
                  </Text>
                </View>

                {
                  pat?.messages.length > 1 &&
                  <>
                  {
                    pat?.messages.map((item)=>(
                      <>
                        <Text style={[theme.fonts.titleSmall, {color:'#000', marginTop:15}]}>
                          {getName(item.type)}
                        </Text>

                        <TextInput
                          style={[
                            theme.fonts.titleSmall,
                            { 
                              marginTop:10,
                              color:'#666666',
                              borderWidth:1,
                              borderRadius: 5,
                              borderColor: '#ccc',
                              paddingHorizontal:10,
                              paddingVertical:5,
                              backgroundColor: '#fff',
                            }
                          ]}
                          multiline={true}
                          value={item.remarks}
                          editable={false}
                        />
                      </>
                    ))
                  }
                  </>
                  
                }

                <View
                  style={{
                    ...styles.row,
                    justifyContent:'space-between',
                    alignItems:'flex-start',
                    marginTop: 15
                  }}
                >
                  <Text style={styles.title}>
                  </Text>

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
          </View>
        </LinearGradient>
      </TouchableOpacity>
    )
  };

  {/* My Jobs */}
  return (
    <ScrollView 
      showsVerticalScrollIndicator={false}
    >
      <View style={{marginHorizontal: 10 }}>

        {
          cmDetails.type === 'admin' ?
          <Dropdown
            title='Select Care Manager'
            options={careManagers}
            selectedOption={selectedOption}
            onSelect={handleSelect}
            value={'email'}
            label={'email'}
            placeholder={'Select Care Manager'}
            style={{marginBottom:15}}
          />
          : null
        } 

        {
          !loading.reminders ?
          <>
            {
              reminders?.length > 0 ?
              <>
                {
                  reminders.map((item, i)=>(
                    <RenderItem item={item} key={i} />
                  ))
                }
              </>
              :
              <View
                style={{
                  marginVertical:10
                }}
              >
                <Text style={{...styles.text, textAlign:'center'}}>
                  There are no reminders for the day!
                </Text>
              </View>

            }
          </>
          :
          <Loading theme={theme}/>
        }

      </View>
    </ScrollView>
  );
};

export default HealthPlanReminder;