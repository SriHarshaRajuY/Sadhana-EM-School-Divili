export const defaultSiteContent = {
  school: {
    name: "Sadhana School",
    tagline: "Learning. Values. Care.",
    footerTagline: "Quality education closer home"
  },
  topBanner: {
    text: "Admissions enquiry open for the new academic year. Quality learning, values and care closer to home.",
    admissionCtaLabel: "Admission Enquiry"
  },
  hero: {
    eyebrow: "Nearer school. Stronger future.",
    title: "Sadhana School",
    highlight: "brings quality education closer home.",
    copy: "A parent-friendly school experience built around strong basics, regular practice, English confidence, discipline and values at a feasible cost.",
    primaryActionLabel: "Start Admission Enquiry",
    secondaryActionLabel: "Explore Academics",
    panels: [
      {
        variant: "large",
        title: "Focused classroom learning",
        description: "Daily practice, teacher attention and clear academic routines."
      },
      {
        variant: "classroom",
        title: "Modern study support",
        description: "Corporate-style learning discipline for local students."
      },
      {
        variant: "activity",
        title: "Values with confidence",
        description: "Communication, manners, activities and care."
      }
    ]
  },
  parentTrust: {
    kicker: "Why parents choose Sadhana",
    title: "Marks matter. Distance matters. The right school nearby matters more.",
    body: "Families should not have to send children far away just to get serious academic support. Sadhana is positioned for local students who need strong learning with practical affordability.",
    stats: [
      { label: "01", text: "Nearby access for surrounding villages and towns" },
      { label: "02", text: "Strong basics with regular exam-focused practice" },
      { label: "03", text: "English, discipline and confidence building" },
      { label: "04", text: "Quality education with feasible fee planning" }
    ]
  },
  about: {
    quote: "\"A school should prepare children for marks, manners and real confidence.\"",
    message: "Sadhana School is designed for parents who want strong academics without losing the comfort, safety and cultural grounding of learning close to their native place.",
    attribution: "Principal's Message",
    kicker: "About Sadhana",
    title: "A calm, disciplined school for growing students with care.",
    body: "Sadhana serves families who want dependable academics, clear communication, disciplined routines and a caring school environment close to home.",
    values: [
      { label: "01", title: "Strong Basics", body: "Concept clarity, daily revision and steady academic habits from the early years." },
      { label: "02", title: "Parent Trust", body: "Clear communication, simple admission process and visible student progress." },
      { label: "03", title: "Whole Child", body: "Learning with values, confidence, communication and participation." }
    ]
  },
  academics: {
    kicker: "Academics",
    title: "Structured learning for every stage of school life.",
    body: "Class-wise learning, regular practice and clear academic guidance help parents understand how children are supported at each stage."
  },
  facilities: {
    kicker: "Facilities",
    title: "A school environment made for learning, safety and routine.",
    body: "Campus facilities are planned around everyday learning, student safety, healthy routines and the confidence children need beyond the classroom.",
    items: [
      { title: "Smart Classrooms", description: "Clean, organized spaces for daily teaching and interactive lessons." },
      { title: "Library & Reading", description: "Reading culture, story sessions and language growth for young learners." },
      { title: "Science & Computer Lab", description: "Practical exposure that helps students connect concepts with real use." },
      { title: "Safe Transport", description: "Better access for nearby villages and parents who need dependable travel." },
      { title: "Playground & Sports", description: "Sports, games and physical development alongside classroom learning." },
      { title: "Student Care", description: "Teacher attention, discipline, attendance follow-up and parent communication." }
    ]
  },
  admissions: {
    kicker: "Admissions",
    title: "Make the school decision simple for parents.",
    body: "Families can enquire, visit the campus, understand the fee structure and receive clear guidance for the right class before admission confirmation.",
    primaryActionLabel: "Book Campus Visit",
    secondaryActionLabel: "View Updates",
    steps: [
      { label: "Step 01", text: "Submit parent and student details." },
      { label: "Step 02", text: "Visit campus and understand fee structure." },
      { label: "Step 03", text: "Student interaction and class guidance." },
      { label: "Step 04", text: "Admission confirmation and orientation." }
    ]
  },
  updates: {
    kicker: "Events & Notices",
    title: "Latest school updates in one clear place.",
    body: "Parents can follow official notices, upcoming events, admission information and important school updates in one reliable place.",
    noticeBoardTitle: "Notice Board"
  },
  gallery: {
    kicker: "Gallery",
    title: "Moments from everyday school life.",
    body: "Photos from classrooms, celebrations, activities and campus life help families see the learning environment children experience every day.",
    items: []
  },
  adminCopy: {
    kicker: "School Office",
    title: "Verified information, maintained with care.",
    body: "The school team keeps notices, events, admissions follow-up, faculty details and academic information organized so families can rely on what is published here."
  },
  contact: {
    kicker: "Contact",
    title: "Speak to Sadhana School admissions.",
    body: "For admissions, campus visits and general school enquiries, parents can contact the school office or submit the enquiry form below.",
    campus: "",
    phoneDisplay: "",
    phoneTel: "",
    whatsappUrl: "",
    email: "",
    officeHours: "",
    formTitle: "Admission Enquiry",
    classOptions: ["Primary", "Middle School", "High School"]
  }
};

