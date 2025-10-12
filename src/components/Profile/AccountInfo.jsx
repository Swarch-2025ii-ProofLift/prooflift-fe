import {react, useState} from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPencil } from "@fortawesome/free-solid-svg-icons"

function AccountInfo( { title, info } ) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedInfo, setEditedInfo] = useState(info);
    
    const HandleEditClick = () => {
        setIsEditing(!isEditing);
    }

    const handleInputChange = (e) => {
        setEditedInfo(e.target.value);
    }

    const handleSave = () => {
        // Aquí puedes agregar la lógica para guardar la información editada
        setIsEditing(false);
    }

    return (
        <div className='w-full h-auto flex flex-col justify-center items-start gap-1 pb-4'>
            <div className="w-full flex items-center justify-between text-sm">
                <div>
                    <h2 className='font-semibold'>{title}</h2>  
                    <h3 className='text-gray-400'>{info}</h3>
                </div>
                <button className="bg-[#2b2b2b] flex items-center cursor-pointer p-2 rounded-md text-primary  hover:bg-background-secondary transition-colors" 
                    onClick={HandleEditClick}>
                    <FontAwesomeIcon icon={faPencil} className="text-primary mr-2" />
                    <p>Editar</p>
                </button>
            </div>
            {isEditing && (
                <div className='w-full flex flex-col items-start gap-1'>
                    <input type="text"
                    value={editedInfo}
                    onChange={handleInputChange} 
                    className='bg-[#2b2b2b] w-full h-11 
                        text-secondary pl-2 pr-12 my-2 rounded-lg border 
                        border-gray-600 focus:outline-none
                        focus:border-gray-400 lg:h-9'
                        
                        />
                    <button className='button py-1 px-3'>Guardar </button>
                </div>
            )}
        </div>
  )
}

export { AccountInfo }
