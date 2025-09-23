import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSquarePlus } from "@fortawesome/free-solid-svg-icons"

function ExerciseCard({title, bodyPart, img}) {
  return (
    <div className="w-full h-25 p-4 bg-tertiary rounded-xl flex 
    items-center justify-start gap-4 lg:w-[20%] lg:h-60 lg:flex-col lg:items-start
    lg:justify-start lg:p-0 cursor-pointer hover:scale-105 transition-transform">
        <img className="w-20 h-20 object-cover rounded-xl lg:w-full lg:h-30" src={img} alt="Imagen ejercicio" />
        <div className="w-45 lg:pl-5">
                <h1 className="text-lg text-secondary">{title}</h1>
                <p className="text-gray-200">{bodyPart}</p>
        </div>
        <FontAwesomeIcon size='xl' className=" text-background cursor-pointer hover:scale-110 lg:pl-4" icon={faSquarePlus} />
    </div>
  )
}

export {ExerciseCard}
