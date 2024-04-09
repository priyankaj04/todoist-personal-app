import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';

const PieChart = ({ yellow, blue }) => {
    const yellowValue = useRef(new Animated.Value(0)).current;
    const blueValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        animateChart();
    }, []);

    const animateChart = () => {
        Animated.parallel([
            Animated.timing(yellowValue, {
                toValue: yellow,
                duration: 1000,
                easing: Easing.linear,
                useNativeDriver: true,
            }),
            Animated.timing(blueValue, {
                toValue: blue,
                duration: 1000,
                easing: Easing.linear,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const yellowAngle = yellowValue.interpolate({
        inputRange: [0, 100],
        outputRange: ['0deg', '360deg'],
    });
    const blueAngle = blueValue.interpolate({
        inputRange: [0, 100],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <View style={styles.container}>
            <View style={[styles.pieContainer, { transform: [{ rotate: yellowAngle }] }]}>
                <View style={[styles.pieSlice, { backgroundColor: 'yellow' }]} />
            </View>
            <View style={[styles.pieContainer, { transform: [{ rotate: blueAngle }] }]}>
                <View style={[styles.pieSlice, { backgroundColor: 'blue' }]} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 200,
        height: 200,
        borderRadius: 100,
        overflow: 'hidden',
        position: 'relative',
    },
    pieContainer: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        clipPath: 'polygon(50% 50%, 100% 100%, 100% 0)',
    },
    pieSlice: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        borderTopLeftRadius: 100,
    },
});

export default PieChart;
