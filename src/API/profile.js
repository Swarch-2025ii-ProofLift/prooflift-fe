const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

function getCurrentUserId() {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.sub; // el UUID viene en "sub"
  } catch {
    return null;
  }
}

export async function getProfile(token) {
  const userId = getCurrentUserId();
  if (!userId) throw new Error("User not authenticated");

  localStorage.setItem("uuid", userId);
//   console.log("uuid guardado en localStorage:", userId);

  const res = await fetch(`${API_URL}/profile/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`getProfile failed: ${res.status} ${text}`);
  }

  return res.json();
}


export async function updateProfile(token, payload) {
  const userId = getCurrentUserId();
  if (!userId) throw new Error("User not authenticated");

  localStorage.setItem("uuid", userId);

  const res = await fetch(`${API_URL}/profile/update/${userId}`, {  
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`updateProfile failed: ${res.status} ${text}`);
  }
  return res.json();
}

export async function deleteProfile(token) {
  const userId = getCurrentUserId();
  if (!userId) throw new Error("User not authenticated");

  const res = await fetch(`${API_URL}/profile/delete/${userId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`deleteProfile failed: ${res.status} ${text}`);
  }

  // return res.json(); // si el backend retorna algo
}