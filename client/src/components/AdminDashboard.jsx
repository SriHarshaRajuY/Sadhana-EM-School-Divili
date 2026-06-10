import { useEffect, useMemo, useState } from "react";
import { schoolApi } from "../api/schoolApi";
import { defaultSiteContent, mergeSiteContent } from "../data/defaultSiteContent";

const ADMIN_TOKEN_KEY = "sadhana_admin_token";

const RESOURCE_CONFIG = {
  announcements: {
    label: "Announcements",
    singularLabel: "Announcement",
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
      { name: "body", label: "Notice Body", type: "textarea", required: true, wide: true },
      { name: "category", label: "Category", type: "text" },
      { name: "priority", label: "Priority", type: "number" },
      { name: "publishedAt", label: "Publish Date", type: "datetime-local", wide: true },
      { name: "expiresAt", label: "Expiry Date", type: "datetime-local", wide: true },
      { name: "isPublished", label: "Published", type: "checkbox" }
    ]
  },
  events: {
    label: "Events",
    singularLabel: "Event",
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
      imagePublicId: "",
      isPublished: true
    },
    fields: [
      { name: "title", label: "Title", type: "text", required: true, wide: true },
      { name: "description", label: "Description", type: "textarea", required: true, wide: true },
      { name: "startsAt", label: "Start Date", type: "datetime-local", required: true, wide: true },
      { name: "endsAt", label: "End Date", type: "datetime-local", wide: true },
      { name: "location", label: "Location", type: "text" },
      { name: "category", label: "Category", type: "text" },
      { name: "imageUrl", label: "Image URL", type: "url", wide: true },
      { name: "isPublished", label: "Published", type: "checkbox" }
    ]
  },
  faculty: {
    label: "Faculty",
    singularLabel: "Faculty Profile",
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
      photoPublicId: "",
      order: 0,
      isActive: true
    },
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "role", label: "Role", type: "text", required: true },
      { name: "department", label: "Department", type: "text" },
      { name: "qualifications", label: "Qualifications", type: "textarea", wide: true },
      { name: "bio", label: "Bio", type: "textarea", wide: true },
      { name: "email", label: "Email", type: "email" },
      { name: "phone", label: "Phone", type: "tel" },
      { name: "photoUrl", label: "Photo URL", type: "url", wide: true },
      { name: "order", label: "Display Order", type: "number" },
      { name: "isActive", label: "Active", type: "checkbox" }
    ]
  },
  programs: {
    label: "Programs",
    singularLabel: "Program",
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
      { name: "description", label: "Description", type: "textarea", required: true, wide: true },
      { name: "grades", label: "Grades", type: "text" },
      { name: "highlights", label: "Highlights", type: "textarea", wide: true },
      { name: "order", label: "Display Order", type: "number" },
      { name: "isPublished", label: "Published", type: "checkbox" }
    ]
  }
};

const RESOURCE_KEYS = Object.keys(RESOURCE_CONFIG);

