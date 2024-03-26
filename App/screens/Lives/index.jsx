import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    StatusBar,
    TouchableOpacity,
    ScrollView,
    Dimensions,
    ActivityIndicator,
    TextInput,
    Linking
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as Animatable from 'react-native-animatable';
import { useNavigation, Link } from '@react-navigation/native';
import { loginActions, valuesActions, myDispatch, mySelector } from '../../redux';
import assets from '../../assets';
import { getService, API_ROUTES, stringInterpolater, getTokenService } from '../../server';
import { ProgressChart } from "react-native-chart-kit";
import jwtDecode from 'jwt-decode';
const { width, height } = Dimensions.get('window');
import { getYears, getCapitalLetter, getName, getMobile } from '../../utils';

const Lives = ({ route }) => {
    const theme = useTheme();
    const navigation = useNavigation();
    const dispatch = myDispatch();
    const [loading, setLoading] = useState(true);
    const baseUrl = mySelector(state => state.Login.value.baseUrl);
    const corporatedetials = mySelector(state => state.Login.value.corporateDetails);
    const [patientdetails, setPatientDetails] = useState([])
    const [search, setSearch] = useState('');
    const [tab, setTab] = useState('employee');
    const [employees, setEmployees] = useState([])
    const [dependents, setDependents] = useState([])

    useEffect(() => {
        setLoading(true);
        if (Object.keys(corporatedetials)?.length > 0) {
            let gmcPolicies = corporatedetials?.policytype?.filter(policy => policy?.startsWith(route.params.policytype));
            if (gmcPolicies) {
                getService(baseUrl, stringInterpolater(API_ROUTES.GET_ALL_PATIENTS_BY_INSURANCE, { cpolid: gmcPolicies[0] }))
                    .then((res) => {
                        if (res.status === 1) {
                            console.log("res.data", res.data.patients)
                            setPatientDetails(res.data.patients)
                            setEmployees(res.data.patients?.filter((item) => item.relationship === 'self'))
                            setDependents(res.data.patients?.filter((item) => item.relationship !== 'self'))
                        } else {
                            dispatch(valuesActions.statusNot1(res?.msg));
                        }
                        setLoading(false);
                    }).catch((error) => {
                        setLoading(false);
                        dispatch(valuesActions.error({ error: `Error in Get NWL Details ${error}` }));
                    })
            }
        }
    }, [])

    const handleViewTPA = async (url) => {
        await Linking.openURL(url)
    };

    const handleSearch = (query) => {
        query = query.toLowerCase();
        if (query) {
            setEmployees(patientdetails?.filter((item) => item.relationship === 'self'))
            setDependents(patientdetails?.filter((item) => item.relationship !== 'self'))
        }

        if (tab === 'employee') {
            const list = patientdetails?.filter((item) => item.relationship === 'self')
            return setEmployees(list.filter(employee => {
                const fullname = employee.firstname.toLowerCase() + ' ' + employee.lastname.toLowerCase();
                return fullname.includes(query) || // Search by firstname + lastname
                    employee.mobile.includes(query) || // Search by mobile number
                    employee.employeeid.toLowerCase().includes(query); // Search by employee id
            })
            )
        } else if (tab !== 'employee') {
            const list = patientdetails?.filter((item) => item.relationship !== 'self')
            return setDependents(list.filter(employee => {
                const fullname = employee.firstname.toLowerCase() + ' ' + employee.lastname.toLowerCase();
                return fullname.includes(query) || // Search by firstname + lastname
                    employee.mobile.includes(query) || // Search by mobile number
                    employee.employeeid.toLowerCase().includes(query); // Search by employee id
            })
            )
        }



    }

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: 'black' }}>Please wait...</Text>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
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
                > {route.params.policytype} Lives List
                </Text>
            </View>
            <View>
                <View style={{
                    backgroundColor: '#eee',
                    margin: 10,
                    marginTop: 20,
                    borderRadius: 5,
                    height: 40,
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 5
                }}>
                    <TouchableOpacity style={{ flex: 1, padding: 5, marginLeft: 10, borderRadius: 5, backgroundColor: tab === 'employee' ? 'white' : '#eee' }} onPress={() => setTab('employee')}>
                        <Text style={{ textAlign: 'center', fontFamily: 'Nunito Bold', color: tab === 'employee' ? theme.colors.alpha : theme.colors.data }}>Employees</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flex: 1, padding: 5, marginRight: 10, borderRadius: 5, backgroundColor: tab === 'dependent' ? 'white' : '#eee' }} onPress={() => setTab('dependent')}>
                        <Text style={{ textAlign: 'center', fontFamily: 'Nunito Bold', color: tab === 'dependent' ? theme.colors.alpha : theme.colors.data }}>Dependents</Text>
                    </TouchableOpacity>

                </View>
                <View style={{
                    backgroundColor: theme.colors.border,
                    margin: 10,
                    borderRadius: 10,
                    height: 40,
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center'
                }}>
                    <Ionicons
                        name="search"
                        color='gray'
                        style={{ paddingHorizontal: 10 }}
                        size={20}
                    />
                    <TextInput
                        placeholder="Search By Name/Mobile/Id"
                        placeholderTextColor="#666666"
                        style={{
                            fontFamily: 'Nunito Regular',
                            fontSize: 16,
                            color: theme.colors.data,
                            flex: 1,
                            backgroundColor: 'white',
                            paddingHorizontal: 10,
                            height: '100%',
                            borderWidth: 1,
                            borderColor: theme.colors.border,
                            borderBottomRightRadius: 10,
                            borderTopRightRadius: 10,
                        }}
                        underlineColorAndroid="transparent"
                        importantForAutofill="noExcludeDescendants"
                        autoCapitalize="none"
                        value={search}
                        onChangeText={(val) => { setSearch(val); handleSearch(val) }}
                    />
                </View>
                {
                    tab === 'employee' ?
                        employees && employees.length > 0 ? employees?.map((item, index) =>
                            <View key={index} style={{ width: '100%', borderRadius: 15, borderWidth: 1, borderColor: theme.colors.border, padding: 10, marginTop: 8, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', flex: 1 }} >
                                <View style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'column' }}>
                                    <Text style={{ color: theme.colors.data, fontSize: 16, fontFamily: 'Nunito Bold' }}>{getName(item.firstname, item.lastname)}</Text>
                                    <Text style={{ color: theme.colors.data, fontSize: 14, fontFamily: 'Nunito Medium' }}>{getCapitalLetter(item.gender) + ', ' + getYears(item.dob) + 'y'}</Text>
                                    <Text style={{ color: theme.colors.data, fontSize: 14, fontFamily: 'Nunito Medium' }}>{getCapitalLetter(item.relationship)}</Text>
                                    <Text style={{ color: theme.colors.data, fontSize: 14, fontFamily: 'Nunito Medium' }}>{getMobile(item.mobile)}</Text>
                                </View>
                                <View style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'column', gap: 5 }}>
                                    <Text style={{ color: theme.colors.data, fontSize: 14, fontFamily: 'Nunito Bold', textAlign: 'center' }}>{item.employeeid}</Text>
                                    <TouchableOpacity onPress={() => handleViewTPA(item.policyimageurl)} style={{ backgroundColor: '#4576DC', width: 95, borderRadius: 5, height: 35, alignItems: 'center', display: 'flex', justifyContent: 'center' }}>
                                        <Text style={{ textAlign: 'center', fontSize: 14, fontFamily: 'Nunito Bold', color: 'white' }}>View TPA</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{ borderColor: '#4576DC', borderWidth: 1, width: 95, borderRadius: 5, height: 35, alignItems: 'center', display: 'flex', justifyContent: 'center' }}>
                                        <Text style={{ textAlign: 'center', fontSize: 14, fontFamily: 'Nunito Bold', color: '#4576DC' }}>Send TPA</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ) : (<View style={{ flex: 1, justifyContent: 'center', display: 'flex', alignItems: 'center', height: 450, fontSize: 16 }}>
                            <Text style={{ color: theme.colors.data, fontSize: 14, fontFamily: 'Nunito Medium' }}>No Data...</Text>
                        </View>)
                        :
                        dependents && dependents.length > 0 ? dependents?.map((item, index) =>
                            <View key={index} style={{ width: '100%', borderRadius: 15, borderWidth: 1, borderColor: theme.colors.border, padding: 10, marginTop: 8, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', flex: 1 }} >
                                <View style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'column' }}>
                                    <Text style={{ color: theme.colors.data, fontSize: 16, fontFamily: 'Nunito Bold' }}>{getName(item.firstname, item.lastname)}</Text>
                                    <Text style={{ color: theme.colors.data, fontSize: 14, fontFamily: 'Nunito Medium' }}>{getCapitalLetter(item.gender) + ', ' + getYears(item.dob) + 'y'}</Text>
                                    <Text style={{ color: theme.colors.data, fontSize: 14, fontFamily: 'Nunito Medium' }}>{getCapitalLetter(item.relationship)}</Text>
                                    <Text style={{ color: theme.colors.data, fontSize: 14, fontFamily: 'Nunito Medium' }}>{getMobile(item.mobile)}</Text>
                                </View>
                                <View style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'column', gap: 5 }}>
                                    <Text style={{ color: theme.colors.data, fontSize: 14, fontFamily: 'Nunito Bold', textAlign: 'center' }}>{item.employeeid}</Text>
                                    <TouchableOpacity onPress={() => handleViewTPA(item.policyimageurl)} style={{ backgroundColor: '#4576DC', width: 95, borderRadius: 5, height: 35, alignItems: 'center', display: 'flex', justifyContent: 'center' }}>
                                        <Text style={{ textAlign: 'center', fontSize: 14, fontFamily: 'Nunito Bold', color: 'white' }}>View TPA</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{ borderColor: '#4576DC', borderWidth: 1, width: 95, borderRadius: 5, height: 35, alignItems: 'center', display: 'flex', justifyContent: 'center' }}>
                                        <Text style={{ textAlign: 'center', fontSize: 14, fontFamily: 'Nunito Bold', color: '#4576DC' }}>Send TPA</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ) :
                            <View style={{ flex: 1, justifyContent: 'center', display: 'flex', alignItems: 'center', height: 450, fontSize: 16 }}>
                                <Text style={{ color: theme.colors.data, fontSize: 14, fontFamily: 'Nunito Medium' }}>No Data...</Text>
                            </View>
                }
            </View>
        </ScrollView>
    )
}

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
});

export default Lives