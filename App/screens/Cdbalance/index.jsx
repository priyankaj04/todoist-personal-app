import React, { useState, useEffect } from 'react';
import {
    View, Text, ScrollView, Image, TouchableOpacity, StatusBar, StyleSheet, ActivityIndicator
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { loginActions, valuesActions, myDispatch, mySelector } from '../../redux';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';
import { formatString } from '../../utils';
import { PieChart, ProgressChart } from "react-native-chart-kit";
import dayjs from "dayjs";
import { getService, API_ROUTES, stringInterpolater } from '../../server';

const Cdbalance = ({ route }) => {

    const dispatch = myDispatch();
    const navigation = useNavigation();
    const theme = useTheme();
    const corporateid = mySelector(state => state.Login.value.loginData.corporateid);
    const nwlDetails = mySelector(state => state.Login.value.nwlDetails);
    const baseUrl = mySelector(state => state.Login.value.baseUrl);
    const [claims, setClaims] = useState('ongoing');
    const [cdbalance, setCdbalance] = useState([])
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        console.log("stringInterpolater(API_ROUTES.GET_CD_STATEMENT, { cpolid: route.params.cpolid })", stringInterpolater(API_ROUTES.GET_CD_STATEMENT, { cpolid: route.params.cpolid }))
        getService(baseUrl, stringInterpolater(API_ROUTES.GET_CD_STATEMENT, { cpolid: route.params.cpolid }))
            .then((res) => {
                if (res.status === 1) {
                    console.log("res.data", res.data)
                    setCdbalance(res.data);
                    setLoading(false);
                } else {
                    dispatch(valuesActions.statusNot1(res?.msg));
                    setLoading(false);
                }
            }).catch((error) => {
                setLoading(false);
                dispatch(valuesActions.error({ error: `Error in Get CD Statement details ${error}` }));
            })
    }, [])


    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: 'black' }}>Please wait...</Text>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <View style={{ ...styles.container }}>
            <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
            <View style={styles.header}>
                <Ionicons
                    name="arrow-back"
                    size={27}
                    color={theme.colors.data}
                    onPress={() => navigation.goBack()}
                />
                <Text
                    style={{
                        color: theme.colors.data,
                        ...theme.fonts.titleMedium,
                        paddingLeft: 10,
                        fontFamily: 'Nunito Bold'
                    }}
                > {route.params.policytype} CD Statment
                </Text>
            </View>
            <ScrollView style={{ margin: 10 }}>
                {
                    (cdbalance && cdbalance?.length > 0) ?
                        <View style={{ display: 'flex', flex: 1, justifyContent: 'space-between', padding: 10, flexDirection: 'row' }}>
                            <Text style={{ color: theme.colors.data, fontFamily: 'Nunito Medium', fontSize: 16 }}>Transactions</Text>
                            <Text style={{ color: theme.colors.blue600, fontFamily: 'Nunito Bold', fontSize: 18 }}>Bal Amt: {cdbalance[cdbalance.length - 1]?.cdbalanceamount?.toLocaleString('en-IN')}</Text>
                        </View> :
                        <View style={{ display: 'flex', flex: 1, justifyContent: 'space-between', padding: 10, flexDirection: 'row', height: 400 }}>
                            <Text style={{ color: theme.colors.data, fontFamily: 'Nunito Medium', fontSize: 16 }}> No Transactions</Text>
                        </View>
                }
                {
                    (cdbalance && cdbalance?.length > 0) &&
                    cdbalance.map((cd, index) =>
                        <View key={index} style={{ display: 'flex', flex: 1, justifyContent: 'space-between', padding: 15, flexDirection: 'row', margin: 5, borderRadius: 5, borderWidth: 1, borderColor: theme.colors.border, alignItems: 'center' }}>
                            <View style={{ alignItems: 'center', display: 'flex', flexDirection: 'row', gap: 10 }}>
                                <View>
                                    <View style={{ width: 40, height: 40, backgroundColor: theme.colors.blue600, borderRadius: 15, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        {cd.type === "credit" ? <Feather name='arrow-down-left' color='white' size={30} /> : <Feather name='arrow-up-right' color='white' size={30} />}
                                    </View>
                                    <Text style={{ color: theme.colors.subtitle, fontFamily: 'Nunito Medium', fontSize: 12 }}>{cd?.isverified ? 'Verified': 'Unverified'}</Text>
                                </View>
                                <View style={{ alignItems: 'center' }}>
                                    <Text style={{ color: theme.colors.data, fontFamily: 'Nunito Medium', fontSize: 16, textAlign: 'left' }}>{cd.group == 'deposit' ? 'CD Deposit' : 'Endorsement'}</Text>
                                    <Text style={{ color: theme.colors.subtitle, fontFamily: 'Nunito Medium', fontSize: 14, textAlign: 'left' }}>{cd.txndate ? dayjs(cd.txndate).format('DD-MMM-YYYY') : cd.txndate}</Text>
                                </View>
                            </View>
                            <View style={{ alignItems: 'center' }}>
                                <Text style={{
                                    color: cd.type === 'credit' ? '#15803d' : theme.colors.data, fontFamily: cd.type === 'credit' ? 'Nunito Bold' : 'Nunito Medium', fontSize: 16, textAlign: 'right' }}>{cd.type === 'credit' ? 'Credit' :
                                    `${cd?.type?.charAt(0)?.toUpperCase() + cd?.type?.slice(1)?.toLowerCase()}`
                                }: {cd?.amount?.toLocaleString('en-IN')}</Text>
                                <Text style={{ color: theme.colors.subtitle, fontFamily: 'Nunito Bold', fontSize: 12, textAlign: 'right' }}>Bal Amt: {cd.cdbalanceamount?.toLocaleString('en-IN')}</Text>
                            </View>
                        </View>
                    )

                }

                <ScrollView>
                </ScrollView>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 10,
        paddingTop: StatusBar.currentHeight
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    title: {
        fontSize: 18,
        marginTop: 3,
        fontWeight: '600',
    },
    card: {
        minHeight: 100,
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#f2f5f9',
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

export default Cdbalance;
