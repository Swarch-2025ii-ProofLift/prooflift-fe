import { useState, useEffect } from "react";
import { Header } from "../components/layout/Header"
import { SearchBar } from "../components/exercises/SearchBar"
import { MuscularGroupButton } from "../components/exercises/MuscularGroupButton"
import { ExerciseCard } from "../components/exercises/ExerciseCard"
import { Footer } from "../components/layout/Footer"
import { exercisesAPI } from "../API/exercises";

function Exercises() {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [nextCursor, setNextCursor] = useState(null);

  const muscleGroups = ['Todos', 'Pecho', 'Espalda', 'Piernas', 'Hombros', 'Brazos', 'Core'];

  // Función para cargar ejercicios
  const loadExercises = async (isNewSearch = false) => {
    setLoading(true);
    try {
      const data = await exercisesAPI.getExercises({
        group: selectedGroup !== 'Todos' ? selectedGroup : null,
        q: searchQuery || null,
        limit: 20,
        cursor: isNewSearch ? null : nextCursor
      });
      
      if (isNewSearch) {
        setExercises(data.items);
      } else {
        setExercises(prev => [...prev, ...data.items]);
      }
      
      setNextCursor(data.page?.next_cursor);
    } catch (error) {
      console.error('Error loading exercises:', error);
      setExercises([]);
    } finally {
      setLoading(false);
    }
  };

  // Cargar ejercicios al montar el componente
  useEffect(() => {
    loadExercises(true);
  }, []);

  // Recargar cuando cambie el grupo o búsqueda
  useEffect(() => {
    loadExercises(true);
  }, [selectedGroup, searchQuery]);

  const handleGroupSelect = (groupName) => {
    setSelectedGroup(groupName);
    
    if (groupName === 'Todos') {
      setSearchQuery('');
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleLoadMore = () => {
    if (nextCursor && !loading) {
      loadExercises(false);
    }
  };

  return (
    <div>
      <Header />
      <main className="main__exercises">
        <h1 className="h1__title">Explorar Ejercicios</h1>
        <SearchBar onSearch={handleSearch} />
        
        <div className="w-[90%] flex gap-4 overflow-x-auto pb-4">
          {muscleGroups.map(group => (
            <MuscularGroupButton 
              key={group}
              groupName={group} 
              isSelected={selectedGroup === group}
              onClick={() => handleGroupSelect(group)}
            />
          ))}
        </div>

        <div className="w-[90%] flex flex-wrap gap-6 lg:justify-start lg:gap-8">
          {exercises.map(exercise => (
            <ExerciseCard 
              key={exercise.id}
              id={exercise.id}
              title={exercise.name} 
              bodyPart={exercise.group} 
              img={exercise.media?.thumbnail_url || '/gym-proof.jpg'} 
            />
          ))}
          
          {loading && (
            <div className="w-full text-center py-4">
              <p className="text-gray-400">Cargando ejercicios...</p>
            </div>
          )}
          
          {exercises.length === 0 && !loading && (
            <div className="w-full text-center py-8">
              <p className="text-gray-400">No se encontraron ejercicios</p>
            </div>
          )}
        </div>

        {nextCursor && !loading && (
          <button 
            onClick={handleLoadMore}
            className="mt-6 px-6 py-2 button"
          >
            Cargar más ejercicios
          </button>
        )}
      </main>
      <Footer />
    </div>
  )
}

export { Exercises }