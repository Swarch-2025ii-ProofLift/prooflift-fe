
function MuscularGroupButton({ groupName }) {
  return (
    <button className="w-24 h-10 bg-primary text-background font-bold
      rounded-2xl transition-colors shrink-0 cursor-pointer 
      hover:scale-105 hover:bg-background-secondary hover:text-primary">
        {groupName}
    </button>
  )
}

export  {MuscularGroupButton}
