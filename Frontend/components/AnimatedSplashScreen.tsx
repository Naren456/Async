import React, { useEffect } from 'react';
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';

interface AnimatedSplashScreenProps {
    onAnimationFinish: () => void;
}

const AnimatedSplashScreen: React.FC<AnimatedSplashScreenProps> = ({ onAnimationFinish }) => {
    useEffect(() => {
        // Simulate loading time
        const timer = setTimeout(() => {
            onAnimationFinish();
        }, 2000); // 2 seconds delay

        return () => clearTimeout(timer);
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.imageContainer}>
                <Image
                    source={require('../assets/images/icon.png')}
                    style={styles.image}
                    contentFit="contain"
                />
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.appName}>Async</Text>
                <ActivityIndicator size="small" color="#3B82F6" style={styles.spinner} />
                <Text style={styles.loadingText}>Loading...</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#08090B',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
    },
    imageContainer: {
        width: 120,
        height: 120,
        marginBottom: 40,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    textContainer: {
        alignItems: 'center',
    },
    appName: {
        color: '#3B82F6',
        fontSize: 32,
        fontWeight: 'bold',
        letterSpacing: 2,
        marginBottom: 20,
    },
    spinner: {
        marginBottom: 10,
    },
    loadingText: {
        color: '#94A3B8',
        fontSize: 14,
        letterSpacing: 1,
    }
});

export default AnimatedSplashScreen;
