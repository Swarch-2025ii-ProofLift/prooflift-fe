const API_BASE_URL = import.meta.env.VITE_SUGGEST_API_URL || 'http://localhost:8082';

export const exercisesAPI = {
  // Obtener lista de ejercicios con filtros
  async getExercises({ group = null, muscle = null, q = null, limit = 20, cursor = null } = {}) {
    const params = new URLSearchParams();
    
    if (group && group !== 'Todos') params.append('group', group.toLowerCase());
    if (muscle) params.append('muscle', muscle);
    if (q && q.length >= 2) params.append('q', q);
    params.append('limit', limit.toString());
    if (cursor) params.append('cursor', cursor);

    console.log('Fetching from:', `${API_BASE_URL}/exercises?${params}`); // Debug
    
    const response = await fetch(`${API_BASE_URL}/exercises?${params}`);
    if (!response.ok) {
      console.error('API Error:', response.status, response.statusText);
      throw new Error('Error fetching exercises');
    }
    
    const data = await response.json();
    console.log('API Response:', data); // Debug
    return data;
  },

  // Obtener detalle de un ejercicio
  async getExercise(id) {
    const response = await fetch(`${API_BASE_URL}/exercises/${id}`);
    if (!response.ok) {
      throw new Error('Error fetching exercise');
    }
    return response.json();
  }
};