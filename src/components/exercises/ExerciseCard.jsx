import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSquarePlus } from "@fortawesome/free-solid-svg-icons"
import { useNavigate } from "react-router-dom"

function ExerciseCard({id, title, bodyPart, img}) {
  const navigate = useNavigate();

  // Mapeo de imágenes por grupo muscular
  const getPlaceholderImage = (group) => {
    const placeholders = {
      'pecho': 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=300&fit=crop',
      'espalda': 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=400&h=300&fit=crop',
      'piernas': 'https://images.unsplash.com/photo-1434608519344-49d77a699e1d?w=400&h=300&fit=crop',
      'hombros': 'https://images.unsplash.com/photo-1581009137042-c552e485697a?w=400&h=300&fit=crop',
      'brazos': 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&h=300&fit=crop',
      'core': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop'
    };
    return placeholders[group.toLowerCase()] || placeholders['piernas'];
  };

  // Determinar la imagen a mostrar
  const getImageUrl = () => {
    if (img && img !== '/gym-proof.jpg') {
      return img.startsWith('/') 
        ? `${import.meta.env.VITE_SUGGEST_API_URL || 'http://localhost:8082'}${img}`
        : img;
    }
    return getPlaceholderImage(bodyPart);
  };

  const handleCardClick = () => {
    navigate(`/exercises/${id}`);
  };

  const handleAddExercise = (e) => {
    e.stopPropagation(); // Evitar que se active el clic de la tarjeta
    console.log('Agregando ejercicio:', id, title);
  };

  return (
    <div 
      className="w-full h-25 p-4 bg-tertiary rounded-xl flex 
      items-center justify-between gap-4 lg:w-[20%] lg:h-60 lg:flex-col lg:items-start
      lg:justify-start lg:p-0 cursor-pointer hover:scale-105 transition-transform lg:relative"
      onClick={handleCardClick}
    >
        <img 
          className="w-20 h-20 object-cover rounded-xl lg:w-full lg:h-30 flex-shrink-0" 
          src={getImageUrl()}
          alt={`Imagen de ${title}`}
          onError={(e) => {
            e.target.src = getPlaceholderImage(bodyPart);
          }}
        />
        <div className="flex-1 min-w-0 overflow-hidden lg:pl-5 lg:flex-none lg:w-full lg:pr-12">
                <h1 className="text-lg text-secondary truncate lg:text-base">{title}</h1>
                <p className="text-gray-200 capitalize text-sm truncate">{bodyPart}</p>
        </div>
        <FontAwesomeIcon 
          size='xl' 
          className="text-background cursor-pointer hover:scale-110 flex-shrink-0 lg:absolute lg:bottom-4 lg:right-4 lg:pl-0" 
          icon={faSquarePlus}
          onClick={handleAddExercise}
        />
    </div>
  )
}

export {ExerciseCard}
