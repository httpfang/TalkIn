import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getMyFriends, getRecommendedUsers, sendFriendRequest, acceptFriendRequest, getFriendRequests, getOutgoingFriendRequests } from "../controllers/user.controller.js";

const router = express.Router();
router.use(protectRoute); // this will add auth middleware to all the routes below it

router.get("/", getRecommendedUsers);
router.get("/friends", getMyFriends);
router.post("/friend-request/:id", sendFriendRequest);
router.get("/friend-requests", getFriendRequests);
router.put("/friend-request/:id/accept", acceptFriendRequest);
router.get("/friend-requests/outgoing", getOutgoingFriendRequests);

// reject friend request
// delete friend

export default router;