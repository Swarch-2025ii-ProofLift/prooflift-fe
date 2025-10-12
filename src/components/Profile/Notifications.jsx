import React from 'react'

function Notifications({Notification, hour}) {
  return (
    <div className='w-full h-auto bg-[#2b2b2b] p-4 rounded-lg flex flex-col'>
        <h2 className='font-semibold'>{Notification}</h2>
        <h3 className='text-gray-400'>{hour}</h3>
    </div>
  )
}

export { Notifications }
