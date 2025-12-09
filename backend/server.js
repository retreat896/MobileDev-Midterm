import "dotenv/config";
import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { MongoClient, ObjectId } from "mongodb";
import path from "path";
import { fileURLToPath } from "url";
import { v4 as uuid } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ----- Database Setup -----
const uri = process.env.DB_LINK;

if (!uri) {
    console.log("Warning: DB_LINK not found in .env");
}

// Initialize database stuff
let db,
    usersCollection,
    playerdataCollection,
    leveldataCollection;

try {
    const client = new MongoClient(uri);
    await client.connect();
    db = client.db("cs3720db");
    usersCollection = db.collection("users");
    playerdataCollection = db.collection("playerdata");
	leveldataCollection = db.collection("leveldata");
    console.log("Connected to MongoDB");
} catch (e) {
    console.log(`Error connecting to MongoDB: ${e}`);
}

// ----- Helper Functions -----

const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);
    return hashed;
};

const verifyPassword = async (plainPassword, hashedPassword) => {
    return await bcrypt.compare(plainPassword, hashedPassword);
};

const createJwtToken = (data, expiresIn = null) => {
    const secret = process.env.SECRET_KEY || "default_secret_please_change";
	const expiry = process.env.ACCESS_TOKEN_EXPIRY || "15m";

    const options = { expiresIn: expiry };

    return jwt.sign(data, secret, options);
};

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

// ----- Auth Middleware -----
const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            detail: "Could not validate credentials",
        });
    }

    try {
        const secret = process.env.SECRET_KEY || "default_secret_please_change";
        const algorithm = process.env.ALGORITHM || "HS256";
        const payload = jwt.verify(token, secret, { algorithms: [algorithm] });

        if (!payload.sub) {
            return res.status(401).json({
                detail: "Could not validate credentials",
            });
        }

        req.user = payload.sub;
        next();
    } catch {
        return res.status(401).json({
            detail: "Could not validate credentials",
        });
    }
};

// ----- ROUTES -----

app.get("/", (req, res) => {
    const indexPath = path.join(__dirname, "index.html");

    res.sendFile(indexPath, (err) => {
        if (err) {
            res.json({
                message: "Welcome to the Robot API (index.html not found)",
            });
        }
    });
});

app.post("/signup", async (req, res) => {
    try {
        const { username, password } = req.body;

        // 1. Check if user exists
        const found = await usersCollection.findOne({ username });

        if (found) {
            return res.status(400).json({
                detail: "User with this username already exists",
            });
        }

        // 2. Hash Password
        const hashedPw = await hashPassword(password);

        // 3. Create User Document
        const newUser = {
            username,
            password: hashedPw,
			uuid: new uuid(),
            created_at: new Date(),
        };

        // 4. Insert into MongoDB
        await usersCollection.insertOne(newUser);

        res.status(201).json({
            message: "User created successfully",
            username,
        });
    } catch (e) {
        console.error("Signup error:", e);
        res.status(500).json({ detail: `Database error: ${e.message}` });
    }
});

app.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await usersCollection.findOne({ username: username });

        if (!user || !(await verifyPassword(password, user.password))) {
            return res.status(401).json({
                detail: "Incorrect username or password",
            });
        }

        const accessToken = createJwtToken({ sub: user.uuid });

        res.json({ token: accessToken });
    } catch (e) {
        console.error("Login error:", e);
        res.status(500).json({ detail: "Internal server error" });
    }
});

// ----- Playerdata Routes -----

app.get("/player/:uuid", authenticateToken, async (req, res) => {
    try {
		// Get the UUID from the path
		const { uuid } = req.params;

        const playerdata = await playerdataCollection.findOne({ uuid });

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

app.post("/player/:uuid", authenticateToken, async (req, res) => {
    try {
		// Get the UUID from the path
		const { uuid } = req.params;

		// TODO: Add correct playerdata scores
        const { highscore, totalTimeElapsed, longestGamePlayed } = req.body;

        // Verify user exists
        const user = await usersCollection.findOne({ uuid });

        if (!user) {
            return res.status(409).json({
                detail: "Player does not exist",
            });
        }

        // Insert into database
        await playerdataCollection.insertOne({
            highscore,
            totalTimeElapsed,
            longestGamePlayed,
        });

        res.status(201).json({ message: "Playerdata added successfully" });
    } catch (e) {
        console.error("Database error:", e);

        if (e.name === "MongoError" || e.name === "MongoServerError") {
            res.status(503).json({ detail: "Database not reachable" });
        } else {
            res.status(500).json({ detail: "Internal server error" });
        }
    }
});

app.put("/player/:uuid", authenticateToken, async (req, res) => {
    try {
		// Get the UUID from the path
		const { uuid } = req.params;
		
		// TODO: Add correct playerdata scores
        const { highscore, totalTimeElapsed, longestGamePlayed } = req.body;

        // Find the playerdata
        const playerdata = await playerdataCollection.findOne({ uuid });

        if (!playerdata) {
            console.log("Player not found");
            return res.status(404).json({ detail: "Player not found" });
        }

        // Update the scores
        const updates = {
            highscore,
            totalTimeElapsed,
            longestGamePlayed,
        };

        await playerdataCollection.updateOne({ uuid }, { $set: updates });

        res.json({ message: "Playerdata updated successfully" });
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

app.get("/level/:key", authenticateToken, async (req, res) => {
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
