import React from 'react'
import { StyleSheet, Text, View, Button, Image, FlatList, useWindowDimensions } from 'react-native';
import ItemSelectMenu from './ItemSelectMenu';
import { styles } from '../styles/main';

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
    for (let i = 0; i < count; i++) {
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

    return (array);
}

const LevelSelect = () => {
    const { width:screenWidth, height:screenHeight } = useWindowDimensions();
    const items = makeItems(60);
    
    return (
        // <View>
        //         {/* <PopupScreen title="Levels" width={400} height={600} radius={10}> */}
        //             <ItemSelectMenu items={items} width={400} height={600} numColumns={5} />
        //         {/* </PopupScreen> */}
        // </View>

        <View
            style={{
                width: screenWidth,
                height: screenHeight,
                ...styles.popupContainer
            }}>

            <Text style={{
                textAlign: 'center',
                color: 'black'
            }}>Levels</Text>

            <View>
                 <ItemSelectMenu items={items} width={400} height={600} numColumns={5} />
            </View>
        </View>
    )
}

export default LevelSelect
