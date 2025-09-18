import React, { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons"

function InputCamp({
  type = "text",
  placeholder,
  data,
  register,
  errors,
  validate = {},
  icon, 
  watch
}) {
  const [show, setShow] = useState(false)
  const inputType = type === "password" ? (show ? "text" : "password") : type

  const validationRules = {
    required: "Este campo es obligatorio",
    ...validate,
    validate: validate.validate
    ? (value) => validate.validate(value, { password: watch("password") })
    : undefined
  }

  return (
 <div className="w-[85%]">
  <div className="relative">
    {icon && (
      <FontAwesomeIcon
        icon={icon}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-background"
      />
    )}

    <input
      className="bg-tertiary w-full h-11 
        text-secondary pl-10 pr-12 my-2 rounded-lg border 
        border-gray-600 focus:outline-none
        focus:border-gray-400 lg:h-9"
      type={inputType}                     
      placeholder={placeholder}
      {...(register ? register(data, validationRules) : {})}
    />

    {type === "password" && (
      <button
        type="button"                     
        onClick={() => setShow((s) => !s)}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-background"
      >
        <FontAwesomeIcon icon={show ? faEyeSlash : faEye} />
      </button>
    )}
  </div>

  <div className="min-h-[15px]">
    {errors?.[data] && (
      <span className="text-sm text-red-500">{errors[data].message}</span>
    )}
  </div>
</div>
 
  )
}

export { InputCamp }

