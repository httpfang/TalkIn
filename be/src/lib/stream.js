import { StreamChat } from "stream-chat";
import "dotenv/config"

const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

if(!apiKey || !apiSecret) {
    console.log("STREAM_API_KEY and STREAM_API_SECRET are required");
}

const streamClient = StreamChat.getInstance(apiKey, apiSecret); // using this we can communicate with our stream client/dashboard
export const upsertStreamUser = async (userData) => {
    try {
        await streamClient.upsertUsers([userData]); // upsertUsers help to create a new user or update an existing user
        return userData;
    } catch (error) {
      console.log("Error in upserting stream user", error);
    }
}


export const genertateStreamToken = async (userId) => {
    try {
        // ensuring user id is string
        const userIdStr = userId.toString()
        return streamClient.createToken(userIdStr)
    } catch (error) {
        console.error("error generating stream token", error)
    }
}

