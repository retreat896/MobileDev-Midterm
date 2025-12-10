import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import Level from '@modules/menu/Level';
import leveldata from '@assets/leveldata.json';

/**
 * Retreive the neccesary data to create all the Levels from leveldata.json
 */
async function fetchLevels() {
    let levels = [];

    // Process each level
    for (let level of leveldata) {
        // The Level to create
        let levelToAdd = new Level(level.name);

        // Construct the image URL
        // We use the direct URL instead of fetching as blob to avoid issues
        // Handle leading slash in level.image
        const imagePath = level.image.startsWith('/') ? level.image.substring(1) : level.image;
        const imageUrl = "https://raw.githubusercontent.com/retreat896/MobileDev-Midterm/main/" + imagePath;
        
        // Set the Image using the direct URL
        levelToAdd.setImageURI(imageUrl);

        if (level.enemySpawn) {
            levelToAdd.setEnemySpawn(level.enemySpawn);
        }
        if (level.playerSpawn) {
            levelToAdd.setPlayerSpawn(level.playerSpawn);
        }

        // Add the Level to the list
        levels.push(levelToAdd);
    }

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
    const [levelsLoaded, setLoaded] = useState(false);

    // This would technically run on every initial render but because
    // LevelProvider is in the Root layout, only one will EVER be displayed
    useEffect(() => {
        const loadData = async () => {
            if (!levelsLoaded) { // Not necessary, but seemed like good practice
                let start = Date.now(); // Track loading time
                
                let levels = await fetchLevels(); // Fetch all levels

                // Lock the levels Object from modifications
                // Since we pass it to any script that asks for it
                Object.freeze(levels);

                // Update the levels
                setAllLevels(levels);

                // The levels were loaded
                setLoaded(true);
                
                let end = Date.now();
                console.log(`Level Load Time: ${(end - start)/1000} seconds`);
            }
        }

        loadData()
    }, []);

    //const getLevelByName = (name) => allLevels.find(level => name == level.getName());

    return (
        <LevelContext.Provider value={{ levelsLoaded, level, allLevels }}>
            {children}
        </LevelContext.Provider>
    );
};

// Return the set level data
/**
 * 
 * @returns {Object} { level, levelsLoaded, allLevels }
 */
export const useLevel = () => {
    const context = useContext(LevelContext);
    if (!context) throw new Error('useLevel must be used within a LevelProvider');
    return context;
}