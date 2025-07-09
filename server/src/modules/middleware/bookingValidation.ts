import type { RequestHandler } from "express";
import { z } from "zod";

export const rowSchema = z.object({
  terminal_id: z.number({
    required_error: "Le terminal doit être choisi.",
  }),
  start_time: z
    .string({
      required_error: "L'heure de début de réservation doit être renseignée",
    })
    .regex(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/),
  end_time: z
    .string({
      required_error:
        "L'heure de fin de votre réservation doit être renseignée.",
    })
    .regex(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/),
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
