import { StyleSheet, Text, View, Button, Image, FlatList } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import { useRouter } from 'expo-router';
import TitleScreenButton from '../modules/TitleScreenButton';
import PopupScreen from '../modules/PopupScreen';
import ItemSelectMenu from '../modules/ItemSelectMenu';
import { styles } from '../styles/main';

// router.push(path): Navigates to a new screen and adds it to the navigation stack.
// router.replace(path): Replaces the current screen in the navigation stack with the new one.
// router.back(): Navigates back to the previous screen.
// router.navigate({ pathname: string, params: object }): Navigates to a specific path with parameters.


let image = () => {
    return (
        <Image
            source={{ src: "https://images.dog.ceo/breeds/terrier-andalusian/images.jpg" }}
            style={{
                width: 85,
                height: 85,
                borderRadius: 10,
                elevation: 15, // Android
                shadowColor: "black",
                shadowOpacity: 0.3,
                shadowRadius: 4, // iOS
            }}
        />
    )
}

const makeItems = (count) => {
    let array = [];

    for (let i=0; i<count; i++) {
        array.push({
            onPress: () => {
                console.log("Pressed " + i);    
            },
            
            icon: {
                uri: "https://images.dog.ceo/breeds/terrier-andalusian/images.jpg"
            },
    
            label: `${i}`,
            
            style: {
                // size: 75,
                // borderRadius: 10,
                borderColor: "yellow",
                // elevation: 10,
                // shadowColor: "black",
                // shadowOpacity: 0.3,
                // shadowRadius: 4,
                color: "white"
            }
        });
    }

    return(array);
}

const index = () => {
    const router = useRouter();

    return (
        <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.mainView}>
                    <PopupScreen title="Levels" width={400} height={600} radius={10}>
                        {/* <FlatList numColumns={4} style={{
                            display: 'grid',
                            flex: 1,
                            margin: 25
                        }}> */}
                        <ItemSelectMenu items={makeItems(20)} width={400} height={450} numColumns={5}/>
                        {/* </FlatList> */}
                    </PopupScreen>
                    <TitleScreenButton title="Play" onPress={() => router.push('/game')} />
                    <View>
                        <Text>Hello World</Text>
                    </View>
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

export default index;
