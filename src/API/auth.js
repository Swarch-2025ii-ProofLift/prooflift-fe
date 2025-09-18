const API_URL = 'http://localhost:8080' // mientras pruebas localmente

export async function login(email, password) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })

  if (!response.ok) {
    throw new Error('Error en la autenticación')
  }

  return response.json()
}

export async function signup(nombre, email, password) {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre, email, password })
  })

  if (!response.ok) {
    throw new Error('Error en el registro')
  }

  return response.json()
}
