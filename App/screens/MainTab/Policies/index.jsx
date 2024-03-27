import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Linking
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
            console.log("res.data", Object.keys(res?.data))
            if (res.status === 1) {
              setPolicyDetails({ ...res?.data });
            } else {
              dispatch(valuesActions.statusNot1(res?.msg));
            }
            setLoading(false);
          }).catch((error) => {
            setLoading(false);
            dispatch(valuesActions.error({ error: `Error in GET ALL PATIENTS BY INSURANCE ${error}` }));
          })
      }
    }
  }, [])

  useEffect(() => {
    console.log("endorsementdata", policyDetails.addendums)
  }, [policyDetails])

  const handlePolicySelect = (value) => {
    setLoading(true);
    setSelectedPolicy(value);
    getService(baseUrl, stringInterpolater(API_ROUTES.GET_ALL_PATIENTS_BY_INSURANCE, { cpolid: value[0].value }))
      .then((res) => {
        if (res.status === 1) {
          setPolicyDetails({ ...res?.data });
        } else {
          dispatch(valuesActions.statusNot1(res?.msg));
        }
        setLoading(false);
      }).catch((error) => {
        setLoading(false);
        dispatch(valuesActions.error({ error: `Error in GET ALL PATIENTS BY INSURANCE ${error}` }));
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
            policyDetails && Object.keys(policyDetails).length > 0 ?
              <View style={{ marginTop: 60 }}>
                <View style={{ width: '100%', borderRadius: 5, borderColor: theme.colors.border, borderWidth: 1 }}>
                  <TouchableOpacity onPress={() => navigation.navigate('Lives', { policytype: 'GMC' })} style={{ display: 'flex', flexDirection: 'row', flex: 1, justifyContent: 'space-between', padding: 15, borderBottomColor: theme.colors.border, borderBottomWidth: 1 }}>
                    <Text style={{ color: theme.colors.alpha, fontFamily: 'Nunito Bold', fontSize: 18 }}>Active Lives</Text>
                    <View>
                      <Icon
                        name="chevron-right"
                        color={theme.colors.data}
                        size={24}
                      />
                    </View>
                  </TouchableOpacity>
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
                        <Text style={{ color: theme.colors.data, fontFamily: 'Nunito Bold', fontSize: 18 }}>{policyDetails?.totalemployees?.count}</Text>
                      </View>
                      <View style={{ display: 'flex', alignItems: 'center', marginTop: 10, flex: 1, borderRadius: 5, borderWidth: 1, borderColor: theme.colors.border, padding: 8, width: 170 }}>
                        <Text style={{ color: theme.colors.subtitle, fontFamily: 'Nunito Medium' }}>Total Children</Text>
                        <Text style={{ color: theme.colors.data, fontFamily: 'Nunito Bold', fontSize: 18 }}>{policyDetails.totalChildren?.count}</Text>
                      </View>
                    </View>
                    <View style={{ flex: 1, justifyContent: 'space-around', display: 'flex' }}>
                      <View style={{ height: 70, display: 'flex', alignItems: 'center', display: 'flex', justifyContent: 'center' }}>
                        <Text style={{ color: theme.colors.subtitle, fontFamily: 'Nunito Medium' }}>Total Lives</Text>
                        <Text style={{ color: theme.colors.data, fontFamily: 'Nunito Bold', fontSize: 18 }}>{policyDetails.totallives}</Text>
                      </View>
                      <View style={{ display: 'flex', alignItems: 'center', marginTop: 10, flex: 1, borderRadius: 5, borderWidth: 1, borderColor: theme.colors.border, padding: 8, width: 170 }}>
                        <Text style={{ color: theme.colors.subtitle, fontFamily: 'Nunito Medium' }}>Total Spouse</Text>
                        <Text style={{ color: theme.colors.data, fontFamily: 'Nunito Bold', fontSize: 18 }}>{policyDetails.totalSpouse?.count}</Text>
                      </View>
                      <View style={{ display: 'flex', alignItems: 'center', marginTop: 10, flex: 1, borderRadius: 5, borderWidth: 1, borderColor: theme.colors.border, padding: 8, width: 170 }}>
                        <Text style={{ color: theme.colors.subtitle, fontFamily: 'Nunito Medium' }}>Total Parent</Text>
                        <Text style={{ color: theme.colors.data, fontFamily: 'Nunito Bold', fontSize: 18 }}>{policyDetails.totalParents?.count}</Text>
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
                    <TouchableOpacity onPress={async () => { await Linking.openURL(policyDetails?.policies?.[0]?.agreementurl) }} style={{ borderColor: '#4576DC', borderWidth: 1, width: 100, borderRadius: 5, height: 35, alignItems: 'center', display: 'flex', justifyContent: 'center' }}>
                      <Text style={{ textAlign: 'center', fontSize: 14, fontFamily: 'Nunito Bold', color: theme.colors.alpha }}>View Copy</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
                    <View style={{ borderRightWidth: 1, borderRightColor: theme.colors.border, padding: 4, flex: 1 }}>
                      <View style={{ padding: 10 }}>
                        <Text style={{ color: theme.colors.data, fontSize: 14, fontFamily: 'Nunito Bold' }}>{policyDetails?.policies?.[0]?.insurername}</Text>
                        <Text style={{ color: theme.colors.subtitle, fontSize: 14, fontFamily: 'Nunito Medium' }}>Insurer</Text>
                      </View>
                      <View style={{ padding: 10 }}>
                        <Text style={{ color: theme.colors.data, fontSize: 14, fontFamily: 'Nunito Bold' }}>{policyDetails?.policies?.[0]?.tpaname}</Text>
                        <Text style={{ color: theme.colors.subtitle, fontSize: 14, fontFamily: 'Nunito Medium' }}>TPA</Text>
                      </View>
                      <View style={{ padding: 10 }}>
                        <Text style={{ color: theme.colors.data, fontSize: 14, fontFamily: 'Nunito Bold' }}>{policyDetails?.policies?.[0]?.policynumber}</Text>
                        <Text style={{ color: theme.colors.subtitle, fontSize: 14, fontFamily: 'Nunito Medium' }}>Policy Number</Text>
                      </View>
                      <View style={{ padding: 10 }}>
                        <Text style={{ color: theme.colors.data, fontSize: 14, fontFamily: 'Nunito Bold' }}>{policyDetails?.policies?.[0]?.suminsuredlevels?.map((item) => `₹${Number(item ?? 0).toLocaleString('en-IN')}`)?.join(', ')}</Text>
                        <Text style={{ color: theme.colors.subtitle, fontSize: 14, fontFamily: 'Nunito Medium' }}>Sum Insured</Text>
                      </View>
                    </View>
                    <View style={{ flex: 1 }}>
                      <View style={{ padding: 10 }}>
                        <Text style={{ color: theme.colors.data, fontSize: 14, fontFamily: 'Nunito Bold' }}>{policyDetails?.policies?.[0]?.policyvalidupto?.split("T")[0] ?? ""}</Text>
                        <Text style={{ color: theme.colors.subtitle, fontSize: 14, fontFamily: 'Nunito Medium' }}>Policy Expiry</Text>
                      </View>
                      <View style={{ padding: 10 }}>
                        <Text style={{ color: theme.colors.data, fontSize: 14, fontFamily: 'Nunito Bold' }}>₹{Number(policyDetails?.policies?.[0]?.premuimpaid).toLocaleString('en-IN')}</Text>
                        <Text style={{ color: theme.colors.subtitle, fontSize: 14, fontFamily: 'Nunito Medium' }}>Total Premium Paid</Text>
                      </View>
                      <View style={{ padding: 10 }}>
                        <Text style={{ color: theme.colors.data, fontSize: 14, fontFamily: 'Nunito Bold' }}>₹{Number(policyDetails?.inceptionPremium?.amount).toLocaleString('en-IN')}</Text>
                        <Text style={{ color: theme.colors.subtitle, fontSize: 14, fontFamily: 'Nunito Medium' }}>Inception Premium</Text>
                      </View>
                      <View style={{ padding: 10 }}>
                        <Text style={{ color: theme.colors.data, fontSize: 14, fontFamily: 'Nunito Bold' }}>{policyDetails?.policies?.[0]?.covers?.map((item, index) => (item[0].toUpperCase() + item.substring(1))).join(', ')}</Text>
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
                        <Text style={{ color: theme.colors.data, fontSize: 14, fontFamily: 'Nunito Bold' }}>₹{Number(policyDetails?.cdbalance?.amount).toLocaleString('en-IN')}</Text>
                      </View>
                      <View style={{ padding: 10 }}>
                        <Text style={{ color: theme.colors.subtitle, fontSize: 14, fontFamily: 'Nunito Medium' }}>From Insurer, as on </Text>
                        <Text style={{ color: theme.colors.data, fontSize: 14, fontFamily: 'Nunito Bold' }}>{policyDetails?.cdbalance?.date}</Text>
                      </View>
                      <View style={{ padding: 10 }}>
                        <Text style={{ color: theme.colors.subtitle, fontSize: 14, fontFamily: 'Nunito Medium' }}>Required CD Balance</Text>
                        <Text style={{ color: theme.colors.data, fontSize: 14, fontFamily: 'Nunito Bold' }}>₹{Number(policyDetails?.requiredcdbalance)?.toLocaleString('en-IN')} as on Today</Text>
                      </View>
                      <View style={{ padding: 10 }}>
                        <Text style={{ color: theme.colors.data, fontSize: 14, fontFamily: 'Nunito Bold' }}>TPA Cards Generated - {Number(policyDetails.tpaData?.generated)?.toLocaleString('en-IN')}/{Number(policyDetails.tpaData?.total)?.toLocaleString('en-IN')}</Text>
                      </View>
                      <View style={{ padding: 10 }}>
                        <Text style={{ color: theme.colors.data, fontSize: 14, fontFamily: 'Nunito Bold' }}>{Number(policyDetails?.sentemailtobrokernull)?.toLocaleString('en-IN')} Lives added since last endorsement</Text>
                      </View>
                    </View>
                    <View style={{ flex: 1 }}>
                      <View style={{ padding: 10 }}>
                        <Text style={{ color: theme.colors.subtitle, fontSize: 14, fontFamily: 'Nunito Medium' }}>Last Endorsement sent</Text>
                        <Text style={{ color: theme.colors.data, fontSize: 14, fontFamily: 'Nunito Bold' }}>{policyDetails?.endorsementdata?.lastestEndorsementSent?.split('T')[0]}</Text>
                      </View>
                      <View style={{ padding: 10 }}>
                        <Text style={{ color: theme.colors.subtitle, fontSize: 14, fontFamily: 'Nunito Medium' }}>Last Endorsement received </Text>
                        <Text style={{ color: theme.colors.data, fontSize: 14, fontFamily: 'Nunito Bold' }}>{policyDetails?.endorsementdata?.latestEndorsementRecived?.split('T')[0]}</Text>
                      </View>
                      <View style={{ padding: 10 }}>
                        <Text style={{ color: theme.colors.subtitle, fontSize: 14, fontFamily: 'Nunito Medium' }}>Next endorsement on</Text>
                        <Text style={{ color: theme.colors.data, fontSize: 14, fontFamily: 'Nunito Bold' }}>{ }</Text>
                      </View>
                      <View style={{ padding: 10 }}>
                        <Text style={{ color: theme.colors.subtitle, fontSize: 14, fontFamily: 'Nunito Medium' }}>Average premium per life</Text>
                        <Text style={{ color: theme.colors.data, fontSize: 14, fontFamily: 'Nunito Bold' }}>₹{Number(policyDetails?.avgPremiumPaid)?.toLocaleString('en-IN')}</Text>
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
                  </View>
                  <View>
                    {policyDetails?.addendums && Object.keys(policyDetails?.addendums?.claimscdops)?.length > 0 ? Object.keys(policyDetails?.addendums?.claimscdops).map((item) =>
                      <View style={{ padding: 15, borderBottomWidth: 1, borderColor: theme.colors.border, display:'flex', flex: 1, flexDirection: 'row', justifyContent:'space-between', alignItems:'center' }}>
                        <View>
                          <Text style={{ color: theme.colors.data, fontFamily: 'Nunito Bold', fontSize: 18 }}>{item[0].toUpperCase() + item.substring(1)}</Text>
                          <Text style={{ color: theme.colors.subtitle, fontFamily: 'Nunito Medium', fontSize: 16 }}>{policyDetails?.addendums?.claimscdops[item].endorsement_date}</Text>
                        </View>
                        <TouchableOpacity onPress={async () => { await Linking.openURL(policyDetails?.addendums?.claimscdops[item].endorsement) }} style={{ borderColor: '#4576DC', borderWidth: 1, width: 150, borderRadius: 5, height: 35, alignItems: 'center', display: 'flex', justifyContent: 'center' }}>
                          <Text style={{ textAlign: 'center', fontSize: 14, fontFamily: 'Nunito Bold', color: theme.colors.alpha }}>View Endorsement</Text>
                        </TouchableOpacity>
                      </View>
                    )
                      :
                      <View></View>}
                  </View>
                </View>
              </View> : <></>
          }</View>
        }

      </ScrollView>
    </View>
  )
}

export default Policies;