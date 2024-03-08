import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import styles from '../Styles'
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';
import { loginActions, valuesActions, myDispatch, mySelector } from '../../../redux';
import assets from '../../../assets';
import { getService, API_ROUTES, stringInterpolater, getTokenService } from '../../../server';
import { ProgressChart } from "react-native-chart-kit";
import jwtDecode from 'jwt-decode';

const HomeScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();

  const dispatch = myDispatch();
  const corporateDetails = mySelector(state => state.Login.value.corporateDetails);
  const baseUrl = mySelector(state => state.Login.value.baseUrl);
  const corporateid = mySelector(state => state.Login.value.loginData.corporateid) ?? 2;
  const loginData = mySelector(state => state.Login.value.loginData);
  const hrdashboard = mySelector(state => state.Login.value.hrdashboard);
  const clinicalDetails = mySelector(state => state.Login.value.clinicalDetails);
  const [arrayOfActivities, setArrayOfActivities] = useState([]);
  const [policydetails, setPolicyDetails] = useState([]);

  useEffect(() => {
    //dispatch(loginActions.logOut());
    getService(baseUrl, stringInterpolater(API_ROUTES.GET_CORPORATE_CLINICAL_DETAILS, { corporateid: corporateid }))
      .then((res) => {
        if (res.status === 1) {
          dispatch(loginActions.setClinicalDetails(res));
        } else {
          dispatch(valuesActions.statusNot1(res?.msg));
        }
      }).catch((error) => {
        dispatch(valuesActions.error({ error: `Error in Get Corporate Clinical Details ${error}` }));
      })

    getService(baseUrl, stringInterpolater(API_ROUTES.GET_CORPORATE_DETAILS, { corporateid: corporateid }))
      .then((res) => {
        if (res.status === 1) {
          dispatch(loginActions.setCorporateDetails(res.data))
        } else {
          dispatch(valuesActions.statusNot1(res?.msg));
        }
      }).catch((error) => {
        dispatch(valuesActions.error({ error: `Error in Get Corporate Details ${error}` }));
      })

    getService(baseUrl, stringInterpolater(API_ROUTES.GET_HRDASHBOARD_HOME, { corporateid: corporateid }))
      .then((res) => {
        if (res.status === 1) {
          dispatch(loginActions.setHrdashboard(res))
        } else {
          dispatch(valuesActions.statusNot1(res?.msg));
        }
      }).catch((error) => {
        dispatch(valuesActions.error({ error: `Error in Get HRDashboard Details ${error}` }));
      })
  }, []);

  useEffect(() => {
    if (Object.keys(corporateDetails)?.length > 0) {
      let gmcPolicies = corporateDetails?.policytype?.filter(policy => policy?.startsWith("GMC"));
      if (gmcPolicies) {
        getTokenService(baseUrl, stringInterpolater(API_ROUTES.GET_CORPORATE_POLICY, { cpolid: gmcPolicies?.[0] }), loginData.token)
          .then((res) => {
            if (res.status === 1) {
              setPolicyDetails(res.data)
            } else {
              setPolicyDetails({})
              dispatch(valuesActions.statusNot1(res?.msg));
            }
          }).catch((error) => {
            dispatch(valuesActions.error({ error: `Error in Get Policy Details ${error}` }));
          })
      }
    }
  }, [corporateDetails])

  useEffect(() => {
    if (Object.keys(hrdashboard)?.length > 0) {
      sortArrayOfActivities(hrdashboard?.totalactivitydetails?.[0]);
    }
  }, [hrdashboard])

  const sortArrayOfActivities = (data) => {
    //filter out these ("activity_count", "activity_completed", "activity_pending", "activity_closed", "activity_ongoing")
    const filteredData = Object.fromEntries(
      Object.entries(data)?.filter(([key]) =>
        !["activity_count", "activity_completed", "activity_pending", "activity_closed", "activity_ongoing", "scan", "questionnaire_consultation"]?.includes(key)
      )
    );
    //convert object into array of object
    const dataArray = Object.entries(filteredData)?.map(([key, value]) => ({ [key]: value }));
    //sort these array of object in decreasing order
    const sortedData = dataArray.sort((a, b) => {
      const aValue = Object.values(a)[0];
      const bValue = Object.values(b)[0];
      return bValue - aValue;
    });

    const transformedData = sortedData.map(obj =>
      Object.entries(obj)?.map(([key, value]) => ({ key, value }))[0]
    );

    const displayNames = {
      consultation: "Health Consultation",
      dietconsultation: "Diet Consultation",
      gpconsultation: "General Physician Consultation",
      lab: "Lab Test",
      physiotherapy: "Physiotherapy Consultation",
      habitcoaching: "Habit Coaching Consultation",
      scan: "Scan",
      skinconsultation: "Dermatology Consultation",
      eyeconsultation: "Eye Consultation",
      orthoconsultation: "Orthopaedic Consultation",
      dentalconsultation: "Dental Consultation",
      questionnaire_consultation: "Questionnaire Consultation",
      gynaecconsultation: "Gynecology Consultation",
      pconsultation: "Pediatric Consultation",
      questionnaire: "Questionnaire",
    };
    const newData = transformedData?.map(obj => ({
      key: obj.key,
      value: obj.value,
      display_name: displayNames[obj.key]
    }));

    setArrayOfActivities(newData)
  }

  return (
    <ScrollView style={styles.container}>
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
        >Hello Team{" " + corporateDetails?.brandname ?? ""}
        </Text>
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
      {
        Object.keys(corporateDetails).length > 0 &&
        <Animatable.View
          animation="fadeIn"
          duration={400}
        >
          <View
            style={{}}
          >
            <View style={{ flex: 1, margin: 10 }}>
              <Animatable.View animation="fadeIn"
                duration={400} style={{ ...styles.card }}>
                <View style={{ display: 'flex', flexDirection: 'row', flex: 1, alignItems: 'center', justifyContent: 'space-between', marginBottom: 15 }}>
                  <Text style={{ color: theme.colors.data, marginLeft: 15, fontFamily: 'Nunito ExtraBold', fontSize: 18 }}>Total Lives</Text>
                  <TouchableOpacity>
                    <Icon
                      name="chevron-right"
                      color={theme.colors.alpha}
                      size={24}
                    />
                  </TouchableOpacity>
                </View>
                <View style={{ display: 'flex', gap: 5, flexDirection: 'row', flex: 1 }}>
                  <View style={{ margin: 5 }}>
                    <Image
                      source={assets.ImageBaseUrl('totallivespi')}
                      style={{
                        height: 100,
                        width: 100
                      }}
                    />
                  </View>
                  <View style={{ margin: 10 }}>
                    <Text style={{ color: theme.colors.data, fontFamily: 'Nunito Bold', fontSize: 20 }}>{hrdashboard?.patientdetails?.total ?? 0}</Text>
                    <View style={{ display: 'flex', flexDirection: 'row', gap: 5, alignItems: 'center', marginTop: 5 }}>
                      <Text style={{ color: theme.colors.data, fontFamily: 'Nunito Bold', fontSize: 18 }}>{hrdashboard?.patientdetails?.employees ?? 0}</Text>
                      <Text style={{ color: theme.colors.data, fontSize: 14, fontFamily: 'Nunito Medium' }}>Employees</Text>
                    </View>
                    <View style={{ display: 'flex', flexDirection: 'row', gap: 5, alignItems: 'center', marginTop: 5 }}>
                      <Text style={{ color: theme.colors.data, fontFamily: 'Nunito Bold', fontSize: 18 }}>{hrdashboard?.patientdetails?.dependents ?? 0}</Text>
                      <Text style={{ color: theme.colors.data, fontSize: 14, fontFamily: 'Nunito Medium' }}>Dependents</Text>
                    </View>
                  </View>
                </View>
              </Animatable.View>
              <Animatable.View animation="fadeIn"
                duration={400} style={{ ...styles.card, marginTop: 15 }}>
                <View style={{ display: 'flex', flexDirection: 'row', flex: 1, alignItems: 'center', justifyContent: 'space-between', marginBottom: 15 }}>
                  <Text style={{ color: theme.colors.data, fontFamily: 'Nunito ExtraBold', marginLeft: 15, fontSize: 20 }}>Group Mediclaim Details</Text>
                  <TouchableOpacity>
                    <Icon
                      name="chevron-right"
                      color={theme.colors.alpha}
                      size={24}
                    />
                  </TouchableOpacity>
                </View>
                <View style={{ display: 'flex', gap: 15, flexDirection: 'column', justifyContent: 'center' }}>
                  <View style={{ display: 'flex', flex: 1, flexDirection: 'row', gap: 15 }}>
                    <View style={{ flex: 1 }}>
                      <Text style={{ color: theme.colors.subtitle, fontFamily: 'Nunito Medium', fontSize: 14 }}>Total Premium</Text>
                      <Text style={{ color: theme.colors.data, fontSize: 16, fontFamily: 'Nunito Bold' }}>₹{Number(policydetails?.policies?.[0]?.premuimpaid ?? 0).toLocaleString('en-IN')}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ color: theme.colors.subtitle, fontFamily: 'Nunito Medium', fontSize: 14 }}>Sum Insured</Text>
                      <View style={{ display: 'flex', flexDirection: 'row', gap: 2, alignItems: 'center' }}>
                        <Text style={{ color: theme.colors.data, fontSize: 16, fontFamily: 'Nunito Bold' }}> {policydetails?.policies?.[0]?.suminsuredlevels?.map((item) => `₹${Number(item ?? 0).toLocaleString('en-IN')}`)?.join(', ')}</Text>
                      </View>
                    </View>
                  </View>
                  <View style={{ display: 'flex', flex: 1, flexDirection: 'row', gap: 15 }}>
                    <View style={{ flex: 1 }}>
                      <Text style={{ color: theme.colors.subtitle, fontFamily: 'Nunito Medium', fontSize: 14 }}>CD Balance</Text>
                      <View style={{ display: 'flex', flexDirection: 'row', gap: 2, alignItems: 'center' }}>
                        <Text style={{ color: theme.colors.data, fontSize: 16, fontFamily: 'Nunito Bold' }}>₹{Number(policydetails?.policies?.[0]?.cdbalance ?? 0).toLocaleString('en-IN')}</Text>
                        <Text style={{ color: theme.colors.data, fontSize: 12, fontFamily: 'Nunito Bold' }}>({policydetails?.policies?.[0]?.cdbalancedate?.split("T")[0] ?? ""})</Text>
                      </View>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ color: theme.colors.subtitle, fontFamily: 'Nunito Medium', fontSize: 14 }}>Valid Till</Text>
                      <View style={{ display: 'flex', flexDirection: 'row', gap: 2, alignItems: 'center' }}>
                        <Text style={{ color: theme.colors.data, fontSize: 16, fontFamily: 'Nunito Bold' }}> {policydetails?.policies?.[0]?.policyvalidupto?.split("T")[0] ?? ""}</Text>
                      </View>
                    </View>
                  </View>
                  <View style={{ display: 'flex', flex: 1, flexDirection: 'row', gap: 15 }}>
                    <View style={{ flex: 1 }}>
                      <Text style={{ color: theme.colors.subtitle, fontFamily: 'Nunito Medium', fontSize: 14 }}>Policy Number</Text>
                      <View style={{ display: 'flex', flexDirection: 'row', gap: 2, alignItems: 'center' }}>
                        <Text style={{ color: theme.colors.data, fontSize: 16, fontFamily: 'Nunito Bold' }}> {policydetails?.policies?.[0]?.policynumber ?? ""}</Text>
                      </View>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ color: theme.colors.subtitle, fontFamily: 'Nunito Medium', fontSize: 14 }}>Policy Cover</Text>
                      <View style={{ display: 'flex', flexDirection: 'row', gap: 2, alignItems: 'center' }}>
                        <Text style={{ color: theme.colors.data, fontSize: 16, fontFamily: 'Nunito Bold' }}>{policydetails?.policies?.[0]?.covers?.map((item, index) => (item[0].toUpperCase() + item.substring(1))).join(', ')}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View style={{ display: 'flex', flex: 1, flexDirection: 'row', gap: 15 }}>
                    <View style={{ flex: 1 }}>
                      <Text style={{ color: theme.colors.subtitle, fontFamily: 'Nunito Medium', fontSize: 14 }}>Insurance</Text>
                      <View style={{ display: 'flex', flexDirection: 'row', gap: 2, alignItems: 'center' }}>
                        <Text style={{ color: theme.colors.data, fontSize: 16, fontFamily: 'Nunito Bold' }}> {policydetails?.policies?.[0]?.insurername ?? ""}</Text>
                      </View>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ color: theme.colors.subtitle, fontFamily: 'Nunito Medium', fontSize: 14 }}>TPA</Text>
                      <View style={{ display: 'flex', flexDirection: 'row', gap: 2, alignItems: 'center' }}>
                        <Text style={{ color: theme.colors.data, fontSize: 16, fontFamily: 'Nunito Bold' }}>{policydetails?.policies?.[0]?.tpaname}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </Animatable.View>
            </View>
            <Animatable.View animation="fadeIn"
              duration={400} style={{ ...styles.card, flex: 1, margin: 10, display: 'flex', gap: 25 }}>
              <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ color: theme.colors.data, fontFamily: 'Nunito ExtraBold', marginLeft: 15 }}>Engagement</Text>
                <TouchableOpacity>
                  <Icon
                    name="info"
                    color={theme.colors.alpha}
                    size={20}
                  />
                </TouchableOpacity>
              </View>
              <View style={{ display: 'flex', gap: 10, flexDirection: 'row', alignItems: 'center' }}>
                <Image
                  source={assets.ImageBaseUrl('dietconsultationpi')}
                  style={{
                    height: 50,
                    width: 50
                  }}
                />
                <View style={{ display: 'flex', flexDirection: 'column', }}>
                  <Text style={{ color: theme.colors.data, fontSize: 14, fontFamily: 'Nunito Medium' }}>{arrayOfActivities[0] ? arrayOfActivities[0].display_name : ("")}</Text>
                  <Text style={{ color: theme.colors.data, fontFamily: 'Nunito Bold', fontSize: 16 }}>{arrayOfActivities[0] ? arrayOfActivities[0].value : 0}</Text>
                </View>
              </View>
              <View style={{ display: 'flex', gap: 10, flexDirection: 'row', alignItems: 'center' }}>
                <Image
                  source={assets.ImageBaseUrl('gpconsultationpi')}
                  style={{
                    height: 50,
                    width: 50
                  }}
                />
                <View style={{ display: 'flex', flexDirection: 'column', }}>
                  <Text style={{ color: theme.colors.data, fontSize: 14, fontFamily: 'Nunito Medium' }}>{arrayOfActivities[1] ? arrayOfActivities[1].display_name : ("")}</Text>
                  <Text style={{ color: theme.colors.data, fontFamily: 'Nunito Bold', fontSize: 16 }}>{arrayOfActivities[1] ? arrayOfActivities[1].value : 0}</Text>
                </View>
              </View>
              <View style={{ display: 'flex', gap: 10, flexDirection: 'row', alignItems: 'center' }}>
                <Image
                  source={assets.ImageBaseUrl('dietconsultationpi')}
                  style={{
                    height: 50,
                    width: 50
                  }}
                />
                <View style={{ display: 'flex', flexDirection: 'column', }}>
                  <Text style={{ color: theme.colors.data, fontSize: 14, fontFamily: 'Nunito Medium' }}>{arrayOfActivities[2] ? arrayOfActivities[2].display_name : ("")}</Text>
                  <Text style={{ color: theme.colors.data, fontFamily: 'Nunito Bold', fontSize: 16 }}>{arrayOfActivities[2] ? arrayOfActivities[2].value : 0}</Text>
                </View>
              </View>
              <View style={{ display: 'flex', gap: 10, flexDirection: 'row', alignItems: 'center' }}>
                <Image
                  source={assets.ImageBaseUrl('questionnairepi')}
                  style={{
                    height: 50,
                    width: 50
                  }}
                />
                <View style={{ display: 'flex', flexDirection: 'column', }}>
                  <Text style={{ color: theme.colors.data, fontSize: 14, fontFamily: 'Nunito Medium' }}>{arrayOfActivities[3] ? arrayOfActivities[3].display_name : ("")}</Text>
                  <Text style={{ color: theme.colors.data, fontFamily: 'Nunito Bold', fontSize: 16 }}>{arrayOfActivities[3] ? arrayOfActivities[3].value : 0}</Text>
                </View>
              </View>
            </Animatable.View>
          </View>
          <View style={{ ...styles.card, margin: 10 }}>
            <View style={{ display: 'flex', flexDirection: 'row', flex: 1, justifyContent: 'space-between', marginBottom: 15 }}>
              <Text style={{ color: theme.colors.data, marginLeft: 15, fontFamily: 'Nunito ExtraBold' }}>Physical Health</Text>
              <TouchableOpacity>
                <Icon
                  name="chevron-right"
                  color={theme.colors.alpha}
                  size={24}
                />
              </TouchableOpacity>
            </View>
            <View style={{ display: 'grid', flex: 1, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
              <View style={{ display: 'flex', gap: 7, flexDirection: 'column', justifyContent: 'center', marginBottom: 10, borderRightColor: theme.colors.border, borderRightWidth: 1 }}>
                <ProgressChart
                  width={150}
                  height={100}
                  data={{
                    data: [clinicalDetails?.avghealthscore / 100 || 0]
                  }}
                  strokeWidth={16}
                  radius={32}
                  chartConfig={{
                    color: (opacity = 1) => `rgba(50, 102, 227, ${opacity})`,
                    strokeWidth: 2,
                    useShadowColorFromDataset: false,
                    backgroundGradientFromOpacity: 0,
                    backgroundGradientToOpacity: 0,
                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    propsForDots: {
                      r: "5",
                      strokeWidth: "2",
                      stroke: "rgba(50, 102, 227,1)"
                    }
                  }}
                  hideLegend={true}
                />
                <View style={{ display: 'flex', flex: 1, justifyContent: 'center', flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                  <View style={{ width: 15, height: 15, backgroundColor: 'rgba(50, 102, 227, 0.6)', borderRadius: 25 }}></View>
                  <Text style={{ color: theme.colors.data, fontFamily: "Nunito Bold" }}>{`${Math.round(clinicalDetails?.avghealthscore)}%` || 0}</Text>
                </View>
                <View>
                  <Text style={{ color: theme.colors.data, fontFamily: 'Nunito Bold', fontSize: 12, textAlign: 'center' }}>Avg Health Score</Text>
                  <Text style={{ color: theme.colors.subtitle, fontSize: 10, fontFamily: 'Nunito Medium', textAlign: 'center' }}>Total Responses - {clinicalDetails?.totalresponse ?? 0}</Text>
                </View>
              </View>
              <View style={{ display: 'flex', gap: 7, flexDirection: 'column', justifyContent: 'center', marginBottom: 10 }}>
                <ProgressChart
                  width={150}
                  height={100}
                  data={{
                    data: [clinicalDetails?.smokepercent / 100 || 0]
                  }}
                  strokeWidth={16}
                  radius={32}
                  chartConfig={{
                    color: (opacity = 1) => `rgba(50, 102, 227, ${opacity})`,
                    strokeWidth: 2,
                    useShadowColorFromDataset: false,
                    backgroundGradientFromOpacity: 0,
                    backgroundGradientToOpacity: 0,
                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    propsForDots: {
                      r: "5",
                      strokeWidth: "2",
                      stroke: "rgba(50, 102, 227,1)"
                    }
                  }}
                  hideLegend={true}
                />
                <View style={{ display: 'flex', flex: 1, justifyContent: 'center', flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                  <View style={{ width: 15, height: 15, backgroundColor: 'rgba(50, 102, 227, 0.6)', borderRadius: 25 }}></View>
                  <Text style={{ color: theme.colors.data, fontFamily: "Nunito Bold" }}>{`${Math.round(clinicalDetails?.smokepercent)}%` || 0}</Text>
                </View>
                <View>
                  <Text style={{ color: theme.colors.data, fontFamily: 'Nunito Bold', fontSize: 12, textAlign: 'center' }}>Smoking Population</Text>
                  <Text style={{ color: theme.colors.subtitle, fontSize: 10, fontFamily: 'Nunito Medium', textAlign: 'center' }}>Total Responses - {clinicalDetails?.totalresponse ?? 0}</Text>
                </View>
              </View>
              <View style={{ display: 'flex', gap: 7, flexDirection: 'column', justifyContent: 'center', borderRightColor: theme.colors.border, borderRightWidth: 1, borderTopColor: theme.colors.border, borderTopWidth: 1 }}>
                <ProgressChart
                  width={150}
                  height={100}
                  data={{
                    data: [clinicalDetails?.alcoholpercent / 100 || 0]
                  }}
                  strokeWidth={16}
                  radius={32}
                  chartConfig={{
                    color: (opacity = 1) => `rgba(50, 102, 227, ${opacity})`,
                    strokeWidth: 2,
                    useShadowColorFromDataset: false,
                    backgroundGradientFromOpacity: 0,
                    backgroundGradientToOpacity: 0,
                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    propsForDots: {
                      r: "5",
                      strokeWidth: "2",
                      stroke: "rgba(50, 102, 227,1)"
                    }
                  }}
                  hideLegend={true}
                />
                <View style={{ display: 'flex', flex: 1, justifyContent: 'center', flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                  <View style={{ width: 15, height: 15, backgroundColor: 'rgba(50, 102, 227, 0.6)', borderRadius: 25 }}></View>
                  <Text style={{ color: theme.colors.data, fontFamily: "Nunito Bold" }}>{`${Math.round(clinicalDetails?.alcoholpercent)}%` || 0}</Text>
                </View>
                <View>
                  <Text style={{ color: theme.colors.data, fontFamily: 'Nunito Bold', fontSize: 12, textAlign: 'center' }}>Drinking Population</Text>
                  <Text style={{ color: theme.colors.subtitle, fontSize: 10, fontFamily: 'Nunito Medium', textAlign: 'center' }}>Total Responses - {clinicalDetails?.totalresponse ?? 0}</Text>
                </View>
              </View>
              <View style={{ display: 'flex', gap: 7, flexDirection: 'column', justifyContent: 'center', borderTopColor: theme.colors.border, borderTopWidth: 1 }}>
                <ProgressChart
                  width={150}
                  height={100}
                  data={{
                    data: [clinicalDetails?.healthybmipercent / 100 || 0]
                  }}
                  strokeWidth={16}
                  radius={32}
                  chartConfig={{
                    color: (opacity = 1) => `rgba(50, 102, 227, ${opacity})`,
                    strokeWidth: 2,
                    useShadowColorFromDataset: false,
                    backgroundGradientFromOpacity: 0,
                    backgroundGradientToOpacity: 0,
                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    propsForDots: {
                      r: "5",
                      strokeWidth: "2",
                      stroke: "rgba(50, 102, 227,1)"
                    }
                  }}
                  hideLegend={true}
                />
                <View style={{ display: 'flex', flex: 1, justifyContent: 'center', flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                  <View style={{ width: 15, height: 15, backgroundColor: 'rgba(50, 102, 227, 0.6)', borderRadius: 25 }}></View>
                  <Text style={{ color: theme.colors.data, fontFamily: "Nunito Bold" }}>{`${Math.round(clinicalDetails?.healthybmipercent)}%` || 0}</Text>
                </View>
                <View>
                  <Text style={{ color: theme.colors.data, fontFamily: 'Nunito Bold', fontSize: 12, textAlign: 'center' }}>Healthy BMI</Text>
                  <Text style={{ color: theme.colors.subtitle, fontSize: 10, fontFamily: 'Nunito Medium', textAlign: 'center' }}>Total Responses - {clinicalDetails?.totalresponse ?? 0}</Text>
                </View>
              </View>
            </View>
          </View>
        </Animatable.View>
      }
    </ScrollView>
  );
};

export default HomeScreen;
