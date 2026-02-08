export const getApiBase = () => {
  return import.meta.env.VITE_API_URL || "http://localhost:5000";
};

export const getAiBase = () => {
  return import.meta.env.VITE_AI_URL || "http://localhost:8000";
};

export const fetchWithAuth = (url, options = {}) => {
  const token = localStorage.getItem("token");
  return fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`
    }
  });
};
