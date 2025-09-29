import { useState, useCallback, useMemo } from "react";
import { useMutation } from "@apollo/client/react";
import { CREATE_POST } from "../../API/posts.js";

const mockExercises = [
  { id: "11111111-1111-1111-1111-111111111111", name: "Push-ups" },
  { id: "22222222-2222-2222-2222-222222222222", name: "Squats" },
  { id: "33333333-3333-3333-3333-333333333333", name: "Plank" },
  { id: "44444444-4444-4444-4444-444444444444", name: "Burpees" },
  { id: "55555555-5555-5555-5555-555555555555", name: "Pull-ups" },
];

const MAX_CHARACTERS = 500;

function CreatePost({ onPostCreated, placeholder = "¿Qué estás entrenando hoy?" }) {
  const [body, setBody] = useState("");
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [error, setError] = useState("");

  const [createPost, { loading }] = useMutation(CREATE_POST, {
    onCompleted: (data) => {
      setBody("");
      setSelectedExercises([]);
      setIsExpanded(false);
      setError("");
      onPostCreated?.(data.createPost);
    },
    onError: (err) => {
      console.error(err);
      setError("Error al crear la publicación. Inténtalo de nuevo.");
    },
  });

  const characterCount = body.length;
  const isNearLimit = characterCount > MAX_CHARACTERS * 0.8;
  const isOverLimit = characterCount > MAX_CHARACTERS;

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!body.trim()) {
      setError("Por favor, escribe algo antes de publicar.");
      return;
    }

    setError("");
    await createPost({
      variables: {
        body: body.trim(),
        exerciseIds: selectedExercises,
      },
    });
  }, [body, selectedExercises, createPost]);

  const handleTextareaFocus = useCallback(() => {
    setIsExpanded(true);
  }, []);

  const handleCancel = useCallback(() => {
    setBody("");
    setSelectedExercises([]);
    setIsExpanded(false);
    setError("");
  }, []);

  const toggleExercise = useCallback((exerciseId) => {
    setSelectedExercises((prev) =>
      prev.includes(exerciseId)
        ? prev.filter((id) => id !== exerciseId)
        : [...prev, exerciseId]
    );
  }, []);

  return (
    <div className="w-full create-post-component">
      <form
        onSubmit={handleSubmit}
        className={`p-4 md:p-6 bg-tertiary/30 rounded-xl shadow-lg border border-tertiary/50
                   transition-all duration-300 ease-out flex flex-col gap-4
                   ${isExpanded ? 'shadow-xl border-tertiary/80' : 'hover:shadow-xl hover:border-tertiary/80'}`}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <h3 className="text-secondary font-semibold text-lg">Crear publicación</h3>
        </div>

        <div className="relative">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            onFocus={handleTextareaFocus}
            placeholder={placeholder}
            maxLength={MAX_CHARACTERS}
            className={`w-full p-3 md:p-4 rounded-lg bg-background-secondary text-secondary 
                       placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50
                       resize-none transition-all duration-200 border border-transparent
                       ${isExpanded ? 'min-h-[120px]' : 'min-h-[60px]'}
                       ${isOverLimit ? 'border-red-500 focus:ring-red-500/50' : ''}
                       hover:bg-background-secondary/80`}
            rows={isExpanded ? 5 : 2}
          />
          
          {isExpanded && (
            <div className={`absolute bottom-2 right-2 text-xs font-medium
                            ${isOverLimit ? 'text-red-400' : isNearLimit ? 'text-yellow-400' : 'text-gray-500'}`}>
              {characterCount}/{MAX_CHARACTERS}
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-center gap-2">
            <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {selectedExercises.length > 0 && (
          <div className="space-y-2">
            <label className="text-gray-400 text-sm font-medium">Ejercicios seleccionados:</label>
            <div className="flex flex-wrap gap-2">
              {selectedExercises.map((id) => {
                const exercise = mockExercises.find((ex) => ex.id === id);
                return (
                  <span
                    key={id}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary text-background 
                             rounded-full text-sm font-medium shadow-md hover:shadow-lg
                             transition-all duration-200 hover:scale-105"
                  >
                    {exercise?.name}
                    <button
                      type="button"
                      onClick={() => toggleExercise(id)}
                      className="ml-1 w-4 h-4 flex items-center justify-center rounded-full
                               hover:bg-background/20 transition-colors group"
                      aria-label={`Remove ${exercise?.name}`}
                    >
                      <svg className="w-3 h-3 group-hover:scale-110 transition-transform" 
                           fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {isExpanded && (
          <div className="space-y-3 animate-in slide-in-from-top-2 fade-in duration-200">
            <label className="text-gray-400 text-sm font-medium flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14-7l2 2-2 2M5 13l-2-2 2-2" />
              </svg>
              Agregar ejercicios:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {mockExercises.map((exercise) => {
                const isSelected = selectedExercises.includes(exercise.id);
                return (
                  <button
                    key={exercise.id}
                    type="button"
                    onClick={() => toggleExercise(exercise.id)}
                    className={`p-3 rounded-lg text-sm font-medium transition-all duration-200
                               border-2 flex items-center justify-center gap-2
                               ${isSelected
                                 ? 'bg-primary text-background border-primary shadow-md scale-95'
                                 : 'bg-background-secondary text-secondary border-gray-700 hover:border-primary/50 hover:bg-primary/5 hover:scale-105'
                               }`}
                  >
                    <span className="text-xs">
                      {isSelected ? '✅' : '🏋️'}
                    </span>
                    {exercise.name}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {isExpanded && (
          <div className="flex gap-3 pt-2 animate-in slide-in-from-bottom-2 fade-in duration-200">
            <button
              type="button"
              onClick={handleCancel}
              disabled={loading}
              className="flex-1 px-4 py-2.5 rounded-lg font-medium text-gray-400
                         bg-tertiary/60 hover:bg-tertiary hover:text-secondary
                         transition-all duration-200 disabled:opacity-50
                         focus:outline-none focus:ring-2 focus:ring-tertiary/50"
            >
              Cancelar
            </button>
            
            <button
              type="submit"
              disabled={loading || !body.trim() || isOverLimit}
              className="flex-1 px-4 py-2.5 rounded-lg font-semibold text-sm
                         bg-primary text-background hover:bg-primary/90
                         transition-all duration-200
                         disabled:opacity-50 disabled:cursor-not-allowed
                         focus:outline-none focus:ring-2 focus:ring-primary/50
                         flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Publicando...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  Publicar
                </>
              )}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}

export default CreatePost;