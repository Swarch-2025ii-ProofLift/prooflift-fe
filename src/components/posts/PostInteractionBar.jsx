import ReactionBar from "./ReactionBar";
import { useMemo } from "react";

function PostInteractionBar({
  postId,
  reactionsByType = [],
  currentUserReaction = null,
  onToggleReaction,
  onOpenComments,
  disabled = false,
  size = "medium",
  variant = "default"
}) {
  const sizeClasses = useMemo(() => ({
    small: "px-2 py-1 text-sm gap-2",
    medium: "px-3 py-2 text-base gap-3", 
    large: "px-4 py-3 text-lg gap-4"
  }), []);

  const buttonSizeClasses = useMemo(() => ({
    small: "px-2 py-1 text-sm",
    medium: "px-3 py-2 text-base",
    large: "px-4 py-3 text-lg"
  }), []);

  const variantClasses = useMemo(() => ({
    default: "mt-3",
    compact: "mt-2",
    spacious: "mt-4"
  }), []);

  return (
    <div className={`flex ${sizeClasses[size]} ${variantClasses[variant]}`}>
      <ReactionBar
        reactionsByType={reactionsByType}
        currentUserReaction={currentUserReaction}
        onToggleReaction={onToggleReaction}
        disabled={disabled}
        size={size}
      />

      <button
        onClick={onOpenComments}
        disabled={disabled}
        className={`flex-1 flex justify-center items-center rounded-lg font-medium
                   transition-all duration-300 ease-out group relative overflow-hidden
                   ${buttonSizeClasses[size]}
                   bg-tertiary/50 text-secondary hover:bg-background hover:text-primary 
                   hover:border hover:border-primary/30 hover:shadow-lg
                   hover:transform hover:scale-[1.02]
                   ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                   focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 
                   focus:ring-offset-tertiary`}
        aria-label="Open comments"
      >
        <span className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 
                         transform translate-x-[-100%] group-hover:translate-x-[100%] 
                         transition-transform duration-1000"></span>
        
        <span className="relative flex items-center gap-2">
          <svg 
            className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" 
            />
          </svg>
          <span className="font-semibold">Comentar</span>
        </span>
      </button>
    </div>
  );
}

export default PostInteractionBar;