const SITE_FIELD_GROUPS = [
  {
    title: "Brand & Banner",
    fields: [
      { path: "school.name", label: "School Name", type: "text" },
      { path: "school.tagline", label: "Header Tagline", type: "text" },
      { path: "school.footerTagline", label: "Footer Tagline", type: "text" },
      { path: "topBanner.text", label: "Top Banner Text", type: "textarea" },
      { path: "topBanner.admissionCtaLabel", label: "Banner CTA Label", type: "text" }
    ]
  },
  {
    title: "Hero",
    fields: [
      { path: "hero.eyebrow", label: "Eyebrow", type: "text" },
      { path: "hero.title", label: "Hero Title", type: "text" },
      { path: "hero.highlight", label: "Hero Highlight", type: "text" },
      { path: "hero.copy", label: "Hero Copy", type: "textarea" },
      { path: "hero.primaryActionLabel", label: "Primary Button", type: "text" },
      { path: "hero.secondaryActionLabel", label: "Secondary Button", type: "text" },
      { path: "hero.panels", label: "Hero Panels", type: "textarea", uploadContext: "hero" }
    ]
  },
  {
    title: "Parent Trust & About",
    fields: [
      { path: "parentTrust.kicker", label: "Stats Kicker", type: "text" },
      { path: "parentTrust.title", label: "Stats Title", type: "textarea" },
      { path: "parentTrust.body", label: "Stats Body", type: "textarea" },
      { path: "parentTrust.stats", label: "Stats", type: "textarea" },
      { path: "about.quote", label: "Principal Quote", type: "textarea" },
      { path: "about.message", label: "Principal Message", type: "textarea" },
      { path: "about.attribution", label: "Message Attribution", type: "text" },
      { path: "about.kicker", label: "About Kicker", type: "text" },
      { path: "about.title", label: "About Title", type: "textarea" },
      { path: "about.body", label: "About Body", type: "textarea" },
      { path: "about.values", label: "Values", type: "textarea" }
    ]
  },
  {
    title: "Academics, Facilities & Admissions",
    fields: [
      { path: "academics.kicker", label: "Academics Kicker", type: "text" },
      { path: "academics.title", label: "Academics Title", type: "textarea" },
      { path: "academics.body", label: "Academics Body", type: "textarea" },
      { path: "facilities.kicker", label: "Facilities Kicker", type: "text" },
      { path: "facilities.title", label: "Facilities Title", type: "textarea" },
      { path: "facilities.body", label: "Facilities Body", type: "textarea" },
      { path: "facilities.items", label: "Facilities", type: "textarea" },
      { path: "admissions.kicker", label: "Admissions Kicker", type: "text" },
      { path: "admissions.title", label: "Admissions Title", type: "textarea" },
      { path: "admissions.body", label: "Admissions Body", type: "textarea" },
      { path: "admissions.primaryActionLabel", label: "Admissions Primary Button", type: "text" },
      { path: "admissions.secondaryActionLabel", label: "Admissions Secondary Button", type: "text" },
      { path: "admissions.steps", label: "Admission Steps", type: "textarea" }
    ]
  },
  {
    title: "Updates, Gallery & Staff Portal Copy",
    fields: [
      { path: "updates.kicker", label: "Updates Kicker", type: "text" },
      { path: "updates.title", label: "Updates Title", type: "textarea" },
      { path: "updates.body", label: "Updates Body", type: "textarea" },
      { path: "updates.noticeBoardTitle", label: "Notice Board Title", type: "text" },
      { path: "gallery.kicker", label: "Gallery Kicker", type: "text" },
      { path: "gallery.title", label: "Gallery Title", type: "textarea" },
      { path: "gallery.body", label: "Gallery Body", type: "textarea" },
      { path: "gallery.items", label: "Gallery Items", type: "textarea", uploadContext: "gallery" },
      { path: "adminCopy.kicker", label: "Portal Kicker", type: "text" },
      { path: "adminCopy.title", label: "Portal Title", type: "textarea" },
      { path: "adminCopy.body", label: "Portal Body", type: "textarea" }
    ]
  },
  {
    title: "Contact & Enquiry Form",
    fields: [
      { path: "contact.kicker", label: "Contact Kicker", type: "text" },
      { path: "contact.title", label: "Contact Title", type: "textarea" },
      { path: "contact.body", label: "Contact Body", type: "textarea" },
      { path: "contact.campus", label: "Campus Address", type: "textarea" },
      { path: "contact.phoneDisplay", label: "Phone Display", type: "text" },
      { path: "contact.phoneTel", label: "Phone Tel Link", type: "tel" },
      { path: "contact.whatsappUrl", label: "WhatsApp URL", type: "url" },
      { path: "contact.email", label: "Email", type: "email" },
      { path: "contact.officeHours", label: "Office Hours", type: "text" },
      { path: "contact.formTitle", label: "Form Title", type: "text" },
      { path: "contact.classOptions", label: "Class Options", type: "textarea" }
    ]
  }
];

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

const getRecordLabel = (config) => (config.singularLabel || config.label).toLowerCase();

const formatDate = (value) => {
  if (!value) {
    return "Not set";
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Not set"
    : date.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
};

const getByPath = (object, path) =>
  path.split(".").reduce((value, key) => (value ? value[key] : undefined), object);

const setByPath = (object, path, value) => {
  const keys = path.split(".");
  const target = keys.slice(0, -1).reduce((current, key) => {
    if (!current[key] || typeof current[key] !== "object") {
      current[key] = {};
    }

    return current[key];
  }, object);

  target[keys[keys.length - 1]] = value;
};

const joinRecords = (items, keys) =>
  (items || [])
    .map((item) => keys.map((key) => item?.[key] || "").join(" | "))
    .join("\n");

const parseRecords = (value, keys) =>
  String(value || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const parts = line.split("|").map((part) => part.trim());
      return keys.reduce((record, key, index) => {
        record[key] = parts[index] || "";
        return record;
      }, {});
    });

