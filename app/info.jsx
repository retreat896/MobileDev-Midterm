import { Image, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { router } from 'expo-router';
import { Button, FAB } from 'react-native-paper';

const info = () => {
    return (
        <View style={styles.screen}>
            <View style={styles.flexColumn}>
                <Text style={styles.text}>CS3720 Mobile Applications Development</Text>
                <View style={styles.flexColumn}>
                    <Text style={styles.text}>UW Platteville </Text>
                    <Image style={styles.image} source={{ uri: 'https://cdn.uwplatt.edu/logo/vertical/official/b_clear/1024.png' }} />
                </View>
                <Text style={styles.text}>Kristopher Adams | Jacob Malland</Text>
                <Text style={styles.text}>Professor: Dr. Abraham Aldaco</Text>
                <FAB icon="door-open" onPress={()=>router.navigate("/")}></FAB>
            </View>
        </View>
    );
};

export default info;

const styles = StyleSheet.create({
        screen: {
            flex: 1,
            backgroundColor:"#2c2c2cff"
        },
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        footer:{
            position: 'absolute',
            bottom: 0,
            width: '100%',
            padding: 10,
            alignContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
            marginBottom: 40,
        },
        text: {
            fontSize: 20,
            fontFamily: 'system-ui',
            color:"white",
            green:{
                color: 'green'
            }
        },
        score:{
            alignContent: "center",
            justifyContent: "center",
            alignSelf:"center",
        },
        bold:{
            fontWeight: 'bold',
        },
        image:{
            width: 200,
            height: 200,
            resizeMode: 'contain',
            margin: 10,
        },
        flexRow: {
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
            margin: 10,
        },
        flexColumn: {
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            margin: 10,
        },
        smallLogo: {
            width: 100,
            height: 100,
            resizeMode: 'contain',
            margin: 10,
        },
        /* For Gyroscope Display, from expo demo */
        buttonContainer: {
          flexDirection: 'row',
          alignItems: 'stretch',
          marginTop: 15,
        },
        button: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#eee',
          padding: 10,
        },
        middleButton: {
          borderLeftWidth: 1,
          borderRightWidth: 1,
          borderColor: '#ccc',
        },
        glView: {
            flex: 1,
            //fill the screen with no margin and padding
            margin: 0,
            padding: 0,
            width: '100%',
            height: '108%',
            top: 0,
            left: 0,
            position: 'absolute',
            zIndex: -1,
            borderColor: 'red',
            borderWidth: 1,
        },
        backgroundImage:{
            width: '100%',
            height: '110%',
            top: 0,
            left: 0,
            position: 'absolute',
            zIndex: -2,
        }
    });
