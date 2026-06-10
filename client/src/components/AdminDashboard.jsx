import { useEffect, useMemo, useState } from "react";
import { schoolApi } from "../api/schoolApi";

const ADMIN_TOKEN_KEY = "sadhana_admin_token";

const RESOURCE_CONFIG = {
  announcements: {
    label: "Announcements",
    statusKey: "isPublished",
    list: schoolApi.getAdminAnnouncements,
    create: schoolApi.createAnnouncement,
    update: schoolApi.updateAnnouncement,
    delete: schoolApi.deleteAnnouncement,
    defaults: {
      title: "",
      body: "",
      category: "",
      priority: 0,
      isPublished: true,
      publishedAt: "",
      expiresAt: ""
    },
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "body", label: "Notice Body", type: "textarea", required: true },
      { name: "category", label: "Category", type: "text" },
      { name: "priority", label: "Priority", type: "number" },
      { name: "publishedAt", label: "Publish Date", type: "datetime-local" },
      { name: "expiresAt", label: "Expiry Date", type: "datetime-local" },
      { name: "isPublished", label: "Published", type: "checkbox" }
    ]
  },
  events: {
    label: "Events",
    statusKey: "isPublished",
    list: schoolApi.getAdminEvents,
    create: schoolApi.createEvent,
    update: schoolApi.updateEvent,
    delete: schoolApi.deleteEvent,
    defaults: {
      title: "",
      description: "",
      startsAt: "",
      endsAt: "",
      location: "",
      category: "",
      imageUrl: "",
      isPublished: true
    },
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "description", label: "Description", type: "textarea", required: true },
      { name: "startsAt", label: "Start Date", type: "datetime-local", required: true },
      { name: "endsAt", label: "End Date", type: "datetime-local" },
      { name: "location", label: "Location", type: "text" },
      { name: "category", label: "Category", type: "text" },
      { name: "imageUrl", label: "Image URL", type: "url" },
      { name: "isPublished", label: "Published", type: "checkbox" }
    ]
  },
  faculty: {
    label: "Faculty",
    statusKey: "isActive",
    list: schoolApi.getAdminFaculty,
    create: schoolApi.createFaculty,
    update: schoolApi.updateFaculty,
    delete: schoolApi.deleteFaculty,
    defaults: {
      name: "",
      role: "",
      department: "",
      qualifications: "",
      bio: "",
      email: "",
      phone: "",
      photoUrl: "",
      order: 0,
      isActive: true
    },
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "role", label: "Role", type: "text", required: true },
      { name: "department", label: "Department", type: "text" },
      { name: "qualifications", label: "Qualifications", type: "textarea" },
      { name: "bio", label: "Bio", type: "textarea" },
      { name: "email", label: "Email", type: "email" },
      { name: "phone", label: "Phone", type: "tel" },
      { name: "photoUrl", label: "Photo URL", type: "url" },
      { name: "order", label: "Display Order", type: "number" },
      { name: "isActive", label: "Active", type: "checkbox" }
    ]
  },
  programs: {
    label: "Programs",
    statusKey: "isPublished",
    list: schoolApi.getAdminPrograms,
    create: schoolApi.createProgram,
    update: schoolApi.updateProgram,
    delete: schoolApi.deleteProgram,
    defaults: {
      stage: "",
      title: "",
      description: "",
      grades: "",
      highlights: "",
      order: 0,
      isPublished: true
    },
    fields: [
      { name: "stage", label: "Stage", type: "text", required: true },
      { name: "title", label: "Title", type: "text", required: true },
      { name: "description", label: "Description", type: "textarea", required: true },
      { name: "grades", label: "Grades", type: "text" },
      { name: "highlights", label: "Highlights", type: "textarea" },
      { name: "order", label: "Display Order", type: "number" },
      { name: "isPublished", label: "Published", type: "checkbox" }
    ]
  }
};

const RESOURCE_KEYS = Object.keys(RESOURCE_CONFIG);

const toDateTimeInput = (value) => {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toISOString().slice(0, 16);
};

const toDatePayload = (value) => {
  if (!value) {
    return undefined;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
};

const toLines = (value) => (Array.isArray(value) ? value.join("\n") : value || "");

const linesToArray = (value) =>
  String(value || "")
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);

const cleanPayload = (payload) =>
  Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== "" && value !== undefined)
  );

