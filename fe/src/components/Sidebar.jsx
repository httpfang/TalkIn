import { Link, useLocation } from "react-router-dom";
import useAuthUser from "../hooks/useAuthUser";
import { BellIcon, HomeIcon, ShipWheelIcon, UsersIcon, LogOutIcon } from "lucide-react";
import useLogout from "../hooks/useLogout";
import { useState } from "react";

const Sidebar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const currentPath = location.pathname;
  const { logoutMutation } = useLogout();

  const navItems = [
    { path: "/", icon: HomeIcon, label: "Home" },
    { path: "/friends", icon: UsersIcon, label: "Friends" },
    { path: "/groups", icon: ShipWheelIcon, label: "Groups" },
    { path: "/notifications", icon: BellIcon, label: "Notifications" },
  ];

  return (
    <aside className="w-64 bg-base-100/95 backdrop-blur-md border-r border-base-300/50 hidden lg:flex flex-col h-screen sticky top-0 shadow-lg">
      {/* Logo Section */}
      <div className="p-6 border-b border-base-300/30">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="p-2 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 group-hover:from-primary/20 group-hover:to-secondary/20 transition-all duration-300">
            <ShipWheelIcon className="size-7 text-primary" />
          </div>
          <span className="text-2xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wide">
            TalkIn
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-primary/10 text-primary shadow-sm border border-primary/20"
                  : "text-base-content/70 hover:bg-base-200/50 hover:text-base-content"
              }`}
            >
              <div className={`p-1.5 rounded-lg transition-all duration-200 ${
                isActive 
                  ? "bg-primary/20" 
                  : "bg-base-200/50 group-hover:bg-base-300/50"
              }`}>
                <Icon className="size-5" />
              </div>
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Profile Section */}
      <div className="p-4 border-t border-base-300/30 mt-auto">
        <div className="bg-base-200/50 rounded-xl p-4 space-y-4">
          <div className="flex items-center gap-3">
            <div className="avatar">
              <div className="w-12 h-12 rounded-xl ring-2 ring-base-300/50 hover:ring-primary/30 transition-all duration-200">
                <img 
                  src={authUser?.profilePicture} 
                  alt="User Avatar" 
                  className="rounded-xl"
                />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-base-content truncate">
                {authUser?.fullName}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="size-2 rounded-full bg-success shadow-sm" />
                <p className="text-xs text-success font-medium">Online</p>
              </div>
            </div>
          </div>
          
          {/* Logout Button */}
          <button 
            className="btn btn-ghost btn-sm w-full rounded-xl hover:bg-error/10 hover:text-error transition-all duration-200 group"
            onClick={logoutMutation}
          >
            <LogOutIcon className="size-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  );
};

// Mobile Bottom Navigation Bar
const MobileNav = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const currentPath = location.pathname;
  const { logoutMutation } = useLogout();
  const [showProfile, setShowProfile] = useState(false);

  const navItems = [
    { path: "/", icon: HomeIcon, label: "Home" },
    { path: "/friends", icon: UsersIcon, label: "Friends" },
    { path: "/groups", icon: ShipWheelIcon, label: "Groups" },
    { path: "/notifications", icon: BellIcon, label: "Notifications" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-base-100/95 border-t border-base-300/50 flex justify-around items-center h-16 pt-2 lg:hidden">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentPath === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center justify-center gap-1 px-2 py-1 rounded-xl transition-all duration-200 ${
              isActive
                ? "bg-primary/10 text-primary"
                : "text-base-content/70 hover:bg-base-200/50 hover:text-base-content"
            }`}
          >
            <Icon className="size-6" />
            <span className="text-xs font-medium">{item.label}</span>
          </Link>
        );
      })}
      {/* Profile/Logout button */}
      <button
        className="flex flex-col items-center justify-center gap-1 px-2 py-1 rounded-xl transition-all duration-200 text-base-content/70 hover:bg-base-200/50 hover:text-base-content"
        onClick={() => setShowProfile((v) => !v)}
      >
        <img
          src={authUser?.profilePicture}
          alt="User Avatar"
          className="w-7 h-7 rounded-xl border border-base-300"
        />
        <span className="text-xs font-medium">Me</span>
      </button>
      {/* Profile/Logout Drawer */}
      {showProfile && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/30" onClick={() => setShowProfile(false)}>
          <div className="bg-base-100 w-full max-w-xs rounded-t-2xl p-6 pb-8 shadow-lg" onClick={e => e.stopPropagation()}>
            <div className="flex flex-col items-center gap-3 mb-4">
              <img
                src={authUser?.profilePicture}
                alt="User Avatar"
                className="w-16 h-16 rounded-xl border-2 border-base-300 mb-2"
              />
              <p className="font-semibold text-base text-base-content truncate">{authUser?.fullName}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="size-2 rounded-full bg-success shadow-sm" />
                <p className="text-xs text-success font-medium">Online</p>
              </div>
            </div>
            <button
              className="btn btn-ghost btn-sm w-full rounded-xl hover:bg-error/10 hover:text-error transition-all duration-200 flex items-center justify-center gap-2"
              onClick={logoutMutation}
            >
              <LogOutIcon className="size-4" /> Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Export both for use in App.jsx or Layout
export { MobileNav };

export default Sidebar;
