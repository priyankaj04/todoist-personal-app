import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';

const ProgressBar = ({ value, color }) => {
    const progressValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        animateProgressBar();
    }, [value]);

    const animateProgressBar = () => {
        Animated.timing(progressValue, {
            toValue: value,
            duration: 1000,
            easing: Easing.linear,
            useNativeDriver: true,
        }).start();
    };

    const progressBarWidth = progressValue.interpolate({
        inputRange: [0, 100],
        outputRange: ['0%', '100%'],
    });

    return (
        <View style={[styles.container, { backgroundColor: color }]}>
            <Animated.View style={[styles.progressBar, { width: progressBarWidth }]} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 10,
        borderRadius: 5,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        backgroundColor: 'gray', // Default color for progress bar
    },
});

export default ProgressBar;
