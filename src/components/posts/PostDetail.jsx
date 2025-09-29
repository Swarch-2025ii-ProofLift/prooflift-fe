import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import {
  GET_POST_DETAIL,
  UPDATE_POST,
  DELETE_POST,
  SET_REACTION,
  REMOVE_REACTION,
} from "../../API/posts.js";
import { REACTIONS } from "../../constants/reactions.js";

import PostInteractionBar from "./PostInteractionBar";
import CommentSection from "./CommentSection";

function PostDetail({ postId, onClose, onDelete, currentUserId }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editBody, setEditBody] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const menuRef = useRef(null);
  const modalRef = useRef(null);
  const editTextareaRef = useRef(null);

  const { data, loading, error, refetch } = useQuery(GET_POST_DETAIL, {
    variables: { postId, skip: 0, limit: 50 },
    skip: !postId,
    fetchPolicy: 'cache-and-network',
  });

  const [updatePost, { loading: updateLoading }] = useMutation(UPDATE_POST, {
    onCompleted: () => {
      setIsEditing(false);
      setEditBody("");
    },
    onError: (error) => console.error('Error updating post:', error)
  });

  const [deletePost, { loading: deleteLoading }] = useMutation(DELETE_POST, {
    onCompleted: () => {
      setShowDeleteConfirm(false);
      onDelete?.();
    },
    onError: (error) => console.error('Error deleting post:', error)
  });

  const [setReaction] = useMutation(SET_REACTION, {
    optimisticResponse: (vars) => ({
      setReaction: {
        __typename: 'ReactionType',
        type: vars.type,
        userId: currentUserId
      }
    }),
    onCompleted: () => refetch()
  });

  const [removeReaction] = useMutation(REMOVE_REACTION, {
    optimisticResponse: {
      removeReaction: {
        __typename: 'RemoveReactionResponse',
        success: true
      }
    },
    onCompleted: () => refetch()
  });

  const post = data?.getAggregatedPostById?.post;
  const comments = data?.getCommentsForPost || [];
  const totalComments = data?.getAggregatedPostById?.totalComments || 0;
  const totalReactions = useMemo(() => 
    data?.getAggregatedPostById?.reactionsByType?.reduce((sum, r) => sum + r.count, 0) || 0
  , [data?.getAggregatedPostById?.reactionsByType]);
  const reactionsByType = data?.getAggregatedPostById?.reactionsByType || [];
  const currentUserReaction = data?.getAggregatedPostById?.currentUserReaction || null;

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && !isEditing && !showDeleteConfirm) {
        handleClose();
      }
    };

    const handleClickOutside = (event) => {
      if (showDeleteConfirm) return;
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
      if (modalRef.current && !modalRef.current.contains(event.target) && !isEditing) {
        handleClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);
    
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isEditing, showDeleteConfirm]);

  useEffect(() => {
    if (isEditing && editTextareaRef.current) {
      editTextareaRef.current.focus();
      editTextareaRef.current.setSelectionRange(editBody.length, editBody.length);
    }
  }, [isEditing, editBody.length]);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => onClose(), 200);
  }, [onClose]);

  const handleEditPost = useCallback(() => {
    if (post?.body) {
      setEditBody(post.body);
      setIsEditing(true);
      setMenuOpen(false);
    }
  }, [post?.body]);

  const handleSaveEdit = useCallback(async () => {
    if (!editBody.trim()) return;
    
    await updatePost({
      variables: { postId, body: editBody.trim() },
      refetchQueries: [{ query: GET_POST_DETAIL, variables: { postId } }],
    });
  }, [editBody, postId, updatePost]);

  const handleCancelEdit = useCallback(() => {
    setIsEditing(false);
    setEditBody("");
  }, []);

  const handleDeletePost = useCallback(async () => {
    await deletePost({ variables: { postId } });
  }, [deletePost, postId]);

  const handleToggleReaction = useCallback(async (type) => {
    if (currentUserReaction?.type === type) {
      await removeReaction({ variables: { postId } });
    } else {
      await setReaction({ variables: { postId, type } });
    }
  }, [currentUserReaction, postId, setReaction, removeReaction]);

  const handleScrollToComments = useCallback(() => {
    const commentSection = document.getElementById("comment-section");
    if (commentSection) {
      commentSection.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  const formatRelativeTime = useCallback((dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 1) return 'Hace unos minutos';
    if (diffInHours < 24) return `Hace ${Math.floor(diffInHours)}h`;
    if (diffInHours < 168) return `Hace ${Math.floor(diffInHours / 24)}d`;
    return date.toLocaleDateString();
  }, []);

  if (!postId) return null;

  return (
    <div className={`fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4
                     ${isClosing ? 'animate-out fade-out zoom-out-95 duration-200' : 'animate-in fade-in zoom-in-95 duration-200'}`}>
      <div 
        ref={modalRef}
        className="bg-tertiary/70 rounded-xl shadow-2xl border border-gray-700/50 
                   max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700/50 bg-tertiary/70 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-secondary">Detalle de publicación</h2>
          </div>
          
          <button
            onClick={handleClose}
            className="p-2 rounded-lg text-gray-400 hover:text-secondary hover:bg-gray-700/50 
                       transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
            aria-label="Cerrar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {loading && !post && (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-400 text-sm">Cargando publicación...</p>
              </div>
            </div>
          )}

          {error && !post && (
            <div className="p-6">
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-center gap-3">
                <svg className="w-6 h-6 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h3 className="text-red-400 font-medium">Error al cargar</h3>
                  <p className="text-red-300 text-sm mt-1">{error.message}</p>
                </div>
              </div>
            </div>
          )}

          {post && (
            <div className="p-6 space-y-6">
              {/* Post Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div className="flex-1 space-y-3">
                  <button
                    className="text-secondary font-bold text-sm md:text-base bg-primary/10 
                               hover:bg-primary/20 px-4 py-2 rounded-full inline-block
                               transition-all duration-200 hover:scale-105 focus:outline-none 
                               focus:ring-2 focus:ring-primary/50"
                    aria-label={`View ${post.userId}'s profile`}
                  >
                    @{post.userId}
                  </button>

                  <div className="text-gray-400 text-sm space-y-1">
                    <time dateTime={post.createdAt}>
                      {formatRelativeTime(post.createdAt)}
                    </time>
                    {post.updatedAt && post.createdAt !== post.updatedAt && (
                      <div className="text-xs opacity-75">
                        Editado {formatRelativeTime(post.updatedAt)}
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Menu */}
                {post.userId === currentUserId && (
                  <div className="relative" ref={menuRef}>
                    <button
                      onClick={() => setMenuOpen(!menuOpen)}
                      className="p-2 rounded-lg text-gray-400 hover:text-secondary 
                                 hover:bg-gray-700/50 transition-colors focus:outline-none
                                 focus:ring-2 focus:ring-primary/50"
                      aria-label="Opciones de publicación"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                    </button>

                    {menuOpen && (
                      <div className="absolute right-8 top-0 w-40 bg-background-secondary rounded-lg 
                                     shadow-xl border border-gray-700/50 py-1 z-10
                                     animate-in slide-in-from-right-2 fade-in duration-200">
                        <button
                          onClick={handleEditPost}
                          disabled={isEditing}
                          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-400 
                                     hover:bg-tertiary hover:text-secondary transition-all duration-200 disabled:opacity-50"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Editar
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(true)}
                          disabled={deleteLoading}
                          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-400 
                                     hover:bg-red-500/10 transition-colors disabled:opacity-50"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Eliminar
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Post Content */}
              <div className="space-y-4">
                {isEditing ? (
                  <div className="space-y-3">
                    <textarea
                      ref={editTextareaRef}
                      value={editBody}
                      onChange={(e) => setEditBody(e.target.value)}
                      maxLength={500}
                      className="w-full p-4 rounded-lg bg-background-secondary text-secondary 
                                 border border-gray-700 focus:outline-none focus:ring-2 
                                 focus:ring-primary/50 resize-none min-h-[120px]"
                      placeholder="Escribe tu publicación..."
                    />
                    <div className="flex gap-3">
                      <button
                        onClick={handleCancelEdit}
                        disabled={updateLoading}
                        className="px-4 py-2.5 rounded-lg font-medium text-gray-400
                                   bg-tertiary/60 hover:bg-tertiary hover:text-secondary
                                   transition-all duration-200 disabled:opacity-50"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={handleSaveEdit}
                        disabled={updateLoading || !editBody.trim()}
                        className="px-4 py-2.5 rounded-lg font-semibold text-sm bg-primary text-background
                                   hover:bg-primary/90 transition-all duration-200 disabled:opacity-50
                                   flex items-center gap-2"
                      >
                        {updateLoading ? (
                          <>
                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Guardando...
                          </>
                        ) : (
                          'Guardar'
                        )}
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-secondary text-base leading-relaxed whitespace-pre-wrap break-words">
                    {post.body}
                  </p>
                )}

                {/* Exercises */}
                {post.exerciseIds && post.exerciseIds.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs text-gray-400 mr-1 self-center">Ejercicios:</span>
                    {post.exerciseIds.map((exercise, index) => (
                      <span
                        key={index}
                        className="text-primary text-xs bg-primary/10 px-2.5 py-1 
                                   rounded-md border border-primary/20"
                      >
                        #{exercise}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-transparent via-gray-700/50 to-transparent"></div>

              {/* Stats Section */}
              {(totalReactions > 0 || totalComments > 0) && (
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
              )}

              {/* Interaction Bar */}
              <PostInteractionBar
                postId={postId}
                reactionsByType={reactionsByType}
                currentUserReaction={currentUserReaction}
                onToggleReaction={handleToggleReaction}
                onOpenComments={handleScrollToComments}
                disabled={isEditing}
              />

              {/* Comments Section */}
              <div id="comment-section">
                <CommentSection
                  postId={postId}
                  comments={comments}
                  currentUserId={currentUserId}
                  refetch={refetch}
                  disabled={isEditing}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-60 p-4">
          <div className="bg-tertiary rounded-xl p-6 max-w-md w-full shadow-2xl border border-gray-700/50
                         animate-in zoom-in-95 fade-in duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-secondary">Eliminar publicación</h3>
                <p className="text-gray-400 text-sm">Esta acción no se puede deshacer.</p>
              </div>
            </div>
            
            <p className="text-gray-300 mb-6">
              ¿Estás seguro de que quieres eliminar esta publicación? 
              Se perderán todos los comentarios y reacciones.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleteLoading}
                className="flex-1 px-4 py-2.5 rounded-lg font-medium text-gray-400
                           bg-tertiary/60 hover:bg-tertiary hover:text-secondary
                           transition-all duration-200 disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeletePost}
                disabled={deleteLoading}
                className="flex-1 px-4 py-2.5 rounded-lg font-semibold text-sm bg-red-500 text-white
                           hover:bg-red-600 transition-all duration-200 disabled:opacity-50
                           flex items-center justify-center gap-2"
              >
                {deleteLoading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Eliminando...
                  </>
                ) : (
                  'Eliminar'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PostDetail;