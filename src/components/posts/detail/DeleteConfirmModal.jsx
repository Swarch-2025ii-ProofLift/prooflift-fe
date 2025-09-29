function DeleteConfirmModal({ onCancel, onConfirm, loading }) {
  return (
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
            onClick={onCancel}
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-lg font-medium text-gray-400
                       bg-tertiary/60 hover:bg-tertiary hover:text-secondary
                       transition-all duration-200 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-lg font-semibold text-sm bg-red-500 text-white
                       hover:bg-red-600 transition-all duration-200 disabled:opacity-50
                       flex items-center justify-center gap-2"
          >
            {loading ? (
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
  );
}

export default DeleteConfirmModal;