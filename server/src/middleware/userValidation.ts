import type { RequestHandler } from "express";
import { z } from "zod";

const MIN_AGE = 18;

const userSchema = z.object({
  firstname: z
    .string()
    .max(35, "Le prénom ne doit pas dépasser 35 caractères.")
    .optional()
    .or(z.literal("")),
  lastname: z
    .string()
    .max(35, "Le nom ne doit pas dépasser 35 caractères.")
    .optional()
    .or(z.literal("")),
  email: z.string().email("Email invalide.").optional().or(z.literal("")),
  birthdate: z
    .string()
    .or(z.literal(""))
    .nullable()
    .refine(
      (dateStr) => {
        if (!dateStr) return true;
        const date = new Date(dateStr);
        const today = new Date();
        const minDate = new Date(
          today.getFullYear() - 18,
          today.getMonth(),
          today.getDate(),
        );
        return date <= minDate;
      },
      { message: "L'utilisateur doit avoir au moins 18 ans." },
    )
    .optional(),
  car_brand: z
    .string()
    .max(50, "La marque ne doit pas dépasser 50 caractères.")
    .optional()
    .or(z.literal("")),
  car_template: z
    .string()
    .max(50, "Le modèle ne doit pas dépasser 50 caractères.")
    .optional()
    .or(z.literal("")),
  car_socket: z
    .string()
    .max(20, "Le type de prise ne doit pas dépasser 20 caractères.")
    .optional()
    .or(z.literal("")),
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
      console.error("Erreur de validation (Zod):", errors);
      res.status(422).json({
        message: "Erreur de validation des données",
        errors,
      });
      return;
    }
    next(err);
  }
};
