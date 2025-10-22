import React, { useState, useEffect } from 'react'
import { View, Image, StyleSheet, Pressable, useWindowDimensions } from 'react-native';
import { Button, Text } from 'react-native-paper';

/**
 * Create a LevelSelect component
 * @param {Object} param0 Array\<Level\>, Function(Level), Function(Level)
 */
const LevelSelect = ({ levels, onSelect, onChange }) => {
    const { width, height } = useWindowDimensions();
    const [page, setPage] = useState(0);
    const [pages, setPages] = useState(levels);

    // Run on each initial render
    useEffect(() => {
        console.log("Levels: " + levels.map(l => l.getName()));
        console.log("Main Page: " + levels[page].getName());
        
        // Call a Change event
        onChange(pages[page]);
    }, []);

    const changeLevel = (type) => {
        let level = page; // Start with current index

        console.log(type + " level");
        console.log(`\tCurrent Level: ${pages[level].getName()}`);
        
        // Increment the level
        if ("next" === type.toLowerCase()) {
            level = (level + 1) % pages.length;
        }
        // Decrement the level
        else if ("previous" === type.toLowerCase()) {
            level = (level - 1 + pages.length) % pages.length;
        }
        
        console.log(`\tUpdated Level: ${pages[level].getName()}`);
        
        // Update the page value
        setPage(level);
        
        // Call a Change event
        // Use the 'level' variable because useState doesn't update immediately
        onChange(pages[level]);
    }



    return (
        <View>
            <View style={[levelStyles.row, levelStyles.spread]}>
                <Button style={levelStyles.pageButton} onPress={() => changeLevel("Previous")}>{"<-"}</Button>
                <Pressable
                    style={levelStyles.pressable}
                    onPress={() => {
                        console.log("Selected Level #" + page);
                        // Return the selected level
                        onSelect(pages[page]);
                    }}
                >
                    {/* Only display the image element if level references are provided */}
                    {pages ? <Image source={pages[page].getImage()} style={levelStyles.image} /> : <View />}
                </Pressable>
                <Button style={levelStyles.pageButton} onPress={() => changeLevel("Next")}>{"->"}</Button>
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