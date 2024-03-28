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
import styles from '../Styles'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, Link } from '@react-navigation/native';
import { loginActions, valuesActions, myDispatch, mySelector } from '../../../redux';
import { API_ROUTES, stringInterpolater, postService } from '../../../server';

const Settings = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const dispatch = myDispatch();
  const corporateid = mySelector(state => state.Login.value.loginData.corporateid)
  const baseUrl = mySelector(state => state.Login.value.baseUrl);
  const [loading, setLoading] = useState(false);
  const [allusers, setAllusers] = useState([]);

  useEffect(() => {
    setLoading(true);
    postService(baseUrl, API_ROUTES.GET_CORPORATEUSERS_BY_CORPORATEID, { corporateid }).then((res) => {
      if (res.status) {
        setAllusers(res.data);
        console.log("res.data", res.data)
        setLoading(false);
      } else {
        setLoading(false);
        dispatch(valuesActions.statusNot1(res?.msg));
      }
    }).catch((error) => {
      setLoading(false);
      dispatch(valuesActions.error({ error: `Error in GET ALL PATIENTS BY INSURANCE ${error}` }));
    })

  }, [])

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: 'black' }}>Please wait...</Text>
        <ActivityIndicator size="large" />
      </View>
    );
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
        >Corporate Users</Text>
        {/*<Ionicons
          style={{
            textAlign: 'right',
            flex: 1,
          }}
          name="notifications"
          size={25}
          color={theme.colors.data}
        // onPress={() => navigation.openDrawer()}
        />*/}
      </View>
      <ScrollView style={{ marginTop: 15 }}>
        {allusers && allusers.length > 0 ?
          allusers.map((item) =>
            <View style={{ margin: 10, borderRadius: 5, borderWidth: 1, borderColor: theme.colors.border }}>
              <View style={{ padding: 10, paddingHorizontal: 15, borderBottomWidth: 1, borderBottomColor: theme.colors.border }}>
                <Text style={{ color: theme.colors.data, fontFamily: 'Nunito Bold' }}>{item.name}</Text>
              </View>
              <View style={{ padding: 10 }}>
                <View style={{ display: 'flex', flexDirection: 'row', gap: 10, margin: 10, alignItems:'center' }}>
                  <Text style={{ color: theme.colors.data, fontFamily: 'Nunito Medium' }}>Email:</Text>
                  <Text style={{ color: theme.colors.data, fontFamily: 'Nunito Medium', fontSize: 16 }}>{item.email}</Text>
                </View>
                <View style={{ display: 'flex', flexDirection: 'row', gap: 10, margin: 10, alignItems: 'center' }}>
                  <Text style={{ color: theme.colors.data, fontFamily: 'Nunito Medium' }}>Role:</Text>
                  <Text style={{ color: theme.colors.data, fontFamily: 'Nunito Medium', fontSize: 16, padding: 5, paddingHorizontal: 10, backgroundColor: '#DBEAFE', borderRadius: 5 }}>{item.role}</Text>
                </View>
              </View>
            </View>
          )
          :
          <View style={{ height: 500, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: theme.colors.data, fontFamily: 'Nunito Medium', fontSize: 16 }}>No Users</Text>
          </View>}
      </ScrollView>
    </View>
  )
}

export default Settings