/**
 * The purpose of this component is to simplify the process of using AsyncStorage.
 * Instead of having to asynchronously call to retreive data, we can store on load
 * And update it when it changes.
 * 
 * No need for constant asynchronous calls. Plus the code here handles most Asynchronous buffering
 */
import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import defaults from '@assets/defaults.json';

async function setDefaults(type) {
    // Get all saved keynames
    let savedKeys = await AsyncStorage.getAllKeys();

    // Go through each value in the default userdata.
    for (let key in defaults[type]) {
        // Skip the value if it's already saved in memory
        if (savedKeys.includes(key)) continue;

        // The userdata value doesn't exist
        // Save the default value to memory
        console.log(`Writing default '${key}' to saved storage.`);
        // MUST BE A STRING. ANY OTHER VALUE IS NOT SAVED
        await AsyncStorage.setItem(key, String(defaults[type][key])).catch(e => console.error);
        console.log(`Finished writing '${key}' successfully.`);
    }
}

async function getSavedData(type) {
    // Get all saved keynames
    let savedKeys = await AsyncStorage.getAllKeys();

    // Get all default keynames
    let typeKeys = Object.keys(defaults[type]);

    // Filter all saved keys for only ones that have default values
    savedKeys = savedKeys.filter(key => typeKeys.includes(key));

    // Get all saved key-value pairs
    let savedData = await AsyncStorage.multiGet(savedKeys);

    // Return a JSON object of the saved data
    return Object.fromEntries(savedData);
}

const DataContext = createContext();

/**
 * The way this DataProvider works, is it manages the AsyncStorage for any data
 * We would want to have defaults set for, or are regularly displaying over 
 * multiple sessions.
 * 
 * It doesn't allow keys not defined in defaults.json to be created. 
 */
export const DataProvider = ({ children }) => {
    const data = useRef(null);
    const [dataLoaded, setLoaded] = useState(false);

    // This would technically run on every initial render but because
    // DataProvider is in the Root layout, only one will EVER be displayed
    useEffect(() => {
        const load = async () => {
            if (!dataLoaded) { // Not necessary, but seemed like good practice
                let start = Date.now(); // Track loading time

                // If no values, set defaults
                await setDefaults("userdata");
                await setDefaults("gamedata");

                // Get the (app data) stored values
                let userdata = await getSavedData("userdata");
                let gamedata = await getSavedData("gamedata");

                // Set the current state
                data.current = { ...userdata, ...gamedata };
                // Prevent additional keys from being created
                Object.seal(data.current);

                // The levels were loaded
                setLoaded(true);

                let end = Date.now();
                console.log(`Data Load Time: ${(end - start)/1000} seconds`);
            }
        }
        load()
    }, []);
    
    /**
     * Get an item from memory (RAM)
     * @param {String} key The item to retreive
     * @returns The item value
     */
    const getItem = (key) => {
        // Ensure all inputs are Strings
        key = String(key);

        // The data hasn't loaded
        if (!data.current) {
            throw new Error('The data has not finished loading.');
        }
        // Invalid key
        else if (!Object.keys(data.current).includes(key)) {
            throw new Error(`The item '${key}' does not exist.`);
        }

        // Return the value
        return data.current[key];
    }

    /**
     * Get all keys for a specific type of data
     * @param {String} type The category the value falls under (e.g. 'userdata', 'gamedata')  
     */
    const getKeys = (type) => {
        // The category does not exist
        if (!Object.keys(defaults).includes(type)) {
            throw new Error(`The data category '${type}' does not exist.`);
        }

        // Return the keys
        return Object.keys(defaults[type]);
    }

    /**
     * Save a key-value to the memory (RAM)
     * @param {String} key The item being changed
     * @param {String} value The updated value
     */
    const setItem = (key, value) => {
        // Ensure all inputs are Strings
        key = String(key);
        value = String(value);

        // The data hasn't loaded
        if (!data.current) {
            throw new Error('The data has not finished loading.');
        }
        // Invalid key
        else if (!Object.keys(data.current).includes(key)) {
            throw new Error(`The item '${key}' does not exist.`);
        }

        // Update the saved memory data
        data.current[key] = value;
    }

    /**
     * Save a list of keys to app storage
     * @param {Array<String>} keys List of keys to save 
     */
    const saveItems = async (...keys) => {
        // Convert to string to be safe
        keys = keys.map(key => String(key));
        
        // No keys were provided
        if (keys.length === 0) {
            throw new Error('Invalid Keys: Empty list.');
        }

        // The provided keys aren't all valid keys
        let keysFound = keys.filter(key => Object.keys(data.current).includes(key));
        if (keysFound.length < keys.length) {
            throw new Error(`The following items do not exist: ${keys.filter(key => !keysFound.includes(key))}`);
        }

        // Save all keys
        for (let key of keys) {
            key = String(key); // Convert to string to be safe

            console.log(`Writing '${key}' to app storage.`);
            await AsyncStorage.setItem(key, data.current[key]).catch(e => console.error);
            console.log(`Finished writing '${key}' successfully.`);
        }
    }

    return (
        <DataContext.Provider value={{ dataLoaded, getItem, getKeys, setItem, saveItems }}>
            {children}
        </DataContext.Provider>
    );
};

// Return the set level data
/**
 * @returns {Object} { dataLoaded, getItem, getKeys, setItem, saveItems }
 */
export const useData = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error('useLevel must be used within a DataProvider');
    return context;
}