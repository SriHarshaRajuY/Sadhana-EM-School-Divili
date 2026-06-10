const { z } = require("zod");

const objectIdSchema = z.object({
  id: z.string().regex(/^[a-fA-F0-9]{24}$/, "Expected a valid MongoDB object id.")
});

const optionalString = (max = 500) =>
  z.preprocess(
    (value) => (value === "" ? undefined : value),
    z.string().trim().max(max).optional()
  );

const optionalEmail = z.preprocess(
  (value) => (value === "" ? undefined : value),
  z.string().trim().email().optional()
);

const optionalUrl = z.preprocess(
  (value) => (value === "" ? undefined : value),
  z.string().trim().url().max(600).optional()
);

const requestBoolean = (defaultValue) =>
  z.preprocess((value) => {
    if (value === undefined || value === "") {
      return undefined;
    }

    if (typeof value === "string") {
      const normalized = value.trim().toLowerCase();
      if (["true", "1", "yes"].includes(normalized)) {
        return true;
      }
      if (["false", "0", "no"].includes(normalized)) {
        return false;
      }
    }

    return value;
  }, z.boolean().default(defaultValue));

const nonEmptyUpdate = (schema) =>
  schema.partial().refine((value) => Object.keys(value).length > 0, {
    message: "At least one field is required."
  });

const authLoginSchema = z
  .object({
    username: z.string().trim().min(3).max(120),
    password: z.string().min(10).max(200)
  })
  .strict();

const announcementBaseSchema = z.object({
  title: z.string().trim().min(3).max(180),
  body: z.string().trim().min(3).max(1200),
  category: optionalString(80),
  priority: z.coerce.number().int().min(0).max(10).default(0),
  isPublished: requestBoolean(true),
  publishedAt: z.coerce.date().optional(),
  expiresAt: z.coerce.date().optional()
}).strict();

const validateAnnouncementDates = (value, context) => {
  if (value.publishedAt && value.expiresAt && value.expiresAt <= value.publishedAt) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Expiry date must be after the publish date.",
      path: ["expiresAt"]
    });
  }
};

const announcementCreateSchema = announcementBaseSchema.superRefine(validateAnnouncementDates);
const announcementUpdateSchema = nonEmptyUpdate(announcementBaseSchema).superRefine(validateAnnouncementDates);

const eventBaseSchema = z.object({
  title: z.string().trim().min(3).max(180),
  description: z.string().trim().min(3).max(1200),
  startsAt: z.coerce.date(),
  endsAt: z.coerce.date().optional(),
  location: optionalString(180),
  category: optionalString(80),
  imageUrl: optionalUrl,
  imagePublicId: optionalString(220),
  isPublished: requestBoolean(true)
}).strict();

const validateEventDates = (value, context) => {
  if (value.endsAt && value.endsAt <= value.startsAt) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: "End date must be after the start date.",
      path: ["endsAt"]
    });
  }
};

const eventCreateSchema = eventBaseSchema.superRefine(validateEventDates);
const eventUpdateSchema = nonEmptyUpdate(eventBaseSchema).superRefine(validateEventDates);

const facultyCreateSchema = z.object({
  name: z.string().trim().min(2).max(140),
  role: z.string().trim().min(2).max(140),
  department: optionalString(120),
  qualifications: z.array(z.string().trim().min(1).max(120)).default([]),
  bio: optionalString(1200),
  email: optionalEmail,
  phone: optionalString(40),
  photoUrl: optionalUrl,
  photoPublicId: optionalString(220),
  order: z.coerce.number().int().min(0).default(0),
  isActive: requestBoolean(true)
}).strict();

const programCreateSchema = z.object({
  stage: z.string().trim().min(2).max(80),
  title: z.string().trim().min(2).max(140),
  description: z.string().trim().min(3).max(1200),
  grades: optionalString(120),
  highlights: z.array(z.string().trim().min(1).max(140)).default([]),
  order: z.coerce.number().int().min(0).default(0),
  isPublished: requestBoolean(true)
}).strict();

