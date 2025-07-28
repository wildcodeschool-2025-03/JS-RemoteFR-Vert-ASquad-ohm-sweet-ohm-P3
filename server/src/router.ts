import express from "express";

const router = express.Router();

/* ************************************************************************* */
// Define Your API Routes Here
/* ************************************************************************* */

// Define item-related routes
import itemActions from "./modules/item/itemActions";
import reviewActions from "./modules/review/reviewActions";

router.get("/api/items", itemActions.browse);
router.get("/api/items/:id", itemActions.read);
router.post("/api/items", itemActions.add);

/* ************************************************************************* */
import { validateReview } from "./middleware/reviewValidation";

router.get("/api/review", reviewActions.browse);
router.get("/api/review/:id", reviewActions.read);
router.post("/api/review/", authMiddleware, validateReview, reviewActions.add);

/* ************************************************************************* */

import authMiddleware from "./middleware/authMiddleware";
import connectedMiddleware from "./middleware/connectedMiddleware";
import authActions from "./modules/auth/authAction";
import userActions from "./modules/user/userActions";

router.get("/api/users", userActions.browse);
router.get("/api/users/:id", userActions.read);
router.post("/api/login", authActions.login);
router.get("/api/me", authMiddleware, connectedMiddleware.connected);
router.post("/api/logout", authActions.logout);
router.post("/api/users", authActions.hashPassword, userActions.add);
router.put(
  "/api/users/:id",
  authMiddleware,
  validateUserUpdate,
  userActions.update,
);
/* ************************************************************************* */
import terminalAction from "./modules/terminal/terminalAction";

router.get("/api/terminals", terminalAction.browse);
router.get("/api/terminals/:id", terminalAction.read);

/* ************************************************************************* */

import brandAction from "./modules/vehicle/brand/brandAction";

router.get("/api/brands", brandAction.browse);

/* ************************************************************************* */

import templateAction from "./modules/vehicle/template/templateAction";

router.get("/api/brands/:brandId/templates", templateAction.browse);

/* ************************************************************************* */

import { validateBooking } from "./middleware/bookingValidation";

import bookingActions from "./modules/booking/bookingActions";

router.get("/api/bookings", bookingActions.browse);
router.post("/api/bookings", validateBooking, bookingActions.add);

import verifyToken from "./middleware/authMiddleware";
import { validateUserUpdate } from "./middleware/userValidation";
/* ************************************************************************* */
import formAction from "./modules/form/formAction";

router.post("/api/contactForm", formAction.sendMail);

export default router;
