const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

// hay que crear .env.docker y .env.production
console.log("API_URL usado:", import.meta.env.VITE_API_URL);


export async function login(email, password) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })

  if (!response.ok) {
    throw new Error('Error en la autenticación')
  }

  const data = await response.json()

  localStorage.setItem("token", data.token);
  console.log("holi")

  return data;
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

  console.log("holi")
  return response.json()
}