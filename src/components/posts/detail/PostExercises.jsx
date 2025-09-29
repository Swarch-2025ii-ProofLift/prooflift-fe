import { useState, useEffect } from "react";
import { exercisesAPI } from "../../../API/exercises.js";

function PostExercises({ exerciseIds, onExerciseClick }) {
  const [exercises, setExercises] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExerciseNames = async () => {
      if (!exerciseIds || exerciseIds.length === 0) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const exerciseData = {};
        
        await Promise.all(
          exerciseIds.map(async (id) => {
            try {
              const exercise = await exercisesAPI.getExercise(id);
              exerciseData[id] = exercise;
            } catch (error) {
              console.error(`Error fetching exercise ${id}:`, error);

              exerciseData[id] = { id, name: id };
            }
          })
        );
        
        setExercises(exerciseData);
      } catch (error) {
        console.error('Error fetching exercises:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExerciseNames();
  }, [exerciseIds]);

  if (loading) {
    return (
      <div className="flex flex-wrap gap-2">
        <span className="text-xs text-gray-400 mr-1 self-center">Ejercicios:</span>
        {exerciseIds.map((_, index) => (
          <div
            key={index}
            className="h-6 w-20 bg-primary/10 rounded-md animate-pulse"
          ></div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      <span className="text-xs text-gray-400 mr-1 self-center">Ejercicios:</span>
      {exerciseIds.map((exerciseId, index) => {
        const exercise = exercises[exerciseId];
        const displayName = exercise?.name || exerciseId;
        
        return (
          <button
            key={index}
            onClick={() => onExerciseClick?.(exerciseId)}
            className="text-primary text-xs bg-primary/10 hover:bg-primary/20 
                       px-2.5 py-1 rounded-md border border-primary/20
                       hover:border-primary/30 transition-all duration-200 
                       hover:scale-105 focus:outline-none focus:ring-1 
                       focus:ring-primary/50 cursor-pointer"
            aria-label={`View exercise: ${displayName}`}
            title={displayName}
          >
            #{displayName}
          </button>
        );
      })}
    </div>
  );
}

export default PostExercises;