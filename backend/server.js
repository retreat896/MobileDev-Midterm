import "dotenv/config";
import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { MongoClient, ObjectId } from "mongodb";
import path from "path";
import { fileURLToPath } from "url";
import { v4 as UUIDv4 } from 'uuid';

// ----- Database Setup -----
const uri = process.env.DB_LINK;

if (!uri) {
    console.log("Warning: DB_LINK not found in .env");
}

// Initialize database stuff
const client = new MongoClient(uri);
await client.connect();
const db = client.db("MobileFinal");
const usersCollection = db.collection("users");
const playerdataCollection = db.collection("playerdata");
const leveldataCollection = db.collection("leveldata");
console.log("Connected to MongoDB");

// ----- Express App -----
const app = express();

app.use(
    cors({
        origin: "*",
        credentials: true,
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ----- (INSECURE) Auth Middleware -----
const validateUser = async (req, res, next) => {
    // Pull the UUID from the request body, otherwise the request path
    const { uuid } = req.body || req.params;
    
    // Check the user exists
    const user = usersCollection.findOne({ uuid });

    if (!user) {
        return res.status(404).json({
            detail: "Player not found"
        });
    }

    next();
};

// ----- ROUTES -----
app.post("/player", async (req, res) => {
    try {
        // Get the username from the request
        const { username } = req.body;

        // 2. Check if user exists
        const found = await usersCollection.findOne({ username });

        // User already exists
        if (found) {
            return res.status(409).json({
                detail: "User with this username already exists",
            });
        }

        // 3. Create a new UUID
        const uuid = UUIDv4();

        // 4. Create User Document
        const newUser = {
            username,
			uuid,
            created_at: new Date(),
            updated_at: new Date(),
        };

        // 5. Insert into MongoDB
        // Insert the User document
        await usersCollection.insertOne(newUser);
        // Insert a blank playerdata document
        await playerdataCollection.insertOne({ uuid });

        // Return the UUID
        res.status(201).json({
            message: "User created successfully",
            uuid,
        });
    } catch (e) {
        console.error("Signup error:", e);
        res.status(500).json({ detail: `Database error: ${e.message}` });
    }
});


app.put("/player/:uuid/name", validateUser, async (req, res) => {
    try {
        // Get the UUID & Username from the request
        const { uuid } = req.params;
        const { username } = req.body;

        // Check if user exists
        const found = await usersCollection.findOne({ uuid });

        // User does not exist
        if (!found) {
            return res.status(404).json({ detail: "Player not found" });
        }

        // Update the User document
        await usersCollection.updateOne({ uuid }, {
            $set: {
                username,
                updated_at: new Date()
            }
        });
        
        // Return the UUID
        res.status(201).json({
            message: "Username updated successfully"
        });
    } catch (e) {
        console.error("Username error:", e);
        res.status(500).json({ detail: `Database error: ${e.message}` });
    }
});

// ----- Playerdata Routes -----
app.get("/player/:uuid", validateUser, async (req, res) => {
    try {
		// Get the UUID from the path
		const { uuid } = req.params;

        const playerdata = await playerdataCollection.findOne({ uuid });

        if (!playerdata) {
            return res.status(404).json({ detail: "Player not found" });
        }

        res.json(playerdata);
    } catch (e) {
        console.error("Database error:", e);

        if (e.name === "MongoError" || e.name === "MongoServerError") {
            res.status(503).json({ detail: "Database not reachable" });
        } else {
            res.status(500).json({ detail: "Internal server error" });
        }
    }
});

// Use PUT because the server automatically creates an existing entry in MongoDB
// No need to POST (Create) it.
app.put("/player/:uuid", validateUser, async (req, res) => {
    try {
		// Get the UUID from the path
		const { uuid } = req.params;
		
		// TODO: Add correct playerdata scores
        const { HighScore, TotalTimePlayed, LongestGame, TimeElapsed } = req.body;

        // Find the playerdata
        const playerdata = await playerdataCollection.findOne({ uuid });

        if (!playerdata) {
            console.log("Player not found");
            return res.status(404).json({ detail: "Player not found" });
        }

        // Use Try-Catch to prevent malicious data
        try {
            // Update the scores
            const updates = {
                HighScore: Number.parseInt(HighScore),
                TotalTimePlayed: Number.parseInt(TotalTimePlayed),
                TimeElapsed: Number.parseInt(TimeElapsed),
                LongestGame: Number.parseInt(LongestGame),
            };

            // Update document in MongoDB
            await playerdataCollection.updateOne({ uuid }, { $set: updates });

            res.json({ message: "Playerdata updated successfully" });
        }
        catch {
            return res.status(400).json({ detail: "Something went wrong saving data" });
        }

    } catch (e) {
        console.error("Update error:", e);

        if (e.name === "MongoError" || e.name === "MongoServerError") {
            res.status(503).json({ detail: "Database not reachable" });
        } else {
            res.status(500).json({ detail: "Internal server error" });
        }
    }
});

// ----- Leveldata Routes -----
app.get("/level/:key", validateUser, async (req, res) => {
    try {
		// TODO: Implement key for leveldata
		const { key } = req.params;

		// Get the leveldata
        const leveldata = await leveldataCollection.findOne({ key });

		if (!leveldata) {
			console.log("Leveldata not found!");
			res.status(404).json({ detail: "Level not found"});
		}
		else {
			res.json(leveldata);
		}
    } catch (e) {
        console.error("Database error:", e);

        if (e.name === "MongoError" || e.name === "MongoServerError") {
            res.status(503).json({ detail: "Database not reachable" });
        } else {
            res.status(500).json({ detail: "Internal server error" });
        }
    }
});

// ----- Start Server -----
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
