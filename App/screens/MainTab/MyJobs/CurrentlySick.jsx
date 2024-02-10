/* tslint:disable:no-console */
import React, { useEffect, useState, memo } from 'react';
import { ScrollView, Text, TouchableOpacity, View, TextInput, Linking } from 'react-native';
import {useTheme} from '@react-navigation/native';
import Clipboard from '@react-native-clipboard/clipboard';
import { getService, API_ROUTES, stringInterpolater, putTokenService, patchService, deleteService, patchTokenService } from '../../../Server';
import { mySelector, myDispatch, valuesActions,  } from '../../../redux';
import { Loading, Dropdown, Datepicker } from '../../../components'
import { getName } from '../../../utils';
import LinearGradient from 'react-native-linear-gradient';
import assets from '../../../assets';

import Fontisto from 'react-native-vector-icons/Fontisto'
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import styles from '../Styles'
import dayjs from 'dayjs';

import {
  Provider as AntProvider,
  Toast
} from '@ant-design/react-native'

const CurrentlySick = ({navigation}) => {
  const theme = useTheme();
  const dispatch = myDispatch();

  const cmDetails = mySelector(state=>state.Login.value.cmDetails);
  const baseUrl = mySelector(state=>state.Login.value.baseUrl);
  const loginData = mySelector(state=>state.Login.value.loginData);

  const [loading, setLoading]= useState({
    cSick: cmDetails.type === 'admin' ? false : true,
  });
  //set loading true and used time out because of loading animation glitch

  const [cSick, setCSick] = useState([]);

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

  const [selectedCareManager, setSelectedCareManager] = useState(null);

  const handleSelect = (option) => {
    setSelectedCareManager(option);
  };

  useEffect(()=>{
    if(cmDetails.type === 'admin' && !selectedCareManager?.email) return;

    let email = selectedCareManager?.email ?? cmDetails.email
    
    setLoading((pre)=>({
      ...pre,
      cSick: true
    }))

    getService(baseUrl, stringInterpolater(API_ROUTES.MY_SICK_PATIENTS, {email: email}))
    .then((res)=>{
        if(res.status === 1){

          setTimeout(()=>{
            setLoading((pre)=>({
              ...pre,
              cSick: false
            }))

            setCSick(res.data)
          },500)
        }else if(res.status === 0){

          setTimeout(()=>{
            setLoading((pre)=>({
              ...pre,
              cSick: false
            }))

            setCSick(null)
          },500)
        }
    }).catch((error) => {

        dispatch(valuesActions.error({error:`Error in My Sick Patients ${error}`}));
    })
  },[selectedCareManager])

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

    const [remarks, setRemarks] = useState(pat.remarks);
    const [status, setStatus] = useState(pat.status);
    const [deleteInitiated, setDeleteInitiated] = useState(false);
    const [deleted, setDeleted] = useState(false);
    const [expanded, setExpanded] = useState(false);

    function replaceOrAppendText(text, replacement) {
      const match = text.match(/\[.*?\]/);
      if (match) {
          const newText = text.replace(/\[.*?\]/g, `[${replacement}]`);
          return newText;
      } else {
          return `${text} [${replacement}]`;
      }
    }

    const updateRemarksOptions = (text, type)=> {

      if(type === 'remarks' && text.length < 3 ) return;
      if(type === 'stage' && text.length < 3 ) return;


      const body  = {
        [type]: replaceOrAppendText(text, dayjs().format('DD-MM-YYYY')),
        source: 'cm_app'
      }

      putTokenService(
        baseUrl,
        stringInterpolater(API_ROUTES.UPDATE_PATIENT_DETAILS,{patientid: pat.patientid}),
        body,
        loginData.token
      )
      .then((res)=>{
          if(res.status === 1){

            if(type === 'remarks' ) setRemarks(replaceOrAppendText(text, dayjs().format('DD-MM-YYYY')));
            else if(type === 'stage') updateStage(text);
            
          }else{
            
            dispatch(valuesActions.statusNot1('Updating Remarks / Options Status != 1'));
          }
      }).catch((error) => {

        dispatch(valuesActions.error({error:`Error in Updating Remarks / Options ${error}`}));
      })
    }

    function showToast(txt) {
      Toast.info({
        content: txt,
        mask: false,
      })
    }

    const deleteSickHistory = ()=> {

      const body = {
        status: "delete",
        source: "cm_app"
      }

      patchTokenService(
        baseUrl,
        stringInterpolater(API_ROUTES.SICKHISTORY_UPDATE,{sickhistoryid: pat?.sickhistoryid}),
        body,
        loginData.token
      )
      .then((res)=>{
          if(res.status === 1){

            setDeleted(true)
          }else{
            console.log('res',res)
            dispatch(valuesActions.statusNot1('Delete Sick History Status != 1'));
          }
      }).catch((error) => {

        dispatch(valuesActions.error({error:`Error Sick History delete ${error}`}));
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
            !deleteInitiated ?
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
                    <Text style={styles.title}>{getName(pat.firstname, pat.lastname)}</Text>
                    <View style={styles.row}>
                      <Text style={{
                          ...styles.text,
                          marginRight:7
                        }}
                      >{getName(pat?.relationship)}</Text>
                      {
                        pat.gender === 'male' &&
                        <Fontisto
                          name='male'
                          size={15}
                          color={'#830000'}
                        />
                      }
                      {
                        pat.gender === 'female' &&
                        <Fontisto
                          name='female'
                          size={15}
                          color={'#660058'}
                        />
                      }
                      <Text
                        style={{
                          ...styles.text,
                          color: pat.gender === 'male' ? '#830000' : '#660058'
                        }}
                      >{pat.gender}</Text>
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
                    <Text style={styles.title}>
                      <Text style={[styles.details, {fontSize: 14, fontWeight:500}]}>Status- </Text> {getName(pat.status ?? 'Not Updated')}
                    </Text>

                    <Text style={styles.title}>
                      {dayjs(pat.duedate).format('D MMM YYYY')}
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
                    <Text style={[styles.details, {fontSize: 14, fontWeight:500}]}>{getName(pat.ccownername)}</Text>

                    {/* something can be added here */}
                    
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

                  { status ?
                    <Text style={[styles.title, {marginTop: 15}]}>
                      <Text style={[styles.details, {fontSize: 14}]}>Status- </Text> {getName(status)}
                    </Text>
                    : null
                  }

                  {
                    remarks?.length > 0 &&
                    <>
                      <Text style={[theme.fonts.titleSmall, {color:'#000', marginTop:15}]}>
                        Remarks
                      </Text>

                      <TextInput
                        style={[
                          theme.fonts.titleSmall,
                          { 
                            marginTop:10,
                            color:'#535353',
                            borderWidth:1,
                            borderRadius: 5,
                            borderColor: '#ccc',
                            paddingHorizontal:10,
                            paddingVertical:5,
                            backgroundColor: '#fff',
                          }
                        ]}
                        multiline={true}
                        value={remarks}
                        onChangeText={(val) => setRemarks(val)}
                        editable={false}
                      />
                    </>
                  }

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
                      style={{...styles.actionBtn, justifyContent:'center'}}
                      onPress={()=>{
                        setDeleteInitiated(true);
                      }}
                    >
                      <Text style={{...theme.fonts.titleSmall, color: '#a80000'}}>Delete</Text>
                      <Feather
                        name='x-square'
                        size={15}
                        color={'#a80000'}
                      />
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={{...styles.actionBtn, justifyContent:'center'}}
                      onPress={() => navigation.navigate('CurrentlySickItem')}
                    >
                      <Text style={{...theme.fonts.titleSmall, color: '#000'}}>Edit</Text>
                      <Feather
                        name='edit'
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
                    <View style={styles.row}>
                      <Text style={{
                          ...styles.text,
                          marginRight:7
                        }}
                      >{getName(pat?.relationship)}</Text>
                      {
                        pat.gender === 'male' &&
                        <Fontisto
                          name='male'
                          size={15}
                          color={'#830000'}
                        />
                      }
                      {
                        pat.gender === 'female' &&
                        <Fontisto
                          name='female'
                          size={15}
                          color={'#660058'}
                        />
                      }
                      <Text
                        style={{
                          ...styles.text,
                          color: pat.gender === 'male' ? '#830000' : '#660058'
                        }}
                      >{pat.gender}</Text>
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
                    <Text style={styles.title}>
                      <Text style={[styles.details, {fontSize: 14, fontWeight:500}]}>Status- </Text> {getName(pat.status ?? 'Not Updated')}
                    </Text>

                    <Text style={styles.title}>
                      {dayjs(pat.duedate).format('D MMM YYYY')}
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
                    <Text style={[styles.details, {fontSize: 14, fontWeight:500}]}>{getName(pat.ccownername)}</Text>

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
                !deleted ?
                <>
                  <Text style={[styles.title, {marginVertical:10}]}>
                    Are you sure you want to delete once deleted cannot be undone
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
                      setDeleteInitiated(false);
                    }}
                  >
                    <Text style={{...theme.fonts.titleSmall, color: '#000'}}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={{...styles.actionBtn, justifyContent:'center'}}
                    onPress={()=>{
                      deleteSickHistory();
                    }}
                  >
                    <Text style={{...theme.fonts.titleSmall, color: '#000'}}>Yes Delete!</Text>
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
                  Sick History Deleted Successfully!
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
    <AntProvider>
      <ScrollView 
        showsVerticalScrollIndicator={false}
      >
        <View style={{marginHorizontal: 10 }}>

          {
            cmDetails.type === 'admin' ?
            <Dropdown
              title='Select Care Manager'
              options={careManagers}
              selectedOption={selectedCareManager}
              onSelect={handleSelect}
              value={'email'}
              label={'email'}
              placeholder={'Select Care Manager'}
              style={{
                marginBottom: 15
              }}
            />
            : null
          }

          {
            !loading.cSick ?
            <>
              {
                cSick?.length > 0 ?
                <>
                  {
                    cSick.map((item, i)=>(
                      <RenderItem item={item} key={i}/>
                    ))
                  }
                </>
                :
                <View>
                  <Text style={styles.text}>
                    Yea! there are no sick patients congrats 
                  </Text>
                </View>
              }
            </>
            :
            <Loading theme={theme}/>
          }

        </View>
      </ScrollView>
    </AntProvider>
  );
};

export default CurrentlySick;