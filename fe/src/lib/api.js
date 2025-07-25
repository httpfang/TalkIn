import { axiosInstance } from "./axios";

export const signup = async (signupData) => {
  const response = await axiosInstance.post("/auth/signup", signupData);
  return response.data;
};

export const login = async (loginData) => {
  const response = await axiosInstance.post("/auth/login", loginData);
  return response.data;
};
export const logout = async () => {
  const response = await axiosInstance.post("/auth/logout");
  return response.data;
};

export const getAuthUser = async () => {
  try {
    const res = await axiosInstance.get("/auth/me");
    return res.data;
  } catch (error) {
    console.log("Error in getAuthUser:", error);
    return null;
  }
};

export const completeOnboarding = async (userData) => {
  const response = await axiosInstance.post("/auth/onboarding", userData);
  return response.data;
};

export async function getUserFriends() {
  const response = await axiosInstance.get("/users/friends");
  return response.data.user;
}

export async function getRecommendedUsers() {
  const response = await axiosInstance.get("/users");
  return response.data.recommendedUsers;
}

export async function getOutgoingFriendReqs() {
  const response = await axiosInstance.get("/users/friend-requests/outgoing");
  return response.data.outgoingFriendRequests;
}

export async function sendFriendRequest(userId) {
  const response = await axiosInstance.post(`/users/friend-request/${userId}`);
  return response.data;
}

export async function getFriendRequests() {
  const response = await axiosInstance.get("/users/friend-requests");
  return response.data;
}

export async function acceptFriendRequest(requestId) {
  const response = await axiosInstance.put(`/users/friend-request/${requestId}/accept`);
  return response.data;
}

export async function getStreamToken() {
  const response = await axiosInstance.get("/chat/token");
  return response.data;
}

export const getGroups = () => axiosInstance.get("/groups");
export const createGroup = (data) => axiosInstance.post("/groups", data);
export const joinGroup = (id) => axiosInstance.post(`/groups/${id}/join`);
export const leaveGroup = (id) => axiosInstance.post(`/groups/${id}/leave`);
export const removeGroupMember = (groupId, userId) => axiosInstance.delete(`/groups/${groupId}/member/${userId}`);

export async function markAllNotificationsRead() {
  const response = await axiosInstance.put("/users/notifications/mark-all-read");
  return response.data;
}
