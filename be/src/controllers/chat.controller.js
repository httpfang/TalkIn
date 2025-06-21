import { genertateStreamToken } from "../lib/stream.js";

export async function getStreamToken(req, res) {
    try {
        const token = genertateStreamToken(req.user.id)

        res.status(200).json({token}) // not a jwt token this token help us to do all sort of communication 
    } catch (error) {
        console.log("error in getStreamToken conyroller", error.message)
        res.status(500).json({message: "internal server error"})
    }
}