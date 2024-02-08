/* tslint:disable:no-console */
import React, { useEffect, useState, memo } from 'react';
import { ScrollView, Text, TouchableOpacity, View, TextInput, Linking } from 'react-native';
import {useTheme} from '@react-navigation/native';
import Clipboard from '@react-native-clipboard/clipboard';
import { getService, API_ROUTES, stringInterpolater, putTokenService, patchService, deleteService } from '../../../Server';
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
  Provider,
  Toast
} from '@ant-design/react-native'

const Appointments = () => {
  const theme = useTheme();
  const dispatch = myDispatch();

  const cmDetails = mySelector(state=>state.Login.value.cmDetails);
  const baseUrl = mySelector(state=>state.Login.value.baseUrl);
  const loginData = mySelector(state=>state.Login.value.loginData);

  const [loading, setLoading]= useState({
    myJobs:true,
  });

  const [myJobs, setMyJobs] = useState([]);

  useEffect(()=>{
    if(cmDetails.type === 'admin' || selectedOption?.email) return;

    setLoading((pre)=>({
      ...pre,
      myJobs: true
    }))

    getService(baseUrl, stringInterpolater(API_ROUTES.GET_CM_JOBS, {email: cmDetails.email, date: selectedDate ? dayjs(selectedDate).format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD') }))
    .then((res)=>{
        if(res.status === 1){

          setLoading((pre)=>({
            ...pre,
            myJobs: false
          }))
          setMyJobs(res.data)
        }else{
          
          dispatch(valuesActions.statusNot1('Get CM Jobs List Status != 1'));
        }
    }).catch((error) => {

        dispatch(valuesActions.error({error:`Error in CM Jobs List ${error}`}));
    })
  },[selectedDate])

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

  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleSelect = (option) => {
    setSelectedOption(option);
  };

  useEffect(()=>{
    if(!selectedOption?.email) return;

    setLoading((pre)=>({
      ...pre,
      myJobs: true
    }))

    getService(baseUrl, stringInterpolater(API_ROUTES.GET_CM_JOBS, {email: selectedOption.email, date: selectedDate ? dayjs(selectedDate).format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD')}))
    .then((res)=>{
        if(res.status === 1){

          setLoading((pre)=>({
            ...pre,
            myJobs: false
          }))
          setMyJobs(res.data)
        }else{
          
          dispatch(valuesActions.statusNot1(res));
        }
    }).catch((error) => {

        dispatch(valuesActions.error({error:`Error in Get CM Jobs ${error}`}));
    })
  },[selectedOption, selectedDate])

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

    const stageOptions = [
      { label: "Not Interested", value: "notinterested" },
      { label: "Un Reachable", value: "notreachable" },
      { label: "Resigned", value: "resigned" },
      { label: "Switched Off", value: "switchedoff" },
      { label: "Language issue", value: "languageissue" },
      { label: "No Incoming", value: "noincomingcall" }
    ];

    const [selectedStage, setSelectedStage] = useState({})

    const updateStage = (stage) => {

      if(stage?.length < 3) return;

      const stages = {
        notinterested: "Not Interested",
        notreachable: "Un Reachable",
        resigned: "Resigned",
        switchedoff: "Switched Off",
        languageissue: "Language issue",
        noincomingcall: "No Incoming"
      }

      Object.keys(stages).forEach(item => {

        if(stage.includes(item)){

          setSelectedStage({
            value: item,
            label: stages?.[item]
          })
          
          return;
        }
      })
    }

    useEffect(()=> {
      pat?.stage && updateStage(pat?.stage)
    },[])

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

    const updateStatus = (status)=> {

      patchService(
        baseUrl,
        stringInterpolater(API_ROUTES.PATCH_CM_JOBS,{cmjobid: pat?.cmjobid , status, activityid: pat?.activityid}),
      )
      .then((res)=>{
          if(res.status === 1){
            showToast(`status marked as ${status}`)
            setStatus(status)
          }else{
            
            dispatch(valuesActions.statusNot1('Updating Status != 1'));
          }
      }).catch((error) => {

        dispatch(valuesActions.error({error:`Error in Updating Status ${error}`}));
      })
    }

    function showToast(txt) {
      Toast.info({
        content: txt,
        mask: false,
      })
    }

    const deleteCmJob = ()=> {

      deleteService(
        baseUrl,
        stringInterpolater(API_ROUTES.DELETED_CM_JOB,{cmjobid: pat?.cmjobid}),
      )
      .then((res)=>{
          if(res.status === 1){

            setDeleted(true)
          }else{
            
            dispatch(valuesActions.statusNot1('Delete CmJob Status != 1'));
          }
      }).catch((error) => {

        dispatch(valuesActions.error({error:`Error in Delete CmJob ${error}`}));
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
                          ...styles.title,
                          marginRight:7
                        }}
                      >{getName(pat.careplan)}</Text>
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
                    <MaterialIcons
                      name='delete-outline'
                      size={25}
                      color={'#830000'}
                      onPress={()=>setDeleteInitiated(true)}
                    />
                  </View>
                  
                  <View style={{...styles.row, marginTop:10, columnGap:15}}>
                    <Text style={{...styles.text}}>{pat.brandname}</Text>
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
                      marginTop: 15
                    }}
                  >
                    <Text style={styles.title}>
                      <Text style={[styles.details, {fontSize: 14}]}>Job Type- </Text> {getName(pat.jobtype)}
                    </Text>

                    <Text style={styles.title}>
                      {dayjs(pat.duedate).format('DD MMM YYYY')}
                    </Text>
                  </View>

                  <Text style={[styles.details, {fontSize: 14, marginTop:10}]}>
                    Job Description- {pat.jobtypedescription}
                  </Text>

                  { status ?
                    <Text style={[styles.title, {marginTop: 15}]}>
                      <Text style={[styles.details, {fontSize: 14}]}>Status- </Text> {getName(status)}
                    </Text>
                    : null
                  }

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
                        borderColor: '#ccc',
                        paddingHorizontal:10,
                        paddingVertical:5,
                        backgroundColor: '#fff',
                      }
                    ]}
                    value={remarks}
                    onChangeText={(val) => setRemarks(val)}
                    placeholderTextColor="#848484" 
                    placeholder='Type remarks here'
                    onEndEditing={(e)=>updateRemarksOptions(e.nativeEvent.text, 'remarks')}
                    returnKeyType="done"
                  />

                  <Text style={[theme.fonts.titleSmall, {color:'#000', marginTop:15}]}>
                    Stage
                  </Text>

                  <Dropdown
                    style={{
                      backgroundColor: '#fff',
                      marginTop: 10,
                      paddingVertical: 8
                    }}
                    options={stageOptions}
                    selectedOption={selectedStage}
                    onSelect={(option)=>updateRemarksOptions(option.value, 'stage')}
                    value={'value'}
                    label={'label'}
                    placeholder={'Stage'}
                    title='Stage'
                  />

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
                      onPress={()=>handleCopy('Next Action link', `https://actions.circle.care/?id=${pat?.patientid}`)}
                    >
                      <Feather
                        name='copy'
                        size={15}
                        color={theme.colors.primary}
                      />
                      <Text style={{...theme.fonts.titleSmall, color: '#000'}}> Next Actions</Text>
                    </TouchableOpacity>

                    {
                      pat?.jobtype ?
                      <TouchableOpacity
                        style={{...styles.minBtn}}
                        onPress={()=>handleCopy('Pre Assessment link', `https://chmequestionnaire.s3.ap-south-1.amazonaws.com/index.html?clinicalid=${pat?.patientid}`)}
                      >
                        <Feather
                          name='copy'
                          size={15}
                          color={theme.colors.primary}
                        />
                        <Text style={{...theme.fonts.titleSmall, color: '#000'}}>Pre Assessment</Text>
                      </TouchableOpacity>
                      :null
                    }
                  
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
                      style={{...styles.actionBtn}}
                      onPress={()=>{
                        updateStatus('completed');
                      }}
                    >
                      <Text style={{...theme.fonts.titleSmall, color: '#000'}}>Mark Completed</Text>
                      <Feather
                        name='paperclip'
                        size={15}
                        color={theme.colors.primary}
                      />
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={{...styles.actionBtn}}
                      onPress={()=>{
                        updateStatus('attempted');
                      }}
                    >
                      <Text style={{...theme.fonts.titleSmall, color: '#000'}}>Mark Attempted</Text>
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
                    <View style={styles.row}>
                      <Text style={{
                          ...styles.title,
                          marginRight:7
                        }}
                      >{getName(pat.careplan)}</Text>
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

                  <View style={{...styles.row, marginTop:10, columnGap:15}}>
                    <Text style={{...styles.text}}>{pat.brandname}</Text>
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
                      {dayjs(pat.duedate).format('DD MMM YYYY')}
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
                    <Text style={styles.title}>
                      <Text style={[styles.details, {fontSize: 14, fontWeight:500}]}>Job Type- </Text> {getName(pat.jobtype)}
                    </Text>

                    <View
                      style={{...styles.minBtn, backgroundColor: 'transparent'}}
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
                    Are you sure you want to delete this job!
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
                      deleteCmJob();
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
                  Job Deleted Successfully!
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
            selectedOption={selectedOption}
            onSelect={handleSelect}
            value={'email'}
            label={'email'}
            placeholder={'Select Care Manager'}
          />
          : null
        }

        <Datepicker
          label="Select Date"
          value={selectedDate}
          onChange={setSelectedDate}
          placeholder="Select a date"
          style={{
            marginTop: 15
          }}
        />

        {
          !loading.myJobs ?
          <>
            {
              myJobs?.length > 0 ?
              <>
                {
                  myJobs.map((item, i)=>(
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
                  No Jobs found for the day!, change the date or care Manager if admin
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