const isPlainObject = (value) =>
  Boolean(value) && typeof value === "object" && !Array.isArray(value);

const legacyTextReplacements = new Map([
  [
    "Sadhana is presented as a trusted school for rural and semi-urban families: simple admission information, clear academic positioning, facility highlights, events, notices, gallery and a staff-friendly content update model.",
    defaultSiteContent.about.body
  ],
  [
    "Academic program details are published from the school dashboard after they are verified by the office team.",
    defaultSiteContent.academics.body
  ],
  [
    "Facilities listed here should reflect verified campus services and can be refined after the school office confirms the final list.",
    defaultSiteContent.facilities.body
  ],
  [
    "Parents should immediately understand what Sadhana offers: serious study near home, feasible fee planning, values and regular academic follow-up.",
    defaultSiteContent.admissions.body
  ],
  [
    "Staff can update announcements, events, notices and admission updates from the protected admin panel.",
    defaultSiteContent.updates.body
  ],
  [
    "Show parents the real life of the school.",
    defaultSiteContent.gallery.title
  ],
  [
    "Official school images can be published here after the school office reviews and approves them.",
    defaultSiteContent.gallery.body
  ],
  ["CMS Plan", defaultSiteContent.adminCopy.kicker],
  [
    "Staff should update the website without calling a developer.",
    defaultSiteContent.adminCopy.title
  ],
  [
    "This protected dashboard connects directly to the MERN API for verified notices, events, faculty profiles, academic programs and admission enquiries.",
    defaultSiteContent.adminCopy.body
  ],
  [
    "Use this section for phone number, WhatsApp, address, map link and office timings. The enquiry form is designed for parent leads.",
    defaultSiteContent.contact.body
  ]
]);

const normalizeLegacyText = (value) => {
  if (typeof value !== "string") {
    return value;
  }

  return legacyTextReplacements.get(value.trim()) || value;
};

export const mergeSiteContent = (defaults, overrides) => {
  if (!isPlainObject(overrides)) {
    return defaults;
  }

  return Object.entries(defaults).reduce((merged, [key, defaultValue]) => {
    const overrideValue = overrides[key];

    if (Array.isArray(defaultValue)) {
      merged[key] = Array.isArray(overrideValue) ? overrideValue : defaultValue;
      return merged;
    }

    if (isPlainObject(defaultValue)) {
      merged[key] = mergeSiteContent(defaultValue, overrideValue);
      return merged;
    }

    merged[key] = normalizeLegacyText(overrideValue) ?? defaultValue;
    return merged;
  }, {});
};
