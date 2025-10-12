import React from 'react'

function BoxInfo( { title, children }) {
  return (
    <div className='w-full h-auto bg-tertiary rounded-lg flex flex-col justify-start items-start p-4'>
      <h2 className='text-lg font-semibold'>{title}</h2>
      <div className='w-full flex flex-col gap-2 mt-2'>
        {children}
      </div>
    </div>
  )
}

export { BoxInfo }
