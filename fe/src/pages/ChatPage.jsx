import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useAuthUser from "../hooks/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api";

import {
  Channel,
  ChannelHeader,
  Chat,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";
import { StreamChat } from "stream-chat";
import toast from "react-hot-toast";

import ChatLoader from "../components/ChatLoader";
import CallButton from "../components/CallButton";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const ChatPage = () => {
  const { id: targetUserId } = useParams();

  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { authUser } = useAuthUser();

  const { data: tokenData, error: tokenError } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });

  useEffect(() => {
    const initChat = async () => {
      if (!tokenData?.token || !authUser) return;

      try {
        setError(null);
        console.log("Initializing stream chat client...");

        const client = StreamChat.getInstance(STREAM_API_KEY);

        await client.connectUser(
          {
            id: authUser._id,
            name: authUser.fullName,
            image: authUser.profilePicture,
          },
          tokenData.token
        );

        const channelId = [authUser._id, targetUserId].sort().join("-");

        const currChannel = client.channel("messaging", channelId, {
          members: [authUser._id, targetUserId],
        });

        await currChannel.watch();

        setChatClient(client);
        setChannel(currChannel);
      } catch (error) {
        console.error("Error initializing chat:", error);
        setError("Could not connect to chat. Please try again.");
        toast.error("Could not connect to chat. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    initChat();
  }, [tokenData, authUser, targetUserId]);

  const handleVideoCall = () => {
    if (channel) {
      const callUrl = `${window.location.origin}/call/${channel.id}`;

      channel.sendMessage({
        text: `I've started a video call. Join me here: ${callUrl}`,
      });

      toast.success("Video call link sent successfully!");
    }
  };

  // Handle loading state
  if (loading) return <ChatLoader />;

  // Handle error state
  if (error || tokenError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-100 to-base-200/30 flex items-center justify-center p-6">
        <div className="bg-base-100 rounded-2xl border border-base-300/30 p-8 text-center max-w-md mx-auto shadow-lg">
          <div className="flex flex-col items-center space-y-4">
            <div className="p-4 rounded-2xl bg-error/10">
              <svg className="size-12 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-xl text-base-content">Connection Error</h3>
              <p className="text-base-content/60 leading-relaxed">
                {error || "Unable to connect to chat. Please check your connection and try again."}
              </p>
            </div>
            <button 
              onClick={() => window.location.reload()} 
              className="btn btn-primary rounded-xl hover:shadow-lg transition-all duration-200"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Handle missing chat client or channel
  if (!chatClient || !channel) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-100 to-base-200/30 flex items-center justify-center p-6">
        <div className="bg-base-100 rounded-2xl border border-base-300/30 p-8 text-center max-w-md mx-auto shadow-lg">
          <div className="flex flex-col items-center space-y-4">
            <div className="p-4 rounded-2xl bg-base-200/50">
              <svg className="size-12 text-base-content/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-xl text-base-content">Chat Not Available</h3>
              <p className="text-base-content/60 leading-relaxed">
                Unable to load the chat. Please try refreshing the page.
              </p>
            </div>
            <button 
              onClick={() => window.location.reload()} 
              className="btn btn-primary rounded-xl hover:shadow-lg transition-all duration-200"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[93vh] bg-gradient-to-br from-base-100 via-base-100 to-base-200/30">
      <Chat client={chatClient}>
        <Channel channel={channel}>
          <div className="w-full relative h-full">
            <CallButton handleVideoCall={handleVideoCall} />
            <Window className="rounded-2xl border border-base-300/30 shadow-lg overflow-hidden">
              <ChannelHeader />
              <MessageList />
              <MessageInput focus />
            </Window>
          </div>
          <Thread />
        </Channel>
      </Chat>
    </div>
  );
};
export default ChatPage;
