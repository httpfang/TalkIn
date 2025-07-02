import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useAuthUser from "../hooks/useAuthUser";
import { getGroups, removeGroupMember, getStreamToken } from "../lib/api";
import { getStreamClient } from '../lib/streamClient';
import {
  Chat,
  Channel,
  ChannelHeader,
  MessageList,
  MessageInput,
  Thread,
  Window,
} from "stream-chat-react";
import toast from "react-hot-toast";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const GroupChatPage = () => {
  const { id: groupId } = useParams();
  const { authUser } = useAuthUser();
  const navigate = useNavigate();
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [refresh, setRefresh] = useState(false);

  const { data: tokenData, error: tokenError } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });

  useEffect(() => {
    const fetchGroup = async () => {
      setLoading(true);
      try {
        const res = await getGroups();
        const found = res.data.groups.find(g => g._id === groupId);
        setGroup(found);
      } catch {
        toast.error("Failed to load group info");
      }
      setLoading(false);
    };
    fetchGroup();
  }, [groupId, refresh]);

  useEffect(() => {
    const initChat = async () => {
      if (!group || !authUser || !tokenData?.token) return;
      const client = getStreamClient(STREAM_API_KEY);
      if (!client.userID) {
        await client.connectUser(
          {
            id: authUser._id,
            name: authUser.fullName,
            image: authUser.profilePicture,
          },
          tokenData.token
        );
      }
      const channelId = `group-${groupId}`;
      const members = group.members.map(m => m._id);
      const currChannel = client.channel("messaging", channelId, { members });
      await currChannel.watch();
      setChatClient(client);
      setChannel(currChannel);
    };
    initChat();
    // No disconnectUser in cleanup!
    // eslint-disable-next-line
  }, [group, authUser, tokenData]);

  const handleRemove = async (userId) => {
    if (!window.confirm("Remove this member from the group?")) return;
    try {
      await removeGroupMember(groupId, userId);
      toast.success("Member removed");
      setRefresh(r => !r);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to remove member");
    }
  };

  const handleGroupCall = async () => {
    if (channel) {
      const callUrl = `${window.location.origin}/call/group-${groupId}`;
      await channel.sendMessage({
        text: `A group call has started! [Join here](${callUrl}) (This link will expire in 10 minutes)`
      });
      toast("Meeting link will expire in 10 minutes");
    }
    navigate(`/call/group-${groupId}`);
  };

  // Intercept clicks on call links in messages
  useEffect(() => {
    const chatRoot = document.querySelector('.str-chat');
    if (!chatRoot) return;
    const handler = (e) => {
      const a = e.target.closest('a');
      if (a && a.href && a.href.includes(`/call/group-${groupId}`)) {
        // Find the most recent message containing the call link
        const callLinkPart = `/call/group-${groupId}`;
        const callMsgs = channel?.state.messages.filter(m => m.text && m.text.includes(callLinkPart));
        if (callMsgs && callMsgs.length > 0) {
          // Use the most recent one
          const msg = callMsgs[callMsgs.length - 1];
          const now = Date.now();
          const created = new Date(msg.created_at).getTime();
          if (now - created > 10 * 60 * 1000) {
            e.preventDefault();
            toast.error("This meeting link has expired (10 min limit). Please start a new call.");
          }
        }
      }
    };
    chatRoot.addEventListener('click', handler);
    return () => chatRoot.removeEventListener('click', handler);
  }, [channel, groupId]);

  if (loading || !group) return <div className="flex justify-center py-16">Loading...</div>;
  if (!chatClient || !channel) return <div className="flex justify-center py-16">Connecting to chat...</div>;
  if (tokenError) return <div className="flex justify-center py-16 text-error">Failed to get chat token</div>;

  const isAdmin = group.admins.some(a => a._id === authUser._id);

  return (
    <div className="w-full h-[93vh] bg-gradient-to-br from-base-100 via-base-100 to-base-200/30">
      <div className="flex flex-col md:flex-row gap-8 h-full">
        {/* Chat Section */}
        <div className="flex-1 min-w-0 flex flex-col h-full">
          <div className="flex items-center justify-between mb-4 px-6 pt-6">
            <h2 className="text-2xl font-bold">{group.name} Group Chat</h2>
            <button className="btn btn-primary rounded-xl" onClick={handleGroupCall}>
              Start Group Call
            </button>
          </div>
          <div className="flex-1 rounded-2xl border border-base-300/30 shadow-lg overflow-hidden mx-6 mb-6">
            <Chat client={chatClient}>
              <Channel channel={channel}>
                <Window>
                  <ChannelHeader />
                  <MessageList />
                  <MessageInput focus />
                </Window>
                <Thread />
              </Channel>
            </Chat>
          </div>
        </div>
        {/* Members Section */}
        <div className="w-full md:w-72 bg-base-100 rounded-2xl border border-base-300/30 shadow-lg p-4 h-full flex flex-col">
          <h3 className="font-semibold text-lg mb-3">Members</h3>
          <ul className="space-y-2 flex-1 overflow-y-auto">
            {group.members.map(member => (
              <li key={member._id} className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <img src={member.profilePicture} alt={member.fullName} className="w-8 h-8 rounded-full" />
                  <span>{member.fullName}</span>
                  {group.admins.some(a => a._id === member._id) && (
                    <span className="badge badge-primary/20 text-primary ml-2">Admin</span>
                  )}
                </div>
                {isAdmin && member._id !== authUser._id && (
                  <button className="btn btn-xs btn-error rounded-xl" onClick={() => handleRemove(member._id)}>
                    Remove
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default GroupChatPage; 