import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import { Calendar, LocaleConfig, CalendarList } from 'react-native-calendars';
import { useTheme } from '@react-navigation/native';
import styles from '../Styles'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, Link } from '@react-navigation/native';
import dayjs from 'dayjs';

const HomeScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const [selected, setSelected] = useState(dayjs().format('YYYY-MM-DD'));

  return (
    <ScrollView style={styles.container}>
      <View style={{ display: 'flex', flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text
          style={{
            color: theme.colors.data,
            paddingLeft: 15,
            fontFamily: 'Asar Regular',
            fontSize: 20,
            marginTop: 15
          }}>Welcome&nbsp;Back!&nbsp;</Text>
        <Text
          style={{
            color: theme.colors.alpha,
            fontFamily: 'Amarante Regular',
            fontSize: 38,
            marginTop: 15,
            paddingRight: 15
          }}>🔥3</Text>
      </View>
      <View>
        <Calendar
          style={{backgroundColor:'transparent'}}
          horizontal={true}
          pagingEnabled={true}
          calendarWidth={320}
          enableSwipeMonths={true}
          onDayPress={day => {
            setSelected(day.dateString);
          }}
          theme={{
            backgroundColor: theme.colors.background,
            calendarBackground: theme.colors.background,
            textSectionTitleColor: theme.colors.alpha,
            textSectionTitleDisabledColor: '#d9e1e8',
            selectedDayBackgroundColor: theme.colors.alpha,
            selectedDayTextColor: '#ffffff',
            todayTextColor: theme.colors.beta,
            dayTextColor: '#ffffff',
            textDisabledColor: theme.colors.lite,
            dotColor: '#00adf5',
            selectedDotColor: '#ffffff',
            arrowColor: theme.colors.beta,
            disabledArrowColor: '#d9e1e8',
            monthTextColor: theme.colors.alpha,
            indicatorColor: '#ef4444',
            textDayFontFamily: 'Asar Regular',
            textMonthFontFamily: 'Asar Regular',
            textDayHeaderFontFamily: 'Asar Regular',
            textDayFontWeight: '500',
            textMonthFontWeight: 'bold',
            textDayHeaderFontWeight: '300',
            textDayFontSize: 16,
            textMonthFontSize: 16,
            textDayHeaderFontSize: 16
          }}
          markedDates={{
            [selected]: { selected: true, marked: true, selectedColor: theme.colors.alpha }
          }} />
      </View>
      <View style={{display:'flex', flex: 1, flexDirection:'row', borderBottomColor:theme.colors.border, borderBottomWidth: 1, marginTop: 10}}></View>
      <View style={{display:'flex', flex: 1, flexDirection:'row', flexWrap:'wrap', gap: 15, padding: 15, marginTop: 5}}>
        <TouchableOpacity style={{ height: 110, width: 180, backgroundColor: theme.colors.yellow, borderRadius: 5, display:'flex', justifyContent:'center' }}>
          <Text style={{
            color: theme.colors.background,
            fontFamily: 'Asar Regular',
            fontSize: 24,
            textAlign:'center'
          }}>🏋🏻 Workout</Text>
          <Text style={{
            color: theme.colors.background,
            fontFamily: 'Asar Regular',
            fontSize: 20,
            textAlign: 'center',
            marginTop: 10
          }}>🕖 7:00 AM</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ width: 180, height: 110, backgroundColor: theme.colors.purple, borderRadius: 5, display: 'flex', justifyContent: 'center' }}>
          <Text style={{
            color: theme.colors.background,
            fontFamily: 'Asar Regular',
            fontSize: 24,
            textAlign: 'center'
          }}>🧘🏻‍♀️ Meditate</Text>
          <Text style={{
            color: theme.colors.background,
            fontFamily: 'Asar Regular',
            fontSize: 20,
            textAlign: 'center',
            marginTop: 10
          }}>🕰️ 10-20mins</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ width: 180, height: 110, backgroundColor: theme.colors.blue, borderRadius: 5, display: 'flex', justifyContent: 'center' }}>
          <Text style={{
            color: theme.colors.background,
            fontFamily: 'Asar Regular',
            fontSize: 24,
            textAlign: 'center'
          }}>🧊 Drink Water</Text>
          <Text style={{
            color: theme.colors.background,
            fontFamily: 'Asar Regular',
            fontSize: 20,
            textAlign: 'center',
            marginTop: 10
          }}>🎯 4-5 ltrs</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ width: 180, height: 110, backgroundColor: theme.colors.green, borderRadius: 5, display: 'flex', justifyContent: 'center' }}>
          <Text style={{
            color: theme.colors.background,
            fontFamily: 'Asar Regular',
            fontSize: 24,
            textAlign: 'center'
          }}>🥗 Cal Deficit</Text>
          <Text style={{
            color: theme.colors.background,
            fontFamily: 'Asar Regular',
            fontSize: 20,
            textAlign: 'center',
            marginTop: 10
          }}>🍴 Eat Clean</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ height: 110, width: 180, backgroundColor: theme.colors.rose, borderRadius: 5, display: 'flex', justifyContent: 'center' }}>
          <Text style={{
            color: theme.colors.background,
            fontFamily: 'Asar Regular',
            fontSize: 24,
            textAlign: 'center'
          }}>📚 Read Book</Text>
          <Text style={{
            color: theme.colors.background,
            fontFamily: 'Asar Regular',
            fontSize: 20,
            textAlign: 'center',
            marginTop: 10
          }}>📖 5-20 pages</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ width: 180, height: 110, backgroundColor: theme.colors.cyan, borderRadius: 5, display: 'flex', justifyContent: 'center' }}>
          <Text style={{
            color: theme.colors.background,
            fontFamily: 'Asar Regular',
            fontSize: 24,
            textAlign: 'center'
          }}>🙇🏻‍♀️ Pray</Text>
          <Text style={{
            color: theme.colors.background,
            fontFamily: 'Asar Regular',
            fontSize: 20,
            textAlign: 'center',
            marginTop: 10
          }}>🙏🏻 Chant Mantras</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ height: 110, width: 180, backgroundColor: theme.colors.violet, borderRadius: 5, display: 'flex', justifyContent: 'center' }}>
          <Text style={{
            color: theme.colors.background,
            fontFamily: 'Asar Regular',
            fontSize: 24,
            textAlign: 'center'
          }}>👩🏻‍💻 DSA</Text>
          <Text style={{
            color: theme.colors.background,
            fontFamily: 'Asar Regular',
            fontSize: 20,
            textAlign: 'center',
            marginTop: 10
          }}>💡 1/2 problems</Text>
        </TouchableOpacity>
      </View>
    </ScrollView >
  );
};

export default HomeScreen;
