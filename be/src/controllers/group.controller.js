import Group from "../models/Group.js";

export async function createGroup(req, res) {
  try {
    const { name, description } = req.body;
    const userId = req.user.id;
    const group = await Group.create({
      name,
      description,
      members: [userId],
      admins: [userId]
    });
    res.status(201).json({ message: "Group created", group });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function getGroups(req, res) {
  try {
    const groups = await Group.find().populate("members", "fullName profilePicture").populate("admins", "fullName profilePicture");
    res.status(200).json({ groups, userId: req.user.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function getGroupById(req, res) {
  try {
    const group = await Group.findById(req.params.id).populate("members", "fullName profilePicture").populate("admins", "fullName profilePicture");
    if (!group) return res.status(404).json({ message: "Group not found" });
    res.status(200).json({ group });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function joinGroup(req, res) {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ message: "Group not found" });
    if (group.members.includes(req.user.id)) return res.status(400).json({ message: "Already a member" });
    group.members.push(req.user.id);
    await group.save();
    res.status(200).json({ message: "Joined group", group });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function leaveGroup(req, res) {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ message: "Group not found" });
    group.members = group.members.filter(id => id.toString() !== req.user.id);
    group.admins = group.admins.filter(id => id.toString() !== req.user.id);
    await group.save();
    res.status(200).json({ message: "Left group", group });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function updateGroup(req, res) {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ message: "Group not found" });
    if (!group.admins.includes(req.user.id)) return res.status(403).json({ message: "Not an admin" });
    const { name, description } = req.body;
    if (name) group.name = name;
    if (description) group.description = description;
    await group.save();
    res.status(200).json({ message: "Group updated", group });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function deleteGroup(req, res) {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ message: "Group not found" });
    if (!group.admins.includes(req.user.id)) return res.status(403).json({ message: "Not an admin" });
    await group.deleteOne();
    res.status(200).json({ message: "Group deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function removeMember(req, res) {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ message: "Group not found" });
    if (!group.admins.includes(req.user.id)) return res.status(403).json({ message: "Not an admin" });
    const userId = req.params.userId;
    if (userId === req.user.id) return res.status(400).json({ message: "Admin cannot remove themselves" });
    group.members = group.members.filter(id => id.toString() !== userId);
    group.admins = group.admins.filter(id => id.toString() !== userId);
    await group.save();
    res.status(200).json({ message: "Member removed", group });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
} 