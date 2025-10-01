import { useState, useCallback } from "react";
import { useMutation } from "@apollo/client/react";
import {
  ADD_COMMENT,
  UPDATE_COMMENT,
  DELETE_COMMENT,
} from "../../../API/posts.js";

import CommentItem from "./CommentItem";
import DeleteConfirmModal from "./DeleteConfirmModal";
import NewCommentForm from "./NewCommentForm.jsx";

function CommentSection({ 
  postId, 
  comments = [], 
  currentUserId, 
  refetch,
  disabled = false,
  maxHeight = "320px"
}) {
  const [newComment, setNewComment] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editBody, setEditBody] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

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

  const handleAddComment = useCallback(async (e) => {
    e?.preventDefault();
    if (!newComment.trim() || disabled) return;
    await addComment({ variables: { postId, body: newComment.trim() } });
  }, [newComment, disabled, addComment, postId]);

  const handleStartEdit = useCallback((commentId, body) => {
    setEditingId(commentId);
    setEditBody(body);
  }, []);

  const handleSaveEdit = useCallback(async () => {
    if (!editBody.trim()) return;
    await updateComment({ variables: { commentId: editingId, body: editBody.trim() } });
  }, [editBody, editingId, updateComment]);

  const handleCancelEdit = useCallback(() => {
    setEditingId(null);
    setEditBody("");
  }, []);

  const handleDeleteComment = useCallback(async () => {
    await deleteComment({ variables: { commentId: showDeleteConfirm } });
  }, [deleteComment, showDeleteConfirm]);

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

  return (
    <div className="space-y-4">
      {/* Header */}
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

      {/* Comments list */}
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
          comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              currentUserId={currentUserId}
              isEditing={editingId === comment.id}
              editBody={editBody}
              onEditBodyChange={setEditBody}
              onStartEdit={handleStartEdit}
              onSaveEdit={handleSaveEdit}
              onCancelEdit={handleCancelEdit}
              onDelete={setShowDeleteConfirm}
              formatRelativeTime={formatRelativeTime}
              updatingComment={updatingComment}
            />
          ))
        )}
      </div>

      {/* New comment form */}
      <div className="border-t border-gray-700/30 pt-4">
        <NewCommentForm
          value={newComment}
          onChange={setNewComment}
          onSubmit={handleAddComment}
          loading={addingComment}
          disabled={disabled}
        />
      </div>

      {/* Delete confirmation */}
      <DeleteConfirmModal
        isOpen={!!showDeleteConfirm}
        onConfirm={handleDeleteComment}
        onCancel={() => setShowDeleteConfirm(null)}
        loading={deletingComment}
      />
    </div>
  );
}

export default CommentSection;