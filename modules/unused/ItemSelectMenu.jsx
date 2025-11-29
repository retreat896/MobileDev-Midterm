import { Text, View, Pressable } from 'react-native'
import { useState, useEffect } from 'react';
import { Item, ItemSize, ITEM_MARGIN } from './Item';
import {styles} from '../styles/main';

const ItemSelectMenu = ({ items, width, height, itemsPerRow, rowsPerPage }) => {
    
    // // The maximum number of columns for the display
    // const maxColumns = Math.max(1, Math.floor(width / (ItemSize(items[0].style) + ITEM_MARGIN)));
    // const columns = Math.min(numColumns, maxColumns); // The necessary number of columns (may be lower than set value)
    
    // // Maximum number of rows that would fit the display
    // const maxRows = Math.floor(height / (ItemSize(items[0].style) + ITEM_MARGIN));
    
    // const itemsPerPage = columns * maxRows;                  // Items per page
    // const numPages = Math.ceil(items.length / itemsPerPage); // Number of pages
    
    const totalRows = Math.ceil(items.length / itemsPerRow);
    const totalPages = Math.ceil(totalRows / rowsPerPage);

    const [page, setPage] = useState(-1);
    const [pages, setPages] = useState(new Array(totalPages)); // Used useState because it wasn't remembering the Array
    
    useEffect(() => {
        // Need a way to have pages per numRows.
        // Each page has numRows, with numColumns items in each row.
        // As is, it creates the rows, all in one page.

        // Use tPage as temp variable (so as to not confuse with page)
        for (let tPage=0; tPage<totalPages; tPage ++) {
            // Start with empty page array
            pages[tPage] = [];

            // The current item index for the given page
            // Each page is (itemsPerRow * rowsPerPage) -- basically col * row
            let itemIndex = tPage * itemsPerRow * rowsPerPage;

            // Add the number of rows to the page
            for (let row=0; row<rowsPerPage; row++) {
                // The start and end item-indexes for the row
                let start = itemIndex + row * itemsPerRow;
                let end = start + itemsPerRow;

                // The portion of the array to be added to the row
                // Empty array of 'sliced items' -- Ensures a full page of rows, even if no items in row
                let slicedItems = [];

                // The start index is within the bounds of the item list
                if (start < items.length) {
                    if (end < items.length) {
                        slicedItems = items.slice(start, end);
                    }
                    // The end index is greater than the number of items
                    else {
                        // Take the remainder of the array
                        slicedItems = items.slice(start);
                    }
                }

                pages[tPage].push(
                    <View style={styles.row}>
                        {/* Add 'n' items to the row, corresponding to the number of columns */}
                        {slicedItems.map(item => <Item {...item}/>)}
                    </View>
                )
            }
        }
        
        // // Go through each page
        // for (let pg=0; pg<numPages; pg++) {
        //     // The page of items
        //     let page = []

        //     // Add the items to each page
        //     for (let i=pg * itemsPerPage; i<items.length && i<(pg + 1) * itemsPerPage; i++) {
        //         // Add the item to the current page
        //         page.push(items[i]);
        //     }
        //     console.log("Items In Page " + pg + ": " + page.length);
        //     // Push the page to the pages
        //     pages.push(page);
        // }

        setPage(0); // Set the page to 0, forcing a rerender
    }, []);
 

    return (
        <View style={styles.popupContainer}>
            <Pressable 
                onPress={() => { setPage((page - 1 + pages.length) % pages.length); }}
                style={styles.pageButton}
            >
                <Text style={{
                    textAlign: "center"
                }}>{"<"}</Text>
            </Pressable>

            <View style={styles.listContainer}>
                {/* FlatList contains the Item components, for selection */}
                {/* <FlatList
                    data={pages[page]}
                
                    renderItem={(item) => {
                        return (
                            <Item {...item.item}/>
                        );
                    }}
                    
                    numColumns={columns}
                /> */}
                {pages[page]}
            </View>

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
