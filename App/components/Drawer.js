import React from 'react';
import { View, StyleSheet } from 'react-native';
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
import {
    DrawerContentScrollView,
    DrawerItem
} from '@react-navigation/drawer';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-community/async-storage';

import assets from '../assets';

import { valuesActions, loginActions, mySelector } from '../redux';
import { getName } from '../utils';

export function DrawerContent(props) {

    const paperTheme = useTheme();

    const cmDetails = mySelector(state=>state.Login.value.cmDetails);

    const signOut = async() => { 
        try {
            await AsyncStorage.removeItem('email');
            await AsyncStorage.removeItem('refreshToken');
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('type');

            props.dispatch(loginActions.logOut());
        } catch(e) {
            console.log(e);
        }
    }

    return(
        <View style={{flex:1}}>
            <DrawerContentScrollView {...props}>
                <View style={styles.drawerContent}>
                    <View style={styles.userInfoSection}>
                        <View style={{flexDirection:'row',marginTop: 15}}>
                            <Avatar.Image 
                                source={ cmDetails?.profilepic ? {uri: cmDetails?.profilepic } : assets.ImageBaseUrl('brain_cons')}
                                size={50}
                            />
                            <View style={{marginLeft:15, flexDirection:'column'}}>
                                <Title style={styles.title}>{ getName(cmDetails?.name) }</Title>
                                <Caption style={styles.caption}>{cmDetails?.email}</Caption>
                            </View>
                        </View>

                        <View style={styles.row}>
                            <View style={styles.section}>
                                <Caption style={styles.caption}>Ph- </Caption>
                                <Paragraph style={[styles.paragraph, styles.caption]}>{cmDetails?.mobile}</Paragraph>
                            </View>
                            <View style={styles.section}>
                                <Caption style={styles.caption}>Ut- </Caption>
                                <Paragraph style={[styles.paragraph, styles.caption]}>{ getName(cmDetails?.type) }</Paragraph>
                            </View>
                        </View>
                    </View>

                    <Drawer.Section style={styles.drawerSection}>
                        <DrawerItem 
                            icon={({color, size}) => (
                                <Icon 
                                    name="account-outline" 
                                    color={color}
                                    size={size}
                                />
                            )}
                            label="Profile"
                            onPress={() => {props.navigation.navigate('ProfileEdit')}}
                        />
                    </Drawer.Section>

                    <Drawer.Section>
                        <DrawerItem 
                            icon={({color, size}) => (
                                <Icon 
                                    name="account-check-outline" 
                                    color={color}
                                    size={size}
                                />
                            )}
                            label="All Patients"
                            // onPress={() => {props.navigation.navigate('Profile')}}
                        />
                        <DrawerItem 
                            icon={({color, size}) => (
                                <Icon 
                                    name="bookmark-outline" 
                                    color={color}
                                    size={size}
                                />
                            )}
                            label="Care Stories"
                            // onPress={() => {props.navigation.navigate('BookmarkScreen')}}
                        />
                        <DrawerItem 
                            icon={({color, size}) => (
                                <Icon 
                                    name="account-settings-outline" 
                                    color={color}
                                    size={size}
                                />
                            )}
                            label="Settings"
                            // onPress={() => {props.navigation.navigate('SettingScreen')}}
                        />
                        <DrawerItem 
                            icon={({color, size}) => (
                                <Icon 
                                    name="account-check-outline" 
                                    color={color}
                                    size={size}
                                />
                            )}
                            label="Support"
                            // onPress={() => {props.navigation.navigate('SupportScreen')}}
                        />
                    </Drawer.Section>
                </View>
            </DrawerContentScrollView>
            <Drawer.Section>
                <TouchableRipple onPress={() => {props.dispatch(valuesActions.setToggleTheme())}}>
                    <View style={styles.preference}>
                        <Text style={{color:paperTheme.colors.text, ...paperTheme.fonts.titleSmall}}>Dark Theme</Text>
                        <View pointerEvents="none">
                            <Switch value={paperTheme.dark}/>
                        </View>
                    </View>
                </TouchableRipple>
            </Drawer.Section>
            <TouchableRipple onPress={signOut} style={{ paddingVertical:10}}>
                <View style={styles.preference}>
                    <Text style={{color:paperTheme.colors.text, ...paperTheme.fonts.titleSmall}}>Sign Out</Text>
                    <View pointerEvents="none">
                        <Icon name="exit-to-app" color={paperTheme.colors.text} size={20} style={{ paddingRight:10}}/>
                    </View>
                </View>
            </TouchableRipple>
        </View>
    );
}

const styles = StyleSheet.create({
    drawerContent: {
      flex: 1,
    },
    userInfoSection: {
      paddingLeft: 20,
    },
    title: {
      fontSize: 16,
      marginTop: 3,
      fontWeight: 'bold',
    },
    caption: {
      fontSize: 14,
      lineHeight: 14,
    },
    row: {
      marginTop: 20,
      flexDirection: 'row',
      alignItems: 'center',
    },
    section: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 15,
    },
    paragraph: {
      fontWeight: 'bold',
      marginRight: 3,
    },
    drawerSection: {
      marginTop: 15,
    },
    preference: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 12,
      paddingHorizontal: 16,
    },
  });