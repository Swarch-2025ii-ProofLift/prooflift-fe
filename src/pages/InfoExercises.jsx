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

  // Scroll al top cuando cambie el ID del ejercicio
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

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
    if (exercise?.name) {
      const slug = createSlug(exercise.name);
      const exerciseImagePath = `/exercises/${slug}.webp`;
      return exerciseImagePath;
    }
    return getPlaceholderImage(exercise?.group);
  };

  const handleImageError = (e) => {
    e.target.src = getPlaceholderImage(exercise?.group);
  };

  const getLevelBadge = (level) => {
    const badges = {
      'principiante': { color: 'bg-green-600', text: 'Recomendado para empezar' },
      'intermedio': { color: 'bg-amber-600', text: 'Requiere experiencia' },
      'avanzado': { color: 'bg-red-600', text: 'Solo para expertos' }
    };
    return badges[level] || badges['principiante'];
  };

  const handleAddToRoutine = () => {
    // Aquí irá la lógica para agregar el ejercicio a la rutina
    console.log('Agregando ejercicio a rutina:', exercise.name);
  };

  if (loading) {
    return (
      <div className="bg-background-secondary min-h-screen">
        <Header />
        <main className="w-full min-h-[80vh] flex justify-center items-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary mx-auto mb-4"></div>
            <p className="text-white text-xl">Cargando ejercicio...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !exercise) {
    return (
      <div className="bg-background-secondary min-h-screen">
        <Header />
        <main className="w-full min-h-[80vh] flex flex-col justify-center items-center px-4">
          <div className="text-center max-w-md">
            <p className="text-red-400 text-xl mb-6">{error || 'Ejercicio no encontrado'}</p>
            <button 
              onClick={() => navigate('/exercises')}
              className="px-8 py-3 bg-secondary text-white rounded-lg hover:bg-secondary/80 transition-colors font-medium"
            >
              Volver a ejercicios
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-background-secondary min-h-screen">
      <Header />
      <main className="w-full flex justify-center py-8 px-4">
        <div className="max-w-5xl w-full">
          
          <button 
            onClick={() => navigate('/exercises')}
            className="text-secondary hover:text-primary mb-8 flex items-center gap-2 transition-colors"
          >
            <span className="text-lg">←</span>
            Volver a ejercicios
          </button>

          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              {exercise.name}
            </h1>
            
            <div className="max-w-3xl mx-auto">
              <p className="text-gray-300 text-lg lg:text-xl font-light leading-relaxed">
                {exercise.description || `${exercise.name} es un ejercicio fundamental para el desarrollo de ${exercise.group}, diseñado para mejorar tanto la fuerza como la técnica de ejecución.`}
              </p>
            </div>
          </div>

          <div className="flex justify-center mb-16">
            <div className="relative rounded-xl overflow-hidden shadow-xl max-w-3xl w-full">
              <img 
                className="w-full h-auto object-cover" 
                src={getImageUrl()} 
                alt={`Demostración de ${exercise.name}`}
                onError={handleImageError}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            
            {exercise.cues && exercise.cues.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-white mb-6">
                  Técnica de Ejecución
                </h2>
                <div className="bg-background border border-primary/20 rounded-xl p-6 shadow-lg">
                  <ol className="space-y-4 text-gray-200">
                    {exercise.cues.map((cue, index) => (
                      <li key={index} className="flex items-start gap-4">
                        <span className="flex-shrink-0 w-8 h-8 bg-primary text-background text-sm rounded-full flex items-center justify-center font-bold">
                          {index + 1}
                        </span>
                        <span className="leading-relaxed text-secondary pt-1">{cue}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </section>
            )}

            <section>
              <h2 className="text-2xl font-bold text-white mb-6">
                Información del Ejercicio
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                    Músculos Trabajados
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {exercise.muscles.map((muscle, index) => (
                      <MuscleGroupCard key={index} muscleGroup={muscle} />
                    ))}
                  </div>
                </div>

                {exercise.goal_tags && exercise.goal_tags.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                      Objetivos
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {exercise.goal_tags.map((goal, index) => (
                        <MuscleGroupCard key={index} muscleGroup={goal} />
                      ))}
                    </div>
                  </div>
                )}

                {exercise.equipment && exercise.equipment.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                      Equipamiento Necesario
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {exercise.equipment.map((item, index) => (
                        <MuscleGroupCard key={index} muscleGroup={item} />
                      ))}
                    </div>
                  </div>
                )}

                {exercise.level && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                      Nivel de Dificultad
                    </h3>
                    <div className="flex items-center gap-3">
                      <MuscleGroupCard muscleGroup={exercise.level} />
                      <span className={`text-xs px-3 py-1 rounded-full text-white ${getLevelBadge(exercise.level).color}`}>
                        {getLevelBadge(exercise.level).text}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </section>

          </div>

          <div className="bg-tertiary border border-primary/10 rounded-xl p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">
              ¿Te gusta este ejercicio?
            </h3>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Añádelo a tu rutina personalizada y mantén un seguimiento de tu progreso. 
              Desarrolla fuerza y técnica de manera consistente.
            </p>
            <div className="flex justify-center">
              <button 
                onClick={handleAddToRoutine}
                className="w-60 h-12 text-lg button"
              >
                Agregar a Rutina
              </button>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}

export { InfoExercises };
