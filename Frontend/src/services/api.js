const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Token helpers
export const getToken = () => localStorage.getItem("cce_ctf_token");
export const setToken = (token) => {
  if (token) {
    localStorage.setItem("cce_ctf_token", token);
  } else {
    localStorage.removeItem("cce_ctf_token");
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

  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "API request failed");
    }

    return data;
  } catch (error) {
    console.error(`[API ERROR ${endpoint}]:`, error.message);
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

  // --- ADMIN ---
  admin: {
    getUsers: () => request("/admin/users"),
    deleteUser: (id) => request(`/admin/users/${id}`, { method: "DELETE" }),
    getTeams: () => request("/admin/teams"),
    deleteTeam: (id) => request(`/admin/teams/${id}`, { method: "DELETE" }),
    getChallenges: () => request("/admin/challenges"),
    createChallenge: (data) =>
      request("/admin/challenges", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    updateChallenge: (id, data) =>
      request(`/admin/challenges/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
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
