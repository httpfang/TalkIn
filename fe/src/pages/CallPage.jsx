import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useAuthUser from "../hooks/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api";

import {
  StreamVideo,
  StreamVideoClient,
  StreamCall,
  CallControls,
  SpeakerLayout,
  StreamTheme,
  CallingState,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";

import "@stream-io/video-react-sdk/dist/css/styles.css";
import toast from "react-hot-toast";
import PageLoader from "../components/PageLoader";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const CallPage = () => {
  const { id: callId } = useParams();
  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);
  const [isConnecting, setIsConnecting] = useState(true);
  const [error, setError] = useState(null);

  const { authUser, isLoading } = useAuthUser();

  const { data: tokenData, error: tokenError } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });

  useEffect(() => {
    const initCall = async () => {
      if (!tokenData?.token || !authUser || !callId) return;

      try {
        setError(null);
        console.log("Initializing Stream video client...");

        const user = {
          id: authUser._id,
          name: authUser.fullName,
          image: authUser.profilePicture,
        };

        const videoClient = new StreamVideoClient({
          apiKey: STREAM_API_KEY,
          user,
          token: tokenData.token,
        });

        const callInstance = videoClient.call("default", callId);

        await callInstance.join({ create: true });

        console.log("Joined call successfully");

        setClient(videoClient);
        setCall(callInstance);
      } catch (error) {
        console.error("Error joining call:", error);
        setError("Could not join the call. Please try again.");
        toast.error("Could not join the call. Please try again.");
      } finally {
        setIsConnecting(false);
      }
    };

    initCall();
  }, [tokenData, authUser, callId]);

  // Handle loading state
  if (isLoading || isConnecting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-100 to-base-200/30 flex items-center justify-center p-6">
        <div className="bg-base-100 rounded-2xl border border-base-300/30 p-8 text-center max-w-md mx-auto shadow-lg">
          <div className="flex flex-col items-center space-y-6">
            <div className="relative">
              <div className="p-4 rounded-2xl bg-primary/10">
                <svg className="size-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="absolute -top-2 -right-2">
                <div className="animate-spin size-6 text-primary">
                  <svg className="size-6" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-xl text-base-content">Joining Call</h3>
              <p className="text-base-content/60 leading-relaxed">
                Setting up your video call...
              </p>
            </div>
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
              <h3 className="font-semibold text-xl text-base-content">Call Connection Error</h3>
              <p className="text-base-content/60 leading-relaxed">
                {error || "Unable to join the call. Please check your connection and try again."}
              </p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => window.location.reload()} 
                className="btn btn-primary rounded-xl hover:shadow-lg transition-all duration-200"
              >
                Try Again
              </button>
              <button 
                onClick={() => window.history.back()} 
                className="btn btn-outline rounded-xl hover:shadow-lg transition-all duration-200"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Handle missing client or call
  if (!client || !call) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-100 to-base-200/30 flex items-center justify-center p-6">
        <div className="bg-base-100 rounded-2xl border border-base-300/30 p-8 text-center max-w-md mx-auto shadow-lg">
          <div className="flex flex-col items-center space-y-4">
            <div className="p-4 rounded-2xl bg-base-200/50">
              <svg className="size-12 text-base-content/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-xl text-base-content">Call Not Available</h3>
              <p className="text-base-content/60 leading-relaxed">
                Unable to initialize the call. Please try refreshing the page.
              </p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => window.location.reload()} 
                className="btn btn-primary rounded-xl hover:shadow-lg transition-all duration-200"
              >
                Refresh Page
              </button>
              <button 
                onClick={() => window.history.back()} 
                className="btn btn-outline rounded-xl hover:shadow-lg transition-all duration-200"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-base-100 via-base-100 to-base-200/30 pb-20 px-2 sm:px-4">
      <div className="relative h-full min-h-[300px]">
        <StreamVideo client={client}>
          <StreamCall call={call}>
            <CallContent />
          </StreamCall>
        </StreamVideo>
      </div>
    </div>
  );
};

const CallContent = () => {
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();

  const navigate = useNavigate();

  if (callingState === CallingState.LEFT) {
    // Show a brief message before navigating
    setTimeout(() => navigate("/"), 1000);
    return (
      <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-100 to-base-200/30 flex items-center justify-center p-6">
        <div className="bg-base-100 rounded-2xl border border-base-300/30 p-8 text-center max-w-md mx-auto shadow-lg">
          <div className="flex flex-col items-center space-y-4">
            <div className="p-4 rounded-2xl bg-success/10">
              <svg className="size-12 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-xl text-base-content">Call Ended</h3>
              <p className="text-base-content/60 leading-relaxed">
                Redirecting you back to the chat...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <StreamTheme>
      <SpeakerLayout />
      <CallControls />
    </StreamTheme>
  );
};

export default CallPage;
