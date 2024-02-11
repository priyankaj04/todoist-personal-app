import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import dayjs from 'dayjs';
import {useTheme} from '@react-navigation/native';

const CustomDatePicker = ({
  value,
  onChange,
  placeholder,
  minDate,
  maxDate,
  style,
  textStyle,
  placeholderStyle,
  ...restProps
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const theme = useTheme();

  const handleConfirm = (date) => {
    onChange(date);
    setIsVisible(false);
  };

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity onPress={() => setIsVisible(true)}>
        <Text style={[styles.textInput, { ...theme.fonts.titleSmall, color:theme.colors.text }, textStyle ]}>{value ? dayjs(value).format('DD-MMM-YYYY') : placeholder}</Text>
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={isVisible}
        mode="date"
        date={value ? new Date(value) : new Date()}
        onConfirm={handleConfirm}
        onCancel={() => setIsVisible(false)}
        minimumDate={minDate ? new Date(minDate) : undefined}
        maximumDate={maxDate ? new Date(maxDate) : undefined}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    paddingVertical: 6,
    color: '#000',
  },
});

export default CustomDatePicker;
