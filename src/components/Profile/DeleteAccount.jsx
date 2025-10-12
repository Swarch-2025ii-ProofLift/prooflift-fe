function DeleteAccount() {
  return (
    <div className="w-full h-auto p-4 rounded-lg flex flex-col gap-2 text-red-500">
        <h2 className="text-2xl font-semibold">Zona de Peligro</h2>
        <p className="text-sm text-secondary">La eliminación de tu cuenta es una acción permanente e irreversible. Todos tus datos serán eliminados.</p>
        <button className='bg-[#4a2626] hover:bg-red-700 py-2 rounded-xl'>Eliminar Cuenta</button>
    </div>
  )
}

export { DeleteAccount }
