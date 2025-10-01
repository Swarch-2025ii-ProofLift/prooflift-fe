import PostHeader from "./PostHeader";
import PostBody from "./PostBody";
import PostExercises from "./PostExercises";
import PostActionMenu from "./PostActionMenu";

function PostDetailContent({
  post,
  currentUserId,
  isEditing,
  editBody,
  editSelectedExercises,
  updateLoading,
  menuOpen,
  menuRef,
  editTextareaRef,
  onEditBodyChange,
  onEditExercisesChange,
  onToggleMenu,
  onEditPost,
  onSaveEdit,
  onCancelEdit,
  onShowDeleteConfirm,
  onExerciseClick,
  deleteLoading
}) {
  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <PostHeader post={post} />

        {post.userId === currentUserId && (
          <PostActionMenu
            menuOpen={menuOpen}
            menuRef={menuRef}
            isEditing={isEditing}
            deleteLoading={deleteLoading}
            onToggleMenu={onToggleMenu}
            onEditPost={onEditPost}
            onShowDeleteConfirm={onShowDeleteConfirm}
          />
        )}
      </div>

      <div className="space-y-4">
        <PostBody
          post={post}
          isEditing={isEditing}
          editBody={editBody}
          editSelectedExercises={editSelectedExercises}
          updateLoading={updateLoading}
          editTextareaRef={editTextareaRef}
          onEditBodyChange={onEditBodyChange}
          onEditExercisesChange={onEditExercisesChange}
          onSaveEdit={onSaveEdit}
          onCancelEdit={onCancelEdit}
        />

        {!isEditing && post.exerciseIds && post.exerciseIds.length > 0 && (
          <PostExercises 
            exerciseIds={post.exerciseIds} 
            onExerciseClick={onExerciseClick}
          />
        )}
      </div>
    </>
  );
}

export default PostDetailContent;