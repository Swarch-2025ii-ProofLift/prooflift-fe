function PostActionMenu({
  menuOpen,
  menuRef,
  isEditing,
  deleteLoading,
  onToggleMenu,
  onEditPost,
  onShowDeleteConfirm
}) {
  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={onToggleMenu}
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
            onClick={onEditPost}
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
            onClick={onShowDeleteConfirm}
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
  );
}

export default PostActionMenu;