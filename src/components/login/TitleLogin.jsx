
function TitleLogin ({ title, imgLink, statement }) {
  return (
    <div className='flex flex-col items-center justify-center gap-2'>
      <img className='max-w-[30%] max-h-[40%]' src={imgLink} alt='Logo' />
      <h1 className='text-2xl font-bold'>{title}</h1>
      <div className='text-center'><p>{statement}</p></div>
    </div>
  )
}

export { TitleLogin }
