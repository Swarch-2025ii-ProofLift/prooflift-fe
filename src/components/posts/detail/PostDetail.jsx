import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { useNavigate } from "react-router-dom";
import {
  GET_POST_DETAIL,
  UPDATE_POST,
  DELETE_POST,
  SET_REACTION,
  REMOVE_REACTION,
} from "../../../API/posts.js";

import PostDetailHeader from "./PostDetailHeader.jsx";
import PostDetailContent from "./PostDetailContent.jsx";
import PostStats from "./PostStats.jsx";
import DeleteConfirmModal from "./DeleteConfirmModal.jsx";
import PostInteractionBar from "../PostInteractionBar.jsx";
import CommentSection from "../comments/CommentSection.jsx";

function PostDetail({ postId, onClose, onDelete, currentUserId }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editBody, setEditBody] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const menuRef = useRef(null);
  const modalRef = useRef(null);
  const editTextareaRef = useRef(null);
  const navigate = useNavigate();

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

  const handleExerciseClick = useCallback((exerciseId) => {
    navigate(`/exercises/${exerciseId}`);
    handleClose();
  }, [navigate, handleClose]);

  if (!postId) return null;

  return (
    <div className={`fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4
                     ${isClosing ? 'animate-out fade-out zoom-out-95 duration-200' : 'animate-in fade-in zoom-in-95 duration-200'}`}>
      <div 
        ref={modalRef}
        className="bg-tertiary/70 rounded-xl shadow-2xl border border-gray-700/50 
                   max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
      >
        <PostDetailHeader onClose={handleClose} />

        <div className="flex-1 overflow-y-auto">
          {loading && !post && (
            <LoadingState />
          )}

          {error && !post && (
            <ErrorState error={error} />
          )}

          {post && (
            <div className="p-6 space-y-6">
              <PostDetailContent
                post={post}
                currentUserId={currentUserId}
                isEditing={isEditing}
                editBody={editBody}
                updateLoading={updateLoading}
                menuOpen={menuOpen}
                menuRef={menuRef}
                editTextareaRef={editTextareaRef}
                onEditBodyChange={setEditBody}
                onToggleMenu={() => setMenuOpen(!menuOpen)}
                onEditPost={handleEditPost}
                onSaveEdit={handleSaveEdit}
                onCancelEdit={handleCancelEdit}
                onShowDeleteConfirm={() => setShowDeleteConfirm(true)}
                onExerciseClick={handleExerciseClick}
                deleteLoading={deleteLoading}
              />

              <div className="h-px bg-gradient-to-r from-transparent via-gray-700/50 to-transparent"></div>

              <PostStats
                totalReactions={totalReactions}
                totalComments={totalComments}
                reactionsByType={reactionsByType}
              />

              <PostInteractionBar
                postId={postId}
                reactionsByType={reactionsByType}
                currentUserReaction={currentUserReaction}
                onToggleReaction={handleToggleReaction}
                onOpenComments={handleScrollToComments}
                disabled={isEditing}
              />

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

      {showDeleteConfirm && (
        <DeleteConfirmModal
          onCancel={() => setShowDeleteConfirm(false)}
          onConfirm={handleDeletePost}
          loading={deleteLoading}
        />
      )}
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-400 text-sm">Cargando publicación...</p>
      </div>
    </div>
  );
}

function ErrorState({ error }) {
  return (
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
  );
}

export default PostDetail;