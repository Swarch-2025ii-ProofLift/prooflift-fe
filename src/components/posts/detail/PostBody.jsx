import { useState, useEffect } from "react";
import { exercisesAPI } from "../../../API/exercises.js";
import ExerciseSelector from "../create/ExerciseSelector";

function PostBody({
  post,
  isEditing,
  editBody,
  updateLoading,
  editTextareaRef,
  onEditBodyChange,
  onSaveEdit,
  onCancelEdit,
  editSelectedExercises = [],
  onEditExercisesChange
}) {
  const [exerciseNames, setExerciseNames] = useState({});
  const [loadingNames, setLoadingNames] = useState(false);

  useEffect(() => {    
    const fetchExerciseNames = async () => {
      if (isEditing && post.exerciseIds && post.exerciseIds.length > 0) {
          setLoadingNames(true);
          try {
            const namesMap = {};
            for (const exerciseId of post.exerciseIds) {
              try {
                const data = await exercisesAPI.getExercises({
                  q: '',
                  limit: 20
                });
                
                const exercise = data.items.find(ex => ex.id === exerciseId);
                if (exercise) {
                  namesMap[exerciseId] = exercise.name;
                }
              } catch (err) {
                console.error(`Error fetching exercise ${exerciseId}:`, err);
              }
            }
            
            setExerciseNames(namesMap);
          } catch (error) {
            console.error('Error fetching exercise names:', error);
          } finally {
            setLoadingNames(false);
          }
      }
    };
    
    fetchExerciseNames();
  }, [isEditing, post]);

  const handleToggleExercise = (exerciseId, exerciseName) => {    
    setExerciseNames(prev => {
      const updated = {
        ...prev,
        [exerciseId]: exerciseName
      };
      return updated;
    });

    if (editSelectedExercises.includes(exerciseId)) {
      onEditExercisesChange(editSelectedExercises.filter(id => id !== exerciseId));
    } else {
      onEditExercisesChange([...editSelectedExercises, exerciseId]);
    }
  };

  const getExerciseName = (exerciseId) => {
    if (exerciseNames[exerciseId]) {
      return exerciseNames[exerciseId];
    }

    return 'Exercise';
  };

  const handleRemoveExercise = (exerciseId) => {
    onEditExercisesChange(editSelectedExercises.filter(id => id !== exerciseId));
  };

  if (isEditing) {
    return (
      <div className="space-y-4">
        {/* Text Content */}
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

        {/* Selected Exercises Display */}
        {editSelectedExercises.length > 0 && (
          <div className="space-y-2">
            <label className="text-gray-400 text-sm font-medium">
              Ejercicios seleccionados ({editSelectedExercises.length}):
            </label>
            <div className="flex flex-wrap gap-2">
              {editSelectedExercises.map((exerciseId) => (
                <div
                  key={exerciseId}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg 
                             bg-primary/20 border border-primary/30 text-primary text-sm"
                >
                  <span>{getExerciseName(exerciseId)}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveExercise(exerciseId)}
                    className="hover:bg-primary/30 rounded p-0.5 transition-colors"
                    aria-label="Eliminar ejercicio"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Exercise Selector */}
        <ExerciseSelector
          selectedExercises={editSelectedExercises}
          onToggleExercise={handleToggleExercise}
          getExerciseName={getExerciseName}
        />

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
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