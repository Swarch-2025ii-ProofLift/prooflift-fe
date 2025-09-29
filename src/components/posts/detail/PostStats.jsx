import { REACTIONS } from "../../../constants/reactions.js";

function PostStats({ totalReactions, totalComments, reactionsByType }) {
  if (totalReactions === 0 && totalComments === 0) {
    return null;
  }

  return (
    <div className="flex justify-between items-center py-2">
      <div className="flex items-center gap-2">
        {reactionsByType.length > 0 ? (
          <>
            <div className="flex -space-x-1">
              {reactionsByType.slice(0, 3).map(({ type }) => {
                const reaction = REACTIONS.find((r) => r.type === type);
                return (
                  <span 
                    key={type}
                    className="inline-flex items-center justify-center w-6 h-6 
                               bg-primary/20 rounded-full border border-tertiary text-sm
                               hover:scale-110 transition-transform cursor-default"
                    title={reaction?.label || type}
                  >
                    {reaction?.label || type.charAt(0)}
                  </span>
                );
              })}
              {reactionsByType.length > 3 && (
                <span className="inline-flex items-center justify-center w-6 h-6 
                                 bg-gray-700 rounded-full border border-tertiary text-sm
                                 text-gray-300 cursor-default">
                  +{reactionsByType.length - 3}
                </span>
              )}
            </div>
            <span className="text-gray-400 text-sm font-medium">
              {totalReactions}
            </span>
          </>
        ) : totalReactions > 0 ? (
          <div className="flex items-center gap-1.5 text-gray-400 text-sm">
            <span className="text-lg">👍</span>
            <span className="font-medium">{totalReactions}</span>
          </div>
        ) : null}
      </div>

      <div className="flex items-center gap-1.5 text-gray-400 text-sm">
        <span className="text-lg">💬</span>
        <span className="font-medium">{totalComments}</span>
        <span className="text-xs">
          {totalComments === 1 ? 'comentario' : 'comentarios'}
        </span>
      </div>
    </div>
  );
}

export default PostStats;