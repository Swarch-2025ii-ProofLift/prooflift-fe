import {deleteProfile} from '../../API/profile.js';
import { useNavigate } from 'react-router-dom'; // 1. Importar

// function DeleteAccount() {
//   return (
//     <div className="w-full h-auto p-4 rounded-lg flex flex-col gap-2 text-red-500">
//         <h2 className="text-2xl font-semibold">Zona de Peligro</h2>
//         <p className="text-sm text-secondary">La eliminación de tu cuenta es una acción permanente e irreversible. Todos tus datos serán eliminados.</p>
//         <button className='bg-[#4a2626] py-2 rounded-xl cursor-pointer hover:bg-red-600 hover:text-secondary'>Eliminar Cuenta</button>
//     </div>
//   )
// }

function DeleteAccount() {
  const navigate = useNavigate(); // 2. Hook para navegación
  const handleDelete = async () => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Usuario no autenticado");

    if (!confirm("¿Estás seguro de eliminar tu cuenta? Esta acción es irreversible.")) return;

    try {
      console.log("holi")
      await deleteProfile(token);
      console.log("holi2")
      alert("Cuenta eliminada correctamente");
      localStorage.clear(); // limpiar sesión
      navigate('/'); // Redirige al inicio sin recargar toda la página
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="w-full h-auto p-4 rounded-lg flex flex-col gap-2 text-red-500">
      <h2 className="text-2xl font-semibold">Zona de Peligro</h2>
      <p className="text-sm text-secondary">
        La eliminación de tu cuenta es una acción permanente e irreversible. Todos tus datos serán eliminados.
      </p>
      <button 
        onClick={handleDelete}
        className='bg-[#4a2626] py-2 rounded-xl cursor-pointer hover:bg-red-600 hover:text-secondary'>
        Eliminar Cuenta
      </button>
    </div>
  )
}
export { DeleteAccount }


