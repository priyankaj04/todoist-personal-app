import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text } from 'react-native';
import {
  useTheme
} from 'react-native-paper';

const SearchBar = ({
  defaultValue = '',
  value,
  placeholder = 'Search...',
  onSubmit,
  onChange,
  onFocus,
  onBlur,
  onCancel,
  showCancelButton = false,
  cancelText = 'Cancel',
  disabled = false,
}) => {
  const paperTheme = useTheme();

  const [searchValue, setSearchValue] = useState(value || defaultValue);

  const handleInputChange = (input) => {
    setSearchValue(input);
    onChange && onChange(input);
  };

  const handleCancel = () => {
    onCancel && onCancel(searchValue);
    setSearchValue('');
  };

  const handleBlur = () => {
    onBlur && onBlur();
  };

  const handleFocus = () => {
    onFocus && onFocus();
  };

  const handleSubmit = () => {
    onSubmit && onSubmit(searchValue);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={{...styles.input, color: paperTheme.colors.text}}
        placeholder={placeholder}
        value={searchValue}
        onChangeText={handleInputChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onSubmitEditing={handleSubmit}
        editable={!disabled}
        placeholderTextColor={paperTheme.colors.text}
      />
      {showCancelButton && (
        <TouchableOpacity  onPress={handleCancel}>
          <Text style={{...styles.title}}>{cancelText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    marginHorizontal:15
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#303030',
  },
});

export default SearchBar;
