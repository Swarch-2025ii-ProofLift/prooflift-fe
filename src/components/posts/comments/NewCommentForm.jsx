import { useRef, useEffect } from "react";

const MAX_COMMENT_LENGTH = 500;

function NewCommentForm({ value, onChange, onSubmit, loading, disabled }) {
  const textareaRef = useRef(null);
  const isOverLimit = value.length > MAX_COMMENT_LENGTH;

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key === 'Enter' && value.trim() && !loading && !disabled) {
        event.preventDefault();
        onSubmit(event);
      }
    };

    const textarea = textareaRef.current;
    if (textarea) {
      textarea.addEventListener('keydown', handleKeyDown);
      return () => textarea.removeEventListener('keydown', handleKeyDown);
    }
  }, [value, loading, disabled, onSubmit]);

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full p-3 pr-12 rounded-lg bg-background-secondary border text-secondary 
                     placeholder-gray-500 focus:outline-none focus:ring-2 resize-none min-h-[80px]
                     disabled:opacity-50 disabled:cursor-not-allowed transition-colors
                     ${isOverLimit ? 'border-red-500 focus:ring-red-500/50' : 'border-gray-700 focus:ring-primary/50 focus:border-transparent'}`}
          placeholder="Escribe un comentario..."
          disabled={loading || disabled}
          maxLength={MAX_COMMENT_LENGTH}
          rows={2}
        />
        
        <div className={`absolute bottom-2 right-2 text-xs font-medium
                        ${isOverLimit ? 'text-red-400' : 'text-gray-500'}`}>
          {value.length}/{MAX_COMMENT_LENGTH}
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
          disabled={loading || !value.trim() || disabled || isOverLimit}
          className="px-4 py-2.5 rounded-lg font-semibold text-sm bg-primary text-background
                     hover:bg-primary/90 transition-all duration-200 
                     disabled:opacity-50 disabled:cursor-not-allowed
                     flex items-center gap-2"
        >
          {loading ? (
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
  );
}

export default NewCommentForm;