import { z } from "zod";

const uuidSchema = z.string().uuid();

const validateBody = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      message: "Validation failed",
      errors: result.error.flatten().fieldErrors,
    });
  }

  req.body = result.data;
  next();
};

export const validateGetPostsQuery = (req, res, next) => {
  const { guest_id } = req.query;

  if (guest_id !== undefined && !uuidSchema.safeParse(guest_id).success) {
    return res.status(400).json({
      message: "guest_id must be a valid UUID",
    });
  }

  next();
};

export const validateProjectIdParam = (req, res, next) => {
  if (!uuidSchema.safeParse(req.params.id).success) {
    return res.status(400).json({
      message: "Invalid project id",
    });
  }

  next();
};

export const validateAddComment = validateBody(
  z.object({
    guest_id: uuidSchema,
    content: z.string().trim().min(1, "content is required").max(2000),
  }),
);

export const validateLike = validateBody(
  z.object({
    guest_id: uuidSchema,
  }),
);
