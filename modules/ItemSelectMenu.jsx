import { Text, View, Pressable, FlatList } from 'react-native'
import { useState, useEffect } from 'react';
import { Item, ItemSize, ITEM_MARGIN } from './Item';
import { styles } from '../styles/main';

const ItemSelectMenu = ({ items, width, height, numColumns }) => {
    const [page, setPage] = useState(-1);
    const [pages, setPages] = useState([]); // Used useState because it wasn't remembering the Array
    
    // The maximum number of columns for the display
    const maxColumns = Math.max(1, Math.floor(width / (ItemSize(items[0].style) + ITEM_MARGIN)));
    const columns = Math.min(numColumns, maxColumns); // The necessary number of columns (may be lower than set value)

    // Maximum number of rows that would fit the display
    const maxRows = Math.floor(height / (ItemSize(items[0].style) + ITEM_MARGIN));

    const itemsPerPage = columns * maxRows;                  // Items per page
    const numPages = Math.ceil(items.length / itemsPerPage); // Number of pages
    
    
    useEffect(() => {
        console.log("Rendered Columns: " + columns);
        console.log("Items Per Page: " + itemsPerPage);
        console.log("Calculated Number of Pages: " + numPages);

        // Go through each page
        for (let pg=0; pg<numPages; pg++) {
            // The page of items
            let page = []

            // Add the items to each page
            for (let i=pg * itemsPerPage; i<items.length && i<(pg + 1) * itemsPerPage; i++) {
                // Add the item to the current page
                page.push(items[i]);
            }
            console.log("Items In Page " + pg + ": " + page.length);
            // Push the page to the pages
            pages.push(page);
        }

        setPage(0); // Set the page to 0, forcing a rerender
    }, []);
 

    return (
        <View>
            <Pressable 
                onPress={() => { setPage((page - 1 + pages.length) % pages.length); }}
                style={styles.pageButton}
            >
                <Text style={{
                    textAlign: "center"
                }}>{"<"}</Text>
            </Pressable>

            {/* FlatList contains the Item components, for selection */}
            <FlatList
                data={pages[page]}
                
                renderItem={(item) => {
                    return (
                        <Item {...item.item}/>
                    );
                }}
            
                numColumns={columns}
            />

            <Pressable 
                onPress={() => { setPage((page + 1) % pages.length); }}
                style={styles.pageButton}
            >
                <Text style={{
                    textAlign: "center"
                }}>{">"}</Text>
            </Pressable>
        </View>
    )
}


export default ItemSelectMenu;
