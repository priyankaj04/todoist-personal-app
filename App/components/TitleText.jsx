import {
  View,
  Text,
  TextInput
} from 'react-native';

const TitleText = ({title= '', text='', titleStyle={}, textStyle={}, style={}, theme, line}) => {

  return (
    <View
      style={style}
    >
      <Text 
        style={{
          fontSize: 13,
          color:'#000',
        }}
      >
        {title}
      </Text>
      <View
        style={{ 
          marginTop:8,
          borderWidth:1,
          borderRadius: 5,
          borderColor: '#9a9a9a',
          paddingHorizontal:7,
          paddingVertical:5,
          backgroundColor: '#fff',
          width: '100%'
        }}
      >
        <Text
          style={{
            color:'#3e3e3e',
            ...theme.fonts.titleSmall,
          }}
        >
          {text}
        </Text>
      </View>
    </View>
  );
};

export default TitleText;