const flattenSiteContent = (content) => {
  const merged = mergeSiteContent(defaultSiteContent, content);
  const draft = {};

  SITE_FIELD_GROUPS.flatMap((group) => group.fields).forEach((field) => {
    const value = getByPath(merged, field.path);

    if (field.path === "parentTrust.stats" || field.path === "admissions.steps") {
      draft[field.path] = joinRecords(value, ["label", "text"]);
      return;
    }

    if (field.path === "about.values") {
      draft[field.path] = joinRecords(value, ["label", "title", "body"]);
      return;
    }

    if (field.path === "hero.panels") {
      draft[field.path] = joinRecords(value, ["variant", "title", "description", "imageUrl", "imagePublicId"]);
      return;
    }

    if (field.path === "facilities.items") {
      draft[field.path] = joinRecords(value, ["title", "description"]);
      return;
    }

    if (field.path === "gallery.items") {
      draft[field.path] = joinRecords(value, ["variant", "title", "description", "imageUrl", "imagePublicId"]);
      return;
    }

    if (field.path === "contact.classOptions") {
      draft[field.path] = (value || []).join("\n");
      return;
    }

    draft[field.path] = value || "";
  });

  return draft;
};

const buildSiteContentFromDraft = (draft) => {
  const content = {};

  SITE_FIELD_GROUPS.flatMap((group) => group.fields).forEach((field) => {
    const value = draft[field.path] || "";

    if (field.path === "parentTrust.stats" || field.path === "admissions.steps") {
      setByPath(content, field.path, parseRecords(value, ["label", "text"]));
      return;
    }

    if (field.path === "about.values") {
      setByPath(content, field.path, parseRecords(value, ["label", "title", "body"]));
      return;
    }

    if (field.path === "hero.panels" || field.path === "gallery.items") {
      setByPath(
        content,
        field.path,
        parseRecords(value, ["variant", "title", "description", "imageUrl", "imagePublicId"]).map((item) => ({
          ...item,
          isPublished: true
        }))
      );
      return;
    }

    if (field.path === "facilities.items") {
      setByPath(content, field.path, parseRecords(value, ["title", "description"]));
      return;
    }

    if (field.path === "contact.classOptions") {
      setByPath(content, field.path, linesToArray(value));
      return;
    }

    setByPath(content, field.path, value);
  });

  return content;
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
  const [siteContent, setSiteContent] = useState(defaultSiteContent);
  const [siteDraft, setSiteDraft] = useState(() => flattenSiteContent(defaultSiteContent));
  const [inquiries, setInquiries] = useState([]);
  const [inquiryNotes, setInquiryNotes] = useState({});
  const [formData, setFormData] = useState(RESOURCE_CONFIG.announcements.defaults);
  const [editingId, setEditingId] = useState("");
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isBusy, setIsBusy] = useState(false);
  const [uploadingKey, setUploadingKey] = useState("");

  const config = RESOURCE_CONFIG[activeResource];
  const isSiteEditor = activeResource === "siteContent";

  const dashboardCounts = useMemo(
    () => ({
      announcements: records.announcements.length,
      events: records.events.length,
      faculty: records.faculty.length,
      programs: records.programs.length,
      inquiries: inquiries.length,
      siteContent: siteContent?._id ? 1 : 0
    }),
    [records, inquiries, siteContent]
  );

  const resetEditor = (resource = activeResource) => {
    setEditingId("");
    if (RESOURCE_CONFIG[resource]) {
      setFormData(RESOURCE_CONFIG[resource].defaults);
    }
  };

  const loadDashboard = async (adminToken = token) => {
    if (!adminToken) {
      return;
    }

    setIsBusy(true);
    setStatus({ type: "", message: "" });

    try {
      const [announcements, events, faculty, programs, inquiryList, siteContentRecord] = await Promise.all([
        schoolApi.getAdminAnnouncements(adminToken),
        schoolApi.getAdminEvents(adminToken),
        schoolApi.getAdminFaculty(adminToken),
        schoolApi.getAdminPrograms(adminToken),
        schoolApi.getAdminInquiries(adminToken),
        schoolApi.getSiteContent()
      ]);

      setRecords({
        announcements: announcements || [],
        events: events || [],
        faculty: faculty || [],
        programs: programs || []
      });
      setInquiries(inquiryList || []);
      setInquiryNotes(
        (inquiryList || []).reduce((notes, inquiry) => {
          notes[inquiry._id] = inquiry.notes || "";
          return notes;
        }, {})
      );
      const mergedSiteContent = mergeSiteContent(defaultSiteContent, siteContentRecord || {});
      setSiteContent(siteContentRecord ? { ...mergedSiteContent, _id: siteContentRecord._id } : mergedSiteContent);
      setSiteDraft(flattenSiteContent(mergedSiteContent));
    } catch (error) {
      if (/token|auth|login|unauthorized/i.test(error.message)) {
        window.localStorage.removeItem(ADMIN_TOKEN_KEY);
        setToken("");
      }

      setStatus({
        type: "error",
        message: error.message || "Unable to load staff portal."
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

  const handleSiteFieldChange = (path, value) => {
    setSiteDraft((current) => ({ ...current, [path]: value }));
  };

  const handleRecordImageUpload = async (fieldName, file) => {
    if (!file) {
      return;
    }

    const key = `${activeResource}.${fieldName}`;
    setUploadingKey(key);
    setStatus({ type: "", message: "" });

    try {
      const image = await schoolApi.uploadImage(token, file, activeResource);
      const publicIdField = fieldName === "photoUrl" ? "photoPublicId" : "imagePublicId";
      setFormData((current) => ({
        ...current,
        [fieldName]: image.secureUrl,
        [publicIdField]: image.publicId
      }));
      setStatus({ type: "success", message: "Image uploaded successfully." });
    } catch (error) {
      setStatus({ type: "error", message: error.message || "Unable to upload image." });
    } finally {
      setUploadingKey("");
    }
  };

  const handleSiteImageUpload = async (field, file) => {
    if (!file) {
      return;
    }

    setUploadingKey(field.path);
    setStatus({ type: "", message: "" });

    try {
      const image = await schoolApi.uploadImage(token, file, field.uploadContext || "site-content");
      const nextLine = `${field.uploadContext === "gallery" ? "" : "classroom"} | ${file.name.replace(/\.[^.]+$/, "")} | Add caption here | ${image.secureUrl} | ${image.publicId}`;
      setSiteDraft((current) => ({
        ...current,
        [field.path]: [current[field.path], nextLine].filter(Boolean).join("\n")
      }));
      setStatus({ type: "success", message: "Image uploaded and added to the website editor." });
    } catch (error) {
      setStatus({ type: "error", message: error.message || "Unable to upload image." });
    } finally {
      setUploadingKey("");
    }
  };

  const handleSiteContentSubmit = async (event) => {
    event.preventDefault();

    setIsBusy(true);
    setStatus({ type: "", message: "" });

    try {
      const saved = await schoolApi.updateSiteContent(token, buildSiteContentFromDraft(siteDraft));
      const mergedSiteContent = mergeSiteContent(defaultSiteContent, saved || {});
      setSiteContent(saved ? { ...mergedSiteContent, _id: saved._id } : mergedSiteContent);
      setSiteDraft(flattenSiteContent(mergedSiteContent));
      setStatus({ type: "success", message: "Website content updated successfully." });
    } catch (error) {
      setStatus({ type: "error", message: error.message || "Unable to save website content." });
    } finally {
      setIsBusy(false);
    }
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
        message: `${config.singularLabel || config.label} ${editingId ? "updated" : "created"} successfully.`
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
      setStatus({ type: "success", message: `${config.singularLabel || config.label} deleted.` });
    } catch (error) {
      setStatus({ type: "error", message: error.message || "Unable to delete record." });
    } finally {
      setIsBusy(false);
    }
  };

  const handleInquiryStatus = async (inquiry, statusValue = inquiry.status) => {
    setIsBusy(true);
    setStatus({ type: "", message: "" });

    try {
      await schoolApi.updateInquiryStatus(token, inquiry._id, {
        status: statusValue,
        notes: inquiryNotes[inquiry._id] || ""
      });
      await loadDashboard();
      setStatus({ type: "success", message: "Inquiry follow-up updated." });
    } catch (error) {
      setStatus({ type: "error", message: error.message || "Unable to update inquiry." });
    } finally {
      setIsBusy(false);
    }
  };

  const handleDeleteInquiry = async (inquiry) => {
    const confirmed = window.confirm(`Delete enquiry from "${inquiry.parentName}"? This cannot be undone.`);
    if (!confirmed) {
      return;
    }

    setIsBusy(true);
    setStatus({ type: "", message: "" });

    try {
      await schoolApi.deleteInquiry(token, inquiry._id);
      await loadDashboard();
      setStatus({ type: "success", message: "Inquiry deleted." });
    } catch (error) {
      setStatus({ type: "error", message: error.message || "Unable to delete inquiry." });
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
        <label className={`admin-field ${field.wide ? "wide" : ""}`} key={field.name}>
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
      <label className={`admin-field ${field.wide ? "wide" : ""}`} key={field.name}>
        <span>{field.label}</span>
        <input
          type={field.type}
          value={formData[field.name] || ""}
          required={field.required}
          onChange={(event) => handleFieldChange(field.name, event.target.value)}
        />
        {field.type === "url" && /image|photo/i.test(field.name) ? (
          <div className="admin-upload">
            {formData[field.name] ? (
              <img src={formData[field.name]} alt={`${field.label} preview`} />
            ) : null}
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              onChange={(event) => handleRecordImageUpload(field.name, event.target.files?.[0])}
            />
            <small>{uploadingKey === `${activeResource}.${field.name}` ? "Uploading..." : "Upload to Cloudinary"}</small>
          </div>
        ) : null}
      </label>
    );
  };

  const renderSiteField = (field) => (
    <label className={`admin-field ${field.type === "textarea" ? "wide" : ""}`} key={field.path}>
      <span>{field.label}</span>
      {field.type === "textarea" ? (
        <textarea
          value={siteDraft[field.path] || ""}
          onChange={(event) => handleSiteFieldChange(field.path, event.target.value)}
        />
      ) : (
        <input
          type={field.type}
          value={siteDraft[field.path] || ""}
          onChange={(event) => handleSiteFieldChange(field.path, event.target.value)}
        />
      )}
      {field.uploadContext ? (
        <div className="admin-upload inline-upload">
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            onChange={(event) => handleSiteImageUpload(field, event.target.files?.[0])}
          />
          <small>
            {uploadingKey === field.path
              ? "Uploading..."
              : "Upload image to Cloudinary and append a new line. Format: variant | title | caption | image URL | public ID"}
          </small>
        </div>
      ) : null}
    </label>
  );

  if (!token) {
    return (
      <div className="cms-screen admin-panel">
        <div className="cms-top">
          <div>
            <strong>Sadhana Staff Portal</strong>
            <span>Secure access for authorised school staff</span>
          </div>
          <span className="cms-pill">Staff Only</span>
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
          <strong>Sadhana Staff Portal</strong>
          <span>Manage verified school information, notices, events and admissions follow-up</span>
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

      <div className="admin-summary" aria-label="Staff portal record counts">
        <span>Website <b>{dashboardCounts.siteContent}</b></span>
        <span>Notices <b>{dashboardCounts.announcements}</b></span>
        <span>Events <b>{dashboardCounts.events}</b></span>
        <span>Faculty <b>{dashboardCounts.faculty}</b></span>
        <span>Programs <b>{dashboardCounts.programs}</b></span>
        <span>Enquiries <b>{dashboardCounts.inquiries}</b></span>
      </div>

      <div className="admin-tabs" role="tablist" aria-label="Staff portal sections">
        <button
          type="button"
          className={isSiteEditor ? "active" : ""}
          onClick={() => handleResourceChange("siteContent")}
        >
          Website
        </button>
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

      {isSiteEditor ? (
        <form className="admin-editor site-editor" onSubmit={handleSiteContentSubmit}>
          {SITE_FIELD_GROUPS.map((group) => (
            <section className="site-editor-group" key={group.title}>
              <div className="admin-editor-head">
                <strong>{group.title}</strong>
              </div>
              <div className="admin-form-grid">{group.fields.map(renderSiteField)}</div>
            </section>
          ))}
          <button className="button button-primary" type="submit" disabled={isBusy}>
            Save Website Content
          </button>
        </form>
      ) : (
        <div className="admin-workspace">
          <form className="admin-editor" onSubmit={handleSubmitRecord}>
            <div className="admin-editor-head">
              <strong>{editingId ? `Edit ${config.singularLabel || config.label}` : `New ${config.singularLabel || config.label}`}</strong>
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
              <div className="admin-empty">No {getRecordLabel(config)} records have been added yet.</div>
            )}
          </div>
        </div>
      )}

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
              <label className="admin-field inquiry-note">
                <span>Follow-up Notes</span>
                <textarea
                  value={inquiryNotes[inquiry._id] || ""}
                  onChange={(event) =>
                    setInquiryNotes((current) => ({ ...current, [inquiry._id]: event.target.value }))
                  }
                />
              </label>
              <div className="admin-record-actions">
                <button type="button" onClick={() => handleInquiryStatus(inquiry)} disabled={isBusy}>
                  Save
                </button>
                <button type="button" className="danger" onClick={() => handleDeleteInquiry(inquiry)} disabled={isBusy}>
                  Delete
                </button>
              </div>
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
