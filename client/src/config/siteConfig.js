const trim = (value) => String(value || "").trim();

const phoneTel = trim(import.meta.env.VITE_SCHOOL_PHONE_TEL);
const whatsappUrl = trim(import.meta.env.VITE_SCHOOL_WHATSAPP_URL);

export const siteConfig = {
  campus: trim(import.meta.env.VITE_SCHOOL_CAMPUS),
  email: trim(import.meta.env.VITE_SCHOOL_EMAIL),
  officeHours: trim(import.meta.env.VITE_SCHOOL_OFFICE_HOURS),
  phoneDisplay: trim(import.meta.env.VITE_SCHOOL_PHONE_DISPLAY),
  phoneHref: phoneTel ? `tel:${phoneTel}` : "",
  whatsappHref: whatsappUrl
};

