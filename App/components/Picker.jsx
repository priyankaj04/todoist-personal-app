import React, {useState} from 'react'
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { Dropdown as ReactDropdown } from 'react-native-element-dropdown';

function Picker({
  style,
  title,
  theme,
  data,
  value=null,
  setValue,
  placeholder,
  renderLeftIcon=null,
  valueFiled='value',
  labelFiled='label'
}) {

  const [isFocus, setIsFocus] = useState(false);

  return (
    <View style={style}>
      <Text style={[theme.fonts.titleSmall, {color:'#000'}]}>
        {title}
      </Text>
      <View
        style={{
          ...styles.row,
          justifyContent:'space-between',
          alignItems:'flex-start',
          marginTop:10,
          columnGap: 20
        }}
      >
        <ReactDropdown
          style={[styles.dropdown, isFocus && { borderColor: '#0a45a4' }]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          itemTextStyle={styles.itemTextStyle}
          itemContainerStyle={styles.itemContainerStyle}
          data={data}
          maxHeight={300}
          labelField={labelFiled}
          valueField={valueFiled}
          placeholder={!isFocus ? placeholder : ''}
          searchPlaceholder="Search..."
          value={value}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={item => {
            setValue(item.value);
            setIsFocus(false);
          }}
          renderLeftIcon={() => renderLeftIcon}
        />
      </View>
    </View>
  )
}

export default Picker;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap:5
  },
  //! Dropdown styles
  dropdown: {
    color: '#000',
    borderRadius:5,
    paddingHorizontal:10,
    flex: 1,
    borderWidth: 1,
    paddingVertical: 1.5
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
    color: '#000'
  },
  placeholderStyle: {
    fontSize: 16,
    color: '#808080'
  },
  selectedTextStyle: {
    fontSize: 16,
    color: '#000'
  },
  iconStyle: {
    width: 20,
    height: 20,
    color: '#000'
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    color: '#000'
  },
  itemTextStyle: {
    fontSize: 14,
    color: '#000',
  },
  selectedStyle: {
    fontSize: 14,
    color: '#000'
  },
  itemContainerStyle: {
    borderBottomWidth: 1,
    borderColor: '#cfcfcf',
  }
  //! Dropdown styles
});