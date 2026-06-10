const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");

const request = async (path, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(payload?.error?.message || "Request failed.");
    error.details = payload?.error?.details;
    throw error;
  }

  return payload.data ?? payload;
};

const authHeader = (token) => (token ? { Authorization: `Bearer ${token}` } : {});

export const schoolApi = {
  adminLogin: (data) =>
    request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(data)
    }),
  createAnnouncement: (token, data) =>
    request("/api/announcements", {
      method: "POST",
      headers: authHeader(token),
      body: JSON.stringify(data)
    }),
  createEvent: (token, data) =>
    request("/api/events", {
      method: "POST",
      headers: authHeader(token),
      body: JSON.stringify(data)
    }),
  createFaculty: (token, data) =>
    request("/api/faculty", {
      method: "POST",
      headers: authHeader(token),
      body: JSON.stringify(data)
    }),
  createProgram: (token, data) =>
    request("/api/programs", {
      method: "POST",
      headers: authHeader(token),
      body: JSON.stringify(data)
    }),
  deleteAnnouncement: (token, id) =>
    request(`/api/announcements/${id}`, {
      method: "DELETE",
      headers: authHeader(token)
    }),
  deleteEvent: (token, id) =>
    request(`/api/events/${id}`, {
      method: "DELETE",
      headers: authHeader(token)
    }),
  deleteFaculty: (token, id) =>
    request(`/api/faculty/${id}`, {
      method: "DELETE",
      headers: authHeader(token)
    }),
  deleteProgram: (token, id) =>
    request(`/api/programs/${id}`, {
      method: "DELETE",
      headers: authHeader(token)
    }),
  getAnnouncements: () => request("/api/announcements"),
  getAdminAnnouncements: (token) => request("/api/admin/announcements", { headers: authHeader(token) }),
  getAdminEvents: (token) => request("/api/admin/events", { headers: authHeader(token) }),
  getAdminFaculty: (token) => request("/api/admin/faculty", { headers: authHeader(token) }),
  getAdminInquiries: (token) => request("/api/admin/inquiries", { headers: authHeader(token) }),
  getAdminPrograms: (token) => request("/api/admin/programs", { headers: authHeader(token) }),
  getEvents: () => request("/api/events"),
  getFaculty: () => request("/api/faculty"),
  getPrograms: () => request("/api/programs"),
  submitInquiry: (data) =>
    request("/api/inquiries", {
      method: "POST",
      body: JSON.stringify(data)
    }),
  updateAnnouncement: (token, id, data) =>
    request(`/api/announcements/${id}`, {
      method: "PATCH",
      headers: authHeader(token),
      body: JSON.stringify(data)
    }),
  updateEvent: (token, id, data) =>
    request(`/api/events/${id}`, {
      method: "PATCH",
      headers: authHeader(token),
      body: JSON.stringify(data)
    }),
  updateFaculty: (token, id, data) =>
    request(`/api/faculty/${id}`, {
      method: "PATCH",
      headers: authHeader(token),
      body: JSON.stringify(data)
    }),
  updateInquiryStatus: (token, id, data) =>
    request(`/api/inquiries/${id}/status`, {
      method: "PATCH",
      headers: authHeader(token),
      body: JSON.stringify(data)
    }),
  updateProgram: (token, id, data) =>
    request(`/api/programs/${id}`, {
      method: "PATCH",
      headers: authHeader(token),
      body: JSON.stringify(data)
    })
};
