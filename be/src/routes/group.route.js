import express from "express";
import { createGroup, getGroups, getGroupById, joinGroup, leaveGroup, updateGroup, deleteGroup, removeMember } from "../controllers/group.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protectRoute, createGroup);
router.get("/", protectRoute, getGroups);
router.get("/:id", protectRoute, getGroupById);
router.post("/:id/join", protectRoute, joinGroup);
router.post("/:id/leave", protectRoute, leaveGroup);
router.put("/:id", protectRoute, updateGroup);
router.delete("/:id", protectRoute, deleteGroup);
router.delete("/:id/member/:userId", protectRoute, removeMember);

export default router; 