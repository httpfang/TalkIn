import { useQuery } from "@tanstack/react-query";
import { getUserFriends } from "./lib/api";
import FriendCard from "./components/FriendCard";
import NoFriendsFound from "./components/NoFriendsFound";

const FriendsPage = () => {
  const { data: friends = [], isLoading } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-100 to-base-200/30 p-6 sm:p-8 lg:p-10">
      <div className="container mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="space-y-2">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-base-content">
              Your Friends
            </h2>
            <p className="text-base-content/60 text-lg">
              Connect and chat with your language partners
            </p>
          </div>
        </div>
        {isLoading ? (
          <div className="flex justify-center py-16">
            <div className="flex flex-col items-center space-y-4">
              <span className="loading loading-spinner loading-lg text-primary" />
              <p className="text-base-content/60">Loading your friends...</p>
            </div>
          </div>
        ) : friends.length === 0 ? (
          <NoFriendsFound />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6">
            {friends.map((friend) => (
              <FriendCard key={friend._id} friend={friend} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FriendsPage; 