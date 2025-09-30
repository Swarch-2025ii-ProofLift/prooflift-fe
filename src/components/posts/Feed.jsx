import { useState, useRef, useMemo, useCallback } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { useNavigate } from "react-router-dom";
import { GET_AGGREGATED_POSTS, SET_REACTION, REMOVE_REACTION } from "../../API/posts.js";
import PostDetail from "./detail/PostDetail.jsx";
import PostItem from "./PostItem.jsx";
import CreatePost from "./create/CreatePost.jsx";

function Feed({ 
  currentUserId, 
  limit = 100, 
  showCreateButton = true,
  layout = "default",
  filter = "all"
}) {
  const [selectedPostId, setSelectedPostId] = useState(null);
  const feedRef = useRef(null);
  const navigate = useNavigate();

  const { data, loading, error, refetch } = useQuery(GET_AGGREGATED_POSTS, {
    variables: { skip: 0, limit },
    errorPolicy: 'all',
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true
  });

  const [setReaction] = useMutation(SET_REACTION, {
    optimisticResponse: (vars) => ({
      setReaction: {
        __typename: 'ReactionType',
        type: vars.type,
        userId: currentUserId
      }
    }),
    onCompleted: () => {
      refetch();
    }
  });

  const [removeReaction] = useMutation(REMOVE_REACTION, {
    optimisticResponse: {
      removeReaction: {
        __typename: 'RemoveReactionResponse',
        success: true
      }
    },
    onCompleted: () => {
      refetch();
    }
  });

  const handleToggleReaction = useCallback(async (postId, type, currentUserReaction) => {
    try {
      if (currentUserReaction && currentUserReaction.type === type) {
        await removeReaction({ variables: { postId } });
      } else {
        await setReaction({ variables: { postId, type } });
      }
    } catch (error) {
      console.error('Error toggling reaction:', error);
    }
  }, [setReaction, removeReaction]);

  const handleUserClick = useCallback((userId) => {
    console.log('Navigate to user:', userId);
  }, []);

  const handleExerciseClick = useCallback((exerciseId) => {
    navigate(`/exercises/${exerciseId}`);
  }, [navigate]);

  const handlePostCreated = useCallback(() => {
    refetch();
  }, [refetch]);

  const handlePostDeleted = useCallback(() => {
    setSelectedPostId(null);
    refetch();
  }, [refetch]);

  const layoutClasses = useMemo(() => {
    switch (layout) {
      case "compact":
        return "flex flex-col gap-6 max-w-4xl mx-auto";
      case "grid":
        return "grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto";
      default:
        return "flex flex-col gap-6 max-w-4xl mx-auto";
    }
  }, [layout]);

  const filteredPosts = useMemo(() => {
    if (!data?.getAggregatedPost) return [];
    
    const posts = [...data.getAggregatedPost];
    
    switch (filter) {
      case "recent":
        return posts.sort((a, b) => new Date(b.post.createdAt) - new Date(a.post.createdAt));
      case "popular":
        return posts.sort((a, b) => (b.totalReactions + b.totalComments) - (a.totalReactions + a.totalComments));
      default:
        return posts;
    }
  }, [data, filter]);

  const LoadingSkeleton = useCallback(() => (
    <div className={layoutClasses}>
      {Array.from({ length: 3 }).map((_, index) => (
        <PostItem
          key={`skeleton-${index}`}
          post={{}}
          loading={true}
          variant={layout === "grid" ? "grid" : layout}
        />
      ))}
    </div>
  ), [layoutClasses, layout]);

  if (error && !data) {
    return (
      <div className="feed flex flex-col items-center justify-center p-8 text-center">
        <div className="bg-tertiary rounded-xl p-6 max-w-md">
          <svg className="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-semibold text-secondary mb-2">Error al cargar el feed</h3>
          <p className="text-gray-400 mb-4">{error.message}</p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-primary text-background rounded-lg hover:bg-primary/90 transition-colors"
          >
            Intentar de nuevo
          </button>
        </div>
      </div>
    );
  }

  if (loading && !data) {
    return (
      <div className="feed p-4 lg:p-6">
        <LoadingSkeleton />
      </div>
    );
  }

  return (
    <div className="feed" ref={feedRef}>
      {showCreateButton && (
        <div className="max-w-4xl mx-auto mb-8">
          <CreatePost onPostCreated={handlePostCreated} />
        </div>
      )}

      {/* Posts Container */}
      <div className={layoutClasses}>
        {filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-tertiary rounded-xl p-8 max-w-md mx-auto">
              <svg className="w-16 h-16 text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-lg font-semibold text-secondary mb-2">No hay publicaciones</h3>
              <p className="text-gray-400 mb-4">
                Sé el primero en compartir algo con la comunidad
              </p>
            </div>
          </div>
        ) : (
          filteredPosts.map((aggregatedPost) => {
            const { post, totalComments, totalReactions, reactionsByType, currentUserReaction } = aggregatedPost;
            
            return (
              <PostItem
                key={post.id}
                post={post}
                totalComments={totalComments}
                totalReactions={totalReactions}
                reactionsByType={reactionsByType}
                currentUserReaction={currentUserReaction}
                currentUserId={currentUserId}
                onToggleReaction={(type) =>
                  handleToggleReaction(post.id, type, currentUserReaction)
                }
                onOpenComments={() => setSelectedPostId(post.id)}
                onUserClick={handleUserClick}
                onExerciseClick={handleExerciseClick}
                variant={layout === "grid" ? "grid" : layout}
              />
            );
          })
        )}
      </div>

      {/* Floating Button */}
      {showCreateButton && (
        <div className="fixed bottom-6 right-6 z-40">
          <button
            onClick={() => {
              const createPostElement = document.querySelector('.create-post-component');
              if (createPostElement) {
                createPostElement.scrollIntoView({ 
                  behavior: 'smooth', 
                  block: 'center' 
                });
                setTimeout(() => {
                  const textarea = createPostElement.querySelector('textarea');
                  if (textarea) {
                    textarea.focus();
                  }
                }, 300);
              }
            }}
            className="group w-14 h-14 bg-primary text-background rounded-full shadow-lg 
                       hover:shadow-xl hover:scale-110 transition-all duration-300
                       flex items-center justify-center focus:outline-none focus:ring-4 
                       focus:ring-primary/50 hover:bg-primary/90"
            aria-label="Ir a crear publicación"
            title="Crear publicación"
          >
            <svg className="w-6 h-6 group-hover:rotate-45 transition-transform duration-300" 
                 fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      )}

      {/* Post Details */}
      {selectedPostId && (
        <PostDetail
          postId={selectedPostId}
          onClose={() => { setSelectedPostId(null); refetch();}}
          onDelete={handlePostDeleted}
          currentUserId={currentUserId}
        />
      )}
    </div>
  );
}

export { Feed };