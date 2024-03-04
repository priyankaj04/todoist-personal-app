import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  Platform,
  StatusBar,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { vh, vw } from 'react-native-css-vh-vw';
import Clipboard from '@react-native-clipboard/clipboard';
import styles from './Styles';

import Swiper from 'react-native-swiper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import Fontisto from 'react-native-vector-icons/Fontisto';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import dayjs from 'dayjs';
import * as Animatable from 'react-native-animatable';

import { loginActions, valuesActions, myDispatch, mySelector } from '../../../redux';
import { getService, getTokenService, API_ROUTES, stringInterpolater } from '../../../server';
import { getName } from '../../../utils';
import Assets from '../../../assets';
import { TitleText, Loading } from '../../../components'

import {
  Provider,
  Toast,
} from '@ant-design/react-native';

const PatientDetails = ({ }) => {

  const navigation = useNavigation();
  const theme = useTheme();
  const route = useRoute();
  const { patient } = route.params;

  const [patientDetails, setPatientDetails] = useState({});
  const [corporate, setCorporate] = useState([]);
  const [pat, setPat] = useState({});
  const [loading, setLoading] = useState({
    patientDetails: true,
  });

  const dispatch = myDispatch();
  const cmDetails = mySelector(state => state.Login.value.corporateDetails);
  const baseUrl = mySelector(state => state.Login.value.baseUrl);
  const loginData = mySelector(state => state.Login.value.loginData);

  const DisplayArray = [
    {
      title: 'PID',
      key: 'pid',
    },
    {
      title: 'Date of birth',
      key: 'dob',
      format: 'date',
    },
    {
      title: 'Gender',
      key: 'gender',
    },
    {
      title: 'Do not Disturb',
      key: 'dnddate',
      format: 'date',
    },
    {
      title: 'Related to',
      key: 'relatedtoname',
      line: 1,
    },
    {
      title: 'Related to no',
      key: 'relatedto',
    },
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
      title: 'Address',
      key: 'address',
      line: 1,
    },
    {
      title: 'Locality',
      key: 'locality',
    },
    {
      title: 'City',
      key: 'city',
    },
    {
      title: 'State',
      key: 'state',
    },
    {
      title: 'Pin Code',
      key: 'pincode',
    },
    {
      title: 'Email',
      key: 'email',
      line: 1,
    },
    {
      title: 'Mobile',
      key: 'mobile',
    },
    {
      title: 'Corporate Name',
      key: 'corporatename',
      line: 1,
    },
    {
      title: 'Corporate id',
      key: 'corporateid',
    },
    {
      title: 'Employee id',
      key: 'employeeid',
    },
    {
      title: 'Corporate email',
      key: 'corporateemailid',
      line: 1,
    },
  ]

  useEffect(() => {

    getService(baseUrl, stringInterpolater(API_ROUTES.PATIENT_DETAILS, { patientid: patient.item.patientid }))
      .then((res) => {
        if (res.status == 1) {

          setPatientDetails(res.data);
          setPat(res.data.patientdetails);
          setLoading((pre) => ({
            ...pre,
            patientDetails: false
          }))

        } else {

          dispatch(valuesActions.statusNot1('Get Patient Details Status != 1'));
        }
      }).catch((error) => {

        dispatch(valuesActions.error({ error: `Error in get Patient Details ${error}` }));
      })

    getTokenService(baseUrl, stringInterpolater(API_ROUTES.GET_ALL_CORPORATES), loginData.token)
      .then((res) => {
        if (res.status == 1) {

          setCorporate(res.data)
        } else {

          dispatch(valuesActions.statusNot1('Get all corporate Status != 1'));
        }
      }).catch((error) => {

        dispatch(valuesActions.error({ error: `Error in all corporate ${error}` }));
      })

  }, [])

  const handleCopy = async (title, text) => {
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
        style={[styles.accordionItem, { flex: 1, marginHorizontal: 10 }]}
        animation="fadeIn"
        duration={300}
      >
        <TouchableOpacity onPress={navigation.goBack}>
          <View style={styles.header}>
            <Text style={{ ...styles.title, fontSize: 16 }}>Patient Details</Text>
            <Feather name="chevron-up" color={'#000'} size={18} />
          </View>
        </TouchableOpacity>

        <Animatable.View animation="slideInUp" duration={700} style={{ flex: 1 }}>
          <View style={{ flex: 1 }}>
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
                      columnGap: 20,
                      marginTop: 15
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
                            ? { uri: pat.profilepic }
                            : Assets.getProfileIcon(pat.gender, pat.age)
                        }
                        style={{ ...styles.profilePic }}
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
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                      columnGap: 12,
                      marginTop: 10
                    }}
                  >
                    {DisplayArray.map((item, i) => {

                      let title = item.title
                      let text = pat?.[item.key]

                      if (item?.format === 'date') {
                        text = pat?.[item.key] ? dayjs(pat?.[item.key]).format('DD MMM YYYY') : ''
                      }

                      if (item.key === 'corporatename') {

                        text = corporate.find((item) => item.corporateid == pat?.['corporateid'])?.brandname;
                      }

                      return (
                        <TouchableOpacity
                          key={i}
                          onLongPress={() => handleCopy(title, text)}
                        >
                          <TitleText
                            title={title}
                            text={text}
                            theme={theme}
                            style={{
                              marginTop: 15,
                              width: !item?.line ? vw(50) - (Platform.OS === 'ios' ? 30 : 29) : vw(100) - 46
                            }}
                            line={item.line}
                          />
                        </TouchableOpacity>
                      )
                    })}
                  </View>


                  <View style={{ height: 30 }} />
                </ScrollView>
                :
                <Loading theme={theme} />
            }
          </View>
        </Animatable.View>
      </Animatable.View>


    </Provider>
  );
};

export default PatientDetails;
