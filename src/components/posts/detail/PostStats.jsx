import { useState } from "react";
import { REACTIONS } from "../../../constants/reactions.js";
import ReactionsDetail from "../ReactionsDetail.jsx";

function PostStats({ 
  totalReactions, 
  totalComments, 
  reactionsByType, 
  postId, 
  detailedReactions 
}) {
  const [showReactionsModal, setShowReactionsModal] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between py-4 px-2">
        {/* Reactions Summary */}
        {totalReactions > 0 && (
          <button
            onClick={() => setShowReactionsModal(true)}
            className="flex items-center gap-3 hover:bg-gray-700/30 p-2 rounded-lg
                     transition-all duration-200 group cursor-pointer"
          >
            <div className="flex -space-x-2">
              {reactionsByType.slice(0, 3).map(({ type }) => {
                const reaction = REACTIONS.find(r => r.type === type);
                return (
                  <span
                    key={type}
                    className="inline-flex items-center justify-center w-8 h-8
                             bg-primary/20 rounded-full border-2 border-tertiary
                             text-base group-hover:scale-110 transition-transform"
                    title={reaction?.label || type}
                  >
                    {reaction?.label || '👍'}
                  </span>
                );
              })}
              {reactionsByType.length > 3 && (
                <span className="inline-flex items-center justify-center w-8 h-8
                               bg-gray-700 rounded-full border-2 border-tertiary
                               text-xs text-gray-300 font-medium">
                  +{reactionsByType.length - 3}
                </span>
              )}
            </div>

            <div className="flex flex-col items-start">
              <span className="text-secondary font-semibold text-base
                           group-hover:text-primary transition-colors">
                {totalReactions}
              </span>
              <span className="text-gray-400 text-xs">
                {totalReactions === 1 ? 'reacción' : 'reacciones'}
              </span>
            </div>

            <svg 
              className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors
                       group-hover:translate-x-1 transition-transform"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}

        {/* Comments Count */}
        {totalComments >= 0 && (
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span className="font-medium">
              {totalComments} {totalComments === 1 ? 'comentario' : 'comentarios'}
            </span>
          </div>
        )}
      </div>

      {/* Reactions Detail Modal */}
      {showReactionsModal && (
        <ReactionsDetail
          postId={postId}
          reactionsByType={reactionsByType}
          totalReactions={totalReactions}
          detailedReactions={detailedReactions}
          onClose={() => setShowReactionsModal(false)}
        />
      )}
    </>
  );
}

export default PostStats;