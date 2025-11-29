/**
 * Original Code Courtesy of Kristopher Adams
 * Purpose: 
 *      Provide a standardized "Link" button, that enables screen switching
 *      Standardized in that it's not feature rich, but supports press-opacity adjustment
 */
import { Text, Component, Pressable } from 'react-native'
import { useState } from 'react';
import { useRouter } from 'expo-router';
import getButtonStyles from '../styles/button';

/**
 * Idea for later: 
 *      Have a onTransition option that allows an asynchronous function 
 *      to be called and executed. While executing, it shows the loading
 *      screen. 
 */
const SceneLink = ({ onPress, title, link }) => {
    const router = useRouter();
    const button = getButtonStyles();

    // Track whether the button is pressed, to adjust opacity
    const [isPressed, setPressed] = useState(false);
    return (
        <Pressable
        onPress={() => {
                // Call the onPress function.
                onPress();
                // Display the next scene.
                router.push(link);
            }}
            style={({ pressed }) => [
                activeState ? [button.active, button] : button,
                pressed ? button.onpress : button.offpress,
            ]}>

            <Text style={button.text}>{title}</Text>

        </Pressable>
    )
}


export default SceneLink;
