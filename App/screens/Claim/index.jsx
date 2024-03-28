import React, { useState, useEffect } from 'react';
import {
    View, Text, ScrollView, Image, TouchableOpacity, StatusBar, StyleSheet
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { loginActions, valuesActions, myDispatch, mySelector } from '../../redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';
import { formatString } from '../../utils';
import { PieChart, ProgressChart } from "react-native-chart-kit";
import dayjs from "dayjs";

const Claim = ({ route }) => {

    const dispatch = myDispatch();
    const navigation = useNavigation();
    const theme = useTheme();
    const corporateid = mySelector(state => state.Login.value.loginData.corporateid);
    const nwlDetails = mySelector(state => state.Login.value.nwlDetails);
    const [claims, setClaims] = useState('ongoing');
    ///const [nwlDetails, setNwlDetails] = useState({})
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // setLoading(true);
        // getService(baseUrl, stringInterpolater(API_ROUTES.GET_NWL_DETAILS, { corporateid: corporateid, policyid: route.params.cpolid }))
        //     .then((res) => {
        //         if (res.status === 1) {
        //             setNwlDetails(res);
        //             setLoading(false);
        //         } else {
        //             dispatch(valuesActions.statusNot1(res?.msg));
        //             setLoading(false);
        //         }
        //     }).catch((error) => {
        //         setLoading(false);
        //         dispatch(valuesActions.error({ error: `Error in Get NWL Details ${error}` }));
        //     })
    }, [])

    const getOngoingClaims = () => {
        const ongoingClaims = nwlDetails?.ongoingClaims?.ongoingClaims;
        const value = ongoingClaims?.map((item) => {
            let val = [];
            val.push([item.employeename, item.claimstatus, item.dateofclaim])
            val.push(item.claimraised)
            val.push(item.claimtype)
            val.push(item.selecteddiagnosis)
            val.push(item.comments)
            return val;
        })
        return value;
    }

    const getRejectedClaims = () => {
        const rejectedClaims = nwlDetails?.rejectedClaims?.rejectedClaims;
        const value = rejectedClaims?.map((item) => {
            let val = [];
            val.push([item.employeename, item.claimstatus, item.dateofclaim])
            val.push(item.claimraised)
            val.push(item.claimtype)
            val.push(item.selecteddiagnosis)
            val.push(item.comments)
            return val;
        })
        return value;
    }

    const data = [
        {
            name: " 0-18",
            population: nwlDetails?.claimsAccordingAge?.filter((item) => item.age === '0-18')[0]?.count,
            color: theme.colors.blue900
        },
        {
            name: " 18-30",
            population: nwlDetails?.claimsAccordingAge?.filter((item) => item.age === '18-30')[0]?.count,
            color: theme.colors.yellow,
        },
        {
            name: " 30-40",
            population: nwlDetails?.claimsAccordingAge?.filter((item) => item.age === '30-40')[0]?.count,
            color: theme.colors.blue600,
        },
        {
            name: " 40-50",
            population: nwlDetails?.claimsAccordingAge?.filter((item) => item.age === '40-50')[0]?.count,
            color: theme.colors.blue400,
        },
        {
            name: " 50-60",
            population: nwlDetails?.claimsAccordingAge?.filter((item) => item.age === '50-60')[0]?.count,
            color: theme.colors.sky,
        },
        {
            name: " 60-70",
            population: nwlDetails?.claimsAccordingAge?.filter((item) => item.age === '60-70')[0]?.count,
            color: theme.colors.blue200,
        },
        {
            name: " 70+",
            population: nwlDetails?.claimsAccordingAge?.filter((item) => item.age === '70+')[0]?.count,
            color: '#fef08a',
        }
    ];

    const relationshipdata = [
        {
            name: "Child",
            population: parseInt(nwlDetails?.relationshipwiseClaims?.filter((item) => item.relationship === 'child')[0]?.claim_count),
            color: theme.colors.blue900
        },
        {
            name: "Self",
            population: parseInt(nwlDetails?.relationshipwiseClaims?.filter((item) => item.relationship === 'self')[0]?.claim_count),
            color: theme.colors.yellow,
        },
        {
            name: "Spouse",
            population: parseInt(nwlDetails?.relationshipwiseClaims?.filter((item) => item.relationship === 'spouse')[0]?.claim_count),
            color: theme.colors.blue600,
        },
        {
            name: " Others",
            population: parseInt(nwlDetails?.relationshipwiseClaims?.filter((item) => (!(item.relationship === 'child') && !(item.relationship === 'self') && !(item.relationship === 'spouse')))[0]?.claim_count),
            color: theme.colors.blue400,
        }
    ];

    const handleTotalAgeAmount = () => {
        let addition = 0;
        addition += nwlDetails?.claimsAmountAccordingToAge?.['0-18'] ?? 0;
        addition += nwlDetails?.claimsAmountAccordingToAge?.['18-30'] ?? 0;
        addition += nwlDetails?.claimsAmountAccordingToAge?.['30-40'] ?? 0;
        addition += nwlDetails?.claimsAmountAccordingToAge?.['40-50'] ?? 0;
        addition += nwlDetails?.claimsAmountAccordingToAge?.['50-60'] ?? 0;
        addition += nwlDetails?.claimsAmountAccordingToAge?.['60-70'] ?? 0;
        addition += nwlDetails?.claimsAmountAccordingToAge?.['70+'] ?? 0;
        return Number(addition).toLocaleString('en-IN');
    }

    const getDiagnosisClaims = () => {
        const diagnosisClaims = nwlDetails?.ipClaimsDiagnosis;
        const value = diagnosisClaims?.map((item) => {
            let val = [];
            val.push(item.selecteddiagnosis)
            val.push(item.totalclaimissued)
            val.push(item.claimcount)
            return val;
        })
        return value;
    }

    const getTop10Claims = () => {
        const top10Claims = nwlDetails?.topClaims;
        const value = top10Claims?.map((item) => {
            let val = [];
            val.push(item.employeename)
            val.push(item.claimissued)
            return val;
        })
        return value;
    }

    function processArrayData(data) {
        // console.log(data)
        let check = data.slice(0, 1);
        if (check !== "[") {
            return formatString(data)
        } else {
            let diagnosisWithString = JSON.parse(data)?.map((item) => formatString(item));
            let resultString = diagnosisWithString.join(', ');
            return resultString
        }
    }

    const totalClaimUtilization = () => {
        let value = 0;
        value = ((nwlDetails?.completedClaims?.totalClaimIssued + nwlDetails?.ongoingClaims?.totalClaimOngong) / nwlDetails?.totalPremiumPaid?.totalPremium) * 100
        return value;
    }

    const calculateTimeDurationofClaim = () => {
        let value = 0;
        const startedate = dayjs(nwlDetails?.policydetails?.[0]?.policystartedon)
        value = ((dayjs().diff(startedate, 'days')) / (dayjs().endOf('year').diff(dayjs().startOf('year'), 'day') + 1)) * 100
        return value;
    }

    function daysToMonthsAndDays() {
        const startedate = dayjs(nwlDetails?.policydetails?.[0]?.policystartedon)
        const totalDays = dayjs().diff(startedate, 'days')
        const currentDate = dayjs();
        const futureDate = currentDate.add(totalDays, 'day');

        const months = futureDate.diff(currentDate, 'month');
        const remainingDays = futureDate.diff(currentDate.add(months, 'month'), 'day');

        return {
            months,
            days: remainingDays
        };
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
                > {route.params.policytype} Claims Details
                </Text>
            </View>
            <ScrollView style={{ margin: 10 }}>
                <View style={{ width: '100%', borderRadius: 5, borderColor: theme.colors.border, borderWidth: 1 }}>
                    <View style={{ padding: 10, display: 'flex', flex: 1, gap: 10, flexDirection: 'row' }}>
                        <View style={{ flex: 1, justifyContent: 'center', display: 'flex', alignItems: 'center' }}>
                            <View
                                style={{
                                    height: 100,
                                    width: 100,
                                    borderRadius: 50,
                                    alignItems: 'center',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    backgroundColor: '#1d4ed8'
                                }}
                                start={{ x: 0, y: 0 }}
                            >
                                <MaterialCommunityIcons name="shield-star" color='white' size={56} />
                            </View>
                        </View>
                        <View style={{ flex: 1, justifyContent: 'space-around', display: 'flex' }}>
                            <View style={{ display: 'flex', alignItems: 'center', flex: 1, borderRadius: 5, borderWidth: 1, borderColor: theme.colors.border, padding: 8, width: 170, gap: 8 }}>
                                <Text style={{ color: theme.colors.subtitle, fontFamily: 'Nunito Medium' }}>Approved Claims - {nwlDetails?.completedClaims?.completedClaims?.length ?? 0}</Text>
                                <Text style={{ color: theme.colors.data, fontFamily: 'Nunito Bold', fontSize: 18 }}>₹{Number(nwlDetails?.completedClaims?.totalClaimIssued ?? 0).toLocaleString('en-IN')}</Text>
                            </View>
                            <View style={{ display: 'flex', alignItems: 'center', marginTop: 10, flex: 1, borderRadius: 5, borderWidth: 1, borderColor: theme.colors.border, padding: 8, width: 170, gap: 8 }}>
                                <Text style={{ color: theme.colors.subtitle, fontFamily: 'Nunito Medium' }}>Ongoing Claims - {nwlDetails?.ongoingClaims?.ongoingClaims?.length ?? 0}</Text>
                                <Text style={{ color: theme.colors.data, fontFamily: 'Nunito Bold', fontSize: 18 }}>₹{Number(nwlDetails?.ongoingClaims?.totalClaimOngong ?? 0).toLocaleString('en-IN')}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{ padding: 10, paddingTop: 0, display: 'flex', flex: 1, gap: 10, flexDirection: 'row' }}>
                        <View style={{ display: 'flex', alignItems: 'center', flex: 1, borderRadius: 5, borderWidth: 1, borderColor: theme.colors.border, padding: 8, width: 170, gap: 8, justifyContent: 'center' }}>
                            <Text style={{ color: theme.colors.subtitle, fontFamily: 'Nunito Medium' }}>Rejected Claims - {nwlDetails?.rejectedClaims?.rejectedClaims?.length ?? 0}</Text>
                            <Text style={{ color: theme.colors.data, fontFamily: 'Nunito Bold', fontSize: 18 }}>₹{Number(nwlDetails?.rejectedClaims?.totalClaimrejected ?? 0).toLocaleString('en-IN')}</Text>
                        </View>
                        <View style={{ display: 'flex', alignItems: 'center', flex: 1, borderRadius: 5, borderWidth: 1, borderColor: theme.colors.border, padding: 8, width: 170, gap: 8 }}>
                            <Text style={{ color: theme.colors.subtitle, fontFamily: 'Nunito Medium' }}>Prorated Claim Utilization - {Math.round(nwlDetails?.proRatedData?.proRatedClaimUtilization ?? 0)}%</Text>
                            <Text style={{ color: theme.colors.data, fontFamily: 'Nunito Bold', fontSize: 18 }}>₹{Number(nwlDetails?.proRatedData?.proRatedAmount ?? 0).toLocaleString('en-IN')}</Text>
                        </View>
                    </View>
                </View>
                <View style={{ ...styles.card, display: 'flex', flex: 1, marginTop: 10, flexDirection: 'column' }}>
                    <View style={{ ...styles.bottomBorder, justifyContent: 'center', alignItems: 'center' }}>
                        <View style={{ ...styles.bottomBorder, padding: 5, borderBottomColor: theme.colors.alpha, marginBottom: 10 }}>
                            <Text style={{ color: theme.colors.data, fontFamily: "Nunito ExtraBold", fontSize: 20 }}>Total Claim Utilization</Text>
                        </View>
                        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                            <ProgressChart
                                width={170}
                                height={170}
                                data={{
                                    label: ['data'],
                                    data: [parseFloat(totalClaimUtilization()) / 100 || 0]
                                }}
                                strokeWidth={14}
                                radius={50}
                                chartConfig={{
                                    color: (opacity = 1) => `rgba(50, 102, 227, ${opacity})`,
                                    strokeWidth: 2,
                                    useShadowColorFromDataset: false,
                                    backgroundGradientFromOpacity: 0,
                                    backgroundGradientToOpacity: 0,
                                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`
                                }}
                                hideLegend={true}
                            />
                            <View style={{ display: 'flex', justifyContent: 'center', flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                                <View style={{ width: 15, height: 15, backgroundColor: 'rgba(50, 102, 227, 0.6)', borderRadius: 25 }}></View>
                                <Text style={{ color: theme.colors.data, fontFamily: "Nunito Bold" }}>{`${Math.round(totalClaimUtilization())}%` || 0}</Text>
                            </View>
                        </View>
                        <View style={{ alignItems: 'center' }}>
                            <Text style={{ color: 'gray', fontFamily: 'Nunito Regular', fontSize: 14, textAlign: 'center' }}>Claim Utilization</Text>
                            <Text style={{ color: theme.colors.data, fontFamily: 'Nunito Bold', fontSize: 18, textAlign: 'center' }}>₹{Number((nwlDetails?.completedClaims?.totalClaimIssued + nwlDetails?.ongoingClaims?.totalClaimOngong) || 0).toLocaleString('en-IN')}</Text>
                        </View>
                    </View>

                    <View style={{ alignItems: 'center' }}>
                        <View style={{ ...styles.bottomBorder, padding: 5, borderBottomColor: theme.colors.alpha }}>
                            <Text style={{ color: theme.colors.data, fontFamily: "Nunito ExtraBold", fontSize: 20 }}>Prorated Claim Utilization</Text>
                        </View>
                        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: 5, margin: 10 }}>
                            <ProgressChart
                                width={170}
                                height={170}
                                data={{
                                    label: ['data1', 'data'],
                                    data: [(calculateTimeDurationofClaim()) / 100 || 0, parseFloat(nwlDetails?.proRatedData?.proRatedClaimUtilization) / 100 || 0]
                                }}
                                strokeWidth={14}
                                radius={50}
                                chartConfig={{
                                    color: (opacity = 1) => `rgba(50, 102, 227, ${opacity})`,
                                    strokeWidth: 2,
                                    useShadowColorFromDataset: false,
                                    backgroundGradientFromOpacity: 0,
                                    backgroundGradientToOpacity: 0,
                                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`
                                }}
                                hideLegend={true}
                            />
                            <View style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center', gap: 15 }}>
                                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                                    <View style={{ width: 15, height: 15, backgroundColor: 'rgba(50, 102, 227, 0.6)', borderRadius: 25 }}></View>
                                    <Text style={{ color: theme.colors.data, fontFamily: "Nunito Bold" }}>{`${Math.round(calculateTimeDurationofClaim())}%` || 0}</Text>
                                </View>
                                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                                    <View style={{ width: 15, height: 15, backgroundColor: 'rgba(50, 102, 227, 0.8)', borderRadius: 25 }}></View>
                                    <Text style={{ color: theme.colors.data, fontFamily: "Nunito Bold" }}>{`${Math.round(nwlDetails?.proRatedData?.proRatedClaimUtilization)}%` || 0}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={{ alignItems: 'center' }}>
                            <Text style={{ color: 'gray', fontFamily: 'Nunito Regular', fontSize: 14, textAlign: 'center' }}>Time Duration of Claim</Text>
                            <Text style={{ color: theme.colors.data, fontFamily: 'Nunito Bold', fontSize: 18, textAlign: 'center' }}>{daysToMonthsAndDays().months} Months {daysToMonthsAndDays().days} Days</Text>
                        </View>
                    </View>
                </View>
                <View style={{ borderWidth: 1, borderColor: theme.colors.border, borderRadius: 5, display: 'flex', flex: 1, marginTop: 10, }}>
                    <View style={{ ...styles.bottomBorder, borderBottomColor: theme.colors.border, display: 'flex', padding: 15, flexDirection: 'row' }}>
                        <View style={{ flex: 1, alignItems: 'center', paddingVertical: 10 }}>
                            <Text style={{ color: theme.colors.blue600, fontFamily: "Nunito Bold", fontSize: 20 }}>Ongoing Claims</Text>
                        </View>
                    </View>
                    <View style={{ padding: 10 }}>
                        {getOngoingClaims()?.length &&
                            getOngoingClaims()?.map((rowData, index) => (
                                <View key={index} style={{ display: 'flex', flexDirection: 'row', padding: 15, borderRadius: 5, borderWidth: 1, borderColor: theme.colors.border, marginTop: 10, justifyContent: 'space-between' }}>
                                    <View style={{ marginLeft: 5 }}>
                                        <Text style={{ fontFamily: 'Nunito Bold', color: theme.colors.data, fontSize: 16, marginBottom: 5 }}>{rowData[0][0]}</Text>
                                        <Text style={{ fontFamily: 'Nunito Medium', color: theme.colors.text }}>{rowData[0][1] ? formatString(rowData[0][1]) : ""}</Text>
                                        <Text style={{ fontFamily: 'Nunito Medium', color: 'gray' }}>{rowData[0][2] ? (rowData[0][2]).split('T')[0] : ""}</Text>
                                    </View>
                                    <View>
                                        <Text style={{ fontFamily: 'Nunito Bold', color: theme.colors.data, textAlign: 'right', fontSize: 16 }}>{rowData[1] ? `₹${parseInt(rowData[1]).toLocaleString('en-IN')}` : '-'}</Text>
                                        <Text style={{ fontFamily: 'Nunito Bold', color: theme.colors.subtitle, textAlign: 'right', fontSize: 14 }}>{rowData[2] ? formatString(rowData[2]) : "-"}</Text>
                                        <Text style={{ fontFamily: 'Nunito Medium', color: theme.colors.data, textAlign: 'right', fontSize: 16 }}>{rowData[3] && JSON.parse(rowData[3])?.length ? JSON.parse(rowData[3])?.join(', ') : "-"}</Text>
                                    </View>
                                </View>
                            ))}
                    </View>
                </View>
                <View style={{ borderWidth: 1, borderColor: theme.colors.border, borderRadius: 5, display: 'flex', flex: 1, marginTop: 10, }}>
                    <View style={{ ...styles.bottomBorder, borderBottomColor: theme.colors.border, display: 'flex', padding: 15, flexDirection: 'row' }}>
                        <View style={{ flex: 1, alignItems: 'center', paddingVertical: 10 }}>
                            <Text style={{ color: theme.colors.blue600, fontFamily: "Nunito Bold", fontSize: 20 }}>Rejected Claims</Text>
                        </View>
                    </View>
                    <View style={{ padding: 10 }}>
                        {getRejectedClaims()?.length &&
                            getRejectedClaims()?.map((rowData, index) => (
                                <View key={index} style={{ display: 'flex', flexDirection: 'row', padding: 15, borderRadius: 5, borderWidth: 1, borderColor: theme.colors.border, marginTop: 10, justifyContent: 'space-between' }}>
                                    <View style={{ marginLeft: 5 }}>
                                        <Text style={{ fontFamily: 'Nunito Bold', color: theme.colors.data, fontSize: 16, marginBottom: 5 }}>{rowData[0][0]}</Text>
                                        <Text style={{ fontFamily: 'Nunito Medium', color: theme.colors.text }}>{rowData[0][1] ? formatString(rowData[0][1]) : ""}</Text>
                                        <Text style={{ fontFamily: 'Nunito Medium', color: 'gray' }}>{rowData[0][2] ? (rowData[0][2]).split('T')[0] : ""}</Text>
                                    </View>
                                    <View>
                                        <Text style={{ fontFamily: 'Nunito Bold', color: theme.colors.data, textAlign: 'right', fontSize: 16 }}>{rowData[1] ? `₹${parseInt(rowData[1]).toLocaleString('en-IN')}` : '-'}</Text>
                                        <Text style={{ fontFamily: 'Nunito Bold', color: theme.colors.subtitle, textAlign: 'right', fontSize: 14 }}>{rowData[2] ? formatString(rowData[2]) : "-"}</Text>
                                        <Text style={{ fontFamily: 'Nunito Medium', color: theme.colors.data, textAlign: 'right', fontSize: 16 }}>{rowData[3] && JSON.parse(rowData[3])?.length ? JSON.parse(rowData[3])?.join(', ') : "-"}</Text>
                                    </View>
                                </View>
                            ))}
                    </View>
                </View>
                <View style={{ ...styles.card, display: 'flex', flex: 1, marginTop: 10, }}>
                    <View style={{ ...styles.bottomBorder, padding: 10, alignItems: 'center' }}>
                        <View style={{ ...styles.bottomBorder, borderBottomColor: theme.colors.alpha }}>
                            <Text style={{ color: theme.colors.data, padding: 10, fontSize: 18, fontFamily: 'Nunito ExtraBold', textAlign: 'center' }}>Age wise split of claims</Text>
                        </View>
                        <PieChart
                            data={data}
                            width={400}
                            height={200}
                            chartConfig={{
                                backgroundGradientFromOpacity: 0,
                                backgroundGradientToOpacity: 0,
                                color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
                                strokeWidth: 2, // optional, default 3
                                barPercentage: 0.5,
                                useShadowColorFromDataset: false
                            }}
                            accessor={"population"}
                            backgroundColor={"transparent"}
                            center={[20, 20]}
                            absolute
                        />
                        <View style={{ display: 'flex', flex: 1, justifyContent: 'center', flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ fontFamily: "Nunito Medium" }}>Total</Text><Text>{handleTotalAgeAmount()}</Text>
                        </View>
                    </View>
                    <View style={{ padding: 10, alignItems: 'center' }}>
                        <View style={{ ...styles.bottomBorder, borderBottomColor: theme.colors.alpha }}>
                            <Text style={{ color: theme.colors.data, paddingVertical: 10, fontSize: 18, fontFamily: 'Nunito ExtraBold', textAlign: 'center' }}>Relationship wise split of claims</Text>
                        </View>
                        <PieChart
                            data={relationshipdata}
                            width={400}
                            height={200}
                            chartConfig={{
                                backgroundGradientFromOpacity: 0,
                                backgroundGradientToOpacity: 0,
                                color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
                                strokeWidth: 2, // optional, default 3
                                barPercentage: 0.5,
                                useShadowColorFromDataset: false
                            }}
                            accessor={"population"}
                            backgroundColor={"transparent"}
                            center={[20, 20]}
                            absolute
                        />
                        <View style={{ display: 'flex', flex: 1, justifyContent: 'center', flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ fontFamily: "Nunito Medium" }}>Total</Text><Text>{handleTotalAgeAmount()}</Text>
                        </View>
                    </View>
                </View>
                <View style={{ borderWidth: 1, borderColor: theme.colors.border, borderRadius: 5, display: 'flex', flex: 1, marginTop: 10, }}>
                    <View style={{ ...styles.bottomBorder, borderBottomColor: theme.colors.border, display: 'flex', padding: 15, flexDirection: 'row' }}>
                        <View style={{ flex: 1, alignItems: 'center', paddingVertical: 10 }}>
                            <Text style={{ color: theme.colors.blue600, fontFamily: "Nunito Bold", fontSize: 20 }}>Diagnosis wise split of claims</Text>
                        </View>
                    </View>
                    <View style={{ padding: 10 }}>
                        {getDiagnosisClaims()?.length &&
                            getDiagnosisClaims()?.map((rowData, index) => (
                                <View key={index} style={{ display: 'flex', flexDirection: 'row', padding: 15, borderRadius: 5, borderWidth: 1, borderColor: theme.colors.border, marginTop: 10, justifyContent: 'space-between' }}>
                                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                        <Text style={{ fontFamily: 'Nunito Medium', color: theme.colors.data, fontSize: 14, textAlign: 'center' }}>{index + 1}. </Text>
                                        <Text style={{ fontFamily: 'Nunito Medium', color: theme.colors.data, textAlign: 'center', fontSize: 16 }}>{rowData[0] ? processArrayData(rowData[0]) : "-"} {rowData[2] ? '- ' + rowData[2] : ""}</Text>
                                    </View>
                                    <Text style={{ fontFamily: 'Nunito Bold', color: theme.colors.data, textAlign: 'center', fontSize: 16 }}>{rowData[1] ? `₹${parseInt(rowData[1]).toLocaleString('en-IN')}` : '-'}</Text>
                                </View>
                            ))}
                    </View>
                </View>
                <View style={{ borderWidth: 1, borderColor: theme.colors.border, borderRadius: 5, display: 'flex', flex: 1, marginTop: 10, }}>
                    <View style={{ ...styles.bottomBorder, borderBottomColor: theme.colors.border, display: 'flex', flexDirection: 'row' }}>
                        <View style={{ flex: 1, alignItems: 'center', padding: 15 }}>
                            <Text style={{ color: theme.colors.blue600, fontFamily: "Nunito Bold", fontSize: 18, textAlign: 'center' }}>Top 10 People who have used Suminsurance</Text>
                        </View>
                    </View>
                    <View style={{ padding: 10 }}>
                        {getTop10Claims()?.length &&
                            getTop10Claims()?.map((rowData, index) => (
                                <View key={index} style={{ display: 'flex', flexDirection: 'row', padding: 15, borderRadius: 5, borderWidth: 1, borderColor: theme.colors.border, marginTop: 10, justifyContent: 'space-between' }}>
                                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                        <Text style={{ fontFamily: 'Nunito Medium', color: theme.colors.data, fontSize: 14, textAlign: 'center' }}>{index + 1}. </Text>
                                        <Text style={{ fontFamily: 'Nunito Medium', color: theme.colors.data, textAlign: 'center', fontSize: 16 }}>{rowData[0] ? processArrayData(rowData[0]) : "-"}</Text>
                                    </View>
                                    <Text style={{ fontFamily: 'Nunito Bold', color: theme.colors.data, textAlign: 'center', fontSize: 16 }}>{rowData[1] ? `₹${parseInt(rowData[1]).toLocaleString('en-IN')}` : '-'}</Text>
                                </View>
                            ))}
                    </View>
                </View>
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

export default Claim;
