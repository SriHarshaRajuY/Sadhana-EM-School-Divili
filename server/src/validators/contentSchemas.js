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
  programUpdateSchema: nonEmptyUpdate(programCreateSchema)
};
