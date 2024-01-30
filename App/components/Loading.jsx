import React from 'react';
import {
  ActivityIndicator,
  View
} from 'react-native';
import {
  useTheme,
  Avatar,
  Title,
  Caption,
  Paragraph,
  Drawer,
  Text,
  TouchableRipple,
  Switch
} from 'react-native-paper';

const Loading = () => {
  const paperTheme = useTheme();

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <ActivityIndicator color={paperTheme.colors.text} size={30}  />
      <Text style={{color:paperTheme.colors.text, ...paperTheme.fonts.titleSmall, marginTop:10}}>Loading..</Text>
    </View>
  )
}

export default Loading