# Application Tasks

## High Priority

- [ ] **Add Mongo-DB interactions.**
    - Implement retreive/update player data.
    - Implement retreive level data

- [ ] **Implement Username on inital load.**
    - Implement a username input screen that is displayed on initial load.
    - Implement a username storage system that stores the username in the database.
    - Implement a username changing system that allows the user to change their username.
     
- [ ] **Add more finalized backgrounds.**
    - Add background images that are thematically related to the game.
    - Update `Level` objects to use these new backgrounds.
     
- [ ] **Fix aspect ratio and handle black bars.**
    - Enforce a specific aspect ratio (e.g., 16:9).
    - Wrap the game view in a container that maintains this ratio and adds black bars (letterboxing/pillarboxing) for other screen sizes.

## Medium Priority

- [ ] **Finish path tracing to have an end point that causes damage.**
    - Implement a raycast/laser mechanic that instantly hits the first enemy in its path.
    - Ensure it deals damage correctly.

- [ ] **Add bullet bloom (small amount).**
    - Add a small random variation to the projectile's firing angle in `SingleTouch.fireProjectile`.

- [ ] **Fix bullet offset and player image offset.**
    - Adjust the rendering coordinates in `GameScreen` to align the player image and projectile spawn point correctly with the logical position.

## Suggested Improvements

- [ ] **Implement Game Over Screen.**
    - `app/GameOver.jsx` is currently empty. Create a screen that shows the final score, high score, and allows restarting or returning to the main menu.

- [ ] **Add Audio/Sound Effects.**
    - Add background music.
    - Add sound effects for shooting, enemy hits, player damage, and game over.

- [ ] **Implement Difficulty Scaling.**
    - Decrease the enemy spawn interval as the game progresses to increase difficulty.

- [ ] **Add more Enemy Types.**
    - Create subclasses of `Enemy` with different speeds, health, and behaviors (e.g., shooting enemies).

- [ ] **Power-ups.**
    - Add power-ups (e.g., rapid fire, health packs, spread shot) to make the game more engaging.

- [x] **Add a loading screen pre-app launch.**
    - Implement a splash screen or loading animation that displays before the main game content is fully loaded.
  
