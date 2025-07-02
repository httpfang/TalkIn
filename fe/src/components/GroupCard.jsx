import React from "react";
import { useNavigate } from "react-router-dom";

const GroupCard = ({ group, onJoin, onLeave, isMember, isAdmin, isCallOngoing }) => {
  const navigate = useNavigate();

  return (
    <div
      className="bg-base-100 rounded-2xl border border-base-300/30 hover:border-primary/30 hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer hover:cursor-pointer relative"
      onClick={() => navigate(`/groups/${group._id}`)}
    >
      {isCallOngoing && (
        <span className="absolute top-3 right-3 badge badge-error text-white z-10">Ongoing Call</span>
      )}
      <div className="p-6 space-y-4">
        <h3 className="font-semibold text-xl text-base-content truncate hover:text-primary">
          {group.name}
        </h3>
        {group.description && (
          <p className="text-sm text-base-content/70 leading-relaxed line-clamp-2">{group.description}</p>
        )}
        <div className="flex items-center gap-2 text-xs text-base-content/60">
          <span>{group.members.length} members</span>
          {isAdmin && <span className="badge badge-primary/20 text-primary ml-2">Admin</span>}
        </div>
        <div className="flex gap-2 mt-4">
          {isMember ? (
            <button
              className="btn btn-outline btn-sm rounded-xl"
              onClick={e => {
                e.stopPropagation();
                onLeave(group._id);
              }}
            >
              Leave Group
            </button>
          ) : (
            <button
              className="btn btn-primary btn-sm rounded-xl"
              onClick={e => {
                e.stopPropagation();
                onJoin(group._id);
              }}
            >
              Join Group
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GroupCard; 