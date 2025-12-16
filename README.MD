# 🎯 Midterm Evaluation

![GitHub Commit Activity](https://img.shields.io/github/commit-activity/m/retreat896/MobileDev-Midterm?color=blue&logo=github) ![Last Commit](https://img.shields.io/github/last-commit/retreat896/MobileDev-Midterm?color=green)

### 🔫 Shooter – A 2D Top-Down React Native Game

This project showcases a simple yet engaging **2D top-down shooter game** built using **React Native** and **Expo**. Developed as part of **CS3720 Mobile Application Development (Fall 2025)** under the guidance of **Dr. Abraham Aldaco** at **UW Platteville**.

---

## 🎯 Objective

> To design and implement a multi-screen mobile game that demonstrates modular design, interactivity, and smooth navigation using **Expo Router**.

The app features:

* A **Main Menu** screen with navigation controls 🎮  
* A **Game Screen** where the player can shoot incoming enemies 💥  
* A **Game Over Screen** showing the player’s score and restart option 🧾

---

## 🧩 Features

| Screen | Description |
|:---|:---|
| 🏠 **Main Menu** | Displays game title, team info, and a button to start the game. Also includes a player stats screen.  |
| 🎮 **Game Screen** | The main gameplay area. The player remains **fixed at the right** of the screen and cannot move. Enemies spawn from the left and move horizontally toward the right. Tapping the screen fires projectiles that can destroy enemies. |
| 💀 **Game Over Screen** | Displays the final score after the player loses, with an option to restart or return to the main menu. |

---

## 🛠️ Tech Stack

* ⚛️ **React Native** (via Expo)
* 🧭 **Expo Router** for navigation
* 💣 **Custom Game Loop** for projectile and enemy updates using react-native-game-loop
* 🎨 **Modularized styles** for consistent design and layout

---

## 🚀 Getting Started

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/retreat896/MobileDev-Midterm.git
cd MobileDev-Midterm
````

### 2️⃣ Install Dependencies

```bash
npm install
# or
yarn install


# and
cd backend && npm install
# or
cd backend && yarn install
```

### 3️⃣ Build the App

```bash
npm run android
```

🪟 Wait for it to build and open.

---

### 4️⃣ Run the App

```bash
npm run dev
```

📱 Using the Keyboard controls in Expo, launch the application in Android using the "a" key.

---

### Build the final APK (locally)

```bash
eas build --platform android --profile preview --local
```

📱 This requires a Linux operating system, Java JDK 22, and Android Studio installed with proper PATH variables.

---

## 📂 Project Structure

```
Mobile-Midterm/
├── app/
│   ├── index.jsx               # Main Menu
│   ├── GameScreen.jsx          # Game Screen
│   ├── GameOver.jsx            # Game Over Screen
│   ├── info.jsx                # Info / About Screen
│   └── _layout.jsx             # App Wrapper
├── assets/                     # Images & static resources
│   └───fonts/
├── components/                 # Reusable UI Components
│   ├───game/
│   │   ├───GameCanvas.jsx
│   │   ├───GameHUD.jsx
│   │   └───PauseMenu.jsx
│   ├───menu/
│   │   ├───ConfirmDialog.jsx
│   │   ├───CoolerButton.jsx
│   │   ├───InfoDialog.jsx
│   │   ├───LevelSelect.jsx
│   │   ├───MainMenu.jsx
│   │   └───Wrapper.jsx
│   ├── DataContext.jsx         # Global Data State
│   ├── LevelContext.jsx        # Level Management
│   └── SplashScreen.jsx        # Custom Loading Screen
├── modules/                    # Shared logic (e.g., game logic)
│   └───game/
│       ├───CollisionDetector.js
│       ├───Enemy.js
│       ├───EnemySpawner.js
│       ├───Player.js
│       └───Projectile.js
├── styles/                     # Reusable StyleSheets
│   ├───main.jsx
│   └───game.jsx
├── .gitignore
├── App-Wireframe.excalidraw    # Proposed App Layout
├── app.json
├── babel.config.js
├── dev.js                      # Custom Dev Runner
├── package-lock.json
├── package.json
├── README.md
└── tsconfig.json
```

---

## 🧠 Learning Outcomes

| Week | Learning Outcome |
|:----:|:------------------|
|      | Implement multi-screen navigation using **Expo Router** |
|      | Build and manage a **tap-to-shoot 2D game loop** in React Native |
|      | Apply **modular design** and reuse components effectively |
|      | Integrate **state management hooks** (`useState`, `useEffect`) for interactivity |
|      | Handle **touch input** and collision logic responsively |
|      | Maintain a **clean folder structure** and well-commented code |
|      | Document **Generative AI** usage and its impact on the development process |
|      | Design and balance UI for **aesthetic layout and clarity** |
|      | Prepare **video demonstration** and project **report (PDF)** as per requirements |

---

## 🤖 Generative AI Acknowledgment

* Code generation assistance for boilerplate logic and refactoring.

---

## 🤝 Contributors

| Name                   | Role                 | Email                                               |
| :--------------------- | :------------------- | :-------------------------------------------------- |
| 👩‍💻 Kristopher Adams | Developer / Designer | [adamskri@uwplatt.edu](mailto:adamskri@uwplatt.edu) |
| 👨‍💻 Jacob Malland    | Developer / Tester   | [mallandj@uwplatt.edu](mailto:mallandj@uwplatt.edu) |

---

## 📊 Commit Graph & Insights

### 🔍 Contribution Overview

![GitHub Commit Activity](https://img.shields.io/github/commit-activity/m/retreat896/MobileDev-Midterm?color=blue\&logo=github) ![Last Commit](https://img.shields.io/github/last-commit/retreat896/MobileDev-Midterm?color=green)

### 📈 Graphs & Analytics

[![GitHub Graphs](https://github-readme-activity-graph.vercel.app/graph?username=retreat896\&repo=MobileDev-Midterm\&theme=react-dark)](https://github.com/retreat896/MobileDev-Midterm)

[![GitHub Graphs](https://github-readme-activity-graph.vercel.app/graph?username=JMalland\&repo=MobileDev-Midterm\&theme=react-dark)](https://github.com/retreat896/MobileDev-Midterm)

---

## 🧾 Appendix

* 📘 Course: CS3720 Mobile Application Development
* 🧑‍🏫 Instructor: Dr. Abraham Aldaco
* 🗓️ Term: Fall 2025
* 🧩 Assignment: Final Project - Multi-Screen React Native App (Shooter Game)

---

## 🏁 License

This project is for **educational purposes only** as part of **UW Platteville CS3720 coursework**.
Feel free to explore, fork, and learn from it — creativity encouraged! 🚀

---

⭐ **If you found this project interesting, give it a star on GitHub!** ⭐

```

---
