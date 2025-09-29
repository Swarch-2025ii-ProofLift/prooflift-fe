import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useMutation } from "@apollo/client/react";
import {
  ADD_COMMENT,
  UPDATE_COMMENT,
  DELETE_COMMENT,
} from "../../API/posts.js";

const MAX_COMMENT_LENGTH = 500;
const TRUNCATE_LENGTH = 150;

function CommentSection({ 
  postId, 
  comments = [], 
  currentUserId, 
  refetch,
  disabled = false,
  maxHeight = "320px"
}) {
  const [newComment, setNewComment] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editBody, setEditBody] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [expandedComments, setExpandedComments] = useState(new Set());

  const menuRefs = useRef({});
  const editTextareaRef = useRef(null);
  const newCommentRef = useRef(null);

  const [addComment, { loading: addingComment }] = useMutation(ADD_COMMENT, {
    onCompleted: () => {
      setNewComment("");
      refetch();
      setTimeout(() => {
        const commentsContainer = document.querySelector('.comments-container');
        if (commentsContainer) {
          commentsContainer.scrollTop = commentsContainer.scrollHeight;
        }
      }, 100);
    },
    onError: (error) => console.error('Error adding comment:', error)
  });

  const [updateComment, { loading: updatingComment }] = useMutation(UPDATE_COMMENT, {
    onCompleted: () => {
      setEditingId(null);
      setEditBody("");
      refetch();
    },
    onError: (error) => console.error('Error updating comment:', error)
  });

  const [deleteComment, { loading: deletingComment }] = useMutation(DELETE_COMMENT, {
    onCompleted: () => {
      setShowDeleteConfirm(null);
      refetch();
    },
    onError: (error) => console.error('Error deleting comment:', error)
  });

  useEffect(() => {
    if (editingId && editTextareaRef.current) {
      editTextareaRef.current.focus();
      editTextareaRef.current.setSelectionRange(editBody.length, editBody.length);
    }
  }, [editingId, editBody.length]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key === 'Enter' && newComment.trim() && !addingComment && !disabled) {
        event.preventDefault();
        handleAddComment(event);
      }
    };

    const textarea = newCommentRef.current;
    if (textarea) {
      textarea.addEventListener('keydown', handleKeyDown);
      return () => textarea.removeEventListener('keydown', handleKeyDown);
    }
  }, [newComment, addingComment, disabled]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const openMenuRef = menuRefs.current[openMenuId];
      if (openMenuRef && !openMenuRef.contains(event.target)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openMenuId]);

  const handleAddComment = useCallback(async (e) => {
    e?.preventDefault();
    if (!newComment.trim() || disabled) return;
    
    await addComment({ variables: { postId, body: newComment.trim() } });
  }, [newComment, disabled, addComment, postId]);

  const handleEditComment = useCallback((commentId, oldBody) => {
    setEditingId(commentId);
    setEditBody(oldBody);
    setOpenMenuId(null);
  }, []);

  const handleSaveEdit = useCallback(async () => {
    if (!editBody.trim()) return;
    
    await updateComment({ variables: { commentId: editingId, body: editBody.trim() } });
  }, [editBody, editingId, updateComment]);

  const handleCancelEdit = useCallback(() => {
    setEditingId(null);
    setEditBody("");
  }, []);

  const handleDeleteComment = useCallback(async (commentId) => {
    await deleteComment({ variables: { commentId } });
  }, [deleteComment]);

  const formatRelativeTime = useCallback((dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = (now - date) / (1000 * 60);
    
    if (diffInMinutes < 1) return 'Ahora';
    if (diffInMinutes < 60) return `${Math.floor(diffInMinutes)}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}d`;
    return date.toLocaleDateString();
  }, []);

  const toggleCommentExpansion = useCallback((commentId) => {
    setExpandedComments(prev => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(commentId)) {
        newExpanded.delete(commentId);
      } else {
        newExpanded.add(commentId);
      }
      return newExpanded;
    });
  }, []);

  const isOverLimit = newComment.length > MAX_COMMENT_LENGTH;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-secondary flex items-center gap-2">
          <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          Comentarios
          {comments.length > 0 && (
            <span className="bg-primary/20 text-primary px-2 py-0.5 rounded-full text-sm font-medium">
              {comments.length}
            </span>
          )}
        </h3>
      </div>

      <div 
        className="comments-container space-y-3 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent"
        style={{ maxHeight }}
      >
        {comments.length === 0 ? (
          <div className="text-center py-8">
            <svg className="w-12 h-12 text-gray-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-gray-400 text-sm">No hay comentarios aún</p>
            <p className="text-gray-500 text-xs mt-1">Sé el primero en comentar</p>
          </div>
        ) : (
          comments.map((comment) => {
            const isEditing = editingId === comment.id;
            const isExpanded = expandedComments.has(comment.id);
            const shouldTruncate = comment.body.length > TRUNCATE_LENGTH;
            const displayBody = shouldTruncate && !isExpanded 
              ? comment.body.substring(0, TRUNCATE_LENGTH) + "..." 
              : comment.body;

            return (
              <div
                key={comment.id}
                className="group bg-background-secondary/50 rounded-lg p-4 border border-gray-700/30 
                           hover:border-gray-600/50 transition-all duration-200 hover:bg-background-secondary/70"
                ref={(el) => (menuRefs.current[comment.id] = el)}
              >
                <div className="flex justify-between items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <button
                        className="font-semibold text-primary hover:text-primary/80 transition-colors
                                   text-sm bg-primary/10 px-2 py-1 rounded-full"
                      >
                        @{comment.userId}
                      </button>
                      <time 
                        className="text-xs text-gray-400"
                        dateTime={comment.createdAt}
                        title={new Date(comment.createdAt).toLocaleString()}
                      >
                        {formatRelativeTime(comment.createdAt)}
                      </time>
                      {comment.updatedAt && comment.createdAt !== comment.updatedAt && (
                        <span className="text-xs text-gray-500 italic">editado</span>
                      )}
                    </div>

                    {isEditing ? (
                      <div className="space-y-3">
                        <textarea
                          ref={editTextareaRef}
                          value={editBody}
                          onChange={(e) => setEditBody(e.target.value)}
                          className="w-full p-3 rounded-lg bg-background-secondary border border-gray-600 
                                     text-secondary focus:outline-none focus:ring-2 focus:ring-primary/50
                                     resize-none min-h-[80px]"
                          placeholder="Edita tu comentario..."
                          maxLength={MAX_COMMENT_LENGTH}
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={handleCancelEdit}
                            disabled={updatingComment}
                            className="px-3 py-1.5 rounded-md font-medium text-gray-400
                                       bg-tertiary/60 hover:bg-tertiary hover:text-secondary
                                       transition-all duration-200 disabled:opacity-50 text-sm"
                          >
                            Cancelar
                          </button>
                          <button
                            onClick={handleSaveEdit}
                            disabled={updatingComment || !editBody.trim()}
                            className="px-3 py-1.5 rounded-md font-semibold bg-primary text-background
                                       hover:bg-primary/90 transition-all duration-200 disabled:opacity-50
                                       flex items-center gap-2 text-sm"
                          >
                            {updatingComment ? (
                              <>
                                <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
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
                      <div className="space-y-2">
                        <p className="text-secondary text-sm leading-relaxed whitespace-pre-wrap break-words">
                          {displayBody}
                        </p>
                        {shouldTruncate && (
                          <button
                            onClick={() => toggleCommentExpansion(comment.id)}
                            className="text-primary text-xs hover:text-primary/80 transition-colors
                                       font-medium focus:outline-none focus:underline"
                          >
                            {isExpanded ? 'Ver menos' : 'Ver más'}
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {comment.userId === currentUserId && !isEditing && (
                    <div className="relative flex-shrink-0">
                      <button
                        onClick={() => setOpenMenuId(openMenuId === comment.id ? null : comment.id)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-secondary 
                                   hover:bg-gray-700/50 transition-colors opacity-0 group-hover:opacity-100
                                   focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-primary/50"
                        aria-label="Opciones de comentario"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                      </button>

                      {openMenuId === comment.id && (
                        <div className="absolute right-8 -top-3 w-32 bg-background-secondary 
                                       rounded-lg shadow-xl border border-gray-700/50 py-1 z-10
                                       animate-in slide-in-from-right-2 fade-in duration-200">
                          <button
                            onClick={() => handleEditComment(comment.id, comment.body)}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-secondary 
                                       hover:bg-tertiary transition-colors"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Editar
                          </button>
                          <button
                            onClick={() => {
                              setShowDeleteConfirm(comment.id);
                              setOpenMenuId(null);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 
                                       hover:bg-red-500/10 transition-colors"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Eliminar
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="border-t border-gray-700/30 pt-4">
        <form onSubmit={handleAddComment} className="space-y-3">
          <div className="relative">
            <textarea
              ref={newCommentRef}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className={`w-full p-3 pr-12 rounded-lg bg-background-secondary border text-secondary 
                         placeholder-gray-500 focus:outline-none focus:ring-2 resize-none min-h-[80px]
                         disabled:opacity-50 disabled:cursor-not-allowed transition-colors
                         ${isOverLimit ? 'border-red-500 focus:ring-red-500/50' : 'border-gray-700 focus:ring-primary/50 focus:border-transparent'}`}
              placeholder="Escribe un comentario..."
              disabled={addingComment || disabled}
              maxLength={MAX_COMMENT_LENGTH}
              rows={2}
            />
            
            <div className={`absolute bottom-2 right-2 text-xs font-medium
                            ${isOverLimit ? 'text-red-400' : 'text-gray-500'}`}>
              {newComment.length}/{MAX_COMMENT_LENGTH}
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Presiona Ctrl+Enter para enviar
            </div>
            
            <button
              type="submit"
              disabled={addingComment || !newComment.trim() || disabled || isOverLimit}
              className="px-4 py-2.5 rounded-lg font-semibold text-sm bg-primary text-background
                         hover:bg-primary/90 transition-all duration-200 
                         disabled:opacity-50 disabled:cursor-not-allowed
                         flex items-center gap-2"
            >
              {addingComment ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Enviando...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  Comentar
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-tertiary rounded-xl p-6 max-w-sm w-full shadow-2xl border border-gray-700/50
                         animate-in zoom-in-95 fade-in duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-secondary">Eliminar comentario</h3>
                <p className="text-gray-400 text-sm">Esta acción no se puede deshacer.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                disabled={deletingComment}
                className="flex-1 px-4 py-2.5 rounded-lg font-medium text-gray-400
                           bg-tertiary/60 hover:bg-tertiary hover:text-secondary
                           transition-all duration-200 disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDeleteComment(showDeleteConfirm)}
                disabled={deletingComment}
                className="flex-1 px-3 py-2 rounded-lg font-medium bg-red-500 text-white
                           hover:bg-red-600 transition-colors disabled:opacity-50
                           flex items-center justify-center gap-2"
              >
                {deletingComment ? (
                  <>
                    <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
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

export default CommentSection;