import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    runOnJS,
    withSequence,
    withDelay,
    Easing,
    interpolate,
    Extrapolation
} from 'react-native-reanimated';
import { Image } from 'expo-image';

interface AnimatedSplashScreenProps {
    onAnimationFinish: () => void;
}

const AnimatedSplashScreen: React.FC<AnimatedSplashScreenProps> = ({ onAnimationFinish }) => {
    const animation = useSharedValue(0);
    const { width, height } = Dimensions.get('window');

    useEffect(() => {
        // Animation Sequence:
        // 0 -> 1: Entrance (Fade in + Scale up)
        // 1 -> 1: Hold (Loading)
        // 1 -> 2: Exit (Zoom out)
        
        animation.value = withSequence(
            withTiming(1, { duration: 1000, easing: Easing.out(Easing.exp) }),
            withDelay(
                1500, // Hold for 1.5 seconds
                withTiming(2, { duration: 800, easing: Easing.in(Easing.cubic) }, (finished) => {
                    if (finished) {
                        runOnJS(onAnimationFinish)();
                    }
                })
            )
        );
    }, []);

    const logoStyle = useAnimatedStyle(() => {
        const scale = interpolate(
            animation.value,
            [0, 1, 2],
            [0.5, 1, 50], // Zoom out massively at the end
            Extrapolation.CLAMP
        );
        
        const opacity = interpolate(
            animation.value,
            [0, 1, 1.8, 2],
            [0, 1, 1, 0],
            Extrapolation.CLAMP
        );

        return {
            transform: [{ scale }],
            opacity,
        };
    });

    const textStyle = useAnimatedStyle(() => {
        const opacity = interpolate(
            animation.value,
            [0, 0.8, 1.2, 1.5], // Fade in with logo, fade out before zoom
            [0, 1, 1, 0],
            Extrapolation.CLAMP
        );
        
        const translateY = interpolate(
            animation.value,
            [0, 1],
            [20, 0],
            Extrapolation.CLAMP
        );

        return {
            opacity,
            transform: [{ translateY }],
        };
    });

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.imageContainer, logoStyle]}>
                <Image
                    source={require('../assets/images/icon.png')}
                    style={styles.image}
                    contentFit="contain"
                />
            </Animated.View>
            <Animated.View style={[styles.textContainer, textStyle]}>
                <Text style={styles.appName}>Async</Text>
                <Text style={styles.loadingText}>Loading...</Text>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0f172b',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
    },
    imageContainer: {
        width: 120,
        height: 120,
        marginBottom: 20,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    textContainer: {
        alignItems: 'center',
        position: 'absolute',
        bottom: '15%', // Position text towards the bottom
    },
    appName: {
        color: '#3B82F6',
        fontSize: 32,
        fontWeight: 'bold',
        letterSpacing: 2,
        marginBottom: 8,
    },
    loadingText: {
        color: '#94A3B8',
        fontSize: 14,
        letterSpacing: 1,
    }
});

export default AnimatedSplashScreen;
