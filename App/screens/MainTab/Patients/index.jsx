/* tslint:disable:no-console */
import React, { useEffect, useState, memo } from 'react';
import { ScrollView, Text, TouchableOpacity, View, FlatList } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import { Tabs } from '@ant-design/react-native';
import {useTheme} from '@react-navigation/native';

import { getService, API_ROUTES, stringInterpolater } from '../../../Server';
import { mySelector, myDispatch, valuesActions,  } from '../../../redux';
import { Loading, SearchBar } from '../../../components'
import { getName } from '../../../utils';
import LinearGradient from 'react-native-linear-gradient';

import Ionicons from 'react-native-vector-icons/Ionicons';
import Fontisto from 'react-native-vector-icons/Fontisto'

import {
  Provider,
  Button,
  List,
  Switch,
  Toast,
  WhiteSpace,
  WingBlank,
} from '@ant-design/react-native'

import styles from '../Styles'
import { pink800 } from 'react-native-paper/lib/typescript/styles/themes/v2/colors';

const Patients = () => {
  const theme = useTheme();
  const dispatch = myDispatch();

  const cmDetails = mySelector(state=>state.Login.value.cmDetails);
  const baseUrl = mySelector(state=>state.Login.value.baseUrl);
  const [loading, setLoading]= useState({
    myPatient:true,
    allPatients:false
  })

  const [myPatients, setMyPatients] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchText, setSearchText] = useState("");


  const [allPatients, setAllPatients] = useState([]);
  const [allPatNotFound, setAllPatNotFound] = useState(false);

  const [tabs] = useState([
    { title: 'My patients' },
    { title: 'All patients' },
  ]);

  const style = {
    alignItems: 'center',
    justifyContent: 'center',
    height: 150,
    backgroundColor: '#fff',
  };

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

  useEffect(()=>{
    getService(baseUrl, stringInterpolater(API_ROUTES.GET_MY_PATIENTS, {email: cmDetails.email}))
    .then((res)=>{
        if(res.status === 1){

          setLoading((pre)=>({
            ...pre,
            myPatient: false
          }))
          setMyPatients(res.data)
          setFiltered(res.data)
        }else{
          
          dispatch(valuesActions.statusNot1(res));
        }
    }).catch((error) => {

        dispatch(valuesActions.error(error));
    })
  },[])

  const getPatients= (value)=>{
    setAllPatNotFound(false);
    setLoading((pre)=>({
      ...pre,
      allPatients: true
    }));

    getService(baseUrl, stringInterpolater(API_ROUTES.GET_PATIENTS, {text: value}))
    .then((res)=>{
        if(res.status === 1){

          setLoading((pre)=>({
            ...pre,
            allPatients: false
          }))
          setAllPatients(res.data)
        }else{

          setLoading((pre)=>({
            ...pre,
            allPatients: false
          }))
          setAllPatNotFound(true);
        }
    }).catch((error) => {

        dispatch(valuesActions.error(error));
    })
  }

  const filter = () => {
		if (searchText !== "") {

			const result = myPatients?.filter(

				(person) =>
					person?.firstname?.toLowerCase()?.includes(searchText?.toLowerCase()) ||
					person?.mobile?.toLowerCase()?.includes(searchText?.toLowerCase())
			);

			setFiltered(result);
		} else {

			setFiltered(myPatients);
		}
	};

  const RenderItem = (item) => {
    const pat = item.item
    return (
      <TouchableOpacity
        key={item.index}
        onPress={()=>handleCopy('kjaskjd','kajdjk')}
      >
        <LinearGradient
          colors={pat.careplan === 'vip' ? ['#e5ac01','#fdf774','#e5ac01'] : ['#739cf4','#b9cbff','#739cf4']}
          style={styles.patientCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}  
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
              >{getName(pat.relationship)}</Text>
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
            <Text style={{...styles.text}}>{pat.pid}</Text>
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

              <TouchableOpacity style={{...styles.minBtn}}>
                <Text style={{...styles.title}}>Call</Text>
                <Fontisto
                  name='phone'
                  size={15}
                  color={theme.colors.primary}
                />
              </TouchableOpacity>

            </View>
          </View>

        </LinearGradient>
      </TouchableOpacity>
    )
  };

  useEffect(()=>{
    filter()
  },[searchText])

  return (
    <Provider>
      <View style={{ flex: 1, backgroundColor:'#fff' }}>
        <Tabs
          tabs={tabs}
          tabBarTextStyle={{color:theme.colors.text, ...styles.title}}
          tabBarUnderlineStyle={{backgroundColor:theme.colors.primary}}
          swipeable={true}
        >
          {/* My Patients */}
          <View style={{flex:1}}>
            <SearchBar
              placeholder='Search...'
              defaultValue=""
              // onSubmit={(value) => console.log('Submit:', value)}
              onChange={(value) => setSearchText(value)}
              // onFocus={() => console.log('Focus')}
              // onBlur={() => console.log('Blur')}
              onCancel={(value) => setSearchText('')}
              showCancelButton={true}
              cancelText="Cancel"
              disabled={false}
            />
            {
              !loading.myPatient ?
              <>
                {
                  filtered?.length > 0 ?
                  <FlatList 
                    data={filtered}
                    renderItem={RenderItem}
                    keyExtractor={item => item.patientid}
                    style={{
                      marginHorizontal:15,
                      paddingVertical:10
                    }}
                    showsVerticalScrollIndicator={false}
                  />
                  :
                  <View 
                    style={{
                      marginHorizontal:15
                    }}
                  >
                    <Text style={styles.title}>
                      No lives found assigned to you
                    </Text>
                  </View>

                }
              </>
              :
              <Loading/>
            }
          </View>

          {/* All Patients */}
          <View style={{flex:1}}>
            <SearchBar
              placeholder='Search...'
              defaultValue=""
              onSubmit={(value) => getPatients(value)}
              // onChange={(value) => setAllSearchText(value)}
              // onFocus={() => console.log('Focus')}
              // onBlur={() => console.log('Blur')}
              onCancel={(value) => setAllPatients([])}
              showCancelButton={true}
              cancelText="Cancel"
              disabled={false}
              ListFooterComponent={()=>
                <View style={{height:80}}/>
              }
            />
            {
              !loading.allPatients ?
              <>
                {
                  allPatients?.length > 0 ?
                  <FlatList 
                    data={allPatients}
                    renderItem={RenderItem}
                    keyExtractor={item => item.patientid}
                    style={{
                      marginHorizontal:15,
                      paddingVertical:10
                    }}
                    ListFooterComponent={()=>
                      <View style={{height:80}}/>
                    }
                    showsVerticalScrollIndicator={false}
                  />
                  :
                  <View
                    style={{
                      marginHorizontal:15
                    }}
                  >
                    <Text style={styles.title}>
                      { allPatNotFound ?
                        `No patients found`
                        :
                        `Search for patient Name or Mobile number`
                      }
                    </Text>
                  </View>

                }
              </>
              :
              <Loading/>
            }
          </View>
        </Tabs>
      </View>
    </Provider>
  );
};

export default Patients;