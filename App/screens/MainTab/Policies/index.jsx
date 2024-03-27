import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import styles from '../Styles'
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as Animatable from 'react-native-animatable';
import { useNavigation, Link } from '@react-navigation/native';
import { loginActions, valuesActions, myDispatch, mySelector } from '../../../redux';
import assets from '../../../assets';
import { getService, API_ROUTES, stringInterpolater, getTokenService } from '../../../server';
import { ProgressChart } from "react-native-chart-kit";
import jwtDecode from 'jwt-decode';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Dropdown from '../../../components/Dropdown';

const Policies = ({ route }) => {
  const theme = useTheme();
  const navigation = useNavigation();
  const dispatch = myDispatch();
  const corporatedetails = mySelector(state => state.Login.value.corporateDetails);
  const baseUrl = mySelector(state => state.Login.value.baseUrl);
  const corporateid = mySelector(state => state.Login.value.loginData.corporateid);
  const [loading, setLoading] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState([{ label: '', value: '' }]);
  const [policyDetails, setPolicyDetails] = useState({});
  const [counts, setCounts] = useState({});

  useEffect(() => {
    setLoading(true);
    if (Object.keys(corporatedetails)?.length > 0) {
      let gmcPolicies = corporatedetails?.policytype?.filter(policy => policy?.startsWith('GMC'));
      setSelectedPolicy(modifyPolicyNames(corporatedetails?.policytype?.filter(policy => policy?.startsWith('GMC'))));
      if (gmcPolicies) {
        getService(baseUrl, stringInterpolater(API_ROUTES.GET_ALL_PATIENTS_BY_INSURANCE, { cpolid: gmcPolicies[0] }))
          .then((res) => {
            if (res.status === 1) {
              setPolicyDetails(res.data);
              handleEmployeesCount(res.data?.patients)
            } else {
              dispatch(valuesActions.statusNot1(res?.msg));
            }
            setLoading(false);
          }).catch((error) => {
            setLoading(false);
            dispatch(valuesActions.error({ error: `Error in Get NWL Details ${error}` }));
          })
      }
    }
  }, [])

  const handlePolicySelect = (value) => {
    setLoading(true);
    setSelectedPolicy(value);
    getService(baseUrl, stringInterpolater(API_ROUTES.GET_ALL_PATIENTS_BY_INSURANCE, { cpolid: value[0].value }))
      .then((res) => {
        if (res.status === 1) {
          setPolicyDetails(res.data)
        } else {
          dispatch(valuesActions.statusNot1(res?.msg));
        }
        setLoading(false);
      }).catch((error) => {
        setLoading(false);
        dispatch(valuesActions.error({ error: `Error in Get NWL Details ${error}` }));
      })
  }

  function modifyPolicyNames(policies) {
    const policyCounts = {};
    const modifiedPolicies = [];

    policies.forEach(policy => {
      const prefix = policy.match(/[A-Za-z]+/)[0]; // Extract alphabetic characters from the beginning
      if (!policyCounts[prefix]) {
        policyCounts[prefix] = 1;
        modifiedPolicies.push({ label: prefix, value: policy });
      } else {
        const count = policyCounts[prefix]++;
        modifiedPolicies.push({ label: `${prefix}(${count})`, value: policy });
      }
    });
    return modifiedPolicies;
  }

  const handleEmployeesCount = async (list) => {
    let emp = 0, spouse = 0, parent = 0, child = 0, tot = 0;
    await list?.forEach((item) => {
      if ((item.relationship)?.toLowerCase() === 'self') {
        emp += 1;
      } else if ((item.relationship)?.toLowerCase() === 'spouse' || (item.relationship)?.toLowerCase() === 'wife' || (item.relationship)?.toLowerCase() === 'husband') {
        spouse += 1;
      } else if ((item.relationship)?.toLowerCase() === 'parent' || (item.relationship)?.toLowerCase() === 'parents' || (item.relationship)?.toLowerCase() === 'father' || (item.relationship)?.toLowerCase() === 'mother') {
        parent += 1;
      } else if ((item.relationship)?.toLowerCase() === 'child' || (item.relationship)?.toLowerCase() === 'son' || (item.relationship)?.toLowerCase() === 'daughter') {
        child += 1;
      }
      tot += 1
    })
    setCounts({ emp, spouse, parent, child, tot });
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons
          name="menu"
          size={27}
          color={theme.colors.data}
          onPress={() => navigation.openDrawer()}
        />
        <Text
          style={{
            color: theme.colors.data,
            ...theme.fonts.titleMedium,
            paddingLeft: 15,
            fontFamily: 'Nunito Bold'
          }}
        >Policies</Text>
        <Ionicons
          style={{
            textAlign: 'right',
            flex: 1,
          }}
          name="notifications"
          size={25}
          color={theme.colors.data}
        // onPress={() => navigation.openDrawer()}
        />
      </View>
      <View style={{ padding: 10, paddingBottom: 0, backgroundColor: 'white', zIndex: 100 }}>
        <Dropdown options={modifyPolicyNames(corporatedetails?.policytype)} onSelect={handlePolicySelect} selectedOption={selectedPolicy} title={'Policies List'} />
      </View>
      <ScrollView style={{ margin: 10, marginTop: 0 }}>
        {loading ?
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 300 }}>
            <Text style={{ color: theme.colors.data }}>Please wait...</Text>
            <ActivityIndicator size="large" />
          </View> :
          <View >{
            Object.keys(policyDetails).length > 0 &&
            <View style={{ marginTop: 60 }}>
              <View style={{ width: '100%', borderRadius: 5, borderColor: theme.colors.border, borderWidth: 1 }}>
                <View style={{ display: 'flex', flexDirection: 'row', flex: 1, justifyContent: 'space-between', padding: 15, borderBottomColor: theme.colors.border, borderBottomWidth: 1 }}>
                  <Text style={{ color: theme.colors.alpha, fontFamily: 'Nunito Bold', fontSize: 18 }}>Active Lives</Text>
                  <TouchableOpacity onPress={() => navigation.navigate('Lives', { policytype: 'GMC' })}>
                    <Icon
                      name="chevron-right"
                      color={theme.colors.data}
                      size={24}
                    />
                  </TouchableOpacity>
                </View>
                <View style={{ padding: 10, display: 'flex', flex: 1, gap: 10, flexDirection: 'row' }}>
                  <View style={{ flex: 1, justifyContent: 'center', display: 'flex', alignItems: 'center' }}>
                    <LinearGradient
                      colors={
                        ['#1d4ed8', '#1d4ed8']
                      }
                      style={{
                        height: 70,
                        width: 70,
                        borderRadius: 50,
                        alignItems: 'center',
                        display: 'flex',
                        justifyContent: 'center'
                      }}
                      start={{ x: 0, y: 0 }}
                    >
                      <MaterialIcons name="family-restroom" color='white' size={36} />
                    </LinearGradient>
                    <View style={{ display: 'flex', alignItems: 'center', marginTop: 10, flex: 1, borderRadius: 5, borderWidth: 1, borderColor: theme.colors.border, padding: 8, width: 170 }}>
                      <Text style={{ color: theme.colors.subtitle, fontFamily: 'Nunito Medium' }}>Total Employee</Text>
                      <Text style={{ color: theme.colors.data, fontFamily: 'Nunito Bold', fontSize: 18 }}>{counts?.emp}</Text>
                    </View>
                    <View style={{ display: 'flex', alignItems: 'center', marginTop: 10, flex: 1, borderRadius: 5, borderWidth: 1, borderColor: theme.colors.border, padding: 8, width: 170 }}>
                      <Text style={{ color: theme.colors.subtitle, fontFamily: 'Nunito Medium' }}>Total Children</Text>
                      <Text style={{ color: theme.colors.data, fontFamily: 'Nunito Bold', fontSize: 18 }}>{counts?.child}</Text>
                    </View>
                  </View>
                  <View style={{ flex: 1, justifyContent: 'space-around', display: 'flex' }}>
                    <View style={{ height: 70, display: 'flex', alignItems: 'center', display: 'flex', justifyContent: 'center' }}>
                      <Text style={{ color: theme.colors.subtitle, fontFamily: 'Nunito Medium' }}>Total Lives</Text>
                      <Text style={{ color: theme.colors.data, fontFamily: 'Nunito Bold', fontSize: 18 }}>{counts?.tot}</Text>
                    </View>
                    <View style={{ display: 'flex', alignItems: 'center', marginTop: 10, flex: 1, borderRadius: 5, borderWidth: 1, borderColor: theme.colors.border, padding: 8, width: 170 }}>
                      <Text style={{ color: theme.colors.subtitle, fontFamily: 'Nunito Medium' }}>Total Spouse</Text>
                      <Text style={{ color: theme.colors.data, fontFamily: 'Nunito Bold', fontSize: 18 }}>{counts?.spouse}</Text>
                    </View>
                    <View style={{ display: 'flex', alignItems: 'center', marginTop: 10, flex: 1, borderRadius: 5, borderWidth: 1, borderColor: theme.colors.border, padding: 8, width: 170 }}>
                      <Text style={{ color: theme.colors.subtitle, fontFamily: 'Nunito Medium' }}>Total Parent</Text>
                      <Text style={{ color: theme.colors.data, fontFamily: 'Nunito Bold', fontSize: 18 }}>{counts?.parent}</Text>
                    </View>
                  </View>
                </View>
              </View>
              <View style={{ width: '100%', borderRadius: 5, borderColor: theme.colors.border, borderWidth: 1, marginTop: 15 }}>
                <View style={{ display: 'flex', flexDirection: 'row', flex: 1, justifyContent: 'space-between', padding: 15, borderBottomColor: theme.colors.border, borderBottomWidth: 1, alignItems: 'center' }}>
                  <View style={{ display: 'flex', flexDirection: 'row', gap: 10, alignItems: 'center' }}>
                    <LinearGradient
                      colors={
                        ['#1d4ed8', '#1d4ed8']
                      }
                      style={{
                        height: 50,
                        width: 50,
                        borderRadius: 50,
                        alignItems: 'center',
                        display: 'flex',
                        justifyContent: 'center'
                      }}
                      start={{ x: 0, y: 0 }}
                    >
                      <MaterialIcons name="shield" color='white' size={28} />
                    </LinearGradient>
                    <View>
                      <Text style={{ color: theme.colors.subtitle, fontFamily: 'Nunito Medium', fontSize: 14 }}>Structure & Details</Text>
                      <Text style={{ color: theme.colors.alpha, fontFamily: 'Nunito Bold', fontSize: 18 }}>Policy Summary</Text>
                    </View>
                  </View>
                  <TouchableOpacity style={{ borderColor: '#4576DC', borderWidth: 1, width: 100, borderRadius: 5, height: 35, alignItems: 'center', display: 'flex', justifyContent: 'center' }}>
                    <Text style={{ textAlign: 'center', fontSize: 14, fontFamily: 'Nunito Bold', color: theme.colors.alpha }}>View Copy</Text>
                  </TouchableOpacity>
                </View>
                <View style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
                  <View style={{ borderRightWidth: 1, borderRightColor: theme.colors.border, padding: 4, flex: 1 }}>
                    <View style={{ padding: 10 }}>
                      <Text style={{ color: theme.colors.data, fontSize: 14, fontFamily: 'Nunito Bold' }}>ICICI Lombard General Insurance</Text>
                      <Text style={{ color: theme.colors.subtitle, fontSize: 14, fontFamily: 'Nunito Medium' }}>Insurer</Text>
                    </View>
                    <View style={{ padding: 10 }}>
                      <Text style={{ color: theme.colors.data, fontSize: 14, fontFamily: 'Nunito Bold' }}>Medi Assist TPA India Pvt. Ltd.</Text>
                      <Text style={{ color: theme.colors.subtitle, fontSize: 14, fontFamily: 'Nunito Medium' }}>TPA</Text>
                    </View>
                    <View style={{ padding: 10 }}>
                      <Text style={{ color: theme.colors.data, fontSize: 14, fontFamily: 'Nunito Bold' }}>PA123234567</Text>
                      <Text style={{ color: theme.colors.subtitle, fontSize: 14, fontFamily: 'Nunito Medium' }}>Policy Number</Text>
                    </View>
                    <View style={{ padding: 10 }}>
                      <Text style={{ color: theme.colors.data, fontSize: 14, fontFamily: 'Nunito Bold' }}>₹5 Lakhs, ₹3 Lakhs</Text>
                      <Text style={{ color: theme.colors.subtitle, fontSize: 14, fontFamily: 'Nunito Medium' }}>Sum Insured</Text>
                    </View>
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={{ padding: 10 }}>
                      <Text style={{ color: theme.colors.data, fontSize: 14, fontFamily: 'Nunito Bold' }}>22/06/2023 to 22/06/2024</Text>
                      <Text style={{ color: theme.colors.subtitle, fontSize: 14, fontFamily: 'Nunito Medium' }}>Policy Time Period</Text>
                    </View>
                    <View style={{ padding: 10 }}>
                      <Text style={{ color: theme.colors.data, fontSize: 14, fontFamily: 'Nunito Bold' }}>₹8 Lakhs</Text>
                      <Text style={{ color: theme.colors.subtitle, fontSize: 14, fontFamily: 'Nunito Medium' }}>Total Premium Paid</Text>
                    </View>
                    <View style={{ padding: 10 }}>
                      <Text style={{ color: theme.colors.data, fontSize: 14, fontFamily: 'Nunito Bold' }}>₹6 Lakhs</Text>
                      <Text style={{ color: theme.colors.subtitle, fontSize: 14, fontFamily: 'Nunito Medium' }}>Inception Premium</Text>
                    </View>
                    <View style={{ padding: 10 }}>
                      <Text style={{ color: theme.colors.data, fontSize: 14, fontFamily: 'Nunito Bold' }}>Employee, Spouse & Children</Text>
                      <Text style={{ color: theme.colors.subtitle, fontSize: 14, fontFamily: 'Nunito Medium' }}>Family Definition</Text>
                    </View>
                  </View>
                </View>
              </View>
              <View style={{ width: '100%', borderRadius: 5, borderColor: theme.colors.border, borderWidth: 1, marginTop: 15 }}>
                <View style={{ display: 'flex', flexDirection: 'row', flex: 1, justifyContent: 'space-between', padding: 15, borderBottomColor: theme.colors.border, borderBottomWidth: 1, alignItems: 'center' }}>
                  <View style={{ display: 'flex', flexDirection: 'row', gap: 10, alignItems: 'center' }}>
                    <LinearGradient
                      colors={
                        ['#1d4ed8', '#1d4ed8']
                      }
                      style={{
                        height: 50,
                        width: 50,
                        borderRadius: 50,
                        alignItems: 'center',
                        display: 'flex',
                        justifyContent: 'center'
                      }}
                      start={{ x: 0, y: 0 }}
                    >
                      <MaterialIcons name="family-restroom" color='white' size={28} />
                    </LinearGradient>
                    <View>
                      <Text style={{ color: theme.colors.subtitle, fontFamily: 'Nunito Medium', fontSize: 14 }}>Balances & Lives</Text>
                      <Text style={{ color: theme.colors.alpha, fontFamily: 'Nunito Bold', fontSize: 18 }}>Current Status</Text>
                    </View>
                  </View>
                  <TouchableOpacity style={{ borderColor: '#4576DC', borderWidth: 1, width: 100, borderRadius: 5, height: 35, alignItems: 'center', display: 'flex', justifyContent: 'center' }}>
                    <Text style={{ textAlign: 'center', fontSize: 14, fontFamily: 'Nunito Bold', color: theme.colors.alpha }}>CD Balance</Text>
                  </TouchableOpacity>
                </View>
                <View style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
                  <View style={{ borderRightWidth: 1, borderRightColor: theme.colors.border, padding: 4, flex: 1 }}>
                    <View style={{ padding: 10 }}>
                      <Text style={{ color: theme.colors.subtitle, fontSize: 14, fontFamily: 'Nunito Medium' }}>Available CD Balance</Text>
                      <Text style={{ color: theme.colors.data, fontSize: 14, fontFamily: 'Nunito Bold' }}>₹35,000</Text>
                    </View>
                    <View style={{ padding: 10 }}>
                      <Text style={{ color: theme.colors.subtitle, fontSize: 14, fontFamily: 'Nunito Medium' }}>From Insurer, as on </Text>
                      <Text style={{ color: theme.colors.data, fontSize: 14, fontFamily: 'Nunito Bold' }}>31 Aug 2023</Text>
                    </View>
                    <View style={{ padding: 10 }}>
                      <Text style={{ color: theme.colors.subtitle, fontSize: 14, fontFamily: 'Nunito Medium' }}>Required CD Balance</Text>
                      <Text style={{ color: theme.colors.data, fontSize: 14, fontFamily: 'Nunito Bold' }}>₹21,000 as on Today</Text>
                    </View>
                    <View style={{ padding: 10 }}>
                      <Text style={{ color: theme.colors.data, fontSize: 14, fontFamily: 'Nunito Bold' }}>TPA Cards Generated - 345/430</Text>
                    </View>
                    <View style={{ padding: 10 }}>
                      <Text style={{ color: theme.colors.data, fontSize: 14, fontFamily: 'Nunito Bold' }}>85 Lives added since last endorsement</Text>
                    </View>
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={{ padding: 10 }}>
                      <Text style={{ color: theme.colors.subtitle, fontSize: 14, fontFamily: 'Nunito Medium' }}>Last Endorsement sent</Text>
                      <Text style={{ color: theme.colors.data, fontSize: 14, fontFamily: 'Nunito Bold' }}>23 October 2023</Text>
                    </View>
                    <View style={{ padding: 10 }}>
                      <Text style={{ color: theme.colors.subtitle, fontSize: 14, fontFamily: 'Nunito Medium' }}>Last Endorsement received </Text>
                      <Text style={{ color: theme.colors.data, fontSize: 14, fontFamily: 'Nunito Bold' }}>23 October 2023</Text>
                    </View>
                    <View style={{ padding: 10 }}>
                      <Text style={{ color: theme.colors.subtitle, fontSize: 14, fontFamily: 'Nunito Medium' }}>Next endorsement on</Text>
                      <Text style={{ color: theme.colors.data, fontSize: 14, fontFamily: 'Nunito Bold' }}>05 November 2023</Text>
                    </View>
                    <View style={{ padding: 10 }}>
                      <Text style={{ color: theme.colors.subtitle, fontSize: 14, fontFamily: 'Nunito Medium' }}>Average premium per life</Text>
                      <Text style={{ color: theme.colors.data, fontSize: 14, fontFamily: 'Nunito Bold' }}>₹2,000</Text>
                    </View>
                    {/*<View style={{ padding: 10, alignItems: 'center' }}>
                        <TouchableOpacity style={{ borderColor: '#4576DC', borderWidth: 1, width: 150, borderRadius: 5, height: 35, alignItems: 'center', display: 'flex', justifyContent: 'center' }}>
                          <Text style={{ textAlign: 'center', fontSize: 14, fontFamily: 'Nunito Bold', color: theme.colors.alpha }}>Month wise status</Text>
                        </TouchableOpacity>
                    </View>*/}
                  </View>
                </View>
              </View>
              <View style={{ width: '100%', borderRadius: 5, borderColor: theme.colors.border, borderWidth: 1, marginTop: 15 }}>
                <View style={{ display: 'flex', flexDirection: 'row', flex: 1, justifyContent: 'space-between', padding: 15, borderBottomColor: theme.colors.border, borderBottomWidth: 1, alignItems: 'center' }}>
                  <View style={{ display: 'flex', flexDirection: 'row', gap: 10, alignItems: 'center' }}>
                    <View>
                      <Text style={{ color: theme.colors.alpha, fontFamily: 'Nunito Bold', fontSize: 18 }}>Addendums</Text>
                    </View>
                  </View>
                  <TouchableOpacity style={{ borderColor: '#4576DC', borderWidth: 1, width: 150, borderRadius: 5, height: 35, alignItems: 'center', display: 'flex', justifyContent: 'center' }}>
                    <Text style={{ textAlign: 'center', fontSize: 14, fontFamily: 'Nunito Bold', color: theme.colors.alpha }}>View Detail</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          }</View>
        }

      </ScrollView>
    </View>
  )
}

export default Policies;