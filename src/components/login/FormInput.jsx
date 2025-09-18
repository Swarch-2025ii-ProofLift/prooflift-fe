import React, {useState} from 'react'
import { useForm } from 'react-hook-form'

function FormInput ({ children, buttonText, onSubmit }) {
  const { register, handleSubmit, watch, formState: { errors } } = useForm()
  const [buttonContent, setButtonContent] = useState(buttonText)

  return (
    <form
      className='flex flex-col items-center'
      onSubmit={handleSubmit((data) => onSubmit(data, setButtonContent))}
    >
      {React.Children.map(children, child =>
        React.cloneElement(child, { register, errors,watch })
      )}
      <button className='w-[85%] h-10 text-lg button' type='submit'>
        {buttonContent}
      </button>
    </form>
  )
}

export { FormInput }
