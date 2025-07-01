import { UsersIcon, ArrowDownIcon } from "lucide-react";

const NoFriendsFound = () => {
  return (
    <div className="bg-base-100 rounded-2xl border border-base-300/30 p-8 text-center max-w-md mx-auto">
      <div className="flex flex-col items-center space-y-4">
        <div className="p-4 rounded-2xl bg-base-200/50">
          <UsersIcon className="size-12 text-base-content/40" />
        </div>
        <div className="space-y-2">
          <h3 className="font-semibold text-xl text-base-content">No friends yet</h3>
          <p className="text-base-content/60 leading-relaxed">
            Connect with language partners below to start practicing together!
          </p>
        </div>
        <div className="flex items-center text-primary/60 animate-bounce">
          <ArrowDownIcon className="size-5" />
        </div>
      </div>
    </div>
  );
};

export default NoFriendsFound;
