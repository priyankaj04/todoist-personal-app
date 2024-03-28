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
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import assets from '../assets';
import { valuesActions, loginActions, mySelector } from '../redux';
import { getName } from '../utils';

export function DrawerContent(props) {

    const paperTheme = useTheme();
    const [active, setActive] = useState('home');

    const corporateDetails = mySelector(state => state.Login.value.corporateDetails);
    const cpVersion = mySelector(state => state.Login.value.cpVersion);
    const loginData = mySelector(state => state.Login.value.loginData);

    useEffect(() => {
        console.log("setLoginData", loginData)
    }, [loginData])

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

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <DrawerContentScrollView {...props}>
                <View style={[styles.drawerContent]}>
                    <View style={{ paddingVertical: 15, backgroundColor: paperTheme.colors.blue600, margin: 15, display: 'flex', alignItems: 'center', borderRadius: 5 }}>
                        <View style={{ flexDirection: 'row', backgroundColor: 'white', padding: 5, borderRadius: 5 }}>
                            <Image
                                source={{ uri: corporateDetails?.logourl }}
                                style={{ width: 150, objectFit: 'contain', minHeight: 50, maxHeight: 150, }}
                            />
                        </View>
                        <Text style={{ color: 'white', fontFamily: 'Nunito Bold', marginTop: 15 }}>{corporateDetails?.legalname}</Text>
                        <Text style={{ color: 'white', fontFamily: 'Nunito Medium', marginTop: 15 }}>{loginData?.email}</Text>
                    </View>
                    {/*<DrawerItem
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
                        />*/}
                </View>
                <TouchableRipple onPress={signOut} style={{ paddingVertical: 5, borderWidth: 1, borderColor: paperTheme.colors.border, borderRadius: 5, margin: 15 }}>
                    <View style={{ ...styles.preference, alignItems: 'center' }}>
                        <View pointerEvents="none">
                            <MaterialIcons name="logout" color={paperTheme.colors.data} size={30} style={{ paddingRight: 10 }} />
                        </View>
                        <Text style={{ color: paperTheme.colors.data, fontSize: 16, fontFamily: 'Nunito Bold' }}>Log Out</Text>
                    </View>
                </TouchableRipple>
                <Paragraph
                    style={{
                        textAlign: 'center',
                        marginTop: 10,
                        fontWeight: '500',
                        color: 'white',
                        fontFamily: 'Nunito Bold',
                        fontSize: 13
                    }}
                >App-1  Cp- {cpVersion ?? 0}</Paragraph>
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
            <View style={{ display: 'flex',  alignItems: 'center', justifyContent: 'center', backgroundColor: paperTheme.colors.blue600, height: 100 }}>
                <Image source={assets.ImageBaseUrl('brandlogopi')} style={{ width: 150, height: 40, objectFit: 'contain' }} />
                <Text style={{color: 'white', fontFamily: 'Nunito Medium'}}>Version 1</Text>
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    drawerContent: {
        flex: 1,
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
        gap: 15,
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    topBorder: {
        borderTopWidth: 1,
        borderTopColor: '#f2f5f9',
        borderStyle: 'solid',
    }
});