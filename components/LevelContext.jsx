import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import Level from '@modules/menu/Level';
import leveldata from '@assets/leveldata.json';

/**
 * Retreive the neccesary data to create all the Levels from leveldata.json
 */
async function fetchLevels() {
    let levels = [];
    let start = Date.now();
    
    // Process each level
    for (let level of leveldata) {
        // The Level to create
        let levelToAdd = new Level(level.name);

        // Fetch the Level image
        let response = await fetch("https://raw.githubusercontent.com/retreat896/MobileDev-Midterm/main/" + level.image);
            
        // The response failed
        if (!response.ok) {
            // Throw an error
            throw Error(`Failed to resolve URL: "${response.url}" Status: ${response.status}`);
        }
            
        // Create a new Level using the name and image
        let imageBlob = await response.blob();
        let type = 'direct'; // The type of Image

        // The API returned the image as a Blob
        if (imageBlob) {
            type = 'blob';

            // Set the Image using the image Blob
            await levelToAdd.setImageBlob(imageBlob);    
        }
        // The API returned a direct image URL
        else {
            // Set the Image using the direct URL
            levelToAdd.setImageURI(response.url);
        }

        // Add the Level to the list
        levels.push(levelToAdd);
        console.log(`Created Level (${type}): "${level.name}"`);
    }

    let end = Date.now();
  
    console.log(`Level Load Time: ${(end - start)/1000} seconds`);

    return levels;
}

const LevelContext = createContext();

export const LevelProvider = ({ children }) => {
    /** Level Test Cases:
     *      Direct Image: new Level('Level 1').setImageURI('https://images.dog.ceo/breeds/terrier-andalusian/images.jpg')
     *      Local Image File: new Level("HelloWorld").setImage(require('@assets/favicon.png'))
     *      Image Blob: <github image fetch>
     */
    // Array to hold all levels
    const [allLevels, setAllLevels] = useState([]);
    const level = useRef(null); // Utilize useRef so Class Objects can be passed
    const [allLoaded, setLoaded] = useState(false);

    // This would technically run on every initial render but because
    // LevelProvider is in the Root layout, only one will EVER be displayed
    useEffect(() => {
        const loadData = async () => {
            if (!allLoaded) { // Not necessary, but seemed like good practice
                let levels = await fetchLevels(); // Fetch all levels

                // Lock the levels Object from modifications
                // Since we pass it to any script that asks for it
                Object.freeze(levels);

                // Update the levels
                setAllLevels(levels);

                // The levels were loaded
                setLoaded(true);
            }
        }

        loadData()
    }, []);

    //const getLevelByName = (name) => allLevels.find(level => name == level.getName());

    return (
        <LevelContext.Provider value={{ level, allLoaded, allLevels }}>
            {children}
        </LevelContext.Provider>
    );
};

// Return the set level data
/**
 * 
 * @returns {Object} { level, allLoaded, allLevels }
 */
export const useLevel = () => {
    const context = useContext(LevelContext);
    if (!context) throw new Error('useLevel must be used within a LevelProvider');
    return context;
}