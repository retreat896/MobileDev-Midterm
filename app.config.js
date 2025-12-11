import dotenv from "dotenv";

dotenv.config();

export default {
    expo: {
        extra: {
            ...process.env,
        },
    },
};
