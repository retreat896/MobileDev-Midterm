import { Text, View, Image, Pressable } from 'react-native'

const ITEM_MARGIN = 20;

/**
 * Determine the width/height size of an Item component
 * @param {Object} style The stylesheet for the Item 
 * @returns The size value
 */
const ItemSize = (style) => {
    if (style === undefined) {
        style = {}
    }
    return !style.size ? 75 : style.size;
}

/**
 * Create an Item component, to be rendered by the select menu
 */
const Item = ({ onPress=() => {}, icon={}, label="null", style={ } }) => {
    return (
        <Pressable
            onPress={onPress}

            style={{
                margin: ITEM_MARGIN/2,
                marginBottom: ITEM_MARGIN/2 + 5,
                width: ItemSize(style),
                height: ItemSize(style),
                backgroundColor: '#777777',
            }}
            >
            
            {/* <View style={{
                overflow: 'hidden',
            }}> */}
                <Image
                    source={icon}
                    resizeMode="cover"
                    style={{ 
                        // Dimensions
                        width: ItemSize(style),
                        height: ItemSize(style),
                        
                        // Shadows
                        elevation: !style.elevation ? 10 : style.elevation, // Android
                        shadowColor: !style.shadowColor ? "black" : style.shadowColor,
                        shadowOpacity: !style.shadowOpacity ? 0.3 : style.shadowOpacity,
                        shadowRadius: !style.shadowRadius ? 4 : style.shadowRadius, // IOS

                        // Border Radius
                        borderRadius: !style.borderRadius ? 10 : style.borderRadius,
                        borderColor: !style.borderColor ? "black" : style.borderColor,
                        borderWidth: !style.borderWidth ? 1 : style.borderWidth
                    }}
                />
            {/* </View> */}

            <Text style={{
                textAlign: "center",
                color: !style.color ? "black" : style.color
            }}>{label}</Text>
        </Pressable>
    );
};

// Export the Item component, Size function, and constant Margin
export {
    Item,
    ItemSize,
    ITEM_MARGIN
};