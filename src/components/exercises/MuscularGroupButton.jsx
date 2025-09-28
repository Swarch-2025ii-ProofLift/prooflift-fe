function MuscularGroupButton({ groupName, isSelected = false, onClick }) {
  return (
    <button 
      className={`w-24 h-10 font-bold rounded-2xl transition-colors shrink-0 cursor-pointer 
      hover:scale-105 ${
        isSelected 
          ? 'bg-tertiary text-primary border' 
          : 'bg-primary text-background hover:bg-background-secondary hover:text-primary'
      }`}
      onClick={() => onClick?.(groupName)}
    >
      {groupName}
    </button>
  )
}

export { MuscularGroupButton }
