function PostDetailHeader({ onClose }) {
  return (
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
        onClick={onClose}
        className="p-2 rounded-lg text-gray-400 hover:text-secondary hover:bg-gray-700/50 
                   transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
        aria-label="Cerrar"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

export default PostDetailHeader;