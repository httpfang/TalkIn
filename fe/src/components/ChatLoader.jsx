import { LoaderIcon, MessageCircleIcon } from "lucide-react";

function ChatLoader() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-100 to-base-200/30 flex items-center justify-center p-6">
      <div className="bg-base-100 rounded-2xl border border-base-300/30 p-8 text-center max-w-md mx-auto shadow-lg">
        <div className="flex flex-col items-center space-y-6">
          <div className="relative">
            <div className="p-4 rounded-2xl bg-primary/10">
              <MessageCircleIcon className="size-12 text-primary" />
            </div>
            <div className="absolute -top-2 -right-2">
              <LoaderIcon className="animate-spin size-6 text-primary" />
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-xl text-base-content">Connecting to Chat</h3>
            <p className="text-base-content/60 leading-relaxed">
              Setting up your conversation...
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

export default ChatLoader;
