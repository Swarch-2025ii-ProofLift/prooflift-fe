import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "../components/layout/Header";
import { MuscleGroupCard } from "../components/infoExercises/MuscleGroupCard";
import { Footer } from "../components/layout/Footer";
import { exercisesAPI } from "../API/exercises";

function InfoExercises() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exercise, setExercise] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadExercise = async () => {
      try {
        setLoading(true);
        const data = await exercisesAPI.getExercise(id);
        setExercise(data);
      } catch (error) {
        console.error('Error loading exercise:', error);
        setError('No se pudo cargar el ejercicio');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadExercise();
    }
  }, [id]);

  // Crear slug del nombre del ejercicio (igual que en ExerciseCard)
  const createSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[áàäâ]/g, 'a')
      .replace(/[éèëê]/g, 'e')
      .replace(/[íìïî]/g, 'i')
      .replace(/[óòöô]/g, 'o')
      .replace(/[úùüû]/g, 'u')
      .replace(/[ñ]/g, 'n')
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  };

  // Mapeo de imágenes por grupo muscular (mismo que en ExerciseCard)
  const getPlaceholderImage = (group) => {
    const placeholders = {
      'pecho': 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&h=600&fit=crop',
      'espalda': 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=800&h=600&fit=crop',
      'piernas': 'https://images.unsplash.com/photo-1434608519344-49d77a699e1d?w=800&h=600&fit=crop',
      'hombros': 'https://images.unsplash.com/photo-1581009137042-c552e485697a?w=800&h=600&fit=crop',
      'brazos': 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&h=600&fit=crop',
      'core': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop'
    };
    return placeholders[group?.toLowerCase()] || placeholders['piernas'];
  };

  const getImageUrl = () => {
    // 1. Intentar usar imagen específica del ejercicio (igual que en ExerciseCard)
    if (exercise?.name) {
      const slug = createSlug(exercise.name);
      const exerciseImagePath = `/exercises/${slug}.webp`;
      return exerciseImagePath;
    }
    
    // 2. Si no hay nombre del ejercicio, usar placeholder
    return getPlaceholderImage(exercise?.group);
  };

  const handleImageError = (e) => {
    // Si falla la imagen específica, usar placeholder del grupo muscular
    e.target.src = getPlaceholderImage(exercise?.group);
  };

  if (loading) {
    return (
      <div className="bg-background-secondary min-h-screen">
        <Header />
        <main className="w-full h-full flex justify-center items-center py-20">
          <p className="text-white text-xl">Cargando ejercicio...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !exercise) {
    return (
      <div className="bg-background-secondary min-h-screen">
        <Header />
        <main className="w-full h-full flex flex-col justify-center items-center py-20 gap-4">
          <p className="text-red-400 text-xl">{error || 'Ejercicio no encontrado'}</p>
          <button 
            onClick={() => navigate('/exercises')}
            className="px-6 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/80"
          >
            Volver a ejercicios
          </button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-background-secondary">
      <Header />
      <main className="w-full h-full flex flex-col items-start gap-6 mb-10
      px-4 py-6 text-white lg:px-40">
        
        <button 
          onClick={() => navigate('/exercises')}
          className="text-secondary hover:text-secondary/80 mb-4"
        >
          ← Volver a ejercicios
        </button>

        <h1 className="h1__title">{exercise.name}</h1>
        
        <p className="font-light">
          {exercise.description || `${exercise.name} es un excelente ejercicio para trabajar ${exercise.group} y desarrollar fuerza funcional.`}
        </p>
        
        <img 
          className="rounded-xl w-full max-w-2xl" 
          src={getImageUrl()} 
          alt={`Imagen de ${exercise.name}`}
          onError={handleImageError}
        />

        {exercise.cues && exercise.cues.length > 0 && (
          <>
            <h2 className="h2__InfoExercises">Instrucciones</h2>
            <ul className="list-decimal list-inside flex flex-col gap-2 font-light">
              {exercise.cues.map((cue, index) => (
                <li key={index}>{cue}</li>
              ))}
            </ul>
          </>
        )}

        <h2 className="h2__InfoExercises">Grupos Musculares</h2>
        <div className="main__divMusclerGroupsBar">
          {exercise.muscles.map((muscle, index) => (
            <MuscleGroupCard key={index} muscleGroup={muscle} />
          ))}
        </div>

        {exercise.goal_tags && exercise.goal_tags.length > 0 && (
          <>
            <h2 className="h2__InfoExercises">Objetivo</h2>
            <div className="main__divMusclerGroupsBar">
              {exercise.goal_tags.map((goal, index) => (
                <MuscleGroupCard key={index} muscleGroup={goal} />
              ))}
            </div>
          </>
        )}

        {exercise.equipment && exercise.equipment.length > 0 && (
          <>
            <h2 className="h2__InfoExercises">Equipación</h2>
            <div className="main__divMusclerGroupsBar">
              {exercise.equipment.map((item, index) => (
                <MuscleGroupCard key={index} muscleGroup={item} />
              ))}
            </div>
          </>
        )}

        {exercise.level && (
          <>
            <h2 className="h2__InfoExercises">Nivel</h2>
            <div className="main__divMusclerGroupsBar">
              <MuscleGroupCard muscleGroup={exercise.level} />
            </div>
          </>
        )}

      </main>
      <Footer />
    </div>
  );
}

export { InfoExercises };
