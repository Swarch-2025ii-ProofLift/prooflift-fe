import { useState, useRef, useCallback } from "react";

import CommentMenu from "./CommentMenu";
import CommentEditForm from "./CommentEditForm";

const TRUNCATE_LENGTH = 150;

function CommentItem({ 
  comment, 
  currentUserId, 
  isEditing,
  editBody,
  onEditBodyChange,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onDelete,
  formatRelativeTime,
  updatingComment
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const shouldTruncate = comment.body.length > TRUNCATE_LENGTH;
  const displayBody = shouldTruncate && !isExpanded 
    ? comment.body.substring(0, TRUNCATE_LENGTH) + "..." 
    : comment.body;

  const toggleExpansion = useCallback(() => {
    setIsExpanded(prev => !prev);
  }, []);

  return (
    <div
      ref={menuRef}
      className="group bg-background-secondary/50 rounded-lg p-4 border border-gray-700/30 
                 hover:border-gray-600/50 transition-all duration-200 hover:bg-background-secondary/70"
    >
      <div className="flex justify-between items-start gap-3">
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 mb-2">
            <button className="font-semibold text-primary hover:text-primary/80 transition-colors
                             text-sm bg-primary/10 px-2 py-1 rounded-full">
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

          {/* Body */}
          {isEditing ? (
            <CommentEditForm
              value={editBody}
              onChange={onEditBodyChange}
              onSave={onSaveEdit}
              onCancel={onCancelEdit}
              loading={updatingComment}
            />
          ) : (
            <div className="space-y-2">
              <p className="text-secondary text-sm leading-relaxed whitespace-pre-wrap break-words">
                {displayBody}
              </p>
              {shouldTruncate && (
                <button
                  onClick={toggleExpansion}
                  className="text-primary text-xs hover:text-primary/80 transition-colors
                             font-medium focus:outline-none focus:underline"
                >
                  {isExpanded ? 'Ver menos' : 'Ver más'}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Menu button */}
        {comment.userId === currentUserId && !isEditing && (
          <div className="relative flex-shrink-0">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-secondary 
                         hover:bg-gray-700/50 transition-colors opacity-0 group-hover:opacity-100
                         focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-primary/50"
              aria-label="Opciones de comentario"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>

            <CommentMenu
              commentId={comment.id}
              isOpen={menuOpen}
              onEdit={() => {
                onStartEdit(comment.id, comment.body);
                setMenuOpen(false);
              }}
              onDelete={() => {
                onDelete(comment.id);
                setMenuOpen(false);
              }}
              onClose={() => setMenuOpen(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default CommentItem;