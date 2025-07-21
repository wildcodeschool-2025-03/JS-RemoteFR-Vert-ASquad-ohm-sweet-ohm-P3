import type { RequestHandler } from "express";
import { z } from "zod";

export const reviewSchema = z.object({
  review: z
    .string()
    .min(1, "Le champ 'review' est requis.")
    .max(100, "Dépassement du nombre de caractères autorisé"),
  grade: z.number().min(1).max(5),
});

export const validateReview: RequestHandler = async (req, res, next) => {
  try {
    await reviewSchema.parseAsync(req.body);
    next();
  } catch (err) {
    if (err instanceof z.ZodError) {
      const errors = err.errors.map((e) => ({
        path: e.path.join("."),
        message: e.message,
      }));
      void res
        .status(422)
        .json({ message: "Erreur de validation des données", errors });
      return;
    }
    next(err);
  }
};
