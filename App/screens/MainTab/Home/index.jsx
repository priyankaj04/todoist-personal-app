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
import { getService, API_ROUTES, stringInterpolater, putTokenService, patchService, deleteService, postTokenService } from '../../../server';
import { ProgressChart } from "react-native-chart-kit";


const HomeScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();

  const dispatch = myDispatch();
  const corporateDetails = mySelector(state => state.Login.value.corporateDetails);
  const baseUrl = mySelector(state => state.Login.value.baseUrl);
  const corporateid = mySelector(state => state.Login.value.loginData.corporateid);
  const hrdashboard = mySelector(state => state.Login.value.hrdashboard);
  const [arrayOfActivities, setArrayOfActivities] = useState([]);

  useEffect(() => {
    getService(baseUrl, stringInterpolater(API_ROUTES.GET_CORPORATE_CLINICAL_DETAILS, { corporateid: corporateid }))
      .then((res) => {
        if (res.status === 1) {
          dispatch(loginActions.setClinicalDetails(res.data))
        } else {
          dispatch(valuesActions.statusNot1(res));
        }
      }).catch((error) => {
        dispatch(valuesActions.error({ error: `Error in Get Corporate Clinical Details ${error}` }));
      })

    getService(baseUrl, stringInterpolater(API_ROUTES.GET_CORPORATE_DETAILS, { corporateid: corporateid }))
      .then((res) => {
        if (res.status === 1) {
          dispatch(loginActions.setCorporateDetails(res.data))
        } else {
          dispatch(valuesActions.statusNot1(res));
        }
      }).catch((error) => {
        dispatch(valuesActions.error({ error: `Error in Get Corporate Details ${error}` }));
      })

    getService(baseUrl, stringInterpolater(API_ROUTES.GET_HRDASHBOARD_HOME, { corporateid: corporateid }))
      .then((res) => {
        if (res.status === 1) {
          dispatch(loginActions.setHrdashboard(res))
        } else {
          dispatch(valuesActions.statusNot1(res));
        }
      }).catch((error) => {
        dispatch(valuesActions.error({ error: `Error in Get Corporate Details ${error}` }));
      })
  }, []);

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
          <Text style={{ color: theme.colors.alpha, fontFamily: 'Nunito-Regular', fontWeight: 'bold', fontSize: 18, margin: 10 }}>Hope you're feeling healthy!</Text>
          <View
            style={{ display: 'flex', gap: 0, flexDirection: 'row' }}
          >
            <View style={{ flex: 1, margin: 10 }}>
              <Animatable.View animation="fadeIn"
                duration={400} style={{ ...styles.card }}>
                <View style={{ display: 'flex', flexDirection: 'row', flex: 1, alignItems: 'center', justifyContent: 'space-between', marginBottom: 15 }}>
                  <Text style={{ color: theme.colors.data, fontWeight: 'bold', marginLeft: 15 }}>Total Lives</Text>
                  <TouchableOpacity>
                    <Icon
                      name="chevron-right"
                      color={theme.colors.alpha}
                      size={24}
                    />
                  </TouchableOpacity>
                </View>
                <View style={{ display: 'flex', gap: 7, flexDirection: 'row' }}>
                  <Image
                    source={assets.ImageBaseUrl('totallivespi')}
                    style={{
                      height: 70,
                      width: 70
                    }}
                  />
                  <View>
                    <Text style={{ color: theme.colors.data, fontWeight: 'bold', fontSize: 18 }}>{hrdashboard?.patientdetails?.total ?? 0}</Text>
                    <View style={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center', marginTop: 3 }}>
                      <Text style={{ color: theme.colors.data, fontWeight: 'bold', fontSize: 14 }}>{hrdashboard?.patientdetails?.employees ?? 0}</Text>
                      <Text style={{ color: theme.colors.data, fontSize: 10 }}>Employees</Text>
                    </View>
                    <View style={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center', marginTop: 3 }}>
                      <Text style={{ color: theme.colors.data, fontWeight: 'bold', fontSize: 14 }}>{hrdashboard?.patientdetails?.dependents ?? 0}</Text>
                      <Text style={{ color: theme.colors.data, fontSize: 10 }}>Dependents</Text>
                    </View>
                  </View>
                </View>
              </Animatable.View>
              <Animatable.View animation="fadeIn"
                duration={400} style={{ ...styles.card, marginTop: 15 }}>
                <View style={{ display: 'flex', flexDirection: 'row', flex: 1, alignItems: 'center', justifyContent: 'space-between', marginBottom: 15 }}>
                  <Text style={{ color: theme.colors.data, fontWeight: 'bold', marginLeft: 15 }}>Mental Health</Text>
                  <TouchableOpacity>
                    <Icon
                      name="chevron-right"
                      color={theme.colors.alpha}
                      size={24}
                    />
                  </TouchableOpacity>
                </View>
                <View style={{ display: 'flex', gap: 7, flexDirection: 'column', justifyContent: 'center' }}>
                  <ProgressChart
                    data={{
                      labels: ["Swim", "Bike", "Run"], // optional
                      data: [0.4, 0.6, 0.8]
                    }}
                    strokeWidth={16}
                    radius={32}
                    chartConfig={{
                      backgroundGradientFrom: "#1E2923",
                      backgroundGradientFromOpacity: 0,
                      backgroundGradientTo: "#08130D",
                      backgroundGradientToOpacity: 0.5,
                      color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
                      strokeWidth: 2, // optional, default 3
                      barPercentage: 0.5,
                      useShadowColorFromDataset: false // optional
                    }}
                    hideLegend={false}
                  />
                  <View>
                    <Text style={{ color: theme.colors.data, fontWeight: 'bold', fontSize: 12 }}>Employee(%) under stress</Text>
                    <Text style={{ color: theme.colors.subtitle, fontSize: 10 }}>Total Responses - {hrdashboard?.patientdetails?.employees ?? 0}</Text>
                  </View>
                </View>
              </Animatable.View>
            </View>
            <Animatable.View animation="fadeIn"
              duration={400} style={{ ...styles.card, flex: 1, margin: 10, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <View style={{ display: 'flex', flexDirection: 'row', flex: 1, alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <Text style={{ color: theme.colors.data, fontWeight: 'bold', marginLeft: 15 }}>Engagement</Text>
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
                  <Text style={{ color: theme.colors.data, fontSize: 12 }}>{arrayOfActivities[0] ? arrayOfActivities[0].display_name : ("")}</Text>
                  <Text style={{ color: theme.colors.data, fontWeight: 'bold', fontSize: 16 }}>{arrayOfActivities[0] ? arrayOfActivities[0].value : 0}</Text>
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
                  <Text style={{ color: theme.colors.data, fontSize: 12 }}>{arrayOfActivities[1] ? arrayOfActivities[1].display_name : ("")}</Text>
                  <Text style={{ color: theme.colors.data, fontWeight: 'bold', fontSize: 16 }}>{arrayOfActivities[1] ? arrayOfActivities[1].value : 0}</Text>
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
                  <Text style={{ color: theme.colors.data, fontSize: 12 }}>{arrayOfActivities[2] ? arrayOfActivities[2].display_name : ("")}</Text>
                  <Text style={{ color: theme.colors.data, fontWeight: 'bold', fontSize: 16 }}>{arrayOfActivities[2] ? arrayOfActivities[2].value : 0}</Text>
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
                  <Text style={{ color: theme.colors.data, fontSize: 12 }}>{arrayOfActivities[3] ? arrayOfActivities[3].display_name : ("")}</Text>
                  <Text style={{ color: theme.colors.data, fontWeight: 'bold', fontSize: 16 }}>{arrayOfActivities[3] ? arrayOfActivities[3].value : 0}</Text>
                </View>
              </View>
            </Animatable.View>
          </View>
        </Animatable.View>
      }
    </ScrollView>
  );
};

export default HomeScreen;
