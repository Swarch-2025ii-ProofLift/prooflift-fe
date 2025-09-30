import { useRef, useEffect } from "react";

const MAX_COMMENT_LENGTH = 500;

function CommentEditForm({ value, onChange, onSave, onCancel, loading }) {
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(value.length, value.length);
    }
  }, []);

  return (
    <div className="space-y-3">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-3 rounded-lg bg-background-secondary border border-gray-600 
                   text-secondary focus:outline-none focus:ring-2 focus:ring-primary/50
                   resize-none min-h-[80px]"
        placeholder="Edita tu comentario..."
        maxLength={MAX_COMMENT_LENGTH}
      />
      <div className="flex gap-2">
        <button
          onClick={onCancel}
          disabled={loading}
          className="px-3 py-1.5 rounded-md font-medium text-gray-400
                     bg-tertiary/60 hover:bg-tertiary hover:text-secondary
                     transition-all duration-200 disabled:opacity-50 text-sm"
        >
          Cancelar
        </button>
        <button
          onClick={onSave}
          disabled={loading || !value.trim()}
          className="px-3 py-1.5 rounded-md font-semibold bg-primary text-background
                     hover:bg-primary/90 transition-all duration-200 disabled:opacity-50
                     flex items-center gap-2 text-sm"
        >
          {loading ? (
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
  );
}

export default CommentEditForm;