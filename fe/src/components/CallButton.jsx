import { VideoIcon } from "lucide-react";

function CallButton({ handleVideoCall }) {
  return (
    <div className="absolute top-4 right-4 z-10">
      <button 
        onClick={handleVideoCall} 
        className="btn btn-primary btn-sm rounded-xl hover:shadow-lg transition-all duration-200 group"
      >
        <VideoIcon className="size-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
        Start Call
      </button>
    </div>
  );
}

export default CallButton;
