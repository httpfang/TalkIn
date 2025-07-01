import FriendRequest from "../models/FriendRequest.js";
import User from "../models/User.js";

export async function getRecommendedUsers(req, res) {

    try{
        const currentUserId = req.user.id;
        const currentUser = req.user;
        
        // Get users who have sent friend requests to current user
        const incomingRequests = await FriendRequest.find({
            sender: { $ne: currentUserId },
            recipient: currentUserId,
            status: "pending"
        }).select("sender");
        const incomingRequestUserIds = incomingRequests.map(req => req.sender);
        
        // Get users to whom current user has sent friend requests
        const outgoingRequests = await FriendRequest.find({
            sender: currentUserId,
            status: "pending"
        }).select("recipient");
        const outgoingRequestUserIds = outgoingRequests.map(req => req.recipient);
        
        const recommendedUsers = await User.find({
            $and: [
                { _id: { $ne: currentUserId } }, // exclude the current user from the recommended users
                { _id: { $nin: currentUser.friends } }, // exclude the friends of the current user from the recommended users
                { _id: { $nin: incomingRequestUserIds } }, // exclude users who have sent friend requests to current user
                { _id: { $nin: outgoingRequestUserIds } }, // exclude users to whom current user has sent friend requests
                { isOnboarded: true }, // only onboarded users
            ]
        }).select("fullName profilePicture nativeLanguage learningLanguage location bio");
        
        res.status(200).json({ message: "Recommended users fetched successfully", recommendedUsers });
    }
    catch(error){
        console.error("Error in getRecommendedUsers controller", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

export async function getMyFriends(req, res) {
    try {
        const user = await User.findById(req.user.id)
        .select("friends")
        // populate the friends field with the user's friends
        .populate("friends", "fullName profilePicture nativeLanguage learningLanguage");
        
        res.status(200).json({ message: "My friends fetched successfully", user: user.friends });
    } catch (error) {
        console.error("Error in getMyFriends controller", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

export async function sendFriendRequest(req, res) {
  try {
    const myId = req.user.id;
    const { id: recipientId } = req.params;
    // prevent sending to yourself
    if (myId === recipientId)
      return res
        .status(400)
        .json({ message: "You cannot send a friend request to yourself" });
    // check if the recipient exists
    const recipient = await User.findById(recipientId);
    if (!recipient)
      return res.status(404).json({ message: "recipient not found" });
    // check if the recipient is already in the friends list
    if (recipient.friends.includes(myId))
      return res
        .status(400)
        .json({ message: "recipient is already in your friends list" });
    // check if the recipient has already sent a friend request to me
    const existingRequest = await FriendRequest.findOne({
      sender: recipientId,
      recipient: myId,
    });
    if (existingRequest)
      return res
        .status(400)
        .json({ message: "Friend request already sent" });
    // check if I have already sent a friend request to the recipient
    const myExistingRequest = await FriendRequest.findOne({
      sender: myId,
      recipient: recipientId,
    });
    if (myExistingRequest)
      return res
        .status(400)
        .json({ message: "Friend request already sent" });
    // create a new friend request
    const friendRequest = await FriendRequest.create({
      sender: myId,
      recipient: recipientId,
    });
    res.status(200).json({ message: "Friend request sent successfully", friendRequest });
  } catch (error) {
    console.error("Error in sendFriendRequest controller", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
}

export async function acceptFriendRequest(req, res) {
    try {
        const {id: requestId} = req.params;
        const friendRequest = await FriendRequest.findById(requestId);
        if(!friendRequest) return res.status(404).json({message: "request not found"}); 
        
        // verify the current user is the recipient 
        if(friendRequest.recipient.toString() !== req.user.id) return res.status(400).json({message: "You are not the recipient of this request"});
        friendRequest.status = "accepted";
        await friendRequest.save();
        // add each user to others friends list/array
        // addtoset: add elemnts to an array only if they do not alredy exist in the array
        // here addToSet is used to add the recipient to the sender's friends list if it is not already there
        // and add the sender to the recipient's friends list if it is not already there
        await User.findByIdAndUpdate(friendRequest.sender, {$addToSet: {friends: friendRequest.recipient}});
        await User.findByIdAndUpdate(friendRequest.recipient, {$addToSet: {friends: friendRequest.sender}});
        res.status(200).json({message: "Friend request accepted successfully", friendRequest});
    } catch (error) {
        console.error("Error in acceptFriendRequest controller", error);
        res.status(500).json({message: "Internal server error", error: error.message});
    }
}

export async function getFriendRequests(req, res) {
    try {
        const incomingFriendRequests = await FriendRequest.find({recipient: req.user.id, status: "pending"}).populate("sender", "fullName profilePicture nativeLanguage learningLanguage");
        const acceptedFriendRequests = await FriendRequest.find({sender: req.user.id, status: "accepted"}).populate("recipient", "fullName profilePicture");    
        res.status(200).json({message: "Friend requests fetched successfully", incomingFriendRequests, acceptedFriendRequests});
    } catch (error) {
        console.error("Error in getFriendRequests controller", error);
        res.status(500).json({message: "Internal server error", error: error.message});
    }
}

export async function getOutgoingFriendRequests(req, res) {
    try {
        const outgoingFriendRequests = await FriendRequest.find({sender: req.user.id, status: "pending"}).populate("recipient", "fullName profilePicture nativeLanguage learningLanguage");
        res.status(200).json({message: "Outgoing friend requests fetched successfully", outgoingFriendRequests});
    } catch (error) {
        console.error("Error in getOutgoingFriendRequests controller", error);
        res.status(500).json({message: "Internal server error", error: error.message});
    }
}