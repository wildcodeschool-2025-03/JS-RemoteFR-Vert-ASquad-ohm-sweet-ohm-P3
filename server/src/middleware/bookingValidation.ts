import type { RequestHandler } from "express";
import { z } from "zod";

export const rowSchema = z.object({
  terminal_id: z.number({
    required_error: "Le terminal doit être choisi.",
  }),
  start_time: z.string().datetime({
    message: "Le format de l'heure de début est invalide.",
  }),
  end_time: z.string().datetime({
    message: "Le format de l'heure de fin est invalide.",
  }),
  user_id: z.number({
    required_error: "Vous devez être connecté pour faire une réservation.",
  }),
});

export const validateBooking: RequestHandler = async (req, res, next) => {
  try {
    await rowSchema.parseAsync(req.body);
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
