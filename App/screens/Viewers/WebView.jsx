import React, { useEffect, useState } from 'react';
import WebView from 'react-native-webview';
import {View, StyleSheet, TouchableOpacity,Dimensions, Image,StatusBar,ActivityIndicator, Text, Platform} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { vh, vw } from 'react-native-css-vh-vw';
const { width, height } = Dimensions.get('window');
import { COLORS, Navigations, screens, } from '../../constants/index';
import { FONTS, SIZES, } from '../../constants/theme';
import { track } from '@amplitude/analytics-react-native';


const WebViewr = ({route, navigation }) => {
  const {title='', url=''}=  route.params;
console.log(url)
  return (
    <View style={{backgroundColor:'#fff',flex:1}}>
      <View style={{height: Platform.OS === 'ios' ? vh(6) : StatusBar.currentHeight,}}/>
      {
        title != 'Questionnaire' &&
        <TouchableOpacity style={styles.appBar}  onPress={()=>{ navigation.goBack()}}>
          <Text style={styles.appBarText}> <Icon name={'chevron-left'} style={{fontSize: 16,color:COLORS.backgroundPrimary}}/>{' '}</Text>
          <Text style={styles.appBarText}> {title}</Text>
        </TouchableOpacity>
      }
       
      <WebView
        source={{
          uri: url ?? 'https://circlehealth.in',
        }}
        containerStyle={{
          flex: 1,
        }}
        scalesPageToFit={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
    card:{
      backgroundColor: '#E5EEFF',
      display:'flex',
      flexDirection:'row',
      margin:15,
      borderRadius:8,
      padding:5,
      alignItems :'center',
      justifyContent:'center'
    },
  
    appBarText:{
      color:'black',
      paddingVertical: 13,
      marginLeft:10,
      ...FONTS.med3
    },
  
    appBar:{
      fontSize: '.9rem',
      textAlign: 'left',
      display:'flex',
      flexDirection:'row',
      alignItems :'center',
    },
  
  })

export default WebViewr;