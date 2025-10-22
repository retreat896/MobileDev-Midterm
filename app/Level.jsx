class Level {
    #image={};
    #name="";
    
    /**
     * Create a new Level object
     * @param {*} name The name of the level
     */
    constructor(name) {
        this.#name = name;
    }

    /**
     * Get the source for the Level image
     * @returns The image source (for rendering)
     */
    getImage() {
        return this.#image;
    }

    /**
     * Get the Level name
     * @returns The name of the Level
     */
    getName() {
        return this.#name;
    }

    /**
     * Set the Level image to a local image
     * @param {*} requiredImage The returned value of require('/image/filepath.jpg')
     * @returns The Level object
     */
    setImage(requiredImage) {
        this.#image = requiredImage;
        return this;
    }

    /**
     * Set the Level image to a URL image
     * @param {*} url The image URL
     * @returns The Level object
     */
    setImageURI(url) {
        this.#image = {
            uri: url,
            other: 'test',
        };
        return this;
    }
}

// Export the Level class
export default Level;