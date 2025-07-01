import { StreamChat } from "stream-chat";
import "dotenv/config"

const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

if(!apiKey || !apiSecret) {
    console.log("STREAM_API_KEY and STREAM_API_SECRET are required");
}

// Initialize Stream client with increased timeout
const streamClient = StreamChat.getInstance(apiKey, apiSecret, {
    timeout: 10000, // Increase timeout to 10 seconds
    retryAttempts: 3, // Add retry attempts
});

export const upsertStreamUser = async (userData, retryCount = 0) => {
    const maxRetries = 2;
    
    try {
        await streamClient.upsertUsers([userData]); // upsertUsers help to create a new user or update an existing user
        console.log(`Stream user created/updated successfully for user ${userData.name}`);
        return userData;
    } catch (error) {
        if ((error.code === 'ECONNABORTED' || error.message.includes('timeout')) && retryCount < maxRetries) {
            console.log(`Stream API timeout - retrying (${retryCount + 1}/${maxRetries})...`);
            // Wait 1 second before retrying
            await new Promise(resolve => setTimeout(resolve, 1000));
            return upsertStreamUser(userData, retryCount + 1);
        } else if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
            console.log("Stream API timeout after retries - this is usually temporary. User creation may still succeed.");
        } else {
            console.log("Error in upserting stream user:", error.message);
        }
        // Don't throw the error - let the application continue
        return userData;
    }
}


export const generateStreamToken = async (userId) => {
    try {
        // ensuring user id is string
        const userIdStr = userId.toString()
        return streamClient.createToken(userIdStr)
    } catch (error) {
        console.error("error generating stream token", error)
        throw error; // Re-throw the error so the controller can handle it
    }
}

// Keep the old function name for backward compatibility
export const genertateStreamToken = generateStreamToken;

