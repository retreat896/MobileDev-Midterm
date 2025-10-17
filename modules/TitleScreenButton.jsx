import React, { Component } from 'react'
import { Pressable, Text, View } from 'react-native'
import {styles} from "../styles/main"




export const TitleScreenButton = ({onPress,title})=>{
    return (
      <Pressable onPress={onPress} style={styles.titleButton}>
            <Text style={styles.titleButtonText}>{title}</Text>
      </Pressable>
    )
}

export default TitleScreenButton
