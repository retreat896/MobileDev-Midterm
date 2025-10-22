import React, { useState } from 'react'
import { View, Image, StyleSheet, Pressable, useWindowDimensions } from 'react-native';
import { Button, Text } from 'react-native-paper';

const LevelSelect = ({ levels, onSelect }) => {
    const { width, height } = useWindowDimensions();
    const [page, setPage] = useState(0);
    const [pages, setPages] = useState(levels);

    /**
     * Move to the next page
     */
    const onNext = () => {
        console.log("Next Level");
        setPage((page + 1) % pages.length);
    }

    /**
     * Move to the previous page
     */
    const onPrev = () => {
        console.log("Previous Level");
        setPage((page - 1 + pages.length) % pages.length);
    }

    console.log("Levels: " + levels);
    console.log("Main Page: " + levels[page]);

    return (
        <View>
            <View style={[levelStyles.row, levelStyles.spread]}>
                <Button style={levelStyles.pageButton} onPress={onPrev}>{"<-"}</Button>
                <Pressable
                    style={levelStyles.pressable}
                    onPress={() => {
                        console.log("Selected Level #" + page);
                        onSelect(page);
                    }}
                >
                    {/* Only display the image element if level references are provided */}
                    {pages ? <Image source={{ uri: pages[page] }} style={levelStyles.image} /> : <View />}
                </Pressable>
                <Button style={levelStyles.pageButton} onPress={onNext}>{"->"}</Button>
            </View>
        </View>
    )
}

// Image Dimension Percentages (Preserve Aspect Ratio)
const MAX_IMAGE_WIDTH = 50;
const MAX_IMAGE_HEIGHT = 70;

const levelStyles = StyleSheet.create({
    pressable: {
        width:'100%',
        maxWidth: (MAX_IMAGE_WIDTH * MAX_IMAGE_HEIGHT/100) + "%",
        height: '100%',
        maxHeight: MAX_IMAGE_HEIGHT + '%'
    },
    image: {
        width: 'auto',
        height: '100%',
        elevation: 10,          // Android
        shadowColor: 'black',
        shadowOpacity: 0.3,
        shadowRadius: 4,         // IOS,
        borderWidth: 1,
        borderColor: 'red',
        borderRadius:18
    },
    spread: {
        flexDirection: "row",
        justifyContent: 'space-between',
        borderColor: "red",
        borderWidth: 2,
    },
    pageButton: {
        marginHorizontal: 50,
        width: 50,
        height: 50,
        backgroundColor: '#007276ff',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
        borderColor: "red",
        borderWidth: 2,
    },
    row: {
        position: 'static',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: "100%",
        borderColor: "red",
        borderWidth: 2,
    }
});

export default LevelSelect;