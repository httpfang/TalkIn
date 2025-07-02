import { Link } from "react-router-dom";
import { MessageCircleIcon, MapPinIcon } from "lucide-react";
import { LANGUAGE_TO_FLAG } from "../constants";

const FriendCard = ({ friend }) => {
  return (
    <div className="group bg-base-100 rounded-2xl border border-base-300/30 hover:border-primary/30 hover:shadow-lg transition-all duration-300 overflow-hidden">
      <div className="p-5 space-y-4">
        {/* USER INFO */}
        <div className="flex items-center gap-4">
          <div className="avatar">
            <div className="w-14 h-14 rounded-xl ring-2 ring-base-300/50 group-hover:ring-primary/30 transition-all duration-200">
              <img 
                src={friend.profilePicture} 
                alt={friend.fullName} 
                className="rounded-xl"
              />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg truncate text-base-content">
              {friend.fullName}
            </h3>
            {friend.location && (
              <div className="flex items-center text-sm text-base-content/60 mt-1">
                <MapPinIcon className="size-4 mr-1.5" />
                <span className="truncate">{friend.location}</span>
              </div>
            )}
          </div>
        </div>

        {/* Languages */}
        <div className="flex flex-wrap gap-2">
          <span className="badge badge-primary/10 text-primary border-primary/20 text-xs px-3 py-2">
            {getLanguageFlag(friend.nativeLanguage)}
            <span className="ml-1">Native: {friend.nativeLanguage}</span>
          </span>
          <span className="badge badge-outline text-xs px-3 py-2 border-base-300/50">
            {getLanguageFlag(friend.learningLanguage)}
            <span className="ml-1">Learning: {friend.learningLanguage}</span>
          </span>
        </div>

        {/* Action Button */}
        <Link 
          to={`/chat/${friend._id}`} 
          className="btn btn-primary btn-sm w-full rounded-xl hover:shadow-md transition-all duration-200 group/btn"
        >
          <MessageCircleIcon className="size-4 mr-2 group-hover/btn:scale-110 transition-transform duration-200" />
          Message
        </Link>
      </div>
    </div>
  );
};
export default FriendCard;

export function getLanguageFlag(language) {
  if (!language) return null;

  const langLower = language.toLowerCase();
  const countryCode = LANGUAGE_TO_FLAG[langLower];

  if (countryCode) {
    return (
      <img
        src={`https://flagcdn.com/20x15/${countryCode}.png`}
        alt={`${langLower} flag`}
        className="h-3 mr-1 inline-block rounded-sm"
      />
    );
  }
  return null;
}