const getDisplayName = (record) => record.title || record.name || record.parentName || "Untitled record";

const formatDate = (value) => {
  if (!value) {
    return "Not set";
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Not set"
    : date.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
};

function AdminDashboard() {
  const [token, setToken] = useState(() => window.localStorage.getItem(ADMIN_TOKEN_KEY) || "");
  const [activeResource, setActiveResource] = useState("announcements");
  const [records, setRecords] = useState({
    announcements: [],
    events: [],
    faculty: [],
    programs: []
  });
  const [inquiries, setInquiries] = useState([]);
  const [formData, setFormData] = useState(RESOURCE_CONFIG.announcements.defaults);
  const [editingId, setEditingId] = useState("");
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isBusy, setIsBusy] = useState(false);

  const config = RESOURCE_CONFIG[activeResource];

  const dashboardCounts = useMemo(
    () => ({
      announcements: records.announcements.length,
      events: records.events.length,
      faculty: records.faculty.length,
      programs: records.programs.length,
      inquiries: inquiries.length
    }),
    [records, inquiries]
  );

  const resetEditor = (resource = activeResource) => {
    setEditingId("");
    setFormData(RESOURCE_CONFIG[resource].defaults);
  };

  const loadDashboard = async (adminToken = token) => {
    if (!adminToken) {
      return;
    }

    setIsBusy(true);
    setStatus({ type: "", message: "" });

    try {
      const [announcements, events, faculty, programs, inquiryList] = await Promise.all([
        schoolApi.getAdminAnnouncements(adminToken),
        schoolApi.getAdminEvents(adminToken),
        schoolApi.getAdminFaculty(adminToken),
        schoolApi.getAdminPrograms(adminToken),
        schoolApi.getAdminInquiries(adminToken)
      ]);

      setRecords({
        announcements: announcements || [],
        events: events || [],
        faculty: faculty || [],
        programs: programs || []
      });
      setInquiries(inquiryList || []);
    } catch (error) {
      if (/token|auth|login|unauthorized/i.test(error.message)) {
        window.localStorage.removeItem(ADMIN_TOKEN_KEY);
        setToken("");
      }

      setStatus({
        type: "error",
        message: error.message || "Unable to load admin dashboard."
      });
    } finally {
      setIsBusy(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, [token]);

  const handleLogin = async (event) => {
    event.preventDefault();

    setIsBusy(true);
    setStatus({ type: "", message: "" });

    try {
      const session = await schoolApi.adminLogin(loginData);
      window.localStorage.setItem(ADMIN_TOKEN_KEY, session.token);
      setToken(session.token);
      setLoginData({ username: "", password: "" });
      setStatus({ type: "success", message: "Signed in successfully." });
      await loadDashboard(session.token);
    } catch (error) {
      setStatus({ type: "error", message: error.message || "Unable to sign in." });
    } finally {
      setIsBusy(false);
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem(ADMIN_TOKEN_KEY);
    setToken("");
    resetEditor();
    setStatus({ type: "", message: "" });
  };

  const handleResourceChange = (resource) => {
    setActiveResource(resource);
    resetEditor(resource);
  };

  const handleFieldChange = (field, value) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const payloadForResource = () => {
    const payload = { ...formData };

    if (activeResource === "announcements") {
      payload.priority = Number(payload.priority || 0);
      payload.publishedAt = toDatePayload(payload.publishedAt);
      payload.expiresAt = toDatePayload(payload.expiresAt);
    }

    if (activeResource === "events") {
      payload.startsAt = toDatePayload(payload.startsAt);
      payload.endsAt = toDatePayload(payload.endsAt);
    }

    if (activeResource === "faculty") {
      payload.order = Number(payload.order || 0);
      payload.qualifications = linesToArray(payload.qualifications);
    }

    if (activeResource === "programs") {
      payload.order = Number(payload.order || 0);
      payload.highlights = linesToArray(payload.highlights);
    }

    return cleanPayload(payload);
  };

  const handleSubmitRecord = async (event) => {
    event.preventDefault();

    setIsBusy(true);
    setStatus({ type: "", message: "" });

    try {
      const payload = payloadForResource();
      if (editingId) {
        await config.update(token, editingId, payload);
      } else {
        await config.create(token, payload);
      }

      await loadDashboard();
      resetEditor();
      setStatus({
        type: "success",
        message: `${config.label} record ${editingId ? "updated" : "created"} successfully.`
      });
    } catch (error) {
      setStatus({ type: "error", message: error.message || "Unable to save record." });
    } finally {
      setIsBusy(false);
    }
  };

  const handleEditRecord = (record) => {
    const next = { ...config.defaults, ...record };

    if (activeResource === "announcements") {
      next.publishedAt = toDateTimeInput(record.publishedAt);
      next.expiresAt = toDateTimeInput(record.expiresAt);
    }

    if (activeResource === "events") {
      next.startsAt = toDateTimeInput(record.startsAt);
      next.endsAt = toDateTimeInput(record.endsAt);
    }

    if (activeResource === "faculty") {
      next.qualifications = toLines(record.qualifications);
    }

    if (activeResource === "programs") {
      next.highlights = toLines(record.highlights);
    }

    setEditingId(record._id);
    setFormData(next);
  };

  const handleToggleRecord = async (record) => {
    const statusKey = config.statusKey;

    setIsBusy(true);
    setStatus({ type: "", message: "" });

    try {
      await config.update(token, record._id, { [statusKey]: !record[statusKey] });
      await loadDashboard();
      setStatus({ type: "success", message: `${config.label} visibility updated.` });
    } catch (error) {
      setStatus({ type: "error", message: error.message || "Unable to update visibility." });
    } finally {
      setIsBusy(false);
    }
  };

  const handleDeleteRecord = async (record) => {
    const confirmed = window.confirm(`Delete "${getDisplayName(record)}"? This cannot be undone.`);
    if (!confirmed) {
      return;
    }

    setIsBusy(true);
    setStatus({ type: "", message: "" });

    try {
      await config.delete(token, record._id);
      await loadDashboard();
      resetEditor();
      setStatus({ type: "success", message: `${config.label} record deleted.` });
    } catch (error) {
      setStatus({ type: "error", message: error.message || "Unable to delete record." });
    } finally {
      setIsBusy(false);
    }
  };

  const handleInquiryStatus = async (inquiry, statusValue) => {
    setIsBusy(true);
    setStatus({ type: "", message: "" });

    try {
      await schoolApi.updateInquiryStatus(token, inquiry._id, { status: statusValue });
      await loadDashboard();
      setStatus({ type: "success", message: "Inquiry status updated." });
    } catch (error) {
      setStatus({ type: "error", message: error.message || "Unable to update inquiry." });
    } finally {
      setIsBusy(false);
    }
  };

  const renderField = (field) => {
    if (field.type === "checkbox") {
      return (
        <label className="admin-check" key={field.name}>
          <input
            type="checkbox"
            checked={Boolean(formData[field.name])}
            onChange={(event) => handleFieldChange(field.name, event.target.checked)}
          />
          <span>{field.label}</span>
        </label>
      );
    }

    if (field.type === "textarea") {
      return (
        <label className="admin-field" key={field.name}>
          <span>{field.label}</span>
          <textarea
            value={formData[field.name] || ""}
            required={field.required}
            onChange={(event) => handleFieldChange(field.name, event.target.value)}
          />
        </label>
      );
    }

    return (
      <label className="admin-field" key={field.name}>
        <span>{field.label}</span>
        <input
          type={field.type}
          value={formData[field.name] || ""}
          required={field.required}
          onChange={(event) => handleFieldChange(field.name, event.target.value)}
        />
      </label>
    );
  };

  if (!token) {
    return (
      <div className="cms-screen admin-panel">
        <div className="cms-top">
          <div>
            <strong>Sadhana CMS Admin</strong>
            <span>Secure sign-in for school staff content updates</span>
          </div>
          <span className="cms-pill">Protected</span>
        </div>

        <form className="admin-login" onSubmit={handleLogin}>
          <label className="admin-field">
            <span>Username</span>
            <input
              value={loginData.username}
              autoComplete="username"
              onChange={(event) => setLoginData((current) => ({ ...current, username: event.target.value }))}
              required
            />
          </label>
          <label className="admin-field">
            <span>Password</span>
            <input
              type="password"
              value={loginData.password}
              autoComplete="current-password"
              minLength="10"
              onChange={(event) => setLoginData((current) => ({ ...current, password: event.target.value }))}
              required
            />
          </label>
          {status.message ? <div className={`admin-status ${status.type}`}>{status.message}</div> : null}
          <button className="button button-primary" type="submit" disabled={isBusy}>
            {isBusy ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="cms-screen admin-panel">
      <div className="cms-top">
        <div>
          <strong>Sadhana CMS Admin</strong>
          <span>Manage public notices, events, staff, programs and admission enquiries</span>
        </div>
        <div className="cms-actions">
          <button className="cms-action" type="button" onClick={() => loadDashboard()} disabled={isBusy}>
            Refresh
          </button>
          <button className="cms-pill admin-logout" type="button" onClick={handleLogout}>
            Sign Out
          </button>
        </div>
      </div>

      <div className="admin-summary" aria-label="Admin record counts">
        <span>Notices <b>{dashboardCounts.announcements}</b></span>
        <span>Events <b>{dashboardCounts.events}</b></span>
        <span>Faculty <b>{dashboardCounts.faculty}</b></span>
        <span>Programs <b>{dashboardCounts.programs}</b></span>
        <span>Enquiries <b>{dashboardCounts.inquiries}</b></span>
      </div>

      <div className="admin-tabs" role="tablist" aria-label="CMS sections">
        {RESOURCE_KEYS.map((resource) => (
          <button
            key={resource}
            type="button"
            className={resource === activeResource ? "active" : ""}
            onClick={() => handleResourceChange(resource)}
          >
            {RESOURCE_CONFIG[resource].label}
          </button>
        ))}
      </div>

      {status.message ? <div className={`admin-status ${status.type}`}>{status.message}</div> : null}

      <div className="admin-workspace">
        <form className="admin-editor" onSubmit={handleSubmitRecord}>
          <div className="admin-editor-head">
            <strong>{editingId ? `Edit ${config.label}` : `New ${config.label}`}</strong>
            {editingId ? (
              <button type="button" className="text-button" onClick={() => resetEditor()}>
                New Record
              </button>
            ) : null}
          </div>
          <div className="admin-form-grid">{config.fields.map(renderField)}</div>
          <button className="button button-primary" type="submit" disabled={isBusy}>
            {editingId ? "Update Record" : "Create Record"}
          </button>
        </form>

        <div className="admin-records">
          {(records[activeResource] || []).length ? (
            records[activeResource].map((record) => (
              <article className="admin-record" key={record._id}>
                <div>
                  <strong>{getDisplayName(record)}</strong>
                  <span>
                    {activeResource === "events"
                      ? formatDate(record.startsAt)
                      : record.category || record.department || record.stage || "No category"}
                  </span>
                </div>
                <div className="admin-record-actions">
                  <button type="button" onClick={() => handleEditRecord(record)}>
                    Edit
                  </button>
                  <button type="button" onClick={() => handleToggleRecord(record)}>
                    {record[config.statusKey] ? "Hide" : "Show"}
                  </button>
                  <button type="button" className="danger" onClick={() => handleDeleteRecord(record)}>
                    Delete
                  </button>
                </div>
              </article>
            ))
          ) : (
            <div className="admin-empty">No {config.label.toLowerCase()} records have been added yet.</div>
          )}
        </div>
      </div>

      <div className="admin-inquiries">
        <div className="admin-editor-head">
          <strong>Admission Enquiries</strong>
          <span>{dashboardCounts.inquiries} total</span>
        </div>
        {inquiries.length ? (
          inquiries.map((inquiry) => (
            <article className="admin-inquiry" key={inquiry._id}>
              <div>
                <strong>{inquiry.parentName}</strong>
                <span>{inquiry.phone} | {inquiry.classInterest}</span>
                {inquiry.studentName || inquiry.email ? (
                  <small>{[inquiry.studentName, inquiry.email].filter(Boolean).join(" | ")}</small>
                ) : null}
                {inquiry.message ? <p>{inquiry.message}</p> : null}
              </div>
              <select
                value={inquiry.status}
                onChange={(event) => handleInquiryStatus(inquiry, event.target.value)}
                disabled={isBusy}
              >
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="visit_scheduled">Visit scheduled</option>
                <option value="admitted">Admitted</option>
                <option value="closed">Closed</option>
              </select>
            </article>
          ))
        ) : (
          <div className="admin-empty">No parent enquiries have been submitted yet.</div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
