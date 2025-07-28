import type { RequestHandler } from "express";
import { z } from "zod";

const userSchema = z.object({
  firstname: z
    .string()
    .max(35, "Le prénom ne doit pas dépasser 35 caractères.")
    .optional(),
  lastname: z
    .string()
    .max(15, "Le nom ne doit pas dépasser 15 caractères.")
    .optional(),
  email: z.string().email("Email invalide.").optional(),
  birthdate: z
    .string()
    .refine(
      (dateStr) => {
        const date = new Date(dateStr);
        return date < new Date("2025-01-01");
      },
      {
        message: "La date de naissance doit être avant 2025.",
      },
    )
    .optional(),
  car_brand: z
    .string()
    .max(50, "La marque ne doit pas dépasser 50 caractères.")
    .optional(),
  car_template: z
    .string()
    .max(50, "Le modèle ne doit pas dépasser 50 caractères.")
    .optional(),
  car_socket: z
    .string()
    .max(20, "Le type de prise ne doit pas dépasser 20 caractères.")
    .optional(),
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
