import { REACTIONS } from "../../constants/reactions.js";
import { useState, useCallback, useMemo, useEffect } from "react";
import { exercisesAPI } from "../../API/exercises.js";
import { getUserName } from "../../API/auth.js";

function PostCard({
  body,
  userId,
  exerciseIds,
  createdAt,
  updatedAt,
  totalComments,
  totalReactions,
  reactionsByType,
  onCommentClick,
  onUserClick,
  onExerciseClick,
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [exercises, setExercises] = useState({});
  const [loadingExercises, setLoadingExercises] = useState(true);
  const [userName, setUserName] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  
  const shouldTruncate = body.length > 200;
  const displayBody = useMemo(() => 
    shouldTruncate && !isExpanded ? body.substring(0, 200) + "..." : body
  , [body, shouldTruncate, isExpanded]);

  useEffect(() => {
    const fetchExerciseNames = async () => {
      if (!exerciseIds || exerciseIds.length === 0) {
        setLoadingExercises(false);
        return;
      }

      try {
        setLoadingExercises(true);
        const exerciseData = {};
        
        await Promise.all(
          exerciseIds.map(async (id) => {
            try {
              const exercise = await exercisesAPI.getExercise(id);
              exerciseData[id] = exercise;
            } catch (error) {
              console.error(`Error fetching exercise ${id}:`, error);
              exerciseData[id] = { id, name: id };
            }
          })
        );
        
        setExercises(exerciseData);
      } catch (error) {
        console.error('Error fetching exercises:', error);
      } finally {
        setLoadingExercises(false);
      }
    };

    fetchExerciseNames();
  }, [exerciseIds]);

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        setLoadingUser(true);
        const name = await getUserName(userId);
        setUserName(name);
      } catch (error) {
        console.error(`Error fetching username for ${userId}:`, error);
        setUserName(userId);
      } finally {
        setLoadingUser(false);
      }
    };

    if (userId) {
      fetchUserName();
    }
  }, [userId]);

  const formatRelativeTime = useCallback((dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 1) return 'Hace unos minutos';
    if (diffInHours < 24) return `Hace ${Math.floor(diffInHours)}h`;
    if (diffInHours < 168) return `Hace ${Math.floor(diffInHours / 24)}d`;
    return date.toLocaleDateString();
  }, []);

  const handleToggleExpand = useCallback(() => {
    setIsExpanded(prev => !prev);
  }, []);

  return (
    <article
      className="w-full p-4 md:p-6 bg-tertiary/30 rounded-xl flex flex-col gap-4 
                 shadow-lg hover:shadow-xl transition-all duration-300 ease-out
                 hover:transform hover:scale-[1.01] border border-gray-800/50
                 hover:border-gray-700/80 group"
      role="article"
      aria-label={`Post by ${userId}`}
    >
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-0">
        <button
          onClick={() => onUserClick?.(userId)}
          className="text-secondary font-bold text-sm md:text-base bg-primary/10 
                     hover:bg-primary/20 px-3 py-1.5 rounded-full inline-block
                     transition-all duration-200 hover:scale-105 focus:outline-none 
                     focus:ring-2 focus:ring-primary/50 self-start"
          aria-label={`View ${userName || userId}'s profile`}
        >
          {loadingUser ? (
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
              <span className="opacity-50">@...</span>
            </span>
          ) : (
            `@${userName || userId}`
          )}
        </button>
        
        <div className="text-gray-500 text-xs space-y-0.5">
          <time dateTime={createdAt} className="block">
            {formatRelativeTime(createdAt)}
          </time>
          {updatedAt && createdAt !== updatedAt && (
            <time dateTime={updatedAt} className="block opacity-75">
              Editado {formatRelativeTime(updatedAt)}
            </time>
          )}
        </div>
      </header>

      <div className="text-gray-200 text-base leading-relaxed">
        <p className="break-words whitespace-pre-wrap">
          {displayBody}
        </p>
        {shouldTruncate && (
          <button
            onClick={handleToggleExpand}
            className="text-primary text-sm mt-2 hover:text-primary/80 
                       transition-colors focus:outline-none focus:underline
                       font-medium"
            aria-expanded={isExpanded}
          >
            {isExpanded ? 'Ver menos' : 'Ver más'}
          </button>
        )}
      </div>

      {exerciseIds && exerciseIds.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <span className="text-xs text-gray-400 mr-1 self-center">Ejercicios:</span>
          {loadingExercises ? (
            exerciseIds.map((_, index) => (
              <div
                key={index}
                className="h-6 w-20 bg-primary/10 rounded-md animate-pulse"
              ></div>
            ))
          ) : (
            exerciseIds.map((exerciseId, index) => {
              const exercise = exercises[exerciseId];
              const displayName = exercise?.name || exerciseId;
              
              return (
                <button
                  key={index}
                  onClick={() => onExerciseClick?.(exerciseId)}
                  className="text-primary text-xs bg-primary/10 hover:bg-primary/20 
                             px-2.5 py-1 rounded-md transition-all duration-200 
                             hover:scale-105 focus:outline-none focus:ring-1 
                             focus:ring-primary/50 border border-transparent 
                             hover:border-primary/30"
                  aria-label={`View exercise: ${displayName}`}
                  title={displayName}
                >
                  #{displayName}
                </button>
              );
            })
          )}
        </div>
      )}

      <footer className="border-t border-gray-700/50 pt-3 mt-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            {reactionsByType && reactionsByType.length > 0 ? (
              <>
                <div className="flex -space-x-1">
                  {reactionsByType.slice(0, 3).map(({ type }) => {
                    const reaction = REACTIONS.find((r) => r.type === type);
                    return (
                      <span 
                        key={type}
                        className="inline-flex items-center justify-center w-5 h-5 
                                   bg-primary/20 rounded-full border border-tertiary text-xs
                                   hover:scale-110 transition-transform cursor-default"
                        title={reaction?.label || type}
                      >
                        {reaction ? reaction.label : type.charAt(0)}
                      </span>
                    );
                  })}
                  {reactionsByType.length > 3 && (
                    <span className="inline-flex items-center justify-center w-5 h-5 
                                     bg-gray-700 rounded-full border border-tertiary text-xs
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

          <button
            onClick={() => onCommentClick?.()}
            className="flex items-center gap-1.5 text-gray-400 text-sm 
                       hover:text-primary transition-all duration-200 group/button 
                       p-1 rounded-md hover:bg-primary/5 focus:outline-none 
                       focus:ring-1 focus:ring-primary/50"
            aria-label={`${totalComments} comments`}
          >
            <span className="text-lg group-hover/button:scale-110 transition-transform">
              💬
            </span>
            <span className="font-medium">{totalComments}</span>
            <span className="hidden sm:inline text-xs">
              {totalComments === 1 ? 'comentario' : 'comentarios'}
            </span>
          </button>
        </div>
      </footer>
    </article>
  );
}

export default PostCard;