import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  getOutgoingFriendReqs,
  getRecommendedUsers,
  getUserFriends,
  sendFriendRequest,
} from "../lib/api";
import { Link } from "react-router";
import { CheckCircleIcon, MapPinIcon, UserPlusIcon, UsersIcon, SparklesIcon } from "lucide-react";

import { capitialize } from "../lib/utils";

import FriendCard, { getLanguageFlag } from "../components/FriendCard";
import NoFriendsFound from "../components/NoFriendsFound";

const HomePage = () => {
  const queryClient = useQueryClient();
  const [outgoingRequestsIds, setOutgoingRequestsIds] = useState(new Set());

  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  const { data: recommendedUsers = [], isLoading: loadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: getRecommendedUsers,
  });

  const { data: outgoingFriendReqs } = useQuery({
    queryKey: ["outgoingFriendReqs"],
    queryFn: getOutgoingFriendReqs,
  });

  const { mutate: sendRequestMutation, isPending } = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["outgoingFriendReqs"] }),
  });

  useEffect(() => {
    const outgoingIds = new Set();
    if (outgoingFriendReqs && outgoingFriendReqs.length > 0) {
      outgoingFriendReqs.forEach((req) => {
        outgoingIds.add(req.recipient._id);
      });
      setOutgoingRequestsIds(outgoingIds);
    }
  }, [outgoingFriendReqs]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-100 to-base-200/30">
      <div className="p-6 sm:p-8 lg:p-10">
        <div className="container mx-auto space-y-12">
          {/* Friends Section */}
          <section>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
              <div className="space-y-2">
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-base-content">
                  Your Friends
                </h2>
                <p className="text-base-content/60 text-lg">
                  Connect and practice with your language partners
                </p>
              </div>
              <Link 
                to="/notifications" 
                className="btn btn-primary btn-sm rounded-xl hover:shadow-lg transition-all duration-200 group"
              >
                <UsersIcon className="mr-2 size-4 group-hover:scale-110 transition-transform duration-200" />
                Friend Requests
              </Link>
            </div>

            {loadingFriends ? (
              <div className="flex justify-center py-16">
                <div className="flex flex-col items-center space-y-4">
                  <span className="loading loading-spinner loading-lg text-primary" />
                  <p className="text-base-content/60">Loading your friends...</p>
                </div>
              </div>
            ) : friends.length === 0 ? (
              <NoFriendsFound />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {friends.map((friend) => (
                  <FriendCard key={friend._id} friend={friend} />
                ))}
              </div>
            )}
          </section>

          {/* Recommended Users Section */}
          <section>
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <SparklesIcon className="size-6 text-primary" />
                    <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-base-content">
                      Meet New Learners
                    </h2>
                  </div>
                  <p className="text-base-content/60 text-lg">
                    Discover perfect language exchange partners based on your profile
                  </p>
                </div>
              </div>
            </div>

            {loadingUsers ? (
              <div className="flex justify-center py-16">
                <div className="flex flex-col items-center space-y-4">
                  <span className="loading loading-spinner loading-lg text-primary" />
                  <p className="text-base-content/60">Finding language partners...</p>
                </div>
              </div>
            ) : recommendedUsers.length === 0 ? (
              <div className="bg-base-100 rounded-2xl border border-base-300/30 p-12 text-center max-w-2xl mx-auto">
                <div className="flex flex-col items-center space-y-4">
                  <div className="p-4 rounded-2xl bg-base-200/50">
                    <SparklesIcon className="size-12 text-base-content/40" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-xl text-base-content">No recommendations available</h3>
                    <p className="text-base-content/60 leading-relaxed">
                      Check back later for new language partners!
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendedUsers.map((user) => {
                  const hasRequestBeenSent = outgoingRequestsIds.has(user._id);

                  return (
                    <div
                      key={user._id}
                      className="group bg-base-100 rounded-2xl border border-base-300/30 hover:border-primary/30 hover:shadow-lg transition-all duration-300 overflow-hidden"
                    >
                      <div className="p-6 space-y-5">
                        {/* User Info */}
                        <div className="flex items-center gap-4">
                          <div className="avatar">
                            <div className="w-16 h-16 rounded-xl ring-2 ring-base-300/50 group-hover:ring-primary/30 transition-all duration-200">
                              <img 
                                src={user.profilePicture} 
                                alt={user.fullName} 
                                className="rounded-xl"
                              />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-lg truncate text-base-content">
                              {user.fullName}
                            </h3>
                            {user.location && (
                              <div className="flex items-center text-sm text-base-content/60 mt-1">
                                <MapPinIcon className="size-4 mr-1.5" />
                                <span className="truncate">{user.location}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Languages */}
                        <div className="flex flex-wrap gap-2">
                          <span className="badge badge-primary/10 text-primary border-primary/20 text-xs px-3 py-2">
                            {getLanguageFlag(user.nativeLanguage)}
                            <span className="ml-1">Native: {capitialize(user.nativeLanguage)}</span>
                          </span>
                          <span className="badge badge-outline text-xs px-3 py-2 border-base-300/50">
                            {getLanguageFlag(user.learningLanguage)}
                            <span className="ml-1">Learning: {capitialize(user.learningLanguage)}</span>
                          </span>
                        </div>

                        {/* Bio */}
                        {user.bio && (
                          <p className="text-sm text-base-content/70 leading-relaxed line-clamp-2">
                            {user.bio}
                          </p>
                        )}

                        {/* Action Button */}
                        <button
                          className={`btn w-full rounded-xl transition-all duration-200 group/btn ${
                            hasRequestBeenSent 
                              ? "btn-disabled bg-base-200/50 text-base-content/50" 
                              : "btn-primary hover:shadow-md"
                          }`}
                          onClick={() => sendRequestMutation(user._id)}
                          disabled={hasRequestBeenSent || isPending}
                        >
                          {hasRequestBeenSent ? (
                            <>
                              <CheckCircleIcon className="size-4 mr-2" />
                              Request Sent
                            </>
                          ) : (
                            <>
                              <UserPlusIcon className="size-4 mr-2 group-hover/btn:scale-110 transition-transform duration-200" />
                              Send Friend Request
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
