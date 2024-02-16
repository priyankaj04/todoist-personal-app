import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Platform,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {vh, vw} from 'react-native-css-vh-vw';
import Clipboard from '@react-native-clipboard/clipboard';
import styles from './Styles';

import Swiper from 'react-native-swiper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import Fontisto from 'react-native-vector-icons/Fontisto';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import dayjs from 'dayjs';
import * as Animatable from 'react-native-animatable';

import {loginActions, valuesActions, myDispatch, mySelector} from '../../../redux';
import { getService, getTokenService, API_ROUTES, stringInterpolater } from '../../../Server';
import {getName, getActivity} from '../../../utils';
import Assets from '../../../assets';
import {TitleText, Loading} from '../../../components'

import {
  Provider,
  Toast,
} from '@ant-design/react-native';

const PatientDetails = ({}) => {

  const navigation = useNavigation();
  const theme = useTheme();
  const route = useRoute();
  const {patient} = route.params;
  
  const [patientDetails, setPatientDetails] = useState({});
  const [corporate, setCorporate] = useState([]);
  const [pat, setPat] = useState({});
  const [loading, setLoading]= useState({
    patientDetails: true,
  });

  const dispatch = myDispatch();
  const baseUrl = mySelector(state=>state.Login.value.baseUrl);
  const loginData = mySelector(state=>state.Login.value.loginData);

  const DisplayArray = [
    {
      title: 'Care Plan',
      key: 'careplan',
    },
    {
      title: 'Care Coordinator',
      key: 'ccownername',
      line: 1,
    },
    {
      title: 'Corporate Name',
      key: 'corporatename',
      line: 1,
    },
  ]

  useEffect(()=>{

    getService(baseUrl, stringInterpolater( API_ROUTES.PATIENT_DETAILS, { patientid: patient.item.patientid }))
    .then((res)=>{
      if(res.status == 1){

        setPatientDetails(res.data);
        setPat(res.data.patientdetails);
        setLoading((pre)=>({
          ...pre,
          patientDetails: false
        }))

      }else{
          
        dispatch(valuesActions.statusNot1('Get Patient Details Status != 1'));
      }
    }).catch((error) => {

        dispatch(valuesActions.error({error:`Error in get Patient Details ${error}`}));
    })

    getTokenService(baseUrl, stringInterpolater( API_ROUTES.GET_ALL_CORPORATES), loginData.token)
    .then((res)=>{
      if(res.status == 1){
        
        setCorporate(res.data)
      }else{

        dispatch(valuesActions.statusNot1('Get all corporate Status != 1'));
      }
    }).catch((error) => {

        dispatch(valuesActions.error({error:`Error in all corporate ${error}`}));
    })

  },[])

  const handleCopy = async (title,text) => {
    try {
      await Clipboard.setString(text);
      showToastNoMask(`${title} Copied to clipboard`);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
    }
  };

  function showToastNoMask(txt) {
    Toast.info({
      content: txt,
      mask: false,
    })
  }

  return (
    <Provider>
      <Animatable.View
        style={[styles.accordionItem, {flex: 1, marginHorizontal:10}]}
        animation="fadeIn"
        duration={300}
      >
        <TouchableOpacity onPress={navigation.goBack}>
          <View style={styles.header}>
            <Text style={{...styles.title, fontSize: 16 }}>Care Plan</Text>
            <Feather name="chevron-up" color={'#000'} size={18} />
          </View>
        </TouchableOpacity>

        <Animatable.View 
          animation="slideInUp"
          duration={700}
          style={{
            flex:1,
          }}
        >
          <View style={{ flex:1 }}>
            {
              !loading.patientDetails ?
              <ScrollView
                style={{ ...styles.scrollContainer }}
                showsVerticalScrollIndicator={false}
              >

                <View 
                  style={{
                    ...styles.row,
                    justifyContent: 'center',
                    columnGap:20,
                    marginTop:15
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


                <View
                  style={{
                    flexDirection:'row',
                    flexWrap:'wrap',
                    columnGap:12,
                    marginTop:10
                  }}
                >
                  {DisplayArray.map((item, i)=>{

                    let title = item.title
                    let text = pat?.[item.key]

                    if(item?.format === 'date'){
                      text = pat?.[item.key] ? dayjs(pat?.[item.key]).format('DD MMM YYYY') : ''
                    }

                    if(item.key === 'corporatename'){

                      text =  corporate.find((item) => item.corporateid == pat?.['corporateid'])?.brandname;
                    }

                    return(
                      <TouchableOpacity
                        key={i}
                        onLongPress={()=>handleCopy(title, text)}
                      >
                        <TitleText
                          title={title}
                          text={text}
                          theme={theme}
                          style={{ 
                            marginTop:15,
                            width: !item?.line ? vw(50)-(Platform.OS === 'ios' ? 30:29) : vw(100)-46
                          }}
                          line={item.line}
                        />
                      </TouchableOpacity>
                    )
                  })}
                </View>

                <Text
                  style={{
                    color:'#1a3ca1',
                    fontWeight: '500',
                    marginTop: 20,
                    fontSize: 15
                  }}
                >
                  Care Plan
                </Text>
                <View
                  style={{
                    borderRadius:8,
                    borderWidth: 1,
                    borderColor: '#9a9a9a',
                    marginTop: 7,
                  }}
                >
                  <View 
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      borderColor: '#9a9a9a',
                      borderBottomWidth: 1,
                      padding: 10,
                    }}
                  >
                    <View
                      style={{
                        flex:1,
                        borderRightWidth: 1,
                        borderColor: '#9a9a9a',
                      }}
                    >
                      <Text
                        style={{
                          color:'#000',
                          fontWeight: '500'
                        }}
                      >
                        Consultation Name
                      </Text>
                    </View>
                    <View
                      style={{
                        paddingHorizontal: 10,
                        borderRightWidth: 1,
                        borderColor: '#9a9a9a',
                      }}
                    >
                      <Text
                        style={{
                          color:'#000',
                          fontWeight: '500'
                        }}
                      >
                        Enabled
                      </Text>
                    </View>
                    <View
                      style={{
                        paddingHorizontal: 10,
                      }}
                    >
                      <Text
                        style={{
                          color:'#000',
                          fontWeight: '500'
                        }}
                      >
                        Payment
                      </Text>
                    </View>
                  </View>

                  {
                    pat.cmdetails?.cm.length > 0 && 
                    pat.cmdetails?.cm.map((item, i)=>{
                      return(
                        <View 
                          key={i}
                          style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            borderColor: '#9a9a9a',
                            borderBottomWidth: pat.cmdetails?.cm.length-1 === i ? 0 :1,
                          }}
                        >
                          <View
                            style={{
                              flex:1,
                              padding: 10,
                              borderRightWidth: 1,
                              borderColor: '#9a9a9a',
                            }}
                          >
                            <Text
                              style={{color:'#000'}}
                            >
                              {getActivity(item.activity)}
                            </Text>
                          </View>
                          <View
                            style={{
                              padding: 10,
                              borderRightWidth: 1,
                              borderColor: '#9a9a9a',
                            }}
                          >
                            <Text
                              style={{color:'#000'}}
                            >
                              {
                                item.enable ?
                                <Feather name="check" color={'#1a3ca1'} size={18} />
                                :
                                <Feather name="x" color={'#821212'} size={18} />
                              }
                            </Text>
                          </View>
                          <View
                            style={{
                              padding: 10,
                            }}
                          >
                            <Text
                              style={{color:'#000'}}
                            >
                              {
                                item.payment ?
                                <Feather name="check" color={'#1a3ca1'} size={18} />
                                :
                                <Feather name="x" color={'#821212'} size={18} />
                              }
                            </Text>
                          </View>
                        </View>
                      )
                    })
                  }
                </View>


                <View style={{height:30}}/>
              </ScrollView>
              :
              <Loading theme={theme}/>
            }
          </View>
        </Animatable.View>
      </Animatable.View>

      
    </Provider>
  );
};

export default PatientDetails;
