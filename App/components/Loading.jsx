import React from 'react';
import {
  ActivityIndicator,
  View,
  Text,
} from 'react-native';

const Loading = ({theme}) => {

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <ActivityIndicator color={theme.colors.text} size={30}  />
      <Text style={{color:theme.colors.text, ...theme.fonts.titleSmall, marginTop:10}}>Loading..</Text>
    </View>
  )
}

export default Loading