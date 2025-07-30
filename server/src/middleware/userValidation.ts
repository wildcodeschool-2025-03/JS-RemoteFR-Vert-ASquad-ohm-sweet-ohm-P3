import type { RequestHandler } from "express";
import { z } from "zod";

const userSchema = z.object({
  firstname: z
    .string()
    .max(35, "Le prénom ne doit pas dépasser 35 caractères.")
    .or(z.literal("")), // accepte ""
  lastname: z
    .string()
    .max(15, "Le nom ne doit pas dépasser 15 caractères.")
    .or(z.literal("")),
  email: z.string().email("Email invalide.").or(z.literal("")),
  birthdate: z
    .string()
    .or(z.literal(""))
    .refine(
      (dateStr) => {
        if (!dateStr) return true;
        const date = new Date(dateStr);
        return date < new Date("2025-01-01");
      },
      {
        message: "La date de naissance doit être avant 2025.",
      },
    ),
  car_brand: z
    .string()
    .max(50, "La marque ne doit pas dépasser 50 caractères.")
    .or(z.literal("")),
  car_template: z
    .string()
    .max(50, "Le modèle ne doit pas dépasser 50 caractères.")
    .or(z.literal("")),
  car_socket: z
    .string()
    .max(20, "Le type de prise ne doit pas dépasser 20 caractères.")
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
      res.status(422).json({
        message: "Erreur de validation des données",
        errors,
      });
      return;
    }
    next(err);
  }
};