const inquiryCreateSchema = z.object({
  parentName: z.string().trim().min(2).max(120),
  phone: z
    .string()
    .trim()
    .min(7)
    .max(30)
    .regex(/^[0-9+\-\s()]+$/, "Enter a valid phone number."),
  classInterest: z.string().trim().min(2).max(80),
  message: z.string().trim().max(1200).optional().default(""),
  studentName: optionalString(120),
  email: optionalEmail,
  source: optionalString(80)
}).strict();

const inquiryStatusSchema = z.object({
  status: z.enum(["new", "contacted", "visit_scheduled", "admitted", "closed"]),
  notes: optionalString(1200)
}).strict();

const textPairSchema = z.object({
  label: optionalString(80),
  text: optionalString(300)
}).strict();

const valueItemSchema = z.object({
  label: optionalString(80),
  title: optionalString(180),
  body: optionalString(600)
}).strict();

const imagePanelSchema = z.object({
  variant: z.enum(["", "large", "classroom", "activity", "wide"]).optional().default(""),
  title: optionalString(180),
  description: optionalString(500),
  imageUrl: optionalUrl,
  imagePublicId: optionalString(220),
  isPublished: requestBoolean(true)
}).strict();

const facilityItemSchema = z.object({
  title: optionalString(180),
  description: optionalString(600)
}).strict();

const sectionTextSchema = z.object({
  kicker: optionalString(120),
  title: optionalString(240),
  body: optionalString(1000)
}).strict();

const siteContentSchema = z.object({
  school: z.object({
    name: optionalString(140),
    tagline: optionalString(180),
    footerTagline: optionalString(180)
  }).strict().optional(),
  topBanner: z.object({
    text: optionalString(300),
    admissionCtaLabel: optionalString(80)
  }).strict().optional(),
  hero: z.object({
    eyebrow: optionalString(120),
    title: optionalString(160),
    highlight: optionalString(180),
    copy: optionalString(700),
    primaryActionLabel: optionalString(80),
    secondaryActionLabel: optionalString(80),
    panels: z.array(imagePanelSchema).max(6).optional()
  }).strict().optional(),
  parentTrust: sectionTextSchema.extend({
    stats: z.array(textPairSchema).max(8).optional()
  }).strict().optional(),
  about: sectionTextSchema.extend({
    quote: optionalString(300),
    message: optionalString(800),
    attribution: optionalString(120),
    values: z.array(valueItemSchema).max(6).optional()
  }).strict().optional(),
  academics: sectionTextSchema.optional(),
  facilities: sectionTextSchema.extend({
    items: z.array(facilityItemSchema).max(12).optional()
  }).strict().optional(),
  admissions: sectionTextSchema.extend({
    primaryActionLabel: optionalString(80),
    secondaryActionLabel: optionalString(80),
    steps: z.array(textPairSchema).max(8).optional()
  }).strict().optional(),
  updates: sectionTextSchema.extend({
    noticeBoardTitle: optionalString(120)
  }).strict().optional(),
  gallery: sectionTextSchema.extend({
    items: z.array(imagePanelSchema).max(24).optional()
  }).strict().optional(),
  adminCopy: sectionTextSchema.optional(),
  contact: sectionTextSchema.extend({
    campus: optionalString(400),
    phoneDisplay: optionalString(80),
    phoneTel: optionalString(40),
    whatsappUrl: optionalUrl,
    email: optionalEmail,
    officeHours: optionalString(180),
    formTitle: optionalString(120),
    classOptions: z.array(z.string().trim().min(1).max(80)).max(20).optional()
  }).strict().optional()
}).strict();

module.exports = {
  announcementCreateSchema,
  announcementUpdateSchema,
  authLoginSchema,
  eventCreateSchema,
  eventUpdateSchema,
  facultyCreateSchema,
  facultyUpdateSchema: nonEmptyUpdate(facultyCreateSchema),
  inquiryCreateSchema,
  inquiryStatusSchema,
  objectIdSchema,
  programCreateSchema,
  programUpdateSchema: nonEmptyUpdate(programCreateSchema),
  siteContentSchema
};
