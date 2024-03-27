import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, TouchableWithoutFeedback, StatusBar } from 'react-native';
import { Modal, Portal, Button, Provider } from 'react-native-paper';
import { vh, vw } from "react-native-css-vh-vw";
import Feather from 'react-native-vector-icons/Feather';
import { useTheme } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';

const Dropdown = ({ options, onSelect, selectedOption, title = '' }) => {
  const [isVisible, setIsVisible] = useState(false)
  const handleSelectOption = (option) => {
    onSelect(option);
    setIsVisible(false);
  };

  const theme = useTheme();

  return (
    <View style={[styles.container]}>
      <TouchableOpacity
        style={{ backgroundColor: 'white' }}
        onPress={() => setIsVisible(!isVisible)}
      >
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            columnGap: 10,
            alignItems: 'center',
            borderWidth: 1,
            borderColor: theme.colors.border,
            width: '100%',
            borderRadius: 5,
            padding: 10,
            paddingVertical: 6,
            justifyContent: 'space-between',
            height: 40,
            backgroundColor: 'white'
          }}
        >
          <Text
            style={{
              color: theme.colors.data, fontSize: 16, fontFamily: 'Nunito Bold'
            }}
          >
            {selectedOption[0]?.label}
          </Text>
          {
            isVisible ?
              <Feather name="chevron-up" color={'#848484'} size={18} />
              :
              <Feather name="chevron-down" color={'#848484'} size={18} />
          }
        </View>
      </TouchableOpacity>

      <Portal>
        <Modal
          visible={isVisible}
          onDismiss={() => setIsVisible(false)}
          contentContainerStyle={{
            backgroundColor: 'transparent',
          }}
        >
          <Animatable.View
            animation="slideInUp"
            easing='ease-out'
            style={styles.modalContainer}
          >
            <TouchableWithoutFeedback onPress={() => setIsVisible(false)}>
              <View style={{ flex: 1 }} />
            </TouchableWithoutFeedback>
            <View style={styles.content}>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: vw(100) - 30,
                  marginVertical: 10
                }}
              >
                <Text
                  style={{
                    color: theme.colors.data, fontFamily: 'Nunito Bold', fontSize: 16
                  }}
                >
                  {title}
                </Text>
                <TouchableOpacity onPress={() => setIsVisible(false)} style={styles.closeButton}>
                  <Feather name="x" color={'#000'} size={25} />
                </TouchableOpacity>
              </View>
              <FlatList
                data={options}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => handleSelectOption([item])} style={{ ...styles.option, borderBottomColor: theme.colors.border }}>
                    <Text style={{ color: theme.colors.data, fontSize: 16, fontFamily: 'Nunito Medium' }}>{item.label}</Text>
                    {selectedOption[0].value === item.value ? <Feather name="check" color={'green'} size={18} /> : null}
                  </TouchableOpacity>
                )}
                keyExtractor={(item) => item.value}
              />
            </View>
          </Animatable.View>
        </Modal>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  dropdownButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: 'black',
  },
  modalContainer: {
    height: vh(100),
    justifyContent: 'flex-end',
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
    borderBottomWidth: 0,
    maxHeight: vh(80),
  },
  option: {
    padding: 15,
    borderBottomWidth: 1,
    width: vw(100),
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  closeButton: {
    marginTop: 15,
    borderRadius: 50,
  },
});

export default Dropdown;
