import type { RequestHandler } from "express";
import { z } from "zod";

const userSchema = z.object({
  firstname: z
    .string()
    .max(15, "Le prénom ne doit pas dépasser 15 caractères."),
  lastname: z.string().max(15, "Le nom ne doit pas dépasser 15 caractères."),
  email: z.string().email("Email invalide."),
  birthdate: z.string().refine(
    (dateStr) => {
      const date = new Date(dateStr);
      return date < new Date("2025-01-01");
    },
    {
      message: "La date de naissance doit être avant 2025.",
    },
  ),
});

export const validateUserUpdate: RequestHandler = async (req, res, next) => {
  try {
    await userSchema.parseAsync(req.body);
    next();
  } catch (err) {
    if (err instanceof z.ZodError) {
      const errors = err.errors.map((e) => ({
        path: e.path.join("."),
        message: e.message,
      }));
      res
        .status(422)
        .json({ message: "Erreur de validation des données", errors });
      return;
    }
    next(err);
  }
};
