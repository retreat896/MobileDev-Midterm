import React, { useEffect, useRef, useState } from 'react';
import { View, Image, Animated, StyleSheet, Pressable } from 'react-native';
import { Text } from 'react-native-paper'; 

const SplashScreen = ({ onFinish }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const currentAnim = useRef(null);
    const [stage, setStage] = useState(1);

    const skipAnimation = () => {
        if (currentAnim.current) {
            currentAnim.current.stop();
            // Immediately fade out to skip the delay
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start(({ finished }) => {
                if (finished) {
                    setStage(s => s + 1);
                }
            });
        }
    };

    useEffect(() => {
        if (stage > 3) {
            onFinish();
            return;
        }

        // Reset animation value to 0 at the start of each stage
        fadeAnim.setValue(0);

        const anim = Animated.sequence([
            // Fade In
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }),
            // Hold
            Animated.delay(2000),
            // Fade Out
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 1000,
                useNativeDriver: true,
            }),
        ]);

        currentAnim.current = anim;
        
        anim.start(({ finished }) => {
            if (finished) {
                console.log("Stage " + stage + " completed");
                setStage(s => s + 1);
            }
        });

        return () => anim.stop();
    }, [stage]);

    return (
        <Pressable style={styles.container} onPress={skipAnimation}>
            <Animated.View style={{ opacity: fadeAnim }}>
                {stage == 1 && 
                    <View style={styles.flexColumn}>
                        <Text style={styles.text}>UW Platteville</Text>
                        <Image
                            source={require('../assets/uwp.png')}
                            style={styles.logo}
                            resizeMode="contain"
                        />
                    </View>
                }
                {stage == 2 && 
                    <View style={styles.flexColumn}>
                        <Text style={styles.text}>CS3720 Mobile Applications Development</Text>
                        <Text style={styles.text}>Professor: Dr. Abraham Aldaco</Text>
                    </View>
                }
                {stage == 3 && 
                    <View style={styles.flexColumn}>
                        <Text style={styles.text}>Developed By:</Text>
                        <Text style={styles.text}>Kristopher Adams | Jacob Malland</Text>
                    </View>
                }
            </Animated.View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999, // Ensure it sits on top
    },
    logo: {
        width: 200,
        height: 200,
    },
    flexColumn: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10,
    },
    text: {
        fontSize: 20,
        fontFamily: 'system-ui',
        color: "white"
    },
});

export default SplashScreen;
