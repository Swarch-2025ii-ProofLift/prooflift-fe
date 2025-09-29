function PostBody({
  post,
  isEditing,
  editBody,
  updateLoading,
  editTextareaRef,
  onEditBodyChange,
  onSaveEdit,
  onCancelEdit
}) {
  if (isEditing) {
    return (
      <div className="space-y-3">
        <textarea
          ref={editTextareaRef}
          value={editBody}
          onChange={(e) => onEditBodyChange(e.target.value)}
          maxLength={500}
          className="w-full p-4 rounded-lg bg-background-secondary text-secondary 
                     border border-gray-700 focus:outline-none focus:ring-2 
                     focus:ring-primary/50 resize-none min-h-[120px]"
          placeholder="Escribe tu publicación..."
        />
        <div className="flex gap-3">
          <button
            onClick={onCancelEdit}
            disabled={updateLoading}
            className="px-4 py-2.5 rounded-lg font-medium text-gray-400
                       bg-tertiary/60 hover:bg-tertiary hover:text-secondary
                       transition-all duration-200 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={onSaveEdit}
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
    );
  }

  return (
    <p className="text-secondary text-base leading-relaxed whitespace-pre-wrap break-words">
      {post.body}
    </p>
  );
}

export default PostBody;