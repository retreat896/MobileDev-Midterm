import { StyleSheet, Text, View, Button, Image, FlatList, useWindowDimensions } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { styles } from '../styles/main';
import LevelSelect from '../modules/LevelSelect';
import MainMenu from '../modules/MainMenu';

// router.push(path): Navigates to a new screen and adds it to the navigation stack.
// router.replace(path): Replaces the current screen in the navigation stack with the new one.
// router.back(): Navigates back to the previous screen.
// router.navigate({ pathname: string, params: object }): Navigates to a specific path with parameters.


const index = () => {
    const router = useRouter();
    const [showLevels, setShowLevels] = useState(false);
    const { width:screenWidth, height:screenHeight } = useWindowDimensions();

    return (
        // <SafeAreaProvider>
        //     <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.mainView}>
                    {
                        showLevels ?
                            <LevelSelect/>
                        :
                        <MainMenu onPlay={()=>setShowLevels(true)}/>
                        
                    }
                    
                </View>
        //     </SafeAreaView>
        // </SafeAreaProvider>
    );
};

export default index;
