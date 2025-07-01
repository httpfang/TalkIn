import React, { useEffect, useState } from "react";
import GroupCard from "../components/GroupCard";
import { getGroups, createGroup, joinGroup, leaveGroup, getStreamToken } from "../lib/api";
import useAuthUser from "../hooks/useAuthUser";
import { StreamChat } from "stream-chat";

const GroupsPage = () => {
  const { authUser } = useAuthUser();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [newGroup, setNewGroup] = useState({ name: "", description: "" });
  const [creating, setCreating] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [callStatus, setCallStatus] = useState({});

  const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

  useEffect(() => {
    const fetchGroups = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await getGroups();
        setGroups(res.data.groups);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load groups");
      }
      setLoading(false);
    };
    fetchGroups();
  }, [refresh]);

  useEffect(() => {
    const checkOngoingCalls = async () => {
      if (!groups.length) return;
      const client = StreamChat.getInstance(STREAM_API_KEY);
      const tokenRes = await getStreamToken();
      await client.connectUser(
        {
          id: authUser._id,
          name: authUser.fullName,
          image: authUser.profilePicture,
        },
        tokenRes.token
      );
      const status = {};
      await Promise.all(groups.map(async (group) => {
        const channelId = `group-${group._id}`;
        const channel = client.channel("messaging", channelId);
        await channel.watch();
        const messages = channel.state.messages;
        const now = Date.now();
        const callMsg = messages.find(msg =>
          msg.text &&
          msg.text.includes(`/call/group-${group._id}`) &&
          now - new Date(msg.created_at).getTime() < 10 * 60 * 1000
        );
        status[group._id] = !!callMsg;
      }));
      setCallStatus(status);
      client.disconnectUser();
    };
    if (authUser && groups.length) checkOngoingCalls();
  }, [groups, authUser]);

  const handleJoin = async (groupId) => {
    try {
      await joinGroup(groupId);
      setRefresh(r => !r);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to join group");
    }
  };

  const handleLeave = async (groupId) => {
    try {
      await leaveGroup(groupId);
      setRefresh(r => !r);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to leave group");
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      await createGroup(newGroup);
      setShowCreate(false);
      setNewGroup({ name: "", description: "" });
      setRefresh(r => !r);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create group");
    }
    setCreating(false);
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold">Groups</h2>
        <button className="btn btn-primary rounded-xl" onClick={() => setShowCreate(true)}>
          Create Group
        </button>
      </div>
      {showCreate && (
        <form className="mb-8 bg-base-100 p-6 rounded-xl shadow-lg max-w-md" onSubmit={handleCreate}>
          <h3 className="text-xl font-semibold mb-4">Create a New Group</h3>
          <input
            className="input input-bordered w-full mb-3"
            placeholder="Group Name"
            value={newGroup.name}
            onChange={e => setNewGroup(g => ({ ...g, name: e.target.value }))}
            required
            maxLength={100}
          />
          <textarea
            className="textarea textarea-bordered w-full mb-3"
            placeholder="Description (optional)"
            value={newGroup.description}
            onChange={e => setNewGroup(g => ({ ...g, description: e.target.value }))}
            maxLength={500}
          />
          <div className="flex gap-2">
            <button className="btn btn-primary" type="submit" disabled={creating}>Create</button>
            <button className="btn btn-ghost" type="button" onClick={() => setShowCreate(false)}>Cancel</button>
          </div>
        </form>
      )}
      {loading ? (
        <div className="flex justify-center py-16">
          <span className="loading loading-spinner loading-lg text-primary" />
        </div>
      ) : error ? (
        <div className="text-error text-center py-8">{error}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map(group => {
            const isMember = authUser && group.members.some(m => m._id === authUser._id);
            const isAdmin = authUser && group.admins.some(a => a._id === authUser._id);
            const isCallOngoing = callStatus[group._id];
            return (
              <GroupCard
                key={group._id}
                group={group}
                onJoin={handleJoin}
                onLeave={handleLeave}
                isMember={isMember}
                isAdmin={isAdmin}
                isCallOngoing={isCallOngoing}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default GroupsPage; 