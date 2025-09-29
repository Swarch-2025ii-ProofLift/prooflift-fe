import React, { useMemo } from "react";
import PostCard from "./PostCard.jsx";
import PostInteractionBar from "./PostInteractionBar.jsx";

function PostItem({
  post,
  totalComments,
  totalReactions,
  reactionsByType,
  currentUserReaction,
  currentUserId,
  onToggleReaction,
  onOpenComments,
  onUserClick,
  onExerciseClick,
  variant = "default",
  priority = false,
  loading = false
}) {
  const variantClasses = useMemo(() => ({
    default: "w-full max-w-4xl mx-auto",
    compact: "w-full max-w-lg mx-auto",
    full: "w-full max-w-4xl mx-auto",
    grid: "w-full"
  }), []);

  const containerClasses = useMemo(() => ({
    default: "gap-3 p-4",
    compact: "gap-2 p-3",
    full: "gap-4 p-5",
    grid: "gap-3 p-4"
  }), []);

  if (loading) {
    return (
      <div className={`flex flex-col ${containerClasses[variant]} bg-tertiary rounded-xl 
                      shadow-md border border-gray-800/50 ${variantClasses[variant]}
                      animate-pulse`}>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="h-6 bg-gray-700 rounded-full w-24"></div>
            <div className="h-4 bg-gray-700 rounded w-20"></div>
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-700 rounded w-full"></div>
            <div className="h-4 bg-gray-700 rounded w-4/5"></div>
            <div className="h-4 bg-gray-700 rounded w-3/5"></div>
          </div>
          <div className="border-t border-gray-700 pt-3">
            <div className="flex justify-between">
              <div className="flex gap-4">
                <div className="h-4 bg-gray-700 rounded w-16"></div>
                <div className="h-4 bg-gray-700 rounded w-16"></div>
              </div>
              <div className="h-4 bg-gray-700 rounded w-20"></div>
            </div>
          </div>
          <div className="flex gap-3 mt-3">
            <div className="flex-1 h-10 bg-gray-700 rounded-lg"></div>
            <div className="flex-1 h-10 bg-gray-700 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${variantClasses[variant]}`}>
      {priority && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full 
                       animate-pulse shadow-lg z-10" 
             aria-label="Priority post"
             title="Featured post">
        </div>
      )}

      <article 
        className={`flex flex-col ${containerClasses[variant]} bg-background-secondary/20 rounded-2xl 
                   shadow-sm hover:shadow-lg transition-all duration-300 ease-out
                   border border-gray-800/30 hover:border-gray-700/50
                   backdrop-blur-sm group overflow-hidden
                   focus-within:ring-2 focus-within:ring-primary/30`}
        role="article"
        aria-label={`Post by ${post.userId}`}
      >
        <div className="bg-tertiary/30 rounded-xl shadow-md border border-gray-800/50 
                        hover:border-gray-700/80 transition-all duration-300
                        hover:shadow-lg group-hover:transform group-hover:scale-[1.005]">
          <PostCard
            body={post.body}
            userId={post.userId}
            exerciseIds={post.exerciseIds}
            createdAt={post.createdAt}
            updatedAt={post.updatedAt}
            totalComments={totalComments}
            totalReactions={totalReactions}
            reactionsByType={reactionsByType}
            onUserClick={onUserClick}
            onExerciseClick={onExerciseClick}
            onCommentClick={onOpenComments}
          />
        </div>

        <div className="px-2 bg-gradient-to-b from-transparent to-gray-900/10">
          <PostInteractionBar
            postId={post.id}
            reactionsByType={reactionsByType}
            currentUserReaction={currentUserReaction}
            onToggleReaction={onToggleReaction}
            onOpenComments={onOpenComments}
            variant={variant === "compact" ? "compact" : "default"}
            size={variant === "compact" ? "small" : "medium"}
          />
        </div>

        <div className="h-1 bg-gradient-to-r from-primary/10 via-primary/30 to-primary/10 
                       scale-x-0 group-hover:scale-x-100 transition-transform duration-500 
                       origin-center"></div>
      </article>
    </div>
  );
}

export default React.memo(PostItem);