import { Link, useLocation } from "react-router-dom";
import useAuthUser from "../hooks/useAuthUser";
import { BellIcon, LogOutIcon, ShipWheelIcon } from "lucide-react";
import ThemeSelector from "./ThemeSelector";
import useLogout from "../hooks/useLogout";
import { useQuery } from "@tanstack/react-query";
import { getUnreadNotificationCount } from "../lib/api";

const Navbar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const isChatPage = location.pathname?.startsWith("/chat");

  // const queryClient = useQueryClient();
  // const { mutate: logoutMutation } = useMutation({
  //   mutationFn: logout,
  //   onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authUser"] }),
  // });

  const { logoutMutation } = useLogout();

  const { data: notificationCount = 0, refetch: refetchNotificationCount } = useQuery({
    queryKey: ["unreadNotificationCount"],
    queryFn: getUnreadNotificationCount,
  });

  return (
    <nav className="bg-base-100/80 backdrop-blur-md border-b border-base-300/50 sticky top-0 z-30 h-16 flex items-center shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between w-full">
          {/* LOGO - Always show on mobile, only on chat page for desktop */}
          <div className={`flex items-center ${isChatPage ? '' : 'lg:hidden'}`}>
            <Link to="/" className="flex items-center gap-3 group">
              <div className="p-2 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 group-hover:from-primary/20 group-hover:to-secondary/20 transition-all duration-300">
                <ShipWheelIcon className="size-6 text-primary" />
              </div>
              <span className="text-2xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wide">
                TalkIn
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {/* Notifications */}
            <Link to={"/notifications"} className="relative">
              <button className="btn btn-ghost btn-sm rounded-xl hover:bg-base-200/80 transition-all duration-200">
                <BellIcon className="h-5 w-5 text-base-content/70" />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-error text-white text-xs font-bold rounded-full px-1.5 py-0.5 min-w-[18px] flex items-center justify-center">
                    {notificationCount}
                  </span>
                )}
              </button>
            </Link>

            {/* Theme Selector */}
            <ThemeSelector />

            {/* User Avatar */}
            <div className="avatar ml-2">
              <div className="w-8 h-8 rounded-xl ring-2 ring-base-300/50 hover:ring-primary/30 transition-all duration-200">
                <img 
                  src={authUser?.profilePicture} 
                  alt="User Avatar" 
                  className="rounded-xl"
                  rel="noreferrer" 
                />
              </div>
            </div>

            {/* Logout button */}
            <button 
              className="btn btn-ghost btn-sm rounded-xl hover:bg-error/10 hover:text-error transition-all duration-200 ml-1" 
              onClick={logoutMutation}
            >
              <LogOutIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
