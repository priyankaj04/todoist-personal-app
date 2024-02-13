/* tslint:disable:no-console */
import React, { useEffect, useState, memo } from 'react';
import { ScrollView, Text, TouchableOpacity, View, TextInput, Linking } from 'react-native';
import {useTheme} from '@react-navigation/native';
import Clipboard from '@react-native-clipboard/clipboard';
import { getService, API_ROUTES, stringInterpolater, putTokenService, patchService, deleteService, patchTokenService } from '../../../Server';
import { mySelector, myDispatch, valuesActions,  } from '../../../redux';
import { Loading, Dropdown, DatePicker ,Picker, MultiSelector } from '../../../components';
import { getName } from '../../../utils';
import LinearGradient from 'react-native-linear-gradient';
import assets from '../../../assets';
import {vh, vw} from 'react-native-css-vh-vw';
import { diagnosis } from '../../../Constants'

import Fontisto from 'react-native-vector-icons/Fontisto'
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

import styles from '../Styles'
import dayjs from 'dayjs';

import {
  Toast
} from '@ant-design/react-native';

import {
  Modal,
  Portal
} from 'react-native-paper';

import { useNavigation } from '@react-navigation/native';

const CurrentlySick = () => {
  const theme = useTheme();
  const dispatch = myDispatch();
  const navigation = useNavigation();

  const cmDetails = mySelector(state=>state.Login.value.cmDetails);
  const baseUrl = mySelector(state=>state.Login.value.baseUrl);
  const loginData = mySelector(state=>state.Login.value.loginData);

  const [loading, setLoading]= useState({
    cSick: cmDetails.type === 'admin' ? false : true,
  });
  //set loading true and used time out because of loading animation glitch

  const [cSick, setCSick] = useState([]);

  const [careManagers, setCareManagers] = useState([]);
  const [doctors, setDoctors] = useState([]);

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

    getService(baseUrl, API_ROUTES.GET_ALL_DOCTORS)
    .then((res)=>{
        if(res.status === 1){
          let list = []
          res.data.map((item) => list.push(
            {
              label:item.firstname + " " + item.lastname ?? '',
              value:item.firstname + " " + item.lastname ?? ''
            }
          ));
          setDoctors(list)
        }else{
          
          dispatch(valuesActions.statusNot1('Get all Doctors Status != 1'));
        }
    }).catch((error) => {

      dispatch(valuesActions.error({error:`Error in all Doctors List ${error}`}));
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
    
    const [cSick, setCSick]=useState({
      firstname: '',
      lastname: '',
      gender: '',
      ccownername: '',
      relationship: '',
      pid:'',
      sickhistoryid:'',
      patientid: '',
      mobile: '',
      status: '',
      startdate: '',
      doctorname: '',
      contactperson: true,
      enddate: '',
      lastcommdate:'',
      diagnosis: [],
      history: '',
      details: {
        treatingdoc: '',
        patientintent: '',
      },
      remarks: '',
      type: '',
      priority: '',
    });

    const [editedCSick, setEditedCSick]=useState({});

    useEffect(()=>{

      const updatedCSick = {};

      Object.keys(cSick).forEach((key) => {
        updatedCSick[key] = (typeof item[key] === 'boolean') ? item[key] : ( item[key] ?? '' ); 
      });

      setCSick(updatedCSick);

      setEditedCSick(updatedCSick)

    },[])

    const [remarks, setRemarks] = useState(cSick.remarks ?? '');
    const [status, setStatus] = useState(cSick.status);
    const [deleteInitiated, setDeleteInitiated] = useState(false);
    const [deleted, setDeleted] = useState(false);
    const [expanded, setExpanded] = useState(false);

    const [modalVisible, setModalVisible]=useState(false);
    const showModal = () => setModalVisible(true);
    const hideModal = () => setModalVisible(false);

    function replaceOrAppendText(text, replacement) {
      if(text.length < 2) return

      const match = text.match(/\[.*?\]/);
      if (match) {
          const newText = text.replace(/\[.*?\]/g, `[${replacement}]`);
          return newText;
      } else {
          return `${text} [${replacement}]`;
      }
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
        stringInterpolater(API_ROUTES.SICKHISTORY_UPDATE,{sickhistoryid: cSick?.sickhistoryid}),
        body,
        loginData.token
      )
      .then((res)=>{
          if(res.status === 1){

            setDeleted(true)
          }else{

            dispatch(valuesActions.statusNot1('Delete Sick History Status != 1'));
          }
      }).catch((error) => {

        dispatch(valuesActions.error({error:`Error Sick History delete ${error}`}));
      })
    }

    const saveUpdatedChanges = ()=> {

      const body = {
        source: 'cm_app',
        remarks: editedCSick.remarks,
        details: editedCSick.details,
        doctorname: editedCSick.doctorname,
        status: editedCSick.status,
        startdate: editedCSick.startdate,
        contactperson: (typeof editedCSick.contactperson === 'boolean') ? editedCSick.contactperson : null ,
        enddate: editedCSick.enddate,
        lastcommdate: editedCSick.lastcommdate,
        history: editedCSick.history,
        type: editedCSick.type,
        priority: editedCSick.priority
      }

      patchTokenService(
        baseUrl,
        stringInterpolater(API_ROUTES.SICKHISTORY_UPDATE,{sickhistoryid: cSick?.sickhistoryid}),
        body,
        loginData.token
      )
      .then((res)=>{
          if(res.status === 1){

            setCSick(editedCSick);
            showToast('Details updated successfully');
            hideModal();
          }else{

            console.log('res',res)
            dispatch(valuesActions.statusNot1('Update C Sick Status != 1'));
          }
      }).catch((error) => {

        dispatch(valuesActions.error({error:`Error Update C Sick ${error}`}));
      })
    }


    return (
      <View>
        <LinearGradient
          colors={
            cSick.careplan === 'vip' ? 
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
                    <Text style={styles.title}>{getName(cSick.firstname, cSick.lastname)}</Text>
                    <View style={styles.row}>
                      <Text style={{
                          ...styles.text,
                          marginRight:7
                        }}
                      >{getName(cSick?.relationship)}</Text>
                      {
                        cSick.gender === 'male' &&
                        <Fontisto
                          name='male'
                          size={15}
                          color={'#830000'}
                        />
                      }
                      {
                        cSick.gender === 'female' &&
                        <Fontisto
                          name='female'
                          size={15}
                          color={'#660058'}
                        />
                      }
                      <Text
                        style={{
                          ...styles.text,
                          color: cSick.gender === 'male' ? '#830000' : '#660058'
                        }}
                      >{cSick.gender}</Text>
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
                      <Text style={[styles.details, {fontSize: 14, fontWeight:500}]}>Status- </Text> {getName(cSick.status ?? 'Not Updated')}
                    </Text>

                    <Text style={styles.title}>
                      {dayjs(cSick.duedate).format('D MMM YYYY')}
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
                    <Text style={[styles.details, {fontSize: 14, fontWeight:500}]}>{getName(cSick.ccownername)}</Text>

                    {/* something can be added here */}
                    
                  </View>

                  <View style={{...styles.row, marginTop:10, justifyContent:'space-between'}}>
                    <Text style={{...styles.title}}>+{cSick?.mobile}</Text>

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
                        onLongPress={()=>Linking.openURL(`tel:+${cSick?.mobile}`)}
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
                      onPress={() => showModal()}
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
                      marginTop:10,
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
                    <Text style={styles.title}>{getName(cSick.firstname, cSick.lastname)}</Text>
                    <View style={styles.row}>
                      <Text style={{
                          ...styles.text,
                          marginRight:7
                        }}
                      >{getName(cSick?.relationship)}</Text>
                      {
                        cSick.gender === 'male' &&
                        <Fontisto
                          name='male'
                          size={15}
                          color={'#830000'}
                        />
                      }
                      {
                        cSick.gender === 'female' &&
                        <Fontisto
                          name='female'
                          size={15}
                          color={'#660058'}
                        />
                      }
                      <Text
                        style={{
                          ...styles.text,
                          color: cSick.gender === 'male' ? '#830000' : '#660058'
                        }}
                      >{cSick.gender}</Text>
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
                      <Text style={[styles.details, {fontSize: 14, fontWeight:500}]}>Status- </Text> {getName(cSick.status ?? 'Not Updated')}
                    </Text>

                    <Text style={styles.title}>
                      {dayjs(cSick.duedate).format('D MMM YYYY')}
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
                    <Text style={[styles.details, {fontSize: 14, fontWeight:500}]}>{getName(cSick.ccownername)}</Text>

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
        <Portal>
          <Modal
            visible={modalVisible}
            onDismiss={hideModal}
            contentContainerStyle={{
              flex:1,
              margin:10,
              borderRadius:8,
              backgroundColor:"#fff"
            }}
          >
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 15,
                flex:1,
              }}
            >
              <View style={styles.header}>
                <Text
                  style={{
                    color:theme.colors.text,
                    ...theme.fonts.titleMedium,
                  }}
                >
                  Currently sick
                </Text>
                <Ionicons
                  style={{
                    textAlign:'right',
                    flex:1,
                  }}
                  name="close"
                  size={25}
                  color={theme.colors.text}
                  onPress={() => hideModal()}
                />
              </View>

              <ScrollView style={{width: vw(100)-50}}>
                
                <View
                  style={{
                    ...styles.row,
                    justifyContent:'space-between',
                    alignItems:'flex-start',
                    marginTop:15
                  }}
                >
                  <Text style={styles.title}>{getName(cSick.firstname, cSick.lastname)}</Text>
                  <View style={styles.row}>
                    <Text style={{
                        ...styles.text,
                        marginRight:7
                      }}
                    >{getName(cSick?.relationship)}</Text>
                    {
                      cSick.gender === 'male' &&
                      <Fontisto
                        name='male'
                        size={15}
                        color={'#830000'}
                      />
                    }
                    {
                      cSick.gender === 'female' &&
                      <Fontisto
                        name='female'
                        size={15}
                        color={'#660058'}
                      />
                    }
                    <Text
                      style={{
                        ...styles.text,
                        color: cSick.gender === 'male' ? '#830000' : '#660058'
                      }}
                    >{cSick.gender}</Text>
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
                  <View>
                    <Text style={styles.textWrapper}>
                      <Text style={[styles.details, {fontSize: 14, fontWeight:500}]}>Status- </Text> {getName(cSick.status ?? 'Not Updated')}
                    </Text>
                  </View>
                  
                  <View>
                    <Text style={styles.textWrapper}>
                      {dayjs(cSick.duedate).format('D MMM YYYY')}
                    </Text>
                  </View>
                  
                </View>

                <Text style={[theme.fonts.titleSmall, {color:'#000', marginTop:15}]}>
                  Remarks
                </Text>

                <TextInput
                  style={[
                    theme.fonts.titleSmall,
                    { 
                      marginTop:10,
                      color:'#000',
                      borderWidth:1,
                      borderRadius: 5,
                      paddingHorizontal:10,
                      paddingVertical:5,
                      backgroundColor: '#fff',
                    }
                  ]}
                  multiline={true}
                  value={remarks}
                  onChange={(text)=> setRemarks(text)}
                  onEndEditing={(e) =>{
                    const val = e.nativeEvent.text;
                    const text = replaceOrAppendText(val, dayjs().format('DD-MM-YYYY'));

                    setEditedCSick((editedCSick)=>({
                      ...editedCSick,
                      remarks: text
                    }))
                    setRemarks(text)
                  }}
                />

                <Text style={[theme.fonts.titleSmall, {color:'#000', marginTop:15}]}>
                  History
                </Text>

                <TextInput
                  style={[
                    theme.fonts.titleSmall,
                    { 
                      marginTop:10,
                      color:'#000',
                      borderWidth:1,
                      borderRadius: 5,
                      paddingHorizontal:10,
                      paddingVertical:5,
                      backgroundColor: '#fff',
                    }
                  ]}
                  multiline={true}
                  value={editedCSick?.history}
                  onChangeText={(text) =>

                    setEditedCSick((editedCSick)=>({
                      ...editedCSick,
                      history: text
                    }))
                  }
                />

                
                <View
                  style={{
                    ...styles.row,
                    marginTop: 20
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
                    columnGap:10
                  }}
                >
                  <DatePicker
                    label="Select Date"
                    value={editedCSick?.startdate}
                    onChange={(val)=>
                      setEditedCSick((editedCSick)=>({
                        ...editedCSick,
                        startdate: val
                      }))
                    }
                    placeholder="Start date"
                    style={{
                      marginTop: 10,
                      flex: 1,
                    }}
                    textStyle={{
                      borderColor: '#000'
                    }}
                  />
                  <DatePicker
                    label="Select Date"
                    value={editedCSick?.endate}
                    onChange={(val)=>
                      setEditedCSick((editedCSick)=>({
                        ...editedCSick,
                        enddate: val
                      }))
                    }
                    placeholder="End date"
                    style={{
                      marginTop: 10,
                      flex: 1
                    }}
                    textStyle={{
                      borderColor: '#000'
                    }}
                  />
                </View>

                
                <View
                  style={{
                    ...styles.row,
                    marginTop: 0,
                    columnGap: 15
                  }}
                >
                  <View
                    style={{
                      flexDirection: 'column',
                      flex: 1
                    }}
                  >
                    <Text
                      style={[theme.fonts.titleSmall, {color:'#000'}]}
                    >
                      Last Comm... date
                    </Text>

                    <DatePicker
                      label="Select Date"
                      value={editedCSick?.lastcommdate}
                      onChange={(val)=>
                        setEditedCSick((editedCSick)=>({
                          ...editedCSick,
                          lastcommdate: val
                        }))
                      }
                      placeholder="Start date"
                      style={{
                        marginTop: 10,
                        marginBottom: 0,
                        flex: 1,
                      }}
                      textStyle={{
                        borderColor: '#000',
                        paddingVertical: 8.5
                      }}
                    />
                  </View>
                  
                  <View
                    style={{
                      flex: 1,
                    }}
                  >
                    <Picker
                      theme={theme}
                      style={{marginTop:0}}
                      title='Patient responded'
                      placeholder='Select response'
                      data={[
                        { value: 'yes', label: 'Yes' },
                        { value: 'no', label: 'No' },
                      ]}
                      value={editedCSick?.details?.patientresponse}
                      setValue={(value) =>(

                        setEditedCSick((editedCSick)=>({
                          ...editedCSick,
                          details: {
                            ...editedCSick.details,
                            patientresponse: value
                          }
                        }))
                      )}  
                    />
                  </View>

                </View>

                <Picker
                  theme={theme}
                  style={{marginTop:20}}
                  title='Status'
                  placeholder='Select status'
                  data={[
                    { value: 'ongoing', label: 'Ongoing/Sick Currently' },
                    { value: 'upcoming hospitalized', label: 'Upcoming Hospitalized' },
                    { value: 'hospitalized', label: 'Hospitalized' },
                    { value: 'paused', label: 'Paused' },
                    { value: 'discharged', label: 'Discharged' },
                    { value: 'closed', label: 'Closed' },
                    { value: 'expired', label: 'Expired' },
                  ]}
                  value={editedCSick?.status}
                  setValue={(value) =>(

                    setEditedCSick((editedCSick)=>({
                      ...editedCSick,
                      status: value
                    }))
                  )}  
                />

                <Picker
                  theme={theme}
                  style={{marginTop:20}}
                  title='Treating Doctor'
                  placeholder='Select treating'
                  data={[
                    {
                      label:'In house',
                      value: 'inhouse'
                    },
                    {
                      label:'Outside house',
                      value: 'outhouse'
                    },
                  ]}
                  value={editedCSick?.details?.treatingdoc}
                  setValue={(value) =>(

                    setEditedCSick((editedCSick)=>({
                      ...editedCSick,
                      details: {
                        ...editedCSick.details,
                        treatingdoc: value
                      }
                    }))
                  )}  
                />

                {
                  editedCSick?.details?.treatingdoc == 'inhouse' ?
                  <Picker
                    theme={theme}
                    style={{marginTop: 20}}
                    title='Doctor Name'
                    placeholder='Select a Doctor'
                    data={doctors}
                    value={editedCSick?.doctorname}
                    setValue={(value) =>(

                      setEditedCSick((editedCSick)=>({
                        ...editedCSick,
                        doctorname: value
                      }))
                    )}  
                  />
                  :
                  <>
                    <Text style={[theme.fonts.titleSmall, {color:'#000', marginTop:15}]}>
                      Doctor Name
                    </Text>

                    <TextInput
                      style={[
                        theme.fonts.titleSmall,
                        { 
                          marginTop:10,
                          color:'#000',
                          borderWidth:1,
                          borderRadius: 5,
                          paddingHorizontal:10,
                          paddingVertical:5,
                          backgroundColor: '#fff',
                        }
                      ]}
                      multiline={true}
                      value={editedCSick?.doctorname}
                      onChangeText={(text) =>

                        setEditedCSick((editedCSick)=>({
                          ...editedCSick,
                          doctorname: text
                        }))
                      }
                    />
                  </>
                }

                <Picker
                  theme={theme}
                  style={{marginTop:20}}
                  title='Priority'
                  placeholder='Select priority'
                  data={[
                    { value: 2, label: 'Low Priority' },
                    { value: 3, label: 'Medium Priority' },
                    { value: 4, label: 'High Priority' },
                    { value: 5, label: 'Critical Priority' },
                  ]}
                  value={editedCSick?.priority}
                  setValue={(value) =>(

                    setEditedCSick((editedCSick)=>({
                      ...editedCSick,
                      priority: value
                    }))
                  )}  
                />

                <Picker
                  theme={theme}
                  style={{marginTop:20}}
                  title='Contact person same as patient'
                  placeholder='Select'
                  data={[
                    { value: true, label: 'Yes' },
                    { value: false, label: 'No' },
                  ]}
                  value={editedCSick?.contactperson}
                  setValue={(value) =>(

                    setEditedCSick((editedCSick)=>({
                      ...editedCSick,
                      contactperson: value
                    }))
                  )}  
                />

                <Picker
                  theme={theme}
                  style={{marginTop:20}}
                  title='Patient Intention'
                  placeholder='Select intent'
                  data={[
                    { value: 'hospitalized', label: 'Hospitalization' },
                    { value: 'generalcheckup', label: 'General Check Up' },
                    { value: 'episodic', label: 'Episodic' },
                  ]}
                  value={editedCSick?.details?.patientintent}
                  setValue={(value) =>(

                    setEditedCSick((editedCSick)=>({
                      ...editedCSick,
                      details: {
                        ...editedCSick.details,
                        patientintent: value
                      }
                    }))
                  )}  
                />

                <Picker
                  theme={theme}
                  style={{marginTop:20}}
                  title='Source'
                  placeholder='Select source'
                  data={[
                    { value: 'caremanager', label: 'Care Manager' },
                    { value: 'hrdept', label: 'HR Dept' },
                    { value: 'managementdept', label: 'Management Dept' },
                    { value: 'insurancedept', label: 'Insurance Dept' },
                  ]}
                  value={editedCSick?.details?.source}
                  setValue={(value) =>(

                    setEditedCSick((editedCSick)=>({
                      ...editedCSick,
                      details: {
                        ...editedCSick.details,
                        source: value
                      }
                    }))
                  )}  
                />

                <Picker
                  theme={theme}
                  style={{marginTop:20}}
                  title='Managed as'
                  placeholder='Select managed'
                  data={[
                    { value: 'converted_into_ip', label: 'Converted into IP' },
                    { value: 'converted_into_op', label: 'Converted into OP' },
                    { value: 'managed_in_op', label: 'Managed in OP' },
                    { value: 'managed_in_ip', label: 'Managed in IP' },
                  ]}
                  value={editedCSick?.details?.managedas}
                  setValue={(value) =>(

                    setEditedCSick((editedCSick)=>({
                      ...editedCSick,
                      details: {
                        ...editedCSick.details,
                        managedas: value
                      }
                    }))
                  )}
                />

                <Picker
                  theme={theme}
                  style={{marginTop:20}}
                  title='Managed as'
                  placeholder='Select managed'
                  data={[
                    { value: 'converted_into_ip', label: 'Converted into IP' },
                    { value: 'converted_into_op', label: 'Converted into OP' },
                    { value: 'managed_in_op', label: 'Managed in OP' },
                    { value: 'managed_in_ip', label: 'Managed in IP' },
                  ]}
                  value={editedCSick?.details?.managedas}
                  setValue={(value) =>(

                    setEditedCSick((editedCSick)=>({
                      ...editedCSick,
                      details: {
                        ...editedCSick.details,
                        managedas: value
                      }
                    }))
                  )}
                />

                {
                  cSick?.diagnosis &&
                  <View>
                    <Text style={[theme.fonts.titleSmall, {color:'#000', marginTop:15}]}>
                      Diagnosis
                    </Text>

                    <View
                      style={[
                        theme.fonts.titleSmall,
                        styles.row,
                        styles.actionBtn,
                        {
                          marginTop:15,
                          flexWrap: 'wrap',
                          alignItems: 'flex-start',
                          columnGap: 20,
                          paddingBottom: 20
                        },
                      ]}
                    >
                      {
                        cSick?.diagnosis?.map((item, i)=>
                          <Text
                            key={i}
                           style={[
                            theme.fonts.bodySmall,
                            {
                              color:'#3f3f3f',
                              marginTop:10
                            },
                            styles.textWrapper
                          ]}>
                            {item}
                          </Text>
                        )
                      }
                    </View>
                  </View>
                }
                

                <Text style={[theme.fonts.titleSmall, {color:'#9d9d9d', marginTop:15}]}>
                  To edit Diagnosis open Chadmin.circle.care
                </Text>

              </ScrollView>

              <View
                style={{
                  ...styles.row,
                  backgroundColor: '#cfeeff',
                  marginTop: 10
                }}
              >
                <TouchableOpacity
                  style={{
                    ...styles.actionBtn,
                    justifyContent:'center',
                    backgroundColor:theme.colors.primary,
                    columnGap: 15,
                  }}
                  onPress={() => saveUpdatedChanges()}
                >
                  <Text style={{...theme.fonts.titleMedium, color: '#fff'}}>Update</Text>
                  <Feather
                    name='upload-cloud'
                    size={20}
                    color={'#fff'}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </Portal>
      </View>
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
                <Text style={{...styles.text, textAlign:'center'}}>
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
  );
};

export default CurrentlySick;