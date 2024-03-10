import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image } from 'react-native';
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
import AsyncStorage from '@react-native-async-storage/async-storage';

import assets from '../assets';

import { valuesActions, loginActions, mySelector } from '../redux';
import { getName } from '../utils';

export function DrawerContent(props) {

    const paperTheme = useTheme();
    const [active, setActive] = useState('home');

    const corporateDetails = mySelector(state => state.Login.value.corporateDetails);
    const cpVersion = mySelector(state => state.Login.value.cpVersion);

    const signOut = async () => {
        try {
            await AsyncStorage.removeItem('loginData');
            await AsyncStorage.removeItem('refreshToken');
            await AsyncStorage.removeItem('token');
            props.dispatch(loginActions.logOut());
        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        console.log("datassss", corporateDetails?.logourl)
    })

    return (
        <View style={{ flex: 1, backgroundColor: paperTheme.colors.alpha }}>
            <DrawerContentScrollView {...props}>
                <View style={[styles.drawerContent, styles.bottomBorder]}>
                    <View style={{ ...styles.userInfoSection, ...styles.bottomBorder, paddingVertical: 15 }}>
                        <View style={{ flexDirection: 'row', marginTop: 15 }}>
                            <Image
                                source={{ uri: corporateDetails?.logourl }}
                                style={{ width: 150, objectFit: 'contain', minHeight: 50, maxHeight: 150, backgroundColor:'white' }}
                            />
                        </View>
                        <Text style={{color:'white', fontFamily:'Nunito Bold'}}>{corporateDetails?.legalname}</Text>
                    </View>
                    <DrawerItem
                        icon={() => (
                            <Icon
                                name="home"
                                color={(active === 'home') ? paperTheme.colors.alpha : 'white'}
                                size={30}
                            />
                        )}
                        label="Home"
                        labelStyle={{ color: (active === 'home') ? paperTheme.colors.alpha : 'white', fontFamily: 'Nunito Bold', fontSize: 16 }}
                        onPress={() => { setActive('home') }}
                        style={{ backgroundColor: (active === 'home') ? 'white' : 'transparent' }}
                    />

                    <DrawerItem
                        icon={() => (
                            <Icon
                                name="basketball"
                                color={(active === 'physicalhealth') ? paperTheme.colors.alpha : 'white'}
                                size={30}
                            />
                        )}
                        label="Physical Health"
                        labelStyle={{ color: (active === 'physicalhealth') ? paperTheme.colors.alpha : 'white', fontFamily: 'Nunito Bold', fontSize: 16 }}
                        onPress={() => { setActive('physicalhealth') }}
                        style={{ backgroundColor: (active === 'physicalhealth') ? 'white' : 'transparent' }}
                    />

                    <DrawerItem
                        icon={() => (
                            <Icon
                                name="yoga"
                                color={(active === 'mentalhealth') ? paperTheme.colors.alpha : 'white'}
                                size={30}
                            />
                        )}
                        label="Mental Health"
                        labelStyle={{ color: (active === 'mentalhealth') ? paperTheme.colors.alpha : 'white', fontFamily: 'Nunito Bold', fontSize: 16 }}
                        onPress={() => { setActive('mentalhealth') }}
                        style={{ backgroundColor: (active === 'mentalhealth') ? 'white' : 'transparent' }}
                    />

                    <DrawerItem
                        icon={() => (
                            <Icon
                                name="plus-box"
                                color={(active === 'healthepisodes') ? paperTheme.colors.alpha : 'white'}
                                size={30}
                            />
                        )}
                        label="Health Episodes"
                        labelStyle={{ color: (active === 'healthepisodes') ? paperTheme.colors.alpha : 'white', fontFamily: 'Nunito Bold', fontSize: 16 }}
                        onPress={() => { setActive('healthepisodes') }}
                        style={{ backgroundColor: (active === 'healthepisodes') ? 'white' : 'transparent' }}
                    />
                    <DrawerItem
                        icon={() => (
                            <Icon
                                name="clipboard-plus"
                                color={(active === 'gtlinsurance') ? paperTheme.colors.alpha : 'white'}
                                size={30}
                            />
                        )}
                        label="GTL Insurace"
                        labelStyle={{ color: (active === 'gtlinsurance') ? paperTheme.colors.alpha : 'white', fontFamily: 'Nunito Bold', fontSize: 16 }}
                        onPress={() => { setActive('gtlinsurance') }}
                        style={{ backgroundColor: (active === 'gtlinsurance') ? 'white' : 'transparent' }}
                    />
                    <DrawerItem
                        icon={() => (
                            <Icon
                                name="shield-search"
                                color={(active === 'expiredpolicy') ? paperTheme.colors.alpha : 'white'}
                                size={30}
                            />
                        )}
                        label="Expired Policy"
                        labelStyle={{ color: (active === 'expiredpolicy') ? paperTheme.colors.alpha : 'white', fontFamily: 'Nunito Bold', fontSize: 16 }}
                        onPress={() => { setActive('expiredpolicy') }}
                        style={{ backgroundColor: (active === 'expiredpolicy') ? 'white' : 'transparent' }}
                    />
                </View>
                <Paragraph
                    style={{
                        textAlign: 'center',
                        marginTop: 10,
                        fontWeight: '500',
                        color: 'white',
                        fontFamily: 'Nunito Bold',
                        fontSize: 13
                    }}
                >App- 1  Cp- {cpVersion ?? 0}</Paragraph>
            </DrawerContentScrollView>
            {/* <Drawer.Section>
                <TouchableRipple onPress={() => {props.dispatch(valuesActions.setToggleTheme())}}>
                    <View style={styles.preference}>
                        <Text style={{color:paperTheme.colors.text, ...paperTheme.fonts.titleSmall}}>Dark Theme</Text>
                        <View pointerEvents="none">
                            <Switch value={paperTheme.dark}/>
                        </View>
                    </View>
                </TouchableRipple>
            </Drawer.Section> */}
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <Image source={assets.ImageBaseUrl('brandlogopi')} style={{ width: 150, height: 40, objectFit: 'contain' }} />
            </View>
            <TouchableRipple onPress={signOut} style={{ paddingVertical: 10, ...styles.topBorder }}>
                <View style={{ ...styles.preference, alignItems: 'center' }}>
                    <Text style={{ color: 'white', fontSize: 16, fontFamily: 'Nunito Bold' }}>Sign Out</Text>
                    <View pointerEvents="none">
                        <Icon name="exit-to-app" color='white' size={30} style={{ paddingRight: 10 }} />
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
    column: {
        marginTop: 20,
        flexDirection: 'column',
        justifyContent: 'center',
        rowGap: 10
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
    bottomBorder: {
        borderBottomWidth: 1,
        borderBottomColor: '#f2f5f9',
        borderStyle: 'solid',
    },
    topBorder: {
        borderTopWidth: 1,
        borderTopColor: '#f2f5f9',
        borderStyle: 'solid',
    }
});