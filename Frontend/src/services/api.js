const getNormalizedApiUrl = () => {
  let url = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  url = url.trim().replace(/\/+$/, "");
  if (!url.endsWith("/api")) {
    url = `${url}/api`;
  }
  return url;
};

const API_BASE_URL = getNormalizedApiUrl();

export const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, "");

export const getFileDownloadUrl = (fileUrl) => {
  if (!fileUrl) return null;
  if (fileUrl.startsWith("http://") || fileUrl.startsWith("https://")) {
    return fileUrl;
  }
  return `${API_ORIGIN}${fileUrl.startsWith("/") ? fileUrl : `/${fileUrl}`}`;
};

// Token & User session helpers
export const getToken = () => localStorage.getItem("cce_ctf_token");

export const setToken = (token) => {
  if (token) {
    localStorage.setItem("cce_ctf_token", token);
  } else {
    localStorage.removeItem("cce_ctf_token");
  }
};

export const getStoredUser = () => {
  try {
    const userStr = localStorage.getItem("cce_ctf_user");
    return userStr ? JSON.parse(userStr) : null;
  } catch (e) {
    return null;
  }
};

export const setStoredUser = (user) => {
  if (user) {
    localStorage.setItem("cce_ctf_user", JSON.stringify(user));
  } else {
    localStorage.removeItem("cce_ctf_user");
  }
};

// Generic fetch wrapper with auth header
async function request(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  const formattedEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

  try {
    const res = await fetch(`${API_BASE_URL}${formattedEndpoint}`, config);
    const data = await res.json();

    if (!res.ok) {
      if (res.status === 401 && !endpoint.startsWith("/auth/login") && !endpoint.startsWith("/auth/register")) {
        setToken(null);
        setStoredUser(null);
      }
      throw new Error(data.message || "API request failed");
    }

    return data;
  } catch (error) {
    console.error(`[API ERROR ${endpoint}]:`, error.message);
    throw error;
  }
}

// Multipart upload for challenge files
async function uploadRequest(endpoint, formData, method = "POST") {
  const token = getToken();
  const headers = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const formattedEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

  try {
    const res = await fetch(`${API_BASE_URL}${formattedEndpoint}`, {
      method,
      headers,
      body: formData,
    });
    const data = await res.json();

    if (!res.ok) {
      if (res.status === 401) {
        setToken(null);
        setStoredUser(null);
      }
      throw new Error(data.message || "Upload request failed");
    }

    return data;
  } catch (error) {
    console.error(`[API UPLOAD ERROR ${endpoint}]:`, error.message);
    throw error;
  }
}

export const api = {
  // --- AUTH ---
  auth: {
    register: (userData) =>
      request("/auth/register", {
        method: "POST",
        body: JSON.stringify(userData),
      }),
    login: (credentials) =>
      request("/auth/login", {
        method: "POST",
        body: JSON.stringify(credentials),
      }),
    getMe: () => request("/auth/me"),
  },

  // --- TEAMS ---
  teams: {
    create: (name) =>
      request("/teams", {
        method: "POST",
        body: JSON.stringify({ name }),
      }),
    join: (code) =>
      request("/teams/join", {
        method: "POST",
        body: JSON.stringify({ code }),
      }),
    getMyTeam: () => request("/teams/me"),
    leave: () =>
      request("/teams/leave", {
        method: "POST",
      }),
  },

  // --- CHALLENGES ---
  challenges: {
    getAll: () => request("/challenges"),
    getById: (id) => request(`/challenges/${id}`),
    getSolved: () => request("/challenges/solved"),
    submitFlag: (id, flag) =>
      request(`/challenges/${id}/submit`, {
        method: "POST",
        body: JSON.stringify({ flag }),
      }),
  },

  // --- LEADERBOARD ---
  leaderboard: {
    get: () => request("/leaderboard"),
  },

  // --- PUBLIC COMPETITION ---
  competition: {
    get: () => request("/competition"),
  },

  // --- ADMIN ---
  admin: {
    getUsers: () => request("/admin/users"),
    deleteUser: (id) => request(`/admin/users/${id}`, { method: "DELETE" }),
    getTeams: () => request("/admin/teams"),
    deleteTeam: (id) => request(`/admin/teams/${id}`, { method: "DELETE" }),
    getChallenges: () => request("/admin/challenges"),
    createChallenge: (formData) => uploadRequest("/admin/challenges", formData, "POST"),
    updateChallenge: (id, formData) =>
      uploadRequest(`/admin/challenges/${id}`, formData, "PUT"),
    deleteChallenge: (id) =>
      request(`/admin/challenges/${id}`, { method: "DELETE" }),
    getSubmissions: () => request("/admin/submissions"),
    getCompetition: () => request("/admin/competition"),
    updateCompetition: (data) =>
      request("/admin/competition", {
        method: "PUT",
        body: JSON.stringify(data),
      }),
  },
};
