import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Linking,
  Text,
  Platform
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';

import { vh, vw } from 'react-native-css-vh-vw';
import {useTheme} from '@react-navigation/native';
import ImageView from "react-native-image-viewing";
import Pdf from 'react-native-pdf';


const PdfImage = ({route, navigation }) => {

  const {title='', link=''}=  route.params;
  const theme = useTheme();


  return (
    <View style={{backgroundColor:'#fff',flex:1}}>
       <View style={styles.appBar}>
        <TouchableOpacity  onPress={()=>{ navigation.goBack()}} style={{ flexDirection:'row', alignItems :'center',}}>
            <Text style={styles.appBarText}> <Icon name={'chevron-left'} style={{fontSize: 16,color:theme.colors.backgroundPrimary}}/>{' '}</Text>
            <Text style={styles.appBarText}> {title}</Text>
        </TouchableOpacity>
        
        <FontAwesome5Icon onPress={() => Linking.openURL(link)} name="download" size={15} color={theme.colors.backgroundPrimary} style={{marginRight:15}} />
      </View>
      {
        link ?
        <View
            style={{
                flex:1
            }}
        >
          {link.includes('pdf') ? (
            <Pdf
              trustAllCerts={false}
              source={{
                  uri: link,
              }}
              style={styles.pdf}
              renderActivityIndicator={(progress)=>(
                <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                  <Text style={[styles.appBarText,{fontSize:17}]}> {(progress*100).toFixed(0)}%  loading</Text>
                </View>
              )}
            />
          ) : (
            <ImageView
              images={[{uri:link}]}
              imageIndex={0}
              visible={true}
              onRequestClose={() => navigation.goBack()}
            />
          )}
        </View>
        :
        <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
          <Text style={{textAlign:'center', fontSize:14, color:'#000'}}>something went wrong....</Text>
        </View>
      }
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
    fontSize:15
  },
  appBar:{
    fontSize: '.9rem',
    paddingTop: Platform.OS === 'ios' ?vh(4.5) : StatusBar.currentHeight,
    textAlign: 'left',
    flexDirection:'row',
    alignItems :'center',
    justifyContent:'space-between'
  },
  pdf:{
    flex: 1,
    height: '100%',
    width: '100%'
  },
})

export default PdfImage;