import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, LayoutAnimation, UIManager, Platform } from 'react-native';

import Feather from 'react-native-vector-icons/Feather';

// Enable layout animations on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const AccordionItem = ({ title, Comp, id, expanded, setExpanded, componentText }) => {

  const toggleAccordion = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(id === expanded ? -1 : id);
  };

  return (
    <View style={styles.accordionItem}>
      <TouchableOpacity onPress={toggleAccordion}>
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          { 
            expanded === id ?
            <Feather name="chevron-up" color={'#000'} size={18} />
            :
            <Feather name="chevron-down" color={'#000'} size={18} />
          }
        </View>
        { ( expanded != id && componentText ) &&
          <View
            style={{
              margin: 10,
              padding: 10,
              backgroundColor: '#eeffee',
              borderRadius: 6,
              borderWidth: 1,
              borderColor: '#0b670b',
            }}
          >
            <Text style={{...styles.title, fontWeight:400, color: '#0b670b',}}>{componentText}</Text>
          </View>
        }
      </TouchableOpacity>

      { expanded === id && (
        <Comp/>
      )}
    </View>
  );
};

const Accordion = ({components, titles,  componentText}) => {
  const [expanded, setExpanded] = useState(0);

  return (
    <View style={styles.container}>
      {
        components.map((comp,i)=>
          <AccordionItem
            key={i}
            Comp={comp}
            title={titles[i]} 
            id={i} 
            componentText={componentText?.[i]}
            expanded={expanded}
            setExpanded={setExpanded}
          />
        )
      }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
  },
  accordionItem: {
    borderWidth: 1,
    borderColor: '#d6d6d6',
    marginBottom: 12,
    overflow: 'hidden',
    borderRadius: 5
  },
  header: {
    padding: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    color:'#000'
  },
  content: {
    padding: 10,
  },
});

export default Accordion;
