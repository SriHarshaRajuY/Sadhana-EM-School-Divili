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

export const schoolApi = {
  getAnnouncements: () => request("/api/announcements"),
  getEvents: () => request("/api/events"),
  getFaculty: () => request("/api/faculty"),
  getPrograms: () => request("/api/programs"),
  submitInquiry: (data) =>
    request("/api/inquiries", {
      method: "POST",
      body: JSON.stringify(data)
    })
};

